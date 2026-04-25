import { useCallback, useEffect, useState } from "react";

import { api, getApiErrorMessage } from "../api/client";
import type { ChatListResponse, ChatSummary } from "../types";

export const useChatHistory = () => {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadChats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<ChatListResponse>("/chats");
      setChats(data.chats);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadChats();
  }, [loadChats]);


  const deleteChat = async (chatId: string) => {
    setIsDeletingId(chatId);
    setError(null);

    try {
      await api.delete(`/chats/${chatId}`);
      setChats((current) => current.filter((chat) => chat.id !== chatId));
      return true;
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError));
      return false;
    } finally {
      setIsDeletingId(null);
    }
  };

  return {
    chats,
    isLoading,
    isDeletingId,
    error,
    loadChats,
    deleteChat
  };
};
