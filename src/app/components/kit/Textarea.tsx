interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Textarea({ value = "", onChange, placeholder, rows = 3, error = false, disabled = false, className = "" }: Props) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      className={`body-regular w-full ${className}`}
      style={{
        border: `${error ? "1.5px" : "1px"} solid ${error ? "var(--red-status)" : "var(--gray-5)"}`,
        borderRadius: "var(--radius-md)",
        padding: 12,
        color: disabled ? "var(--gray-7)" : "var(--gray-10)",
        backgroundColor: disabled ? "var(--gray-2)" : error ? "var(--red-status-light)" : "#ffffff",
        outline: "none",
        resize: "vertical",
        cursor: disabled ? "not-allowed" : undefined,
      }}
    />
  );
}
