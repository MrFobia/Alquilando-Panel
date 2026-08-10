import { useEffect, useRef, useState } from "react";
import { Plus, Search, X, Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SelectOption } from "./SelectInput";
import { POPOVER_STYLE, TOOLBAR_HEIGHT } from "./popover";

export interface FilterFieldDef {
  key: string;
  label: string;
  type: "text" | "select";
  options?: SelectOption[];
  placeholder?: string;
  icon?: LucideIcon;
}

/** Cada filtro guarda una lista de valores; los de tipo texto usan un solo elemento. */
export type FilterValues = Record<string, string[]>;

interface Props {
  fields: FilterFieldDef[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  /** Contenido alineado a la derecha de la barra (p. ej. la búsqueda). */
  trailing?: React.ReactNode;
}

function SearchRow({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex items-center gap-2" style={{ padding: "8px 10px", borderBottom: "1px solid var(--gray-4)" }}>
      <Search size={14} style={{ color: "var(--gray-7)", flexShrink: 0 }} />
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="body-small-regular w-full"
        style={{ border: "none", outline: "none", color: "var(--gray-10)", backgroundColor: "transparent" }}
      />
    </div>
  );
}

function OptionRow({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-full text-left body-small-regular cursor-pointer transition-colors"
      style={{ padding: "8px 10px", color: "var(--gray-10)", backgroundColor: "transparent" }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--gray-1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      <span
        className="inline-flex items-center justify-center shrink-0"
        style={{
          width: 16, height: 16, borderRadius: 4,
          border: `1.5px solid ${selected ? "var(--navy)" : "var(--gray-6)"}`,
          backgroundColor: selected ? "var(--navy)" : "#ffffff",
        }}
      >
        {selected && <Check size={11} strokeWidth={3} color="#ffffff" />}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}

export function FilterBar({ fields, values, onChange, trailing }: Props) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openKey) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpenKey(null);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenKey(null); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openKey]);

  const open = (key: string) => { setSearch(""); setOpenKey((prev) => (prev === key ? null : key)); };

  const valuesOf = (key: string) => values[key] ?? [];
  const activeFields = fields.filter((f) => valuesOf(f.key).length > 0);
  const availableFields = fields.filter((f) => valuesOf(f.key).length === 0);
  // Campo recién elegido en "Agregar filtro": aún sin valores, pero su chip ya se
  // muestra abierto para que el usuario elija sin un paso extra.
  const pendingField = openKey && openKey !== "__add" && valuesOf(openKey).length === 0
    ? fields.find((f) => f.key === openKey) ?? null
    : null;
  const chipFields = pendingField ? [...activeFields, pendingField] : activeFields;

  const setField = (key: string, next: string[]) => {
    const copy = { ...values };
    if (next.length === 0) delete copy[key];
    else copy[key] = next;
    onChange(copy);
  };

  const toggleOption = (field: FilterFieldDef, value: string) => {
    const current = valuesOf(field.key);
    setField(field.key, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  const chipText = (field: FilterFieldDef) => {
    const vals = valuesOf(field.key);
    if (vals.length === 0) return "Seleccione";
    if (field.type === "text") return vals[0];
    if (vals.length === 1) return field.options?.find((o) => o.value === vals[0])?.label ?? vals[0];
    return `${vals.length} seleccionados`;
  };

  const renderPopover = (field: FilterFieldDef) => {
    if (field.type === "text") {
      return (
        <div style={POPOVER_STYLE} onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col gap-2" style={{ padding: 10 }}>
            <input
              autoFocus
              defaultValue={valuesOf(field.key)[0] ?? ""}
              placeholder={field.placeholder ?? "Escriba aquí"}
              className="body-small-regular"
              style={{
                border: "1px solid var(--gray-5)", borderRadius: "var(--radius-md)",
                padding: "0 10px", height: 34, outline: "none", color: "var(--gray-10)", width: 220,
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                const v = (e.target as HTMLInputElement).value.trim();
                setField(field.key, v ? [v] : []);
                setOpenKey(null);
              }}
              onBlur={(e) => {
                const v = e.target.value.trim();
                setField(field.key, v ? [v] : []);
              }}
            />
            <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>Presiona Enter para aplicar</span>
          </div>
        </div>
      );
    }

    const opts = (field.options ?? []).filter((o) => o.label.toLowerCase().includes(search.trim().toLowerCase()));
    return (
      <div style={POPOVER_STYLE}>
        <SearchRow value={search} onChange={setSearch} placeholder={`Buscar ${field.label.toLowerCase()}`} />
        <div style={{ maxHeight: 240, overflowY: "auto", padding: "4px 0" }}>
          {opts.length === 0 ? (
            <p className="body-small-regular" style={{ color: "var(--gray-7)", padding: "10px" , margin: 0 }}>Sin coincidencias</p>
          ) : (
            opts.map((o) => (
              <OptionRow
                key={o.value}
                label={o.label}
                selected={valuesOf(field.key).includes(o.value)}
                onClick={() => toggleOption(field, o.value)}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  if (fields.length === 0) {
    return trailing ? <div className="flex justify-end">{trailing}</div> : null;
  }

  return (
    <div ref={rootRef} className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        {chipFields.map((field) => {
          const Icon = field.icon;
          const isOpen = openKey === field.key;
          return (
            <div key={field.key} className="relative">
              <span
                className="inline-flex items-center"
                style={{
                  height: TOOLBAR_HEIGHT, borderRadius: 999,
                  border: `1px solid ${isOpen ? "var(--navy)" : "var(--gray-5)"}`,
                  backgroundColor: isOpen ? "var(--navy-light)" : "#ffffff",
                }}
              >
                <button
                  onClick={() => open(field.key)}
                  className="inline-flex items-center gap-1.5 body-small-regular cursor-pointer"
                  style={{ padding: "0 6px 0 12px", height: "100%", color: "var(--gray-10)" }}
                >
                  {Icon && <Icon size={13} style={{ color: "var(--gray-8)" }} />}
                  <span style={{ color: "var(--gray-8)" }}>{field.label}:</span>
                  <span style={{ fontWeight: 600, color: valuesOf(field.key).length ? "var(--navy)" : "var(--gray-7)" }}>{chipText(field)}</span>
                  <ChevronDown size={13} style={{ color: "var(--gray-7)" }} />
                </button>
                <button
                  onClick={() => { setField(field.key, []); setOpenKey(null); }}
                  className="inline-flex items-center justify-center cursor-pointer"
                  style={{ width: 26, height: "100%", color: "var(--gray-7)", borderLeft: "1px solid var(--gray-4)" }}
                  title={`Quitar filtro ${field.label}`}
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              </span>
              {isOpen && renderPopover(field)}
            </div>
          );
        })}

        {availableFields.some((f) => f.key !== pendingField?.key) && (
          <div className="relative">
            <button
              onClick={() => open("__add")}
              className="inline-flex items-center gap-1.5 body-small-bold cursor-pointer transition-colors"
              style={{
                height: TOOLBAR_HEIGHT, padding: "0 14px", borderRadius: 999,
                border: `1px dashed ${openKey === "__add" ? "var(--navy)" : "var(--gray-6)"}`,
                backgroundColor: openKey === "__add" ? "var(--navy-light)" : "transparent",
                color: "var(--navy)",
              }}
            >
              <Plus size={14} strokeWidth={2.5} />
              {activeFields.length === 0 ? "Agregar filtro" : "Filtro"}
            </button>
            {openKey === "__add" && (
              <div style={POPOVER_STYLE}>
                <SearchRow value={search} onChange={setSearch} placeholder="Buscar filtro" />
                <div style={{ maxHeight: 260, overflowY: "auto", padding: "4px 0" }}>
                  {availableFields
                    .filter((f) => f.key !== pendingField?.key && f.label.toLowerCase().includes(search.trim().toLowerCase()))
                    .map((f) => {
                      const Icon = f.icon;
                      return (
                        <button
                          key={f.key}
                          onClick={() => open(f.key)}
                          className="flex items-center gap-2 w-full text-left body-small-regular cursor-pointer transition-colors"
                          style={{ padding: "8px 10px", color: "var(--gray-10)", backgroundColor: "transparent" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--gray-1)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                        >
                          {Icon && <Icon size={14} style={{ color: "var(--gray-8)" }} />}
                          {f.label}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeFields.length > 0 && (
          <button
            onClick={() => { onChange({}); setOpenKey(null); }}
            className="body-small-regular cursor-pointer"
            style={{ color: "var(--gray-8)", padding: "0 6px" }}
          >
            Limpiar
          </button>
        )}
      </div>

      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}
