import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SelectInput({ options, value = "", onChange, placeholder = "Seleccione", className = "" }: Props) {
  return (
    <span className={`relative inline-block ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="body-regular w-full"
        style={{
          border: "1px solid var(--gray-5)",
          borderRadius: "var(--radius-md)",
          padding: "0 36px 0 12px",
          height: 40,
          color: value ? "var(--gray-10)" : "var(--gray-7)",
          backgroundColor: "#ffffff",
          outline: "none",
          cursor: "pointer",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--gray-5)"; }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute pointer-events-none"
        style={{ right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--gray-8)" }}
      />
    </span>
  );
}
