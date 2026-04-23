// 2.2초짜리 자동 fade-in/out toast. Portal로 body에.
import { createPortal } from "react-dom";

interface Props {
  message: string | null;
  variant?: "success" | "error";
}

export function Toast({ message, variant = "success" }: Props) {
  if (!message || typeof document === "undefined") return null;
  return createPortal(
    <div className={`toast toast-${variant}`} role="status" aria-live="polite" key={message}>
      <span className="toast-icon">✓</span>
      <span className="toast-msg">{message}</span>
    </div>,
    document.body
  );
}
