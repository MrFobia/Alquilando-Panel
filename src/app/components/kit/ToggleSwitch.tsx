interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function ToggleSwitch({ checked, onChange, label }: Props) {
  return (
    <div
      className="inline-flex items-center gap-2"
      style={{ cursor: "pointer" }}
      onClick={() => onChange(!checked)}
    >
      <button
        role="switch"
        aria-checked={checked}
        className="relative rounded-full transition-colors shrink-0"
        style={{
          width: 36,
          height: 20,
          backgroundColor: checked ? "var(--navy)" : "var(--gray-5)",
          cursor: "pointer",
        }}
      >
        <span
          className="absolute rounded-full transition-all"
          style={{
            width: 16,
            height: 16,
            top: 2,
            left: checked ? 18 : 2,
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </button>
      {label && <span className="body-bold" style={{ color: "var(--gray-10)" }}>{label}</span>}
    </div>
  );
}
