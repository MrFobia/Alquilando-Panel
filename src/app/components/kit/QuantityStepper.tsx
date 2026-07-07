import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ value, onChange, min = 1, max = 10 }: Props) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="inline-flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid var(--gray-5)" }}>
      <button
        onClick={dec}
        disabled={value <= min}
        className="flex items-center justify-center transition-colors"
        style={{
          width: 36, height: 40, cursor: value <= min ? "default" : "pointer",
          color: value <= min ? "var(--gray-6)" : "var(--navy)", backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => { if (value > min) e.currentTarget.style.backgroundColor = "var(--gray-1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
      >
        <Minus size={15} />
      </button>
      <span
        className="body-bold flex items-center justify-center"
        style={{ width: 40, height: 40, color: "var(--gray-10)", borderLeft: "1px solid var(--gray-5)", borderRight: "1px solid var(--gray-5)" }}
      >
        {value}
      </span>
      <button
        onClick={inc}
        disabled={value >= max}
        className="flex items-center justify-center transition-colors"
        style={{
          width: 36, height: 40, cursor: value >= max ? "default" : "pointer",
          color: value >= max ? "var(--gray-6)" : "var(--navy)", backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => { if (value < max) e.currentTarget.style.backgroundColor = "var(--gray-1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
