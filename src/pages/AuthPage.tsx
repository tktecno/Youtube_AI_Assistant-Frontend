import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { supabase, supabaseConfigErrorMessage } from "../lib/supabase";

type AuthMode = "sign_in" | "sign_up";

export const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!supabase) {
      setError(supabaseConfigErrorMessage);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      if (mode === "sign_up") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.session) {
          navigate("/");
          return;
        }

        setNotice(
          "Account created. If email confirmation is enabled in Supabase, confirm your email and then sign in."
        );
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          throw signInError;
        }

        navigate("/");
      }
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="hero-panel__eyebrow">Secure Access</p>
        <h1>
          {mode === "sign_in"
            ? "Sign in to your private video workspace."
            : "Create your account."}
        </h1>
        <p className="auth-card__copy">
          Chats are now tied to the authenticated user, so one user cannot load
          another user&apos;s session by reusing a chat id.
        </p>
        {!supabase ? <p className="form-error">{supabaseConfigErrorMessage}</p> : null}

        <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
          <button
            className={`auth-toggle__button ${
              mode === "sign_in" ? "auth-toggle__button--active" : ""
            }`}
            type="button"
            onClick={() => setMode("sign_in")}
          >
            Sign in
          </button>
          <button
            className={`auth-toggle__button ${
              mode === "sign_up" ? "auth-toggle__button--active" : ""
            }`}
            type="button"
            onClick={() => setMode("sign_up")}
          >
            Create account
          </button>
        </div>

        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <label className="auth-form__label" htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            className="hero-form__input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            disabled={isSubmitting}
          />

          <label className="auth-form__label" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            className="hero-form__input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === "sign_in" ? "current-password" : "new-password"}
            minLength={6}
            required
            disabled={isSubmitting}
          />

          <button className="hero-form__button" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Please wait..."
              : mode === "sign_in"
                ? "Sign in"
                : "Create account"}
          </button>

          {notice ? <p className="form-notice">{notice}</p> : null}
          {error ? <p className="form-error">{error}</p> : null}
        </form>
      </section>
    </main>
  );
};
