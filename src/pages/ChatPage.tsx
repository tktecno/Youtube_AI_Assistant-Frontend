import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { api, getApiErrorMessage } from "../api/client";
import { ChatWindow } from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";

export const ChatPage = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { user, signOut } = useAuth();
  const { messages, isLoading, isSending, error, sendMessage } = useChat(chatId);
  const [isManaging, setIsManaging] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const deleteCurrentChat = async () => {
    if (!chatId) {
      return;
    }

    setIsManaging(true);
    setActionError(null);

    try {
      await api.delete(`/chats/${chatId}`);
      navigate("/");
    } catch (deleteError) {
      setActionError(getApiErrorMessage(deleteError));
    } finally {
      setIsManaging(false);
    }
  };

  return (
    <main className="chat-page">
      <header className="chat-header">
        <div className="chat-header__title-group ">
          <Link to="/" className="back-button" aria-label="Back to home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div>
            <p className="chat-header__eyebrow">Teacher Culture</p>
            <h1>Grounded video chat</h1>
            <p className="chat-header__subcopy">{user?.email ?? "Authenticated user"}</p>
          </div>
        </div>
        <div className="chat-header__actions">
          <span className="status-pill">Private RAG session</span>

          <button
            className="danger-button"
            type="button"
            disabled={isManaging}
            onClick={() => {
              if (window.confirm("Delete this chat permanently?")) {
                void deleteCurrentChat();
              }
            }}
          >
            {isManaging ? "Working..." : "Delete"}
          </button>
          <button className="ghost-button" type="button" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </header>
      {actionError ? <p className="form-error">{actionError}</p> : null}
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        isSending={isSending}
        error={error}
        onSend={sendMessage}
      />
    </main>
  );
};
