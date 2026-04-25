import type { Message } from "../types";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  onSend: (value: string) => Promise<void>;
}

export const ChatWindow = ({
  messages,
  isLoading,
  isSending,
  error,
  onSend
}: ChatWindowProps) => (
  <section className="chat-shell">
    <MessageList messages={messages} isLoading={isLoading} isSending={isSending} />
    {error ? <p className="form-error chat-shell__error">{error}</p> : null}
    <MessageInput isSending={isSending} onSend={onSend} />
  </section>
);

