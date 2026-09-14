import { useState } from "react";
import { Footer } from "../Footer";
import { AppSidebar } from "../../AppSidebar";
import { PageHeader } from "../PageHeader";
import { AppButton } from "../AppButton";
import { DataTable } from "../DataTable";
import { StatusBadge } from "../StatusBadge";
import { IconButton } from "../IconButton";
import { MetricsRow } from "../MetricsRow";
import { ContractsChart } from "../ContractsChart";
import { InfoField } from "../InfoField";
import { Modal } from "../Modal";
import { Toast } from "../Toast";
import { HelpBlocks } from "../HelpBlocks";
import { Eye, MessageCircle } from "lucide-react";
import { HabitoPagoCard } from "../HabitoPagoCard";
import { TabBar } from "../TabBar";
import { generarHistorialPagos, clasificarPago, type PagoHistorico } from "../../../data/habitoPago";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="title-tertiary-bold mb-6 pb-2 border-b" style={{ color: "var(--navy)", borderColor: "var(--gray-5)" }}>{children}</h3>;
}

function SidebarNav() {
  const [active, setActive] = useState("inmuebles");
  return (
    <div className="rounded-xl overflow-hidden" style={{ width: 240, height: 500, border: "1px solid var(--gray-4)" }}>
      <AppSidebar active={active} onSelect={setActive} onStyleGuide={() => {}} />
    </div>
  );
}

const DATATABLE_COLUMNS = [
  { key: "id", header: "ID póliza", width: 140 },
  { key: "inmueble", header: "Inmueble / Dirección" },
  { key: "propietario", header: "Propietario", width: 160 },
  { key: "estado", header: "Estado", width: 140 },
  { key: "opciones", header: "Opciones", width: 90 },
];

const DATATABLE_ROWS_RAW = [
  { id: "1.234.567.890", inmueble: "CL 18 # 100 - 08 OF 3", propietario: "Laura Camila Rojas", estadoLabel: "Sin asignar", estadoVariant: "neutral" as const },
  { id: "1.234.567.890", inmueble: "CR 85 K # 26 G - 53 AP 909", propietario: "Carlos Andrés Benítez", estadoLabel: "Validación Docs", estadoVariant: "registered" as const },
  { id: "1.234.567.890", inmueble: "CR 74 # 31 F - 76 AP 1001", propietario: "Diana Patricia Gómez", estadoLabel: "Firma Contrato", estadoVariant: "active" as const },
  { id: "1.234.567.890", inmueble: "KR 85K # 26G 53 AP 1218", propietario: "Andrés Felipe Vargas", estadoLabel: "Capacitación", estadoVariant: "pending" as const },
];

function DataTableDemo() {
  const rows = DATATABLE_ROWS_RAW.map((r) => ({
    ...r,
    estado: <StatusBadge label={r.estadoLabel} variant={r.estadoVariant} />,
    opciones: (
      <div className="flex items-center gap-1">
        <IconButton icon={MessageCircle} title="Contactar por WhatsApp" />
        <IconButton icon={Eye} title="Ver detalle" />
      </div>
    ),
  }));
  return <DataTable columns={DATATABLE_COLUMNS} rows={rows} />;
}

function DetailFieldsDemo({ title }: { title: string }) {
  return (
    <section className="rounded-lg" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}>
      <h4 className="subtitle" style={{ color: "var(--navy)", marginBottom: 16 }}>{title}</h4>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <InfoField label="Estado del inmueble" value="Pendiente" />
        <InfoField label="Nombre de la inmobiliaria" value="Fonnegra Gerlein" />
        <InfoField label="Fecha de captación" value="16 / Junio / 2025" />
        <InfoField label="Tipo de inmueble" value="Apartamento" />
        <InfoField label="Ciudad" value="Bogotá" />
        <InfoField label="Barrio" value="Suba" />
      </div>
    </section>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AppButton variant="primary" onClick={() => setOpen(true)}>Abrir modal</AppButton>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirmar acción">
        <p className="body-regular" style={{ color: "var(--gray-10)" }}>
          Este es el componente Modal real del kit — overlay oscuro, cierre con Escape o clic afuera, header con título y botón de cierre.
        </p>
      </Modal>
    </>
  );
}

function ToastDemo() {
  const [show, setShow] = useState(false);
  return (
    <>
      <AppButton variant="secondary" onClick={() => setShow(true)}>Mostrar toast</AppButton>
      {show && (
        <Toast
          message="Andrés Camargo ahora es un broker activo."
          description="El estado se actualizó en la lista de brokers."
          onClose={() => setShow(false)}
        />
      )}
    </>
  );
}

const HELP_BLOCKS_DEMO = [
  { type: "text" as const, text: "Los bloques de ayuda componen el contenido de Mesa de ayuda: texto, listas, links, callouts, imágenes y video." },
  { type: "list" as const, items: ["Abre Ver perfil (bajo tu nombre en el menú lateral).", "Elige Cambiar contraseña.", "Ingresa la actual y la nueva."] },
  { type: "callout" as const, variant: "info" as const, title: "Tip", text: "La contraseña temporal expira en 24 horas." },
  { type: "link" as const, label: "Ver publicación completa", href: "https://example.com" },
];

const HABITO_DEMO = generarHistorialPagos({ seed: "styleguide-habito", canon: 1_250_000, perfil: "medio" });

/** Mismo histórico, con dos periodos que el backend no resolvió. */
const HABITO_INCOMPLETO: PagoHistorico[] = HABITO_DEMO.map((p, i) =>
  i === 3 || i === 7
    ? { ...p, fechaPago: null, valor: 0, diasDiferencia: 0, estado: "sin-dato" as const }
    : p,
);

/** Contrato recién iniciado: hay periodo facturado pero ningún pago cerrado. */
const HABITO_SIN_HISTORIAL: PagoHistorico[] = [
  {
    periodo: "2026-08",
    fechaLimite: "2026-08-05",
    fechaPago: null,
    valor: 1_250_000,
    diasDiferencia: 0,
    estado: clasificarPago(0, false),
  },
];

const HABITO_ESTADOS = [
  { id: "datos", label: "Con historial" },
  { id: "incompleto", label: "Datos incompletos" },
  { id: "vacio", label: "Sin historial" },
  { id: "carga", label: "Carga" },
  { id: "error", label: "Error" },
];

function HabitoPagoDemo() {
  const [estado, setEstado] = useState("datos");
  return (
    <div className="flex flex-col gap-4">
      <TabBar tabs={HABITO_ESTADOS} active={estado} onChange={setEstado} />
      {estado === "datos" && <HabitoPagoCard pagos={HABITO_DEMO} numeroContrato="4367" />}
      {estado === "incompleto" && <HabitoPagoCard pagos={HABITO_INCOMPLETO} numeroContrato="4367" periodosSinDato={2} />}
      {estado === "vacio" && <HabitoPagoCard pagos={HABITO_SIN_HISTORIAL} numeroContrato="4367" />}
      {estado === "carga" && <HabitoPagoCard pagos={[]} numeroContrato="4367" loading />}
      {estado === "error" && (
        <HabitoPagoCard
          pagos={[]}
          numeroContrato="4367"
          error="El servicio de recaudo no respondió. Intenta de nuevo en unos minutos."
          onReintentar={() => {}}
        />
      )}
    </div>
  );
}

export function Organisms() {
  return (
    <div className="space-y-16">
      <div><SectionTitle>Navegación lateral (AppSidebar)</SectionTitle><SidebarNav /></div>

      <div>
        <SectionTitle>Encabezado de página (PageHeader)</SectionTitle>
        <div className="space-y-4">
          <PageHeader title="Inmuebles" description="Administra y revisa todos tus inmuebles de manera fácil y rápida." actions={<AppButton variant="primary">Captar inmueble</AppButton>} />
          <PageHeader title="Brokers" description="Gestión de Solicitudes y Red Comercial Aliada" actions={<AppButton variant="primary">Agregar Broker</AppButton>} />
        </div>
      </div>

      <div>
        <SectionTitle>Fila de métricas (MetricsRow)</SectionTitle>
        <MetricsRow
          metrics={[
            { label: "Disponibles en arriendo", value: "213" },
            { label: "Inmuebles disponibles", value: "110" },
            { label: "Inclusiones Alquilando", value: "18", showEye: true },
            {
              label: "Segmentación por categoría",
              breakdown: [
                { value: "21 %", label: "Residencial" },
                { value: "51 %", label: "Comercial" },
              ],
            },
          ]}
        />
      </div>

      <div><SectionTitle>Tabla de datos (DataTable)</SectionTitle><DataTableDemo /></div>

      <div>
        <SectionTitle>Sección de detalle (InfoField grid)</SectionTitle>
        <div className="max-w-lg"><DetailFieldsDemo title="Inmueble" /></div>
        <p className="tags mt-3" style={{ color: "var(--gray-8)" }}>Patrón usado en *Detalle.tsx (InmuebleDetalle, PropietarioDetalle, InquilinoDetalle...) — sección blanca bordeada + grid de InfoField, sin componente contenedor dedicado.</p>
      </div>

      <div><SectionTitle>Gráfica de contratos (ContractsChart)</SectionTitle><ContractsChart /></div>

      <div>
        <SectionTitle>Widget de recaudo — Hábito de pago (HabitoPagoCard)</SectionTitle>
        <HabitoPagoDemo />
        <p className="tags mt-3" style={{ color: "var(--gray-8)" }}>
          Exclusivo de la inmobiliaria maestra (<code>useEsInmobiliariaMaestra()</code>). Se abre desde el link
          <em> Ver hábito de pago</em> de la tarjeta <em>Estado de cuenta</em>, en la interna del contrato en
          administración (Contratos → En administración → Ver resumen). Contrato de datos en{" "}
          <code>guidelines/habito-de-pago.md</code>.
        </p>
      </div>

      <div>
        <SectionTitle>Ventana modal (Modal)</SectionTitle>
        <ModalDemo />
      </div>

      <div>
        <SectionTitle>Notificación flotante (Toast)</SectionTitle>
        <ToastDemo />
      </div>

      <div>
        <SectionTitle>Bloques de ayuda (HelpBlocks)</SectionTitle>
        <div className="rounded-xl border p-6" style={{ borderColor: "var(--gray-5)", backgroundColor: "#ffffff" }}>
          <HelpBlocks blocks={HELP_BLOCKS_DEMO} />
        </div>
      </div>

      <div>
        <SectionTitle>Footer</SectionTitle>
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: "var(--gray-5)" }}><Footer /></div>
        <p className="tags mt-3" style={{ color: "var(--gray-8)" }}>Borde superior automático · Logo centrado en <code>var(--gray-6)</code> · Altura fija 61px</p>
      </div>
    </div>
  );
}
