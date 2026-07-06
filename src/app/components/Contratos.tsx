import { useEffect, useState } from "react";
import { Filter, Pencil, Eye } from "lucide-react";
import { PageHeader } from "./kit/PageHeader";
import { AppButton } from "./kit/AppButton";
import { TabBar } from "./kit/TabBar";
import { DataTable } from "./kit/DataTable";
import { StatusBadge } from "./kit/StatusBadge";
import { IconButton } from "./kit/IconButton";
import { TextInput } from "./kit/TextInput";
import { SelectInput } from "./kit/SelectInput";
import { Pagination } from "./kit/Pagination";
import { ToggleSwitch } from "./kit/ToggleSwitch";
import { EmptyState } from "./kit/EmptyState";
import { Footer } from "./kit/Footer";
import { CrearContrato } from "./CrearContrato";

const PAGE_SIZE = 10;

interface EstudioRow {
  consecutivo: string;
  inmueble: string;
  asegurado: string;
  email: string;
  celular: string;
}

const ESTUDIO_ROWS: EstudioRow[] = [
  { consecutivo: "-", inmueble: "6021", asegurado: "-", email: "-", celular: "3128516692" },
  { consecutivo: "-", inmueble: "6021", asegurado: "-", email: "camila.rincon@alquilando.com", celular: "-" },
  { consecutivo: "-", inmueble: "6021", asegurado: "-", email: "-", celular: "3132598387" },
  { consecutivo: "-", inmueble: "6458", asegurado: "-", email: "-", celular: "3228907591" },
  { consecutivo: "-", inmueble: "6458", asegurado: "-", email: "-", celular: "3028254633" },
  { consecutivo: "-", inmueble: "6458", asegurado: "-", email: "-", celular: "3202731879" },
  { consecutivo: "-", inmueble: "6458", asegurado: "-", email: "-", celular: "3126321408" },
  { consecutivo: "-", inmueble: "6458", asegurado: "-", email: "-", celular: "3202731879" },
  { consecutivo: "-", inmueble: "6379", asegurado: "-", email: "-", celular: "3004808132" },
  { consecutivo: "-", inmueble: "4631", asegurado: "-", email: "christiansenmaria@hotmail.com", celular: "-" },
  { consecutivo: "-", inmueble: "6300", asegurado: "-", email: "-", celular: "3115048821" },
  { consecutivo: "-", inmueble: "6021", asegurado: "-", email: "andres.melo@gmail.com", celular: "-" },
  { consecutivo: "-", inmueble: "4631", asegurado: "-", email: "-", celular: "3186654421" },
];

type EstadoContrato = "elaboracion" | "ejecucion" | "precontrato";
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

const ADMIN_ROWS: ContratoRow[] = [
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "comercial" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "2939", inmobiliaria: "Alquilando SAS", direccion: "CL 18 # 100 - 08 OF 3", inmueble: "CL 18 # 100 - 08 OF 3", zona: "BOGOTA", inicio: "2023-06-01", fin: "2027-05-31", estado: "ejecucion", tipo: "comercial" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "4367", inmobiliaria: "Consultoria & Marketing Inmobiliario S.A.S", direccion: "CR 85 K # 26 G - 53 AP 909 - BRR MODELIA", inmueble: "CR 85 K # 26 G - 53 AP 909", zona: "Occidente", inicio: "2026-06-01", fin: "2027-05-31", estado: "ejecucion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "comercial" },
  { contrato: "4365", inmobiliaria: "Alquilando Caribe", direccion: "CR 74 # 31 F - 76 AP 1001 - BRR 12 DE OCTUBRE", inmueble: "CR 74 # 31 F - 76 AP 1001", zona: "Norte", inicio: "2026-06-01", fin: "2027-05-31", estado: "ejecucion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "4360", inmobiliaria: "Alquilando SAS", direccion: "KR 85K # 26G 53 TO 1 AP 1218 - BRR MODELIA", inmueble: "KR 85K # 26G 53 AP 1218", zona: "Occidente", inicio: "2026-05-01", fin: "2027-04-30", estado: "ejecucion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "comercial" },
  { contrato: "4358", inmobiliaria: "Izban", direccion: "CL 50 SUR 93D 38 IN 5 AP 204 - BRR KENNEDY", inmueble: "CL 50 SUR 93D 38 AP 204", zona: "Sur", inicio: "2026-05-01", fin: "2027-04-30", estado: "ejecucion", tipo: "vivienda" },
  { contrato: "4351", inmobiliaria: "Edificatoria", direccion: "CL 81 # 109 - 10 AP 203 - BRR BOLIVIA", inmueble: "CL 81 # 109 - 10 AP 203", zona: "Occidente", inicio: "2026-04-15", fin: "2027-04-14", estado: "ejecucion", tipo: "vivienda" },
];

const PENDIENTE_ROWS: ContratoRow[] = [
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

const TABS = [
  { id: "estudio", label: "En estudio poliza", count: ESTUDIO_ROWS.length },
  { id: "admin", label: "Contratos en administración", count: ADMIN_ROWS.length },
  { id: "pendiente", label: "Pendiente de aprobación", count: PENDIENTE_ROWS.length },
];

const ESTADO_BADGE: Record<EstadoContrato, { label: string; variant: "pending" | "active" | "registered" }> = {
  elaboracion: { label: "En elaboración", variant: "pending" },
  ejecucion: { label: "En ejecucion", variant: "active" },
  precontrato: { label: "Pre contrato", variant: "registered" },
};

const ESTUDIO_COLUMNS = [
  { key: "consecutivo", header: "Consecutivo", width: 120 },
  { key: "inmueble", header: "N° Inmueble", width: 110 },
  { key: "asegurado", header: "Asegurado" },
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

export function Contratos() {
  const [tab, setTab] = useState("estudio");
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);
  const [comercial, setComercial] = useState(true);
  const [vivienda, setVivienda] = useState(true);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [tab, page]);

  if (creating) {
    return <CrearContrato onBack={() => setCreating(false)} onFinish={() => setCreating(false)} />;
  }

  const changeTab = (id: string) => { setTab(id); setPage(1); setQuery(""); setApplied(null); };
  const doSearch = () => { setApplied({ by: searchBy, q: query }); setPage(1); };
  const clearSearch = () => { setQuery(""); setApplied(null); setPage(1); };

  const filterContratos = (rows: ContratoRow[]) =>
    rows.filter((r) => {
      if (r.tipo === "comercial" && !comercial) return false;
      if (r.tipo === "vivienda" && !vivienda) return false;
      if (!applied || !applied.q.trim()) return true;
      const q = applied.q.trim().toLowerCase();
      const fields = applied.by
        ? [String(r[applied.by as keyof ContratoRow] ?? "")]
        : Object.values(r).map(String);
      return fields.some((v) => v.toLowerCase().includes(q));
    });

  const isEstudio = tab === "estudio";
  const sourceRows = isEstudio
    ? ESTUDIO_ROWS
    : filterContratos(tab === "admin" ? ADMIN_ROWS : PENDIENTE_ROWS);

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
          opciones: r.estado === "elaboracion"
            ? <IconButton icon={Pencil} title="Continuar edición" />
            : <IconButton icon={Eye} title="Ver resumen" />,
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

      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-0">
          <TabBar tabs={TABS} active={tab} onChange={changeTab} />
        </div>
        {!isEstudio && (
          <div className="flex items-center gap-5 shrink-0">
            <ToggleSwitch checked={comercial} onChange={(v) => { setComercial(v); setPage(1); }} label="Comercial" />
            <ToggleSwitch checked={vivienda} onChange={(v) => { setVivienda(v); setPage(1); }} label="Vivienda" />
          </div>
        )}
      </div>

      <section
        className="rounded-lg flex flex-col gap-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        {!isEstudio && (
          <>
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
          </>
        )}

        {tableRows.length > 0 ? (
          <>
            <DataTable columns={isEstudio ? ESTUDIO_COLUMNS : CONTRATO_COLUMNS} rows={tableRows} loading={loading} />
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
            action={<AppButton variant="secondary" onClick={clearSearch}>Limpiar búsqueda</AppButton>}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
