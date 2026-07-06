import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

interface Props {
  message: string;
  description?: string;
  onClose: () => void;
}

export function Toast({ message, description, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-lg"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", padding: "14px 18px", minWidth: 320, maxWidth: 400 }}
    >
      <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 28, height: 28, backgroundColor: "var(--green-status-light)" }}>
        <CheckCircle2 size={16} style={{ color: "var(--green-status)" }} />
      </div>
      <div className="flex flex-col gap-0.5 flex-1">
        <span className="body-bold" style={{ color: "var(--gray-10)" }}>{message}</span>
        {description && <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>{description}</span>}
      </div>
      <button onClick={onClose} className="shrink-0" style={{ background: "transparent", cursor: "pointer" }}>
        <X size={16} style={{ color: "var(--gray-7)" }} />
      </button>
    </div>
  );
}
