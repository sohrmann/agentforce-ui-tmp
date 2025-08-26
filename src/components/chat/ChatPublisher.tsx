"use client";
import { useState } from "react";

type Props = {
  onPostMessage: (message: string) => void;
};

export default function ChatPublisher({ onPostMessage }: Props) {
  const [message, setMessage] = useState("");

  const submitted = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim().length > 0) {
      onPostMessage(message.trim());
      setMessage("");
    }
  };

  const changed = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim().length > 0) {
        onPostMessage(message.trim());
        setMessage("");
      }
    }
  };

  const canSend = message.trim().length > 0;

  return (
    <form onSubmit={submitted} className="flex items-end gap-2 p-3 bg-white border-t pb-[max(12px,env(safe-area-inset-bottom))] md:pb-3 md:rounded-b-xl">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={changed}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          style={{
            minHeight: '44px',
            maxHeight: '120px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        />
        {/* Character count or other indicators could go here */}
      </div>
      
      <button
        type="submit"
        disabled={!canSend}
        className={`
          flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 rotate-45
          ${canSend 
            ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
        title="Send message"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
          />
        </svg>
      </button>
    </form>
  );
} 