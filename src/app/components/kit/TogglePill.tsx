import { Check } from "lucide-react";
import { TOOLBAR_HEIGHT } from "./popover";

interface Props {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Filtro rápido siempre visible: misma familia visual que los chips de FilterBar. */
export function TogglePill({ label, checked, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-1.5 body-small-regular cursor-pointer transition-colors"
      style={{
        height: TOOLBAR_HEIGHT,
        padding: checked ? "0 14px 0 10px" : "0 14px",
        borderRadius: 999,
        border: `1px solid ${checked ? "var(--navy)" : "var(--gray-5)"}`,
        backgroundColor: checked ? "var(--navy-light)" : "#ffffff",
        color: checked ? "var(--navy)" : "var(--gray-9)",
        fontWeight: checked ? 600 : 400,
      }}
    >
      {checked && <Check size={13} strokeWidth={3} />}
      {label}
    </button>
  );
}
