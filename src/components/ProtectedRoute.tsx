import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { LoadingState } from "./LoadingState";

const AuthLoadingScreen = ({ label }: { label: string }) => (
  <main className="auth-page auth-page--centered">
    <LoadingState label={label} />
  </main>
);

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen label="Restoring your session..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export const PublicOnlyRoute = ({ children }: PropsWithChildren) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen label="Checking your session..." />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

