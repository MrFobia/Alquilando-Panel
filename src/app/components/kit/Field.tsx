import { AlertCircle } from "lucide-react";

interface Props {
  label: string;
  required?: boolean;
  error?: boolean;
  full?: boolean;
  children: React.ReactNode;
}

export function Field({ label, required, error, full, children }: Props) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "col-span-2 max-lg:col-span-1" : ""}`}>
      <span className="body-small-regular" style={{ color: error ? "var(--red-status)" : "var(--gray-9)" }}>
        {label}{required && <span style={{ color: "var(--red-status)" }}> *</span>}
      </span>
      {children}
      {error && (
        <span className="flex items-center gap-1 body-small-regular" style={{ color: "var(--red-status)" }}>
          <AlertCircle size={13} strokeWidth={2} /> Este campo es obligatorio
        </span>
      )}
    </label>
  );
}
