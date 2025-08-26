"use client";
import { createContext } from "react";
import type { Message } from "@/chat/types";

export type ChatContextType = {
  isOpen: boolean;
  hasNotification: boolean;
  isExpanded: boolean;
  openChat: (expanded?: boolean) => void;
  closeChat: () => void;
  setExpanded: (expanded: boolean) => void;
  messages: Message[];
  addMessage: (type: "ai" | "user", message: string, timestamp: string, subtype?: "productBackfilled" | "chat") => void;
  sendMessage: (message: string) => void;
};

export const ChatContext = createContext<ChatContextType | null>(null);
