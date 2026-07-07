import { useState } from "react";
import { Filter, Eye, MessageCircle } from "lucide-react";
import { PageHeader } from "./kit/PageHeader";
import { AppButton } from "./kit/AppButton";
import { MetricsRow } from "./kit/MetricsRow";
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

type EstadoInterno = "activo" | "vacaciones" | "inactivo";

interface BrokerInternoRow {
  id: string;
  nombre: string;
  zona: string;
  contratosMes: string;
  contratosAno: string;
  cumplimiento: number;
  estado: EstadoInterno;
}

const ROWS: BrokerInternoRow[] = [
  { id: "1.020.789.456", nombre: "Angie Carolina Duarte", zona: "Bogotá", contratosMes: "9", contratosAno: "64", cumplimiento: 90, estado: "activo" },
  { id: "45.678.912", nombre: "Ruby Esperanza Meza", zona: "Caribe", contratosMes: "7", contratosAno: "58", cumplimiento: 78, estado: "activo" },
  { id: "1.014.567.890", nombre: "Julián Esteban Rueda", zona: "Bogotá", contratosMes: "5", contratosAno: "41", cumplimiento: 62, estado: "activo" },
  { id: "52.345.678", nombre: "Marcela Quintero Páez", zona: "Occidente", contratosMes: "8", contratosAno: "55", cumplimiento: 84, estado: "activo" },
  { id: "1.032.456.789", nombre: "David Santiago Herrera", zona: "Norte", contratosMes: "3", contratosAno: "29", cumplimiento: 45, estado: "vacaciones" },
  { id: "79.912.345", nombre: "Lina María Cabrera", zona: "Bogotá", contratosMes: "6", contratosAno: "47", cumplimiento: 71, estado: "activo" },
  { id: "1.045.234.567", nombre: "Óscar Iván Salazar", zona: "Caribe", contratosMes: "0", contratosAno: "18", cumplimiento: 12, estado: "inactivo" },
  { id: "1.010.987.654", nombre: "Tatiana Reyes Amador", zona: "Sur", contratosMes: "4", contratosAno: "36", cumplimiento: 58, estado: "activo" },
];

const ESTADO_BADGE: Record<EstadoInterno, { label: string; variant: "active" | "pending" | "neutral" }> = {
  activo: { label: "Activo", variant: "active" },
  vacaciones: { label: "Vacaciones", variant: "pending" },
  inactivo: { label: "Inactivo", variant: "neutral" },
};

const COLUMNS = [
  { key: "id", header: "Documento", width: 130 },
  { key: "nombre", header: "Nombre" },
  { key: "zona", header: "Zona", width: 100 },
  { key: "contratosMes", header: "Contratos mes", width: 115 },
  { key: "contratosAno", header: "Contratos año", width: 115 },
  { key: "cumplimiento", header: "Cumplimiento meta", width: 180 },
  { key: "estado", header: "Estado", width: 115 },
  { key: "acciones", header: "Acciones", width: 90 },
];

const SEARCH_OPTIONS = [
  { value: "id", label: "Documento" },
  { value: "nombre", label: "Nombre" },
  { value: "zona", label: "Zona" },
];

const METRICS = [
  { label: "Brokers internos", value: "8" },
  { label: "Contratos (Mes actual)", value: "42" },
  { label: "Contratos (Año actual)", value: "348" },
  { label: "Cumplimiento promedio", value: "63%" },
];

export function BrokersInternos() {
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);

  const doSearch = () => { setApplied({ by: searchBy, q: query }); setPage(1); };
  const clearSearch = () => { setQuery(""); setApplied(null); setPage(1); };

  const sourceRows = ROWS.filter((r) => {
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
    const badge = ESTADO_BADGE[r.estado];
    return {
      ...r,
      cumplimiento: <ProgressBar value={r.cumplimiento} />,
      estado: <StatusBadge label={badge.label} variant={badge.variant} />,
      acciones: (
        <div className="flex items-center gap-1">
          <IconButton icon={MessageCircle} title="Contactar por WhatsApp" />
          <IconButton icon={Eye} title="Ver tablero" />
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

      <MetricsRow metrics={METRICS} />

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
            <DataTable columns={COLUMNS} rows={tableRows} />
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
