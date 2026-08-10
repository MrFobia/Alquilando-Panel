import { Check, AlertTriangle } from "lucide-react";

export interface StepItem {
  id: string;
  label: string;
}

export type StepStatus = "complete" | "incomplete";

interface Props {
  steps: StepItem[];
  /** Index of the step currently in progress. Steps before it render as visited. */
  current: number;
  /** Per-step completion for steps already visited (index < current). */
  status?: StepStatus[];
  /** Furthest step index the user has reached — steps up to here stay clickable in both directions. Defaults to `current`. */
  maxReached?: number;
  /** Called when the user clicks an already-visited step (or the current one) to jump there. */
  onStepClick?: (index: number) => void;
}

export function Stepper({ steps, current, status = [], maxReached = current, onStepClick }: Props) {
  const progressPct = (current / (steps.length - 1)) * 100;

  const colorFor = (i: number) => {
    if (i === current) return "var(--navy)";
    if (i < current) return status[i] === "incomplete" ? "var(--orange-status)" : "var(--green-status)";
    return null;
  };

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
          const incomplete = done && status[i] === "incomplete";
          const color = colorFor(i);
          const clickable = i <= maxReached && !!onStepClick;
          return (
            <div key={step.id} className="flex items-start flex-1 max-w-[160px]">
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
              <button
                type="button"
                onClick={clickable ? () => onStepClick?.(i) : undefined}
                disabled={!clickable}
                className="flex flex-col items-center gap-1.5 flex-1 min-w-0"
                style={{ background: "transparent", border: "none", padding: 0, cursor: clickable ? "pointer" : "default" }}
              >
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: done || active ? color! : "#ffffff",
                    border: `1.5px solid ${done || active ? color : "var(--gray-6)"}`,
                    color: done || active ? "#ffffff" : "var(--gray-8)",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.3s",
                  }}
                >
                  {done ? (incomplete ? <AlertTriangle size={13} strokeWidth={2.5} /> : <Check size={15} strokeWidth={2.5} />) : i + 1}
                </div>
                <span
                  className="disclamer text-center w-full"
                  style={{
                    color: done || active ? (incomplete ? "var(--orange-status)" : "var(--navy)") : "var(--gray-8)",
                    fontWeight: active ? 600 : 400,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    lineHeight: 1.25,
                  }}
                >
                  {step.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
