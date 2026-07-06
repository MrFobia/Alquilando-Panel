interface Props {
  label: string;
  value: React.ReactNode;
  /** Span the full row when rendered inside a grid. */
  fullWidth?: boolean;
}

export function InfoField({ label, value, fullWidth = false }: Props) {
  return (
    <div className={`flex flex-col gap-1 min-w-0 ${fullWidth ? "col-span-full" : ""}`}>
      <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>{label}</span>
      <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}
