import { useEffect, useRef, useState } from "react";
import { Filter, Map, Eye, Download } from "lucide-react";
import type { InmuebleData } from "./InmuebleDetalle";
import { BarChart, Bar, XAxis, YAxis, Cell, LabelList, PieChart, Pie, Tooltip } from "recharts";
import { PageHeader } from "./kit/PageHeader";
import { AppButton } from "./kit/AppButton";
import { MetricsRow } from "./kit/MetricsRow";
import { TabBar } from "./kit/TabBar";
import { StatusBadge } from "./kit/StatusBadge";
import { DataTable } from "./kit/DataTable";
import { TextInput } from "./kit/TextInput";
import { SelectInput } from "./kit/SelectInput";
import { IconButton } from "./kit/IconButton";
import { EmptyState } from "./kit/EmptyState";
import { Footer } from "./kit/Footer";

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

const diasData = [
  { name: "0-30 dias", value: 19, color: "var(--navy)" },
  { name: "31–60 días", value: 3, color: "var(--orange-status)" },
  { name: "61–90 días", value: 1, color: "var(--red-status)" },
  { name: "+90 días", value: 78, color: "var(--violeta)" },
];

const zonasData = [
  { name: "Norte", value: 69, color: "var(--navy)" },
  { name: "Centro", value: 5, color: "var(--green-status)" },
  { name: "Norocciden", value: 1, color: "var(--violeta)" },
  { name: "Bogota", value: 1, color: "#EC4899" },
  { name: "Occidente", value: 30, color: "var(--orange-status)" },
  { name: "Noroccidente", value: 2, color: "var(--red-status)" },
  { name: "Sur", value: 2, color: "#795548" },
];

const TABS = [
  { id: "inclusiones", label: "Inclusiones", count: 4 },
  { id: "comercializacion", label: "Comercialización", count: 213 },
  { id: "captaciones-portal", label: "Captaciones portal", count: 0 },
  { id: "re-comercializacion", label: "Re-Comercialización", count: 35 },
  { id: "captacion-aliada", label: "Captación aliada", count: 0 },
  { id: "broker-externo", label: "Broker externo", count: 2 },
];

const SEARCH_OPTIONS = [
  { value: "id", label: "# Inmueble" },
  { value: "direccion", label: "Dirección" },
  { value: "zona", label: "Zona" },
];

const COLUMNS = [
  { key: "id", header: "# Inmueble", width: 110 },
  { key: "inmobiliaria", header: "Inmobiliaria", width: 140 },
  { key: "metros", header: "Metros²", width: 90 },
  { key: "direccion", header: "Dirección" },
  { key: "tipo", header: "Tipo de inmueble", width: 140 },
  { key: "zona", header: "Zona", width: 120 },
  { key: "estado", header: "Estado", width: 110 },
  { key: "opciones", header: "Opciones", width: 100 },
];

const ROWS_DATA = [
  { id: "6454", inmobiliaria: "Alquilando sas", metros: "-", direccion: "-", tipo: "-", zona: "-" },
  { id: "6444", inmobiliaria: "Alquilando sas", metros: "-", direccion: "Cra 3 #19- 29 santa marta", tipo: "-", zona: "Zona centro…" },
  { id: "6363", inmobiliaria: "Alquilando sas", metros: "-", direccion: "Calle 80 # 23 - 20", tipo: "-", zona: "Zona centro" },
  { id: "6356", inmobiliaria: "Alquilando sas", metros: "55", direccion: "Calle 147 # 8 - 55", tipo: "Apartamento", zona: "Zona norte" },
];

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-lg flex flex-col"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
    >
      <h3 className="subtitle" style={{ color: "var(--navy)", marginBottom: 16 }}>{title}</h3>
      {children}
    </section>
  );
}

function DiasChart() {
  const { ref, width } = useContainerWidth();
  return (
    <ChartCard title="Días de Comercialización">
      <div ref={ref} className="flex-1" style={{ width: "100%" }}>
        {width > 0 && (
          <BarChart width={width} height={220} data={diasData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={{ stroke: "var(--gray-5)" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={false} tickLine={false} label={{ value: "Inmuebles", angle: -90, position: "insideLeft", offset: 25, style: { fontSize: 11, fill: "var(--gray-9)", fontFamily: "Roboto" } }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {diasData.map((d) => <Cell key={d.name} fill={d.color} />)}
              <LabelList dataKey="value" position="inside" style={{ fill: "#ffffff", fontSize: 12, fontFamily: "Roboto", fontWeight: 600 }} />
            </Bar>
          </BarChart>
        )}
      </div>
    </ChartCard>
  );
}

function ZonasChart() {
  const { ref, width } = useContainerWidth();
  return (
    <ChartCard title="Zonas">
      <div className="flex items-center gap-6">
        <div ref={ref} style={{ width: 220, flexShrink: 0 }}>
          {width > 0 && (
            <PieChart width={220} height={220}>
              <Pie data={zonasData} cx="50%" cy="50%" outerRadius={90} dataKey="value" isAnimationActive={false}>
                {zonasData.map((z) => <Cell key={z.name} fill={z.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "var(--radius-md)", borderWidth: 1, borderStyle: "solid", borderColor: "var(--gray-4)", backgroundColor: "#ffffff", fontFamily: "Roboto", fontSize: 12 }} />
            </PieChart>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 flex-1">
          {zonasData.map((z) => (
            <div key={z.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="shrink-0 rounded-sm" style={{ width: 12, height: 12, backgroundColor: z.color }} />
                <span className="body-bold truncate" style={{ color: "var(--navy)" }}>{z.name}</span>
              </div>
              <span className="body-regular" style={{ color: "var(--gray-10)" }}>{z.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

interface Props {
  onViewInmueble?: (inmueble: InmuebleData) => void;
}

export function InmueblesComercializacion({ onViewInmueble }: Props) {
  const [tab, setTab] = useState("inclusiones");
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);

  const doSearch = () => setApplied({ by: searchBy, q: query });
  const clearSearch = () => { setQuery(""); setApplied(null); };

  const filtered = ROWS_DATA.filter((r) => {
    if (!applied || !applied.q.trim()) return true;
    const q = applied.q.trim().toLowerCase();
    const fields = applied.by
      ? [String(r[applied.by as keyof typeof r] ?? "")]
      : Object.values(r).map(String);
    return fields.some((v) => v.toLowerCase().includes(q));
  });

  const viewInmueble = (r: (typeof filtered)[number]) =>
    onViewInmueble?.({
      id: r.id,
      direccion: r.direccion,
      tipo: r.tipo,
      zona: r.zona,
      estado: { label: "Borrador", variant: "draft" },
      contrato: "sin",
      fecha: "-",
    });

  const rows = filtered.map((r) => ({
    ...r,
    estado: <StatusBadge label="Borrador" variant="draft" />,
    opciones: <IconButton icon={Eye} title="Ver inmueble" onClick={() => viewInmueble(r)} />,
  }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Inmuebles en comercialización"
        description="Administra y revisa todos tus inmuebles de manera fácil y rápida."
        actions={
          <>
            <AppButton variant="secondary" bold><Download size={14} /> Descargar</AppButton>
            <AppButton variant="secondary" bold>Recomercialización</AppButton>
            <AppButton variant="primary" bold>Captar inmueble</AppButton>
          </>
        }
      />

      <MetricsRow
        metrics={[
          { label: "Disponibles en arriendo", value: "213" },
          { label: "Inmuebles disponibles", value: "110" },
          { label: "Disponibles en venta", value: "0" },
          {
            label: "Segmentación por categoría",
            breakdown: [
              { value: "21 %", label: "Residencial" },
              { value: "51 %", label: "Comercial" },
              { value: "28 %", label: "Sin segmentación" },
            ],
          },
        ]}
      />

      <MetricsRow
        metrics={[
          { label: "Inclusiones Alquilando", value: "18", showEye: true },
          { label: "Captaciones portal", value: "0", showEye: true },
          { label: "Captaciones aliadas", value: "0", showEye: true },
          { label: "Captados mes en curso", value: "18" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2"><DiasChart /></div>
        <div className="lg:col-span-3"><ZonasChart /></div>
      </div>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      <section
        className="rounded-lg flex flex-col gap-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <AppButton variant="ghost"><Filter size={14} /> Filtrar</AppButton>
            <AppButton variant="secondary"><Map size={14} /> Ver mapa</AppButton>
          </div>
          <div className="flex items-center gap-3">
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>Buscar por:</span>
            <SelectInput options={SEARCH_OPTIONS} value={searchBy} onChange={setSearchBy} className="min-w-[180px]" />
            <TextInput placeholder="Escriba aquí" value={query} onChange={setQuery} onEnter={doSearch} onClear={clearSearch} className="min-w-[200px]" />
            <AppButton variant="secondary" bold onClick={doSearch}>Buscar</AppButton>
          </div>
        </div>

        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        {rows.length > 0 ? (
          <DataTable columns={COLUMNS} rows={rows} onRowClick={(i) => viewInmueble(filtered[i])} />
        ) : (
          <EmptyState
            title="Sin resultados"
            description={`No encontramos inmuebles que coincidan con "${applied?.q ?? ""}". Revisa el texto o intenta con otro criterio de búsqueda.`}
            action={
              <AppButton variant="secondary" onClick={clearSearch}>
                Limpiar búsqueda
              </AppButton>
            }
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
