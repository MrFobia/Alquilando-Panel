import { useState } from "react";
import { Bot, X, MessageCircle } from "lucide-react";
import { AIChatModule } from "./AIChatModule";

export function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed z-50" style={{ bottom: 24, right: 24 }}>
      {open && (
        <div
          className="flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: 380,
            height: 560,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            border: "1px solid var(--gray-4)",
            marginBottom: 16,
            backgroundColor: "#ffffff",
          }}
        >
          <AIChatModule onClose={() => setOpen(false)} />
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center rounded-full transition-all"
          style={{
            width: 52,
            height: 52,
            backgroundColor: "var(--navy)",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(26,35,126,0.35)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          title={open ? "Cerrar asistente" : "Hablar con el asistente IA"}
        >
          {open
            ? <X size={22} style={{ color: "#ffffff" }} />
            : <MessageCircle size={22} style={{ color: "#ffffff" }} />}
        </button>
      </div>

      {!open && (
        <div
          className="absolute flex flex-col items-end"
          style={{ bottom: 60, right: 0, pointerEvents: "none" }}
        >
          <div
            className="tags-bold rounded-full rounded-br-none"
            style={{
              backgroundColor: "var(--navy)",
              color: "#ffffff",
              padding: "4px 12px",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              marginBottom: 4,
            }}
          >
            <Bot size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
            Asistente IA
          </div>
        </div>
      )}
    </div>
  );
}
