import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function pageList(page: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (page >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", page - 1, page, page + 1, "...", total];
}

function NavButton({ disabled, onClick, children }: { disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="flex items-center justify-center rounded"
      style={{
        width: 28,
        height: 28,
        cursor: disabled ? "default" : "pointer",
        color: disabled ? "var(--gray-6)" : "var(--gray-9)",
        backgroundColor: "transparent",
      }}
    >
      {children}
    </button>
  );
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1">
      <NavButton disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={16} />
      </NavButton>
      {pageList(page, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="body-small-regular px-1" style={{ color: "var(--gray-8)" }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="body-small-regular flex items-center justify-center rounded transition-colors"
            style={{
              width: 28,
              height: 28,
              cursor: "pointer",
              backgroundColor: p === page ? "var(--navy)" : "transparent",
              color: p === page ? "#ffffff" : "var(--gray-9)",
              fontWeight: p === page ? 600 : 400,
            }}
            onMouseEnter={(e) => { if (p !== page) e.currentTarget.style.backgroundColor = "var(--gray-2)"; }}
            onMouseLeave={(e) => { if (p !== page) e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            {p}
          </button>
        ),
      )}
      <NavButton disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        <ChevronRight size={16} />
      </NavButton>
    </div>
  );
}
