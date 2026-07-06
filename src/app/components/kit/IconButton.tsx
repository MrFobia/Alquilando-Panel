import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title?: string;
  onClick?: () => void;
  active?: boolean;
}

export function IconButton({ icon: Icon, title, onClick, active = false }: Props) {
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const showTooltip = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setCoords({ top: rect.top - 6, left: rect.left + rect.width / 2 });
    setHovered(true);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={showTooltip}
        onMouseLeave={() => setHovered(false)}
        aria-label={title}
        className="p-1.5 rounded transition-colors"
        style={{
          cursor: "pointer",
          color: active || hovered ? "#ffffff" : "var(--navy)",
          backgroundColor: active || hovered ? "var(--navy)" : "transparent",
        }}
      >
        <Icon size={16} strokeWidth={1.8} />
      </button>
      {title && hovered && createPortal(
        <span
          className="tags fixed z-50"
          style={{
            top: coords.top,
            left: coords.left,
            transform: "translate(-50%, -100%)",
            backgroundColor: "var(--gray-10)",
            color: "#ffffff",
            padding: "5px 9px",
            borderRadius: "var(--radius-sm)",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(26,35,126,0.2)",
            pointerEvents: "none",
          }}
        >
          {title}
        </span>,
        document.body
      )}
    </>
  );
}
