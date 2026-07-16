import { Check } from "lucide-react";

export interface StepItem {
  id: string;
  label: string;
}

interface Props {
  steps: StepItem[];
  /** Index of the step currently in progress. Steps before it render as completed. */
  current: number;
}

export function Stepper({ steps, current }: Props) {
  const progressPct = (current / (steps.length - 1)) * 100;

  return (
    <>
      {/* Mobile: barra de progreso compacta con el paso actual — sin scroll horizontal. */}
      <div className="sm:hidden flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between gap-3">
          <span className="disclamer" style={{ color: "var(--gray-8)" }}>
            Paso {current + 1} de {steps.length}
          </span>
          <span className="body-small-bold" style={{ color: "var(--navy)" }}>
            {steps[current].label}
          </span>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: 6, backgroundColor: "var(--gray-4)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${progressPct}%`, backgroundColor: "var(--navy)", transition: "width 0.3s" }}
          />
        </div>
      </div>

      {/* Desktop/tablet: circulos + conectores + labels */}
      <div className="hidden sm:flex items-start justify-center gap-0 w-full">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={step.id} className="flex items-start flex-1 max-w-[130px]">
              {i > 0 && (
                <div
                  className="shrink-0 flex-1"
                  style={{
                    height: 2,
                    marginTop: 13,
                    backgroundColor: i <= current ? "var(--navy)" : "var(--gray-5)",
                    transition: "background-color 0.3s",
                  }}
                />
              )}
              <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: done || active ? "var(--navy)" : "#ffffff",
                    border: `1.5px solid ${done || active ? "var(--navy)" : "var(--gray-6)"}`,
                    color: done || active ? "#ffffff" : "var(--gray-8)",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.3s",
                  }}
                >
                  {done ? <Check size={15} strokeWidth={2.5} /> : i + 1}
                </div>
                <span
                  className="disclamer text-center truncate w-full"
                  style={{
                    color: done || active ? "var(--navy)" : "var(--gray-8)",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
