import { useEffect, useRef, useState } from "react";
import { Filter, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, LabelList } from "recharts";
import { PageHeader } from "./kit/PageHeader";
import { AppButton } from "./kit/AppButton";
import { MetricsRow } from "./kit/MetricsRow";
import { DataTable } from "./kit/DataTable";
import { IconButton } from "./kit/IconButton";
import { TextInput } from "./kit/TextInput";
import { SelectInput } from "./kit/SelectInput";
import { EmptyState } from "./kit/EmptyState";
import { Footer } from "./kit/Footer";
import { InmobiliariaDetalle } from "./InmobiliariaDetalle";

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

export interface InmobiliariaRow {
  nombre: string;
  telefono: string;
  correo: string;
  tasa: string;
  contratos: string;
  finalizados: string;
}

const ROWS: InmobiliariaRow[] = [
  { nombre: "Consultoria & Marketing Inmobiliario", telefono: "3144689504", correo: "cmasesoressas@hotmail.com", tasa: "4.5%", contratos: "230", finalizados: "42" },
  { nombre: "Edificatoria", telefono: "+573142976437", correo: "cesar.lara@edificatoria.net", tasa: "4.5%", contratos: "32", finalizados: "4" },
  { nombre: "Plan familia", telefono: "3144249404", correo: "planfamiliasas@gmail.com", tasa: "4.5%", contratos: "14", finalizados: "2" },
  { nombre: "Back", telefono: "300123457", correo: "pruebaasociada@backbone.digital", tasa: "4.5%", contratos: "4", finalizados: "1" },
  { nombre: "Brikss", telefono: "3185839368", correo: "l.camargo@brikss.com", tasa: "4.5%", contratos: "26", finalizados: "2" },
  { nombre: "Alquilando Caribe", telefono: "3052380617", correo: "contacto@alquilandocaribe.com", tasa: "4.5%", contratos: "58", finalizados: "9" },
  { nombre: "Hábitat Urbano", telefono: "3009876543", correo: "info@habitaturbano.com", tasa: "5.0%", contratos: "41", finalizados: "6" },
];

const COLUMNS = [
  { key: "nombre", header: "Inmobiliaria", width: 200 },
  { key: "telefono", header: "Teléfono", width: 120 },
  { key: "correo", header: "Correo" },
  { key: "tasa", header: "Tasa", width: 90 },
  { key: "contratos", header: "Contratos", width: 100 },
  { key: "finalizados", header: "Finalizados", width: 100 },
  { key: "opciones", header: "Opciones", width: 80, align: "center" as const },
];

const SEARCH_OPTIONS = [
  { value: "nombre", label: "Inmobiliaria" },
  { value: "telefono", label: "Teléfono" },
  { value: "correo", label: "Correo" },
];

const contratosTotales = ROWS.reduce((sum, r) => sum + Number(r.contratos), 0);
const finalizadosTotales = ROWS.reduce((sum, r) => sum + Number(r.finalizados), 0);
const pctFinalizacion = Math.round((finalizadosTotales / contratosTotales) * 100);
const tasaPromedio = (ROWS.reduce((sum, r) => sum + parseFloat(r.tasa), 0) / ROWS.length).toFixed(1);

function ContratosChart() {
  const { ref, width } = useContainerWidth();
  const data = [...ROWS]
    .sort((a, b) => Number(b.contratos) - Number(a.contratos))
    .map((r) => ({ name: r.nombre, value: Number(r.contratos) }));
  return (
    <section
      className="rounded-lg flex flex-col"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
    >
      <h3 className="subtitle" style={{ color: "var(--navy)", marginBottom: 16 }}>Contratos por inmobiliaria aliada</h3>
      <div ref={ref} style={{ width: "100%" }}>
        {width > 0 && (
          <BarChart width={width} height={240} data={data} margin={{ top: 24, right: 10, left: -20, bottom: 40 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={{ stroke: "var(--gray-5)" }} tickLine={false} angle={-25} textAnchor="end" interval={0} height={60} />
            <YAxis tick={{ fontSize: 11, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={false} tickLine={false} label={{ value: "Contratos", angle: -90, position: "insideLeft", offset: 25, style: { fontSize: 11, fill: "var(--gray-9)", fontFamily: "Roboto" } }} />
            <Bar dataKey="value" fill="var(--navy)" radius={[4, 4, 0, 0]} isAnimationActive={false} maxBarSize={56}>
              <LabelList dataKey="value" position="top" style={{ fill: "var(--navy)", fontSize: 12, fontFamily: "Roboto", fontWeight: 700 }} />
            </Bar>
          </BarChart>
        )}
      </div>
    </section>
  );
}

export function Inmobiliarias() {
  const [selected, setSelected] = useState<InmobiliariaRow | null>(null);
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);

  if (selected) {
    return <InmobiliariaDetalle inmobiliaria={selected} onBack={() => setSelected(null)} />;
  }

  const doSearch = () => setApplied({ by: searchBy, q: query });
  const clearSearch = () => { setQuery(""); setApplied(null); };

  const rows = ROWS.filter((r) => {
    if (!applied || !applied.q.trim()) return true;
    const q = applied.q.trim().toLowerCase();
    const fields = applied.by
      ? [String(r[applied.by as keyof InmobiliariaRow] ?? "")]
      : Object.values(r).map(String);
    return fields.some((v) => v.toLowerCase().includes(q));
  });

  const tableRows = rows.map((r) => ({
    ...r,
    opciones: <IconButton icon={Eye} title="Ver tablero" onClick={() => setSelected(r)} />,
  }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Inmobiliarias aliadas"
        description="Gestiona la red de inmobiliarias aliadas y su desempeño comercial."
        actions={<AppButton variant="primary" bold>Agregar nueva inmobiliaria</AppButton>}
      />

      <MetricsRow
        metrics={[
          { label: "Inmobiliarias aliadas", value: String(ROWS.length) },
          { label: "Contratos gestionados", value: String(contratosTotales) },
          { label: "Tasa de finalización", value: `${pctFinalizacion} %` },
          { label: "Comisión promedio", value: `${tasaPromedio} %` },
        ]}
      />

      <ContratosChart />

      <section
        className="rounded-lg flex flex-col gap-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <AppButton variant="ghost"><Filter size={14} /> Filtrar</AppButton>
          <div className="flex items-center gap-3">
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>Buscar por:</span>
            <SelectInput options={SEARCH_OPTIONS} value={searchBy} onChange={setSearchBy} className="min-w-[160px]" />
            <TextInput placeholder="Escriba aquí" value={query} onChange={setQuery} onEnter={doSearch} onClear={clearSearch} className="min-w-[200px]" />
            <AppButton variant="secondary" bold onClick={doSearch}>Buscar</AppButton>
          </div>
        </div>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        {rows.length > 0 ? (
          <>
            <DataTable columns={COLUMNS} rows={tableRows} onRowClick={(i) => setSelected(rows[i])} />
            <p className="body-regular text-right" style={{ color: "var(--gray-9)", margin: 0 }}>
              Mostrando <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{rows.length}</span> de{" "}
              <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{ROWS.length}</span>
            </p>
          </>
        ) : (
          <EmptyState
            title="Sin resultados"
            description="No encontramos inmobiliarias que coincidan con la búsqueda. Ajusta el criterio e intenta de nuevo."
            action={<AppButton variant="secondary" onClick={clearSearch}>Limpiar búsqueda</AppButton>}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
