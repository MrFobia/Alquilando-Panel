interface Props {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

function formatMiles(digits: string): string {
  if (!digits) return "";
  return new Intl.NumberFormat("es-CO").format(Number(digits));
}

export function CurrencyInput({ placeholder, value = "", onChange, className = "", disabled = false, error = false }: Props) {
  return (
    <span className={`relative inline-block ${className}`}>
      <input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={formatMiles(value)}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value.replace(/\D/g, ""))}
        className="body-regular w-full"
        style={{
          border: `${error ? "1.5px" : "1px"} solid ${error ? "var(--red-status)" : "var(--gray-5)"}`,
          borderRadius: "var(--radius-md)",
          padding: "0 12px",
          height: 40,
          color: disabled ? "var(--gray-7)" : "var(--gray-10)",
          backgroundColor: disabled ? "var(--gray-2)" : error ? "var(--red-status-light)" : "#ffffff",
          outline: "none",
          cursor: disabled ? "not-allowed" : undefined,
        }}
        onFocus={(e) => { if (!disabled && !error) e.currentTarget.style.borderColor = "var(--navy)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? "var(--red-status)" : "var(--gray-5)"; }}
      />
    </span>
  );
}
