import { CheckCircle2, Info, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../atoms/Button/Button.jsx";
import "./Toast.css";

export function Toast({ toast, onClose }) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startedAtRef = useRef(0);
  const remainingMsRef = useRef(5000);
  const progressRef = useRef(null);

  useEffect(() => {
    if (!toast) return undefined;
    setProgress(100);
    setIsPaused(false);
    remainingMsRef.current = 5000;
    startedAtRef.current = Date.now();
    return undefined;
  }, [toast]);

  useEffect(() => {
    if (!toast || isPaused) return undefined;
    startedAtRef.current = Date.now();
    const timeoutId = window.setTimeout(onClose, remainingMsRef.current);
    const intervalId = window.setInterval(() => {
      const elapsedMs = 5000 - (remainingMsRef.current - (Date.now() - startedAtRef.current));
      setProgress(Math.max(0, 100 - (elapsedMs / 5000) * 100));
    }, 80);

    return () => {
      remainingMsRef.current = Math.max(0, remainingMsRef.current - (Date.now() - startedAtRef.current));
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [isPaused, onClose, toast]);

  useEffect(() => {
    progressRef.current?.style.setProperty("--toast-progress", String(progress / 100));
  }, [progress]);

  if (!toast) return null;
  const Icon = toast.tone === "danger" ? Info : CheckCircle2;

  return (
    <div
      aria-live="polite"
      className={`toast toast--${toast.tone || "success"}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="status"
    >
      <div className="toast__content">
        <Icon aria-hidden="true" className="toast__icon" size={14} />
        <span>{toast.message}</span>
        {toast.actionLabel ? (
          <Button onClick={toast.onAction} tone="secondary">
            {toast.actionLabel}
          </Button>
        ) : null}
        <button aria-label="Dismiss message" className="icon-button" onClick={onClose} type="button">
          <X aria-hidden="true" size={14} />
        </button>
      </div>
      <div className="toast__progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>
    </div>
  );
}
