import { useState } from "react";

interface MessageInputProps {
  isSending: boolean;
  onSend: (value: string) => Promise<void>;
}

export const MessageInput = ({ isSending, onSend }: MessageInputProps) => {
  const [value, setValue] = useState("");

  const submit = async () => {
    const trimmed = value.trim();
    if (!trimmed || isSending) {
      return;
    }

    setValue("");
    await onSend(trimmed);
  };

  return (
    <div className="composer">
      <textarea
        className="composer__textarea"
        rows={1}
        placeholder="Ask a question about the video..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void submit();
          }
        }}
        disabled={isSending}
      />
      <button className="composer__button" type="button" onClick={() => void submit()}>
        {isSending ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

