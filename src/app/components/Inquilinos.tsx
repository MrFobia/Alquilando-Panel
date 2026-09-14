import { useEffect, useRef, useState } from "react";
import { Filter, Eye } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, LabelList } from "recharts";
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
import { InquilinoDetalle } from "./InquilinoDetalle";
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

export interface InquilinoRow {
  cedula: string;
  nombre: string;
  inmobiliaria: string;
  direccion: string;
  correo: string;
  telefono: string;
  estado: "ejecucion" | "finalizado" | "mora";
  edad: number;
  zona: string;
  score: number;
  tipo: "natural" | "corporativo";
  /** Seguro de Hogar activo: se muestra en la ficha y en el listado de "Seguros" de la
   * inmobiliaria maestra (ver SegurosAdmin.tsx). */
  polizaHogar?: PolizaHogarInfo;
}

/** Exportado para que Propietarios/Inquilinos y SegurosAdmin usen la misma lista, sin duplicar mocks. */
export const INQUILINOS_ROWS: InquilinoRow[] = [
  { cedula: "1032423930", nombre: "Nelson Diaz", inmobiliaria: "Alquilando Caribe", direccion: "Cr 3 # 44 A - 401 Norte 401 - Brr Cabrera", correo: "nelsondiaz_88@hotmail.com", telefono: "3138193904", estado: "ejecucion", edad: 29, zona: "Caribe", score: 710, tipo: "natural", polizaHogar: { numeroPoliza: "AL-778354", plan: "Plan Clásico", asistencia: "Asistencias S", inmueble: "Carrera 23 # 45 - 34 sur", desde: "14 Sept. 2026" } },
  { cedula: "42001731", nombre: "Maria Lopez", inmobiliaria: "Alquilando Sas", direccion: "Cl 81 # 109 - 10 Ap 203 - Brr Bolivia", correo: "angelicapantoja1309@gmail.com", telefono: "3044677006", estado: "ejecucion", edad: 34, zona: "Occidente", score: 640, tipo: "natural" },
  { cedula: "1057570810", nombre: "Ibeth Leal", inmobiliaria: "Alquilando", direccion: "Kr 6 51 21 Ap 405", correo: "ibeth.leal07@gmail.com", telefono: "3508653006", estado: "ejecucion", edad: 41, zona: "Centro", score: 820, tipo: "natural" },
  { cedula: "—", nombre: "Michael Arias", inmobiliaria: "Alquilando Sas", direccion: "Cl 44 13 45 Lc 1", correo: "michaelsarias2019@gmail.com", telefono: "3152743645", estado: "ejecucion", edad: 26, zona: "Centro", score: 590, tipo: "natural" },
  { cedula: "41783650", nombre: "Claudia Alzate", inmobiliaria: "Alquilando Sas", direccion: "Ak 11 119 31 Ap 611", correo: "nenaalzate60@hotmail.com", telefono: "3153598992", estado: "ejecucion", edad: 52, zona: "Norte", score: 760, tipo: "natural" },
  { cedula: "31658319", nombre: "Adriana Gamboa", inmobiliaria: "Consultoria & Marketing Inmobiliario S.a.s", direccion: "Cr 85 K # 26 G - 53 Ap 909 - Brr Modelia", correo: "reinosaludablesas@gmail.com", telefono: "3152537758", estado: "ejecucion", edad: 38, zona: "Occidente", score: 700, tipo: "corporativo" },
  { cedula: "1128053182", nombre: "Eduardo Gonzalez", inmobiliaria: "Alquilando Caribe", direccion: "Cr 74 # 31 F - 76 Ap 1001 - Brr 12 De Octubre", correo: "edugonzalez87@outlook.com", telefono: "3164423774", estado: "ejecucion", edad: 45, zona: "Caribe", score: 830, tipo: "natural" },
  { cedula: "1110060638", nombre: "Yamid Basto", inmobiliaria: "Alquilando Sas", direccion: "Cr 7 # 52 - 44 Ap 511 - Brr Chapinero", correo: "yamidb18@gmail.com", telefono: "3144084216", estado: "ejecucion", edad: 31, zona: "Norte", score: 680, tipo: "natural" },
  { cedula: "1004383068", nombre: "Dariane Castro", inmobiliaria: "Consultoria & Marketing Inmobiliario S.a.s", direccion: "Cl 53 # 85 M - 50 Ap 103 - Brr Los Monjes", correo: "krystalvcp01@gmail.com", telefono: "3173799081", estado: "ejecucion", edad: 27, zona: "Noroccidente", score: 610, tipo: "corporativo" },
  { cedula: "—", nombre: "Gladis Malpica", inmobiliaria: "Alquilando Sas", direccion: "Calle 37 # 13-26 Local Central", correo: "nayibemalcipa@gmail.com", telefono: "3144590644", estado: "ejecucion", edad: 49, zona: "Centro", score: 750, tipo: "corporativo" },
  { cedula: "79854120", nombre: "Carlos Rincon", inmobiliaria: "Alquilando Sas", direccion: "Cr 15 # 93 - 47 Ap 502 - Brr Chico", correo: "carlosrincon@gmail.com", telefono: "3001234567", estado: "finalizado", edad: 36, zona: "Norte", score: 690, tipo: "natural" },
  { cedula: "52789456", nombre: "Paola Martinez", inmobiliaria: "Alquilando Caribe", direccion: "Cl 127 # 7 - 30 Casa 12", correo: "paomartinez@gmail.com", telefono: "3009876543", estado: "mora", edad: 33, zona: "Sur", score: 540, tipo: "natural" },
  { cedula: "1015478932", nombre: "Andres Vargas", inmobiliaria: "Alquilando", direccion: "Av 19 # 104 - 22 Ap 802", correo: "andresvargas@gmail.com", telefono: "3015558899", estado: "ejecucion", edad: 40, zona: "Norte", score: 800, tipo: "natural", polizaHogar: { numeroPoliza: "AL-119042", plan: "Plan Básico", asistencia: "Asistencias S", inmueble: "Av 19 # 104 - 22 Ap 802", desde: "15 Ago. 2026" } },
];

const ESTADO_BADGE = {
  ejecucion: { label: "En ejecución", variant: "active" as const },
  finalizado: { label: "Finalizado", variant: "neutral" as const },
  mora: { label: "En mora", variant: "rejected" as const },
};

const COLUMNS = [
  { key: "cedula", header: "Cédula", width: 100 },
  { key: "nombre", header: "Nombre", width: 115 },
  { key: "zona", header: "Zona", width: 100 },
  { key: "edad", header: "Edad", width: 70 },
  { key: "score", header: "Score", width: 80 },
  { key: "direccion", header: "Dirección" },
  { key: "telefono", header: "Teléfono", width: 100 },
  { key: "estado", header: "Estado", width: 110 },
  { key: "opciones", header: "Opciones", width: 80, align: "center" as const },
];

const SEARCH_OPTIONS = [
  { value: "cedula", label: "Cédula" },
  { value: "nombre", label: "Nombre" },
  { value: "correo", label: "Correo" },
  { value: "zona", label: "Zona" },
];

const PAGE_SIZE = 10;
const TOTAL = 1552;

// Proporciones tomadas de la muestra (INQUILINOS_ROWS) y escaladas al total real de inquilinos.
const activos = Math.round((TOTAL * INQUILINOS_ROWS.filter((r) => r.estado === "ejecucion").length) / INQUILINOS_ROWS.length);
const enMora = Math.round((TOTAL * INQUILINOS_ROWS.filter((r) => r.estado === "mora").length) / INQUILINOS_ROWS.length);
const pctMora = Math.round((enMora / TOTAL) * 100);

const corporativos = INQUILINOS_ROWS.filter((r) => r.tipo === "corporativo").length;
const pctCorporativo = Math.round((corporativos / INQUILINOS_ROWS.length) * 100);

const scorePromedio = Math.round(INQUILINOS_ROWS.reduce((sum, r) => sum + r.score, 0) / INQUILINOS_ROWS.length);
const edadPromedio = Math.round(INQUILINOS_ROWS.reduce((sum, r) => sum + r.edad, 0) / INQUILINOS_ROWS.length);

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

const zonaTop = agruparProporcional(INQUILINOS_ROWS, (r) => r.zona, TOTAL, ZONA_COLORS)[0];
const pctZonaTop = Math.round((zonaTop.value / TOTAL) * 100);

const SCORE_BUCKETS: { name: string; test: (s: number) => boolean; color: string }[] = [
  { name: "Bajo (<650)", test: (s) => s < 650, color: "var(--red-status)" },
  { name: "Medio (650-780)", test: (s) => s >= 650 && s <= 780, color: "var(--orange-status)" },
  { name: "Alto (>780)", test: (s) => s > 780, color: "var(--green-status)" },
];

function distribucionScore(rows: InquilinoRow[], total: number) {
  return SCORE_BUCKETS.map((b) => ({
    name: b.name,
    value: Math.round((total * rows.filter((r) => b.test(r.score)).length) / rows.length),
    color: b.color,
  }));
}

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

function ZonaChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const { ref, width } = useContainerWidth();
  return (
    <ChartCard title="Distribución por zona">
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

function ScoreChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const { ref, width } = useContainerWidth();
  return (
    <ChartCard title="Distribución por score crediticio">
      <div ref={ref} style={{ width: "100%" }}>
        {width > 0 && (
          <BarChart width={width} height={200} data={data} margin={{ top: 24, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={{ stroke: "var(--gray-5)" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={false} tickLine={false} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false} maxBarSize={64}>
              {data.map((d) => <Cell key={d.name} fill={d.color} />)}
              <LabelList dataKey="value" position="top" style={{ fill: "var(--navy)", fontSize: 12, fontFamily: "Roboto", fontWeight: 700 }} />
            </Bar>
          </BarChart>
        )}
      </div>
    </ChartCard>
  );
}

export function Inquilinos({ initialCedula }: { initialCedula?: string } = {}) {
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);
  // Llega desde el listado de "Seguros": abre directo la ficha de ese inquilino.
  const [selected, setSelected] = useState<InquilinoRow | null>(
    () => (initialCedula ? INQUILINOS_ROWS.find((r) => r.cedula === initialCedula) ?? null : null),
  );
  const { inquilinos } = useAppData();

  if (selected) {
    return <InquilinoDetalle inquilino={selected} onBack={() => setSelected(null)} />;
  }

  const doSearch = () => { setApplied({ by: searchBy, q: query }); setPage(1); };
  const clearSearch = () => { setQuery(""); setApplied(null); setPage(1); };

  const nuevosRows: InquilinoRow[] = inquilinos.map((p) => ({
    cedula: p.numeroDocumento,
    nombre: p.nombre,
    inmobiliaria: "Alquilando SAS",
    direccion: p.direccion,
    correo: p.correo,
    telefono: p.telefono,
    estado: "ejecucion",
    edad: 0,
    zona: "-",
    score: 0,
    tipo: "natural",
  }));

  const allRows = [...nuevosRows, ...INQUILINOS_ROWS];

  const filtered = allRows.filter((r) => {
    if (!applied || !applied.q.trim()) return true;
    const q = applied.q.trim().toLowerCase();
    const fields = applied.by ? [String(r[applied.by as keyof InquilinoRow] ?? "")] : Object.values(r).map(String);
    return fields.some((v) => v.toLowerCase().includes(q));
  });

  // La fuente real tiene 1552 registros; mostramos el set de demo en la primera página.
  const totalRows = applied ? filtered.length : TOTAL + nuevosRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const tableRows = pageRows.map((r) => ({
    ...r,
    estado: <StatusBadge label={ESTADO_BADGE[r.estado].label} variant={ESTADO_BADGE[r.estado].variant} />,
    opciones: <IconButton icon={Eye} title="Ver inquilino" onClick={() => setSelected(r)} />,
  }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Inquilinos"
        description="Administra y revisa todos los inquilinos de manera fácil y rápida."
      />

      <MetricsRow
        metrics={[
          { label: "Inquilinos totales", value: String(TOTAL) },
          {
            label: "Tipo de inquilino",
            breakdown: [
              { value: `${100 - pctCorporativo} %`, label: "Personas naturales" },
              { value: `${pctCorporativo} %`, label: "Corporativos" },
            ],
          },
          { label: "Score promedio", value: String(scorePromedio) },
          { label: "Edad promedio", value: `${edadPromedio} años` },
        ]}
      />

      <MetricsRow
        metrics={[
          { label: "Activos (en ejecución)", value: String(activos) },
          { label: "En mora", value: String(enMora), showEye: true },
          {
            label: "Estado de cartera",
            breakdown: [
              { value: `${100 - pctMora} %`, label: "Al día" },
              { value: `${pctMora} %`, label: "En mora" },
            ],
          },
          { label: "Zona con mayor concentración", value: `${zonaTop.name} (${pctZonaTop} %)` },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ZonaChart data={agruparProporcional(INQUILINOS_ROWS, (r) => r.zona, TOTAL, ZONA_COLORS)} />
        <ScoreChart data={distribucionScore(INQUILINOS_ROWS, TOTAL)} />
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
            description="No encontramos inquilinos que coincidan con la búsqueda. Ajusta los criterios e intenta de nuevo."
            action={<AppButton variant="secondary" onClick={clearSearch}>Limpiar búsqueda</AppButton>}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
