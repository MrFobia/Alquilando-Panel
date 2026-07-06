type Variant = "primary" | "secondary" | "danger" | "accent" | "ghost";

interface VariantStyle {
  base: React.CSSProperties;
  hoverBg: string;
}

const VARIANTS: Record<Variant, VariantStyle> = {
  primary: {
    base: { backgroundColor: "var(--navy)", color: "#ffffff" },
    hoverBg: "#141a64",
  },
  secondary: {
    base: { backgroundColor: "transparent", color: "var(--navy)", border: "1.5px solid var(--navy)" },
    hoverBg: "var(--navy-light)",
  },
  danger: {
    base: { backgroundColor: "transparent", color: "var(--destructive)", border: "1.5px solid var(--destructive)" },
    hoverBg: "rgba(212, 24, 61, 0.08)",
  },
  accent: {
    base: { backgroundColor: "var(--alquilando)", color: "var(--navy)" },
    hoverBg: "#00bce6",
  },
  ghost: {
    base: { backgroundColor: "#ffffff", color: "var(--gray-9)", border: "1px solid var(--gray-5)" },
    hoverBg: "var(--gray-1)",
  },
};

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
  bold?: boolean;
  className?: string;
}

export function AppButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  fullWidth = false,
  bold = false,
  className = "",
}: Props) {
  const { base, hoverBg } = VARIANTS[variant];
  const baseBg = (base.backgroundColor as string) ?? "transparent";

  if (disabled) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center gap-2 px-4 rounded-lg cursor-not-allowed ${bold ? "body-bold" : "body-regular"} ${fullWidth ? "w-full" : ""} ${className}`}
        style={{ backgroundColor: "var(--gray-6)", color: "#ffffff", height: 40 }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-4 rounded-lg cursor-pointer transition-colors ${bold ? "body-bold" : "body-regular"} ${fullWidth ? "w-full" : ""} ${className}`}
      style={{ ...base, height: 40 }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hoverBg; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = baseBg; }}
    >
      {children}
    </button>
  );
}
