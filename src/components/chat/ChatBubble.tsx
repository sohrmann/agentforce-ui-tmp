"use client";
import React, { useState, useEffect } from "react";
import ChatContainer from "./ChatContainer";
import ChatHeader from "./ChatHeader";
import { useChat } from "@/hooks/useChat";
import AgentforceLogo from "@/components/AgentforceLogo";
import { clientEnv } from "@/config/client-env";

interface ChatBubbleProps {
  welcomeMessage: string;
  agentId?: string;
  agentName?: string;
}

export default function ChatBubble({
  welcomeMessage,
  agentId,
  agentName,
}: ChatBubbleProps) {
  const [viewportHeight, setViewportHeight] = useState(0);
  const { isOpen, hasNotification, isExpanded, openChat, closeChat, setExpanded } = useChat();

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  // Reset expanded state when chat is closed
  const handleClose = () => {
    setExpanded(false);
    // Might be a bug in AF around this. Use with caution.
    // endSession();
    closeChat();
  };

  const displayName = agentName || clientEnv.NEXT_PUBLIC_AGENT_NAME;

  return (
    <>
      {!isOpen ? (
        // Chat Bubble - Only show when chat is closed
        <div className="fixed bottom-4 right-4 z-[100]">
          <div className="relative">
            <button
              onClick={() => openChat()}
              className="bg-white rounded-full shadow-lg hover:shadow-xl w-14 h-14 flex items-center justify-center overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <AgentforceLogo size="medium" alt={`Chat with ${displayName}`} />
            </button>
            {hasNotification && (
              <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 border-2 border-white shadow-sm animate-pulse"></div>
            )}
          </div>
        </div>
      ) : (
        // Chat Interface - Single component with responsive behavior
        <div
          className={`
          fixed z-50 inset-0
          ${
            !isExpanded
              ? "md:w-1/3 md:inset-auto md:top-auto md:right-4 md:bottom-4 md:left-auto md:z-[100]"
              : "md:z-[200]"
          }
        `}
        >
          {/* Backdrop - only for desktop expanded */}
          {isExpanded && (
            <div 
              className="hidden md:block absolute inset-0 bg-black/20 backdrop-blur-sm cursor-pointer" 
              onClick={() => setExpanded(false)}
            />
          )}

          <div
            className={`
            bg-white flex flex-col shadow-2xl
            h-[100dvh] w-full
            md:h-auto md:w-auto
            ${
              isExpanded
                ? "md:max-w-4xl md:mx-auto md:rounded-xl md:relative md:top-1/2 md:-translate-y-1/2"
                : "md:w-[480px] md:rounded-xl"
            }
          `}
            style={viewportHeight > 0 ? {
              height: window.innerWidth >= 768 ? (
                isExpanded 
                  ? `${Math.min(viewportHeight * 0.75, viewportHeight - 32)}px`
                  : `${Math.min(viewportHeight * 0.6, viewportHeight - 32)}px`
              ) : '100dvh',
              maxHeight: window.innerWidth >= 768 ? `${viewportHeight - 32}px` : '100dvh'
            } : {}}
          >
            {/* Header */}
            <ChatHeader
              displayName={displayName}
              isExpanded={isExpanded}
              onToggleExpanded={() => setExpanded(!isExpanded)}
              onClose={handleClose}
            />

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              <ChatContainer
                welcomeMessage={welcomeMessage}
                agentId={agentId}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
