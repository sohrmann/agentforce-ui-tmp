"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ChatPublisher from "./ChatPublisher";
import ChatMessage from "./ChatMessage";
import type { Message } from "@/chat/types";
import { sendStreamingMessage } from "@/chat/sse";
import { useChat } from "@/hooks/useChat";
import { ChunkValidator, type ChunkValidationResult } from "@/chat/chunkValidator";
import { clientEnv } from "@/config/client-env";

type Props = {
  welcomeMessage?: string;
  agentId?: string;
};

export default function ChatContainer({ agentId }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chunkValidatorRef = useRef<ChunkValidator>(new ChunkValidator());
  const [validationResult, setValidationResult] = useState<ChunkValidationResult>({
    isComplete: false,
    hasGaps: false,
    missingOffsets: [],
    duplicateOffsets: [],
    assembledText: '',
  });
  const [aiStatus, setAiStatus] = useState<string>("");
  const [informMessages, setInformMessages] = useState<string[]>([]);
  const [isAiTyping, setAiTyping] = useState<boolean>(false);
  const [hasAddedFinalMessage, setHasAddedFinalMessage] = useState<boolean>(false);
  const [processedUserMessage, setProcessedUserMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const userMessage = searchParams.get("message");
  const { messages, addMessage } = useChat();

  // Get the validated assembled text from the chunk validator
  const aiInput: string = useMemo(() => {
    return validationResult.assembledText;
  }, [validationResult]);

  useEffect(() => {
    // Only process if we have a new user message that hasn't been processed yet
    if (userMessage && userMessage !== processedUserMessage) {
      addMessage("user", userMessage, new Date().toISOString());
      handlePostMessage(userMessage, messages.length);
      setProcessedUserMessage(userMessage);
    }
  }, [userMessage, processedUserMessage, addMessage]);

  useEffect(() => {
    setAiStatus("");
  }, [aiInput]);

  useEffect(() => {
    // Reset validator when AI stops typing (new message starting)
    // But only if we've already added the final message to avoid losing data
    if (!isAiTyping && hasAddedFinalMessage) {
      chunkValidatorRef.current.reset();
      setValidationResult({
        isComplete: false,
        hasGaps: false,
        missingOffsets: [],
        duplicateOffsets: [],
        assembledText: '',
      });
      setHasAddedFinalMessage(false);
      setInformMessages([]); // Clear inform messages when conversation moves on
    }
  }, [isAiTyping, hasAddedFinalMessage]);

  const addChunk = (chunk: string, offset: number) => {
    const result = chunkValidatorRef.current.addChunk(chunk, offset);
    setValidationResult(result);
    
    // Log warnings for debugging
    if (result.hasGaps && result.missingOffsets.length > 0) {
      console.warn(`Chunk gaps detected at offsets: ${result.missingOffsets.join(', ')}`);
    }
    
    if (result.duplicateOffsets.length > 0) {
      console.warn(`Duplicate chunks at offsets: ${result.duplicateOffsets.join(', ')}`);
    }

    // Log diagnostics for debugging
    const diagnostics = chunkValidatorRef.current.getDiagnostics();
    console.debug('Chunk diagnostics:', diagnostics);
  };

  const onSSEProgressIndicator = (message: string) => {
    setAiStatus(message);
  };
  
  const onSSETextChunk = (chunk: string, offset: number) => {
    addChunk(chunk, offset);
  };
  
  const onSSEInform = (message: string) => {
    setAiTyping(false);
    
    // Always collect inform messages for display as status information
    setInformMessages(prev => [...prev, message]);
    
    // Only add the inform message as a separate chat message if enabled and we haven't already added the final assembled message.
    // Also ensure we prefer the assembled text over inform messages for consistency
    if (clientEnv.NEXT_PUBLIC_SF_PROCESS_INFORM_MESSAGES && !hasAddedFinalMessage && !validationResult.assembledText.trim()) {
      addMessage("ai", message, new Date().toISOString());
      setHasAddedFinalMessage(true);
    } else {
      console.debug('Collected inform message for status display:', message);
    }
  };
  
  const onSSEEndOfTurn = () => {
    setAiTyping(false);
    
    // Final validation check
    const finalResult = chunkValidatorRef.current.getCurrentState();
    if (finalResult.hasGaps) {
      console.warn('Message completed with gaps:', finalResult.missingOffsets);
    }
    
    // Add the final assembled message to the persistent messages array
    // Only add if we haven't already added a final message (prevents double messages)
    if (!hasAddedFinalMessage && finalResult.assembledText && finalResult.assembledText.trim()) {
      addMessage("ai", finalResult.assembledText, new Date().toISOString());
      setHasAddedFinalMessage(true);
    } else if (hasAddedFinalMessage) {
      console.debug('Skipping EndOfTurn message addition - final message already added');
    } else {
      console.debug('No assembled text available for EndOfTurn');
    }
    
    // Log final diagnostics
    console.debug('Final message diagnostics:', chunkValidatorRef.current.getDiagnostics());
  };

  const onSSEError = (error: string) => {
    console.error('SSE Error:', error);
    setAiTyping(false);
    
    // Always add user-friendly error message to chat
    const userFriendlyMessage = getUserFriendlyErrorMessage(error);
    addMessage("ai", `😳 ${userFriendlyMessage}`, new Date().toISOString());
  };

  // Helper function to convert technical errors to user-friendly messages
  const getUserFriendlyErrorMessage = (error: string): string => {
    // Check for common error patterns and return user-friendly messages
    if (error.includes('timeout') || error.includes('ECONNABORTED')) {
      return "The Agentforce API is taking longer than usual to respond. Please try again soon!";
    }
    
    // Default fallback message
    return "The Agentforce API is currently experiencing some issues. Please try again soon!";
  };

  const handlePostMessage = async (userMessage: string, sequenceId: number) => {
    setAiTyping(true);
    setHasAddedFinalMessage(false); // Reset flag when starting new message
    setInformMessages([]); // Clear previous inform messages
    
    // Reset chunk validator for new message
    chunkValidatorRef.current.reset();
    setValidationResult({
      isComplete: false,
      hasGaps: false,
      missingOffsets: [],
      duplicateOffsets: [],
      assembledText: '',
    });
    
    await sendStreamingMessage({
      userMessage,
      sequenceId,
      agentId,
      onSSEProgressIndicator,
      onSSETextChunk,
      onSSEInform,
      onSSEEndOfTurn,
      onSSEError,
    });
  };

  const postedMessage = async (message: string) => {
    addMessage("user", message, new Date().toISOString());
    handlePostMessage(message, messages.length);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping, aiInput]);

  const toShowMessages: Message[] = useMemo(() => {
    if (isAiTyping) {
      // Combine progress indicator and inform messages for status display
      const combinedStatus = [aiStatus, ...informMessages.slice(-2)] // Show last 2 inform messages
        .filter(Boolean)
        .join(" • ");
      
      return [
        ...messages,
        {
          type: "ai",
          message: aiInput,
          aiStatus: combinedStatus,
          isTyping: isAiTyping,
          timestamp: new Date().toISOString(),
        },
      ];
    } else {
      return messages;
    }
  }, [messages, isAiTyping, aiInput, aiStatus, informMessages]);

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-gray-50 rounded-xl">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4 pb-2">
            {toShowMessages.map(function (
              { type, message, isTyping, aiStatus, timestamp },
              idx
            ) {
              return (
                <ChatMessage
                  key={idx}
                  type={type}
                  message={message}
                  aiStatus={aiStatus}
                  isTyping={isTyping}
                  timestamp={timestamp}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input Area */}
        <div className="flex-shrink-0">
          <ChatPublisher onPostMessage={postedMessage} />
        </div>
      </div>
    </>
  );
}