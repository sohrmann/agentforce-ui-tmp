"use client";
import { useState, useRef, ReactNode, useEffect } from "react";
import type { Message } from "@/chat/types";
import { sendStreamingMessage } from "@/chat/sse";
import { ChatContext } from "./ChatContext";

type ChatProviderProps = {
  children: ReactNode;
  welcomeMessage: string;
};

export const ChatProvider = ({ children, welcomeMessage }: ChatProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasUserSentMessage, setHasUserSentMessage] = useState<boolean>(false);
  const [sequenceId, setSequenceId] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Use refs to maintain latest state in event listeners
  const messagesRef = useRef<Message[]>([]);
  const hasUserSentMessageRef = useRef<boolean>(false);

  // Update refs when state changes
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    hasUserSentMessageRef.current = hasUserSentMessage;
  }, [hasUserSentMessage]);

  const openChat = (expanded?: boolean) => {
    setIsOpen(true);
    setHasNotification(false);
    if (expanded !== undefined) {
      setIsExpanded(expanded);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const setExpanded = (expanded: boolean) => {
    setIsExpanded(expanded);
  };

  const addMessage = (type: "ai" | "user", message: string, timestamp: string, subtype?: "productBackfilled" | "chat") => {
    // If this is a user message, mark that the user has sent a message
    if (type === "user") {
      setHasUserSentMessage(true);
    }
    
    // If this is a product backfilled message and the chat is not open, set the notification flag
    if (subtype === "productBackfilled" && !isOpen) {
      setHasNotification(true);
    }
    
    setMessages(prev => {
      const newMessages = [
        ...prev,
        {
          type,
          message,
          timestamp,
          subtype,
        },
      ];
      return newMessages;
    });
  };

  const sendMessage = (message: string) => {
    // Add the user message to the chat
    const timestamp = new Date().toISOString();
    addMessage("user", message, timestamp);
    
    // Increment sequence ID for the next message
    const currentSequenceId = sequenceId;
    setSequenceId(prev => prev + 1);
    
    // Create a temporary message for the AI response
    const aiResponseTimestamp = new Date().toISOString();
    let aiResponseText = "";
    
    // Add an initial AI message with isTyping set to true
    addMessage("ai", "", aiResponseTimestamp, "chat");
    
    // Set isTyping to true for the last message
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.type === "ai" && lastMessage.timestamp === aiResponseTimestamp) {
        return [
          ...prev.slice(0, -1),
          {
            ...lastMessage,
            isTyping: true
          }
        ];
      }
      return prev;
    });
    
    // Send the message to the server
    sendStreamingMessage({
      userMessage: message,
      sequenceId: currentSequenceId,
      onSSEProgressIndicator: (message) => {
        console.debug("Progress indicator:", message);
      },
      onSSETextChunk: (message, offset) => {
        // Update the AI response text with the new chunk
        console.debug(offset);
        aiResponseText += message;
        
        // Update or add the AI message in the messages array
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          
          // If the last message is from the AI and it's the one we're updating
          if (lastMessage && lastMessage.type === "ai" && lastMessage.timestamp === aiResponseTimestamp) {
            // Update the existing message
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                message: aiResponseText,
                isTyping: true
              }
            ];
          } else {
            // Add a new AI message
            return [
              ...prev,
              {
                type: "ai",
                message: aiResponseText,
                timestamp: aiResponseTimestamp,
                subtype: "chat",
                isTyping: true
              }
            ];
          }
        });
      },
      onSSEInform: (message) => {
        console.debug("Inform:", message);
      },
      onSSEEndOfTurn: () => {
        // Update the AI message to remove the typing indicator
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          
          if (lastMessage && lastMessage.type === "ai" && lastMessage.timestamp === aiResponseTimestamp) {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                isTyping: false
              }
            ];
          }
          return prev;
        });
      }
    });
  };

  // Initialize messages with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        type: "ai",
        message: welcomeMessage,
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [welcomeMessage]);

  useEffect(() => {
    // Check for user messages whenever messages change
    const hasUserMessages = messages.some(msg => msg.type === "user");
    if (hasUserMessages) {
      setHasUserSentMessage(true);
    }
  }, [messages]);

  return (
    <ChatContext.Provider value={{ 
      isOpen, 
      hasNotification, 
      isExpanded,
      openChat, 
      closeChat, 
      setExpanded,
      messages, 
      addMessage,
      sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};
