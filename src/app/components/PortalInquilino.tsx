import { useState } from "react";
import {
  Home, CreditCard, FileText, Inbox, LifeBuoy, LogOut, Construction, Shield,
  Bell, AlertCircle, ChevronRight, X, CircleDollarSign, Barcode, MessageCircle,
  Phone, MessageSquareText, CarFront, PawPrint, Sofa, CircleCheck, ShieldCheck,
  ArrowLeft, ShieldOff, PhoneCall, ChevronDown, ChevronUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AlquilandoLogo } from "./kit/AlquilandoLogo";
import { EmptyState } from "./kit/EmptyState";
import { Footer } from "./kit/Footer";
import { LinkText } from "./kit/LinkText";
import { AppButton } from "./kit/AppButton";
import { StatusBadge } from "./kit/StatusBadge";
import { SelectInput } from "./kit/SelectInput";
import { TextInput } from "./kit/TextInput";
import { Accordion } from "./kit/Accordion";
import { Modal } from "./kit/Modal";
import { Callout } from "./kit/Callout";
import segurosBanner from "../../assets/seguros-banner.png";
import logoSegurosBolivar from "../../assets/logo-seguros-bolivar.png";
import { CotizadorHogar, formatCOPNumber, formatFechaCorta } from "./CotizadorHogar";
import type { PolizaComprada } from "./CotizadorHogar";

const PURPLE = "#6d28d9";
const PURPLE_DARK = "#5b21b6";
const PURPLE_LIGHT = "#f5f3ff";

/** Overrides de tokens: dentro del portal del inquilino todo lo "navy" se vuelve púrpura. */
const THEME = {
  "--navy": PURPLE,
  "--navy-dark": PURPLE_DARK,
  "--navy-light": PURPLE_LIGHT,
  "--violeta": PURPLE,
} as React.CSSProperties;

const NAV: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "pagos", label: "Mis pagos", icon: CreditCard },
  { id: "seguros", label: "Seguros", icon: Shield },
  { id: "contrato", label: "Mi contrato", icon: FileText },
  { id: "solicitudes", label: "Mis solicitudes", icon: Inbox },
  { id: "ayuda", label: "Ayuda", icon: LifeBuoy },
];

const TITULOS: Record<string, { title: string; description: string }> = {
  inicio: { title: "¡Hola, Nelson Diaz!", description: "Todo lo que necesitas para gestionar tu alquiler empieza aquí." },
  pagos: { title: "Mis pagos", description: "Paga tu arriendo en línea y consulta tu historial de comprobantes." },
  seguros: { title: "Seguros", description: "Protege lo que más quieres con seguros pensados para tu día a día." },
  contrato: { title: "Mi contrato", description: "Consulta tu contrato, fechas clave y documentos asociados." },
  solicitudes: { title: "Mis solicitudes", description: "Crea y haz seguimiento a tus solicitudes y novedades." },
  ayuda: { title: "Ayuda", description: "Resolvemos tus dudas, ¡sin complicaciones!" },
};

const INMUEBLES = [
  { value: "carrera-23", label: "Carrera 23 # 45 - 34 sur" },
  { value: "calle-80", label: "Calle 80 # 12 - 08, apto 502" },
];

// ─── Estado de cuenta ────────────────────────────────────────────────────────

const ESTADO_CUENTA: { label: string; value: string }[] = [
  { label: "Número de contrato", value: "1731" },
  { label: "Mes a pagar", value: "Julio de 2026" },
  { label: "Canon de arrendamiento", value: "$6.980.963" },
  { label: "Administración PH", value: "$1.222.358" },
  { label: "IVA 19%", value: "$1.326.383" },
  { label: "Retención", value: "$244.334" },
  { label: "Reteica", value: "$67.436" },
  { label: "Rete IVA", value: "$0" },
  { label: "Saldo", value: "$0" },
  { label: "Servicios", value: "$0" },
  { label: "Otros", value: "$0" },
];

const FECHAS_PAGO: { label: string; value: string; vigente?: boolean }[] = [
  { label: "Después del 28 / 07 / 2026", value: "$10.037.543" },
  { label: "Después del 24 / 07 / 2026", value: "$9.555.543" },
  { label: "Antes del 24 / 07 / 2026", value: "$9.055.543", vigente: true },
];

function EstadoCuenta() {
  return (
    <section className="rounded-lg flex flex-col" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="title-tertiary-bold" style={{ color: PURPLE }}>Estado de cuenta</h2>
        <LinkText size="small" icon="chevron">Ver historial de pagos</LinkText>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap" style={{ marginTop: 18 }}>
        <span className="body-bold" style={{ color: "var(--gray-10)" }}>Canon de alquiler de julio</span>
        <StatusBadge label="Pendiente pago" variant="pending" />
      </div>

      <div className="flex flex-col" style={{ marginTop: 10 }}>
        {ESTADO_CUENTA.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 py-1.5" style={{ borderBottom: "1px solid var(--gray-2)" }}>
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{r.label}</span>
            <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{r.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 py-2">
          <span className="body-bold" style={{ color: "var(--gray-10)" }}>TOTAL</span>
          <span className="body-bold" style={{ color: "var(--gray-10)" }}>$9.055.543</span>
        </div>
      </div>

      <div className="flex flex-col gap-2" style={{ marginTop: 12 }}>
        {FECHAS_PAGO.map((f) => (
          <div
            key={f.label}
            className="flex items-center justify-between gap-4 rounded-lg px-3 py-2"
            style={{
              border: f.vigente ? `1.5px solid ${PURPLE}` : "1px solid var(--gray-4)",
              backgroundColor: f.vigente ? PURPLE_LIGHT : "#ffffff",
            }}
          >
            <span className={f.vigente ? "body-small-bold" : "body-small-regular"} style={{ color: f.vigente ? PURPLE : "var(--gray-9)" }}>
              {f.label}
            </span>
            <span className={f.vigente ? "body-small-bold" : "body-small-regular"} style={{ color: f.vigente ? PURPLE : "var(--gray-10)" }}>
              {f.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap" style={{ marginTop: 18 }}>
        <span className="body-bold" style={{ color: "var(--gray-10)" }}>Valor total a pagar</span>
        <span className="title-primary-bold" style={{ color: PURPLE }}>$9.055.543</span>
      </div>

      <hr style={{ borderColor: "var(--gray-4)", margin: "18px 0" }} />

      <h3 className="body-bold" style={{ color: PURPLE }}>Opciones de pago</h3>

      <div className="flex items-start gap-3" style={{ marginTop: 14 }}>
        <CircleDollarSign size={20} strokeWidth={1.6} style={{ color: PURPLE, flexShrink: 0, marginTop: 2 }} />
        <div className="flex-1 flex flex-col gap-3">
          <p className="body-small-regular" style={{ color: "var(--gray-10)", margin: 0 }}>
            <span style={{ fontWeight: 700 }}>Para pago por PSE:</span> paga tu alquiler fácil y seguro con PSE.
            Ingresa, elige tu banco y listo: ¡sin moverte de casa!
          </p>
          <div className="flex items-center justify-end">
            <AppButton variant="primary" bold>Ir a pagar</AppButton>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3" style={{ marginTop: 16 }}>
        <Barcode size={20} strokeWidth={1.6} style={{ color: PURPLE, flexShrink: 0, marginTop: 2 }} />
        <div className="flex-1 flex flex-col gap-3">
          <p className="body-small-regular" style={{ color: "var(--gray-10)", margin: 0 }}>
            <span style={{ fontWeight: 700 }}>Para pago por consignación con código de barras:</span> ¡simplificamos
            tus pagos! Genera tu código de barras y realiza la consignación en puntos autorizados.
          </p>
          <div className="flex items-center justify-end">
            <AppButton variant="secondary" bold>Generar código de barras</AppButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Inicio mobile: experiencia tipo app ─────────────────────────────────────

/** Accesos rápidos del home mobile: lo que un inquilino hace más seguido. */
const QUICK_ACTIONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "pagos", label: "Pagar", icon: CreditCard },
  { id: "contrato", label: "Contrato", icon: FileText },
  { id: "solicitudes", label: "Solicitudes", icon: Inbox },
  { id: "ayuda", label: "Ayuda", icon: LifeBuoy },
];

/**
 * Card de pago estilo app fintech: total, vencimiento y acciones al frente;
 * el desglose contable completo queda plegado bajo demanda.
 */
function PagoCardMobile() {
  const [verDesglose, setVerDesglose] = useState(false);
  const vigente = FECHAS_PAGO.find((f) => f.vigente)!;

  return (
    <section
      className="rounded-2xl flex flex-col gap-4"
      style={{
        background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_DARK} 100%)`,
        padding: "20px",
        boxShadow: "0 12px 28px rgba(109, 40, 217, 0.28)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="body-bold" style={{ color: "#ffffff" }}>Canon de julio</span>
        <span
          className="tags inline-flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#ffffff" }}
        >
          Pendiente pago
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="disclamer" style={{ color: "rgba(255,255,255,0.75)" }}>Total a pagar</span>
        <span className="title-primary-bold" style={{ color: "#ffffff", fontSize: 34, lineHeight: 1.15 }}>
          {vigente.value}
        </span>
        <span className="body-small-regular" style={{ color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
          Pagando {vigente.label.toLowerCase()} · contrato 1731
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          className="body-bold w-full flex items-center justify-center gap-2 rounded-xl"
          style={{ height: 48, backgroundColor: "#ffffff", color: PURPLE, border: "none", cursor: "pointer" }}
        >
          <CircleDollarSign size={18} strokeWidth={1.8} /> Pagar ahora con PSE
        </button>
        <button
          className="body-bold w-full flex items-center justify-center gap-2 rounded-xl"
          style={{ height: 48, backgroundColor: "transparent", color: "#ffffff", border: "1.5px solid rgba(255,255,255,0.55)", cursor: "pointer" }}
        >
          <Barcode size={18} strokeWidth={1.8} /> Código de barras
        </button>
      </div>

      <button
        onClick={() => setVerDesglose((v) => !v)}
        className="body-small-bold w-full flex items-center justify-center gap-1.5"
        style={{ backgroundColor: "transparent", color: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", padding: "2px 0" }}
      >
        {verDesglose ? "Ocultar desglose" : "Ver desglose completo"}
        {verDesglose ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {verDesglose && (
        <div
          className="rounded-xl flex flex-col gap-3"
          style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", padding: "14px 16px" }}
        >
          <div className="flex flex-col">
            {ESTADO_CUENTA.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-4 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                <span className="body-small-regular" style={{ color: "rgba(255,255,255,0.8)" }}>{r.label}</span>
                <span className="body-small-regular" style={{ color: "#ffffff", fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="disclamer" style={{ color: "rgba(255,255,255,0.75)" }}>SEGÚN LA FECHA DE PAGO</span>
            {FECHAS_PAGO.map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-1.5"
                style={{ backgroundColor: f.vigente ? "rgba(255,255,255,0.18)" : "transparent" }}
              >
                <span className="body-small-regular" style={{ color: f.vigente ? "#ffffff" : "rgba(255,255,255,0.75)", fontWeight: f.vigente ? 700 : 400 }}>
                  {f.label}
                </span>
                <span className="body-small-regular" style={{ color: f.vigente ? "#ffffff" : "rgba(255,255,255,0.75)", fontWeight: f.vigente ? 700 : 400 }}>
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

interface InicioMobileProps {
  inmueble: string;
  onInmueble: (v: string) => void;
  polizas: PolizaComprada[];
  onVerSeguros: () => void;
  goTo: (id: string) => void;
}

function InicioMobile({ inmueble, onInmueble, polizas, onVerSeguros, goTo }: InicioMobileProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Saludo compacto + selector de inmueble */}
      <div className="flex flex-col gap-2.5">
        <div>
          <h1 className="title-secondary" style={{ color: PURPLE }}>¡Hola, Nelson! 👋</h1>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
            Esto es lo que pasa hoy con tu arriendo.
          </p>
        </div>
        <SelectInput options={INMUEBLES} value={inmueble} onChange={onInmueble} />
      </div>

      <PagoCardMobile />

      {/* Accesos rápidos tipo app */}
      <div className="grid grid-cols-4 gap-2">
        {QUICK_ACTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => goTo(id)}
            className="flex flex-col items-center gap-1.5 rounded-xl py-3"
            style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", cursor: "pointer" }}
          >
            <span className="flex items-center justify-center rounded-full" style={{ width: 40, height: 40, backgroundColor: PURPLE_LIGHT }}>
              <Icon size={18} strokeWidth={1.7} style={{ color: PURPLE }} />
            </span>
            <span className="disclamer" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{label}</span>
          </button>
        ))}
      </div>

      <BannerSeguros onVerSeguros={onVerSeguros} polizas={polizas} />
    </div>
  );
}

// ─── Notificaciones ──────────────────────────────────────────────────────────

type NotifCategoria = "solicitudes" | "pagos" | "noticias";

interface Notificacion {
  id: number;
  categoria: NotifCategoria;
  titulo: string;
  descripcion: string;
  cta?: string;
  accion?: "cotizar-hogar" | "ir-a-pagar";
  destacada?: boolean;
}

const NOTIFICACIONES_INICIALES: Notificacion[] = [
  {
    id: 1,
    categoria: "noticias",
    titulo: "Protege lo que más quieres con Seguro de Hogar.",
    descripcion: "Asegura tus muebles, electrodomésticos y objetos de valor contra daños o robo desde $15.000/mes.",
    cta: "Adquirir Seguro de Hogar",
    accion: "cotizar-hogar",
    destacada: true,
  },
  {
    id: 2,
    categoria: "noticias",
    titulo: "Cuida a tu peludo como se merece.",
    descripcion: "Nuevo Seguro de Mascotas: cubre gastos veterinarios, vacunas y daños a terceros. ¡Tu mejor amigo protegido!",
  },
  {
    id: 3,
    categoria: "pagos",
    titulo: "Tu canon de julio está pendiente.",
    descripcion: "Paga antes del 24 / 07 / 2026 y evita intereses de mora. Puedes pagar por PSE o con código de barras.",
    cta: "Ir a pagar",
    destacada: true,
  },
  {
    id: 4,
    categoria: "solicitudes",
    titulo: "Tu solicitud #2054 fue resuelta.",
    descripcion: "La reparación de la fuga en la cocina fue completada. Califica la atención recibida.",
  },
];

const NOTIF_TABS: { id: "todos" | NotifCategoria; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "solicitudes", label: "Solicitudes" },
  { id: "pagos", label: "Pagos" },
  { id: "noticias", label: "Noticias" },
];

function Notificaciones({ onCotizarHogar, items, setItems, hideTitle }: {
  onCotizarHogar: () => void;
  items: Notificacion[];
  setItems: React.Dispatch<React.SetStateAction<Notificacion[]>>;
  /** Oculta el encabezado propio cuando el contenedor ya lo aporta (panel mobile). */
  hideTitle?: boolean;
}) {
  const [tab, setTab] = useState<"todos" | NotifCategoria>("todos");

  const visibles = tab === "todos" ? items : items.filter((n) => n.categoria === tab);
  const countFor = (id: string) => (id === "todos" ? items.length : items.filter((n) => n.categoria === id).length);

  return (
    <section className="rounded-lg flex flex-col" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}>
      {!hideTitle && (
        <div className="flex items-center gap-2.5">
          <Bell size={20} strokeWidth={1.8} style={{ color: PURPLE }} />
          <h2 className="title-tertiary-bold" style={{ color: PURPLE }}>Notificaciones</h2>
        </div>
      )}

      <div className="flex items-center gap-1 overflow-x-auto" style={{ borderBottom: "1px solid var(--gray-4)", marginTop: hideTitle ? 0 : 14 }}>
        {NOTIF_TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-3 pb-2 pt-1 shrink-0"
              style={{
                cursor: "pointer",
                backgroundColor: "transparent",
                borderBottom: isActive ? `2px solid ${PURPLE}` : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              <span className={isActive ? "body-small-bold" : "body-small-regular"} style={{ color: isActive ? PURPLE : "var(--gray-8)" }}>
                {t.label}
              </span>
              <span
                className="disclamer rounded-full px-1.5"
                style={{
                  backgroundColor: isActive ? PURPLE_LIGHT : "var(--gray-2)",
                  color: isActive ? PURPLE : "var(--gray-8)",
                  minWidth: 18,
                  textAlign: "center",
                }}
              >
                {countFor(t.id)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3" style={{ marginTop: 16 }}>
        {visibles.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8">
            <Bell size={28} strokeWidth={1.4} style={{ color: "var(--gray-6)" }} />
            <span className="body-regular" style={{ color: "var(--gray-8)" }}>No tienes notificaciones en esta categoría.</span>
          </div>
        )}
        {visibles.map((n) => (
          <div
            key={n.id}
            className="flex items-start gap-3 rounded-lg"
            style={{
              backgroundColor: "#fafafa",
              borderLeft: `3px solid ${n.destacada ? "var(--alquilando)" : "var(--gray-4)"}`,
              padding: "14px 14px 14px 16px",
            }}
          >
            {n.destacada
              ? <AlertCircle size={18} strokeWidth={1.8} style={{ color: PURPLE, flexShrink: 0, marginTop: 2 }} />
              : <Bell size={18} strokeWidth={1.8} style={{ color: "var(--gray-8)", flexShrink: 0, marginTop: 2 }} />}
            <div className="flex-1 flex flex-col gap-1">
              <span className="body-small-bold" style={{ color: "var(--gray-10)" }}>{n.titulo}</span>
              <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{n.descripcion}</span>
              {n.cta && (
                <div style={{ marginTop: 8 }}>
                  <AppButton
                    variant="secondary"
                    bold
                    className="max-sm:w-full"
                    onClick={n.accion === "cotizar-hogar" ? onCotizarHogar : undefined}
                  >
                    <span className="min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">{n.cta}</span>
                  </AppButton>
                </div>
              )}
            </div>
            <button
              title="Descartar notificación"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== n.id))}
              className="flex items-center justify-center rounded-full shrink-0 transition-colors"
              style={{ cursor: "pointer", width: 26, height: 26, backgroundColor: "transparent", color: "var(--gray-7)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--gray-3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Banner de seguros ───────────────────────────────────────────────────────

function BannerSeguros({ onVerSeguros, polizas }: { onVerSeguros: () => void; polizas: PolizaComprada[] }) {
  const vigentes = polizas.filter((p) => p.estado !== "cancelada");

  if (vigentes.length === 0) {
    return (
      <section className="rounded-lg flex items-center gap-6 overflow-hidden p-5 md:px-7 md:py-6" style={{ backgroundColor: PURPLE }}>
        <div className="flex-1 flex flex-col gap-3">
          <h2 className="title-secondary" style={{ color: "#ffffff" }}>Vive tranquilo, vive asegurado.</h2>
          <p className="body-regular" style={{ color: "#ffffff", margin: 0, opacity: 0.92 }}>
            Asegura tus muebles, electrodomésticos y objetos de valor contra daños o robo desde solo{" "}
            <span style={{ fontWeight: 700 }}>$15.000/mes</span>.
          </p>
          <div>
            <button
              onClick={onVerSeguros}
              className="body-bold flex items-center gap-1.5 rounded-lg transition-colors"
              style={{ cursor: "pointer", height: 42, padding: "0 18px", backgroundColor: "#ffffff", color: PURPLE, border: "none", marginTop: 6 }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = PURPLE_LIGHT; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
            >
              Empezar ahora <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <img
          src={segurosBanner}
          alt="Familia con su mascota en el parque, protegida por su seguro"
          className="rounded-lg shrink-0 max-sm:hidden"
          style={{ width: 170, height: "auto", objectFit: "cover" }}
        />
      </section>
    );
  }

  const totalMensual = vigentes.reduce((sum, p) => sum + p.totalMensual, 0);
  const enTramite = vigentes.some((p) => p.estado === "cancelacion-solicitada");
  const principal = vigentes[0];

  return (
    <section
      className="rounded-lg overflow-hidden p-5 md:px-7 md:py-6"
      style={{ background: `linear-gradient(120deg, ${PURPLE} 0%, ${PURPLE_DARK} 100%)` }}
    >
      <div className="flex flex-col gap-4">
        {/* Encabezado */}
        <div className="flex items-center justify-between gap-2.5 flex-wrap">
          <h2 className="title-secondary" style={{ color: "#ffffff" }}>
            {vigentes.length === 1 ? "Ya estás protegido" : "Tu protección está activa"}
          </h2>
          <span
            className="tags inline-flex items-center gap-1.5 rounded-full px-3 py-1 shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.16)", color: "#ffffff" }}
          >
            <ShieldCheck size={13} strokeWidth={2} />
            {vigentes.length === 1 ? "1 póliza activa" : `${vigentes.length} pólizas activas`}
          </span>
        </div>

        {/* Tarjeta translúcida con el resumen de la póliza */}
        <div
          className="rounded-lg flex items-center gap-6 flex-wrap"
          style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", padding: "14px 18px" }}
        >
          <div className="flex flex-col min-w-0">
            <span className="disclamer" style={{ color: "rgba(255,255,255,0.75)" }}>
              {vigentes.length === 1 ? "Plan" : "Planes"}
            </span>
            <span className="body-bold truncate" style={{ color: "#ffffff" }}>
              {vigentes.length === 1 ? principal.planNombre : vigentes.map((p) => p.planNombre.replace("Alquilando ", "")).join(" · ")}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="disclamer" style={{ color: "rgba(255,255,255,0.75)" }}>
              {vigentes.length === 1 ? "Inmueble" : "Inmuebles"}
            </span>
            <span className="body-bold truncate" style={{ color: "#ffffff" }}>
              {vigentes.length === 1 ? principal.inmuebleDireccion : `${vigentes.length} inmuebles cubiertos`}
            </span>
          </div>
          <div className="flex flex-col shrink-0" style={{ marginLeft: "auto" }}>
            <span className="disclamer" style={{ color: "rgba(255,255,255,0.75)" }}>Pagas al mes</span>
            <span className="title-tertiary-bold" style={{ color: "#ffffff" }}>{formatCOPNumber(totalMensual)}</span>
          </div>
        </div>

        {enTramite && (
          <span className="body-small-regular" style={{ color: "#ffe9c2" }}>
            Una de tus pólizas tiene una cancelación en trámite: un asesor te contactará pronto.
          </span>
        )}

        {/* Acciones */}
        <div className="flex gap-3 flex-wrap max-sm:flex-col">
          <button
            onClick={onVerSeguros}
            className="body-bold flex items-center justify-center gap-1.5 rounded-lg transition-colors"
            style={{ cursor: "pointer", height: 42, padding: "0 18px", backgroundColor: "#ffffff", color: PURPLE, border: "none", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = PURPLE_LIGHT; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
          >
            Ver mis seguros <ChevronRight size={16} />
          </button>
          <button
            onClick={onVerSeguros}
            className="body-bold flex items-center justify-center gap-1.5 rounded-lg transition-colors"
            style={{ cursor: "pointer", height: 42, padding: "0 18px", backgroundColor: "transparent", color: "#ffffff", border: "1.5px solid rgba(255,255,255,0.55)", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            Contratar otro seguro
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Ayuda ───────────────────────────────────────────────────────────────────

const AYUDA_CARDS: { icon: LucideIcon; titulo: string; accion: string }[] = [
  { icon: MessageCircle, titulo: "Habla con nosotros en WhatsApp", accion: "Abrir WhatsApp" },
  { icon: Phone, titulo: "¿Prefieres hablar con alguien?", accion: "Llamar ahora" },
  { icon: MessageSquareText, titulo: "Preguntas frecuentes", accion: "Ver lista de FAQs" },
  { icon: AlertCircle, titulo: "¿Tienes alguna petición, queja o reclamo?", accion: "Crear una solicitud" },
];

function AyudaCards() {
  return (
    <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
      {AYUDA_CARDS.map(({ icon: Icon, titulo, accion }) => (
        <div
          key={titulo}
          className="rounded-lg flex flex-col items-center text-center gap-3"
          style={{ border: "1px solid var(--gray-4)", padding: "20px 16px" }}
        >
          <div className="flex items-center justify-center rounded-full" style={{ width: 44, height: 44, backgroundColor: PURPLE_LIGHT }}>
            <Icon size={20} strokeWidth={1.8} style={{ color: PURPLE }} />
          </div>
          <span className="body-small-bold" style={{ color: "var(--gray-10)" }}>{titulo}</span>
          <LinkText size="small">{accion}</LinkText>
        </div>
      ))}
    </div>
  );
}

function AyudaInicio() {
  return (
    <section className="rounded-lg flex flex-col gap-4" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}>
      <div>
        <h2 className="title-tertiary-bold" style={{ color: PURPLE }}>¿Necesitas ayuda? Estamos aquí para ti.</h2>
        <p className="body-regular" style={{ color: "var(--gray-9)", marginTop: 4 }}>Resolvemos tus dudas, ¡sin complicaciones!</p>
      </div>
      <AyudaCards />
    </section>
  );
}

const FAQS = [
  { id: "f1", title: "¿Cómo pago mi arriendo por PSE?", content: "Desde Inicio o Mis pagos, haz clic en “Ir a pagar”, elige tu banco y sigue los pasos de PSE. El comprobante llega a tu correo y queda en tu historial de pagos." },
  { id: "f2", title: "¿Qué pasa si pago después de la fecha límite?", content: "El valor a pagar aumenta según la fecha. En tu estado de cuenta siempre verás los tres valores vigentes con sus fechas para que elijas pagar a tiempo." },
  { id: "f3", title: "¿Cómo genero el código de barras para pagar en efectivo?", content: "En Estado de cuenta selecciona “Generar código de barras”, descárgalo y preséntalo en cualquier punto de pago autorizado." },
  { id: "f4", title: "¿Cómo creo una solicitud de reparación o novedad?", content: "Ve a Mis solicitudes y haz clic en “Crear solicitud”. Describe el problema, adjunta fotos si quieres y haz seguimiento desde el mismo lugar." },
  { id: "f5", title: "¿Dónde consulto mi contrato y sus fechas clave?", content: "En la sección Mi contrato encuentras el documento completo, la fecha de renovación y los documentos asociados a tu arriendo." },
];

function SeccionAyuda() {
  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-lg flex flex-col gap-4" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}>
        <h2 className="title-tertiary-bold" style={{ color: PURPLE }}>Canales de atención</h2>
        <AyudaCards />
      </section>

      <section className="rounded-lg flex flex-col gap-2" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}>
        <h2 className="title-tertiary-bold" style={{ color: PURPLE }}>Preguntas frecuentes</h2>
        <Accordion items={FAQS} />
      </section>
    </div>
  );
}

const FAQS_SEGUROS = [
  { id: "s1", title: "¿Cómo contrato un seguro?", content: "Elige el seguro que te interesa en “Nuestros seguros”, completa la cotización y confirma tu pago. La póliza queda activa de inmediato y la ves en “Mis seguros contratados”." },
  { id: "s2", title: "¿Cómo cancelo mi póliza?", content: "Entra a Mis seguros, selecciona la póliza y elige “Solicitar cancelación”. Un asesor te contactará para completar el proceso; la póliza sigue activa mientras tanto." },
  { id: "s3", title: "¿Qué cubre cada seguro?", content: "Cada tarjeta en “Nuestros seguros” lista las coberturas incluidas. También puedes ver el detalle completo desde “Ver detalle” en tu póliza activa." },
  { id: "s4", title: "¿Cómo reporto un siniestro?", content: "Contáctanos por WhatsApp o llamada desde esta sección y cuéntanos qué pasó. Te guiamos con Seguros Bolívar para iniciar el reclamo." },
  { id: "s5", title: "¿Cuándo se cobra mi seguro?", content: "El cobro se hace mensualmente en la fecha de “Próximo cobro” que ves en tu póliza, junto con tu canon de arriendo." },
];

function SeccionAyudaSeguros() {
  return (
    <section className="rounded-lg flex flex-col gap-5" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}>
      <div>
        <h2 className="title-tertiary-bold" style={{ color: PURPLE }}>¿Tienes dudas sobre tus seguros?</h2>
        <p className="body-regular" style={{ color: "var(--gray-9)", marginTop: 4 }}>Aquí resolvemos las preguntas más comunes o puedes contactarnos directamente.</p>
      </div>
      <Accordion items={FAQS_SEGUROS} />
      <AyudaCards />
    </section>
  );
}

// ─── Seguros ─────────────────────────────────────────────────────────────────

const SEGUROS: {
  icon: LucideIcon;
  nombre: string;
  descripcion: string;
  precio: string;
  beneficios: string[];
  cta: string;
}[] = [
  {
    icon: Sofa,
    nombre: "Seguro de Hogar",
    descripcion: "Protege tus muebles, electrodomésticos y objetos de valor contra daños o robo.",
    precio: "Desde $15.000/mes",
    beneficios: ["Cobertura contra robo y daños", "Asistencia de plomería y cerrajería", "Responsabilidad civil familiar"],
    cta: "Cotizar seguro de hogar",
  },
  {
    icon: CarFront,
    nombre: "SOAT",
    descripcion: "Compra o renueva tu SOAT en línea. Es fácil, rápido y llega directo a tu correo.",
    precio: "Tarifa oficial",
    beneficios: ["Emisión 100% en línea", "Llega a tu correo en minutos", "Evita multas y sanciones"],
    cta: "Comprar SOAT aquí",
  },
  {
    icon: PawPrint,
    nombre: "Seguro de Mascotas",
    descripcion: "Cubre gastos veterinarios, vacunas y daños a terceros. ¡Tu mejor amigo protegido!",
    precio: "Desde $18.000/mes",
    beneficios: ["Consultas y urgencias veterinarias", "Vacunas anuales incluidas", "Daños a terceros cubiertos"],
    cta: "Cotizar seguro de mascotas",
  },
];

const MOTIVOS_CANCELACION = [
  { value: "no-necesito", label: "Ya no necesito el seguro" },
  { value: "mejor-precio", label: "Encontré una mejor opción de precio" },
  { value: "mudanza", label: "Me mudé de inmueble" },
  { value: "servicio", label: "No quedé conforme con el servicio" },
  { value: "otro", label: "Otro motivo" },
];

const TEXTO_CONFIRMACION = "CANCELAR";

function CancelarPolizaPanel({
  poliza, onVolver, onConfirmar, onCerrar,
}: {
  poliza: PolizaComprada;
  onVolver: () => void;
  onConfirmar: (motivo: string) => void;
  onCerrar: () => void;
}) {
  const [motivo, setMotivo] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [enviado, setEnviado] = useState(false);
  const puedeConfirmar = !!motivo && confirmText.trim() === TEXTO_CONFIRMACION;

  if (enviado) {
    return (
      <div className="flex flex-col items-center text-center gap-4" style={{ padding: "16px 24px 24px" }}>
        <div className="flex items-center justify-center rounded-full" style={{ width: 56, height: 56, backgroundColor: "var(--navy-light)" }}>
          <PhoneCall size={26} strokeWidth={1.8} style={{ color: PURPLE }} />
        </div>
        <div>
          <h3 className="body-bold" style={{ color: PURPLE, fontSize: 17 }}>Solicitud de cancelación enviada</h3>
          <p className="body-small-regular" style={{ color: "var(--gray-10)", marginTop: 6, maxWidth: 400 }}>
            Un asesor te contactará en las próximas 24 horas hábiles para continuar con la cancelación de tu
            póliza <span style={{ fontWeight: 700 }}>{poliza.numeroPoliza}</span>. Tu cobertura sigue activa
            mientras tanto.
          </p>
        </div>
        <AppButton variant="primary" bold onClick={onCerrar}>Entendido</AppButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" style={{ padding: "16px 24px 24px" }}>
      <button
        onClick={onVolver}
        className="inline-flex items-center gap-2 body-small-bold w-fit"
        style={{ cursor: "pointer", color: "var(--gray-9)", background: "transparent" }}
      >
        <ArrowLeft size={14} /> Volver al detalle
      </button>

      <Callout variant="warning" title="Un asesor debe confirmar tu cancelación">
        La cancelación de <span style={{ fontWeight: 700 }}>{poliza.planNombre}</span> sobre{" "}
        <span style={{ fontWeight: 700 }}>{poliza.inmuebleDireccion}</span> no es inmediata: un asesor te
        contactará para validar tu solicitud y explicarte las condiciones antes de completarla. Tu cobertura
        sigue activa hasta ese momento.
      </Callout>

      <label className="flex flex-col gap-1.5">
        <span className="body-small-bold" style={{ color: "var(--gray-10)" }}>
          ¿Por qué cancelas? <span style={{ color: "var(--destructive)" }}>*</span>
        </span>
        <SelectInput options={MOTIVOS_CANCELACION} value={motivo} onChange={setMotivo} className="w-full" />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="body-small-bold" style={{ color: "var(--gray-10)" }}>
          Escribe <span style={{ fontFamily: "monospace" }}>{TEXTO_CONFIRMACION}</span> para confirmar la solicitud
        </span>
        <TextInput placeholder={TEXTO_CONFIRMACION} value={confirmText} onChange={setConfirmText} className="w-full" />
      </label>

      <div className="flex items-center justify-end gap-3">
        <AppButton variant="secondary" bold onClick={onVolver}>No, mantener mi póliza</AppButton>
        <AppButton
          variant="danger"
          bold
          disabled={!puedeConfirmar}
          onClick={() => { onConfirmar(motivo); setEnviado(true); }}
        >
          Solicitar cancelación
        </AppButton>
      </div>
    </div>
  );
}

function PolizaDetalleModal({
  poliza, onClose, onCancelar,
}: {
  poliza: PolizaComprada | null;
  onClose: () => void;
  onCancelar: (id: string, motivo: string) => void;
}) {
  const [cancelando, setCancelando] = useState(false);

  const cerrar = () => { setCancelando(false); onClose(); };

  if (poliza && cancelando) {
    return (
      <Modal open onClose={cerrar} title="Cancelar póliza" width={560}>
        <CancelarPolizaPanel
          poliza={poliza}
          onVolver={() => setCancelando(false)}
          onConfirmar={(motivo) => onCancelar(poliza.id, motivo)}
          onCerrar={cerrar}
        />
      </Modal>
    );
  }

  return (
    <Modal open={!!poliza} onClose={cerrar} title="Detalle de tu póliza" width={560}>
      {poliza && (
        <div className="flex flex-col gap-4" style={{ padding: "16px 24px 24px" }}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Número de póliza</span>
              <span className="body-bold" style={{ color: PURPLE }}>{poliza.numeroPoliza}</span>
            </div>
            {poliza.estado === "activa" && <StatusBadge label="Activa" variant="active" />}
            {poliza.estado === "cancelacion-solicitada" && <StatusBadge label="Cancelación en trámite" variant="pending" />}
            {poliza.estado === "cancelada" && <StatusBadge label="Cancelada" variant="rejected" />}
          </div>

          {poliza.estado === "cancelacion-solicitada" && (
            <Callout variant="info" title="Tu solicitud de cancelación está en trámite">
              La enviaste el {poliza.fechaSolicitudCancelacion}. Un asesor te contactará para completarla.
              Motivo indicado: {MOTIVOS_CANCELACION.find((m) => m.value === poliza.motivoCancelacion)?.label ?? "No especificado"}.
              Tu cobertura sigue activa mientras tanto.
            </Callout>
          )}

          {poliza.estado === "cancelada" && (
            <Callout variant="error" title="Esta póliza está cancelada">
              Motivo: {MOTIVOS_CANCELACION.find((m) => m.value === poliza.motivoCancelacion)?.label ?? "No especificado"}.
            </Callout>
          )}

          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <div className="flex flex-col gap-1">
              <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Inmueble asegurado</span>
              <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{poliza.inmuebleDireccion}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Plan</span>
              <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{poliza.planNombre}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Fecha de pago</span>
              <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{poliza.fechaPago}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Próximo cobro</span>
              <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{poliza.proximoCobro}</span>
            </div>
          </div>

          <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

          <div className="flex flex-col gap-2">
            <span className="body-bold" style={{ color: PURPLE }}>Coberturas del plan</span>
            {poliza.planCoberturas.map((c) => (
              <div key={c.titulo} className="flex items-start gap-2">
                <CircleCheck size={15} strokeWidth={1.8} style={{ color: "var(--green-status)", flexShrink: 0, marginTop: 2 }} />
                <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>
                  <span style={{ fontWeight: 700 }}>{c.titulo}: </span>{c.descripcion}
                </span>
              </div>
            ))}
          </div>

          <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

          <div className="flex flex-col gap-2">
            <span className="body-bold" style={{ color: PURPLE }}>{poliza.asistenciaNombre}</span>
            <p className="body-small-regular" style={{ color: "var(--gray-10)", margin: 0 }}>
              <span style={{ fontWeight: 700 }}>Incluye: </span>
              {poliza.asistenciaCategorias.map((c) => c.titulo).join(", ")}.
            </p>
          </div>

          <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

          <div className="flex flex-col gap-2">
            <span className="body-bold" style={{ color: PURPLE }}>Coberturas adicionales</span>
            {poliza.adicionales.length > 0 ? (
              poliza.adicionales.map((a) => (
                <div key={a.label} className="flex items-center justify-between gap-4">
                  <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{a.label}</span>
                  <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{formatCOPNumber(a.precio)}</span>
                </div>
              ))
            ) : (
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>No agregaste coberturas adicionales.</span>
            )}
          </div>

          <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

          <div className="flex items-center justify-between gap-4">
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>Total mensual:</span>
            <span className="title-tertiary-bold" style={{ color: PURPLE }}>{formatCOPNumber(poliza.totalMensual)}</span>
          </div>

          {poliza.estado === "activa" && (
            <>
              <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />
              <button
                onClick={() => setCancelando(true)}
                className="inline-flex items-center gap-2 body-small-bold w-fit"
                style={{ cursor: "pointer", color: "var(--destructive)", background: "transparent" }}
              >
                <ShieldOff size={14} /> Cancelar esta póliza
              </button>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

function MisPolizas({ polizas, onCancelar }: { polizas: PolizaComprada[]; onCancelar: (id: string, motivo: string) => void }) {
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const seleccionada = polizas.find((p) => p.id === seleccionadaId) ?? null;
  const activas = polizas.filter((p) => p.estado === "activa").length;
  const enTramite = polizas.filter((p) => p.estado === "cancelacion-solicitada").length;
  const canceladas = polizas.filter((p) => p.estado === "cancelada").length;

  if (polizas.length === 0) return null;

  return (
    <section className="rounded-lg flex flex-col gap-4" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="title-tertiary-bold" style={{ color: PURPLE }}>Mis seguros contratados</h2>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
            {activas === 1 ? "Tienes 1 póliza activa" : `Tienes ${activas} pólizas activas`}
            {enTramite > 0 && ` · ${enTramite} en trámite de cancelación`}
            {canceladas > 0 && ` · ${canceladas} cancelada${canceladas > 1 ? "s" : ""}`}.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {polizas.map((p) => {
          const activa = p.estado === "activa";
          const tramite = p.estado === "cancelacion-solicitada";
          const cancelada = p.estado === "cancelada";
          return (
            <div
              key={p.id}
              className="rounded-lg flex items-center justify-between gap-4 flex-wrap"
              style={{ border: "1px solid var(--gray-4)", padding: "16px 18px", opacity: cancelada ? 0.7 : 1 }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 40, height: 40, backgroundColor: cancelada ? "var(--gray-2)" : PURPLE_LIGHT }}
                >
                  {cancelada && <ShieldOff size={19} strokeWidth={1.7} style={{ color: "var(--gray-7)" }} />}
                  {tramite && <PhoneCall size={19} strokeWidth={1.7} style={{ color: PURPLE }} />}
                  {activa && <ShieldCheck size={19} strokeWidth={1.7} style={{ color: PURPLE }} />}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>{p.planNombre}</span>
                    {activa && <StatusBadge label="Activa" variant="active" />}
                    {tramite && <StatusBadge label="Cancelación en trámite" variant="pending" />}
                    {cancelada && <StatusBadge label="Cancelada" variant="rejected" />}
                  </div>
                  <span className="body-small-regular truncate" style={{ color: "var(--gray-9)" }}>
                    {p.inmuebleDireccion} · Póliza {p.numeroPoliza}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-5 shrink-0 max-sm:w-full max-sm:justify-between">
                <img
                  src={logoSegurosBolivar}
                  alt="Seguros Bolívar"
                  className="shrink-0"
                  style={{ height: 34, width: "auto", opacity: cancelada ? 0.5 : 1 }}
                />
                <div className="flex flex-col items-end">
                  <span className="body-bold" style={{ color: cancelada ? "var(--gray-8)" : PURPLE }}>{formatCOPNumber(p.totalMensual)}/mes</span>
                  <span className="disclamer" style={{ color: "var(--gray-8)" }}>
                    {cancelada ? `Solicitada el ${p.fechaSolicitudCancelacion}` : `Próximo cobro: ${p.proximoCobro}`}
                  </span>
                </div>
                <LinkText size="small" icon="chevron" onClick={() => setSeleccionadaId(p.id)}>Ver detalle</LinkText>
              </div>
            </div>
          );
        })}
      </div>

      <PolizaDetalleModal poliza={seleccionada} onClose={() => setSeleccionadaId(null)} onCancelar={onCancelar} />
    </section>
  );
}

function SeccionSeguros({
  onCotizarHogar, polizas, onCancelarPoliza,
}: {
  onCotizarHogar: () => void;
  polizas: PolizaComprada[];
  onCancelarPoliza: (id: string, motivo: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-lg flex items-center gap-8 p-5 md:px-8 md:py-7" style={{ backgroundColor: PURPLE }}>
        <div className="flex-1">
          <h2 className="title-secondary" style={{ color: "#ffffff" }}>Vive tranquilo, vive asegurado.</h2>
          <p className="body-regular" style={{ color: "#ffffff", marginTop: 6, opacity: 0.92, maxWidth: 640 }}>
            Seguros en alianza con las principales aseguradoras del país. Contrata en línea, sin papeleo,
            y gestiona todo desde tu portal de Alquilando.
          </p>
        </div>
        <img
          src={segurosBanner}
          alt="Familia con su mascota en el parque, protegida por su seguro"
          className="rounded-lg shrink-0 max-md:hidden"
          style={{ width: 150, height: "auto", objectFit: "cover" }}
        />
      </section>

      <MisPolizas polizas={polizas} onCancelar={onCancelarPoliza} />

      <div>
        <h2 className="title-tertiary-bold" style={{ color: PURPLE }}>
          {polizas.length > 0 ? "Contrata otro seguro" : "Nuestros seguros"}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
        {SEGUROS.map(({ icon: Icon, nombre, descripcion, precio, beneficios, cta }) => (
          <section
            key={nombre}
            className="rounded-lg flex flex-col gap-4"
            style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "24px" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, backgroundColor: PURPLE_LIGHT }}>
                <Icon size={23} strokeWidth={1.7} style={{ color: PURPLE }} />
              </div>
              <img src={logoSegurosBolivar} alt="Seguros Bolívar" style={{ height: 26, width: "auto" }} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="title-tertiary-bold" style={{ color: "var(--gray-10)" }}>{nombre}</h3>
              <span className="body-small-bold" style={{ color: PURPLE }}>{precio}</span>
            </div>
            <p className="body-small-regular" style={{ color: "var(--gray-9)", margin: 0 }}>{descripcion}</p>
            <ul className="flex flex-col gap-2 flex-1" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {beneficios.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CircleCheck size={16} strokeWidth={1.8} style={{ color: "var(--green-status)", flexShrink: 0, marginTop: 2 }} />
                  <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{b}</span>
                </li>
              ))}
            </ul>
            <AppButton
              variant="primary"
              bold
              fullWidth
              onClick={nombre === "Seguro de Hogar" ? onCotizarHogar : undefined}
            >
              {cta}
            </AppButton>
          </section>
        ))}
      </div>

      <SeccionAyudaSeguros />
    </div>
  );
}

// ─── Portal ──────────────────────────────────────────────────────────────────

interface Props {
  onLogout: () => void;
}

export function PortalInquilino({ onLogout }: Props) {
  const [active, setActiveRaw] = useState("inicio");
  const [inmueble, setInmueble] = useState("carrera-23");
  const [cotizandoHogar, setCotizandoHogar] = useState(false);
  const [polizas, setPolizas] = useState<PolizaComprada[]>([]);
  // Notificaciones viven aquí: en mobile se abren desde la campana del header.
  const [notifItems, setNotifItems] = useState(NOTIFICACIONES_INICIALES);
  const [notifOpen, setNotifOpen] = useState(false);
  const seccion = TITULOS[active];

  /** No cancela de inmediato: un asesor debe contactar y completar la cancelación. */
  const solicitarCancelacion = (id: string, motivo: string) => {
    setPolizas((prev) => prev.map((p) => (
      p.id === id
        ? { ...p, estado: "cancelacion-solicitada" as const, motivoCancelacion: motivo, fechaSolicitudCancelacion: formatFechaCorta(new Date()) }
        : p
    )));
  };

  const setActive = (id: string) => { setActiveRaw(id); setCotizandoHogar(false); };

  const enConstruccion = !["inicio", "seguros", "ayuda"].includes(active);

  return (
    <div
      className="flex h-screen"
      style={{ ...THEME, backgroundColor: "var(--gray-1)", fontFamily: "Roboto, sans-serif" }}
    >
      {/* Sidebar */}
      <aside
        className="hidden md:flex h-screen flex-col shrink-0"
        style={{ width: 240, backgroundColor: "#ffffff", borderRight: "1px solid var(--gray-4)" }}
      >
        <div className="flex items-center px-4" style={{ height: 60, backgroundColor: PURPLE }}>
          <AlquilandoLogo height={26} />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          <span className="disclamer px-2 pb-2" style={{ color: "var(--gray-8)", letterSpacing: 1 }}>MENÚ</span>
          {NAV.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className="flex items-center gap-3 rounded-lg px-3 transition-colors w-full"
                style={{
                  cursor: "pointer",
                  height: 40,
                  backgroundColor: isActive ? PURPLE_LIGHT : "transparent",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--gray-1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isActive ? PURPLE_LIGHT : "transparent"; }}
              >
                <Icon size={18} strokeWidth={1.6} style={{ color: isActive ? PURPLE : "var(--gray-9)", flexShrink: 0 }} />
                <span className={isActive ? "body-bold" : "body-regular"} style={{ color: isActive ? PURPLE : "var(--gray-10)" }}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 flex flex-col gap-3" style={{ borderTop: "1px solid var(--gray-4)" }}>
          <span className="body-bold px-1" style={{ color: "var(--gray-10)" }}>Nelson Diaz</span>
          <AppButton variant="secondary" fullWidth bold>
            Administrar mi perfil
          </AppButton>
          <LinkText size="small" onClick={onLogout} className="w-full justify-center">
            Cerrar sesión
          </LinkText>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4"
        style={{ height: 56, backgroundColor: PURPLE }}
      >
        <AlquilandoLogo height={24} />
        <div className="flex items-center gap-0.5">
          <button
            title="Notificaciones"
            onClick={() => setNotifOpen(true)}
            className="relative flex items-center justify-center rounded-lg"
            style={{ cursor: "pointer", width: 40, height: 40, backgroundColor: "transparent", color: "#ffffff" }}
          >
            <Bell size={19} strokeWidth={1.6} />
            {notifItems.length > 0 && (
              <span
                className="absolute flex items-center justify-center rounded-full"
                style={{
                  top: 5,
                  right: 4,
                  minWidth: 16,
                  height: 16,
                  padding: "0 4px",
                  backgroundColor: "var(--alquilando)",
                  color: PURPLE_DARK,
                  fontSize: 10,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {notifItems.length}
              </span>
            )}
          </button>
          <button
            title="Cerrar sesión"
            onClick={onLogout}
            className="flex items-center justify-center rounded-lg"
            style={{ cursor: "pointer", width: 40, height: 40, backgroundColor: "transparent", color: "#ffffff" }}
          >
            <LogOut size={18} strokeWidth={1.6} />
          </button>
        </div>
      </header>

      {/* Panel de notificaciones mobile: hoja a pantalla completa desde el header */}
      {notifOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "var(--gray-1)" }}>
          <header
            className="flex items-center gap-2 px-2 shrink-0"
            style={{ height: 56, backgroundColor: PURPLE }}
          >
            <button
              title="Volver"
              onClick={() => setNotifOpen(false)}
              className="flex items-center justify-center rounded-lg"
              style={{ cursor: "pointer", width: 40, height: 40, backgroundColor: "transparent", color: "#ffffff" }}
            >
              <ArrowLeft size={19} strokeWidth={1.8} />
            </button>
            <span className="body-bold" style={{ color: "#ffffff" }}>Notificaciones</span>
          </header>
          <div className="flex-1 overflow-y-auto" style={{ padding: 16 }}>
            <Notificaciones
              onCotizarHogar={() => { setNotifOpen(false); setActiveRaw("seguros"); setCotizandoHogar(true); }}
              items={notifItems}
              setItems={setNotifItems}
              hideTitle
            />
          </div>
        </div>
      )}

      {/* Mobile bottom nav — estilo app */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
        style={{
          backgroundColor: "#ffffff",
          borderTop: "1px solid var(--gray-4)",
          paddingBottom: "env(safe-area-inset-bottom)",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 min-w-0"
              style={{ cursor: "pointer", height: 62, backgroundColor: "transparent", color: isActive ? PURPLE : "var(--gray-8)" }}
            >
              <span
                className="flex items-center justify-center rounded-full transition-colors"
                style={{ width: 44, height: 26, backgroundColor: isActive ? PURPLE_LIGHT : "transparent" }}
              >
                <Icon size={20} strokeWidth={isActive ? 2 : 1.6} />
              </span>
              <span className="truncate w-full text-center" style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, padding: "0 2px" }}>
                {label.replace(/^Mis? /, "")}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <div className="px-4 md:px-8 pt-6 pb-24 md:pb-6 max-w-[1400px] mx-auto flex flex-col gap-5">
          {!(active === "seguros" && cotizandoHogar) && (
          <section
            className={`rounded-lg flex items-center justify-between gap-4 md:gap-6 flex-wrap p-5 md:px-7 md:py-6 ${active === "inicio" ? "max-md:hidden" : ""}`}
            style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)" }}
          >
            <div>
              <h1 className="title-primary-bold" style={{ color: PURPLE }}>{seccion.title}</h1>
              <p className="body-regular" style={{ color: "var(--gray-9)", marginTop: 4 }}>
                {seccion.description}
              </p>
            </div>
            {active === "inicio" && (
              <label className="flex flex-col gap-1.5 w-full sm:w-auto" style={{ minWidth: "min(260px, 100%)" }}>
                <span className="body-small-bold" style={{ color: PURPLE }}>Inmueble seleccionado</span>
                <SelectInput options={INMUEBLES} value={inmueble} onChange={setInmueble} />
              </label>
            )}
          </section>
          )}

          {active === "inicio" && (
            <>
              {/* Desktop/tablet: layout original en dos columnas */}
              <div className="max-md:hidden grid grid-cols-2 gap-5 max-lg:grid-cols-1 items-start">
                <EstadoCuenta />
                <div className="flex flex-col gap-5">
                  <Notificaciones
                    onCotizarHogar={() => { setActiveRaw("seguros"); setCotizandoHogar(true); }}
                    items={notifItems}
                    setItems={setNotifItems}
                  />
                  <BannerSeguros onVerSeguros={() => setActive("seguros")} polizas={polizas} />
                  <AyudaInicio />
                </div>
              </div>
              {/* Mobile: experiencia tipo app */}
              <div className="md:hidden">
                <InicioMobile
                  inmueble={inmueble}
                  onInmueble={setInmueble}
                  polizas={polizas}
                  onVerSeguros={() => setActive("seguros")}
                  goTo={setActive}
                />
              </div>
            </>
          )}

          {active === "seguros" && (
            cotizandoHogar
              ? (
                <CotizadorHogar
                  onBack={() => setCotizandoHogar(false)}
                  onFinalizar={() => { setCotizandoHogar(false); setActiveRaw("inicio"); }}
                  onComprar={(poliza) => setPolizas((prev) => [...prev, poliza])}
                />
              )
              : <SeccionSeguros onCotizarHogar={() => setCotizandoHogar(true)} polizas={polizas} onCancelarPoliza={solicitarCancelacion} />
          )}
          {active === "ayuda" && <SeccionAyuda />}

          {enConstruccion && (
            <section
              className="rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", minHeight: 420 }}
            >
              <EmptyState
                icon={Construction}
                title="Sección en construcción"
                description="Estamos preparando esta sección de tu portal. Muy pronto podrás usarla."
              />
            </section>
          )}

          <Footer />
        </div>
      </main>
    </div>
  );
}
