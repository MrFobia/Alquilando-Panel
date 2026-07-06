import { SearchX } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon: Icon = SearchX, action }: Props) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-12 px-6">
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: 64, height: 64, backgroundColor: "var(--navy-light)" }}
      >
        <Icon size={28} strokeWidth={1.6} style={{ color: "var(--navy)" }} />
      </div>
      <p className="subtitle" style={{ color: "var(--navy)" }}>{title}</p>
      {description && (
        <p className="body-regular" style={{ color: "var(--gray-9)", maxWidth: 420 }}>{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
