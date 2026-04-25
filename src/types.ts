export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  chat_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface ProcessVideoResponse {
  chatId: string;
  videoId: string;
  youtubeId: string;
  reusedProcessing: boolean;
  resumedExistingChat: boolean;
}

export interface ChatResponse {
  answer: string;
  sources: Array<{
    timeStamp: string;
    similarity: number;
  }>;
}

export interface ChatHistoryResponse {
  chatId: string;
  videoId: string;
  messages: Message[];
}

export interface ChatSummary {
  id: string;
  videoId: string;
  youtubeId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatListResponse {
  chats: ChatSummary[];
}
