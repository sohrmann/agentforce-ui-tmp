export type Message = {
  type: "ai" | "user";
  message: string;
  aiStatus?: string;
  isTyping?: boolean;
  timestamp: string;
  subtype?: "productBackfilled" | "chat";
  data?: {
    caseId?: string;
  };
};
