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
  return (
    <div className="flex items-start gap-0 w-max mx-auto">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step.id} className="flex items-start">
            {i > 0 && (
              <div
                className="shrink-0"
                style={{
                  width: 48,
                  height: 2,
                  marginTop: 13,
                  backgroundColor: i <= current ? "var(--navy)" : "var(--gray-5)",
                  transition: "background-color 0.3s",
                }}
              />
            )}
            <div className="flex flex-col items-center gap-1.5" style={{ width: 110 }}>
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
                className="disclamer text-center"
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
  );
}
