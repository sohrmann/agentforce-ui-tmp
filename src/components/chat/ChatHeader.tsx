"use client";
import React from "react";
import HerokuIcon from "@/components/HerokuIcon";

interface ChatHeaderProps {
  displayName: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onClose: () => void;
}

export default function ChatHeader({ 
  displayName, 
  isExpanded, 
  onToggleExpanded, 
  onClose 
}: ChatHeaderProps) {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b bg-white/95 backdrop-blur-sm md:bg-white md:backdrop-blur-none md:rounded-t-xl">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <HerokuIcon width={24} height={24} alt={displayName} />
        <div className="min-w-0 flex-1">
          <h1 className="text-gray-900 truncate block text-xl font-medium">
            {displayName}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {/* Expand button - desktop only */}
        <button
          onClick={onToggleExpanded}
          className="hidden md:flex text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
          title={isExpanded ? "Minimize" : "Expand"}
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
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Close chat"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
