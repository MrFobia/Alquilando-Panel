import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface Props {
  items: AccordionItemData[];
  openAll?: boolean;
}

export function Accordion({ items, openAll = false }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isOpen = openAll || !!open[item.id];
        return (
          <div key={item.id} style={{ borderTop: i === 0 ? "none" : "1px solid var(--gray-3)" }}>
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between gap-3 py-3 text-left"
              style={{ cursor: "pointer", backgroundColor: "transparent" }}
            >
              <span className="body-bold" style={{ color: isOpen ? "var(--navy)" : "var(--gray-10)" }}>
                {item.title}
              </span>
              <ChevronDown
                size={16}
                style={{
                  color: "var(--gray-8)",
                  flexShrink: 0,
                  transform: isOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.15s",
                }}
              />
            </button>
            {isOpen && (
              <div className="pb-4 body-regular" style={{ color: "var(--gray-9)" }}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
