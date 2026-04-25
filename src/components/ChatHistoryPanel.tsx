import type { ChatSummary } from "../types";

interface ChatHistoryPanelProps {
  chats: ChatSummary[];
  isLoading: boolean;
  isDeletingId: string | null;
  error: string | null;
  onContinue: (chatId: string) => void | Promise<void>;
  onDelete: (chatId: string) => void | Promise<void>;
}

const formatHistoryDate = (value: string) =>
  new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

export const ChatHistoryPanel = ({
  chats,
  isLoading,
  isDeletingId,
  error,
  onContinue,
  onDelete
}: ChatHistoryPanelProps) => (
  <section className="history-panel">
    <div className="history-panel__header">
      <div>
        <p className="signal-card__label">Your Chats</p>
        <h2>Resume previous conversations or delete the ones you no longer need.</h2>
      </div>
    </div>

    {error ? <p className="form-error">{error}</p> : null}

    {isLoading ? (
      <p className="history-panel__empty">Loading your chat history...</p>
    ) : chats.length === 0 ? (
      <p className="history-panel__empty">
        No previous chats yet. Start with a YouTube link above.
      </p>
    ) : (
      <div className="history-list">
        {chats.map((chat) => (
          <article className="history-card" key={chat.id}>
            <div className="history-card__content">
              <div className="history-card__meta">

                <span>{formatHistoryDate(chat.updatedAt)}</span>
              </div>
              <h3>{chat.title || chat.youtubeId}</h3>
              <p>Last active: {formatHistoryDate(chat.updatedAt)}</p>
            </div>
            <div className="history-card__actions">
              <button
                className="ghost-button"
                type="button"
                onClick={() => void onContinue(chat.id)}
              >
                Continue
              </button>
              <button
                className="danger-button"
                type="button"
                disabled={isDeletingId === chat.id}
                onClick={() => {
                  if (window.confirm("Delete this chat permanently?")) {
                    void onDelete(chat.id);
                  }
                }}
              >
                {isDeletingId === chat.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </div>
    )}
  </section>
);
