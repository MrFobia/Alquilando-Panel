interface Props {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function Radio({ checked, onChange, label }: Props) {
  return (
    <label className="inline-flex items-center gap-2" style={{ cursor: "pointer" }}>
      <input type="radio" checked={checked} onChange={onChange} style={{ accentColor: "var(--navy)", cursor: "pointer" }} />
      <span className="body-regular" style={{ color: "var(--gray-10)" }}>{label}</span>
    </label>
  );
}
