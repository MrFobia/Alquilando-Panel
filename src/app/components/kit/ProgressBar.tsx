interface Props {
  /** 0–100 */
  value: number;
  showLabel?: boolean;
}

export function ProgressBar({ value, showLabel = true }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="relative flex-1 rounded-full overflow-hidden" style={{ height: 10, backgroundColor: "var(--gray-3)" }}>
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ width: `${clamped}%`, backgroundColor: "var(--navy)", transition: "width 0.4s ease" }}
        />
      </div>
      {showLabel && (
        <span className="body-small-regular shrink-0" style={{ color: "var(--gray-10)", fontWeight: 600, minWidth: 36, textAlign: "right" }}>
          {clamped}%
        </span>
      )}
    </div>
  );
}
