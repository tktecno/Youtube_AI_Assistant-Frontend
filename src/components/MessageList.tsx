import { useEffect, useRef } from "react";

import type { Message } from "../types";
import { LoadingState } from "./LoadingState";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
}

export const MessageList = ({
  messages,
  isLoading,
  isSending
}: MessageListProps) => {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  if (isLoading) {
    return (
      <div className="message-panel">
        <LoadingState label="Loading chat history..." />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="message-panel message-panel--empty">
        <p className="message-panel__eyebrow">Video ready</p>
        <h2>Ask about key ideas, examples, decisions, or timestamps.</h2>
        <p>
          Answers stay grounded in the transcript only. If the topic is not in the
          video, the assistant will say so.
        </p>
      </div>
    );
  }

  return (
    <div className="message-panel">
      {messages.map((message) => (
        <article
          key={message.id}
          className={`message-bubble message-bubble--${message.role} !bg-gray-300 `}
        >
          <header className="message-bubble__meta">
            <span>{message.role === "user" ? "You" : "Video AI"}</span>
            <time dateTime={message.created_at}>
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </time>
          </header>
          <p>{message.content}</p>
        </article>
      ))}
      {isSending ? <LoadingState label="Searching transcript and drafting answer..." /> : null}
      <div ref={endRef} />
    </div>
  );
};

