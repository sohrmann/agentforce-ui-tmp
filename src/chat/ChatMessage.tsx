import type { Message } from "./types";
import ReactMarkdown from "react-markdown";
import AgentforceLogo from "@/components/AgentforceLogo";
import HerokuIcon from "@/components/HerokuIcon";

export default function ChatMessage({
  type,
  message,
  aiStatus,
  isTyping,
  subtype,
  handleResponse,
}: Message & { handleResponse: (response: boolean) => void }) {
  
  if (type === "ai") {
    return (
      <div className="flex gap-3 items-start">
        <div className="flex-shrink-0">
          <AgentforceLogo 
            size="small" 
            className="w-8 h-8 rounded-full" 
            alt="AI Assistant" 
          />
        </div>
        
        {isTyping && message.length === 0 ? (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center space-x-1 bg-gray-200 rounded-2xl px-4 py-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            {aiStatus && aiStatus.length > 0 && (
              <div className="text-xs text-gray-500 ml-2">
                {aiStatus}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 max-w-[85%] sm:max-w-[75%]">
            <div className="bg-white rounded-2xl rounded-tl-md shadow-sm border border-gray-100 px-4 py-3">
              <div className="text-sm text-gray-800 prose prose-sm max-w-none">
                <ReactMarkdown>{message}</ReactMarkdown>
                {isTyping && <span className="animate-pulse text-blue-500">●</span>}
              </div>
              
              {subtype === "productBackfilled" && handleResponse && (
                <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleResponse(true)}
                    className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors font-medium"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleResponse(false)}
                    className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors font-medium"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } else if (type === "user") {
    return (
      <div className="flex gap-3 items-start justify-end">
        <div className="flex-1 max-w-[85%] sm:max-w-[75%] flex justify-end">
          <div className="bg-blue-500 text-white rounded-2xl rounded-tr-md shadow-sm px-4 py-3">
            <div className="text-sm prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <HerokuIcon
              className=""
              width={20}
              height={20}
              alt="User"
            />
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}
