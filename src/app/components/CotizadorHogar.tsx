import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, CircleCheck, Tv, Sofa, ShieldCheck, Home, Plus, ChevronUp, ChevronDown,
  Flame, Lock, Wrench, Hammer, PackageCheck, Award,
  Receipt, Mail, CalendarClock, CreditCard, Download, FileText, Info, SlidersHorizontal, Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Stepper } from "./kit/Stepper";
import { Modal } from "./kit/Modal";
import { SelectInput } from "./kit/SelectInput";
import { TextInput } from "./kit/TextInput";
import { StatusBadge } from "./kit/StatusBadge";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { ToggleSwitch } from "./kit/ToggleSwitch";
import { Callout } from "./kit/Callout";
import { Accordion } from "./kit/Accordion";
import { Field } from "./kit/Field";
import logoSegurosBolivar from "../../assets/logo-seguros-bolivar.png";

/**
 * Cotizador del seguro de hogar del portal del inquilino.
 * Usa solo tokens (--navy, --navy-light…): dentro del portal renderiza púrpura,
 * sin tocar los colores del panel de inmobiliaria.
 */
const PASOS = [
  { id: "configura", label: "Selecciona tu inmueble" },
  { id: "arma", label: "Arma tu plan" },
  { id: "confirma", label: "Confirma tu seguro" },
  { id: "pagar", label: "Compra tu seguro" },
];

/**
 * Mobile parte "Selecciona tu inmueble" en 2 pantallas (inmueble / objetos) y "Arma tu plan" en otras 2
 * (plan / asistencia), para que cada pantalla pida solo lo necesario para avanzar.
 */
const MPASOS = [
  { id: "inmueble", label: "Selecciona tu inmueble" },
  { id: "objetos", label: "Asegura tus pertenencias" },
  { id: "plan", label: "Arma tu plan" },
  { id: "asistencia", label: "Elige tu asistencia" },
  { id: "confirma", label: "Confirma tu seguro" },
  { id: "pagar", label: "Compra tu seguro" },
];

interface InmuebleCotizacion {
  estrato: string; canon: string; ciudad: string; direccion: string; coordenadas: string;
  /** Si es false, ya tenemos todos los datos del inmueble: no hace falta pedirle nada más al usuario. */
  datosCompletos: boolean;
  lat: number; lng: number;
  /** true cuando el inmueble se creó desde el formulario del seguro (no viene del contrato de Alquilando). */
  externo?: boolean;
  tipoDocumento?: string;
  numeroDocumento?: string;
  metrosCuadrados?: number;
  tipoInmueble?: string;
  anoConstruccion?: string;
  zona?: string;
  /** true cuando el inmueble ya tiene una póliza de hogar activa: no se puede comprar otra para el mismo inmueble. */
  polizaActiva?: boolean;
}

const INMUEBLES_COTIZACION: Record<string, InmuebleCotizacion> = {
  "carrera-23": { estrato: "3", canon: "$1.400.000", ciudad: "Bogotá", direccion: "Carrera 23 # 45 - 34 sur", coordenadas: "4,593874 - -74,129384", datosCompletos: false, lat: 4.593874, lng: -74.129384 },
  "calle-80": { estrato: "4", canon: "$2.150.000", ciudad: "Bogotá", direccion: "Calle 80 # 12 - 08, apto 502", coordenadas: "4,668350 - -74,056420", datosCompletos: true, lat: 4.668350, lng: -74.056420, polizaActiva: true },
};

const INMUEBLE_OPTIONS = [
  { value: "carrera-23", label: "Carrera 23 # 45 - 34 sur" },
  { value: "calle-80", label: "Calle 80 # 12 - 08, apto 502" },
];

const ZONA_OPTIONS = [
  { value: "urbano", label: "Urbano" },
  { value: "rural", label: "Rural" },
];

const RELACION_INMUEBLE_OPTIONS = [
  { value: "propietario-vive", label: "Soy propietario y vivo en ella" },
  { value: "propietario-no-vive", label: "Soy propietario y no vivo en la vivienda" },
  { value: "arrendatario", label: "Soy arrendatario" },
  { value: "solo-contenidos", label: "Solo quiero asegurar contenidos" },
];

const TIPOS_DOCUMENTO = [
  { value: "cc", label: "Cédula de ciudadanía" },
  { value: "ce", label: "Cédula de extranjería" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "nit", label: "NIT" },
];

const CIUDADES_OPTIONS = [
  { value: "bogota", label: "Bogotá" },
  { value: "medellin", label: "Medellín" },
  { value: "cali", label: "Cali" },
  { value: "barranquilla", label: "Barranquilla" },
  { value: "cartagena", label: "Cartagena" },
  { value: "bucaramanga", label: "Bucaramanga" },
];

const TIPO_INMUEBLE_OPTIONS = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "oficina", label: "Oficina" },
  { value: "local", label: "Local comercial" },
];

/** Requerido por la API de la aseguradora para tasar el riesgo, aunque Alquilando no lo tenga guardado. */
const ANOS_CONSTRUCCION_OPTIONS = [
  { value: "0-5", label: "Menos de 5 años" },
  { value: "5-10", label: "5 a 10 años" },
  { value: "10-15", label: "10 a 15 años" },
  { value: "15-20", label: "15 a 20 años" },
  { value: "20-25", label: "20 a 25 años" },
  { value: "25-30", label: "25 a 30 años" },
  { value: "30-40", label: "30 a 40 años" },
  { value: "40+", label: "Más de 40 años" },
];

const ELECTRONICOS_BASE = ["Televisores", "Computadores", "Neveras", "Objetos inteligentes", "Estufas", "Equipos de sonido"];
const ELECTRONICOS_EXTRA = ["Consolas de videojuegos", "Tablets", "Cámaras fotográficas", "Lavadoras y secadoras"];
const ENSERES_BASE = ["Muebles", "Camas", "Libros", "Armarios", "Ropa", "Cortinas"];
const ENSERES_EXTRA = ["Vajillas y utensilios de cocina", "Tapetes y decoración", "Colchones", "Bicicletas"];

// ─── Planes ──────────────────────────────────────────────────────────────────

export interface Cobertura {
  titulo: string;
  descripcion: string;
}

const COBERTURAS_BASICO: Cobertura[] = [
  { titulo: "Daños por incendio o daños por agua internos", descripcion: "Cubre daños que se originen por incendios, explosiones y agua al interior del inmueble (Ej. tubos rotos)." },
  { titulo: "Daños por agua origen exterior", descripcion: "Cubre daños causados a la vivienda por lluvias, huracanes, vientos fuertes o granizadas." },
  { titulo: "Robo con violencia", descripcion: "Cubre la pérdida de objetos asegurados o daños a la vivienda ocasionados por robos violentos dentro del hogar." },
  { titulo: "Daños eléctricos y errores de montaje", descripcion: "Tus contenidos eléctricos están protegidos frente a caídas de energía, cortos circuitos, malas conexiones o bajonazos de luz." },
  { titulo: "Daños y pérdidas por disturbios sociales", descripcion: "Protegemos tu hogar ante alteraciones del orden público, huelgas o disturbios." },
  { titulo: "Daños accidentales a la estructura", descripcion: "Cubre accidentes que dañen tu hogar como caída de aviones, choque de autos o caída de árboles." },
];

const COBERTURAS_CLASICO: Cobertura[] = [
  ...COBERTURAS_BASICO,
  { titulo: "Daños por desastres naturales", descripcion: "Cubre daños ocasionados por maremotos, tsunamis, erupción de volcanes, temblores y/o terremotos." },
  { titulo: "Amparo por invalidez o fallecimiento", descripcion: "Tú y tus beneficiarios estarán protegidos si tienen algún tipo de lesión o enfermedad que les cause invalidez o la muerte, al igual que la empleada doméstica estará protegida ante accidentes dentro del hogar." },
  { titulo: "Seguridad digital básica", descripcion: "Protege tus cuentas y dispositivos con monitoreo básico ante fraudes digitales y suplantación de identidad." },
  { titulo: "Daños a terceros", descripcion: "Cubre los gastos de los daños que causes a otros: si se rompe tu tubería y mojas el piso de abajo, o si tu mascota hace una travesura." },
];

const COBERTURAS_PREMIUM: Cobertura[] = [
  ...COBERTURAS_CLASICO,
  { titulo: "Robo sin violencia", descripcion: "Cubre daños a la vivienda y pérdida de objetos asegurados por robos dentro de tu hogar." },
  { titulo: "Cobertura extendida por robo", descripcion: "Cubre la pérdida de objetos electrónicos asegurados, fuera de la vivienda causados por robos violentos." },
  { titulo: "Seguridad digital full", descripcion: "Monitoreo avanzado 24/7, alertas en tiempo real y soporte prioritario ante cualquier incidente de ciberseguridad." },
  { titulo: "Bici protección", descripcion: "Protege tu bicicleta ante robo y daños accidentales, dentro y fuera de tu hogar." },
  { titulo: "Gastos médicos mascotas", descripcion: "Cubre los gastos veterinarios de tu mascota por accidentes o urgencias dentro del hogar." },
];

interface Plan {
  id: string;
  nombre: string;
  precio: number;
  tag: string;
  /** Plan que el cotizador recomienda según los datos del inmueble: es el único que lleva el chip "Sugerido". */
  sugerido?: boolean;
  coberturas: Cobertura[];
}

const PLANES: Plan[] = [
  { id: "basico", nombre: "Plan Básico", precio: 822943, tag: "+ Plan S de asistencias incluido", coberturas: COBERTURAS_BASICO },
  { id: "clasico", nombre: "Plan Clásico", precio: 1217296, tag: "+ Plan S de asistencias incluido", coberturas: COBERTURAS_CLASICO },
  { id: "premium", nombre: "Plan Premium", precio: 2974670, tag: "+ Plan S de asistencias incluido", sugerido: true, coberturas: COBERTURAS_PREMIUM },
];

const PLAN_ICONS: Record<string, LucideIcon> = { basico: Home, clasico: ShieldCheck, premium: Award };

/** Orden del carrusel mobile: premium primero, basic al final (desktop conserva el orden de PLANES). */
const PLANES_CARRUSEL: Plan[] = [...PLANES].reverse();

interface CoberturaAdicional {
  id: string;
  icon: LucideIcon;
  titulo: string;
  descripcion: string;
  precio: number;
  sidebarLabel: string;
  defaultOn: boolean;
}

const COBERTURAS_ADICIONALES: CoberturaAdicional[] = [
  {
    id: "desastres-naturales",
    icon: Flame,
    titulo: "Daños por desastres naturales",
    descripcion: "Cubre daños ocasionados por maremotos, tsunamis, erupción de volcanes, temblores y/o terremotos.",
    precio: 288852,
    sidebarLabel: "Daños por desastres naturales",
    defaultOn: false,
  },
  {
    id: "robo-sin-violencia",
    icon: Lock,
    titulo: "Robo sin violencia",
    descripcion: "Cubre daños a la vivienda y pérdida de objetos asegurados por robos dentro de tu hogar.",
    precio: 494508,
    sidebarLabel: "Robo sin violencia",
    defaultOn: false,
  },
  {
    id: "robo-extendida",
    icon: ShieldCheck,
    titulo: "Cobertura extendida por robo",
    descripcion: "Cubre la pérdida de objetos electrónicos asegurados, fuera de la vivienda causados por robos violentos.",
    precio: 330465,
    sidebarLabel: "Cobertura extendida por robo",
    defaultOn: false,
  },
];

export interface CategoriaAsistencia {
  titulo: string;
  items: string[];
}

const ASISTENCIA_S: CategoriaAsistencia[] = [
  { titulo: "Plomería", items: ["Llaves sanitarias y accesorios", "Conexiones de agua y redes sanitarias", "Redes de agua potable, aguas negras o residuales"] },
  { titulo: "Electricidad", items: ["Tomas eléctricas y salidas de iluminación", "Tacos o breakers"] },
  { titulo: "Cerrajería", items: ["Pérdida de llaves y apertura de puertas exteriores"] },
];

const ASISTENCIA_M: CategoriaAsistencia[] = [
  ...ASISTENCIA_S,
  { titulo: "Reparación de vidrios", items: ["Que los balonazos no te tomen por sorpresa, te ayudamos a reparar esos vidrios rotos."] },
];

const ASISTENCIA_L: CategoriaAsistencia[] = [
  ...ASISTENCIA_M,
  { titulo: "Asesoría jurídica y legal", items: ["¿Tus vecinos hacen mucho ruido? Con nuestra asesoría legal la tranquilidad volverá a tu hogar."] },
];

interface Asistencia {
  id: string;
  icon: LucideIcon;
  nombre: string;
  precio: number;
  descripcion: string;
  categorias: CategoriaAsistencia[];
}

const ASISTENCIAS: Asistencia[] = [
  { id: "s", icon: Wrench, nombre: "Asistencias S", precio: 0, descripcion: "Servicios esenciales ya activos", categorias: ASISTENCIA_S },
  { id: "m", icon: Hammer, nombre: "Asistencias M", precio: 57488, descripcion: "Suma servicios adicionales a tu plan", categorias: ASISTENCIA_M },
  { id: "l", icon: PackageCheck, nombre: "Asistencias L", precio: 93860, descripcion: "Incluye asistencias S y M", categorias: ASISTENCIA_L },
];

/** Formatea un número entero (sin dígitos previos) como moneda COP. */
export function formatCOPNumber(n: number) {
  return "$" + n.toLocaleString("es-CO");
}

/** Fecha corta en español, ej. "09 Jul. 2026". */
export function formatFechaCorta(date: Date) {
  const partes = new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).formatToParts(date);
  const dia = partes.find((p) => p.type === "day")?.value ?? "";
  const mes = partes.find((p) => p.type === "month")?.value ?? "";
  const anio = partes.find((p) => p.type === "year")?.value ?? "";
  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1).replace(".", "") + ".";
  return `${dia} ${mesCapitalizado} ${anio}`;
}

/** Formatea dígitos como moneda COP con puntos de miles. */
function formatCOP(digits: string) {
  if (!digits) return "";
  return "$ " + Number(digits).toLocaleString("es-CO");
}

function parseDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 12);
}

/** Base Bogotá para inmuebles nuevos sin geolocalización real todavía. */
const COORD_BASE = { lat: 4.60971, lng: -74.08175 };

/**
 * Deriva unas coordenadas estables a partir del texto de dirección + ciudad (sin mapa ni API real):
 * dos direcciones distintas caen en puntos distintos pero reproducibles alrededor del centro de Bogotá.
 */
function coordenadasDesdeDireccion(direccion: string, ciudad: string) {
  const texto = `${direccion.trim()} ${ciudad.trim()}`;
  if (!texto.trim()) return COORD_BASE;
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash * 31 + texto.charCodeAt(i)) | 0;
  }
  const jitterLat = ((hash % 1000) / 1000) * 0.06 - 0.03;
  const jitterLng = (((hash >> 10) % 1000) / 1000) * 0.06 - 0.03;
  return { lat: COORD_BASE.lat + jitterLat, lng: COORD_BASE.lng + jitterLng };
}

// ─── Categoría asegurable ────────────────────────────────────────────────────

/** Fallback si aún no conocemos el valor de la vivienda (no debería pasar: el paso 1 ya lo exige). */
const MONTOS_RAPIDOS_FALLBACK = ["5000000", "10000000", "20000000"];

interface CategoriaProps {
  icon: typeof Tv;
  titulo: string;
  descripcion: string;
  valor: string;
  onValor: (v: string) => void;
  listaTitulo: string;
  objetosBase: string[];
  objetosExtra: string[];
  /** 3 montos sugeridos, calculados a partir del valor de la vivienda que ya tenemos. */
  montosRapidos: string[];
}

function CategoriaAsegurable({
  icon: Icon, titulo, descripcion, valor, onValor, listaTitulo, objetosBase, objetosExtra, montosRapidos,
}: CategoriaProps) {
  const [verMas, setVerMas] = useState(false);
  // En mobile la lista de objetos cubiertos queda plegada para que el paso sea corto y directo.
  const [verInfoMobile, setVerInfoMobile] = useState(false);
  const objetos = verMas ? [...objetosBase, ...objetosExtra] : objetosBase;
  const conValor = !!valor && Number(valor) > 0;

  return (
    <div
      className="rounded-lg flex flex-col"
      style={{
        border: conValor ? "1.5px solid var(--navy)" : "1px solid var(--gray-4)",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      <div
        className="flex items-center justify-between gap-4 w-full"
        style={{ padding: "16px 20px", backgroundColor: "var(--navy-light)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: 40, height: 40, backgroundColor: "#ffffff" }}
          >
            <Icon size={19} strokeWidth={1.7} style={{ color: "var(--navy)" }} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="body-bold" style={{ color: "var(--navy)" }}>{titulo}</span>
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{descripcion}</span>
          </div>
        </div>
        <div className="shrink-0">
          {conValor
            ? <StatusBadge label="Completado" variant="active" />
            : <StatusBadge label="Requerido" variant="pending" />}
        </div>
      </div>

      <div className="flex flex-col gap-5" style={{ padding: "20px" }}>
          {/* Paso: valor */}
          <div className="flex flex-col gap-2">
            <Field label="¿Por cuánto valor total quieres asegurar esta categoría?">
              <div className="flex items-center gap-3 flex-wrap">
                <TextInput placeholder="$ 0" value={formatCOP(valor)} onChange={(v) => onValor(parseDigits(v))} className="w-[220px] max-sm:w-full" />
                <div className="flex items-center gap-2 flex-wrap">
                  {montosRapidos.map((m) => {
                    const activo = valor === m;
                    return (
                      <button
                        key={m}
                        onClick={() => onValor(m)}
                        className="tags rounded-full px-3 py-1.5 transition-colors"
                        style={{
                          cursor: "pointer",
                          border: activo ? "1.5px solid var(--navy)" : "1px solid var(--gray-5)",
                          backgroundColor: activo ? "var(--navy-light)" : "#ffffff",
                          color: activo ? "var(--navy)" : "var(--gray-9)",
                        }}
                        onMouseEnter={(e) => { if (!activo) e.currentTarget.style.backgroundColor = "var(--gray-1)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = activo ? "var(--navy-light)" : "#ffffff"; }}
                      >
                        {formatCOP(m)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Field>
            {conValor ? (
              <div className="flex items-center gap-2">
                <CircleCheck size={15} strokeWidth={1.8} style={{ color: "var(--green-status)" }} />
                <span className="body-small-regular" style={{ color: "var(--green-status)" }}>
                  Protegerás esta categoría hasta por {formatCOP(valor)}.
                </span>
              </div>
            ) : (
              <span className="body-small-regular" style={{ color: "var(--orange-status)" }}>
                Ingresa un valor o elige un monto sugerido para calcular tu protección.
              </span>
            )}
          </div>

          {/* Objetos cubiertos: siempre visible en desktop, en mobile queda detrás de un modal para no alargar el paso */}
          <div className="md:hidden">
            <LinkText size="small" onClick={() => setVerInfoMobile(true)}>¿Qué objetos cubre?</LinkText>
          </div>
          <div className="flex-col gap-2 hidden md:flex">
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{listaTitulo}</span>
            <div className="flex items-center gap-2 flex-wrap">
              {objetos.map((o) => (
                <span
                  key={o}
                  className="tags inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
                  style={{ backgroundColor: "var(--gray-1)", border: "1px solid var(--gray-4)", color: "var(--gray-10)" }}
                >
                  <CircleCheck size={13} strokeWidth={1.8} style={{ color: "var(--green-status)" }} />
                  {o}
                </span>
              ))}
              <LinkText size="small" onClick={() => setVerMas((v) => !v)}>
                {verMas ? "Ver menos" : `Ver ${objetosExtra.length} más`}
              </LinkText>
            </div>
          </div>

          <Modal open={verInfoMobile} onClose={() => setVerInfoMobile(false)} title={titulo}>
            <div className="flex flex-col gap-3">
              <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{listaTitulo}</span>
              <div className="flex items-center gap-2 flex-wrap">
                {[...objetosBase, ...objetosExtra].map((o) => (
                  <span
                    key={o}
                    className="tags inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
                    style={{ backgroundColor: "var(--gray-1)", border: "1px solid var(--gray-4)", color: "var(--gray-10)" }}
                  >
                    <CircleCheck size={13} strokeWidth={1.8} style={{ color: "var(--green-status)" }} />
                    {o}
                  </span>
                ))}
              </div>
            </div>
          </Modal>
        </div>
    </div>
  );
}

// ─── Arma tu plan (paso 2) ────────────────────────────────────────────────────

// ─── Arma tu plan (paso 2) ────────────────────────────────────────────────────

/**
 * Layout del paso 2. "clasico" es el que se muestra hoy: la disposición previa al rediseño,
 * con los textos, planes y precios actuales. "figma" conserva la maqueta de HOGAR DIGITAL
 * (tarjetas autocontenidas, asistencias en lista y detalle en drawer) para poder compararlas.
 */
const LAYOUT_PASO_2: "clasico" | "figma" = "clasico";

function SuscripcionCard({
  icon: Icon, nombre, precio, tag, selected, onSelect, onInfo,
}: { icon: LucideIcon; nombre: string; precio: number; tag: string; selected: boolean; onSelect: () => void; onInfo?: () => void }) {
  return (
    <button
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="relative rounded-lg flex flex-col items-center text-center gap-2 transition-colors"
      style={{
        cursor: "pointer",
        padding: "18px 16px",
        border: selected ? "1.5px solid var(--navy)" : "1px solid var(--gray-4)",
        backgroundColor: selected ? "var(--navy-light)" : "#ffffff",
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = "var(--gray-6)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = selected ? "var(--navy)" : "var(--gray-4)"; }}
    >
      {selected && (
        <CircleCheck size={18} strokeWidth={2} className="absolute" style={{ top: 10, right: 10, color: "var(--navy)" }} />
      )}
      {onInfo && (
        <span
          role="button"
          aria-label={`Ver qué incluye ${nombre}`}
          onClick={(e) => { e.stopPropagation(); onInfo(); }}
          className="absolute flex items-center justify-center rounded-full"
          style={{ top: 10, left: 10, width: 22, height: 22, color: "var(--gray-8)", cursor: "pointer" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--navy)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--gray-8)"; }}
        >
          <Info size={16} strokeWidth={1.8} />
        </span>
      )}
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: 42, height: 42, backgroundColor: selected ? "#ffffff" : "var(--navy-light)" }}
      >
        <Icon size={20} strokeWidth={1.7} style={{ color: "var(--navy)" }} />
      </div>
      <span className="body-bold" style={{ color: "var(--navy)" }}>{nombre}</span>
      <span className="title-tertiary-bold" style={{ color: "var(--gray-10)" }}>
        {precio === 0 ? "Incluido" : <>{formatCOPNumber(precio)}<span className="body-small-regular">/año</span></>}
      </span>
      <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{tag}</span>
    </button>
  );
}

function ArmaTuPlan({ planId, onPlan, adicionales, onToggleAdicional, asistenciaId, onAsistencia, onContinuar, vistaMobile, mostrarPasoAdicionales, onContinuarDesdeAdicionales }: ArmaTuPlanProps) {
  // Sin plan preseleccionado: el usuario debe elegir uno explícitamente antes de poder continuar.
  const plan = planId ? PLANES.find((p) => p.id === planId) : undefined;
  const asistencia = ASISTENCIAS.find((a) => a.id === asistenciaId)!;
  const soloEnPlan = vistaMobile === "asistencia" ? "max-md:hidden" : "";
  const soloEnAsistencia = vistaMobile === "plan" ? "max-md:hidden" : "";
  // En mobile, lo único obligatorio para avanzar en la pantalla de plan es elegirlo: las coberturas
  // adicionales (ya tienen un default válido) se sacan del flujo lineal. El detalle del plan elegido
  // se muestra siempre inline debajo de las tarjetas en desktop; en mobile va dentro de cada tarjeta
  // de un carrusel deslizable (una tarjeta = una opción completa, con su detalle debajo). La asistencia
  // es su propio paso completo y usa el mismo patrón de carrusel en mobile.
  const [adicionalesAbiertas, setAdicionalesAbiertas] = useState(false);
  // Cada tarjeta ocupa el 88% del ancho del carrusel (con un poco de espacio entre ellas), así se
  // asoma un pedazo de la siguiente y el usuario entiende que puede seguir deslizando.
  const CARD_WIDTH_RATIO = 0.88;
  const CARD_GAP = 12;
  const planCarruselRef = useRef<HTMLDivElement>(null);
  const [planSlide, setPlanSlide] = useState(() => Math.max(0, PLANES_CARRUSEL.findIndex((p) => p.id === planId)));
  const irASlidePlan = (i: number) => {
    const el = planCarruselRef.current;
    if (!el) return;
    el.scrollTo({ left: i * (el.clientWidth * CARD_WIDTH_RATIO + CARD_GAP), behavior: "smooth" });
  };
  const onScrollPlanes = () => {
    const el = planCarruselRef.current;
    if (!el || el.clientWidth === 0) return;
    setPlanSlide(Math.round(el.scrollLeft / (el.clientWidth * CARD_WIDTH_RATIO + CARD_GAP)));
  };
  const asistenciaCarruselRef = useRef<HTMLDivElement>(null);
  const [asistenciaSlide, setAsistenciaSlide] = useState(() => Math.max(0, ASISTENCIAS.findIndex((a) => a.id === asistenciaId)));
  const irASlideAsistencia = (i: number) => {
    const el = asistenciaCarruselRef.current;
    if (!el) return;
    el.scrollTo({ left: i * (el.clientWidth * CARD_WIDTH_RATIO + CARD_GAP), behavior: "smooth" });
  };
  const onScrollAsistencias = () => {
    const el = asistenciaCarruselRef.current;
    if (!el || el.clientWidth === 0) return;
    setAsistenciaSlide(Math.round(el.scrollLeft / (el.clientWidth * CARD_WIDTH_RATIO + CARD_GAP)));
  };
  const adicionalesCount = Object.values(adicionales).filter(Boolean).length;
  useEffect(() => {
    if (mostrarPasoAdicionales) setAdicionalesAbiertas(true);
  }, [mostrarPasoAdicionales]);
  // Cerrar el modal: si se abrió como paso extra (desde "Continuar"), cerrarlo también avanza al siguiente paso,
  // haya o no coberturas elegidas. Si se abrió manualmente con el botón, cerrarlo solo cierra (sigue en el paso).
  const cerrarAdicionales = () => {
    setAdicionalesAbiertas(false);
    if (mostrarPasoAdicionales) onContinuarDesdeAdicionales?.();
  };
  // Vista previa de cualquier plan/asistencia (no solo el seleccionado): así el usuario compara antes de elegir.
  const [previewPlanId, setPreviewPlanId] = useState<string | null>(null);
  const [previewAsistenciaId, setPreviewAsistenciaId] = useState<string | null>(null);
  const previewPlan = previewPlanId ? PLANES.find((p) => p.id === previewPlanId) : null;
  const previewAsistencia = previewAsistenciaId ? ASISTENCIAS.find((a) => a.id === previewAsistenciaId) : null;

  const contenidoCoberturasPlan = (p: Plan) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-lg" style={{ backgroundColor: "var(--navy-light)", padding: "10px 14px" }}>
        <ShieldCheck size={18} strokeWidth={1.8} style={{ color: "var(--navy)", flexShrink: 0 }} />
        <div className="flex flex-col">
          <span className="body-small-bold" style={{ color: "var(--navy)" }}>Todo lo del {p.nombre}</span>
          <span className="disclamer" style={{ color: "var(--navy)" }}>{p.coberturas.length} coberturas incluidas</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {p.coberturas.map((c) => (
          <div key={c.titulo} className="flex items-start gap-2">
            <CircleCheck size={15} strokeWidth={1.8} style={{ color: "var(--green-status)", flexShrink: 0, marginTop: 2 }} />
            <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>
              <span style={{ fontWeight: 700 }}>{c.titulo}: </span>{c.descripcion}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const categoriasAsistenciaContenido = (a: Asistencia) => (
    <div className="flex flex-col gap-3">
      {a.categorias.map((cat) => (
        <div key={cat.titulo} className="flex flex-col gap-2">
          <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />
          <span className="body-small-bold" style={{ color: "var(--gray-10)" }}>{cat.titulo}</span>
          <div className="flex flex-col gap-1.5">
            {cat.items.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CircleCheck size={14} strokeWidth={1.8} style={{ color: "var(--green-status)", flexShrink: 0, marginTop: 2 }} />
                <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const contenidoCoberturasAsistencia = (a: Asistencia) => (
    <div className="flex flex-col gap-3">
      <p className="body-small-regular" style={{ color: "var(--gray-9)" }}>{a.descripcion}</p>
      {categoriasAsistenciaContenido(a)}
    </div>
  );

  /** Detalle de una asistencia para la tarjeta del carrusel: solo lo que suma sobre la asistencia
   * anterior (mismo patrón que las tarjetas de plan), sin repetir la descripción larga. */
  const contenidoCoberturasAsistenciaCard = (a: Asistencia) => {
    const idx = ASISTENCIAS.findIndex((x) => x.id === a.id);
    const anterior = idx > 0 ? ASISTENCIAS[idx - 1] : null;
    const nuevas = anterior ? a.categorias.slice(anterior.categorias.length) : a.categorias;
    const chipTitulo = anterior ? `Todo lo de ${anterior.nombre}` : null;
    const categoriaPlural = nuevas.length === 1 ? "categoría" : "categorías";
    const chipSubtitulo = anterior
      ? `+ ${nuevas.length} ${categoriaPlural} nueva${nuevas.length === 1 ? "" : "s"}`
      : `${nuevas.length} ${categoriaPlural} incluida${nuevas.length === 1 ? "" : "s"}`;
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-lg" style={{ backgroundColor: "var(--navy-light)", padding: "10px 14px" }}>
          <ShieldCheck size={18} strokeWidth={1.8} style={{ color: "var(--navy)", flexShrink: 0 }} />
          <div className="flex flex-col">
            {chipTitulo && <span className="body-small-bold" style={{ color: "var(--navy)" }}>{chipTitulo}</span>}
            <span className="disclamer" style={{ color: "var(--navy)" }}>{chipSubtitulo}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {nuevas.map((cat) => (
            <div key={cat.titulo} className="flex flex-col gap-2">
              <span className="body-small-bold" style={{ color: "var(--gray-10)" }}>{cat.titulo}</span>
              <div className="flex flex-col gap-1.5">
                {cat.items.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CircleCheck size={14} strokeWidth={1.8} style={{ color: "var(--green-status)", flexShrink: 0, marginTop: 2 }} />
                    <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const detallePlanContenido = plan ? contenidoCoberturasPlan(plan) : null;

  /** mostrarLinkSaltar: solo en el modal-paso-extra de mobile, para que el usuario sepa que puede seguir sin elegir nada. */
  const coberturasAdicionalesContenido = (mostrarLinkSaltar: boolean) => (
    <div className="flex flex-col gap-3">
      <p className="body-small-regular" style={{ color: "var(--gray-9)" }}>
        Tu seguro viene listo. Si lo deseas, suma coberturas adicionales según tus necesidades.
      </p>
      {mostrarLinkSaltar && (
        <LinkText size="small" onClick={cerrarAdicionales}>Continuar sin agregar coberturas</LinkText>
      )}
      <div className="flex flex-col gap-3">
        {COBERTURAS_ADICIONALES.map((c) => (
          <CoberturaAdicionalRow
            key={c.id}
            cobertura={c}
            activa={!!adicionales[c.id]}
            onToggle={(v) => onToggleAdicional(c.id, v)}
          />
        ))}
      </div>
    </div>
  );

  /** Detalle de un plan para la tarjeta del carrusel: solo lo que suma sobre el plan anterior (no repite
   * lo que ya viene incluido), y cada cobertura se corta en el título en negrita (sin ":" ni descripción). */
  const contenidoCoberturasPlanCard = (p: Plan) => {
    const idx = PLANES.findIndex((x) => x.id === p.id);
    const anterior = idx > 0 ? PLANES[idx - 1] : null;
    const nuevas = anterior ? p.coberturas.slice(anterior.coberturas.length) : p.coberturas;
    const chipTitulo = anterior ? `Todo lo del ${anterior.nombre}` : null;
    const chipSubtitulo = anterior ? `${anterior.coberturas.length} coberturas incluidas` : `${nuevas.length} coberturas incluidas`;
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-lg" style={{ backgroundColor: "var(--navy-light)", padding: "10px 14px" }}>
          <ShieldCheck size={18} strokeWidth={1.8} style={{ color: "var(--navy)", flexShrink: 0 }} />
          <div className="flex flex-col">
            {chipTitulo && <span className="body-small-bold" style={{ color: "var(--navy)" }}>{chipTitulo}</span>}
            <span className="disclamer" style={{ color: "var(--navy)" }}>{chipSubtitulo}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {nuevas.map((c) => (
            <div key={c.titulo} className="flex items-start gap-2">
              <CircleCheck size={15} strokeWidth={1.8} style={{ color: "var(--green-status)", flexShrink: 0, marginTop: 2 }} />
              <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 700 }}>{c.titulo}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /** Tarjeta completa de una opción para el carrusel mobile: header con precio + botón de selección, y su detalle debajo. */
  const planSlideContenido = (p: Plan) => {
    const seleccionado = planId === p.id;
    const Icon = PLAN_ICONS[p.id];
    const sugerido = !!p.sugerido;
    const destacado = !!p.sugerido;
    return (
      <div
        key={p.id}
        className="snap-center shrink-0 rounded-xl overflow-hidden"
        style={{
          width: `${CARD_WIDTH_RATIO * 100}%`,
          marginRight: CARD_GAP,
          border: destacado ? "2px solid var(--navy)" : seleccionado ? "1.5px solid var(--navy)" : "1px solid var(--gray-4)",
          boxShadow: destacado ? "0 6px 20px rgba(0,0,0,0.12)" : "none",
        }}
      >
        <div className="relative flex flex-col items-center text-center gap-2" style={{ backgroundColor: destacado ? "var(--navy)" : "var(--navy-light)", padding: "22px 20px" }}>
          {(sugerido || destacado) && (
            <span
              className="tags rounded-full px-3 py-1 absolute"
              style={destacado ? { top: 14, left: 14, backgroundColor: "#ffffff", color: "var(--navy)" } : { top: 14, left: 14, backgroundColor: "var(--navy)", color: "#ffffff" }}
            >
              Sugerido
            </span>
          )}
          {seleccionado && (
            <CircleCheck size={20} strokeWidth={2} className="absolute" style={{ top: 14, right: 14, color: destacado ? "#ffffff" : "var(--navy)" }} />
          )}
          <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, backgroundColor: "#ffffff", marginTop: (sugerido || destacado) ? 22 : 0 }}>
            <Icon size={22} strokeWidth={1.7} style={{ color: "var(--navy)" }} />
          </div>
          <span className="title-tertiary-bold" style={{ color: destacado ? "#ffffff" : "var(--navy)" }}>{p.nombre}</span>
          <span className="title-secondary" style={{ color: destacado ? "#ffffff" : "var(--gray-10)" }}>{formatCOPNumber(p.precio)}<span className="body-small-regular">/año</span></span>
          <span className="body-small-regular" style={{ color: destacado ? "rgba(255,255,255,0.75)" : "var(--gray-9)" }}>{p.tag}</span>
          <AppButton
            variant={destacado ? (seleccionado ? "ghost" : "accent") : (seleccionado ? "secondary" : "primary")}
            bold
            fullWidth
            onClick={() => onPlan(p.id)}
          >
            {seleccionado ? (<><CircleCheck size={15} /> Plan seleccionado</>) : "Seleccionar plan"}
          </AppButton>
        </div>
        <div className="flex flex-col gap-3" style={{ padding: "20px" }}>
          {contenidoCoberturasPlanCard(p)}
        </div>
      </div>
    );
  };

  const asistenciaSlideContenido = (a: Asistencia) => {
    const seleccionada = asistenciaId === a.id;
    const Icon = a.icon;
    return (
      <div
        key={a.id}
        className="snap-center shrink-0 rounded-xl overflow-hidden"
        style={{ width: `${CARD_WIDTH_RATIO * 100}%`, marginRight: CARD_GAP, border: seleccionada ? "1.5px solid var(--navy)" : "1px solid var(--gray-4)" }}
      >
        <div className="relative flex flex-col items-center text-center gap-2" style={{ backgroundColor: "var(--navy-light)", padding: "22px 20px" }}>
          {seleccionada && (
            <CircleCheck size={20} strokeWidth={2} className="absolute" style={{ top: 14, right: 14, color: "var(--navy)" }} />
          )}
          <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, backgroundColor: "#ffffff" }}>
            <Icon size={22} strokeWidth={1.7} style={{ color: "var(--navy)" }} />
          </div>
          <span className="title-tertiary-bold" style={{ color: "var(--navy)" }}>{a.nombre}</span>
          <span className="title-secondary" style={{ color: "var(--gray-10)" }}>{a.precio === 0 ? "Incluido" : <>{formatCOPNumber(a.precio)}<span className="body-small-regular">/año</span></>}</span>
          <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{a.precio === 0 ? "Incluido con tu plan" : "Mejora opcional"}</span>
          <AppButton variant={seleccionada ? "secondary" : "primary"} bold fullWidth onClick={() => onAsistencia(a.id)}>
            {seleccionada ? (<><CircleCheck size={15} /> Asistencia seleccionada</>) : "Seleccionar asistencia"}
          </AppButton>
        </div>
        <div className="flex flex-col gap-3" style={{ padding: "20px" }}>
          {contenidoCoberturasAsistenciaCard(a)}
        </div>
      </div>
    );
  };

  /** Encabezado de la sección de asistencia: mismo contenido en desktop y mobile, solo cambia el layout que lo envuelve.
   * Deja explícito que la asistencia va incluida y es obligatoria (el usuario elige el nivel, no si la tiene),
   * que no hay cláusulas de permanencia, y a qué paquete accederá con la selección actual. */
  const asistenciaEncabezado = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Mejorar asistencias</h2>
        <StatusBadge label="Asistencias S incluidas" variant="active" />
      </div>
      <p className="body-small-regular" style={{ color: "var(--gray-9)" }}>
        Sácale el jugo a tu plan y usa las asistencias en tu día a día. El seguro cubre los daños grandes,
        pero estas asistencias resuelven los líos cotidianos (plomeros, cerrajeros, electricistas).
      </p>
      <div className="flex items-start gap-2 rounded-lg" style={{ backgroundColor: "var(--navy-light)", padding: "10px 12px" }}>
        <Lock size={15} strokeWidth={1.8} style={{ color: "var(--navy)", flexShrink: 0, marginTop: 2 }} />
        <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>
          Puedes personalizar tus asistencias y coberturas antes de confirmar. Cualquier cambio actualizará
          el precio automáticamente.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ShieldCheck size={15} strokeWidth={1.8} style={{ color: "var(--navy)" }} />
        <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>
          Accederás a: <span style={{ fontWeight: 700 }}>{asistencia.nombre}</span>
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Elegir plan — desktop: grid de tarjetas + detalle del plan elegido debajo, como siempre. */}
      <div className={`hidden md:flex flex-col gap-4 ${soloEnPlan}`}>
        <div>
          <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Este es tu plan sugerido</h2>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
            Personalizándolo a las necesidades de tu hogar.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4" role="radiogroup" aria-label="Plan de seguro">
          {PLANES.map((p) => (
            <SuscripcionCard
              key={p.id}
              icon={PLAN_ICONS[p.id]}
              nombre={p.nombre}
              precio={p.precio}
              tag={p.tag}
              selected={planId === p.id}
              onSelect={() => onPlan(p.id)}
              onInfo={() => setPreviewPlanId(p.id)}
            />
          ))}
        </div>
      </div>
      {plan && (
        <div className={`hidden md:flex rounded-lg flex-col gap-3 ${soloEnPlan}`} style={{ border: "1px solid var(--gray-4)", padding: "18px 20px" }}>
          <h3 className="body-bold" style={{ color: "var(--navy)" }}>Todo lo que debes conocer del {plan.nombre}</h3>
          {detallePlanContenido}
        </div>
      )}

      {/* Elegir plan — mobile: carrusel deslizable, cada tarjeta trae su propio detalle de coberturas debajo. */}
      <div className={`md:hidden flex flex-col gap-3 ${soloEnPlan}`}>
        <div>
          <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Este es tu plan sugerido</h2>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
            Personalizándolo a las necesidades de tu hogar. Desliza para comparar los planes.
          </p>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          {PLANES_CARRUSEL.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir al plan ${i + 1}`}
              onClick={() => irASlidePlan(i)}
              className="rounded-full transition-all"
              style={{ width: i === planSlide ? 18 : 6, height: 6, backgroundColor: i === planSlide ? "var(--navy)" : "var(--gray-4)", cursor: "pointer" }}
            />
          ))}
        </div>
        <div
          ref={planCarruselRef}
          onScroll={onScrollPlanes}
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
          role="radiogroup"
          aria-label="Plan de seguro"
        >
          {PLANES_CARRUSEL.map((p) => planSlideContenido(p))}
        </div>
        {/* Refleja la tarjeta visible en el carrusel (no la seleccionada), para poder ver el detalle de cualquiera. */}
        <LinkText size="small" onClick={() => setPreviewPlanId(PLANES_CARRUSEL[planSlide]?.id ?? null)}>
          Ver el paquete completo de {PLANES_CARRUSEL[planSlide]?.nombre}
        </LinkText>
      </div>

      {/* Coberturas adicionales: ya tiene un default válido (ninguna activa), no es obligatoria para avanzar.
          Desktop la conserva siempre visible; mobile la deja detrás de un modal opcional en la pantalla del plan. */}
      <div className={`rounded-lg flex flex-col hidden md:flex ${soloEnPlan}`} style={{ border: "1px solid var(--gray-4)", padding: "18px 20px" }}>
        <h3 className="body-bold" style={{ color: "var(--navy)" }}>Incluir coberturas</h3>
        <div style={{ marginTop: 8 }}>{coberturasAdicionalesContenido(false)}</div>
      </div>
      <div className={`md:hidden ${soloEnPlan}`}>
        <AppButton variant="secondary" onClick={() => setAdicionalesAbiertas(true)}>
          <SlidersHorizontal size={15} />
          Incluir coberturas{adicionalesCount > 0 ? ` (${adicionalesCount})` : ""}
        </AppButton>
      </div>
      <Modal open={adicionalesAbiertas} onClose={cerrarAdicionales} title="Incluir coberturas" width={620}>
        <div className="flex flex-col gap-4">
          {coberturasAdicionalesContenido(!!mostrarPasoAdicionales)}
          {/* Al abrirse como paso extra (desde "Continuar"), se necesita una acción explícita para seguir avanzando. */}
          {mostrarPasoAdicionales && (
            <div className="flex items-center justify-end">
              <AppButton variant="primary" bold onClick={cerrarAdicionales}>Continuar</AppButton>
            </div>
          )}
        </div>
      </Modal>

      {/* Paquetes de asistencias — desktop: grid + detalle debajo, como siempre. */}
      <div className={`hidden md:flex flex-col gap-4 ${soloEnAsistencia}`}>
        {asistenciaEncabezado}
        <div className="grid grid-cols-3 gap-4" role="radiogroup" aria-label="Paquete de asistencias">
          {ASISTENCIAS.map((a) => (
            <SuscripcionCard
              key={a.id}
              icon={a.icon}
              nombre={a.nombre}
              precio={a.precio}
              tag={a.precio === 0 ? "Incluido con tu plan" : "Mejora opcional"}
              selected={asistenciaId === a.id}
              onSelect={() => onAsistencia(a.id)}
              onInfo={() => setPreviewAsistenciaId(a.id)}
            />
          ))}
        </div>
      </div>
      <div className={`hidden md:flex rounded-lg flex-col gap-3 ${soloEnAsistencia}`} style={{ border: "1px solid var(--gray-4)", padding: "18px 20px" }}>
        <div>
          <h3 className="body-bold" style={{ color: "var(--navy)" }}>Has seleccionado: {asistencia.nombre}</h3>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>{asistencia.descripcion}</p>
        </div>
        {categoriasAsistenciaContenido(asistencia)}
      </div>

      {/* Paquetes de asistencias — mobile: carrusel deslizable, mismo patrón que el paso "Tu plan". */}
      <div className={`md:hidden flex flex-col gap-3 ${soloEnAsistencia}`}>
        {asistenciaEncabezado}
        <p className="body-small-regular" style={{ color: "var(--gray-9)" }}>
          Desliza para comparar qué tan completo quieres que sea tu equipo de rescate.
        </p>
        <div className="flex items-center justify-center gap-1.5">
          {ASISTENCIAS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir a la asistencia ${i + 1}`}
              onClick={() => irASlideAsistencia(i)}
              className="rounded-full transition-all"
              style={{ width: i === asistenciaSlide ? 18 : 6, height: 6, backgroundColor: i === asistenciaSlide ? "var(--navy)" : "var(--gray-4)", cursor: "pointer" }}
            />
          ))}
        </div>
        <div
          ref={asistenciaCarruselRef}
          onScroll={onScrollAsistencias}
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
          role="radiogroup"
          aria-label="Paquete de asistencias"
        >
          {ASISTENCIAS.map((a) => asistenciaSlideContenido(a))}
        </div>
        {/* Refleja la tarjeta visible en el carrusel (no la seleccionada), para poder ver el detalle de cualquiera. */}
        <LinkText size="small" onClick={() => setPreviewAsistenciaId(ASISTENCIAS[asistenciaSlide]?.id ?? null)}>
          Ver el paquete completo de {ASISTENCIAS[asistenciaSlide]?.nombre}
        </LinkText>
      </div>

      {/* Vista previa de cualquier plan/asistencia desde el ícono (i) de cada tarjeta, sin necesidad de seleccionarlo. */}
      <Modal open={!!previewPlan} onClose={() => setPreviewPlanId(null)} title={previewPlan ? `Todo lo que debes conocer del ${previewPlan.nombre}` : ""} width={620}>
        {previewPlan && contenidoCoberturasPlan(previewPlan)}
      </Modal>
      <Modal open={!!previewAsistencia} onClose={() => setPreviewAsistenciaId(null)} title={previewAsistencia?.nombre ?? ""} width={620}>
        {previewAsistencia && contenidoCoberturasAsistencia(previewAsistencia)}
      </Modal>

      {/* Continuar (en mobile lo cubre la barra fija inferior) */}
      <div className="flex items-center justify-end max-md:hidden">
        <AppButton variant="primary" bold disabled={!plan} onClick={onContinuar}>Continuar</AppButton>
      </div>
    </div>
  );
}


/** Fila de un nivel de asistencias: nombre + qué aporta a la izquierda, precio (o "Incluido") a la derecha. */
function AsistenciaRow({ asistencia, selected, onSelect }: { asistencia: Asistencia; selected: boolean; onSelect: () => void }) {
  const incluida = asistencia.precio === 0;
  return (
    <button
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="rounded-lg flex items-center justify-between gap-4 text-left transition-colors"
      style={{
        cursor: "pointer",
        padding: "14px 18px",
        border: selected ? "1.5px solid var(--navy)" : "1px solid var(--gray-4)",
        backgroundColor: selected ? "var(--navy-light)" : "#ffffff",
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = "var(--gray-6)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = selected ? "var(--navy)" : "var(--gray-4)"; }}
    >
      <div className="flex flex-col gap-0.5">
        <span className="body-bold" style={{ color: "var(--navy)" }}>{asistencia.nombre}</span>
        <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{asistencia.descripcion}</span>
      </div>
      {incluida ? (
        <span className="tags rounded-full px-3 py-1 shrink-0" style={{ backgroundColor: "var(--navy)", color: "#ffffff" }}>
          Incluido
        </span>
      ) : (
        <span className="body-bold shrink-0" style={{ color: "var(--gray-10)", whiteSpace: "nowrap" }}>
          {formatCOPNumber(asistencia.precio)}<span className="body-small-regular">/año</span>
        </span>
      )}
    </button>
  );
}

/** Fila de cobertura adicional opcional: toggle + descripción cuando está activa. */
function CoberturaAdicionalRow({ cobertura, activa, onToggle }: { cobertura: CoberturaAdicional; activa: boolean; onToggle: (v: boolean) => void }) {
  const Icon = cobertura.icon;
  return (
    <div
      className="rounded-lg flex items-start gap-3 max-sm:flex-wrap"
      style={{
        padding: "14px 16px",
        border: activa ? "1.5px solid var(--navy)" : "1px solid var(--gray-4)",
        backgroundColor: activa ? "var(--navy-light)" : "#ffffff",
        transition: "border-color 0.2s, background-color 0.2s",
      }}
    >
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 36, height: 36, backgroundColor: "#ffffff" }}
      >
        <Icon size={17} strokeWidth={1.8} style={{ color: "var(--navy)" }} />
      </div>
      <div className="flex-1 flex flex-col gap-1" style={{ minWidth: 140 }}>
        <span className="body-bold" style={{ color: "var(--navy)" }}>{cobertura.titulo}</span>
        <p className="body-small-regular" style={{ color: "var(--gray-9)", margin: 0 }}>{cobertura.descripcion}</p>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0 max-sm:w-full max-sm:flex-row max-sm:items-center max-sm:justify-between">
        <ToggleSwitch checked={activa} onChange={onToggle} />
        <span className="tags rounded-full px-3 py-1" style={{ backgroundColor: activa ? "#ffffff" : "var(--navy-light)", color: "var(--navy)", whiteSpace: "nowrap" }}>
          + {formatCOPNumber(cobertura.precio)} / año
        </span>
      </div>
    </div>
  );
}

interface ArmaTuPlanProps {
  planId: string;
  onPlan: (id: string) => void;
  adicionales: Record<string, boolean>;
  onToggleAdicional: (id: string, v: boolean) => void;
  asistenciaId: string;
  onAsistencia: (id: string) => void;
  onContinuar: () => void;
  /** Sub-paso visible en mobile: "plan" muestra la elección de plan, "asistencia" su propia pantalla (paso propio). Desktop ve todo. */
  vistaMobile?: "plan" | "asistencia";
  /** Mobile: al pulsar "Continuar" en la pantalla de plan, el modal de coberturas adicionales se
   * abre como si fuera un paso extra (en vez de avanzar directo a asistencia). */
  mostrarPasoAdicionales?: boolean;
  /** Se llama al cerrar ese paso extra (con o sin coberturas elegidas), para que el padre avance de paso. */
  onContinuarDesdeAdicionales?: () => void;
}

function ArmaTuPlanFigma({ planId, onPlan, adicionales, onToggleAdicional, asistenciaId, onAsistencia, onContinuar, vistaMobile, mostrarPasoAdicionales, onContinuarDesdeAdicionales }: ArmaTuPlanProps) {
  // Sin plan preseleccionado: el usuario debe elegir uno explícitamente antes de poder continuar.
  const plan = planId ? PLANES.find((p) => p.id === planId) : undefined;
  const asistencia = ASISTENCIAS.find((a) => a.id === asistenciaId)!;
  const soloEnPlan = vistaMobile === "asistencia" ? "max-md:hidden" : "";
  const soloEnAsistencia = vistaMobile === "plan" ? "max-md:hidden" : "";
  // En mobile, lo único obligatorio para avanzar en la pantalla de plan es elegirlo: las coberturas
  // adicionales (ya tienen un default válido) se sacan del flujo lineal. El detalle del plan elegido
  // se muestra siempre inline debajo de las tarjetas en desktop; en mobile va dentro de cada tarjeta
  // de un carrusel deslizable (una tarjeta = una opción completa, con su detalle debajo). La asistencia
  // es su propio paso completo y usa el mismo patrón de carrusel en mobile.
  const [adicionalesAbiertas, setAdicionalesAbiertas] = useState(false);
  // Cada tarjeta ocupa el 88% del ancho del carrusel (con un poco de espacio entre ellas), así se
  // asoma un pedazo de la siguiente y el usuario entiende que puede seguir deslizando.
  const CARD_WIDTH_RATIO = 0.88;
  const CARD_GAP = 12;
  const planCarruselRef = useRef<HTMLDivElement>(null);
  const [planSlide, setPlanSlide] = useState(() => Math.max(0, PLANES_CARRUSEL.findIndex((p) => p.id === planId)));
  const irASlidePlan = (i: number) => {
    const el = planCarruselRef.current;
    if (!el) return;
    el.scrollTo({ left: i * (el.clientWidth * CARD_WIDTH_RATIO + CARD_GAP), behavior: "smooth" });
  };
  const onScrollPlanes = () => {
    const el = planCarruselRef.current;
    if (!el || el.clientWidth === 0) return;
    setPlanSlide(Math.round(el.scrollLeft / (el.clientWidth * CARD_WIDTH_RATIO + CARD_GAP)));
  };
  const adicionalesCount = Object.values(adicionales).filter(Boolean).length;
  useEffect(() => {
    if (mostrarPasoAdicionales) setAdicionalesAbiertas(true);
  }, [mostrarPasoAdicionales]);
  // Cerrar el modal: si se abrió como paso extra (desde "Continuar"), cerrarlo también avanza al siguiente paso,
  // haya o no coberturas elegidas. Si se abrió manualmente con el botón, cerrarlo solo cierra (sigue en el paso).
  const cerrarAdicionales = () => {
    setAdicionalesAbiertas(false);
    if (mostrarPasoAdicionales) onContinuarDesdeAdicionales?.();
  };
  // Vista previa de cualquier plan (no solo el seleccionado): así el usuario compara antes de elegir.
  const [previewPlanId, setPreviewPlanId] = useState<string | null>(null);
  const previewPlan = previewPlanId ? PLANES.find((p) => p.id === previewPlanId) : null;
  // El detalle de servicios de las asistencias arranca plegado: es información de apoyo, no un paso del flujo.
  const [detalleServiciosAbierto, setDetalleServiciosAbierto] = useState(false);

  /** Detalle completo del plan para el drawer: una cobertura por fila, plegada, con su descripción dentro.
   * La primera arranca abierta para que se entienda de entrada que cada fila se despliega. */
  const contenidoCoberturasPlan = (p: Plan) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-lg" style={{ backgroundColor: "var(--navy-light)", padding: "10px 14px" }}>
        <ShieldCheck size={18} strokeWidth={1.8} style={{ color: "var(--navy)", flexShrink: 0 }} />
        <div className="flex flex-col">
          <span className="body-small-bold" style={{ color: "var(--navy)" }}>Todo lo del {p.nombre}</span>
          <span className="disclamer" style={{ color: "var(--navy)" }}>{p.coberturas.length} coberturas incluidas</span>
        </div>
      </div>
      <Accordion
        defaultOpenIds={p.coberturas.length > 0 ? [p.coberturas[0].titulo] : []}
        items={p.coberturas.map((c) => ({
          id: c.titulo,
          title: c.titulo,
          content: <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{c.descripcion}</span>,
        }))}
      />
    </div>
  );

  /** mostrarLinkSaltar: solo en el modal-paso-extra de mobile, para que el usuario sepa que puede seguir sin elegir nada. */
  const coberturasAdicionalesContenido = (mostrarLinkSaltar: boolean) => (
    <div className="flex flex-col gap-3">
      <p className="body-small-regular" style={{ color: "var(--gray-9)" }}>
        Tu seguro viene listo. Si lo deseas, suma coberturas adicionales según tus necesidades.
      </p>
      {mostrarLinkSaltar && (
        <LinkText size="small" onClick={cerrarAdicionales}>Continuar sin agregar coberturas</LinkText>
      )}
      <div className="flex flex-col gap-3">
        {COBERTURAS_ADICIONALES.map((c) => (
          <CoberturaAdicionalRow
            key={c.id}
            cobertura={c}
            activa={!!adicionales[c.id]}
            onToggle={(v) => onToggleAdicional(c.id, v)}
          />
        ))}
      </div>
    </div>
  );

  /** Detalle de un plan para la tarjeta: solo lo que suma sobre el plan anterior (no repite lo que ya
   * viene incluido), y cada cobertura se corta en el título en negrita (sin ":" ni descripción). */
  const contenidoCoberturasPlanCard = (p: Plan) => {
    const idx = PLANES.findIndex((x) => x.id === p.id);
    const anterior = idx > 0 ? PLANES[idx - 1] : null;
    const nuevas = anterior ? p.coberturas.slice(anterior.coberturas.length) : p.coberturas;
    const chipTitulo = anterior ? `Todo lo del ${anterior.nombre}` : null;
    const chipSubtitulo = anterior ? `${anterior.coberturas.length} coberturas incluidas` : `${nuevas.length} coberturas incluidas`;
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-lg" style={{ backgroundColor: "var(--navy-light)", padding: "10px 14px" }}>
          <ShieldCheck size={18} strokeWidth={1.8} style={{ color: "var(--navy)", flexShrink: 0 }} />
          <div className="flex flex-col">
            {chipTitulo && <span className="body-small-bold" style={{ color: "var(--navy)" }}>{chipTitulo}</span>}
            <span className="disclamer" style={{ color: "var(--navy)" }}>{chipSubtitulo}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {nuevas.map((c) => (
            <div key={c.titulo} className="flex items-start gap-2">
              <CircleCheck size={15} strokeWidth={1.8} style={{ color: "var(--green-status)", flexShrink: 0, marginTop: 2 }} />
              <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 700 }}>{c.titulo}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /** Tarjeta completa de un plan: header con precio y botón de selección, detalle de coberturas debajo.
   * Misma tarjeta en desktop (grilla) y mobile (carrusel): solo cambia el contenedor que la envuelve. */
  const planCardContenido = (p: Plan, layout: "grid" | "slide") => {
    const seleccionado = planId === p.id;
    const Icon = PLAN_ICONS[p.id];
    // El plan sugerido va siempre resaltado, esté o no seleccionado: es la recomendación del cotizador.
    const destacado = !!p.sugerido;
    return (
      <div
        key={p.id}
        className={`rounded-xl overflow-hidden flex flex-col ${layout === "slide" ? "snap-center shrink-0" : "h-full"}`}
        style={{
          ...(layout === "slide" ? { width: `${CARD_WIDTH_RATIO * 100}%`, marginRight: CARD_GAP } : {}),
          border: destacado ? "2px solid var(--navy)" : seleccionado ? "1.5px solid var(--navy)" : "1px solid var(--gray-4)",
          boxShadow: destacado ? "0 6px 20px rgba(0,0,0,0.12)" : "none",
        }}
      >
        <div className="relative flex flex-col items-center text-center gap-2" style={{ backgroundColor: destacado ? "var(--navy)" : "var(--navy-light)", padding: "22px 20px" }}>
          {destacado && (
            <span
              className="tags rounded-full px-3 py-1 absolute"
              style={{ top: 14, left: 14, backgroundColor: "#ffffff", color: "var(--navy)" }}
            >
              Sugerido
            </span>
          )}
          {seleccionado && (
            <CircleCheck size={20} strokeWidth={2} className="absolute" style={{ top: 14, right: 14, color: destacado ? "#ffffff" : "var(--navy)" }} />
          )}
          <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, backgroundColor: "#ffffff", marginTop: destacado ? 22 : 0 }}>
            <Icon size={22} strokeWidth={1.7} style={{ color: "var(--navy)" }} />
          </div>
          <span className="title-tertiary-bold" style={{ color: destacado ? "#ffffff" : "var(--navy)" }}>{p.nombre}</span>
          <span className="title-secondary" style={{ color: destacado ? "#ffffff" : "var(--gray-10)" }}>{formatCOPNumber(p.precio)}<span className="body-small-regular">/año</span></span>
          <span className="body-small-regular" style={{ color: destacado ? "rgba(255,255,255,0.75)" : "var(--gray-9)" }}>{p.tag}</span>
          <AppButton
            variant={destacado ? (seleccionado ? "ghost" : "accent") : (seleccionado ? "secondary" : "primary")}
            bold
            fullWidth
            onClick={() => onPlan(p.id)}
          >
            {seleccionado ? (<><CircleCheck size={15} /> Plan seleccionado</>) : "Seleccionar plan"}
          </AppButton>
        </div>
        <div className="flex flex-col gap-3 flex-1" style={{ padding: "20px" }}>
          {contenidoCoberturasPlanCard(p)}
          {/* Empuja el botón al pie para que las 3 tarjetas de la grilla lo alineen a la misma altura. */}
          <div className="mt-auto pt-2">
            <AppButton variant="secondary" fullWidth onClick={() => setPreviewPlanId(p.id)}>
              Ver todas las coberturas
            </AppButton>
          </div>
        </div>
      </div>
    );
  };

  /** Encabezado de la sección de asistencia: mismo contenido en desktop y mobile, solo cambia el layout que lo envuelve.
   * Deja explícito que la asistencia va incluida y es obligatoria (el usuario elige el nivel, no si la tiene),
   * que no hay cláusulas de permanencia, y a qué paquete accederá con la selección actual. */
  const asistenciaEncabezado = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Mejorar asistencias</h2>
        <StatusBadge label="Asistencias S incluidas" variant="active" />
      </div>
      <p className="body-small-regular" style={{ color: "var(--gray-9)" }}>
        Sácale el jugo a tu plan y usa las asistencias en tu día a día. El seguro cubre los daños grandes,
        pero estas asistencias resuelven los líos cotidianos (plomeros, cerrajeros, electricistas).
      </p>
      <div className="flex items-start gap-2 rounded-lg" style={{ backgroundColor: "var(--navy-light)", padding: "10px 12px" }}>
        <Lock size={15} strokeWidth={1.8} style={{ color: "var(--navy)", flexShrink: 0, marginTop: 2 }} />
        <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>
          Puedes personalizar tus asistencias y coberturas antes de confirmar. Cualquier cambio actualizará
          el precio automáticamente.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ShieldCheck size={15} strokeWidth={1.8} style={{ color: "var(--navy)" }} />
        <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>
          Accederás a: <span style={{ fontWeight: 700 }}>{asistencia.nombre}</span>
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Elegir plan — desktop: cada tarjeta se basta sola (precio, lo que suma sobre el plan anterior y
          el acceso al detalle completo), sin un bloque de detalle aparte debajo de la grilla. */}
      <div className={`hidden md:flex flex-col gap-4 ${soloEnPlan}`}>
        <div>
          <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Este es tu plan sugerido</h2>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
            Personalizándolo a las necesidades de tu hogar.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 items-stretch" role="radiogroup" aria-label="Plan de seguro">
          {PLANES.map((p) => planCardContenido(p, "grid"))}
        </div>
      </div>

      {/* Elegir plan — mobile: carrusel deslizable, cada tarjeta trae su propio detalle de coberturas debajo. */}
      <div className={`md:hidden flex flex-col gap-3 ${soloEnPlan}`}>
        <div>
          <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Este es tu plan sugerido</h2>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
            Personalizándolo a las necesidades de tu hogar. Desliza para comparar los planes.
          </p>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          {PLANES_CARRUSEL.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir al plan ${i + 1}`}
              onClick={() => irASlidePlan(i)}
              className="rounded-full transition-all"
              style={{ width: i === planSlide ? 18 : 6, height: 6, backgroundColor: i === planSlide ? "var(--navy)" : "var(--gray-4)", cursor: "pointer" }}
            />
          ))}
        </div>
        <div
          ref={planCarruselRef}
          onScroll={onScrollPlanes}
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
          role="radiogroup"
          aria-label="Plan de seguro"
        >
          {PLANES_CARRUSEL.map((p) => planCardContenido(p, "slide"))}
        </div>
      </div>

      {/* Coberturas adicionales: ya tiene un default válido (ninguna activa), no es obligatoria para avanzar.
          Desktop la conserva siempre visible; mobile la deja detrás de un modal opcional en la pantalla del plan. */}
      <div className={`rounded-lg flex flex-col hidden md:flex ${soloEnPlan}`} style={{ border: "1px solid var(--gray-4)", padding: "18px 20px" }}>
        <h3 className="body-bold" style={{ color: "var(--navy)" }}>Incluir coberturas</h3>
        <div style={{ marginTop: 8 }}>{coberturasAdicionalesContenido(false)}</div>
      </div>
      <div className={`md:hidden ${soloEnPlan}`}>
        <AppButton variant="secondary" onClick={() => setAdicionalesAbiertas(true)}>
          <SlidersHorizontal size={15} />
          Incluir coberturas{adicionalesCount > 0 ? ` (${adicionalesCount})` : ""}
        </AppButton>
      </div>
      <Modal open={adicionalesAbiertas} onClose={cerrarAdicionales} title="Incluir coberturas" width={620}>
        <div className="flex flex-col gap-4">
          {coberturasAdicionalesContenido(!!mostrarPasoAdicionales)}
          {/* Al abrirse como paso extra (desde "Continuar"), se necesita una acción explícita para seguir avanzando. */}
          {mostrarPasoAdicionales && (
            <div className="flex items-center justify-end">
              <AppButton variant="primary" bold onClick={cerrarAdicionales}>Continuar</AppButton>
            </div>
          )}
        </div>
      </Modal>

      {/* Paquetes de asistencias: lista vertical (los 3 niveles se comparan de un vistazo, sin carrusel ni
          grid) y un único detalle de servicios debajo, plegado, con las categorías del nivel elegido. */}
      <div className={`flex flex-col gap-4 ${soloEnAsistencia}`}>
        {asistenciaEncabezado}
        <div className="flex flex-col gap-3" role="radiogroup" aria-label="Paquete de asistencias">
          {ASISTENCIAS.map((a) => (
            <AsistenciaRow
              key={a.id}
              asistencia={a}
              selected={asistenciaId === a.id}
              onSelect={() => onAsistencia(a.id)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setDetalleServiciosAbierto((v) => !v)}
            className="body-bold inline-flex items-center gap-2 self-start"
            style={{ cursor: "pointer", background: "transparent", color: "var(--navy)" }}
          >
            <ChevronDown
              size={16}
              style={{ transform: detalleServiciosAbierto ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
            />
            {detalleServiciosAbierto ? "Ocultar detalle de los servicios" : "Mostrar detalle de los servicios"}
          </button>
          {detalleServiciosAbierto && (
            <div className="rounded-lg" style={{ border: "1px solid var(--gray-4)", padding: "4px 18px" }}>
              <Accordion
                // Se reinicia al cambiar de nivel para que el acordeón no quede abierto en una categoría que ya no aplica.
                key={asistencia.id}
                defaultOpenIds={asistencia.categorias.length > 0 ? [asistencia.categorias[0].titulo] : []}
                items={asistencia.categorias.map((cat) => ({
                  id: cat.titulo,
                  title: cat.titulo,
                  content: (
                    <div className="flex flex-col gap-1.5">
                      {cat.items.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <CircleCheck size={14} strokeWidth={1.8} style={{ color: "var(--green-status)", flexShrink: 0, marginTop: 2 }} />
                          <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  ),
                }))}
              />
            </div>
          )}
        </div>
      </div>

      {/* Detalle completo de cualquier plan, desde el ícono (i) o el botón de cada tarjeta. */}
      <Modal open={!!previewPlan} onClose={() => setPreviewPlanId(null)} title={previewPlan ? `Todo lo que debes conocer del ${previewPlan.nombre}` : ""} width={620}>
        {previewPlan && contenidoCoberturasPlan(previewPlan)}
      </Modal>

      {/* Continuar (en mobile lo cubre la barra fija inferior) */}
      <div className="flex items-center justify-end max-md:hidden">
        <AppButton variant="primary" bold disabled={!plan} onClick={onContinuar}>Continuar</AppButton>
      </div>
    </div>
  );
}

// ─── Confirma tu plan (paso 3) ────────────────────────────────────────────────

interface ConfirmaTuPlanProps {
  plan: Plan;
  adicionalesActivas: CoberturaAdicional[];
  asistencia: Asistencia;
  titular: { nombre: string; correo: string };
}

function ConfirmaTuPlan({ plan, adicionalesActivas, asistencia, titular }: ConfirmaTuPlanProps) {
  const [verMasCoberturas, setVerMasCoberturas] = useState(false);
  const [infoAbierta, setInfoAbierta] = useState(false);
  const coberturasVisibles = verMasCoberturas ? plan.coberturas : plan.coberturas.slice(0, 2);
  const fechaInicio = useMemo(() => formatFechaCorta(new Date()), []);
  const categoriasAsistencia = asistencia.categorias.map((c) => c.titulo).join(", ");

  return (
    <div className="flex flex-col gap-6">
      {/* Resumen de la compra */}
      <div className="flex flex-col items-center text-center gap-4">
        <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Resumen de la compra</h2>
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 72, height: 72, backgroundColor: "var(--navy-light)" }}
        >
          <Receipt size={32} strokeWidth={1.6} style={{ color: "var(--navy)" }} />
        </div>
        <p className="body-regular max-md:hidden" style={{ color: "var(--gray-10)", maxWidth: 520, margin: 0 }}>
          Realizarás el pago anual del <span style={{ fontWeight: 700 }}>{plan.nombre}</span> y
          el pago está habilitado únicamente con tarjeta de crédito. Tu cobertura estará activa en minutos.
        </p>
        <button
          onClick={() => setInfoAbierta(true)}
          className="md:hidden inline-flex items-center gap-1.5 body-small-regular"
          style={{ cursor: "pointer", background: "transparent", color: "var(--navy)" }}
        >
          <Info size={14} strokeWidth={1.8} /> ¿Cómo funciona el pago?
        </button>
        <Modal open={infoAbierta} onClose={() => setInfoAbierta(false)} title="Cómo funciona tu seguro">
          <div className="flex flex-col gap-3">
            <p className="body-regular" style={{ color: "var(--gray-10)", margin: 0 }}>
              Realizarás el pago anual del <span style={{ fontWeight: 700 }}>{plan.nombre}</span> y
              el pago está habilitado únicamente con tarjeta de crédito. Tu cobertura estará activa en minutos.
            </p>
            <p className="body-regular" style={{ color: "var(--gray-10)", margin: 0 }}>
              Pagas una vez al año y tu póliza queda vigente por 12 meses. Se renueva automáticamente
              cada año y puedes cancelarla cuando quieras.
            </p>
          </div>
        </Modal>
      </div>

      {/* Titular */}
      <div className="flex flex-col gap-3">
        <h3 className="body-bold" style={{ color: "var(--navy)" }}>Nombre del titular</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 max-sm:grid-cols-1">
          <div className="flex flex-col gap-1">
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Nombre</span>
            <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{titular.nombre}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Correo electrónico</span>
            <span className="body-regular flex items-center gap-1.5" style={{ color: "var(--gray-10)", fontWeight: 500 }}>
              <Mail size={14} style={{ color: "var(--gray-8)" }} />{titular.correo}
            </span>
          </div>
        </div>
        <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Enviaremos la póliza a este correo.</span>
      </div>

      <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

      {/* Plan seleccionado */}
      <div className="flex flex-col gap-5">
        <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Plan seleccionado</h2>

        <div className="flex flex-col gap-3">
          <span className="body-bold" style={{ color: "var(--navy)" }}>{plan.nombre}</span>
          <div className="flex flex-col gap-2">
            {coberturasVisibles.map((c) => (
              <div key={c.titulo} className="flex items-start gap-2">
                <CircleCheck size={15} strokeWidth={1.8} style={{ color: "var(--green-status)", flexShrink: 0, marginTop: 2 }} />
                <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>
                  <span style={{ fontWeight: 700 }}>{c.titulo}: </span>{c.descripcion}
                </span>
              </div>
            ))}
          </div>
          <LinkText size="small" onClick={() => setVerMasCoberturas((v) => !v)}>
            {verMasCoberturas ? "Ver menos" : "Ver más"}
          </LinkText>
        </div>

        <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

        <div className="flex flex-col gap-2">
          <span className="body-bold" style={{ color: "var(--navy)" }}>Vigencia</span>
          <p className="body-small-regular max-md:hidden" style={{ color: "var(--gray-10)", margin: 0 }}>
            Pagas una vez al año y tu póliza queda vigente por 12 meses, sin penalizaciones si decides
            no renovarla.
          </p>
          <p className="body-small-regular" style={{ color: "var(--gray-10)", margin: 0 }}>
            <span style={{ fontWeight: 700 }}>Modalidad:</span> Pago anual
          </p>
          <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Se renueva automáticamente cada año.</span>
        </div>

        <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CalendarClock size={16} strokeWidth={1.8} style={{ color: "var(--navy)" }} />
            <span className="body-bold" style={{ color: "var(--navy)" }}>Fecha de inicio de cobertura</span>
          </div>
          <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{fechaInicio}</span>
        </div>

        <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

        <div className="flex flex-col gap-2">
          <span className="body-bold" style={{ color: "var(--navy)" }}>{asistencia.nombre}</span>
          <p className="body-small-regular" style={{ color: "var(--gray-10)", margin: 0 }}>
            <span style={{ fontWeight: 700 }}>Incluye: </span>{categoriasAsistencia}.
          </p>
        </div>

        <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

        <div className="flex flex-col gap-2">
          <span className="body-bold" style={{ color: "var(--navy)" }}>Coberturas adicionales</span>
          {adicionalesActivas.length > 0 ? (
            <p className="body-small-regular" style={{ color: "var(--gray-10)", margin: 0 }}>
              <span style={{ fontWeight: 700 }}>Incluye: </span>
              {adicionalesActivas.map((c) => c.sidebarLabel).join(", ")}.
            </p>
          ) : (
            <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
              No agregaste coberturas adicionales a tu plan.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Pagar (paso 4) ───────────────────────────────────────────────────────────

interface PagoExitosoProps {
  plan: Plan;
  asistencia: Asistencia;
  totalAnual: number;
  numeroPoliza: string;
  fechaPago: string;
  proximaRenovacion: string;
  onFinalizar: () => void;
  onVerSeguros: () => void;
}

function PagoExitoso({ plan, asistencia, totalAnual, numeroPoliza, fechaPago, proximaRenovacion, onFinalizar, onVerSeguros }: PagoExitosoProps) {
  const [comprobanteEnviado, setComprobanteEnviado] = useState(false);

  return (
    <div className="flex flex-col items-center text-center gap-5" style={{ padding: "12px 0" }}>
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: 76, height: 76, backgroundColor: "var(--green-status-light)" }}
      >
        <CircleCheck size={38} strokeWidth={1.8} style={{ color: "var(--green-status)" }} />
      </div>

      <div>
        <h2 className="title-secondary" style={{ color: "var(--navy)" }}>¡Tu seguro ya está activo!</h2>
        <p className="body-regular" style={{ color: "var(--gray-10)", maxWidth: 480, marginTop: 6 }}>
          Cobramos tu póliza anual y quedó activa de inmediato. Te enviamos el comprobante y
          la póliza al correo de tu cuenta.
        </p>
      </div>

      <div
        className="rounded-lg w-full text-left"
        style={{ border: "1px solid var(--gray-4)", padding: "20px 24px", maxWidth: 480 }}
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-1">
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Número de póliza</span>
            <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{numeroPoliza}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Plan contratado</span>
            <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{plan.nombre}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Fecha de pago</span>
            <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{fechaPago}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Próxima renovación</span>
            <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{proximaRenovacion}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Método de pago</span>
            <span className="body-regular flex items-center gap-1.5" style={{ color: "var(--gray-10)", fontWeight: 500 }}>
              <CreditCard size={14} style={{ color: "var(--gray-8)" }} />Visa •••• 4242
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Asistencia incluida</span>
            <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{asistencia.nombre}</span>
          </div>
        </div>

        <hr style={{ borderColor: "var(--gray-4)", margin: "16px 0" }} />

        <div className="flex items-center justify-between gap-4">
          <span className="body-bold" style={{ color: "var(--gray-10)" }}>Cobrado hoy:</span>
          <span className="title-tertiary-bold" style={{ color: "var(--navy)" }}>{formatCOPNumber(totalAnual)}</span>
        </div>
        <p className="body-small-regular" style={{ color: "var(--gray-8)", marginTop: 4, marginBottom: 0 }}>
          Volveremos a cobrar {formatCOPNumber(totalAnual)} el {proximaRenovacion}, mientras tu póliza
          siga activa.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <AppButton variant="secondary" bold onClick={onVerSeguros} className="order-2 md:order-none">
          <FileText size={15} /> Ver mis seguros
        </AppButton>
        <AppButton variant="primary" bold onClick={onFinalizar} className="order-1 md:order-none">
          Volver a Inicio
        </AppButton>
        {/* Acción secundaria: en mobile queda como link chico para no competir con las 2 principales */}
        <button
          onClick={() => setComprobanteEnviado(true)}
          className="body-bold inline-flex items-center gap-2 rounded-lg transition-colors order-3 max-md:body-small-regular"
          style={{
            cursor: "pointer",
            height: 40,
            padding: "0 16px",
            backgroundColor: "transparent",
            color: comprobanteEnviado ? "var(--green-status)" : "var(--navy)",
            border: `1.5px solid ${comprobanteEnviado ? "var(--green-status)" : "var(--navy)"}`,
          }}
        >
          {comprobanteEnviado ? <CircleCheck size={15} /> : <Download size={15} />}
          {comprobanteEnviado ? "Comprobante enviado" : "Descargar comprobante"}
        </button>
      </div>
    </div>
  );
}

// ─── Póliza comprada ──────────────────────────────────────────────────────────

/** Snapshot de la compra: no depende del catálogo vigente, así el detalle no cambia si luego se ajustan precios o coberturas. */
export interface PolizaComprada {
  id: string;
  numeroPoliza: string;
  inmuebleDireccion: string;
  planNombre: string;
  planPrecio: number;
  planCoberturas: Cobertura[];
  asistenciaNombre: string;
  asistenciaPrecio: number;
  asistenciaCategorias: CategoriaAsistencia[];
  adicionales: { label: string; precio: number }[];
  totalAnual: number;
  fechaPago: string;
  proximaRenovacion: string;
  estado: "activa" | "cancelacion-solicitada" | "cancelada";
  fechaSolicitudCancelacion?: string;
  motivoCancelacion?: string;
}

// ─── Cotizador ───────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
  onFinalizar: () => void;
  onComprar: (poliza: PolizaComprada) => void;
}

export function CotizadorHogar({ onBack, onFinalizar, onComprar }: Props) {
  // Desktop tiene 4 pasos: "Configura tu plan" junta inmueble + objetos, "Arma tu plan" junta
  // plan + asistencia. Mobile parte cada uno en su propia pantalla corta (6 en total).
  // mStep: 0 inmueble · 1 objetos · 2 plan · 3 asistencia · 4 confirma · 5 pagar.
  const [mStep, setMStep] = useState(0);
  const paso = [0, 0, 1, 1, 2, 3][mStep];
  /** Navegación desde desktop: salta al primer sub-paso mobile equivalente a ese paso. */
  const setPaso = (p: number) => setMStep([0, 2, 4, 5][p]);
  // Al cambiar de paso, sube al inicio del módulo (el scroll vive en el <main> del portal, no en window).
  const topRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [mStep]);
  const [numeroPoliza] = useState(() => "AL-" + Math.floor(100000 + Math.random() * 900000));
  const [fechaCompra] = useState(() => new Date());
  const fechaPagoStr = useMemo(() => formatFechaCorta(fechaCompra), [fechaCompra]);
  const proximaRenovacionStr = useMemo(() => {
    const d = new Date(fechaCompra);
    d.setFullYear(d.getFullYear() + 1);
    return formatFechaCorta(d);
  }, [fechaCompra]);
  // Sin inmueble preseleccionado: el usuario debe elegirlo explícitamente para avanzar.
  const [inmueble, setInmueble] = useState("");
  const [inmueblesData, setInmueblesData] = useState<Record<string, InmuebleCotizacion>>(INMUEBLES_COTIZACION);
  const [inmuebleOptions, setInmuebleOptions] = useState(INMUEBLE_OPTIONS);
  const cambiarInmueble = (id: string) => {
    // Un inmueble con póliza activa no se puede volver a asegurar: se bloquea antes de seleccionarlo.
    if (inmueblesData[id]?.polizaActiva) return;
    setInmueble(id);
    // Elegir un inmueble existente cierra el formulario de "nuevo inmueble" si estaba abierto.
    setAgregandoInmueble(false);
    // Si ya conocemos el canon de este inmueble (datosCompletos), lo precargamos (sirve para sugerir
    // montos a asegurar en el paso de objetos); si no, se deja en blanco para que el usuario lo ingrese.
    const d = inmueblesData[id];
    setCanonArrendamiento(d?.datosCompletos ? parseDigits(d.canon) : "");
    // Cambiar de inmueble vuelve a pedir la relación con el nuevo inmueble.
    setRelacionInmueble("");
  };

  /** Solo los inmuebles agregados desde el formulario del seguro (externo) se pueden eliminar. */
  const eliminarInmueble = (id: string) => {
    setInmuebleOptions((prev) => prev.filter((opt) => opt.value !== id));
    setInmueblesData((prev) => {
      const { [id]: _eliminado, ...resto } = prev;
      return resto;
    });
    if (inmueble === id) {
      setInmueble("");
      setCanonArrendamiento("");
      setRelacionInmueble("");
    }
    setDetalleInmuebleAbierto(false);
  };

  // Formulario para agregar un inmueble nuevo: es el formulario propio del seguro (no el de Alquilando),
  // así que solo pide lo que la aseguradora necesita para adaptar la cobertura.
  // Mientras está abierto se deselecciona el inmueble para no mostrar sus datos abajo.
  const [agregandoInmueble, setAgregandoInmueble] = useState(false);
  const [inmuebleAntesDeAgregar, setInmuebleAntesDeAgregar] = useState<string | null>(null);
  const [nuevoTipoDocumento, setNuevoTipoDocumento] = useState("");
  const [nuevoNumeroDocumento, setNuevoNumeroDocumento] = useState("");
  const [nuevoCiudad, setNuevoCiudad] = useState("");
  const [nuevoDireccion, setNuevoDireccion] = useState("");
  const [nuevoMetrosCuadrados, setNuevoMetrosCuadrados] = useState("");
  const [nuevoCanonArrendamiento, setNuevoCanonArrendamiento] = useState("");
  const [nuevoTipoInmueble, setNuevoTipoInmueble] = useState("");
  const [nuevoAnoConstruccion, setNuevoAnoConstruccion] = useState("");
  const [nuevoZona, setNuevoZona] = useState("");
  const [nuevoAceptaTerminos, setNuevoAceptaTerminos] = useState(false);
  const nuevoValido =
    nuevoTipoDocumento !== "" &&
    nuevoNumeroDocumento.trim() !== "" &&
    nuevoCiudad !== "" &&
    nuevoDireccion.trim() !== "" &&
    Number(nuevoMetrosCuadrados) > 0 &&
    Number(nuevoCanonArrendamiento) > 0 &&
    nuevoTipoInmueble !== "" &&
    nuevoAnoConstruccion !== "" &&
    nuevoZona !== "" &&
    nuevoAceptaTerminos;

  const abrirNuevoInmueble = () => {
    setInmuebleAntesDeAgregar(inmueble);
    setInmueble("");
    setAgregandoInmueble(true);
  };

  const resetNuevoInmueble = () => {
    setAgregandoInmueble(false);
    setNuevoTipoDocumento("");
    setNuevoNumeroDocumento("");
    setNuevoCiudad("");
    setNuevoDireccion("");
    setNuevoMetrosCuadrados("");
    setNuevoCanonArrendamiento("");
    setNuevoTipoInmueble("");
    setNuevoAnoConstruccion("");
    setNuevoZona("");
    setNuevoAceptaTerminos(false);
  };

  const nuevoCiudadLabel = CIUDADES_OPTIONS.find((c) => c.value === nuevoCiudad)?.label ?? "";

  // Coordenadas del inmueble nuevo: se derivan automáticamente de la dirección + ciudad
  // (simula geolocalización) apenas hay suficiente texto para ubicarlo, sin pedirle nada al usuario.
  const { lat: nuevoLat, lng: nuevoLng } = useMemo(
    () => coordenadasDesdeDireccion(nuevoDireccion, nuevoCiudadLabel),
    [nuevoDireccion, nuevoCiudadLabel],
  );
  const nuevoCoordenadas =
    `${nuevoLat.toFixed(6)}`.replace(".", ",") + " - " + `${nuevoLng.toFixed(6)}`.replace(".", ",");

  const cancelarNuevoInmueble = () => {
    if (inmuebleAntesDeAgregar) cambiarInmueble(inmuebleAntesDeAgregar);
    setInmuebleAntesDeAgregar(null);
    resetNuevoInmueble();
  };

  const guardarNuevoInmueble = () => {
    if (!nuevoValido) return;
    const id = `nuevo-${Date.now()}`;
    const nuevo: InmuebleCotizacion = {
      estrato: "—",
      canon: formatCOP(nuevoCanonArrendamiento),
      ciudad: nuevoCiudadLabel,
      direccion: nuevoDireccion.trim(),
      coordenadas: nuevoCoordenadas,
      // Este formulario ya pidió el canon de arrendamiento: no hace falta repetir el bloque de
      // "Completa los datos del inmueble" después.
      datosCompletos: true,
      externo: true,
      tipoDocumento: TIPOS_DOCUMENTO.find((t) => t.value === nuevoTipoDocumento)?.label,
      numeroDocumento: nuevoNumeroDocumento.trim(),
      metrosCuadrados: Number(nuevoMetrosCuadrados),
      tipoInmueble: TIPO_INMUEBLE_OPTIONS.find((t) => t.value === nuevoTipoInmueble)?.label,
      anoConstruccion: ANOS_CONSTRUCCION_OPTIONS.find((a) => a.value === nuevoAnoConstruccion)?.label,
      zona: ZONA_OPTIONS.find((z) => z.value === nuevoZona)?.label,
      lat: nuevoLat,
      lng: nuevoLng,
    };
    setInmueblesData((prev) => ({ ...prev, [id]: nuevo }));
    setInmuebleOptions((prev) => [...prev, { value: id, label: nuevo.direccion }]);
    cambiarInmueble(id);
    setInmuebleAntesDeAgregar(null);
    resetNuevoInmueble();
  };

  const [infoAdicional, setInfoAdicional] = useState("");
  const [zona, setZona] = useState("urbano");
  // Canon de arrendamiento se sigue guardando (viene con el inmueble o se recibe al agregarlo manualmente)
  // pero ya no se pide en el paso de "Completa los datos del inmueble".
  const [canonArrendamiento, setCanonArrendamiento] = useState("");
  // Relación del usuario con el inmueble: siempre obligatorio, sin importar el origen del inmueble.
  const [relacionInmueble, setRelacionInmueble] = useState("");
  // La API de la aseguradora exige tipo de inmueble, años de construcción y metros cuadrados
  // para tasar el riesgo, aunque el inmueble venga de Alquilando con datos incompletos.
  const [tipoInmueble, setTipoInmueble] = useState("");
  const [anoConstruccion, setAnoConstruccion] = useState("");
  const [metrosCuadradosInmueble, setMetrosCuadradosInmueble] = useState("");

  const [electronicosValor, setElectronicosValor] = useState("");
  const [enseresValor, setEnseresValor] = useState("");

  // Sin plan preseleccionado: el usuario debe elegirlo explícitamente para avanzar.
  const [planId, setPlanId] = useState("");
  const [adicionales, setAdicionales] = useState<Record<string, boolean>>(
    () => Object.fromEntries(COBERTURAS_ADICIONALES.map((c) => [c.id, c.defaultOn])),
  );
  const [asistenciaId, setAsistenciaId] = useState("s");
  const toggleAdicional = (id: string, v: boolean) => setAdicionales((prev) => ({ ...prev, [id]: v }));

  const datos = inmueble ? inmueblesData[inmueble] : undefined;
  const plan = planId ? PLANES.find((p) => p.id === planId) : undefined;

  const comprar = () => {
    if (!plan) return;
    onComprar({
      id: numeroPoliza,
      numeroPoliza,
      inmuebleDireccion: datos?.direccion ?? "",
      planNombre: plan.nombre,
      planPrecio: plan.precio,
      planCoberturas: plan.coberturas,
      asistenciaNombre: asistencia.nombre,
      asistenciaPrecio: asistencia.precio,
      asistenciaCategorias: asistencia.categorias,
      adicionales: adicionalesActivas.map((c) => ({ label: c.sidebarLabel, precio: c.precio })),
      totalAnual,
      fechaPago: fechaPagoStr,
      proximaRenovacion: proximaRenovacionStr,
      estado: "activa",
    });
    setPaso(3);
  };
  const asistencia = ASISTENCIAS.find((a) => a.id === asistenciaId)!;
  const adicionalesActivas = COBERTURAS_ADICIONALES.filter((c) => adicionales[c.id]);

  // 3 montos sugeridos por categoría, calculados como múltiplos del canon de arrendamiento que ya conocemos.
  const montosSugeridos = useMemo(() => {
    const base = Number(canonArrendamiento) || 0;
    if (base <= 0) return MONTOS_RAPIDOS_FALLBACK;
    return [10, 20, 40].map((mult) => String(Math.round((base * mult) / 100000) * 100000));
  }, [canonArrendamiento]);

  const total = useMemo(
    () => Number(electronicosValor || 0) + Number(enseresValor || 0),
    [electronicosValor, enseresValor],
  );

  const totalAnual = useMemo(
    () => (plan?.precio ?? 0) + asistencia.precio + adicionalesActivas.reduce((sum, c) => sum + c.precio, 0),
    [plan, asistencia, adicionalesActivas],
  );

  // Obligatorio siempre: quién es el usuario respecto al inmueble seleccionado. Si el inmueble
  // viene de Alquilando con datos incompletos, la API además exige tipo, años de construcción y m².
  const detallesCompletos = datos
    ? relacionInmueble !== "" &&
      (datos.datosCompletos || (tipoInmueble !== "" && anoConstruccion !== "" && Number(metrosCuadradosInmueble) > 0))
    : false;
  const objetosCompletos = Number(electronicosValor) > 0 && Number(enseresValor) > 0;
  const puedeContinuar = detallesCompletos && objetosCompletos;

  // Dice exactamente qué falta, en vez de un "completa todo" genérico.
  const faltantesInmueble = [
    !datos && "selecciona un inmueble",
    datos && !detallesCompletos && "datos del inmueble",
  ].filter(Boolean) as string[];
  const faltantesObjetos = [
    Number(electronicosValor) <= 0 && "valor de equipos electrónicos",
    Number(enseresValor) <= 0 && "valor de muebles y enseres",
  ].filter(Boolean) as string[];
  const faltantesPlan = [!planId && "selecciona un plan"].filter(Boolean) as string[];
  const faltantes = [...faltantesInmueble, ...faltantesObjetos];

  // La hoja de resumen mobile se abre tocando la barra fija inferior.
  const [resumenAbierto, setResumenAbierto] = useState(false);

  // Mobile: al pulsar "Continuar" en la pantalla de plan, primero se muestra el modal de coberturas
  // adicionales como un paso extra (opcional elegir alguna), y solo al cerrarlo se avanza a asistencia.
  const [mostrarPasoAdicionales, setMostrarPasoAdicionales] = useState(false);

  // Estado de los modales mobile del paso 1 (en desktop este contenido siempre va inline).
  // "Nuevo inmueble" reusa agregandoInmueble como flag de apertura del modal en mobile.
  const [detalleInmuebleAbierto, setDetalleInmuebleAbierto] = useState(false);

  // Detalle del resumen, compartido entre el aside de desktop y la hoja desplegable de mobile.
  const resumenDetalle = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Inmueble</span>
        <span className="body-small-regular text-right" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{datos?.direccion ?? "Sin seleccionar"}</span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="body-bold" style={{ color: "var(--navy)" }}>Objetos asegurables</span>
        <div className="flex items-center justify-between gap-4">
          <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>Equipos electrónicos</span>
          <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{formatCOP(electronicosValor) || "$ 0"}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>Muebles y enseres</span>
          <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{formatCOP(enseresValor) || "$ 0"}</span>
        </div>
      </div>

      {paso === 0 && (
        <>
          <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />
          <div className="flex items-center justify-between gap-4">
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>Total:</span>
            <span className="body-bold" style={{ color: "var(--navy)" }}>{total > 0 ? "$ " + total.toLocaleString("es-CO") : "$ 0"}</span>
          </div>
          <p className="disclamer" style={{ color: "var(--gray-8)", margin: 0 }}>
            Te respaldamos desde $10.000.000 hasta por $1.000.000.000. Este monto está destinado a proteger
            todos los objetos de las categorías seleccionadas.
          </p>
        </>
      )}

      {paso >= 1 && (
        <>
          {adicionalesActivas.length > 0 && (
            <div className="flex flex-col gap-2">
              <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />
              <span className="body-bold" style={{ color: "var(--navy)" }}>Coberturas adicionales</span>
              {adicionalesActivas.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-4">
                  <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{c.sidebarLabel}</span>
                  <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{formatCOPNumber(c.precio)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />
            <span className="body-bold" style={{ color: "var(--navy)" }}>{plan?.sugerido ? "Plan Sugerido" : "Tu plan"}</span>
            {plan ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{plan.nombre}</span>
                  <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{formatCOPNumber(plan.precio)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>
                    {asistencia.nombre}{asistencia.precio === 0 ? " (incluido)" : ""}
                  </span>
                  <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{formatCOPNumber(asistencia.precio)}</span>
                </div>
              </>
            ) : (
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Aún no has elegido un plan.</span>
            )}
          </div>

          <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />
          <div className="flex items-center justify-between gap-4">
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>Total anual (IVA incluido):</span>
            <span className="title-tertiary-bold" style={{ color: "var(--navy)" }}>{formatCOPNumber(totalAnual)}</span>
          </div>
        </>
      )}
    </>
  );

  /** Suffix visual (m²) superpuesto sobre un TextInput, sin tocar el kit component. */
  const metrosCuadradosInput = (value: string, onChange: (v: string) => void) => (
    <span className="relative inline-block w-full">
      <TextInput placeholder="0" value={value} onChange={(v) => onChange(v.replace(/\D/g, "").slice(0, 5))} className="w-full" />
      <span
        className="absolute body-small-regular pointer-events-none"
        style={{ right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--gray-8)" }}
      >
        m²
      </span>
    </span>
  );

  // Formulario "Nuevo inmueble": es el formulario propio del seguro (no el de Alquilando), así que
  // solo pide lo que la aseguradora necesita para adaptar la cobertura — no reusa los campos del
  // inmueble de Alquilando (estrato, canon, etc). Compartido entre el bloque inline de desktop y el Modal de mobile.
  const formularioNuevoInmueble = (
    <div className="flex flex-col gap-4">
      <Callout variant="info" title="Ingrese sus datos">
        Esto nos ayuda a adaptar su cobertura. Este inmueble se crea solo para este seguro: no queda
        vinculado a tu contrato de Alquilando.
      </Callout>
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <Field label="Tipo de documento" required>
          <SelectInput options={TIPOS_DOCUMENTO} value={nuevoTipoDocumento} onChange={setNuevoTipoDocumento} placeholder="Seleccione una opción" className="w-full" />
        </Field>
        <Field label="Número de documento" required>
          <TextInput placeholder="Digite aquí" value={nuevoNumeroDocumento} onChange={(v) => setNuevoNumeroDocumento(v.replace(/\D/g, ""))} />
        </Field>
        <Field label="Ciudad" required>
          <SelectInput options={CIUDADES_OPTIONS} value={nuevoCiudad} onChange={setNuevoCiudad} placeholder="Seleccione una opción" className="w-full" />
        </Field>
        <Field label="Dirección" required>
          <TextInput placeholder="Ej: Cra 1 #1-21" value={nuevoDireccion} onChange={setNuevoDireccion} />
        </Field>
        <Field label="Tipo de inmueble" required>
          <SelectInput options={TIPO_INMUEBLE_OPTIONS} value={nuevoTipoInmueble} onChange={setNuevoTipoInmueble} placeholder="Seleccione una opción" className="w-full" />
        </Field>
        <Field label="Años de construcción" required>
          <SelectInput options={ANOS_CONSTRUCCION_OPTIONS} value={nuevoAnoConstruccion} onChange={setNuevoAnoConstruccion} placeholder="Seleccione una opción" className="w-full" />
        </Field>
        <Field label="Zona" required>
          <SelectInput options={ZONA_OPTIONS} value={nuevoZona} onChange={setNuevoZona} placeholder="Seleccione una opción" className="w-full" />
        </Field>
        <Field label="Metros cuadrados de su vivienda" required>
          {metrosCuadradosInput(nuevoMetrosCuadrados, setNuevoMetrosCuadrados)}
        </Field>
        <Field label="Canon de arrendamiento (incluye administración si aplica)" required>
          <TextInput placeholder="$ 0" value={formatCOP(nuevoCanonArrendamiento)} onChange={(v) => setNuevoCanonArrendamiento(parseDigits(v))} />
        </Field>
      </div>

      <label className="flex items-start gap-3" style={{ cursor: "pointer" }}>
        <button
          type="button"
          role="checkbox"
          aria-checked={nuevoAceptaTerminos}
          onClick={() => setNuevoAceptaTerminos((v) => !v)}
          className="flex items-center justify-center rounded shrink-0"
          style={{
            width: 20, height: 20, marginTop: 1,
            border: `1.5px solid ${nuevoAceptaTerminos ? "var(--navy)" : "var(--gray-5)"}`,
            backgroundColor: nuevoAceptaTerminos ? "var(--navy)" : "#ffffff",
            cursor: "pointer",
          }}
        >
          {nuevoAceptaTerminos && <CircleCheck size={13} strokeWidth={2.5} style={{ color: "#ffffff" }} />}
        </button>
        <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>
          Acepto los <span style={{ color: "var(--navy)", textDecoration: "underline", fontWeight: 600 }}>Términos y Condiciones del Seguro de Hogar</span>
        </span>
      </label>

      <div className="flex items-center justify-end gap-3">
        <AppButton variant="secondary" onClick={cancelarNuevoInmueble}>Cancelar</AppButton>
        <AppButton variant="primary" bold disabled={!nuevoValido} onClick={guardarNuevoInmueble}>
          Guardar inmueble
        </AppButton>
      </div>
    </div>
  );

  return (
    <div ref={topRef} className={`flex flex-col gap-5 ${paso < 3 ? "max-md:pb-24" : ""}`} style={{ scrollMarginTop: 16 }}>
      {/* Volver — mismo patrón que los detalles del panel */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 body-bold w-fit"
        style={{ cursor: "pointer", color: "var(--navy)", background: "transparent" }}
      >
        <ArrowLeft size={16} /> Volver a Seguros
      </button>

      {/* Header */}
      <section
        className="rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 p-5 md:px-7 md:py-6"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)" }}
      >
        <div>
          <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>Seguro de Hogar</h1>
          <p className="body-regular" style={{ color: "var(--gray-9)", marginTop: 4 }}>
            Asegura tus artículos electrónicos, muebles y enseres contra daños o robo.
          </p>
        </div>
        <div
          className="flex items-center gap-2.5 shrink-0 pt-3 border-t md:pt-0 md:border-t-0 md:pl-6 md:border-l"
          style={{ borderColor: "var(--gray-3)" }}
        >
          <span className="disclamer shrink-0" style={{ color: "var(--gray-8)" }}>Respaldado por</span>
          <img src={logoSegurosBolivar} alt="Seguros Bolívar" style={{ height: 32, width: "auto" }} />
        </div>
      </section>

      {/* Progreso: barra delgada, fuera de las tarjetas de contenido para no robarles espacio */}
      <section
        className="rounded-lg px-4 md:px-7"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", paddingTop: 14, paddingBottom: 14 }}
      >
        <div className="max-md:hidden">
          <Stepper steps={PASOS} current={paso} />
        </div>
        <div className="md:hidden">
          <Stepper steps={MPASOS} current={mStep} />
        </div>
      </section>

      <div className="grid gap-5 items-start grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        {/* Columna principal */}
        <div className="flex flex-col gap-5 min-w-0">
          <section className={`rounded-lg flex flex-col gap-6 p-5 md:px-7 md:py-6 ${paso === 0 && mStep === 1 ? "max-md:hidden" : ""}`} style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)" }}>
            {paso === 0 && (
              <div className="flex flex-col gap-6">
                {/* Selección de inmueble — desktop: tarjetas completas, dividida en dos secciones */}
                <div className="flex flex-col gap-6 max-md:hidden">
                  <Callout variant="info" title="Solo podrás asegurar un inmueble por póliza">
                    Si deseas asegurar más de un inmueble, deberás realizar el proceso nuevamente para cada uno.
                  </Callout>

                  {/* Sección 1: inmuebles administrados en Alquilando, no se pueden eliminar */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Inmuebles con Alquilando</h2>
                      <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
                        Elige uno de los inmuebles que ya administras en la plataforma.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4" role="radiogroup" aria-label="Inmueble con Alquilando">
                      {inmuebleOptions.filter((opt) => !inmueblesData[opt.value].externo).map((opt) => {
                        const d = inmueblesData[opt.value];
                        const selected = inmueble === opt.value;
                        return (
                          <button
                            key={opt.value}
                            role="radio"
                            aria-checked={selected}
                            aria-disabled={d.polizaActiva}
                            disabled={d.polizaActiva}
                            onClick={() => cambiarInmueble(opt.value)}
                            className="relative rounded-lg flex flex-col gap-3 text-left transition-colors"
                            style={{
                              cursor: d.polizaActiva ? "not-allowed" : "pointer",
                              padding: "16px 18px",
                              border: selected ? "1.5px solid var(--navy)" : "1px solid var(--gray-4)",
                              backgroundColor: selected ? "var(--navy-light)" : "#ffffff",
                              opacity: d.polizaActiva ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => { if (!selected && !d.polizaActiva) e.currentTarget.style.borderColor = "var(--gray-6)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = selected ? "var(--navy)" : "var(--gray-4)"; }}
                          >
                            {d.polizaActiva ? (
                              <span className="absolute" style={{ top: 14, right: 14 }}>
                                <StatusBadge label="Póliza activa" variant="active" />
                              </span>
                            ) : selected && (
                              <CircleCheck size={18} strokeWidth={2} className="absolute" style={{ top: 14, right: 14, color: "var(--navy)" }} />
                            )}
                            <div className="flex items-center gap-3" style={{ paddingRight: 24 }}>
                              <div
                                className="flex items-center justify-center rounded-full shrink-0"
                                style={{ width: 38, height: 38, backgroundColor: selected ? "#ffffff" : "var(--navy-light)" }}
                              >
                                <Home size={17} strokeWidth={1.8} style={{ color: "var(--navy)" }} />
                              </div>
                              <div className="flex flex-col min-w-0 gap-1">
                                <span className="body-bold truncate" style={{ color: "var(--gray-10)" }}>{d.direccion}</span>
                                <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{d.ciudad}</span>
                              </div>
                            </div>
                            {d.polizaActiva && (
                              <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>
                                Este inmueble ya cuenta con una póliza de seguros.
                              </span>
                            )}
                            <hr className="w-full" style={{ borderColor: selected ? "rgba(0,0,0,0.08)" : "var(--gray-3)", margin: 0 }} />
                            <div className="flex items-center gap-6 flex-wrap">
                              <div className="flex flex-col">
                                <span className="disclamer" style={{ color: "var(--gray-8)" }}>Estrato</span>
                                <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{d.estrato}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="disclamer" style={{ color: "var(--gray-8)" }}>Canon mensual</span>
                                <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{d.canon}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="disclamer" style={{ color: "var(--gray-8)" }}>Tipo</span>
                                <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>Apartamento</span>
                              </div>
                            </div>
                            {selected && (
                              <div className="flex items-center justify-between gap-4 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.6)", padding: "8px 12px" }}>
                                <span className="disclamer" style={{ color: "var(--gray-8)" }}>Coordenadas</span>
                                <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{d.coordenadas}</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

                  {/* Sección 2: inmuebles creados solo para esta póliza, se pueden eliminar */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Agregar inmueble para asegurar</h2>
                      <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
                        ¿No ves tu inmueble en la lista de arriba? Regístralo aquí solo para esta póliza.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4" role="radiogroup" aria-label="Inmueble agregado para esta póliza">
                      {inmuebleOptions.filter((opt) => inmueblesData[opt.value].externo).map((opt) => {
                        const d = inmueblesData[opt.value];
                        const selected = inmueble === opt.value;
                        return (
                          <button
                            key={opt.value}
                            role="radio"
                            aria-checked={selected}
                            onClick={() => cambiarInmueble(opt.value)}
                            className="relative rounded-lg flex flex-col gap-3 text-left transition-colors"
                            style={{
                              cursor: "pointer",
                              padding: "16px 18px",
                              border: selected ? "1.5px solid var(--navy)" : "1px solid var(--gray-4)",
                              backgroundColor: selected ? "var(--navy-light)" : "#ffffff",
                            }}
                            onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = "var(--gray-6)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = selected ? "var(--navy)" : "var(--gray-4)"; }}
                          >
                            {selected && (
                              <CircleCheck size={18} strokeWidth={2} className="absolute" style={{ top: 14, right: 14, color: "var(--navy)" }} />
                            )}
                            <span
                              role="button"
                              tabIndex={0}
                              title="Eliminar inmueble"
                              aria-label="Eliminar inmueble"
                              onClick={(e) => { e.stopPropagation(); eliminarInmueble(opt.value); }}
                              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); eliminarInmueble(opt.value); } }}
                              className="absolute flex items-center justify-center rounded-full transition-colors"
                              style={{ top: 14, right: selected ? 44 : 14, width: 28, height: 28, color: "var(--gray-8)", cursor: "pointer" }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--destructive)"; e.currentTarget.style.backgroundColor = "var(--red-status-light)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--gray-8)"; e.currentTarget.style.backgroundColor = "transparent"; }}
                            >
                              <Trash2 size={15} strokeWidth={1.8} />
                            </span>
                            <div className="flex items-center gap-3" style={{ paddingRight: 24 }}>
                              <div
                                className="flex items-center justify-center rounded-full shrink-0"
                                style={{ width: 38, height: 38, backgroundColor: selected ? "#ffffff" : "var(--navy-light)" }}
                              >
                                <Home size={17} strokeWidth={1.8} style={{ color: "var(--navy)" }} />
                              </div>
                              <div className="flex flex-col min-w-0 gap-1">
                                <span className="body-bold truncate" style={{ color: "var(--gray-10)" }}>{d.direccion}</span>
                                <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{d.ciudad}</span>
                                <StatusBadge label="Agregado para este seguro" variant="pending" />
                              </div>
                            </div>
                            <hr className="w-full" style={{ borderColor: selected ? "rgba(0,0,0,0.08)" : "var(--gray-3)", margin: 0 }} />
                            <div className="flex items-center gap-6 flex-wrap">
                              <div className="flex flex-col">
                                <span className="disclamer" style={{ color: "var(--gray-8)" }}>Estrato</span>
                                <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{d.estrato}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="disclamer" style={{ color: "var(--gray-8)" }}>Canon mensual</span>
                                <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{d.canon}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="disclamer" style={{ color: "var(--gray-8)" }}>Tipo</span>
                                <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>Apartamento</span>
                              </div>
                            </div>
                            {selected && (
                              <div className="flex items-center justify-between gap-4 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.6)", padding: "8px 12px" }}>
                                <span className="disclamer" style={{ color: "var(--gray-8)" }}>Coordenadas</span>
                                <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{d.coordenadas}</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                      {/* Card para agregar un inmueble que no está en la lista */}
                      <button
                        onClick={abrirNuevoInmueble}
                        className="rounded-lg flex flex-col items-center justify-center gap-2 transition-colors"
                        style={{
                          cursor: "pointer",
                          padding: "16px 18px",
                          minHeight: 120,
                          border: "1.5px dashed var(--gray-5)",
                          backgroundColor: agregandoInmueble ? "var(--navy-light)" : "#ffffff",
                          color: "var(--navy)",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--gray-5)"; }}
                      >
                        <div
                          className="flex items-center justify-center rounded-full"
                          style={{ width: 38, height: 38, backgroundColor: "var(--navy-light)" }}
                        >
                          <Plus size={17} strokeWidth={1.8} style={{ color: "var(--navy)" }} />
                        </div>
                        <span className="body-bold">Agregar nuevo inmueble</span>
                        <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>
                          ¿No ves tu inmueble? Regístralo aquí.
                        </span>
                      </button>
                    </div>

                    {agregandoInmueble && (
                      <div
                        className="rounded-lg flex flex-col gap-4"
                        style={{ border: "1px solid var(--gray-4)", backgroundColor: "var(--gray-1)", padding: "18px 20px" }}
                      >
                        <h3 className="body-bold" style={{ color: "var(--navy)" }}>Nuevo inmueble</h3>
                        {formularioNuevoInmueble}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selección de inmueble — mobile: lista compacta, el resto va en modales. Pantalla propia (mStep 0). Dividida en dos secciones. */}
                <div className={`flex flex-col gap-4 md:hidden ${mStep !== 0 ? "max-md:hidden" : ""}`}>
                  <Callout variant="info" title="Solo podrás asegurar un inmueble por póliza">
                    Si deseas asegurar más de un inmueble, deberás realizar el proceso nuevamente para cada uno.
                  </Callout>

                  {/* Sección 1: inmuebles administrados en Alquilando, no se pueden eliminar */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Inmuebles con Alquilando</h2>
                      <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
                        Elige uno de los inmuebles que ya administras en la plataforma.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2" role="radiogroup" aria-label="Inmueble con Alquilando">
                      {inmuebleOptions.filter((opt) => !inmueblesData[opt.value].externo).map((opt) => {
                        const d = inmueblesData[opt.value];
                        const selected = inmueble === opt.value;
                        return (
                          <button
                            key={opt.value}
                            role="radio"
                            aria-checked={selected}
                            aria-disabled={d.polizaActiva}
                            disabled={d.polizaActiva}
                            onClick={() => cambiarInmueble(opt.value)}
                            className="relative rounded-lg flex items-center gap-3 text-left transition-colors"
                            style={{
                              cursor: d.polizaActiva ? "not-allowed" : "pointer",
                              padding: "12px 14px",
                              border: selected ? "1.5px solid var(--navy)" : "1px solid var(--gray-4)",
                              backgroundColor: selected ? "var(--navy-light)" : "#ffffff",
                              opacity: d.polizaActiva ? 0.6 : 1,
                            }}
                          >
                            <div
                              className="flex items-center justify-center rounded-full shrink-0"
                              style={{ width: 34, height: 34, backgroundColor: selected ? "#ffffff" : "var(--navy-light)" }}
                            >
                              <Home size={15} strokeWidth={1.8} style={{ color: "var(--navy)" }} />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1 gap-1">
                              <span className="body-bold truncate" style={{ color: "var(--gray-10)" }}>{d.direccion}</span>
                              <span className="body-small-regular truncate" style={{ color: "var(--gray-9)" }}>{d.ciudad}</span>
                              {d.polizaActiva && (
                                <span className="disclamer" style={{ color: "var(--gray-8)" }}>
                                  Este inmueble ya cuenta con una póliza de seguros.
                                </span>
                              )}
                            </div>
                            {d.polizaActiva ? (
                              <StatusBadge label="Póliza activa" variant="active" />
                            ) : selected && (
                              <CircleCheck size={18} strokeWidth={2} className="shrink-0" style={{ color: "var(--navy)" }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

                  {/* Sección 2: inmuebles creados solo para esta póliza, se pueden eliminar */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Agregar inmueble para asegurar</h2>
                      <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
                        ¿No ves tu inmueble arriba? Regístralo aquí solo para esta póliza.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2" role="radiogroup" aria-label="Inmueble agregado para esta póliza">
                      {inmuebleOptions.filter((opt) => inmueblesData[opt.value].externo).map((opt) => {
                        const d = inmueblesData[opt.value];
                        const selected = inmueble === opt.value;
                        return (
                          <button
                            key={opt.value}
                            role="radio"
                            aria-checked={selected}
                            onClick={() => cambiarInmueble(opt.value)}
                            className="relative rounded-lg flex items-center gap-3 text-left transition-colors"
                            style={{
                              cursor: "pointer",
                              padding: "12px 14px",
                              border: selected ? "1.5px solid var(--navy)" : "1px solid var(--gray-4)",
                              backgroundColor: selected ? "var(--navy-light)" : "#ffffff",
                            }}
                          >
                            <div
                              className="flex items-center justify-center rounded-full shrink-0"
                              style={{ width: 34, height: 34, backgroundColor: selected ? "#ffffff" : "var(--navy-light)" }}
                            >
                              <Home size={15} strokeWidth={1.8} style={{ color: "var(--navy)" }} />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1 gap-1">
                              <span className="body-bold truncate" style={{ color: "var(--gray-10)" }}>{d.direccion}</span>
                              <span className="body-small-regular truncate" style={{ color: "var(--gray-9)" }}>{d.ciudad}</span>
                              <StatusBadge label="Agregado para este seguro" variant="pending" />
                            </div>
                            <span
                              role="button"
                              tabIndex={0}
                              title="Eliminar inmueble"
                              aria-label="Eliminar inmueble"
                              onClick={(e) => { e.stopPropagation(); eliminarInmueble(opt.value); }}
                              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); eliminarInmueble(opt.value); } }}
                              className="flex items-center justify-center rounded-full shrink-0 transition-colors"
                              style={{ width: 30, height: 30, color: "var(--gray-8)", cursor: "pointer" }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--destructive)"; e.currentTarget.style.backgroundColor = "var(--red-status-light)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--gray-8)"; e.currentTarget.style.backgroundColor = "transparent"; }}
                            >
                              <Trash2 size={15} strokeWidth={1.8} />
                            </span>
                            {selected && (
                              <CircleCheck size={18} strokeWidth={2} className="shrink-0" style={{ color: "var(--navy)" }} />
                            )}
                          </button>
                        );
                      })}
                      <button
                        onClick={abrirNuevoInmueble}
                        className="rounded-lg flex items-center gap-3 transition-colors"
                        style={{ cursor: "pointer", padding: "12px 14px", border: "1.5px dashed var(--gray-5)", color: "var(--navy)" }}
                      >
                        <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 34, height: 34, backgroundColor: "var(--navy-light)" }}>
                          <Plus size={15} strokeWidth={1.8} style={{ color: "var(--navy)" }} />
                        </div>
                        <span className="body-bold">Agregar nuevo inmueble</span>
                      </button>
                    </div>
                  </div>

                  {datos && (
                    <LinkText size="small" onClick={() => setDetalleInmuebleAbierto(true)}>Ver detalles del inmueble</LinkText>
                  )}

                  <Modal open={detalleInmuebleAbierto} onClose={() => setDetalleInmuebleAbierto(false)} title="Detalles del inmueble">
                    {datos && (
                      <div className="flex flex-col gap-3">
                        {datos.externo && (
                          <div className="flex flex-col gap-1.5 items-start">
                            <StatusBadge label="Agregado para este seguro" variant="pending" />
                            <span className="disclamer" style={{ color: "var(--gray-8)" }}>No está vinculado a tu contrato de Alquilando.</span>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="disclamer" style={{ color: "var(--gray-8)" }}>Dirección</span>
                          <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{datos.direccion}, {datos.ciudad}</span>
                        </div>
                        {datos.externo ? (
                          <div className="flex items-center gap-6 flex-wrap">
                            <div className="flex flex-col">
                              <span className="disclamer" style={{ color: "var(--gray-8)" }}>Tipo de documento</span>
                              <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{datos.tipoDocumento}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="disclamer" style={{ color: "var(--gray-8)" }}>Número de documento</span>
                              <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{datos.numeroDocumento}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="disclamer" style={{ color: "var(--gray-8)" }}>Metros cuadrados</span>
                              <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{datos.metrosCuadrados} m²</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="disclamer" style={{ color: "var(--gray-8)" }}>Canon de arrendamiento</span>
                              <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{datos.canon}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-6 flex-wrap">
                            <div className="flex flex-col">
                              <span className="disclamer" style={{ color: "var(--gray-8)" }}>Estrato</span>
                              <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{datos.estrato}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="disclamer" style={{ color: "var(--gray-8)" }}>Canon mensual</span>
                              <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{datos.canon}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="disclamer" style={{ color: "var(--gray-8)" }}>Tipo</span>
                              <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>Apartamento</span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-4 rounded-lg" style={{ backgroundColor: "var(--gray-1)", padding: "8px 12px" }}>
                          <span className="disclamer" style={{ color: "var(--gray-8)" }}>Coordenadas</span>
                          <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{datos.coordenadas}</span>
                        </div>
                        {datos.externo && (
                          <div className="flex justify-end">
                            <AppButton variant="secondary" onClick={() => eliminarInmueble(inmueble)}>
                              <Trash2 size={15} /> Eliminar inmueble
                            </AppButton>
                          </div>
                        )}
                      </div>
                    )}
                  </Modal>

                  <Modal open={agregandoInmueble} onClose={cancelarNuevoInmueble} title="Nuevo inmueble">
                    {formularioNuevoInmueble}
                  </Modal>
                </div>

                {/* Datos del inmueble: en mobile es parte de la pantalla de inmueble (mStep 0), no de la de objetos. */}
                {datos && (
                  <div className={`flex flex-col gap-6 ${mStep !== 0 ? "max-md:hidden" : ""}`}>
                    <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Completa los datos del inmueble</h2>
                          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
                            Completa los campos marcados con
                            <span style={{ color: "var(--destructive)" }}> *</span> para poder continuar.
                          </p>
                        </div>
                        {detallesCompletos
                          ? <StatusBadge label="Completado" variant="active" />
                          : <StatusBadge label="Requerido" variant="pending" />}
                      </div>

                      {!datos.datosCompletos && (
                        <Callout variant="info" title="¿Por qué te pedimos esto?">
                          Necesitamos estos datos para crear tu póliza: la aseguradora los usa para tasar el
                          riesgo de tu inmueble.
                        </Callout>
                      )}

                      {/* Obligatorio para todo inmueble, sin importar si viene de Alquilando o fue agregado manualmente */}
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-sm:grid-cols-1">
                        <Field label="¿Quién eres respecto a este inmueble?" required>
                          <SelectInput
                            options={RELACION_INMUEBLE_OPTIONS}
                            value={relacionInmueble}
                            onChange={setRelacionInmueble}
                            placeholder="Seleccione una opción"
                            className="w-full"
                          />
                        </Field>
                        {!datos.datosCompletos && (
                          <>
                            {/* La API de la aseguradora exige estos campos para tasar el riesgo: no vienen en los
                                datos originales de Alquilando cuando el inmueble está incompleto. */}
                            <Field label="Tipo de inmueble" required>
                              <SelectInput options={TIPO_INMUEBLE_OPTIONS} value={tipoInmueble} onChange={setTipoInmueble} placeholder="Seleccione una opción" className="w-full" />
                            </Field>
                            <Field label="Años de construcción" required>
                              <SelectInput options={ANOS_CONSTRUCCION_OPTIONS} value={anoConstruccion} onChange={setAnoConstruccion} placeholder="Seleccione una opción" className="w-full" />
                            </Field>
                            <Field label="Metros cuadrados" required>
                              {metrosCuadradosInput(metrosCuadradosInmueble, setMetrosCuadradosInmueble)}
                            </Field>
                            <Field label="Zona" required>
                              <SelectInput options={ZONA_OPTIONS} value={zona} onChange={setZona} className="w-full" />
                            </Field>
                            <Field label="Información adicional del inmueble">
                              <TextInput placeholder="Torre, piso, apto" value={infoAdicional} onChange={setInfoAdicional} className="w-full" />
                            </Field>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {paso === 1 && (() => {
              // Ambas variantes reciben exactamente las mismas props: cambiar LAYOUT_PASO_2 no toca el estado del flujo.
              const PasoDosLayout = LAYOUT_PASO_2 === "figma" ? ArmaTuPlanFigma : ArmaTuPlan;
              return (
                <PasoDosLayout
                  planId={planId}
                  onPlan={setPlanId}
                  adicionales={adicionales}
                  onToggleAdicional={toggleAdicional}
                  asistenciaId={asistenciaId}
                  onAsistencia={setAsistenciaId}
                  onContinuar={() => setPaso(2)}
                  vistaMobile={mStep === 2 ? "plan" : "asistencia"}
                  mostrarPasoAdicionales={mostrarPasoAdicionales}
                  onContinuarDesdeAdicionales={() => { setMostrarPasoAdicionales(false); setMStep(3); }}
                />
              );
            })()}

            {paso === 2 && (
              <ConfirmaTuPlan
                plan={plan!}
                adicionalesActivas={adicionalesActivas}
                asistencia={asistencia}
                titular={{ nombre: "Nelson Diaz", correo: "nelson.diaz@email.com" }}
              />
            )}

            {paso === 3 && (
              <PagoExitoso
                plan={plan!}
                asistencia={asistencia}
                totalAnual={totalAnual}
                numeroPoliza={numeroPoliza}
                fechaPago={fechaPagoStr}
                proximaRenovacion={proximaRenovacionStr}
                onFinalizar={onFinalizar}
                onVerSeguros={onBack}
              />
            )}
          </section>

          {paso === 0 && (
            <section className={`rounded-lg flex flex-col gap-6 p-5 md:px-7 md:py-6 ${mStep !== 1 ? "max-md:hidden" : ""}`} style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)" }}>
              <div className="flex flex-col gap-3">
                <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Ahora, asegura tus objetos personales</h2>
                <p className="body-small-regular" style={{ color: "var(--gray-10)", margin: 0 }}>
                  Ambas categorías hacen parte de tu póliza: indícanos el valor a proteger en cada una.
                </p>
                {/* Guía de 3 pasos: chrome decorativo, se oculta en mobile para acortar el paso */}
                <div className="items-center gap-2 flex-wrap hidden md:flex">
                  {["Ingresa el valor de cada categoría", "Revisa el total de tu protección", "Continúa con tu plan"].map((p, i) => (
                    <div key={p} className="flex items-center gap-2">
                      {i > 0 && <span style={{ color: "var(--gray-6)" }}>→</span>}
                      <span className="tags inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ backgroundColor: "var(--navy-light)", color: "var(--navy)" }}>
                        <span
                          className="inline-flex items-center justify-center rounded-full"
                          style={{ width: 16, height: 16, backgroundColor: "var(--navy)", color: "#ffffff", fontSize: 10, fontWeight: 700 }}
                        >
                          {i + 1}
                        </span>
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <CategoriaAsegurable
                icon={Tv}
                titulo="Equipos electrónicos"
                descripcion="TV, computadores, consolas, neveras y más."
                valor={electronicosValor}
                onValor={setElectronicosValor}
                listaTitulo="Objetos cubiertos por el seguro:"
                objetosBase={ELECTRONICOS_BASE}
                objetosExtra={ELECTRONICOS_EXTRA}
                montosRapidos={montosSugeridos}
              />

              <CategoriaAsegurable
                icon={Sofa}
                titulo="Muebles y enseres"
                descripcion="Muebles, ropa, decoración y utensilios de cocina (sin contar los electrónicos)."
                valor={enseresValor}
                onValor={setEnseresValor}
                listaTitulo="¿Qué se considera muebles y enseres?"
                objetosBase={ENSERES_BASE}
                objetosExtra={ENSERES_EXTRA}
                montosRapidos={montosSugeridos}
              />

              {/* Resumen del paso + acción: en desktop siempre visible; en mobile ya lo muestra la barra fija inferior */}
              <div
                className="flex items-center justify-between gap-4 flex-wrap rounded-lg max-md:hidden"
                style={{ backgroundColor: "var(--gray-1)", border: "1px solid var(--gray-4)", padding: "14px 18px" }}
              >
                <div className="flex flex-col">
                  <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Total asegurado</span>
                  <span className="title-tertiary-bold" style={{ color: puedeContinuar ? "var(--navy)" : "var(--gray-7)" }}>
                    {total > 0 ? "$ " + total.toLocaleString("es-CO") : "$ 0"}
                  </span>
                </div>
                <div className="flex items-center gap-4 max-md:hidden">
                  {!puedeContinuar && (
                    <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
                      {faltantes.length > 0 ? `Te falta: ${faltantes.join(", ")}.` : "Completa la información para continuar."}
                    </span>
                  )}
                  <AppButton variant="primary" bold disabled={!puedeContinuar} onClick={() => setPaso(1)}>
                    Continuar
                  </AppButton>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Resumen sticky (en mobile lo reemplaza la barra fija inferior) */}
        <aside className="rounded-lg flex-col gap-4 sticky top-6 hidden md:flex" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}>
          <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Así va tu protección</h2>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", margin: 0 }}>
            Tendrás cobertura continua, hasta que decidas cancelar el seguro.
          </p>

          {resumenDetalle}

          {paso === 0 && (
            <AppButton variant="primary" bold fullWidth disabled={!puedeContinuar} onClick={() => setPaso(1)}>
              Continuar
            </AppButton>
          )}

          {paso === 1 && (
            <AppButton variant="primary" bold fullWidth disabled={!planId} onClick={() => setPaso(2)}>
              Continuar
            </AppButton>
          )}

          {paso === 2 && (
            <div className="flex items-center justify-between gap-4">
              <LinkText size="small" icon="chevron" onClick={() => setPaso(1)}>Cambiar plan</LinkText>
              <AppButton variant="primary" bold onClick={comprar}>
                <CreditCard size={15} /> Ir a pagar
              </AppButton>
            </div>
          )}
        </aside>
      </div>

      {/* Barra de acción fija en mobile: total del paso + CTA, sobre el bottom nav del portal.
          Tocar la zona del total despliega el resumen completo (el mismo del aside de desktop). */}
      {paso < 3 && (
        <div
          className="md:hidden fixed left-0 right-0 z-30 flex flex-col"
          style={{
            bottom: "calc(62px + env(safe-area-inset-bottom))",
            backgroundColor: "#ffffff",
            borderTop: "1px solid var(--gray-4)",
            boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
          }}
        >
          {resumenAbierto && (
            <div
              className="flex flex-col gap-4 overflow-y-auto"
              style={{ maxHeight: "55vh", padding: "16px 20px", borderBottom: "1px solid var(--gray-4)" }}
            >
              <div>
                <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Así va tu protección</h2>
                <p className="body-small-regular" style={{ color: "var(--gray-9)", margin: "2px 0 0" }}>
                  Tendrás cobertura continua, hasta que decidas cancelar el seguro.
                </p>
              </div>
              {resumenDetalle}
              {paso === 2 && (
                <LinkText size="small" icon="chevron" onClick={() => { setResumenAbierto(false); setPaso(1); }}>
                  Cambiar plan
                </LinkText>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-3" style={{ padding: "10px 16px" }}>
            <button
              onClick={() => setResumenAbierto((v) => !v)}
              className="flex flex-col min-w-0 text-left"
              style={{ backgroundColor: "transparent", border: "none", cursor: "pointer", padding: 0 }}
            >
              <span className="disclamer flex items-center gap-1" style={{ color: "var(--gray-8)" }}>
                {mStep === 0 ? "Inmueble a asegurar" : mStep === 1 ? "Total asegurado" : "Total anual"}
                {resumenAbierto ? <ChevronDown size={13} strokeWidth={2} /> : <ChevronUp size={13} strokeWidth={2} />}
              </span>
              {mStep === 0 ? (
                <span className="body-bold truncate w-full" style={{ color: "var(--navy)" }}>
                  {datos?.direccion ?? "Sin seleccionar"}
                </span>
              ) : (
                <span className="title-tertiary-bold flex items-center gap-1.5" style={{ color: "var(--navy)" }}>
                  {mStep === 1 ? (total > 0 ? "$ " + total.toLocaleString("es-CO") : "$ 0") : formatCOPNumber(totalAnual)}
                </span>
              )}
              {mStep === 0 && faltantesInmueble.length > 0 && (
                <span className="disclamer truncate w-full" style={{ color: "var(--orange-status)" }}>
                  Te falta: {faltantesInmueble.join(", ")}
                </span>
              )}
              {mStep === 1 && faltantesObjetos.length > 0 && (
                <span className="disclamer truncate w-full" style={{ color: "var(--orange-status)" }}>
                  Te falta: {faltantesObjetos.join(", ")}
                </span>
              )}
              {mStep === 2 && (
                plan
                  ? <span className="disclamer" style={{ color: "var(--gray-8)" }}>IVA incluido · Plan {plan.nombre}</span>
                  : (
                    <span className="disclamer truncate w-full" style={{ color: "var(--orange-status)" }}>
                      Te falta: {faltantesPlan.join(", ")}
                    </span>
                  )
              )}
              {mStep >= 3 && (
                <span className="disclamer" style={{ color: "var(--gray-8)" }}>IVA incluido · {asistencia.nombre}</span>
              )}
            </button>
            <div className="shrink-0 flex items-center gap-2">
              {mStep > 0 && (
                <button
                  title="Paso anterior"
                  onClick={() => setMStep(mStep - 1)}
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: 40, height: 40, border: "1px solid var(--gray-5)", backgroundColor: "#ffffff", color: "var(--navy)", cursor: "pointer" }}
                >
                  <ArrowLeft size={17} strokeWidth={1.8} />
                </button>
              )}
              {mStep === 0 && (
                <AppButton variant="primary" bold disabled={faltantesInmueble.length > 0} onClick={() => setMStep(1)}>
                  Continuar
                </AppButton>
              )}
              {mStep === 1 && (
                <AppButton variant="primary" bold disabled={faltantesObjetos.length > 0} onClick={() => setMStep(2)}>
                  Continuar
                </AppButton>
              )}
              {mStep === 2 && (
                <AppButton variant="primary" bold disabled={!planId} onClick={() => setMostrarPasoAdicionales(true)}>Continuar</AppButton>
              )}
              {mStep === 3 && (
                <AppButton variant="primary" bold onClick={() => setMStep(4)}>Continuar</AppButton>
              )}
              {mStep === 4 && (
                <AppButton variant="primary" bold onClick={comprar}>
                  <CreditCard size={15} /> Ir a pagar
                </AppButton>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
