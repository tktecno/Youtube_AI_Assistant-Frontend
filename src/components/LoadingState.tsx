interface LoadingStateProps {
  label: string;
}

export const LoadingState = ({ label }: LoadingStateProps) => (
  <div className="loading-state" aria-live="polite">
    <span className="loading-state__dot" />
    <span>{label}</span>
  </div>
);

