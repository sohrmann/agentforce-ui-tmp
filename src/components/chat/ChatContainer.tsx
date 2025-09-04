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
  const [isAiTyping, setAiTyping] = useState<boolean>(false);
  const [hasAddedFinalMessage, setHasAddedFinalMessage] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const userMessage = searchParams.get("message");
  const { messages, addMessage } = useChat();

  // Get the validated assembled text from the chunk validator
  const aiInput: string = useMemo(() => {
    return validationResult.assembledText;
  }, [validationResult]);

  useEffect(() => {
    // Reset chunk validator when starting new message
    chunkValidatorRef.current.reset();
    setValidationResult({
      isComplete: false,
      hasGaps: false,
      missingOffsets: [],
      duplicateOffsets: [],
      assembledText: '',
    });
    setHasAddedFinalMessage(false);
    
    if (userMessage) {
      addMessage("user", userMessage, new Date().toISOString());
      handlePostMessage(userMessage, messages.length);
    }
  }, [userMessage, messages.length, addMessage]);

  useEffect(() => {
    setAiStatus("");
  }, [aiInput]);

  useEffect(() => {
    // Reset validator when AI stops typing (new message starting)
    if (!isAiTyping) {
      chunkValidatorRef.current.reset();
      setValidationResult({
        isComplete: false,
        hasGaps: false,
        missingOffsets: [],
        duplicateOffsets: [],
        assembledText: '',
      });
      setHasAddedFinalMessage(false);
    }
  }, [isAiTyping]);

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
    
    // Only add the inform message if enabled and we haven't already added the final assembled message.
    if (clientEnv.NEXT_PUBLIC_SF_PROCESS_INFORM_MESSAGES && !hasAddedFinalMessage) {
      addMessage("ai", message, new Date().toISOString());
    } else {
      console.debug('Skipping onSSEInform message', message);
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
    if (finalResult.assembledText && finalResult.assembledText.trim()) {
      addMessage("ai", finalResult.assembledText, new Date().toISOString());
      setHasAddedFinalMessage(true);
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
      return [
        ...messages,
        {
          type: "ai",
          message: aiInput,
          aiStatus: aiStatus,
          isTyping: isAiTyping,
          timestamp: new Date().toISOString(),
        },
      ];
    } else {
      return messages;
    }
  }, [messages, isAiTyping, aiInput, aiStatus]);

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