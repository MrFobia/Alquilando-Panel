import type { LucideIcon } from "lucide-react";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon: LucideIcon;
}

interface Props<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div
      className="inline-flex rounded-lg self-start"
      style={{ border: "1.5px solid var(--navy)", overflow: "hidden", width: "fit-content" }}
    >
      {options.map((opt, i) => {
        const Icon = opt.icon;
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="inline-flex items-center gap-2 body-bold transition-colors"
            style={{
              cursor: "pointer",
              padding: "10px 20px",
              backgroundColor: active ? "var(--navy)" : "#ffffff",
              color: active ? "#ffffff" : "var(--navy)",
              borderLeft: i > 0 ? "1.5px solid var(--navy)" : "none",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "var(--navy-light)"; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "#ffffff"; }}
          >
            <Icon size={16} strokeWidth={2} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
