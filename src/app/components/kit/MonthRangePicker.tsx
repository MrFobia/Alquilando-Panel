import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { LinkText } from "./LinkText";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

interface MonthPoint { year: number; month: number }
interface Range { start: MonthPoint | null; end: MonthPoint | null }

function toIndex(p: MonthPoint) { return p.year * 12 + p.month; }

function formatRange(range: Range) {
  if (!range.start) return "";
  const s = `${MONTHS[range.start.month]} ${range.start.year}`;
  if (!range.end || toIndex(range.end) === toIndex(range.start)) return s;
  return `${s} - ${MONTHS[range.end.month]} ${range.end.year}`;
}

interface Props { onChange?: (range: Range) => void }

export function MonthRangePicker({ onChange }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [range, setRange] = useState<Range>({ start: null, end: null });
  const [isOpen, setIsOpen] = useState(false);
  const [picking, setPicking] = useState<"start" | "end">("start");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleMonthClick(month: number) {
    const point: MonthPoint = { year, month };
    let next: Range;
    if (picking === "start") {
      next = { start: point, end: null };
      setPicking("end");
    } else {
      const start = range.start!;
      next = toIndex(point) < toIndex(start)
        ? { start: point, end: start }
        : { start, end: point };
      setPicking("start");
      setIsOpen(false);
    }
    setRange(next);
    onChange?.(next);
  }

  function getMonthState(month: number) {
    const { start, end } = range;
    if (!start) return "none";
    const idx = toIndex({ year, month });
    const si = toIndex(start);
    const ei = end ? toIndex(end) : si;
    if (idx === si) return "start";
    if (idx === ei) return "end";
    if (idx > si && idx < ei) return "in-range";
    return "none";
  }

  const label = formatRange(range);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2"
        style={{
          border: "1px solid var(--gray-5)",
          borderRadius: "var(--radius-md)",
          padding: "6px 12px",
          backgroundColor: "#ffffff",
          cursor: "pointer",
          minWidth: 180,
        }}
      >
        <span
          className="body-small-regular flex-1 text-left"
          style={{ color: label ? "var(--gray-10)" : "var(--gray-7)" }}
        >
          {label || "Seleccione"}
        </span>
        <Calendar size={14} style={{ color: "var(--gray-8)", flexShrink: 0 }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            backgroundColor: "#ffffff",
            border: "1px solid var(--gray-4)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 4px 16px rgba(26,35,126,0.10)",
            padding: 16,
            zIndex: 50,
            minWidth: 220,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setYear((y) => y - 1)} style={{ cursor: "pointer", color: "var(--gray-9)", lineHeight: 0 }}>
              <ChevronLeft size={16} />
            </button>
            <span className="body-bold" style={{ color: "var(--navy)" }}>{year}</span>
            <button onClick={() => setYear((y) => y + 1)} style={{ cursor: "pointer", color: "var(--gray-9)", lineHeight: 0 }}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
            {MONTHS.map((name, i) => {
              const state = getMonthState(i);
              const isEdge = state === "start" || state === "end";
              const isInRange = state === "in-range";
              return (
                <button
                  key={name}
                  onClick={() => handleMonthClick(i)}
                  className="body-small-regular"
                  style={{
                    padding: "7px 4px",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    backgroundColor: isEdge ? "var(--navy)" : isInRange ? "var(--navy-light)" : "transparent",
                    color: isEdge ? "#ffffff" : isInRange ? "var(--navy)" : "var(--gray-10)",
                    fontWeight: isEdge ? 600 : 400,
                    transition: "background-color 0.12s",
                  }}
                  onMouseEnter={(e) => { if (!isEdge) e.currentTarget.style.backgroundColor = "var(--gray-2)"; }}
                  onMouseLeave={(e) => { if (!isEdge) e.currentTarget.style.backgroundColor = isInRange ? "var(--navy-light)" : "transparent"; }}
                >
                  {name}
                </button>
              );
            })}
          </div>

          <p className="disclamer text-center" style={{ color: "var(--gray-7)", marginTop: 10 }}>
            {picking === "start" ? "Selecciona mes inicio" : "Selecciona mes fin"}
          </p>

          {range.start && (
            <LinkText
              size="disclamer"
              className="w-full justify-center mt-1.5"
              onClick={() => { setRange({ start: null, end: null }); setPicking("start"); onChange?.({ start: null, end: null }); }}
            >
              Limpiar selección
            </LinkText>
          )}
        </div>
      )}
    </div>
  );
}
