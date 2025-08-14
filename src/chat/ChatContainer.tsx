"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ChatPublisher from "./ChatPublisher";
import ChatMessage from "./ChatMessage";
import type { Message } from "./types";
import { sendStreamingMessage } from "./sse";
import { useChat } from "./ChatContext";
import { ChunkValidator, type TextChunk, type ChunkValidationResult } from "./chunkValidator";

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
  const [chunkWarnings, setChunkWarnings] = useState<string[]>([]);
  const [sseErrors, setSseErrors] = useState<string[]>([]);
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
    setChunkWarnings([]);
    
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
      setChunkWarnings([]);
    }
  }, [isAiTyping]);

  const addChunk = (chunk: string, offset: number) => {
    const result = chunkValidatorRef.current.addChunk(chunk, offset);
    setValidationResult(result);
    
    // Log warnings for debugging
    if (result.hasGaps && result.missingOffsets.length > 0) {
      const warning = `Chunk gaps detected at offsets: ${result.missingOffsets.join(', ')}`;
      console.warn(warning);
      setChunkWarnings(prev => [...prev.filter(w => !w.includes('gaps detected')), warning]);
    }
    
    if (result.duplicateOffsets.length > 0) {
      const warning = `Duplicate chunks at offsets: ${result.duplicateOffsets.join(', ')}`;
      console.warn(warning);
      setChunkWarnings(prev => [...prev.filter(w => !w.includes('Duplicate chunks')), warning]);
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
    addMessage("ai", message, new Date().toISOString());
  };
  
  const onSSEEndOfTurn = () => {
    setAiTyping(false);
    
    // Final validation check
    const finalResult = chunkValidatorRef.current.getCurrentState();
    if (finalResult.hasGaps) {
      console.warn('Message completed with gaps:', finalResult.missingOffsets);
    }
    if (!finalResult.isComplete) {
      console.warn('Message may be incomplete');
    }
    
    // Log final diagnostics
    console.debug('Final message diagnostics:', chunkValidatorRef.current.getDiagnostics());
  };

  const onSSEError = (error: string) => {
    console.error('SSE Error:', error);
    setSseErrors(prev => [...prev, error]);
    setAiTyping(false);
    
    // Add error message to chat in development
    if (process.env.NODE_ENV === 'development') {
      addMessage("ai", `⚠️ Streaming error: ${error}`, new Date().toISOString());
    }
  };

  const handlePostMessage = async (userMessage: string, sequenceId: number) => {
    setAiTyping(true);
    // Clear previous errors
    setSseErrors([]);
    
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
            {/* Show chunk validation warnings in development */}
            {process.env.NODE_ENV === 'development' && (chunkWarnings.length > 0 || sseErrors.length > 0) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                {chunkWarnings.length > 0 && (
                  <>
                    <div className="text-sm font-medium text-yellow-800 mb-1">Chunk Validation Warnings:</div>
                    {chunkWarnings.map((warning, idx) => (
                      <div key={idx} className="text-xs text-yellow-700">{warning}</div>
                    ))}
                  </>
                )}
                
                {sseErrors.length > 0 && (
                  <>
                    <div className="text-sm font-medium text-red-800 mb-1 mt-2">SSE Errors:</div>
                    {sseErrors.map((error, idx) => (
                      <div key={idx} className="text-xs text-red-700">{error}</div>
                    ))}
                  </>
                )}
              </div>
            )}
            
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
