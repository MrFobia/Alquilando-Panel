type Variant = "draft" | "pending" | "registered" | "active" | "rejected" | "neutral" | "violet";

const STYLES: Record<Variant, { bg: string; color: string; border?: string }> = {
  draft: { bg: "var(--red-status)", color: "#ffffff" },
  pending: { bg: "var(--orange-status-light)", color: "var(--orange-status)", border: "var(--orange-status)" },
  registered: { bg: "var(--navy-light)", color: "var(--navy)", border: "var(--navy)" },
  violet: { bg: "var(--violeta-light)", color: "var(--violeta)", border: "var(--violeta)" },
  active: { bg: "var(--green-status-light)", color: "var(--green-status)", border: "var(--green-status)" },
  rejected: { bg: "var(--red-status-light)", color: "var(--red-status)", border: "var(--red-status)" },
  neutral: { bg: "var(--gray-4)", color: "var(--gray-9)", border: "var(--gray-5)" },
};

interface Props {
  label: string;
  variant: Variant;
}

export function StatusBadge({ label, variant }: Props) {
  const s = STYLES[variant];
  return (
    <span
      className="tags px-3 py-1 rounded-full inline-block"
      style={{
        backgroundColor: s.bg,
        color: s.color,
        border: s.border ? `1px solid ${s.border}` : "1px solid transparent",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
