import { useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
}

export function Modal({ open, onClose, title, children, width = 540 }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.45)", padding: 20 }}
      onClick={onClose}
    >
      <div
        className="flex flex-col rounded-xl overflow-hidden"
        style={{ backgroundColor: "#ffffff", width: "100%", maxWidth: width, maxHeight: "90vh", boxShadow: "0 12px 48px rgba(0,0,0,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 shrink-0" style={{ padding: "20px 24px 0" }}>
          <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: 30, height: 30, cursor: "pointer", color: "var(--gray-7)", backgroundColor: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--gray-2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <X size={18} />
          </button>
        </div>
        <hr style={{ borderColor: "var(--gray-4)", margin: "16px 24px 0" }} />
        <div className="overflow-y-auto" style={{ padding: "20px 24px 24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
