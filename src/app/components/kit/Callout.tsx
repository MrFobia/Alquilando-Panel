import { Info, AlertTriangle, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Variant = "info" | "warning" | "error";

const STYLES: Record<Variant, { bg: string; border: string; color: string; icon: LucideIcon }> = {
  info: { bg: "var(--navy-light)", border: "var(--navy)", color: "var(--navy)", icon: Info },
  warning: { bg: "var(--orange-status-light)", border: "var(--orange-status)", color: "var(--orange-status)", icon: AlertTriangle },
  error: { bg: "var(--red-status-light)", border: "var(--red-status)", color: "var(--red-status)", icon: XCircle },
};

interface Props {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
}

export function Callout({ variant = "info", title, children }: Props) {
  const s = STYLES[variant];
  const Icon = s.icon;
  return (
    <div className="flex gap-3 rounded-lg p-4" style={{ backgroundColor: s.bg, borderLeft: `3px solid ${s.border}` }}>
      <Icon size={18} style={{ color: s.color, flexShrink: 0, marginTop: 2 }} />
      <div className="flex flex-col gap-1">
        {title && <span className="body-bold" style={{ color: s.color }}>{title}</span>}
        <div className="body-regular" style={{ color: "var(--gray-10)" }}>{children}</div>
      </div>
    </div>
  );
}
