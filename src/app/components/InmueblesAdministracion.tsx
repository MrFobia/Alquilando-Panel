import { useEffect, useRef, useState } from "react";
import { Filter, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Cell, LabelList, PieChart, Pie, Tooltip } from "recharts";
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
import { InmuebleDetalle } from "./InmuebleDetalle";
import type { InmuebleData } from "./InmuebleDetalle";

const PAGE_SIZE = 10;

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

const vencimientoData = [
  { name: "0-30 dias", value: 9, color: "var(--red-status)" },
  { name: "31–60 días", value: 14, color: "var(--orange-status)" },
  { name: "61–90 días", value: 22, color: "var(--violeta)" },
  { name: "+90 días", value: 125, color: "var(--navy)" },
];

const inmobiliariaData = [
  { name: "Alquilando sas", value: 92, color: "var(--navy)" },
  { name: "C&m", value: 58, color: "var(--orange-status)" },
  { name: "Izban", value: 24, color: "var(--violeta)" },
  { name: "Alquilando Caribe", value: 13, color: "var(--green-status)" },
];

const zonasData = [
  { name: "Norte", value: 61, color: "var(--navy)" },
  { name: "Occidente", value: 47, color: "var(--orange-status)" },
  { name: "Norocciden", value: 24, color: "var(--violeta)" },
  { name: "Bogota", value: 15, color: "#EC4899" },
  { name: "Centro", value: 8, color: "var(--green-status)" },
  { name: "Sur", value: 9, color: "#795548" },
  { name: "Noroccidente", value: 6, color: "var(--red-status)" },
];

const CHART_CARD_HEIGHT = 320;

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

function VencimientoChart() {
  const { ref, width } = useContainerWidth();
  return (
    <ChartCard title="Vencimiento de contratos">
      <div ref={ref} style={{ width: "100%" }}>
        {width > 0 && (
          <BarChart width={width} height={230} data={vencimientoData} margin={{ top: 24, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={{ stroke: "var(--gray-5)" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={false} tickLine={false} label={{ value: "Contratos", angle: -90, position: "insideLeft", offset: 25, style: { fontSize: 11, fill: "var(--gray-9)", fontFamily: "Roboto" } }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false} maxBarSize={64}>
              {vencimientoData.map((d) => <Cell key={d.name} fill={d.color} />)}
              <LabelList dataKey="value" position="top" style={{ fill: "var(--navy)", fontSize: 12, fontFamily: "Roboto", fontWeight: 700 }} />
            </Bar>
          </BarChart>
        )}
      </div>
    </ChartCard>
  );
}

function PieChartCard({ title, data }: { title: string; data: typeof inmobiliariaData }) {
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
        <div className="grid grid-cols-1 gap-y-3 flex-1 min-w-0">
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

interface InmuebleRow {
  id: string;
  inmobiliaria: string;
  metros: string;
  direccion: string;
  tipo: string;
  zona: string;
}

const ROWS_DATA: InmuebleRow[] = [
  { id: "6455", inmobiliaria: "Alquilando sas", metros: "0.00", direccion: "Cl 18 # 100 - 08 of 3", tipo: "-", zona: "Bogota" },
  { id: "6382", inmobiliaria: "C&m", metros: "40.00", direccion: "Cr 73 c # 39 - 36 sur ap 101", tipo: "Apartamento", zona: "-" },
  { id: "6377", inmobiliaria: "C&m", metros: "26.00", direccion: "Cl 53 # 85 m - 50 t 2 ap 401", tipo: "Apartaestudio", zona: "Norocciden" },
  { id: "6365", inmobiliaria: "Alquilando sas", metros: "60.00", direccion: "Cl 50 sur 93d 38 in 5 ap 204", tipo: "Apartamento", zona: "-" },
  { id: "6364", inmobiliaria: "C&m", metros: "72.00", direccion: "Cl 50 a sur # 87 d - 86 ap 301", tipo: "Apartamento", zona: "-" },
  { id: "6358", inmobiliaria: "Alquilando sas", metros: "60.00", direccion: "Kr 85k 26g 53 to 1 ap 1218", tipo: "Apartamento", zona: "Occidente" },
  { id: "6347", inmobiliaria: "C&m", metros: "30.00", direccion: "Cr 73 c # 39 - 36 sur ap 202", tipo: "Apartaestudio", zona: "-" },
  { id: "6344", inmobiliaria: "C&m", metros: "40.00", direccion: "Cr 73 c # 39 - 36 sur ap 102", tipo: "Apartamento", zona: "-" },
  { id: "6323", inmobiliaria: "Alquilando sas", metros: "0.00", direccion: "Cl 18 100 08 of 201", tipo: "Oficina", zona: "Bogota" },
  { id: "6275", inmobiliaria: "Alquilando sas", metros: "89", direccion: "Cr 14 # 117 - 56 ap 403 - brr santa barbara", tipo: "Apartamento", zona: "Norte" },
  { id: "6271", inmobiliaria: "Alquilando Caribe", metros: "55.00", direccion: "Cl 147 # 8 - 55 ap 902", tipo: "Apartamento", zona: "Norte" },
  { id: "6268", inmobiliaria: "Izban", metros: "48.00", direccion: "Cr 85 k # 26 g - 53 ap 718 - brr fontibon", tipo: "Apartamento", zona: "Occidente" },
  { id: "6254", inmobiliaria: "Alquilando sas", metros: "120.00", direccion: "Cl 81 # 109 - 10 ap 203 - brr bolivia", tipo: "Casa", zona: "Occidente" },
];

const COLUMNS = [
  { key: "id", header: "# Inmueble", width: 110 },
  { key: "inmobiliaria", header: "Inmobiliaria", width: 150 },
  { key: "metros", header: "Metros²", width: 100 },
  { key: "direccion", header: "Dirección" },
  { key: "tipo", header: "Tipo de inmueble", width: 150 },
  { key: "zona", header: "Zona", width: 120 },
  { key: "estado", header: "Estado", width: 125 },
  { key: "opciones", header: "Opciones", width: 90 },
];

const SEARCH_OPTIONS = [
  { value: "id", label: "# Inmueble" },
  { value: "inmobiliaria", label: "Inmobiliaria" },
  { value: "direccion", label: "Dirección" },
  { value: "zona", label: "Zona" },
];

export function InmueblesAdministracion() {
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);
  const [selected, setSelected] = useState<InmuebleRow | null>(null);

  if (selected) {
    const data: InmuebleData = {
      id: selected.id,
      direccion: selected.direccion,
      tipo: selected.tipo,
      zona: selected.zona,
      estado: { label: "Arrendado", variant: "active" },
      contrato: "firmado",
      fecha: "-",
    };
    return <InmuebleDetalle inmueble={data} onBack={() => setSelected(null)} />;
  }

  const doSearch = () => { setApplied({ by: searchBy, q: query }); setPage(1); };
  const clearSearch = () => { setQuery(""); setApplied(null); setPage(1); };

  const filtered = ROWS_DATA.filter((r) => {
    if (!applied || !applied.q.trim()) return true;
    const q = applied.q.trim().toLowerCase();
    const fields = applied.by
      ? [String(r[applied.by as keyof InmuebleRow] ?? "")]
      : Object.values(r).map(String);
    return fields.some((v) => v.toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const rows = pageRows.map((r) => ({
    ...r,
    estado: <StatusBadge label="Arrendado" variant="active" />,
    opciones: <IconButton icon={Eye} title="Ver ficha del inmueble" onClick={() => setSelected(r)} />,
  }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Inmuebles en administración"
        description="Administra y revisa todos tus inmuebles de manera fácil y rápida."
      />

      <MetricsRow
        metrics={[
          { label: "Inmuebles en administración", value: "187" },
          { label: "Arrendados", value: "170" },
          { label: "Desocupados", value: "17" },
          {
            label: "Tasa de ocupación",
            breakdown: [
              { value: "91 %", label: "Ocupado" },
              { value: "9 %", label: "Vacante" },
            ],
          },
        ]}
      />

      <MetricsRow
        metrics={[
          { label: "Recaudo del mes", value: "94 %", showEye: true },
          {
            label: "Cartera en mora",
            breakdown: [
              { value: "12", label: "Inmuebles" },
              { value: "$48,2M", label: "Monto" },
            ],
          },
          { label: "Contratos por vencer (30 días)", value: "9" },
          { label: "Solicitudes abiertas", value: "23", showEye: true },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
        <div className="lg:col-span-2"><VencimientoChart /></div>
        <div className="lg:col-span-2"><PieChartCard title="Distribución por inmobiliaria" data={inmobiliariaData} /></div>
        <div className="lg:col-span-2"><PieChartCard title="Distribución por zona" data={zonasData} /></div>
      </div>

      <section
        className="rounded-lg flex flex-col gap-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <AppButton variant="ghost"><Filter size={14} /> Filtrar</AppButton>
          <div className="flex items-center gap-3">
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>Buscar por:</span>
            <SelectInput options={SEARCH_OPTIONS} value={searchBy} onChange={setSearchBy} className="min-w-[180px]" />
            <TextInput placeholder="Escriba aquí" value={query} onChange={setQuery} onEnter={doSearch} onClear={clearSearch} className="min-w-[200px]" />
            <AppButton variant="secondary" bold onClick={doSearch}>Buscar</AppButton>
          </div>
        </div>

        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        {rows.length > 0 ? (
          <>
            <DataTable columns={COLUMNS} rows={rows} onRowClick={(i) => setSelected(pageRows[i])} />
            <p className="body-regular text-right" style={{ color: "var(--gray-9)", margin: 0 }}>
              Mostrando <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{pageRows.length}</span> de{" "}
              <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{filtered.length}</span>
            </p>
            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <EmptyState
            title="Sin resultados"
            description={`No encontramos inmuebles que coincidan con "${applied?.q ?? ""}". Revisa el texto o intenta con otro criterio de búsqueda.`}
            action={<AppButton variant="secondary" onClick={clearSearch}>Limpiar búsqueda</AppButton>}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
