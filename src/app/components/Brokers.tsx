import { useEffect, useState } from "react";
import { Filter, Eye, MessageCircle } from "lucide-react";
import { PageHeader } from "./kit/PageHeader";
import { AppButton } from "./kit/AppButton";
import { MetricsRow } from "./kit/MetricsRow";
import { TabBar } from "./kit/TabBar";
import { DataTable } from "./kit/DataTable";
import { StatusBadge } from "./kit/StatusBadge";
import { IconButton } from "./kit/IconButton";
import { TextInput } from "./kit/TextInput";
import { SelectInput } from "./kit/SelectInput";
import { Pagination } from "./kit/Pagination";
import { EmptyState } from "./kit/EmptyState";
import { Footer } from "./kit/Footer";

const PAGE_SIZE = 10;

type EstadoSolicitud = "registrado" | "validacion" | "firma" | "capacitacion";
type EstadoBroker = "activo" | "inactivo" | "rechazado";

export interface BrokerRow {
  id: string;
  nombre: string;
  asesor: string;
  fecha: string;
  estadoSolicitud?: EstadoSolicitud;
  estadoBroker?: EstadoBroker;
  zona?: string;
  contratos?: string;
}

const SOLICITUDES_ROWS: BrokerRow[] = [
  { id: "1.234.567.890", nombre: "Laura Camila Rojas", estadoSolicitud: "registrado", asesor: "Sin asignar", fecha: "14 May 2026" },
  { id: "1.234.567.890", nombre: "Carlos Andrés Benitez", estadoSolicitud: "validacion", asesor: "Angie / Bogotá", fecha: "14 May 2026" },
  { id: "1.234.567.890", nombre: "Diana Patricia Gómez", estadoSolicitud: "firma", asesor: "Ruby / Caribe", fecha: "12 May 2026" },
  { id: "1.234.567.890", nombre: "Andrés Felipe Vargas", estadoSolicitud: "capacitacion", asesor: "Sin asignar", fecha: "10 May 2026" },
  { id: "1.234.567.890", nombre: "Laura Camila Rojas", estadoSolicitud: "registrado", asesor: "Angie / Bogotá", fecha: "10 May 2026" },
  { id: "1.234.567.890", nombre: "Carlos Andrés Benitez", estadoSolicitud: "validacion", asesor: "Angie / Bogotá", fecha: "09 May 2026" },
];

const ACTIVOS_ROWS: BrokerRow[] = [
  { id: "1.020.456.789", nombre: "María Fernanda López", asesor: "Angie / Bogotá", zona: "Bogotá", contratos: "12", fecha: "03 Feb 2026", estadoBroker: "activo" },
  { id: "79.845.123", nombre: "Jorge Iván Castillo", asesor: "Ruby / Caribe", zona: "Caribe", contratos: "8", fecha: "21 Ene 2026", estadoBroker: "activo" },
  { id: "1.018.234.567", nombre: "Paola Andrea Martínez", asesor: "Angie / Bogotá", zona: "Bogotá", contratos: "5", fecha: "15 Dic 2025", estadoBroker: "activo" },
  { id: "52.789.456", nombre: "Camilo Restrepo", asesor: "Ruby / Caribe", zona: "Caribe", contratos: "17", fecha: "02 Nov 2025", estadoBroker: "activo" },
  { id: "1.033.678.912", nombre: "Sandra Milena Torres", asesor: "Angie / Bogotá", zona: "Bogotá", contratos: "3", fecha: "28 Oct 2025", estadoBroker: "activo" },
];

const RECHAZADOS_ROWS: BrokerRow[] = [
  { id: "1.045.789.123", nombre: "Julián David Pérez", asesor: "Angie / Bogotá", fecha: "05 May 2026", estadoBroker: "rechazado" },
  { id: "80.123.456", nombre: "Natalia Ríos Cardona", asesor: "Ruby / Caribe", fecha: "29 Abr 2026", estadoBroker: "inactivo" },
  { id: "1.012.345.678", nombre: "Óscar Mauricio Gil", asesor: "Sin asignar", fecha: "18 Abr 2026", estadoBroker: "rechazado" },
];

const ESTADO_SOLICITUD_BADGE: Record<EstadoSolicitud, { label: string; variant: "pending" | "active" | "registered" | "neutral" }> = {
  registrado: { label: "Registrado en la web", variant: "registered" },
  validacion: { label: "Validación Docs", variant: "pending" },
  firma: { label: "Firma Contrato", variant: "active" },
  capacitacion: { label: "Capacitación", variant: "neutral" },
};

const ESTADO_BROKER_BADGE: Record<EstadoBroker, { label: string; variant: "active" | "rejected" | "neutral" }> = {
  activo: { label: "Activo", variant: "active" },
  inactivo: { label: "Inactivo", variant: "neutral" },
  rechazado: { label: "Rechazado", variant: "rejected" },
};

const SOLICITUDES_COLUMNS = [
  { key: "id", header: "Documento", width: 130 },
  { key: "nombre", header: "Nombre" },
  { key: "estado", header: "Estado", width: 175 },
  { key: "asesor", header: "Asesor", width: 150 },
  { key: "fecha", header: "Fecha", width: 110 },
  { key: "acciones", header: "Acciones", width: 90 },
];

const ACTIVOS_COLUMNS = [
  { key: "id", header: "Documento", width: 130 },
  { key: "nombre", header: "Nombre" },
  { key: "zona", header: "Zona", width: 100 },
  { key: "contratos", header: "Contratos", width: 95 },
  { key: "asesor", header: "Asesor", width: 150 },
  { key: "fecha", header: "Fecha alta", width: 110 },
  { key: "acciones", header: "Acciones", width: 90 },
];

const RECHAZADOS_COLUMNS = [
  { key: "id", header: "Documento", width: 130 },
  { key: "nombre", header: "Nombre" },
  { key: "estado", header: "Estado", width: 130 },
  { key: "asesor", header: "Asesor", width: 150 },
  { key: "fecha", header: "Fecha", width: 110 },
  { key: "acciones", header: "Acciones", width: 90 },
];

const SEARCH_OPTIONS = [
  { value: "id", label: "ID / Documento" },
  { value: "nombre", label: "Nombre" },
  { value: "asesor", label: "Asesor" },
  { value: "zona", label: "Zona" },
];

const METRICS = [
  { label: "Solicitudes mes (Mes actual)", value: "18" },
  { label: "Brokers activos", value: "842" },
  { label: "Contratos (Mes actual)", value: "156" },
  { label: "Inactivos / Rechazados", value: "34" },
];

interface Props {
  onViewBroker: (broker: BrokerRow) => void;
  pendingApprove?: BrokerRow | null;
  pendingInactivate?: BrokerRow | null;
  onPendingHandled?: () => void;
}

export function Brokers({ onViewBroker, pendingApprove, pendingInactivate, onPendingHandled }: Props) {
  const [tab, setTab] = useState("solicitudes");
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);
  const [solicitudesRows, setSolicitudesRows] = useState(SOLICITUDES_ROWS);
  const [activosRows, setActivosRows] = useState(ACTIVOS_ROWS);
  const [rechazadosRows, setRechazadosRows] = useState(RECHAZADOS_ROWS);

  const changeTab = (id: string) => { setTab(id); setPage(1); setQuery(""); setApplied(null); };
  const doSearch = () => { setApplied({ by: searchBy, q: query }); setPage(1); };
  const clearSearch = () => { setQuery(""); setApplied(null); setPage(1); };

  useEffect(() => {
    if (pendingApprove) {
      setSolicitudesRows((prev) => prev.filter((row) => row !== pendingApprove));
      setActivosRows((prev) => [
        { ...pendingApprove, estadoSolicitud: undefined, estadoBroker: "activo" as const },
        ...prev,
      ]);
      setTab("activos");
      setPage(1);
      onPendingHandled?.();
    }
    if (pendingInactivate) {
      setActivosRows((prev) => prev.filter((row) => row !== pendingInactivate));
      setRechazadosRows((prev) => [
        { ...pendingInactivate, estadoBroker: "inactivo" as const },
        ...prev,
      ]);
      setTab("rechazados");
      setPage(1);
      onPendingHandled?.();
    }
  }, [pendingApprove, pendingInactivate, onPendingHandled]);

  const TABS = [
    { id: "activos", label: "Activos", count: activosRows.length },
    { id: "solicitudes", label: "Solicitudes", count: solicitudesRows.length },
    { id: "rechazados", label: "Rechazados / Inactivos", count: rechazadosRows.length },
  ];

  const baseRows =
    tab === "activos" ? activosRows : tab === "rechazados" ? rechazadosRows : solicitudesRows;

  const sourceRows = baseRows.filter((r) => {
    if (!applied || !applied.q.trim()) return true;
    const q = applied.q.trim().toLowerCase();
    const fields = applied.by
      ? [String(r[applied.by as keyof BrokerRow] ?? "")]
      : Object.values(r).map(String);
    return fields.some((v) => v.toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil(sourceRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = sourceRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const tableRows = pageRows.map((r) => ({
    ...r,
    acciones: (
      <div className="flex items-center gap-1">
        <IconButton icon={MessageCircle} title="Contactar por WhatsApp" />
        <IconButton icon={Eye} title="Ver detalle" onClick={() => onViewBroker(r)} />
      </div>
    ),
    estado: r.estadoSolicitud ? (
      <StatusBadge label={ESTADO_SOLICITUD_BADGE[r.estadoSolicitud].label} variant={ESTADO_SOLICITUD_BADGE[r.estadoSolicitud].variant} />
    ) : r.estadoBroker ? (
      <StatusBadge label={ESTADO_BROKER_BADGE[r.estadoBroker].label} variant={ESTADO_BROKER_BADGE[r.estadoBroker].variant} />
    ) : null,
  }));

  const columns =
    tab === "activos" ? ACTIVOS_COLUMNS : tab === "rechazados" ? RECHAZADOS_COLUMNS : SOLICITUDES_COLUMNS;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Brokers Externos"
        description="Gestión de Solicitudes y Red Comercial Aliada"
        actions={<AppButton variant="primary" bold>Agregar Broker</AppButton>}
      />

      <MetricsRow metrics={METRICS} />

      <TabBar tabs={TABS} active={tab} onChange={changeTab} />

      <section
        className="rounded-lg flex flex-col gap-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <AppButton variant="ghost"><Filter size={14} /> Filtrar</AppButton>
          <div className="flex items-center gap-3">
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>Buscar por:</span>
            <SelectInput options={SEARCH_OPTIONS} value={searchBy} onChange={setSearchBy} className="min-w-[180px]" />
            <TextInput placeholder="Buscar" value={query} onChange={setQuery} onEnter={doSearch} onClear={clearSearch} className="min-w-[200px]" />
            <AppButton variant="secondary" bold onClick={doSearch}>Buscar</AppButton>
          </div>
        </div>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        {tableRows.length > 0 ? (
          <>
            <DataTable columns={columns} rows={tableRows} onRowClick={(i) => onViewBroker(pageRows[i])} />
            <p className="body-regular text-right" style={{ color: "var(--gray-9)", margin: 0 }}>
              Mostrando <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{pageRows.length}</span> de{" "}
              <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{sourceRows.length}</span>
            </p>
            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <EmptyState
            title="Sin resultados"
            description="No encontramos brokers que coincidan con la búsqueda aplicada. Ajusta los criterios e intenta de nuevo."
            action={<AppButton variant="secondary" onClick={clearSearch}>Limpiar búsqueda</AppButton>}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
