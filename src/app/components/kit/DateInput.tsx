import { Calendar } from "lucide-react";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  min?: string;
  disabled?: boolean;
}

export function DateInput({ value = "", onChange, className = "", min, disabled = false }: Props) {
  return (
    <span className={`relative inline-block ${className}`}>
      <input
        type="date"
        value={value}
        min={min}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="body-regular w-full date-input-clean"
        style={{
          border: "1px solid var(--gray-5)",
          borderRadius: "var(--radius-md)",
          padding: "0 36px 0 12px",
          height: 40,
          color: disabled ? "var(--gray-7)" : value ? "var(--gray-10)" : "var(--gray-7)",
          backgroundColor: disabled ? "var(--gray-2)" : "#ffffff",
          outline: "none",
          cursor: disabled ? "not-allowed" : undefined,
        }}
        onFocus={(e) => { if (!disabled) e.currentTarget.style.borderColor = "var(--navy)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--gray-5)"; }}
      />
      <Calendar
        size={16}
        className="absolute pointer-events-none"
        style={{ right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--gray-8)" }}
      />
    </span>
  );
}
