import { useState } from "react";
import { Filter, Eye, LayoutGrid, List, FileBarChart, Plus, MapPin, Building2, Calendar } from "lucide-react";
import { PageHeader } from "./kit/PageHeader";
import { AppButton } from "./kit/AppButton";
import { TabBar } from "./kit/TabBar";
import { DataTable } from "./kit/DataTable";
import { IconButton } from "./kit/IconButton";
import { Pagination } from "./kit/Pagination";
import { Footer } from "./kit/Footer";
import { SolicitudDetalle } from "./SolicitudDetalle";

export interface Solicitud {
  titulo: string;
  codigo: string;
  fecha: string;
  direccion: string;
  estado: string;
}

/** Colores por estado/categoría — mismo diseño que StatusBadge (bg claro + texto/borde). */
const ESTADO_COLOR: Record<string, { bg: string; color: string }> = {
  "Inicio": { bg: "var(--green-status-light)", color: "var(--green-status)" },
  "Pendiente": { bg: "var(--orange-status-light)", color: "var(--orange-status)" },
  "Análisis de solicitud": { bg: "#fce7f3", color: "#be185d" },
  "Gasodomésticos": { bg: "#cffafe", color: "#0e7490" },
  "Cerrado ganado": { bg: "var(--green-status-light)", color: "var(--green-status)" },
  "Cierre final eu": { bg: "#ecfccb", color: "#3f6212" },
  "No resuelto": { bg: "var(--red-status-light)", color: "var(--red-status)" },
};

export function EstadoBadge({ estado }: { estado: string }) {
  const c = ESTADO_COLOR[estado] ?? { bg: "var(--gray-4)", color: "var(--gray-9)" };
  return (
    <span
      className="tags px-3 py-1 rounded-full inline-block"
      style={{ backgroundColor: c.bg, color: c.color, border: `1px solid ${c.color}`, whiteSpace: "nowrap" }}
    >
      {estado}
    </span>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon size={14} style={{ color: "var(--navy)", flexShrink: 0, marginTop: 2 }} />
      <div className="flex flex-col min-w-0">
        <span className="disclamer" style={{ color: "var(--gray-7)" }}>{label}</span>
        <span className="body-small-regular truncate" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{value}</span>
      </div>
    </div>
  );
}

const ACTIVAS: Solicitud[] = [
  { titulo: "Negociación #81929", codigo: "3988", fecha: "2026-06-19 19:27:13", direccion: "Kr 100 23h 22 in 17 ap 301", estado: "Inicio" },
  { titulo: "Inm 3988 - generación de códigos de barras #81929", codigo: "3988", fecha: "2026-06-19 19:27:13", direccion: "Kr 100 23h 22 in 17 ap 301", estado: "Inicio" },
  { titulo: "Inm 3997 generación código de barras #81927", codigo: "3997", fecha: "2026-06-19 18:16:05", direccion: "Pie de la popa ed. plaza 22 apt. 208 cra...", estado: "Inicio" },
  { titulo: "3575 terminación definitiva de contrato con alquilando...", codigo: "3575", fecha: "2026-06-19 17:07:52", direccion: "Cr 86 17 96 ap 301 to 11", estado: "Análisis de solicitud" },
  { titulo: "Negociación #81913", codigo: "3959", fecha: "2026-06-19 16:52:31", direccion: "Cr 92 8 a 76 ap 201 torre 1", estado: "Gasodomésticos" },
  { titulo: "Inm 3959 solicitud de reparaciones #81913", codigo: "3959", fecha: "2026-06-19 16:52:31", direccion: "Cr 92 8 a 76 ap 201 torre 1", estado: "Gasodomésticos" },
  { titulo: "Inm 4074 no pago adm e historico #81911", codigo: "4074", fecha: "2026-06-19 16:34:35", direccion: "Ak 14 39 18 ap 313", estado: "Pendiente" },
  { titulo: "Inm 3037 no pago adm e historico #81909", codigo: "3037", fecha: "2026-06-19 16:03:08", direccion: "Calle 71b n0 100a-27 apto 305 int 2", estado: "Pendiente" },
  { titulo: "Inm 3515 revisión estado de cuenta #81901", codigo: "3515", fecha: "2026-06-19 15:03:51", direccion: "Kr 92 # 87b-15 bq 134", estado: "Inicio" },
  { titulo: "Inm 4335 envío de comprobantes de pago a copropiedades...", codigo: "—", fecha: "2026-06-19 14:26:36", direccion: "Cr 85 k # 26 g - 53 1309 - brr modelia", estado: "Pendiente" },
];

const CERRADAS: Solicitud[] = [
  { titulo: "1836 paz y salvo admon", codigo: "1836", fecha: "2026-06-19 20:12:47", direccion: "Carrera 15 # 77-05/59 local 135", estado: "Cerrado ganado" },
  { titulo: "Inm- 2030 - solicitud de proceso en curso #81417", codigo: "2030", fecha: "2026-06-19 14:34:25", direccion: "Cl 119 # 11 b - 24 ap 406", estado: "Cerrado ganado" },
  { titulo: "Inm 1923 revisión estado de cuenta #80257 respondido por...", codigo: "1923", fecha: "2026-06-19 14:19:12", direccion: "Carrera 14 # 101-09 apto 401", estado: "Cerrado ganado" },
  { titulo: "Inm 2735 citación asamblea extraordinaria #81877", codigo: "2735", fecha: "2026-06-19 03:27:01", direccion: "Cl 144 15 22 ap 308", estado: "Cerrado ganado" },
  { titulo: "Inm 1987 revisión estado de cuenta #80957 respondido por...", codigo: "1987", fecha: "2026-06-19 01:00:28", direccion: "Carrera 11 # 82-02 deposito 40 y 63", estado: "Cerrado ganado" },
  { titulo: "Inm 2051 revisión estado de cuenta #80937 respondido por...", codigo: "2051", fecha: "2026-06-19 00:44:43", direccion: "Kr 100 18 25 local 2", estado: "Cerrado ganado" },
  { titulo: "Inm 4366 solicitud de reparaciones #81871", codigo: "4366", fecha: "2026-06-18 23:56:32", direccion: "Cr 85 k # 26 g - 53 ap 518 - brr fontibon", estado: "Cerrado ganado" },
  { titulo: "Inm 4166 revisión estado de cuenta #81275 respondido por...", codigo: "4166", fecha: "2026-06-18 23:24:21", direccion: "Bocagrande, av. san martin cra. 2 #8-78...", estado: "Cerrado ganado" },
  { titulo: "Inm 4166 revisión estado de cuenta #81275", codigo: "4166", fecha: "2026-06-18 22:44:54", direccion: "Bocagrande, av. san martin cra. 2 #8-78...", estado: "Cierre final eu" },
  { titulo: "Inm 2556 revisión estado de cuenta #80513 respondido por...", codigo: "2556", fecha: "2026-06-18 21:48:11", direccion: "Cl 75 a # 29 a - 12 ap 202", estado: "Cerrado ganado" },
];

const VENCIDAS: Solicitud[] = [
  { titulo: "4215 comprobante de pago de administracion...", codigo: "—", fecha: "2026-01-05 19:34:02", direccion: "—", estado: "Cerrado ganado" },
  { titulo: "2668 prueba entrega solicitudes - vencidas facturación 44403", codigo: "2668", fecha: "2025-07-16 12:39:25", direccion: "Tv 3 c #49-45 ap 301", estado: "Cierre final eu" },
  { titulo: "2688 prueba de vencidas facturación 44387", codigo: "2688", fecha: "2025-07-16 09:31:23", direccion: "Cl 103 a # 17-36 ap 506", estado: "Cierre final eu" },
];

const DATA: Record<string, { rows: Solicitud[]; total: number }> = {
  activas: { rows: ACTIVAS, total: 296 },
  cerradas: { rows: CERRADAS, total: 10044 },
  vencidas: { rows: VENCIDAS, total: 3 },
};

const TABS = [
  { id: "activas", label: "Solicitudes activas" },
  { id: "cerradas", label: "Solicitudes cerradas" },
  { id: "vencidas", label: "Solicitudes vencidas" },
];

const COLUMNS = [
  { key: "titulo", header: "Solicitud" },
  { key: "codigo", header: "Código", width: 90 },
  { key: "fecha", header: "Fecha", width: 160 },
  { key: "direccion", header: "Dirección", width: 200 },
  { key: "estado", header: "Estado", width: 160 },
  { key: "opciones", header: "Opciones", width: 80, align: "center" as const },
];

const REPORTE = [
  { label: "Administraciones", value: "40" },
  { label: "Desocupaciones", value: "14" },
  { label: "Facturación", value: "23" },
  { label: "Jurídico", value: "34" },
  { label: "No resueltos", value: "272" },
  { label: "Reparaciones", value: "93" },
  { label: "Resueltos", value: "0" },
  { label: "Servicio al cliente", value: "61" },
  { label: "Servicios públicos", value: "7" },
  { label: "Sin categoría", value: "Sin información" },
];

const PAGE_SIZE = 10;

export function Solicitudes() {
  const [tab, setTab] = useState("activas");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list" | "grid">("list");
  const [selected, setSelected] = useState<Solicitud | null>(null);

  if (selected) {
    return <SolicitudDetalle solicitud={selected} onBack={() => setSelected(null)} />;
  }

  const { rows, total } = DATA[tab];
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const changeTab = (id: string) => { setTab(id); setPage(1); };

  const tableRows = rows.map((r) => ({
    ...r,
    estado: <EstadoBadge estado={r.estado} />,
    opciones: <IconButton icon={Eye} title="Ver solicitud" onClick={() => setSelected(r)} />,
  }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Solicitudes"
        description="Haz seguimiento a tus novedades, revisa su estado y gestiona prioridades."
        actions={
          <>
            <AppButton variant="secondary" bold><FileBarChart size={15} /> Reportes</AppButton>
            <AppButton variant="primary" bold><Plus size={15} /> Crear solicitud</AppButton>
          </>
        }
      />

      {/* Reporte general */}
      <section
        className="rounded-lg flex flex-col gap-4"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <span className="subtitle" style={{ color: "var(--navy)" }}>Reporte general de solicitudes</span>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
        <div className="grid grid-cols-4 gap-x-6 gap-y-5 max-lg:grid-cols-2">
          {REPORTE.map((m) => (
            <div key={m.label} className="flex flex-col gap-0.5">
              <span className="body-bold" style={{ color: "var(--navy)" }}>{m.label}</span>
              <span className="body-regular" style={{ color: "var(--gray-9)" }}>{m.value}</span>
            </div>
          ))}
        </div>
      </section>

      <TabBar tabs={TABS} active={tab} onChange={changeTab} />

      <section
        className="rounded-lg flex flex-col gap-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <AppButton variant="ghost"><Filter size={14} /> Filtrar</AppButton>
          <div className="flex items-center gap-1">
            <IconButton icon={LayoutGrid} title="Vista de tarjetas" active={view === "grid"} onClick={() => setView("grid")} />
            <IconButton icon={List} title="Vista de lista" active={view === "list"} onClick={() => setView("list")} />
          </div>
        </div>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        {view === "list" ? (
          <DataTable columns={COLUMNS} rows={tableRows} onRowClick={(i) => setSelected(rows[i])} />
        ) : (
          <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
            {rows.map((r, i) => (
              <div
                key={i}
                className="rounded-lg flex flex-col overflow-hidden transition-colors"
                style={{ border: "1px solid var(--gray-4)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--gray-4)"; }}
              >
                {/* Cabecera: título + estado */}
                <div className="flex items-start justify-between gap-3" style={{ padding: "14px 16px" }}>
                  <span className="body-bold" style={{ color: "var(--gray-10)" }}>{r.titulo}</span>
                  <div className="shrink-0"><EstadoBadge estado={r.estado} /></div>
                </div>

                <hr style={{ borderColor: "var(--gray-3)", margin: 0 }} />

                {/* Meta */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5" style={{ padding: "14px 16px" }}>
                  <Meta icon={Building2} label="Código" value={r.codigo} />
                  <Meta icon={Calendar} label="Fecha" value={r.fecha} />
                  <div className="col-span-2"><Meta icon={MapPin} label="Dirección" value={r.direccion} /></div>
                </div>

                {/* Footer acción */}
                <div className="flex justify-end" style={{ padding: "8px 12px", backgroundColor: "var(--gray-1)" }}>
                  <IconButton icon={Eye} title="Ver solicitud" onClick={() => setSelected(r)} />
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="body-regular text-right" style={{ color: "var(--gray-9)", margin: 0 }}>
          Mostrando <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{rows.length}</span> de{" "}
          <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{total}</span>
        </p>
        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </section>

      <Footer />
    </div>
  );
}
