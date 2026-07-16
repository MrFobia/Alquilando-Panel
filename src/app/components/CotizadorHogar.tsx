import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, CircleCheck, Tv, Sofa, ShieldCheck, Home, Plus,
  Flame, HeartPulse, Lock, PawPrint, Wrench, Hammer, PackageCheck, Award,
  Receipt, Mail, CalendarClock, CreditCard, Download, FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Stepper } from "./kit/Stepper";
import { SelectInput } from "./kit/SelectInput";
import { TextInput } from "./kit/TextInput";
import { StatusBadge } from "./kit/StatusBadge";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { ToggleSwitch } from "./kit/ToggleSwitch";
import logoSegurosBolivar from "../../assets/logo-seguros-bolivar.png";

/**
 * Cotizador del seguro de hogar del portal del inquilino.
 * Usa solo tokens (--navy, --navy-light…): dentro del portal renderiza púrpura,
 * sin tocar los colores del panel de inmobiliaria.
 */

/** Campo de formulario con el mismo patrón de labels del panel (CrearContrato). */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>
        {label}{required && <span style={{ color: "var(--destructive)" }}> *</span>}
      </span>
      {children}
    </label>
  );
}

const PASOS = [
  { id: "configura", label: "Configura tu plan" },
  { id: "arma", label: "Arma tu plan" },
  { id: "confirma", label: "Confirma tu plan" },
  { id: "pagar", label: "Pagar" },
];

interface InmuebleCotizacion {
  estrato: string; canon: string; ciudad: string; direccion: string; coordenadas: string;
  /** Si es false, ya tenemos todos los datos del inmueble: no hace falta pedirle nada más al usuario. */
  datosCompletos: boolean;
  lat: number; lng: number;
}

const INMUEBLES_COTIZACION: Record<string, InmuebleCotizacion> = {
  "carrera-23": { estrato: "3", canon: "$1.400.000", ciudad: "Bogotá", direccion: "Carrera 23 # 45 - 34 sur", coordenadas: "4,593874 - -74,129384", datosCompletos: false, lat: 4.593874, lng: -74.129384 },
  "calle-80": { estrato: "4", canon: "$2.150.000", ciudad: "Bogotá", direccion: "Calle 80 # 12 - 08, apto 502", coordenadas: "4,668350 - -74,056420", datosCompletos: true, lat: 4.668350, lng: -74.056420 },
};

const INMUEBLE_OPTIONS = [
  { value: "carrera-23", label: "Carrera 23 # 45 - 34 sur" },
  { value: "calle-80", label: "Calle 80 # 12 - 08, apto 502" },
];

const ZONA_OPTIONS = [
  { value: "urbano", label: "Urbano" },
  { value: "rural", label: "Rural" },
];

const ELECTRONICOS_BASE = ["Televisores", "Computadores", "Neveras", "Objetos inteligentes", "Estufas", "Equipos de sonido"];
const ELECTRONICOS_EXTRA = ["Consolas de videojuegos", "Tablets", "Cámaras fotográficas", "Lavadoras y secadoras"];
const ENSERES_BASE = ["Muebles", "Camas", "Libros", "Armarios", "Ropa", "Cortinas"];
const ENSERES_EXTRA = ["Vajillas y utensilios de cocina", "Tapetes y decoración", "Colchones", "Bicicletas"];

// ─── Planes de suscripción ───────────────────────────────────────────────────

export interface Cobertura {
  titulo: string;
  descripcion: string;
}

const COBERTURAS_BASIC: Cobertura[] = [
  { titulo: "Daños por incendio o daños por agua internos", descripcion: "Cubre daños que se originen por incendios, explosiones y agua al interior del inmueble (Ej. tubos rotos)." },
  { titulo: "Daños por agua de origen exterior", descripcion: "Cubre daños causados a la vivienda por lluvias, huracanes, vientos fuertes o granizadas." },
  { titulo: "Daños y pérdidas por disturbios sociales", descripcion: "Protegemos tu hogar ante alteraciones del orden público, huelgas o disturbios." },
  { titulo: "Robo con violencia", descripcion: "Cubre la pérdida de objetos asegurados o daños a la vivienda ocasionados por robos violentos dentro del hogar." },
  { titulo: "Daños eléctricos y errores de montaje", descripcion: "Tus contenidos eléctricos están protegidos frente a caídas de energía, cortos circuitos, malas conexiones o bajonazos de luz." },
  { titulo: "Daños accidentales a la estructura", descripcion: "Cubre accidentes que dañen tu hogar como caída de aviones, choque de autos o caída de árboles." },
];

const COBERTURAS_PROTECCION: Cobertura[] = [
  ...COBERTURAS_BASIC,
  { titulo: "Rotura de vidrios y espejos", descripcion: "Cubre la rotura accidental de vidrios, espejos y superficies de cristal en tu hogar." },
  { titulo: "Gastos médicos por accidentes en el hogar", descripcion: "Cubre gastos médicos si tú o un visitante sufren un accidente dentro de la vivienda." },
];

const COBERTURAS_PREMIUM: Cobertura[] = [
  ...COBERTURAS_PROTECCION,
  { titulo: "Pérdida de alquiler temporal", descripcion: "Si tu vivienda queda inhabitable por un siniestro cubierto, te ayudamos a pagar un arriendo temporal." },
  { titulo: "Asistencia legal en arrendamientos", descripcion: "Acceso a asesoría legal para conflictos relacionados con tu contrato de arrendamiento." },
];

interface Plan {
  id: string;
  nombre: string;
  precio: number;
  tag: string;
  coberturas: Cobertura[];
}

const PLANES: Plan[] = [
  { id: "basic", nombre: "Alquilando Basic", precio: 15000, tag: "Ideal para empezar", coberturas: COBERTURAS_BASIC },
  { id: "proteccion", nombre: "Alquilando Protección", precio: 28000, tag: "El más popular", coberturas: COBERTURAS_PROTECCION },
  { id: "premium", nombre: "Alquilando Premium", precio: 40000, tag: "Cobertura total", coberturas: COBERTURAS_PREMIUM },
];

const PLAN_ICONS: Record<string, LucideIcon> = { basic: Home, proteccion: ShieldCheck, premium: Award };

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
    id: "terremoto",
    icon: Flame,
    titulo: "¿Te preocupa un terremoto?",
    descripcion: "Nadie sabe cuándo temblará o lloverá de más. Activa esto para que nosotros paguemos las reparaciones si ocurre un terremoto, inundación o incendio. Duerme tranquilo pase lo que pase afuera.",
    precio: 20000,
    sidebarLabel: "Daños por desastres naturales",
    defaultOn: false,
  },
  {
    id: "invalidez",
    icon: HeartPulse,
    titulo: "Amparo por invalidez o fallecimiento",
    descripcion: "Tú y tus beneficiarios estarán protegidos si tienen algún tipo de lesión o enfermedad que les cause invalidez o la muerte, al igual que la empleada doméstica estará protegida ante accidentes dentro del hogar.",
    precio: 20000,
    sidebarLabel: "Amparo por invalidez o fallecim...",
    defaultOn: false,
  },
  {
    id: "seguridad-basica",
    icon: Lock,
    titulo: "Seguridad digital básica",
    descripcion: "Protege tus cuentas y dispositivos con monitoreo básico ante fraudes digitales y suplantación de identidad.",
    precio: 20000,
    sidebarLabel: "Seguridad digital básica",
    defaultOn: false,
  },
  {
    id: "seguridad-full",
    icon: ShieldCheck,
    titulo: "Seguridad digital full",
    descripcion: "Monitoreo avanzado 24/7, alertas en tiempo real y soporte prioritario ante cualquier incidente de ciberseguridad.",
    precio: 20000,
    sidebarLabel: "Seguridad digital full",
    defaultOn: false,
  },
  {
    id: "mascotas",
    icon: PawPrint,
    titulo: "¿Tienes mascotas o vecinos delicados?",
    descripcion: "Evita peleas costosas con los vecinos. Si se rompe tu tubería y mojas el piso de abajo, o si tu mascota hace una travesura, nosotros cubrimos los gastos de los daños que causes a otros.",
    precio: 20000,
    sidebarLabel: "Daños a terceros",
    defaultOn: false,
  },
];

export interface CategoriaAsistencia {
  titulo: string;
  items: string[];
}

const ASISTENCIA_BASICA: CategoriaAsistencia[] = [
  { titulo: "Plomería", items: ["Daños o roturas en griferías sanitarias o accesorios que componen los mezcladores o llaves.", "Daños en las conexiones de agua entre las redes y los aparatos sanitarios.", "Obstrucción en las redes de agua potable y/o aguas negras o residuales."] },
  { titulo: "Electricidad", items: ["Cortos en tomas eléctricas y salidas de iluminación.", "Daño de tacos o breakers por sobrecarga o sobrecalentamiento."] },
  { titulo: "Cerrajería", items: ["Apertura de puerta por cierre accidental o pérdida de llaves de puertas exteriores.", "Cambio de cerradura por daño o desgaste de la chapa exterior."] },
];

const ASISTENCIA_PROTECCION: CategoriaAsistencia[] = [
  ...ASISTENCIA_BASICA,
  { titulo: "Vidriería", items: ["Cambio de vidrios rotos en ventanas y puertas.", "Reparación de mallas de seguridad dañadas."] },
];

const ASISTENCIA_PREMIUM: CategoriaAsistencia[] = [
  ...ASISTENCIA_PROTECCION,
  { titulo: "Electrodomésticos", items: ["Revisión y reparación básica de neveras, lavadoras y estufas.", "Diagnóstico técnico a domicilio sin costo adicional."] },
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
  { id: "basica", icon: Wrench, nombre: "Asistencia Basica", precio: 5000, descripcion: "Este plan de asistencia viene incluido con el plan Alquilando basic. Se sumarán $5.000 a tu mensualidad.", categorias: ASISTENCIA_BASICA },
  { id: "proteccion", icon: Hammer, nombre: "Asistencia Protección", precio: 18000, descripcion: "Sube tu equipo de rescate un nivel: más categorías cubiertas para resolver los líos del día a día.", categorias: ASISTENCIA_PROTECCION },
  { id: "premium", icon: PackageCheck, nombre: "Asistencia Premium", precio: 40000, descripcion: "El equipo de rescate más completo, con cobertura para electrodomésticos incluida.", categorias: ASISTENCIA_PREMIUM },
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

const MONTOS_RAPIDOS = ["5000000", "10000000", "20000000", "50000000"];

interface CategoriaProps {
  icon: typeof Tv;
  titulo: string;
  descripcion: string;
  valor: string;
  onValor: (v: string) => void;
  listaTitulo: string;
  objetosBase: string[];
  objetosExtra: string[];
}

function CategoriaAsegurable({
  icon: Icon, titulo, descripcion, valor, onValor, listaTitulo, objetosBase, objetosExtra,
}: CategoriaProps) {
  const [verMas, setVerMas] = useState(false);
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
                  {MONTOS_RAPIDOS.map((m) => {
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

          {/* Objetos cubiertos como chips */}
          <div className="flex flex-col gap-2">
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
        </div>
    </div>
  );
}

// ─── Arma tu plan (paso 2) ────────────────────────────────────────────────────

/** Card seleccionable tipo radio, reutilizada para planes y paquetes de asistencia. */
function SuscripcionCard({
  icon: Icon, nombre, precio, tag, selected, onSelect,
}: { icon: LucideIcon; nombre: string; precio: number; tag: string; selected: boolean; onSelect: () => void }) {
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
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: 42, height: 42, backgroundColor: selected ? "#ffffff" : "var(--navy-light)" }}
      >
        <Icon size={20} strokeWidth={1.7} style={{ color: "var(--navy)" }} />
      </div>
      <span className="body-bold" style={{ color: "var(--navy)" }}>{nombre}</span>
      <span className="title-tertiary-bold" style={{ color: "var(--gray-10)" }}>{formatCOPNumber(precio)}</span>
      <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Mes ({tag})</span>
    </button>
  );
}

/** Fila de cobertura adicional opcional: toggle + descripción cuando está activa. */
function CoberturaAdicionalRow({ cobertura, activa, onToggle }: { cobertura: CoberturaAdicional; activa: boolean; onToggle: (v: boolean) => void }) {
  const Icon = cobertura.icon;
  return (
    <div
      className="rounded-lg flex items-start gap-3"
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
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <span className="body-bold" style={{ color: "var(--navy)" }}>{cobertura.titulo}</span>
        <p className="body-small-regular" style={{ color: "var(--gray-9)", margin: 0 }}>{cobertura.descripcion}</p>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <ToggleSwitch checked={activa} onChange={onToggle} />
        <span className="tags rounded-full px-3 py-1" style={{ backgroundColor: activa ? "#ffffff" : "var(--navy-light)", color: "var(--navy)", whiteSpace: "nowrap" }}>
          + {formatCOPNumber(cobertura.precio)} / Mes
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
}

function ArmaTuPlan({ planId, onPlan, adicionales, onToggleAdicional, asistenciaId, onAsistencia, onContinuar }: ArmaTuPlanProps) {
  const plan = PLANES.find((p) => p.id === planId)!;
  const asistencia = ASISTENCIAS.find((a) => a.id === asistenciaId)!;

  return (
    <div className="flex flex-col gap-6">
      {/* Elegir plan */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Elige tu suscripción mensual</h2>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
            Sin cláusulas de permanencia. Pagas mes a mes y puedes cancelar fácil cuando quieras.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1" role="radiogroup" aria-label="Plan de suscripción">
          {PLANES.map((p) => (
            <SuscripcionCard
              key={p.id}
              icon={PLAN_ICONS[p.id]}
              nombre={p.nombre}
              precio={p.precio}
              tag={p.tag}
              selected={planId === p.id}
              onSelect={() => onPlan(p.id)}
            />
          ))}
        </div>
      </div>

      {/* Detalle del plan elegido */}
      <div className="rounded-lg flex flex-col gap-3" style={{ border: "1px solid var(--gray-4)", padding: "18px 20px" }}>
        <div>
          <h3 className="body-bold" style={{ color: "var(--navy)" }}>Plan {plan.nombre}</h3>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
            Tu suscripción al plan {plan.nombre.replace("Alquilando ", "")} incluye {plan.coberturas.length} coberturas
            y su costo es de {formatCOPNumber(plan.precio)} + el paquete de asistencias que elijas abajo.
          </p>
        </div>
        <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />
        <span className="body-small-bold" style={{ color: "var(--gray-10)" }}>Listado de coberturas del plan {plan.nombre}</span>
        <div className="flex flex-col gap-3">
          {plan.coberturas.map((c) => (
            <div key={c.titulo} className="flex items-start gap-2">
              <CircleCheck size={15} strokeWidth={1.8} style={{ color: "var(--green-status)", flexShrink: 0, marginTop: 2 }} />
              <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>
                <span style={{ fontWeight: 700 }}>{c.titulo}: </span>{c.descripcion}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Coberturas adicionales */}
      <div className="rounded-lg flex flex-col" style={{ border: "1px solid var(--gray-4)", padding: "18px 20px" }}>
        <h3 className="body-bold" style={{ color: "var(--navy)" }}>Agrega coberturas adicionales</h3>
        <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 4 }}>
          Ya aseguraste lo básico. ¿Te gustaría blindar tu hogar contra todo pronóstico? Activa las coberturas
          que quieras sumar a tu suscripción.
        </p>
        <div className="flex flex-col gap-3" style={{ marginTop: 8 }}>
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

      {/* Paquetes de asistencias */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Paquetes de asistencias</h2>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
            El seguro cubre los daños grandes, pero estas asistencias resuelven los líos cotidianos. Elige
            qué tan completo quieres que sea tu equipo de rescate (plomeros, cerrajeros, electricistas).
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1" role="radiogroup" aria-label="Paquete de asistencias">
          {ASISTENCIAS.map((a) => (
            <SuscripcionCard
              key={a.id}
              icon={a.icon}
              nombre={a.nombre}
              precio={a.precio}
              tag={a.id === "basica" ? "Incluida" : "Adicional"}
              selected={asistenciaId === a.id}
              onSelect={() => onAsistencia(a.id)}
            />
          ))}
        </div>
      </div>

      {/* Detalle de la asistencia elegida */}
      <div className="rounded-lg flex flex-col gap-3" style={{ border: "1px solid var(--gray-4)", padding: "18px 20px" }}>
        <div>
          <h3 className="body-bold" style={{ color: "var(--navy)" }}>Has seleccionado: {asistencia.nombre}</h3>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>{asistencia.descripcion}</p>
        </div>
        {asistencia.categorias.map((cat) => (
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

      {/* Continuar */}
      <div className="flex items-center justify-end">
        <AppButton variant="primary" bold onClick={onContinuar}>Continuar</AppButton>
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
        <p className="body-regular" style={{ color: "var(--gray-10)", maxWidth: 520, margin: 0 }}>
          Realizarás el pago de una suscripción mensual del plan <span style={{ fontWeight: 700 }}>{plan.nombre}</span> y
          el pago está habilitado únicamente con tarjeta de crédito. Tu cobertura estará activa en minutos.
        </p>
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

      {/* Suscripción seleccionada */}
      <div className="flex flex-col gap-5">
        <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Suscripción seleccionada</h2>

        <div className="flex flex-col gap-3">
          <span className="body-bold" style={{ color: "var(--navy)" }}>Plan {plan.nombre}</span>
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
          <span className="body-bold" style={{ color: "var(--navy)" }}>Suscripción</span>
          <p className="body-small-regular" style={{ color: "var(--gray-10)", margin: 0 }}>
            Igual que tus apps de streaming, pagas mes a mes y puedes cancelar fácil cuando quieras,
            sin plazos forzosos ni penalizaciones.
          </p>
          <p className="body-small-regular" style={{ color: "var(--gray-10)", margin: 0 }}>
            <span style={{ fontWeight: 700 }}>Modalidad:</span> Suscripción mensual
          </p>
          <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Se renueva automáticamente cada mes.</span>
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
  totalMensual: number;
  numeroPoliza: string;
  fechaPago: string;
  proximoCobro: string;
  onFinalizar: () => void;
  onVerSeguros: () => void;
}

function PagoExitoso({ plan, asistencia, totalMensual, numeroPoliza, fechaPago, proximoCobro, onFinalizar, onVerSeguros }: PagoExitosoProps) {
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
          Cobramos tu suscripción y tu póliza quedó activa de inmediato. Te enviamos el comprobante y
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
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Próximo cobro</span>
            <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{proximoCobro}</span>
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
          <span className="title-tertiary-bold" style={{ color: "var(--navy)" }}>{formatCOPNumber(totalMensual)}</span>
        </div>
        <p className="body-small-regular" style={{ color: "var(--gray-8)", marginTop: 4, marginBottom: 0 }}>
          Volveremos a cobrar {formatCOPNumber(totalMensual)} el {proximoCobro}, mientras tu suscripción
          siga activa.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={() => setComprobanteEnviado(true)}
          className="body-bold inline-flex items-center gap-2 rounded-lg transition-colors"
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
        <AppButton variant="secondary" bold onClick={onVerSeguros}>
          <FileText size={15} /> Ver mis seguros
        </AppButton>
        <AppButton variant="primary" bold onClick={onFinalizar}>
          Volver a Inicio
        </AppButton>
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
  totalMensual: number;
  fechaPago: string;
  proximoCobro: string;
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
  const [paso, setPaso] = useState(0);
  // Al cambiar de paso, sube al inicio del módulo (el scroll vive en el <main> del portal, no en window).
  const topRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [paso]);
  const [numeroPoliza] = useState(() => "AL-" + Math.floor(100000 + Math.random() * 900000));
  const [fechaCompra] = useState(() => new Date());
  const fechaPagoStr = useMemo(() => formatFechaCorta(fechaCompra), [fechaCompra]);
  const proximoCobroStr = useMemo(() => {
    const d = new Date(fechaCompra);
    d.setMonth(d.getMonth() + 1);
    return formatFechaCorta(d);
  }, [fechaCompra]);
  const [inmueble, setInmueble] = useState("carrera-23");
  const [inmueblesData, setInmueblesData] = useState<Record<string, InmuebleCotizacion>>(INMUEBLES_COTIZACION);
  const [inmuebleOptions, setInmuebleOptions] = useState(INMUEBLE_OPTIONS);
  const cambiarInmueble = (id: string) => {
    setInmueble(id);
    // Elegir un inmueble existente cierra el formulario de "nuevo inmueble" si estaba abierto.
    setAgregandoInmueble(false);
  };

  // Formulario inline para agregar un inmueble nuevo a la lista.
  // Mientras está abierto se deselecciona el inmueble para no mostrar sus datos abajo.
  const [agregandoInmueble, setAgregandoInmueble] = useState(false);
  const [inmuebleAntesDeAgregar, setInmuebleAntesDeAgregar] = useState<string | null>(null);
  const [nuevoDireccion, setNuevoDireccion] = useState("");
  const [nuevoCiudad, setNuevoCiudad] = useState("");
  const [nuevoEstrato, setNuevoEstrato] = useState("");
  const [nuevoCanon, setNuevoCanon] = useState("");
  const [nuevoAntiguedad, setNuevoAntiguedad] = useState("");
  const [nuevoValorVivienda, setNuevoValorVivienda] = useState("");
  const [nuevoInfoAdicional, setNuevoInfoAdicional] = useState("");
  const [nuevoZona, setNuevoZona] = useState("urbano");
  const [nuevoObservaciones, setNuevoObservaciones] = useState("");
  const nuevoValido =
    nuevoDireccion.trim() !== "" &&
    nuevoCiudad.trim() !== "" &&
    nuevoAntiguedad.trim() !== "" &&
    Number(nuevoValorVivienda) > 0;

  const abrirNuevoInmueble = () => {
    setInmuebleAntesDeAgregar(inmueble);
    setInmueble("");
    setAgregandoInmueble(true);
  };

  const resetNuevoInmueble = () => {
    setAgregandoInmueble(false);
    setNuevoDireccion("");
    setNuevoCiudad("");
    setNuevoEstrato("");
    setNuevoCanon("");
    setNuevoAntiguedad("");
    setNuevoValorVivienda("");
    setNuevoInfoAdicional("");
    setNuevoZona("urbano");
    setNuevoObservaciones("");
  };

  // Coordenadas del inmueble nuevo: se derivan automáticamente de la dirección + ciudad
  // (simula geolocalización) apenas hay suficiente texto para ubicarlo, sin pedirle nada al usuario.
  const { lat: nuevoLat, lng: nuevoLng } = useMemo(
    () => coordenadasDesdeDireccion(nuevoDireccion, nuevoCiudad),
    [nuevoDireccion, nuevoCiudad],
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
      estrato: nuevoEstrato.trim() || "—",
      canon: nuevoCanon.trim() ? `$${nuevoCanon.trim()}` : "—",
      ciudad: nuevoCiudad.trim(),
      direccion: nuevoDireccion.trim(),
      coordenadas: nuevoCoordenadas,
      // El formulario de creación ya pidió todos los datos: no se repite la sección de detalles.
      datosCompletos: true,
      lat: nuevoLat,
      lng: nuevoLng,
    };
    setInmueblesData((prev) => ({ ...prev, [id]: nuevo }));
    setInmuebleOptions((prev) => [...prev, { value: id, label: nuevo.direccion }]);
    setAntiguedad(nuevoAntiguedad);
    setValorVivienda(nuevoValorVivienda);
    setInfoAdicional(nuevoInfoAdicional);
    setZona(nuevoZona);
    setObservaciones(nuevoObservaciones);
    cambiarInmueble(id);
    setInmuebleAntesDeAgregar(null);
    resetNuevoInmueble();
  };

  const [infoAdicional, setInfoAdicional] = useState("");
  const [antiguedad, setAntiguedad] = useState("");
  const [zona, setZona] = useState("urbano");
  const [valorVivienda, setValorVivienda] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [electronicosValor, setElectronicosValor] = useState("");
  const [enseresValor, setEnseresValor] = useState("");

  const [planId, setPlanId] = useState("basic");
  const [adicionales, setAdicionales] = useState<Record<string, boolean>>(
    () => Object.fromEntries(COBERTURAS_ADICIONALES.map((c) => [c.id, c.defaultOn])),
  );
  const [asistenciaId, setAsistenciaId] = useState("basica");
  const toggleAdicional = (id: string, v: boolean) => setAdicionales((prev) => ({ ...prev, [id]: v }));

  const datos = inmueble ? inmueblesData[inmueble] : undefined;
  const plan = PLANES.find((p) => p.id === planId)!;
  const asistencia = ASISTENCIAS.find((a) => a.id === asistenciaId)!;
  const adicionalesActivas = COBERTURAS_ADICIONALES.filter((c) => adicionales[c.id]);

  const total = useMemo(
    () => Number(electronicosValor || 0) + Number(enseresValor || 0),
    [electronicosValor, enseresValor],
  );

  const totalMensual = useMemo(
    () => plan.precio + asistencia.precio + adicionalesActivas.reduce((sum, c) => sum + c.precio, 0),
    [plan, asistencia, adicionalesActivas],
  );

  // Los campos marcados con * son obligatorios, salvo que el inmueble ya tenga todos sus datos precargados.
  const detallesCompletos = datos ? (!datos.datosCompletos ? (antiguedad.trim() !== "" && Number(valorVivienda) > 0) : true) : false;
  const objetosCompletos = Number(electronicosValor) > 0 && Number(enseresValor) > 0;
  const puedeContinuar = detallesCompletos && objetosCompletos;

  // Dice exactamente qué falta, en vez de un "completa todo" genérico.
  const faltantes = [
    !datos && "selecciona un inmueble",
    datos && !detallesCompletos && "datos del inmueble",
    Number(electronicosValor) <= 0 && "valor de equipos electrónicos",
    Number(enseresValor) <= 0 && "valor de muebles y enseres",
  ].filter(Boolean) as string[];

  const textareaStyle: React.CSSProperties = {
    border: "1px solid var(--gray-5)",
    borderRadius: "var(--radius-md)",
    padding: "10px 12px",
    color: "var(--gray-10)",
    outline: "none",
    width: "100%",
    minHeight: 88,
    resize: "vertical",
  };

  return (
    <div ref={topRef} className="flex flex-col gap-5" style={{ scrollMarginTop: 16 }}>
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
        <Stepper steps={PASOS} current={paso} />
      </section>

      <div className="grid gap-5 items-start grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        {/* Columna principal */}
        <div className="flex flex-col gap-5 min-w-0">
          <section className="rounded-lg flex flex-col gap-6 p-5 md:px-7 md:py-6" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)" }}>
            {paso === 0 && (
              <>
                {/* Selección de inmueble: cards con toda la información integrada */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Selecciona el inmueble a asegurar</h2>
                    <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
                      La cobertura aplicará únicamente al inmueble que elijas aquí.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1" role="radiogroup" aria-label="Inmueble a asegurar">
                    {inmuebleOptions.map((opt) => {
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
                          <div className="flex items-center gap-3" style={{ paddingRight: 24 }}>
                            <div
                              className="flex items-center justify-center rounded-full shrink-0"
                              style={{ width: 38, height: 38, backgroundColor: selected ? "#ffffff" : "var(--navy-light)" }}
                            >
                              <Home size={17} strokeWidth={1.8} style={{ color: "var(--navy)" }} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="body-bold truncate" style={{ color: "var(--gray-10)" }}>{d.direccion}</span>
                              <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{d.ciudad}</span>
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
                      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                        <Field label="Dirección" required>
                          <TextInput placeholder="Ej. Calle 100 # 15 - 20, apto 301" value={nuevoDireccion} onChange={setNuevoDireccion} />
                        </Field>
                        <Field label="Ciudad" required>
                          <TextInput placeholder="Ej. Bogotá" value={nuevoCiudad} onChange={setNuevoCiudad} />
                        </Field>
                        <Field label="Estrato">
                          <SelectInput
                            options={["1", "2", "3", "4", "5", "6"].map((v) => ({ value: v, label: v }))}
                            value={nuevoEstrato}
                            onChange={setNuevoEstrato}
                          />
                        </Field>
                        <Field label="Canon mensual">
                          <TextInput placeholder="Ej. 1.800.000" value={nuevoCanon} onChange={setNuevoCanon} />
                        </Field>
                        <Field label="Años de antigüedad" required>
                          <TextInput placeholder="Digite aquí" value={nuevoAntiguedad} onChange={setNuevoAntiguedad} />
                        </Field>
                        <Field label="Valor de la vivienda" required>
                          <TextInput placeholder="$ 0" value={nuevoValorVivienda} onChange={setNuevoValorVivienda} />
                        </Field>
                        <Field label="Información adicional del inmueble">
                          <TextInput placeholder="Torre, piso, apto" value={nuevoInfoAdicional} onChange={setNuevoInfoAdicional} />
                        </Field>
                        <Field label="Zona">
                          <SelectInput options={ZONA_OPTIONS} value={nuevoZona} onChange={setNuevoZona} />
                        </Field>
                      </div>
                      <Field label="Observaciones">
                        <textarea
                          placeholder="Escriba aquí..."
                          value={nuevoObservaciones}
                          onChange={(e) => setNuevoObservaciones(e.target.value)}
                          style={textareaStyle}
                        />
                      </Field>

                      {/* Coordenadas: se calculan solas a partir de la dirección + ciudad, sin mapa. */}
                      {nuevoValido && (
                        <div className="flex items-center justify-between gap-4 rounded-lg" style={{ backgroundColor: "var(--gray-1)", padding: "10px 14px" }}>
                          <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Coordenadas (automáticas)</span>
                          <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{nuevoCoordenadas}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-end gap-3">
                        <AppButton variant="secondary" onClick={cancelarNuevoInmueble}>Cancelar</AppButton>
                        <AppButton variant="primary" bold disabled={!nuevoValido} onClick={guardarNuevoInmueble}>
                          Guardar inmueble
                        </AppButton>
                      </div>
                    </div>
                  )}
                </div>

                {datos && (datos.datosCompletos ? (
                  <div
                    className="flex items-center gap-3 rounded-lg"
                    style={{ backgroundColor: "var(--green-status-light)", padding: "14px 18px" }}
                  >
                    <CircleCheck size={18} strokeWidth={1.8} style={{ color: "var(--green-status)", flexShrink: 0 }} />
                    <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>
                      Ya tenemos todos los datos de este inmueble. No necesitas completar nada más aquí.
                    </span>
                  </div>
                ) : (
                  <>
                    <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Completa los datos del inmueble</h2>
                          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
                            Ya precargamos lo que sabemos de tu inmueble. Completa los campos marcados con
                            <span style={{ color: "var(--destructive)" }}> *</span> para poder continuar.
                          </p>
                        </div>
                        {detallesCompletos
                          ? <StatusBadge label="Completado" variant="active" />
                          : <StatusBadge label="Requerido" variant="pending" />}
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-sm:grid-cols-1">
                        <Field label="Tipo de inmueble">
                          <TextInput value="Apartamento" disabled className="w-full" />
                        </Field>
                        <Field label="Información adicional del inmueble">
                          <TextInput placeholder="Torre, piso, apto" value={infoAdicional} onChange={setInfoAdicional} className="w-full" />
                        </Field>
                        <Field label="Años de antigüedad" required>
                          <TextInput placeholder="Digite aquí" value={antiguedad} onChange={(v) => setAntiguedad(v.replace(/\D/g, "").slice(0, 3))} className="w-full" />
                        </Field>
                        <Field label="Zona">
                          <SelectInput options={ZONA_OPTIONS} value={zona} onChange={setZona} className="w-full" />
                        </Field>
                        <Field label="Valor de la vivienda" required>
                          <TextInput placeholder="$ 0" value={formatCOP(valorVivienda)} onChange={(v) => setValorVivienda(parseDigits(v))} className="w-full" />
                        </Field>
                        <label className="flex flex-col gap-1.5 col-span-full">
                          <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Observaciones</span>
                          <textarea
                            className="body-regular"
                            placeholder="Escriba aquí..."
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            style={textareaStyle}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--gray-5)"; }}
                          />
                        </label>
                      </div>
                    </div>
                  </>
                ))}
              </>
            )}

            {paso === 1 && (
              <ArmaTuPlan
                planId={planId}
                onPlan={setPlanId}
                adicionales={adicionales}
                onToggleAdicional={toggleAdicional}
                asistenciaId={asistenciaId}
                onAsistencia={setAsistenciaId}
                onContinuar={() => setPaso(2)}
              />
            )}

            {paso === 2 && (
              <ConfirmaTuPlan
                plan={plan}
                adicionalesActivas={adicionalesActivas}
                asistencia={asistencia}
                titular={{ nombre: "Nelson Diaz", correo: "nelson.diaz@email.com" }}
              />
            )}

            {paso === 3 && (
              <PagoExitoso
                plan={plan}
                asistencia={asistencia}
                totalMensual={totalMensual}
                numeroPoliza={numeroPoliza}
                fechaPago={fechaPagoStr}
                proximoCobro={proximoCobroStr}
                onFinalizar={onFinalizar}
                onVerSeguros={onBack}
              />
            )}
          </section>

          {paso === 0 && (
            <section className="rounded-lg flex flex-col gap-6 p-5 md:px-7 md:py-6" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)" }}>
              <div className="flex flex-col gap-3">
                <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Ahora, asegura tus objetos personales</h2>
                <p className="body-small-regular" style={{ color: "var(--gray-10)", margin: 0 }}>
                  Ambas categorías hacen parte de tu póliza: indícanos el valor a proteger en cada una.
                </p>
                {/* Guía de 3 pasos: el usuario sabe exactamente qué hacer */}
                <div className="flex items-center gap-2 flex-wrap">
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
              />

              {/* Resumen del paso + acción: estado del sistema siempre visible */}
              <div
                className="flex items-center justify-between gap-4 flex-wrap rounded-lg"
                style={{ backgroundColor: "var(--gray-1)", border: "1px solid var(--gray-4)", padding: "14px 18px" }}
              >
                <div className="flex flex-col">
                  <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Total asegurado</span>
                  <span className="title-tertiary-bold" style={{ color: puedeContinuar ? "var(--navy)" : "var(--gray-7)" }}>
                    {total > 0 ? "$ " + total.toLocaleString("es-CO") : "$ 0"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
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

        {/* Resumen sticky */}
        <aside className="rounded-lg flex flex-col gap-4 sticky top-6" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}>
          <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Así va tu protección</h2>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", margin: 0 }}>
            Tendrás cobertura continua, hasta que decidas cancelar el seguro.
          </p>

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
              <AppButton variant="primary" bold fullWidth disabled={!puedeContinuar} onClick={() => setPaso(1)}>
                Continuar
              </AppButton>
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
                <span className="body-bold" style={{ color: "var(--navy)" }}>Plan de suscripción</span>
                <div className="flex items-center justify-between gap-4">
                  <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{plan.nombre} Mensual</span>
                  <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{formatCOPNumber(plan.precio)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>Paquete de asistencias (Incluida)</span>
                  <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{formatCOPNumber(asistencia.precio)}</span>
                </div>
              </div>

              <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />
              <div className="flex items-center justify-between gap-4">
                <span className="body-bold" style={{ color: "var(--gray-10)" }}>Total:</span>
                <span className="title-tertiary-bold" style={{ color: "var(--navy)" }}>{formatCOPNumber(totalMensual)}</span>
              </div>
              <p className="disclamer" style={{ color: "var(--gray-8)", margin: 0 }}>IVA incluido.</p>

              {paso === 1 && (
                <AppButton variant="primary" bold fullWidth onClick={() => setPaso(2)}>
                  Continuar
                </AppButton>
              )}

              {paso === 2 && (
                <div className="flex items-center justify-between gap-4">
                  <LinkText size="small" icon="chevron" onClick={() => setPaso(1)}>Cambiar plan</LinkText>
                  <AppButton
                    variant="primary"
                    bold
                    onClick={() => {
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
                        totalMensual,
                        fechaPago: fechaPagoStr,
                        proximoCobro: proximoCobroStr,
                        estado: "activa",
                      });
                      setPaso(3);
                    }}
                  >
                    <CreditCard size={15} /> Ir a pagar
                  </AppButton>
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
