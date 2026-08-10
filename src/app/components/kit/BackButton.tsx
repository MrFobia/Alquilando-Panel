import { ArrowLeft } from "lucide-react";

interface Props {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function BackButton({ onClick, children = "Volver", className = "" }: Props) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 body-bold w-fit ${className}`}
      style={{ cursor: "pointer", color: "var(--navy)", background: "transparent" }}
    >
      <ArrowLeft size={16} /> {children}
    </button>
  );
}
