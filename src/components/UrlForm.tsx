import type { FormEvent } from "react";

interface UrlFormProps {
  url: string;
  isLoading: boolean;
  error: string | null;
  onUrlChange: (value: string) => void;
  onSubmit: () => Promise<void>;
}

export const UrlForm = ({
  url,
  isLoading,
  error,
  onUrlChange,
  onSubmit
}: UrlFormProps) => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <form className="hero-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="youtube-url">
        YouTube video URL
      </label>
      <input
        id="youtube-url"
        className="hero-form__input"
        type="url"
        placeholder="Paste a YouTube URL to build a grounded chat"
        value={url}
        onChange={(event) => onUrlChange(event.target.value)}
        disabled={isLoading}
        required
      />
      <button className="hero-form__button" type="submit" disabled={isLoading}>
        {isLoading ? "Indexing video..." : "Start Chat"}
      </button>
      <p className="hero-form__hint">
        The transcript is processed once, translated to English if needed, embedded, and
        reused across chat sessions.
      </p>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
};

