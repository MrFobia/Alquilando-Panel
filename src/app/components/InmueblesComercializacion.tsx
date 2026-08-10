import { useEffect, useRef, useState } from "react";
import { Filter, Map, Eye, Pencil, Download } from "lucide-react";
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
import { CaptarInmueble } from "./CaptarInmueble";
import type { NuevoInmuebleResumen } from "./CaptarInmueble";
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

interface InmuebleRow {
  id: string;
  inmobiliaria: string;
  metros: string;
  direccion: string;
  tipo: string;
  zona: string;
  estado: string;
}

const INCLUSIONES_ROWS_SEED: InmuebleRow[] = [
  { id: "6454", inmobiliaria: "Alquilando sas", metros: "-", direccion: "-", tipo: "-", zona: "-", estado: "Borrador" },
  { id: "6444", inmobiliaria: "Alquilando sas", metros: "-", direccion: "Cra 3 #19- 29 santa marta", tipo: "-", zona: "Zona centro…", estado: "Borrador" },
  { id: "6363", inmobiliaria: "Alquilando sas", metros: "-", direccion: "Calle 80 # 23 - 20", tipo: "-", zona: "Zona centro", estado: "Borrador" },
  { id: "6356", inmobiliaria: "Alquilando sas", metros: "55", direccion: "Calle 147 # 8 - 55", tipo: "Apartamento", zona: "Zona norte", estado: "Borrador" },
];

const COMERCIALIZACION_ROWS: InmuebleRow[] = [
  { id: "6676", inmobiliaria: "Alquilando sas", metros: "47", direccion: "Cr 34 a # 37 - 90 bl 9 - brr ciudad…", tipo: "Apartamento", zona: "Soacha", estado: "Publicado" },
  { id: "6672", inmobiliaria: "Alquilando sas", metros: "276", direccion: "Cr 73 bis # 53 - 58 ca - brr…", tipo: "Casa", zona: "Occidente", estado: "Publicado" },
  { id: "6670", inmobiliaria: "Alquilando sas", metros: "60", direccion: "Dg 136 # 146 a - 59 ap 520 - brr…", tipo: "Apartamento", zona: "Noroccidente", estado: "No publicado" },
  { id: "6669", inmobiliaria: "Alquilando sas", metros: "86,45", direccion: "Cr 23 norte # 95 - 46 ed - brr chico", tipo: "Apartamento", zona: "Norte", estado: "Publicado" },
  { id: "6664", inmobiliaria: "C&m", metros: "71", direccion: "Cl 50 a sur # 87 d - 86 lc - brr bosa", tipo: "Local", zona: "Sur", estado: "Publicado" },
  { id: "6663", inmobiliaria: "Alquilando sas", metros: "29", direccion: "Cl 52 a # 85 m - 50 occidente ap 5…", tipo: "Apartaestudio", zona: "Occidente", estado: "No publicado" },
  { id: "6662", inmobiliaria: "Alquilando sas", metros: "34", direccion: "Calle 4#1-39 apto 106", tipo: "Apartamento", zona: "-", estado: "Publicado" },
  { id: "6658", inmobiliaria: "Edificatoria s.a.s", metros: "33,50", direccion: "Cr 16 # 53 - 26 ap 401 - brr galerias", tipo: "Apartaestudio", zona: "Centro", estado: "Publicado" },
  { id: "6657", inmobiliaria: "Alquilando sas", metros: "28.7", direccion: "Cr 16 # 53 - 26 ap 402 - brr galerias", tipo: "Apartaestudio", zona: "Centro", estado: "Publicado" },
  { id: "6656", inmobiliaria: "Edificatoria s.a.s", metros: "33,50", direccion: "Cr 16 # 53 - 26 ap 301 - brr galerias", tipo: "Apartaestudio", zona: "Centro", estado: "Publicado" },
];

const RECOMERCIALIZACION_ROWS: InmuebleRow[] = [
  { id: "6140", inmobiliaria: "Alquilando sas", metros: "80", direccion: "Cr 112 a occidente # 22 i - 48…", tipo: "Apartamento", zona: "Occidente", estado: "Re-comercialización" },
  { id: "6135", inmobiliaria: "Alquilando fg", metros: "80", direccion: "Cr 68 b # 22 a - 71 ap 404 - brr…", tipo: "Apartamento", zona: "Occidente", estado: "Re-comercialización" },
  { id: "6131", inmobiliaria: "Edificatoria s.a.s", metros: "94.00", direccion: "Cr 7 bis a 123 34  apto 404", tipo: "Apartamento", zona: "Bogota", estado: "Re-comercialización" },
  { id: "6129", inmobiliaria: "Alquilando sas", metros: "30.00", direccion: "Cr 85 k # 26 g - 53 905 - brr fontibon", tipo: "-", zona: "Bogota", estado: "Re-comercialización" },
  { id: "6128", inmobiliaria: "Alquilando", metros: "30.00", direccion: "Kr 85k 26g 53 to 4 ap 905", tipo: "-", zona: "Bogota", estado: "Re-comercialización" },
  { id: "6121", inmobiliaria: "Alquilando", metros: "60.00", direccion: "Kr 17 39a 04", tipo: "Local", zona: "Centro", estado: "Re-comercialización" },
  { id: "5725", inmobiliaria: "Alquilando s.a.s", metros: "29", direccion: "Cl 53 # 85m - 50", tipo: "-", zona: "Occidente", estado: "Re-comercialización" },
  { id: "5301", inmobiliaria: "Alquilando s.a.s", metros: "41", direccion: "Carrera 10 #172 b -50", tipo: "Apartamento", zona: "Norte", estado: "Re-comercialización" },
  { id: "5291", inmobiliaria: "Alquilando s.a.s", metros: "4500", direccion: "Av calle 127 #7 a -28", tipo: "Apartaestudio", zona: "Norte", estado: "Re-comercialización" },
  { id: "5243", inmobiliaria: "Alquilando s.a.s", metros: "338", direccion: "Ak 7 # 77 - 7", tipo: "Oficina", zona: "Norte", estado: "Re-comercialización" },
];

const CAPTACIONES_PORTAL_ROWS: InmuebleRow[] = [];

const CAPTACION_ALIADA_ROWS: InmuebleRow[] = [
  { id: "6681", inmobiliaria: "C&m", metros: "50", direccion: "Cr 89 # 19 a - 50 ap 511 - brr…", tipo: "Apartamento", zona: "Occidente", estado: "En revisión" },
  { id: "6668", inmobiliaria: "C&m", metros: "60", direccion: "Ak 80 g # 6 - 19 ap 1203 - brr castilla", tipo: "Apartamento", zona: "Occidente", estado: "En revisión" },
  { id: "6667", inmobiliaria: "C&m", metros: "40", direccion: "Cr 77 n # 59 - 15 sur - brr la estacion", tipo: "Apartamento", zona: "Sur", estado: "Pendiente de publicar" },
  { id: "6666", inmobiliaria: "C&m", metros: "45", direccion: "Cl 16 # 100 - 12 pis 1 - brr fontibon…", tipo: "Apartamento", zona: "Occidente", estado: "Pendiente de publicar" },
  { id: "6665", inmobiliaria: "C&m", metros: "60", direccion: "Cl 17 d # 103 b - 50 ap 201 - brr…", tipo: "Apartamento", zona: "Occidente", estado: "En revisión" },
];

const CAPTACION_BROKERS_ROWS: InmuebleRow[] = [
  { id: "6680", inmobiliaria: "Alquilando sas", metros: "48", direccion: "Cr 25 # 16 - 40 ap 102 - brr autopis…", tipo: "Apartaestudio", zona: "Oriente", estado: "En revisión" },
  { id: "6679", inmobiliaria: "Alquilando sas", metros: "-", direccion: "-", tipo: "Apartamento", zona: "-", estado: "Borrador" },
  { id: "6675", inmobiliaria: "Alquilando sas", metros: "-", direccion: "-", tipo: "Apartamento", zona: "-", estado: "Borrador" },
  { id: "6631", inmobiliaria: "Alquilando sas", metros: "54", direccion: "Dg 54 # 19 - 20 ap 2240 - brr bello…", tipo: "Apartamento", zona: "Norte", estado: "En revisión" },
  { id: "6542", inmobiliaria: "Alquilando sas", metros: "45", direccion: "Av 4 # 4 - 485 ag - brr 12 de octubre", tipo: "Apartamento", zona: "Norte", estado: "Borrador" },
  { id: "6457", inmobiliaria: "Alquilando sas", metros: "72", direccion: "Cr 54 # 43 - 14 ap 1103 - brr santa…", tipo: "Apartamento", zona: "Norte", estado: "Borrador" },
];

const TABS_SEED = [
  { id: "inclusiones", label: "Inclusiones", count: INCLUSIONES_ROWS_SEED.length },
  { id: "comercializacion", label: "Comercialización", count: COMERCIALIZACION_ROWS.length },
  { id: "captaciones-portal", label: "Captaciones portal", count: CAPTACIONES_PORTAL_ROWS.length },
  { id: "re-comercializacion", label: "Re-Comercialización", count: RECOMERCIALIZACION_ROWS.length },
  { id: "captacion-aliada", label: "Captaciones aliadas", count: CAPTACION_ALIADA_ROWS.length },
  { id: "broker-externo", label: "Captaciones Brokers", count: CAPTACION_BROKERS_ROWS.length },
];

const ESTADO_VARIANT: Record<string, "draft" | "pending" | "registered" | "active" | "rejected" | "neutral" | "violet"> = {
  "Borrador": "draft",
  "Publicado": "active",
  "No publicado": "registered",
  "Re-comercialización": "violet",
  "En revisión": "pending",
  "Pendiente de publicar": "registered",
};

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
  { key: "estado", header: "Estado", width: 150 },
  { key: "opciones", header: "Opciones", width: 100 },
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
  onDirtyChange?: (guard: { onSave: () => void; onDiscard: () => void } | null) => void;
}

export function InmueblesComercializacion({ onViewInmueble, onDirtyChange }: Props) {
  const [tab, setTab] = useState("inclusiones");
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);
  const [capturando, setCapturando] = useState(false);
  const [editingInmuebleId, setEditingInmuebleId] = useState<string | null>(null);
  const { inmuebles, addInmueble, updateInmueble, deleteInmueble } = useAppData();

  const handleNuevoInmueble = (data: NuevoInmuebleResumen) => {
    if (editingInmuebleId) {
      updateInmueble(editingInmuebleId, {
        metros: data.metros,
        direccion: data.direccion,
        tipo: data.tipo,
        zona: data.zona,
        estado: "Publicado",
      });
      return;
    }
    addInmueble({
      inmobiliaria: "Alquilando sas",
      metros: data.metros,
      direccion: data.direccion,
      tipo: data.tipo,
      zona: data.zona,
      estado: "Borrador",
    });
  };

  const handleGuardarBorrador = (data: NuevoInmuebleResumen) => {
    if (editingInmuebleId) {
      updateInmueble(editingInmuebleId, {
        metros: data.metros,
        direccion: data.direccion,
        tipo: data.tipo,
        zona: data.zona,
        estado: "Borrador",
      });
      return;
    }
    addInmueble({
      inmobiliaria: "Alquilando sas",
      metros: data.metros,
      direccion: data.direccion,
      tipo: data.tipo,
      zona: data.zona,
      estado: "Borrador",
    });
  };

  const continuarEdicion = (id: string) => {
    setEditingInmuebleId(id);
    setCapturando(true);
  };

  if (capturando) {
    return (
      <CaptarInmueble
        onBack={() => { setCapturando(false); setEditingInmuebleId(null); }}
        onFinish={() => { setCapturando(false); setEditingInmuebleId(null); }}
        onSubmit={handleNuevoInmueble}
        onSaveDraft={handleGuardarBorrador}
        onDiscard={() => { if (editingInmuebleId) deleteInmueble(editingInmuebleId); }}
        onDirtyChange={onDirtyChange}
      />
    );
  }

  const doSearch = () => setApplied({ by: searchBy, q: query });
  const clearSearch = () => { setQuery(""); setApplied(null); };
  const changeTab = (id: string) => { setTab(id); setQuery(""); setApplied(null); setSearchBy(""); };

  const rowsByTab: Record<string, InmuebleRow[]> = {
    inclusiones: inmuebles,
    comercializacion: COMERCIALIZACION_ROWS,
    "captaciones-portal": CAPTACIONES_PORTAL_ROWS,
    "re-comercializacion": RECOMERCIALIZACION_ROWS,
    "captacion-aliada": CAPTACION_ALIADA_ROWS,
    "broker-externo": CAPTACION_BROKERS_ROWS,
  };

  const tabs = TABS_SEED.map((t) => t.id === "inclusiones" ? { ...t, count: inmuebles.length } : t);

  const tabRows = rowsByTab[tab] ?? [];

  const filtered = tabRows.filter((r) => {
    if (!applied || !applied.q.trim()) return true;
    const q = applied.q.trim().toLowerCase();
    const fields = applied.by
      ? [String(r[applied.by as keyof InmuebleRow] ?? "")]
      : Object.values(r).map(String);
    return fields.some((v) => v.toLowerCase().includes(q));
  });

  const viewInmueble = (r: InmuebleRow) =>
    onViewInmueble?.({
      id: r.id,
      direccion: r.direccion,
      tipo: r.tipo,
      zona: r.zona,
      estado: { label: r.estado, variant: ESTADO_VARIANT[r.estado] ?? "neutral" },
      contrato: "sin",
      fecha: "-",
    });

  const rows = filtered.map((r) => ({
    ...r,
    estado: <StatusBadge label={r.estado} variant={ESTADO_VARIANT[r.estado] ?? "neutral"} />,
    opciones: r.estado === "Borrador"
      ? <IconButton icon={Pencil} title="Continuar edición" onClick={() => continuarEdicion(r.id)} />
      : <IconButton icon={Eye} title="Ver inmueble" onClick={() => viewInmueble(r)} />,
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
            <AppButton variant="primary" bold onClick={() => setCapturando(true)}>Captar inmueble</AppButton>
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

      <TabBar tabs={tabs} active={tab} onChange={changeTab} />

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
          <DataTable
            columns={COLUMNS}
            rows={rows}
            onRowClick={(i) => {
              const r = filtered[i];
              if (r.estado === "Borrador") continuarEdicion(r.id);
              else viewInmueble(r);
            }}
          />
        ) : tabRows.length === 0 ? (
          <EmptyState
            title="Sin inmuebles"
            description="Todavía no hay inmuebles en esta etapa."
          />
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
