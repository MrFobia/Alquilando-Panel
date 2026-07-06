import { Eye } from "lucide-react";

export interface Metric {
  label: string;
  value?: string;
  showEye?: boolean;
  breakdown?: { value: string; label: string }[];
}

interface Props {
  metrics: Metric[];
}

export function MetricsRow({ metrics }: Props) {
  return (
    <section
      className="rounded-lg grid gap-4"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--gray-4)",
        padding: "20px 28px",
        gridTemplateColumns: `repeat(${metrics.length}, 1fr)`,
      }}
    >
      {metrics.map((m) => (
        <div key={m.label} className="flex flex-col gap-2">
          <span className="body-regular" style={{ color: "var(--gray-10)" }}>{m.label}</span>
          {m.breakdown ? (
            <div className="flex gap-5 items-end">
              {m.breakdown.map((b) => (
                <div key={b.label} className="flex flex-col">
                  <span className="title-secondary" style={{ color: "var(--navy)" }}>{b.value}</span>
                  <span className="disclamer" style={{ color: "var(--gray-8)" }}>{b.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="title-primary-bold" style={{ color: "var(--navy)" }}>{m.value}</span>
              {m.showEye && <Eye size={18} strokeWidth={1.8} style={{ color: "var(--navy)" }} />}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
