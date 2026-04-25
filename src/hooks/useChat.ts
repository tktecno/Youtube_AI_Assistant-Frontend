import { useEffect, useState } from "react";

import { api, getApiErrorMessage } from "../api/client";
import type { ChatHistoryResponse, Message } from "../types";

export const useChat = (chatId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadMessages = async () => {
      if (!chatId) {
        setError("Missing chat id.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {

        const { data } = await api.get<ChatHistoryResponse>(`/chats/${chatId}/messages`);
        if (!cancelled) {
          setMessages(data.messages);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getApiErrorMessage(loadError));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [chatId]);

  const sendMessage = async (query: string) => {
    if (!chatId) {
      return;
    }

    const optimisticUser: Message = {
      id: `temp-${Date.now()}`,
      chat_id: chatId,
      role: "user",
      content: query,
      created_at: new Date().toISOString()
    };

    setError(null);
    setMessages((current) => [...current, optimisticUser]);
    setIsSending(true);

    try {
      await api.post("/chat", {
        chat_id: chatId,
        query
      });

      const { data } = await api.get<ChatHistoryResponse>(`/chats/${chatId}/messages`);
      setMessages(data.messages);
    } catch (sendError) {
      setError(getApiErrorMessage(sendError));

      try {
        const { data } = await api.get<ChatHistoryResponse>(`/chats/${chatId}/messages`);
        setMessages(data.messages);
      } catch {
        setMessages((current) =>
          current.filter((message) => message.id !== optimisticUser.id)
        );
      }
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage
  };
};
