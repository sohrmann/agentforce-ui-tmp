"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ChatPublisher from "./ChatPublisher";
import ChatMessage from "./ChatMessage";
import type { Message } from "@/chat/types";
import { sendStreamingMessage } from "@/chat/sse";
import { useChat } from "@/hooks/useChat";
import { ChunkValidator, type TextChunk, type ChunkValidationResult } from "@/chat/chunkValidator";

type Props = {
  welcomeMessage?: string;
  agentId?: string;
};

export default function ChatContainer({ welcomeMessage, agentId }: Props) {
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

  const handleResponse = async (response: boolean) => {
    // Add user's response to the message history
    addMessage("user", response ? "Yes" : "No", new Date().toISOString());
    
    // Add AI's acknowledgment from template
    const ackMessage = "Your tracking number is T381091234567890. Have a great day!";
    addMessage("ai", ackMessage, new Date().toISOString());

    // When yes, update the product and case to indicate fulfillment
    if (response) {
      try {
        // // Update the audit trail
        // await axios.post(`${clientEnv.NEXT_PUBLIC_EVENT_HUB_URL}/api/slack/vendor-audit-trail`, {
        //   text: getMessageTemplate('VENDOR_ACCEPTED_ASIN_ADJUSTMENTS', { caseId }),
        // })
      } catch (error) {
        console.error('Failed to update case:', error);
      }
    }
  };

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
    console.log('onSSEInform called with message:', message);
    console.log('hasAddedFinalMessage:', hasAddedFinalMessage);
    setAiTyping(false);
    
    // Only add the inform message if we haven't already added the final assembled message
    if (!hasAddedFinalMessage) {
      addMessage("ai", message, new Date().toISOString());
    } else {
      console.log('Skipping onSSEInform message because final message already added');
    }
  };
  
  const onSSEEndOfTurn = () => {
    console.log('onSSEEndOfTurn called');
    setAiTyping(false);
    
    // Final validation check
    const finalResult = chunkValidatorRef.current.getCurrentState();
    console.log('Final assembled text:', finalResult.assembledText);
    if (finalResult.hasGaps) {
      console.warn('Message completed with gaps:', finalResult.missingOffsets);
    }
    if (!finalResult.isComplete) {
      console.warn('Message may be incomplete');
    }
    
    // Add the final assembled message to the persistent messages array
    if (finalResult.assembledText && finalResult.assembledText.trim()) {
      console.log('Adding final assembled message to persistent array');
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
              { type, message, isTyping, aiStatus, timestamp, subtype },
              idx
            ) {
              return (
                <ChatMessage
                  key={idx}
                  type={type}
                  message={message}
                  aiStatus={aiStatus}
                  subtype={subtype}
                  isTyping={isTyping}
                  timestamp={timestamp}
                  handleResponse={handleResponse}
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