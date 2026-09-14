import { useEffect, useRef, useState } from "react";
import { Filter, Eye } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { PageHeader } from "./kit/PageHeader";
import { AppButton } from "./kit/AppButton";
import { MetricsRow } from "./kit/MetricsRow";
import { DataTable } from "./kit/DataTable";
import { StatusBadge } from "./kit/StatusBadge";
import { IconButton } from "./kit/IconButton";
import { TextInput } from "./kit/TextInput";
import { SelectInput } from "./kit/SelectInput";
import { Pagination } from "./kit/Pagination";
import { EmptyState } from "./kit/EmptyState";
import { Footer } from "./kit/Footer";
import { PropietarioDetalle } from "./PropietarioDetalle";
import { useAppData } from "../store/AppDataContext";
import type { PolizaHogarInfo } from "./SegurosAdmin";

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

export interface PropietarioRow {
  cedula: string;
  nombre: string;
  inmobiliaria: string;
  direccion: string;
  correo: string;
  telefono: string;
  estado: "ejecucion" | "nodisponible";
  vip?: boolean;
  tipo: "persona" | "empresa";
  genero?: "M" | "F";
  zona: string;
  /** Seguro de Hogar activo: se muestra en la ficha y sirve para priorizar tickets y para el
   * listado de "Seguros" en la inmobiliaria maestra (ver SegurosAdmin.tsx). */
  polizaHogar?: PolizaHogarInfo;
}

/** Exportado para que Propietarios/Inquilinos y SegurosAdmin usen la misma lista, sin duplicar mocks. */
export const PROPIETARIOS_ROWS: PropietarioRow[] = [
  { cedula: "53039117", nombre: "Francy Barrera", inmobiliaria: "", direccion: "", correo: "francybarrera@gmail.com", telefono: "3148640887", estado: "nodisponible", vip: true, tipo: "persona", genero: "F", zona: "Sur", polizaHogar: { numeroPoliza: "AL-441209", plan: "Plan Clásico", asistencia: "Asistencias M", inmueble: "Sin dirección registrada", desde: "02 Sept. 2026" } },
  { cedula: "—", nombre: "Sandra Mora", inmobiliaria: "Alquilando Caribe", direccion: "Manga Av Jimenez Calle 26 No.17-64 Local 1", correo: "sandramoramora8@gmail.com", telefono: "3052380617", estado: "ejecucion", tipo: "persona", genero: "F", zona: "Caribe" },
  { cedula: "51967831", nombre: "Nubia Rodriguez", inmobiliaria: "Consultoria & Marketing Inmobiliario S.a.s", direccion: "Cr 85 K # 26 G - 53 Ap 909 - Brr Modelia", correo: "nubia.rodriguez0905@gmail.com", telefono: "3138892767", estado: "ejecucion", tipo: "persona", genero: "F", zona: "Occidente" },
  { cedula: "1044916467", nombre: "Diana Riaño", inmobiliaria: "", direccion: "", correo: "diana.riano@outlook.com", telefono: "18323346332", estado: "nodisponible", tipo: "persona", genero: "F", zona: "Norte" },
  { cedula: "1019066495", nombre: "Nestor Mendivelso", inmobiliaria: "Consultoria & Marketing Inmobiliario S.a.s", direccion: "Cl 53 # 85 M - 50 Ap 103 - Brr Los Monjes", correo: "ingearcoespecializada@gmail.com", telefono: "3204979552", estado: "ejecucion", tipo: "persona", genero: "M", zona: "Noroccidente" },
  { cedula: "—", nombre: "Fuentes De Ortiz Sas", inmobiliaria: "", direccion: "", correo: "paula@fuentesdeortiz.com", telefono: "3107776449", estado: "nodisponible", tipo: "empresa", zona: "Centro" },
  { cedula: "80796110", nombre: "Henry Gamba", inmobiliaria: "Consultoria & Marketing Inmobiliario S.a.s", direccion: "Cr 85 K # 26 G - 53 Ap 518 - Brr Fontibon", correo: "leonardogamba1@gmail.com", telefono: "3173827772", estado: "ejecucion", tipo: "persona", genero: "M", zona: "Occidente" },
  { cedula: "73109728", nombre: "Carlos Puente", inmobiliaria: "Alquilando Caribe", direccion: "Cr 22 # 26 - 66 Ap 2 - Brr Manga", correo: "carlospuentevargas63@gmail.com", telefono: "3024177269", estado: "ejecucion", tipo: "persona", genero: "M", zona: "Caribe" },
  { cedula: "1014299965", nombre: "Laura Zuluaga", inmobiliaria: "C&m", direccion: "Cl 53 # 85 M - 50 T 2 Ap 401", correo: "laurazuzua@gmail.com", telefono: "3226343350", estado: "ejecucion", tipo: "persona", genero: "F", zona: "Noroccidente" },
  { cedula: "1051662165", nombre: "Jessica Miranda", inmobiliaria: "Alquilando Sas", direccion: "Kr 58b 130 61 Ap 414", correo: "jessica.mirandan22@gmail.com", telefono: "+34642110247", estado: "ejecucion", tipo: "persona", genero: "F", zona: "Norte" },
  { cedula: "79456123", nombre: "Mauricio Leon", inmobiliaria: "Alquilando Sas", direccion: "Cr 11 # 70 - 50 Of 305", correo: "mauricioleon@gmail.com", telefono: "3001112233", estado: "ejecucion", vip: true, tipo: "persona", genero: "M", zona: "Centro", polizaHogar: { numeroPoliza: "AL-330871", plan: "Plan Premium", asistencia: "Asistencias L", inmueble: "Cr 11 # 70 - 50 Of 305", desde: "28 Ago. 2026" } },
  { cedula: "52120987", nombre: "Patricia Soto", inmobiliaria: "Alquilando Caribe", direccion: "Cl 100 # 14 - 55 Ap 701", correo: "patriciasoto@gmail.com", telefono: "3009998877", estado: "nodisponible", tipo: "persona", genero: "F", zona: "Norte" },
];

const ESTADO_BADGE = {
  ejecucion: { label: "En ejecución", variant: "active" as const },
  nodisponible: { label: "No disponible", variant: "rejected" as const },
};

const COLUMNS = [
  { key: "cedula", header: "Cédula", width: 100 },
  { key: "nombre", header: "Nombre", width: 130 },
  { key: "zona", header: "Zona", width: 100 },
  { key: "tipo", header: "Tipo", width: 90 },
  { key: "direccion", header: "Dirección" },
  { key: "telefono", header: "Teléfono", width: 110 },
  { key: "estado", header: "Estado", width: 120 },
  { key: "opciones", header: "Opciones", width: 80, align: "center" as const },
];

const SEARCH_OPTIONS = [
  { value: "cedula", label: "Cédula" },
  { value: "nombre", label: "Nombre" },
  { value: "correo", label: "Correo" },
  { value: "zona", label: "Zona" },
];

const PAGE_SIZE = 10;
const TOTAL = 1223;

// Proporciones tomadas de la muestra (PROPIETARIOS_ROWS) y escaladas al total real de propietarios.
const activos = Math.round((TOTAL * PROPIETARIOS_ROWS.filter((r) => r.estado === "ejecucion").length) / PROPIETARIOS_ROWS.length);
const noDisponibles = TOTAL - activos;
const vip = Math.round((TOTAL * PROPIETARIOS_ROWS.filter((r) => r.vip).length) / PROPIETARIOS_ROWS.length);

const empresas = PROPIETARIOS_ROWS.filter((r) => r.tipo === "empresa").length;
const pctEmpresa = Math.round((empresas / PROPIETARIOS_ROWS.length) * 100);

const personas = PROPIETARIOS_ROWS.filter((r) => r.tipo === "persona");
const mujeres = personas.filter((r) => r.genero === "F").length;
const pctMujeres = Math.round((mujeres / personas.length) * 100);

const ZONA_COLORS: Record<string, string> = {
  Norte: "var(--navy)",
  Occidente: "var(--orange-status)",
  Centro: "var(--green-status)",
  Caribe: "var(--violeta)",
  Noroccidente: "var(--red-status)",
  Sur: "#795548",
};

function agruparProporcional<T>(rows: T[], key: (r: T) => string, total: number, colors: Record<string, string>) {
  const conteo = new Map<string, number>();
  for (const r of rows) { const k = key(r); conteo.set(k, (conteo.get(k) ?? 0) + 1); }
  return [...conteo.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({
      name,
      value: Math.round((total * count) / rows.length),
      color: colors[name] ?? "var(--gray-8)",
    }));
}

const zonaTop = agruparProporcional(PROPIETARIOS_ROWS, (r) => r.zona, TOTAL, ZONA_COLORS)[0];
const pctZonaTop = Math.round((zonaTop.value / TOTAL) * 100);

const CHART_CARD_HEIGHT = 300;

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-lg flex flex-col"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px", height: CHART_CARD_HEIGHT }}
    >
      <h3 className="subtitle" style={{ color: "var(--navy)", marginBottom: 16 }}>{title}</h3>
      <div className="flex-1 min-h-0 flex flex-col justify-center">{children}</div>
    </section>
  );
}

function PieChartCard({ title, data }: { title: string; data: { name: string; value: number; color: string }[] }) {
  const { ref, width } = useContainerWidth();
  return (
    <ChartCard title={title}>
      <div className="flex items-center gap-6">
        <div ref={ref} style={{ width: 160, flexShrink: 0 }}>
          {width > 0 && (
            <PieChart width={160} height={160}>
              <Pie data={data} cx="50%" cy="50%" outerRadius={68} dataKey="value" isAnimationActive={false}>
                {data.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "var(--radius-md)", borderWidth: 1, borderStyle: "solid", borderColor: "var(--gray-4)", backgroundColor: "#ffffff", fontFamily: "Roboto", fontSize: 12 }} />
            </PieChart>
          )}
        </div>
        <div className="grid grid-cols-1 gap-y-2 flex-1 min-w-0">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="shrink-0 rounded-sm" style={{ width: 12, height: 12, backgroundColor: d.color }} />
                <span className="body-bold truncate" style={{ color: "var(--navy)" }}>{d.name}</span>
              </div>
              <span className="body-regular" style={{ color: "var(--gray-10)" }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

const empresasTotal = Math.round((TOTAL * empresas) / PROPIETARIOS_ROWS.length);
const TIPO_DATA = [
  { name: "Persona natural", value: TOTAL - empresasTotal, color: "var(--navy)" },
  { name: "Empresa", value: empresasTotal, color: "var(--orange-status)" },
];

export function Propietarios({ initialCedula }: { initialCedula?: string } = {}) {
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);
  // Llega desde el listado de "Seguros": abre directo la ficha de ese propietario.
  const [selected, setSelected] = useState<PropietarioRow | null>(
    () => (initialCedula ? PROPIETARIOS_ROWS.find((r) => r.cedula === initialCedula) ?? null : null),
  );
  const { propietarios } = useAppData();

  if (selected) {
    return <PropietarioDetalle propietario={selected} onBack={() => setSelected(null)} />;
  }

  const doSearch = () => { setApplied({ by: searchBy, q: query }); setPage(1); };
  const clearSearch = () => { setQuery(""); setApplied(null); setPage(1); };

  const nuevosRows: PropietarioRow[] = propietarios.map((p) => ({
    cedula: p.numeroDocumento,
    nombre: p.nombre,
    inmobiliaria: "Alquilando SAS",
    direccion: p.direccion,
    correo: p.correo,
    telefono: p.telefono,
    estado: "ejecucion",
    tipo: "persona",
    zona: "-",
  }));

  const allRows = [...nuevosRows, ...PROPIETARIOS_ROWS];

  const filtered = allRows.filter((r) => {
    if (!applied || !applied.q.trim()) return true;
    const q = applied.q.trim().toLowerCase();
    const fields = applied.by ? [String(r[applied.by as keyof PropietarioRow] ?? "")] : Object.values(r).map(String);
    return fields.some((v) => v.toLowerCase().includes(q));
  });

  const totalRows = applied ? filtered.length : TOTAL + nuevosRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const tableRows = pageRows.map((r) => ({
    ...r,
    tipo: r.tipo === "empresa" ? "Empresa" : "Persona",
    estado: <StatusBadge label={ESTADO_BADGE[r.estado].label} variant={ESTADO_BADGE[r.estado].variant} />,
    opciones: <IconButton icon={Eye} title="Ver propietario" onClick={() => setSelected(r)} />,
  }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Propietarios"
        description="Gestiona los propietarios, sus inmuebles y estados de cuenta en un solo lugar."
      />

      <MetricsRow
        metrics={[
          { label: "Propietarios totales", value: String(TOTAL) },
          {
            label: "Tipo de propietario",
            breakdown: [
              { value: `${100 - pctEmpresa} %`, label: "Persona natural" },
              { value: `${pctEmpresa} %`, label: "Empresa" },
            ],
          },
          {
            label: "Género (personas naturales)",
            breakdown: [
              { value: `${pctMujeres} %`, label: "Mujeres" },
              { value: `${100 - pctMujeres} %`, label: "Hombres" },
            ],
          },
          { label: "Propietarios VIP", value: String(vip), showEye: true },
        ]}
      />

      <MetricsRow
        metrics={[
          { label: "Activos (en ejecución)", value: String(activos) },
          { label: "No disponibles", value: String(noDisponibles) },
          { label: "Zona con mayor concentración", value: `${zonaTop.name} (${pctZonaTop} %)` },
          { label: "Empresas registradas", value: String(empresasTotal) },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PieChartCard title="Distribución geográfica" data={agruparProporcional(PROPIETARIOS_ROWS, (r) => r.zona, TOTAL, ZONA_COLORS)} />
        <PieChartCard title="Persona natural vs. empresa" data={TIPO_DATA} />
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
            <DataTable columns={COLUMNS} rows={tableRows} onRowClick={(i) => setSelected(pageRows[i])} />
            <p className="body-regular text-right" style={{ color: "var(--gray-9)", margin: 0 }}>
              Mostrando <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{pageRows.length}</span> de{" "}
              <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{totalRows}</span>
            </p>
            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <EmptyState
            title="Sin resultados"
            description="No encontramos propietarios que coincidan con la búsqueda. Ajusta los criterios e intenta de nuevo."
            action={<AppButton variant="secondary" onClick={clearSearch}>Limpiar búsqueda</AppButton>}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
