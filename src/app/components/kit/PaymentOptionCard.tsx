import type { LucideIcon } from "lucide-react";
import { AppButton } from "./AppButton";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionIcon?: LucideIcon;
  actionVariant?: "primary" | "secondary";
  onAction?: () => void;
  badge?: React.ReactNode;
}

export function PaymentOptionCard({
  icon: Icon, title, description, actionLabel, actionIcon: ActionIcon, actionVariant = "secondary", onAction, badge,
}: Props) {
  return (
    <div className="rounded-lg flex flex-col gap-4" style={{ border: "1px solid var(--gray-4)", padding: "18px 20px" }}>
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 40, height: 40, backgroundColor: "var(--navy-light)" }}
        >
          <Icon size={19} style={{ color: "var(--navy)" }} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="body-bold" style={{ color: "var(--navy)" }}>{title}</span>
          <span className="body-regular" style={{ color: "var(--gray-9)" }}>{description}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>{badge}</div>
        <AppButton variant={actionVariant} bold onClick={onAction}>
          {ActionIcon && <ActionIcon size={15} />} {actionLabel}
        </AppButton>
      </div>
    </div>
  );
}
