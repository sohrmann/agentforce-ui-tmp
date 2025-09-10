import type { Message } from "@/chat/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AgentforceLogo from "@/components/AgentforceLogo";
import HerokuIcon from "@/components/HerokuIcon";

export default function ChatMessage({
  type,
  message,
  aiStatus,
  isTyping,
}: Message) {
  
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
              <div className="text-xs text-gray-500 ml-2 max-w-xs">
                <div className="bg-gray-50 rounded-lg px-2 py-1 border">
                  {aiStatus}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 max-w-[85%] sm:max-w-[75%]">
            <div className="bg-white rounded-2xl rounded-tl-md shadow-sm border border-gray-100 px-4 py-3">
              <div className="text-sm text-gray-800 prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
                {isTyping && <span className="animate-pulse text-blue-500">●</span>}
              </div>
              {isTyping && aiStatus && aiStatus.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1">
                    {aiStatus}
                  </div>
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
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
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
