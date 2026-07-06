import { X } from "lucide-react";

interface Props {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  onClear?: () => void;
  className?: string;
  disabled?: boolean;
}

export function TextInput({ placeholder, value, onChange, onEnter, onClear, className = "", disabled = false }: Props) {
  const clearable = !!onClear && !!value && !disabled;
  return (
    <span className={`relative inline-block ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onEnter?.(); }}
        className="body-regular w-full"
        style={{
          border: "1px solid var(--gray-5)",
          borderRadius: "var(--radius-md)",
          padding: clearable ? "0 36px 0 12px" : "0 12px",
          height: 40,
          color: disabled ? "var(--gray-7)" : "var(--gray-10)",
          backgroundColor: disabled ? "var(--gray-2)" : "#ffffff",
          outline: "none",
          cursor: disabled ? "not-allowed" : undefined,
        }}
        onFocus={(e) => { if (!disabled) e.currentTarget.style.borderColor = "var(--navy)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--gray-5)"; }}
      />
      {clearable && (
        <button
          type="button"
          title="Limpiar"
          onClick={() => { onChange?.(""); onClear(); }}
          className="absolute flex items-center justify-center rounded-full transition-colors"
          style={{
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            width: 18,
            height: 18,
            cursor: "pointer",
            color: "var(--gray-8)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--gray-3)"; e.currentTarget.style.color = "var(--gray-10)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--gray-8)"; }}
        >
          <X size={13} strokeWidth={2} />
        </button>
      )}
    </span>
  );
}
