import { useRef, useState } from "react";

export interface Column {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  width?: number | string;
}

interface Props {
  columns: Column[];
  rows: Array<Record<string, React.ReactNode>>;
  onRowClick?: (index: number) => void;
}

function CellText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [showPopover, setShowPopover] = useState(false);

  return (
    <span
      className="relative block"
      onMouseEnter={() => {
        const el = ref.current;
        if (el && el.scrollWidth > el.clientWidth) setShowPopover(true);
      }}
      onMouseLeave={() => setShowPopover(false)}
    >
      <span ref={ref} className="block truncate">{text}</span>
      {showPopover && (
        <span
          className="absolute z-20 body-small-regular"
          style={{
            top: "100%",
            left: 0,
            marginTop: 4,
            backgroundColor: "var(--gray-10)",
            color: "#ffffff",
            padding: "6px 10px",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 4px 16px rgba(26,35,126,0.18)",
            whiteSpace: "normal",
            maxWidth: 320,
            width: "max-content",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

export function DataTable({ columns, rows, onRowClick }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 0, tableLayout: "fixed" }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className="tags-bold px-4 py-3"
                style={{ color: "var(--navy)", fontWeight: 700, textAlign: c.align ?? "left", textTransform: "uppercase", width: c.width }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const zebraBg = i % 2 === 0 ? "var(--gray-1)" : "#ffffff";
            const bg = hovered === i ? "var(--navy-light)" : zebraBg;
            return (
              <tr
                key={i}
                className="transition-colors"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={onRowClick ? () => onRowClick(i) : undefined}
                style={{ cursor: onRowClick ? "pointer" : undefined }}
              >
                {columns.map((c, j) => (
                  <td
                    key={c.key}
                    className="body-regular px-4 py-4"
                    style={{
                      color: "var(--gray-10)",
                      textAlign: c.align ?? "left",
                      backgroundColor: bg,
                      borderRadius:
                        j === 0 ? "var(--radius-md) 0 0 var(--radius-md)"
                        : j === columns.length - 1 ? "0 var(--radius-md) var(--radius-md) 0"
                        : undefined,
                    }}
                    onClick={j === columns.length - 1 ? (e) => e.stopPropagation() : undefined}
                  >
                    {typeof row[c.key] === "string" ? <CellText text={row[c.key] as string} /> : row[c.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
