interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Checkbox({ checked, onChange, label }: Props) {
  return (
    <label className="inline-flex items-center gap-2" style={{ cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 16, height: 16, accentColor: "var(--navy)", cursor: "pointer" }}
      />
      <span className="body-regular" style={{ color: "var(--gray-10)" }}>{label}</span>
    </label>
  );
}
