import { useEffect, useRef, useState } from "react";
import { Filter, Eye, MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Cell, LabelList } from "recharts";
import { PageHeader } from "./kit/PageHeader";
import { AppButton } from "./kit/AppButton";
import { MetricsRow } from "./kit/MetricsRow";
import { BrokersComparativaChart } from "./BrokersComparativa";
import { DataTable } from "./kit/DataTable";
import { StatusBadge } from "./kit/StatusBadge";
import { IconButton } from "./kit/IconButton";
import { TextInput } from "./kit/TextInput";
import { SelectInput } from "./kit/SelectInput";
import { ProgressBar } from "./kit/ProgressBar";
import { Pagination } from "./kit/Pagination";
import { EmptyState } from "./kit/EmptyState";
import { Footer } from "./kit/Footer";

const PAGE_SIZE = 10;

export type EstadoInterno = "activo" | "vacaciones" | "enfermedad" | "incapacidad" | "inactivo";

export interface BrokerInternoRow {
  id: string;
  nombre: string;
  zona: string;
  contratosMes: string;
  contratosAno: string;
  /** Meta de contratos del mes que fija la inmobiliaria maestra para este broker.
   * El cumplimiento (%) se calcula a partir de esto, no es un número suelto — ver
   * calcularCumplimiento(). Editable desde la ficha del broker (BrokerDetalle.tsx). */
  metaMensual: number;
  estado: EstadoInterno;
  estadoDesde?: string;
  estadoHasta?: string;
}

/** % de la meta mensual que ya se cumplió. Redondeado; no se limita a 100 aquí — ProgressBar
 * ya recorta la barra visualmente si alguien supera su meta. */
export function calcularCumplimiento(contratosMes: string, metaMensual: number): number {
  if (!metaMensual || metaMensual <= 0) return 0;
  return Math.round((Number(contratosMes) / metaMensual) * 100);
}

export const BROKERS_INTERNOS_ROWS: BrokerInternoRow[] = [
  { id: "1.020.789.456", nombre: "Angie Carolina Duarte", zona: "Bogotá", contratosMes: "9", contratosAno: "64", metaMensual: 10, estado: "activo" },
  { id: "45.678.912", nombre: "Ruby Esperanza Meza", zona: "Caribe", contratosMes: "7", contratosAno: "58", metaMensual: 9, estado: "activo" },
  { id: "1.014.567.890", nombre: "Julián Esteban Rueda", zona: "Bogotá", contratosMes: "5", contratosAno: "41", metaMensual: 8, estado: "activo" },
  { id: "52.345.678", nombre: "Marcela Quintero Páez", zona: "Occidente", contratosMes: "8", contratosAno: "55", metaMensual: 9, estado: "activo" },
  { id: "1.032.456.789", nombre: "David Santiago Herrera", zona: "Norte", contratosMes: "3", contratosAno: "29", metaMensual: 7, estado: "vacaciones" },
  { id: "79.912.345", nombre: "Lina María Cabrera", zona: "Bogotá", contratosMes: "6", contratosAno: "47", metaMensual: 8, estado: "activo" },
  { id: "1.045.234.567", nombre: "Óscar Iván Salazar", zona: "Caribe", contratosMes: "0", contratosAno: "18", metaMensual: 8, estado: "inactivo" },
  { id: "1.010.987.654", nombre: "Tatiana Reyes Amador", zona: "Sur", contratosMes: "4", contratosAno: "36", metaMensual: 7, estado: "activo" },
];

export const ESTADO_INTERNO_BADGE: Record<EstadoInterno, { label: string; variant: "active" | "pending" | "violet" | "rejected" | "neutral" }> = {
  activo: { label: "Activo", variant: "active" },
  vacaciones: { label: "Vacaciones", variant: "pending" },
  enfermedad: { label: "Enfermedad", variant: "violet" },
  incapacidad: { label: "Incapacidad", variant: "rejected" },
  inactivo: { label: "Inactivo", variant: "neutral" },
};

/** Estados internos que representan una ausencia temporal con fecha de fin. */
export const ESTADOS_AUSENCIA: EstadoInterno[] = ["vacaciones", "enfermedad", "incapacidad"];

const COLUMNS = [
  { key: "id", header: "Documento", width: 130 },
  { key: "nombre", header: "Nombre" },
  { key: "zona", header: "Zona", width: 100 },
  { key: "contratosMes", header: "Contratos mes", width: 115 },
  { key: "contratosAno", header: "Contratos año", width: 115 },
  { key: "metaMensual", header: "Meta del mes", width: 100 },
  { key: "cumplimiento", header: "Cumplimiento meta", width: 180 },
  { key: "estado", header: "Estado", width: 115 },
  { key: "acciones", header: "Acciones", width: 90 },
];

const SEARCH_OPTIONS = [
  { value: "id", label: "Documento" },
  { value: "nombre", label: "Nombre" },
  { value: "zona", label: "Zona" },
];

/** Se calcula sobre los rows reales (no un número fijo), así refleja cualquier
 * cambio de meta que se haga desde la ficha de un broker. */
function metricasBrokers(rows: BrokerInternoRow[]) {
  const contratosMesTotal = rows.reduce((sum, r) => sum + Number(r.contratosMes), 0);
  const contratosAnoTotal = rows.reduce((sum, r) => sum + Number(r.contratosAno), 0);
  const cumplimientoPromedio = rows.length
    ? Math.round(rows.reduce((sum, r) => sum + calcularCumplimiento(r.contratosMes, r.metaMensual), 0) / rows.length)
    : 0;
  return [
    { label: "Brokers internos", value: String(rows.length) },
    { label: "Contratos (Mes actual)", value: String(contratosMesTotal) },
    { label: "Contratos (Año actual)", value: String(contratosAnoTotal) },
    { label: "Cumplimiento promedio", value: `${cumplimientoPromedio}%` },
  ];
}

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

function cumplimientoPorZona(rows: BrokerInternoRow[]) {
  const acc = new Map<string, { sum: number; count: number }>();
  for (const r of rows) {
    const cur = acc.get(r.zona) ?? { sum: 0, count: 0 };
    acc.set(r.zona, { sum: cur.sum + calcularCumplimiento(r.contratosMes, r.metaMensual), count: cur.count + 1 });
  }
  return [...acc.entries()]
    .map(([name, { sum, count }]) => ({ name, value: Math.round(sum / count) }))
    .sort((a, b) => b.value - a.value)
    .map((d) => ({ ...d, color: d.value >= 70 ? "var(--green-status)" : d.value >= 50 ? "var(--orange-status)" : "var(--red-status)" }));
}

function CumplimientoChart({ rows }: { rows: BrokerInternoRow[] }) {
  const { ref, width } = useContainerWidth();
  const data = cumplimientoPorZona(rows);
  return (
    <section
      className="rounded-lg flex flex-col"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
    >
      <h3 className="subtitle" style={{ color: "var(--navy)", marginBottom: 16 }}>Cumplimiento de meta promedio por zona</h3>
      <div ref={ref} style={{ width: "100%" }}>
        {width > 0 && (
          <BarChart width={width} height={230} data={data} margin={{ top: 24, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={{ stroke: "var(--gray-5)" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false} maxBarSize={64}>
              {data.map((d) => <Cell key={d.name} fill={d.color} />)}
              <LabelList dataKey="value" position="top" formatter={(v: number) => `${v}%`} style={{ fill: "var(--navy)", fontSize: 12, fontFamily: "Roboto", fontWeight: 700 }} />
            </Bar>
          </BarChart>
        )}
      </div>
    </section>
  );
}

interface Props {
  rows: BrokerInternoRow[];
  onViewBroker: (broker: BrokerInternoRow) => void;
}

export function BrokersInternos({ rows, onViewBroker }: Props) {
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);

  const doSearch = () => { setApplied({ by: searchBy, q: query }); setPage(1); };
  const clearSearch = () => { setQuery(""); setApplied(null); setPage(1); };

  const sourceRows = rows.filter((r) => {
    if (!applied || !applied.q.trim()) return true;
    const q = applied.q.trim().toLowerCase();
    const fields = applied.by
      ? [String(r[applied.by as keyof BrokerInternoRow] ?? "")]
      : Object.values(r).map(String);
    return fields.some((v) => v.toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil(sourceRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = sourceRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const tableRows = pageRows.map((r) => {
    const badge = ESTADO_INTERNO_BADGE[r.estado];
    return {
      ...r,
      cumplimiento: <ProgressBar value={calcularCumplimiento(r.contratosMes, r.metaMensual)} />,
      estado: <StatusBadge label={badge.label} variant={badge.variant} />,
      acciones: (
        <div className="flex items-center gap-1">
          <IconButton icon={MessageCircle} title="Contactar por WhatsApp" />
          <IconButton icon={Eye} title="Ver detalle" onClick={() => onViewBroker(r)} />
        </div>
      ),
    };
  });

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Brokers Internos"
        description="Gestión y desempeño del equipo comercial interno"
        actions={<AppButton variant="primary" bold>Agregar Broker</AppButton>}
      />

      <MetricsRow metrics={metricasBrokers(rows)} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BrokersComparativaChart />
        <CumplimientoChart rows={rows} />
      </div>

      <section
        className="rounded-lg flex flex-col gap-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <AppButton variant="ghost"><Filter size={14} /> Filtrar</AppButton>
          <div className="flex items-center gap-3">
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>Buscar por:</span>
            <SelectInput options={SEARCH_OPTIONS} value={searchBy} onChange={setSearchBy} className="min-w-[160px]" />
            <TextInput placeholder="Buscar" value={query} onChange={setQuery} onEnter={doSearch} onClear={clearSearch} className="min-w-[200px]" />
            <AppButton variant="secondary" bold onClick={doSearch}>Buscar</AppButton>
          </div>
        </div>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        {tableRows.length > 0 ? (
          <>
            <DataTable columns={COLUMNS} rows={tableRows} onRowClick={(i) => onViewBroker(pageRows[i])} />
            <p className="body-regular text-right" style={{ color: "var(--gray-9)", margin: 0 }}>
              Mostrando <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{pageRows.length}</span> de{" "}
              <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{sourceRows.length}</span>
            </p>
            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <EmptyState
            title="Sin resultados"
            description="No encontramos brokers que coincidan con la búsqueda. Ajusta el criterio e intenta de nuevo."
            action={<AppButton variant="secondary" onClick={clearSearch}>Limpiar búsqueda</AppButton>}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
