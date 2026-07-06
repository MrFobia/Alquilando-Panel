interface Props {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
}

export function Skeleton({ width = "100%", height = 16, radius = "var(--radius-sm)", className = "" }: Props) {
  return (
    <span
      className={`skeleton-shimmer block ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}
