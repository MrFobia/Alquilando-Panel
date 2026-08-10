import { useEffect, useRef, useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import type { SelectOption } from "./SelectInput";
import { POPOVER_STYLE, TOOLBAR_HEIGHT } from "./popover";

interface Props {
  /** Campos sobre los que se puede buscar; el vacío significa "todos". */
  scopes: SelectOption[];
  scope: string;
  onScopeChange: (scope: string) => void;
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  className?: string;
}

export function SearchField({ scopes, scope, onScopeChange, value, onChange, onSearch, onClear, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const scopeLabel = scopes.find((s) => s.value === scope)?.label ?? "Todo";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div
        className="flex items-center"
        style={{
          height: TOOLBAR_HEIGHT,
          borderRadius: 999,
          border: `1px solid ${focused || open ? "var(--navy)" : "var(--gray-5)"}`,
          backgroundColor: "#ffffff",
          paddingRight: 6,
        }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1 body-small-regular cursor-pointer shrink-0"
          style={{ height: "100%", padding: "0 10px 0 14px", color: "var(--gray-9)" }}
          title="Elegir en qué campo buscar"
        >
          {scopeLabel}
          <ChevronDown size={13} style={{ color: "var(--gray-7)" }} />
        </button>
        <span style={{ width: 1, height: 18, backgroundColor: "var(--gray-4)", flexShrink: 0 }} />
        <Search size={14} style={{ color: "var(--gray-7)", margin: "0 6px 0 10px", flexShrink: 0 }} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSearch(); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Buscar…"
          className="body-small-regular w-full"
          style={{ border: "none", outline: "none", backgroundColor: "transparent", color: "var(--gray-10)", minWidth: 0 }}
        />
        {value && (
          <button
            onClick={onClear}
            className="inline-flex items-center justify-center cursor-pointer shrink-0"
            style={{ width: 22, height: 22, borderRadius: 999, color: "var(--gray-7)" }}
            title="Limpiar búsqueda"
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {open && (
        <div style={{ ...POPOVER_STYLE, left: 0, minWidth: 190 }}>
          <p className="body-small-regular" style={{ color: "var(--gray-7)", padding: "8px 10px 6px", margin: 0 }}>Buscar en</p>
          {[{ value: "", label: "Todo" }, ...scopes].map((s) => (
            <button
              key={s.value || "all"}
              onClick={() => { onScopeChange(s.value); setOpen(false); onSearch(); }}
              className="flex items-center w-full text-left body-small-regular cursor-pointer transition-colors"
              style={{
                padding: "8px 10px",
                color: s.value === scope ? "var(--navy)" : "var(--gray-10)",
                fontWeight: s.value === scope ? 600 : 400,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--gray-1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
