import { useEffect, useRef, useState } from "react";
import { Pencil, Eye, Hash, Building2, Home, MapPin, CircleDot, ShieldCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Cell, LabelList } from "recharts";
import { PageHeader } from "./kit/PageHeader";
import { AppButton } from "./kit/AppButton";
import { MetricsRow } from "./kit/MetricsRow";
import { TabBar } from "./kit/TabBar";
import { DataTable } from "./kit/DataTable";
import { StatusBadge } from "./kit/StatusBadge";
import { IconButton } from "./kit/IconButton";
import { Pagination } from "./kit/Pagination";
import { FilterBar } from "./kit/FilterBar";
import type { FilterFieldDef, FilterValues } from "./kit/FilterBar";
import { SearchField } from "./kit/SearchField";
import { TogglePill } from "./kit/TogglePill";
import { EmptyState } from "./kit/EmptyState";
import { Footer } from "./kit/Footer";
import { CrearContrato } from "./CrearContrato";
import type { NuevoContratoResumen } from "./CrearContrato";
import { EstadoContratoDetalle } from "./EstadoContratoDetalle";
import { useAppData } from "../store/AppDataContext";

function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

const PAGE_SIZE = 10;

interface EstudioRow {
  consecutivo: string;
  inmueble: string;
  asegurado: string;
  aseguradora: string;
  email: string;
  celular: string;
}

const ESTUDIO_ROWS: EstudioRow[] = [
  { consecutivo: "-", inmueble: "6021", asegurado: "-", aseguradora: "Seguros Bolívar", email: "-", celular: "3128516692" },
  { consecutivo: "-", inmueble: "6021", asegurado: "-", aseguradora: "Seguros Bolívar", email: "camila.rincon@alquilando.com", celular: "-" },
  { consecutivo: "-", inmueble: "6021", asegurado: "-", aseguradora: "Sura", email: "-", celular: "3132598387" },
  { consecutivo: "-", inmueble: "6458", asegurado: "-", aseguradora: "Sura", email: "-", celular: "3228907591" },
  { consecutivo: "-", inmueble: "6458", asegurado: "-", aseguradora: "Mapfre", email: "-", celular: "3028254633" },
  { consecutivo: "-", inmueble: "6458", asegurado: "-", aseguradora: "Mapfre", email: "-", celular: "3202731879" },
  { consecutivo: "-", inmueble: "6458", asegurado: "-", aseguradora: "Seguros Bolívar", email: "-", celular: "3126321408" },
  { consecutivo: "-", inmueble: "6458", asegurado: "-", aseguradora: "Liberty", email: "-", celular: "3202731879" },
  { consecutivo: "-", inmueble: "6379", asegurado: "-", aseguradora: "Liberty", email: "-", celular: "3004808132" },
  { consecutivo: "-", inmueble: "4631", asegurado: "-", aseguradora: "Sura", email: "christiansenmaria@hotmail.com", celular: "-" },
  { consecutivo: "-", inmueble: "6300", asegurado: "-", aseguradora: "Seguros Bolívar", email: "-", celular: "3115048821" },
  { consecutivo: "-", inmueble: "6021", asegurado: "-", aseguradora: "Mapfre", email: "andres.melo@gmail.com", celular: "-" },
  { consecutivo: "-", inmueble: "4631", asegurado: "-", aseguradora: "Liberty", email: "-", celular: "3186654421" },
];

type EstadoContrato = "elaboracion" | "precontrato" | "rechazado" | "administracion" | "terminado";
type TipoContrato = "comercial" | "vivienda";

interface ContratoRow {
  contrato: string;
  inmobiliaria: string;
  direccion: string;
  inmueble: string;
  zona: string;
  inicio: string;
  fin: string;
  estado: EstadoContrato;
  tipo: TipoContrato;
}

const ELABORACION_ROWS_SEED: ContratoRow[] = [
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "comercial" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "comercial" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "comercial" },
];

const ADMIN_ROWS: ContratoRow[] = [
  { contrato: "2939", inmobiliaria: "Alquilando SAS", direccion: "CL 18 # 100 - 08 OF 3", inmueble: "CL 18 # 100 - 08 OF 3", zona: "BOGOTA", inicio: "2023-06-01", fin: "2027-05-31", estado: "administracion", tipo: "comercial" },
  { contrato: "4367", inmobiliaria: "Consultoria & Marketing Inmobiliario S.A.S", direccion: "CR 85 K # 26 G - 53 AP 909 - BRR MODELIA", inmueble: "CR 85 K # 26 G - 53 AP 909", zona: "Occidente", inicio: "2026-06-01", fin: "2027-05-31", estado: "administracion", tipo: "vivienda" },
  { contrato: "4365", inmobiliaria: "Alquilando Caribe", direccion: "CR 74 # 31 F - 76 AP 1001 - BRR 12 DE OCTUBRE", inmueble: "CR 74 # 31 F - 76 AP 1001", zona: "Norte", inicio: "2026-06-01", fin: "2027-05-31", estado: "administracion", tipo: "vivienda" },
  { contrato: "4360", inmobiliaria: "Alquilando SAS", direccion: "KR 85K # 26G 53 TO 1 AP 1218 - BRR MODELIA", inmueble: "KR 85K # 26G 53 AP 1218", zona: "Occidente", inicio: "2026-05-01", fin: "2027-04-30", estado: "administracion", tipo: "vivienda" },
  { contrato: "4358", inmobiliaria: "Izban", direccion: "CL 50 SUR 93D 38 IN 5 AP 204 - BRR KENNEDY", inmueble: "CL 50 SUR 93D 38 AP 204", zona: "Sur", inicio: "2026-05-01", fin: "2027-04-30", estado: "administracion", tipo: "vivienda" },
  { contrato: "4351", inmobiliaria: "Edificatoria", direccion: "CL 81 # 109 - 10 AP 203 - BRR BOLIVIA", inmueble: "CL 81 # 109 - 10 AP 203", zona: "Occidente", inicio: "2026-04-15", fin: "2027-04-14", estado: "administracion", tipo: "vivienda" },
];

const RECHAZADO_ROWS: ContratoRow[] = [
  { contrato: "-", inmobiliaria: "Broker Externo", direccion: "AV 68 # 40 - 12", inmueble: "Local comercial", zona: "Occidente", inicio: "-", fin: "-", estado: "rechazado", tipo: "comercial" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "CL 90 # 15 - 20 AP 302 - BRR CHICO", inmueble: "Apartamento", zona: "Norte", inicio: "-", fin: "-", estado: "rechazado", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "back bone", direccion: "CR 24 # 63 - 40", inmueble: "Oficina", zona: "Centro", inicio: "-", fin: "-", estado: "rechazado", tipo: "comercial" },
];

const PRECONTRATO_ROWS: ContratoRow[] = [
  { contrato: "-", inmobiliaria: "Consultoria & Marketing Inmobiliario S.A.S", direccion: "CL 47 B SUR # 22 - 55 AP 513 - BRR TUNAL", inmueble: "Apartamento", zona: "Sur", inicio: "2026-07-01", fin: "2027-06-30", estado: "precontrato", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "CL 81 # 109 - 10 AP 203 - BRR BOLIVIA", inmueble: "Apartamento", zona: "Occidente", inicio: "2026-07-01", fin: "2027-06-30", estado: "precontrato", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Broker Externo", direccion: "-", inmueble: "Local comercial", zona: "-", inicio: "-", fin: "-", estado: "precontrato", tipo: "comercial" },
  { contrato: "-", inmobiliaria: "PLAN FAMILIA HOUSE", direccion: "CR 16 # 17 - 00 CONJ - BRR CHIA", inmueble: "Casa", zona: "Norte", inicio: "2026-07-02", fin: "2027-07-01", estado: "precontrato", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "CL 123 # 123 - 123 AD 123 - BRR NORTE", inmueble: "Apartamento", zona: "Norte", inicio: "2026-04-01", fin: "2027-03-31", estado: "precontrato", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "CR 13 # 44 - 39 AP 615 - BRR CENTRO", inmueble: "Apartamento", zona: "Norte", inicio: "2026-04-01", fin: "2027-03-31", estado: "precontrato", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "CR 13 # 44 - 39 AP 615 - BRR CENTRO", inmueble: "Oficina", zona: "Norte", inicio: "2026-04-01", fin: "2027-03-31", estado: "precontrato", tipo: "comercial" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "CR 85 K # 25 G - 53 TO 1 - BRR MODELIA", inmueble: "Apartamento", zona: "Occidente", inicio: "2026-04-01", fin: "2027-03-31", estado: "precontrato", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "back bone", direccion: "AUT 45 A NORTE BIS A # 45 A - 60", inmueble: "Local comercial", zona: "Norte", inicio: "2026-04-01", fin: "2026-06-30", estado: "precontrato", tipo: "comercial" },
  { contrato: "-", inmobiliaria: "-", direccion: "AV 11 A NORTE BIS B # 22 C - 33 SUR", inmueble: "Casa", zona: "Sur", inicio: "-", fin: "-", estado: "precontrato", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "CR 7 # 52 - 44 AP 511 - BRR CHAPINERO", inmueble: "Apartamento", zona: "Norte", inicio: "2026-03-15", fin: "2027-03-14", estado: "precontrato", tipo: "vivienda" },
];

const JURIDICO_ROWS: ContratoRow[] = [...PRECONTRATO_ROWS, ...RECHAZADO_ROWS];

const TERMINADOS_ROWS: ContratoRow[] = [
  { contrato: "4102", inmobiliaria: "Alquilando SAS", direccion: "CL 100 # 15 - 20 AP 501 - BRR CHICO", inmueble: "CL 100 # 15 - 20 AP 501", zona: "Norte", inicio: "2025-01-01", fin: "2025-12-31", estado: "terminado", tipo: "vivienda" },
  { contrato: "4088", inmobiliaria: "Alquilando Caribe", direccion: "CR 50 # 72 - 30 AP 204 - BRR EL PRADO", inmueble: "CR 50 # 72 - 30 AP 204", zona: "Norte", inicio: "2024-11-01", fin: "2025-10-31", estado: "terminado", tipo: "vivienda" },
  { contrato: "4071", inmobiliaria: "Izban", direccion: "CL 45 # 22 - 10 LOCAL 2", inmueble: "CL 45 # 22 - 10 LOCAL 2", zona: "Centro", inicio: "2024-06-01", fin: "2025-05-31", estado: "terminado", tipo: "comercial" },
  { contrato: "4055", inmobiliaria: "Edificatoria", direccion: "CR 15 # 88 - 40 AP 803 - BRR SANTA BARBARA", inmueble: "CR 15 # 88 - 40 AP 803", zona: "Norte", inicio: "2024-03-15", fin: "2025-03-14", estado: "terminado", tipo: "vivienda" },
];

const TABS_SEED = [
  { id: "elaboracion", label: "En elaboración", count: ELABORACION_ROWS_SEED.length },
  { id: "juridico", label: "En aprobación jurídico", count: JURIDICO_ROWS.length },
  { id: "estudio", label: "En estudio de póliza", count: ESTUDIO_ROWS.length },
  { id: "admin", label: "En administración", count: ADMIN_ROWS.length },
  { id: "terminados", label: "Terminados", count: TERMINADOS_ROWS.length },
];

const ETAPA_COLORS: Record<string, string> = {
  elaboracion: "var(--orange-status)",
  juridico: "var(--violeta)",
  estudio: "var(--red-status)",
  admin: "var(--green-status)",
  terminados: "var(--gray-8)",
};

function EtapasChart() {
  const { ref, width } = useContainerWidth();
  const data = TABS_SEED.map((t) => ({ name: t.label, value: t.count, color: ETAPA_COLORS[t.id] }));
  return (
    <section
      className="rounded-lg flex flex-col"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
    >
      <h3 className="subtitle" style={{ color: "var(--navy)", marginBottom: 16 }}>Contratos por etapa del proceso</h3>
      <div ref={ref} style={{ width: "100%" }}>
        {width > 0 && (
          <BarChart width={width} height={230} data={data} margin={{ top: 24, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={{ stroke: "var(--gray-5)" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={false} tickLine={false} label={{ value: "Contratos", angle: -90, position: "insideLeft", offset: 25, style: { fontSize: 11, fill: "var(--gray-9)", fontFamily: "Roboto" } }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false} maxBarSize={64}>
              {data.map((d) => <Cell key={d.name} fill={d.color} />)}
              <LabelList dataKey="value" position="top" style={{ fill: "var(--navy)", fontSize: 12, fontFamily: "Roboto", fontWeight: 700 }} />
            </Bar>
          </BarChart>
        )}
      </div>
    </section>
  );
}

const ESTADO_BADGE: Record<EstadoContrato, { label: string; variant: "pending" | "active" | "violet" | "rejected" | "neutral" }> = {
  elaboracion: { label: "En elaboración", variant: "pending" },
  administracion: { label: "En administración", variant: "active" },
  precontrato: { label: "Pre contrato", variant: "violet" },
  rechazado: { label: "Rechazado", variant: "rejected" },
  terminado: { label: "Terminado", variant: "neutral" },
};

const ESTUDIO_COLUMNS = [
  { key: "consecutivo", header: "Consecutivo", width: 120 },
  { key: "inmueble", header: "N° Inmueble", width: 110 },
  { key: "asegurado", header: "Asegurado" },
  { key: "aseguradora", header: "Aseguradora", width: 140 },
  { key: "email", header: "Email" },
  { key: "celular", header: "Celular", width: 130 },
  { key: "solicitud", header: "Solicitud", width: 120 },
  { key: "contrato", header: "Contrato", width: 120 },
  { key: "opciones", header: "Opciones", width: 100 },
];

const CONTRATO_COLUMNS = [
  { key: "contrato", header: "Contrato", width: 90 },
  { key: "inmobiliaria", header: "Inmobiliaria", width: 140 },
  { key: "direccion", header: "Dirección" },
  { key: "inmueble", header: "Inmueble" },
  { key: "zona", header: "Zona", width: 90 },
  { key: "inicio", header: "Inicio", width: 100 },
  { key: "fin", header: "Finalización", width: 105 },
  { key: "estado", header: "Estado", width: 125 },
  { key: "opciones", header: "Opciones", width: 85 },
];

const SEARCH_OPTIONS = [
  { value: "contrato", label: "Contrato" },
  { value: "inmobiliaria", label: "Inmobiliaria" },
  { value: "direccion", label: "Dirección" },
  { value: "zona", label: "Zona" },
];

const ESTUDIO_SEARCH_OPTIONS = [
  { value: "inmueble", label: "N° Inmueble" },
  { value: "asegurado", label: "Asegurado" },
  { value: "email", label: "Email" },
  { value: "celular", label: "Celular" },
];

const INMOBILIARIA_OPTIONS = Array.from(
  new Set([...ADMIN_ROWS, ...PRECONTRATO_ROWS, ...RECHAZADO_ROWS, ...TERMINADOS_ROWS].map((r) => r.inmobiliaria).filter((v) => v !== "-")),
).sort().map((v) => ({ value: v, label: v }));

const TIPO_INMUEBLE_OPTIONS = [
  { value: "Apartamento", label: "Apartamento" },
  { value: "Casa", label: "Casa" },
  { value: "Oficina", label: "Oficina" },
  { value: "Local comercial", label: "Local comercial" },
];

const ZONA_OPTIONS = [
  { value: "Norte", label: "Norte" },
  { value: "Sur", label: "Sur" },
  { value: "Centro", label: "Centro" },
  { value: "Occidente", label: "Occidente" },
  { value: "BOGOTA", label: "Bogotá" },
];

const ESTADO_OPTIONS = [
  { value: "precontrato", label: "Pre contrato" },
  { value: "rechazado", label: "Rechazado" },
];

const ASEGURADORA_OPTIONS = Array.from(new Set(ESTUDIO_ROWS.map((r) => r.aseguradora)))
  .sort().map((v) => ({ value: v, label: v }));

const FILTER_FIELDS: Record<string, FilterFieldDef> = {
  codigoSimi: { key: "codigoSimi", label: "Código simi", type: "text", placeholder: "Escriba aquí", icon: Hash },
  inmobiliaria: { key: "inmobiliaria", label: "Inmobiliaria", type: "select", options: INMOBILIARIA_OPTIONS, icon: Building2 },
  tipoInmueble: { key: "tipoInmueble", label: "Tipo de inmueble", type: "select", options: TIPO_INMUEBLE_OPTIONS, icon: Home },
  zona: { key: "zona", label: "Zona", type: "select", options: ZONA_OPTIONS, icon: MapPin },
  estado: { key: "estado", label: "Estado", type: "select", options: ESTADO_OPTIONS, icon: CircleDot },
  aseguradora: { key: "aseguradora", label: "Aseguradora", type: "select", options: ASEGURADORA_OPTIONS, icon: ShieldCheck },
};

// Cada tab solo expone los filtros que le aportan: en elaboración y administración
// el estado es único, y la aseguradora solo existe una vez que hay estudio de póliza.
const FILTERS_BY_TAB: Record<string, string[]> = {
  elaboracion: ["inmobiliaria", "tipoInmueble", "zona"],
  juridico: ["inmobiliaria", "tipoInmueble", "zona", "estado"],
  estudio: ["codigoSimi", "aseguradora"],
  admin: ["codigoSimi", "inmobiliaria", "tipoInmueble", "zona"],
  terminados: ["codigoSimi", "inmobiliaria", "tipoInmueble", "zona"],
};

const EMPTY_FILTERS: FilterValues = {};

interface Props {
  onDirtyChange?: (guard: { onSave: () => void; onDiscard: () => void } | null) => void;
}

export function Contratos({ onDirtyChange }: Props = {}) {
  const [tab, setTab] = useState("elaboracion");
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);
  const [filters, setFilters] = useState<FilterValues>(EMPTY_FILTERS);
  const [bogota, setBogota] = useState(true);
  const [caribe, setCaribe] = useState(true);
  const [creating, setCreating] = useState(false);
  const [viewingEstado, setViewingEstado] = useState<ContratoRow | null>(null);
  const [loading, setLoading] = useState(true);
  const { contratos: elaboracionRows, addContrato } = useAppData();

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [tab, page]);

  const handleNuevoContrato = (data: NuevoContratoResumen) => {
    addContrato({
      contrato: String(2000 + elaboracionRows.length + 1),
      inmobiliaria: data.inmobiliaria,
      direccion: data.direccion,
      inmueble: data.inmueble,
      zona: data.zona,
      inicio: "-",
      fin: "-",
      estado: "elaboracion",
      tipo: data.tipo,
      propietario: data.propietario,
      inquilino: data.inquilino,
    });
  };

  if (creating) {
    return (
      <CrearContrato
        onBack={() => setCreating(false)}
        onFinish={() => setCreating(false)}
        onSubmit={handleNuevoContrato}
        onDirtyChange={onDirtyChange}
      />
    );
  }

  if (viewingEstado) {
    return (
      <EstadoContratoDetalle
        onBack={() => setViewingEstado(null)}
        numeroContrato={viewingEstado.contrato !== "-" ? viewingEstado.contrato : undefined}
      />
    );
  }

  const changeTab = (id: string) => { setTab(id); setPage(1); setQuery(""); setApplied(null); setSearchBy(""); setFilters(EMPTY_FILTERS); };
  const applyFilters = (v: FilterValues) => { setFilters(v); setPage(1); };
  const clearFilters = () => { setFilters(EMPTY_FILTERS); setPage(1); };

  const activeFields = FILTERS_BY_TAB[tab] ?? [];
  const filterFields = activeFields.map((k) => FILTER_FIELDS[k]);
  const filterValues = (key: string) => (activeFields.includes(key) ? filters[key] ?? [] : []);
  /** El filtro pasa si no hay valores seleccionados o si alguno coincide. */
  const matchesAny = (key: string, test: (value: string) => boolean) => {
    const vals = filterValues(key);
    return vals.length === 0 || vals.some(test);
  };
  const doSearch = () => { setApplied({ by: searchBy, q: query }); setPage(1); };
  const clearSearch = () => { setQuery(""); setApplied(null); setPage(1); };

  const filterContratos = (rows: ContratoRow[]) =>
    rows.filter((r) => {
      const esCaribe = r.inmobiliaria.toLowerCase().includes("caribe");
      if (esCaribe && !caribe) return false;
      if (!esCaribe && !bogota) return false;

      if (!matchesAny("codigoSimi", (v) => r.contrato.toLowerCase().includes(v.toLowerCase()))) return false;
      if (!matchesAny("inmobiliaria", (v) => r.inmobiliaria === v)) return false;
      if (!matchesAny("tipoInmueble", (v) => r.inmueble.toLowerCase().includes(v.toLowerCase()))) return false;
      if (!matchesAny("zona", (v) => r.zona === v)) return false;
      if (!matchesAny("estado", (v) => r.estado === v)) return false;

      if (!applied || !applied.q.trim()) return true;
      const q = applied.q.trim().toLowerCase();
      const fields = applied.by
        ? [String(r[applied.by as keyof ContratoRow] ?? "")]
        : Object.values(r).map(String);
      return fields.some((v) => v.toLowerCase().includes(q));
    });

  const filterEstudio = (rows: EstudioRow[]) =>
    rows.filter((r) => {
      if (!matchesAny("codigoSimi", (v) => r.inmueble.toLowerCase().includes(v.toLowerCase()))) return false;
      if (!matchesAny("aseguradora", (v) => r.aseguradora === v)) return false;

      if (!applied || !applied.q.trim()) return true;
      const q = applied.q.trim().toLowerCase();
      const fields = applied.by
        ? [String(r[applied.by as keyof EstudioRow] ?? "")]
        : Object.values(r).map(String);
      return fields.some((v) => v.toLowerCase().includes(q));
    });

  const CONTRATO_ROWS_BY_TAB: Record<string, ContratoRow[]> = {
    elaboracion: elaboracionRows,
    juridico: JURIDICO_ROWS,
    admin: ADMIN_ROWS,
    terminados: TERMINADOS_ROWS,
  };

  const tabs = TABS_SEED.map((t) => t.id === "elaboracion" ? { ...t, count: elaboracionRows.length } : t);

  const isEstudio = tab === "estudio";
  const sourceRows = isEstudio
    ? filterEstudio(ESTUDIO_ROWS)
    : filterContratos(CONTRATO_ROWS_BY_TAB[tab] ?? []);

  const enTramite = elaboracionRows.length + JURIDICO_ROWS.length + ESTUDIO_ROWS.length;
  const evaluadosJuridico = PRECONTRATO_ROWS.length + RECHAZADO_ROWS.length;
  const pctAprobados = Math.round((PRECONTRATO_ROWS.length / evaluadosJuridico) * 100);
  const pctRechazados = 100 - pctAprobados;

  const totalPages = Math.max(1, Math.ceil(sourceRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = sourceRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const tableRows = isEstudio
    ? (pageRows as EstudioRow[]).map((r) => ({
        ...r,
        solicitud: <StatusBadge label="Pendiente" variant="registered" />,
        contrato: <StatusBadge label="Asignado" variant="active" />,
        opciones: <IconButton icon={Eye} title="Ver" />,
      }))
    : (pageRows as ContratoRow[]).map((r) => {
        const badge = ESTADO_BADGE[r.estado];
        return {
          ...r,
          estado: <StatusBadge label={badge.label} variant={badge.variant} />,
          opciones: tab === "elaboracion"
            ? <IconButton icon={Pencil} title="Continuar edición" onClick={() => setCreating(true)} />
            : <IconButton icon={Eye} title="Ver resumen" onClick={() => setViewingEstado(r)} />,
        };
      });

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Contratos en administración"
        description="Administra y revisa todos tus procesos de manera fácil y rápida"
        actions={!isEstudio && (
          <AppButton variant="primary" bold onClick={() => setCreating(true)}>Crear nuevo contrato</AppButton>
        )}
      />

      <MetricsRow
        metrics={[
          { label: "Contratos en administración", value: "1578" },
          { label: "En trámite (elaboración + jurídico + estudio)", value: String(enTramite) },
          {
            label: "Tasa de aprobación jurídico",
            breakdown: [
              { value: `${pctAprobados} %`, label: "Aprobados" },
              { value: `${pctRechazados} %`, label: "Rechazados" },
            ],
          },
          { label: "Terminados este mes", value: String(TERMINADOS_ROWS.length) },
        ]}
      />

      <MetricsRow
        metrics={[
          { label: "En vencimiento (próx. 90 días)", value: "128", showEye: true },
          { label: "Tiempo promedio elaboración a firma", value: "18 días" },
          { label: "Sustituciones del mes", value: "2" },
          { label: "Crecimiento neto de contratos", value: "-2" },
        ]}
      />

      <EtapasChart />

      <TabBar tabs={tabs} active={tab} onChange={changeTab} />

      <section
        className="rounded-lg flex flex-col gap-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex items-start gap-3 flex-wrap">
          <SearchField
            scopes={isEstudio ? ESTUDIO_SEARCH_OPTIONS : SEARCH_OPTIONS}
            scope={searchBy}
            onScopeChange={setSearchBy}
            value={query}
            onChange={setQuery}
            onSearch={doSearch}
            onClear={clearSearch}
            className="w-[300px] shrink-0"
          />
          <span style={{ width: 1, height: 24, backgroundColor: "var(--gray-4)", marginTop: 6 }} />
          <div className="flex-1 min-w-[200px]">
            <FilterBar fields={filterFields} values={filters} onChange={applyFilters} />
          </div>
          {!isEstudio && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Regional:</span>
              <TogglePill label="Bogotá" checked={bogota} onChange={(v) => { setBogota(v); setPage(1); }} />
              <TogglePill label="Caribe" checked={caribe} onChange={(v) => { setCaribe(v); setPage(1); }} />
            </div>
          )}
        </div>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        {tableRows.length > 0 ? (
          <>
            <DataTable
              columns={isEstudio ? ESTUDIO_COLUMNS : CONTRATO_COLUMNS}
              rows={tableRows}
              loading={loading}
              onRowClick={!isEstudio ? (i) => {
                const row = pageRows[i] as ContratoRow;
                if (row.estado === "elaboracion") setCreating(true);
                else setViewingEstado(true);
              } : undefined}
            />
            <p className="body-regular text-right" style={{ color: "var(--gray-9)", margin: 0 }}>
              Mostrando <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{pageRows.length}</span> de{" "}
              <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{sourceRows.length}</span>
            </p>
            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <EmptyState
            title="Sin resultados"
            description="No encontramos contratos que coincidan con los filtros aplicados. Ajusta la búsqueda o los tipos de contrato."
            action={<AppButton variant="secondary" onClick={() => { clearSearch(); clearFilters(); }}>Limpiar búsqueda y filtros</AppButton>}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
