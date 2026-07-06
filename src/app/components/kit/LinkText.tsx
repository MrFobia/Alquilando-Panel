import { ChevronRight, ExternalLink } from "lucide-react";

type LinkSize = "regular" | "small" | "disclamer";

const SIZE_CLASS: Record<LinkSize, string> = {
  regular: "body-regular",
  small: "body-small-regular",
  disclamer: "disclamer",
};

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  size?: LinkSize;
  icon?: "chevron" | "external";
  bold?: boolean;
  disabled?: boolean;
  className?: string;
}

export function LinkText({
  children,
  onClick,
  size = "regular",
  icon,
  bold = false,
  disabled = false,
  className = "",
}: Props) {
  const iconSize = size === "regular" ? 14 : 12;
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 ${SIZE_CLASS[size]} ${className}`}
      style={{
        color: disabled ? "var(--gray-6)" : "var(--violeta)",
        cursor: disabled ? "default" : "pointer",
        fontWeight: bold ? 500 : 400,
        backgroundColor: "transparent",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.textDecoration = "underline"; }}
      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
    >
      {children}
      {icon === "chevron" && <ChevronRight size={iconSize} />}
      {icon === "external" && <ExternalLink size={iconSize} />}
    </button>
  );
}
