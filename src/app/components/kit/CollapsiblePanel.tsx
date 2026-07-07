import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  title: React.ReactNode;
  right?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsiblePanel({ title, right, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--gray-4)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3"
        style={{ backgroundColor: "var(--navy)", padding: "14px 20px", cursor: "pointer" }}
      >
        <span className="body-bold" style={{ color: "#ffffff" }}>{title}</span>
        <div className="flex items-center gap-3">
          {right}
          <ChevronDown
            size={18}
            style={{ color: "#ffffff", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
          />
        </div>
      </button>
      {open && <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>{children}</div>}
    </div>
  );
}
