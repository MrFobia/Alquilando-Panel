import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface Props {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
}

export function TabBar({ tabs, active, onChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tabs]);

  const scrollByAmount = (dx: number) =>
    scrollRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 3) {
      drag.current.moved = true;
      el.setPointerCapture(e.pointerId);
    }
    el.scrollLeft = drag.current.startScroll - dx;
  };

  const endDrag = () => { drag.current.active = false; };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div className="relative">
      {canLeft && (
        <button
          onClick={() => scrollByAmount(-220)}
          className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-4"
          style={{
            cursor: "pointer",
            background: "linear-gradient(to right, #ffffff 55%, transparent)",
            color: "var(--navy)",
          }}
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {canRight && (
        <button
          onClick={() => scrollByAmount(220)}
          className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-4"
          style={{
            cursor: "pointer",
            background: "linear-gradient(to left, #ffffff 55%, transparent)",
            color: "var(--navy)",
          }}
        >
          <ChevronRight size={18} />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={updateArrows}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={handleClickCapture}
        className="no-scrollbar flex gap-6 border-b"
        style={{
          borderColor: "var(--gray-5)",
          overflowX: "auto",
          overflowY: "hidden",
          cursor: drag.current.active ? "grabbing" : undefined,
          touchAction: "pan-x",
          width: "fit-content",
          maxWidth: "100%",
        }}
      >
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="flex items-center gap-2 px-1 py-3 border-b-2 -mb-px transition-colors body-regular"
              style={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                backgroundColor: "transparent",
                color: isActive ? "var(--navy)" : "var(--gray-8)",
                borderBottomColor: isActive ? "var(--navy)" : "transparent",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {t.label}
              {t.count !== undefined && (
                <span
                  className="tags px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: isActive ? "var(--navy-light)" : "transparent",
                    color: isActive ? "var(--navy)" : "var(--gray-8)",
                  }}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
