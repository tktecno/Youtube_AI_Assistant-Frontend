import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { api, getApiErrorMessage } from "../api/client";
import { ChatHistoryPanel } from "../components/ChatHistoryPanel";
import { UrlForm } from "../components/UrlForm";
import { useAuth } from "../context/AuthContext";
import { useChatHistory } from "../hooks/useChatHistory";
import type { ProcessVideoResponse } from "../types";

export const HomePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const {
    chats,
    isLoading: isHistoryLoading,
    isDeletingId,
    error: historyError,
    deleteChat
  } = useChatHistory();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.post<ProcessVideoResponse>("/process-video", { url });
      navigate(`/chat/${data.chatId}`);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="landing-page">
      <header className="page-topbar">
        <div>
          <p className="hero-panel__eyebrow">Signed in</p>
          <strong>{user?.email ?? "Authenticated user"}</strong>
        </div>
        <button className="ghost-button" type="button" onClick={() => void signOut()}>
          Sign out
        </button>
      </header>
      <section className="hero-panel">
        <p className="hero-panel__eyebrow">YouTube RAG SaaS</p>
        <h1>Chat with any YouTube video through grounded transcript retrieval.</h1>
        <p className="hero-panel__copy">
          Paste a video, build a dedicated knowledge index once, and keep asking
          follow-up questions in a focused session that stays anchored to the source.
        </p>
        <UrlForm
          url={url}
          isLoading={isLoading}
          error={error}
          onUrlChange={setUrl}
          onSubmit={handleSubmit}
        />
      </section>
      <aside className="signal-card">
        <div>
          <p className="signal-card__label">Pipeline</p>
          <h2>Transcript → Translation → Embeddings → Retrieval → Answer</h2>
        </div>
        <ul className="signal-list">
          <li>Deduplicated video processing with Supabase persistence</li>
          <li>Context retrieval filtered by video id with cosine similarity</li>
          <li>Chat memory from recent turns for follow-up questions</li>
          <li>Strict fallback when the answer is not present in the transcript</li>
        </ul>
      </aside>
      <ChatHistoryPanel
        chats={chats}
        isLoading={isHistoryLoading}
        isDeletingId={isDeletingId}
        error={historyError}
        onContinue={(chatId) => {
          navigate(`/chat/${chatId}`);
        }}
        onDelete={async (chatId) => {
          await deleteChat(chatId);
        }}
      />
    </main>
  );
};
