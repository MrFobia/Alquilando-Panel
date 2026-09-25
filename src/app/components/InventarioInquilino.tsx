import { useState } from "react";
import {
  Download, Image as ImageIcon, ListChecks, Eye, ClipboardList, CircleCheck, AlertCircle,
  ChevronDown, Sofa, CookingPot, BedDouble, Bath, WashingMachine, Sun, Car, DoorOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppButton } from "./kit/AppButton";
import { BackButton } from "./kit/BackButton";
import { Callout } from "./kit/Callout";
import { InfoField } from "./kit/InfoField";
import { LinkText } from "./kit/LinkText";
import { StatusBadge } from "./kit/StatusBadge";
import { ESTADO_VARIANT } from "./InventarioDetalle";

/**
 * Inventario del inmueble para el inquilino: misma estructura que el inventario del
 * panel (InventarioDetalle — niveles → ambientes → galería + especificaciones → notas),
 * pero solo lectura. Nada se agrega, edita ni elimina desde el portal; si el inquilino
 * ve una diferencia, la reporta como solicitud.
 */

interface Especificacion {
  elementos: string;
  estado: "Excelente" | "Bueno" | "Regular" | "Malo";
  cantidad: number;
  material?: string;
  notas?: string;
}

interface Ambiente {
  tipo: string;
  nombre?: string;
  fotos: number;
  especificaciones: Especificacion[];
}

interface Nivel {
  nombre: string;
  ambientes: Ambiente[];
}

export interface InventarioData {
  tipoInventario: string;
  fecha: string;
  tipoInmueble: string;
  realizadoPor: string;
  firmadoPorInquilino: string;
  inquilino: string;
  niveles: Nivel[];
  notas: { texto: string; fecha: string }[];
}

export const INVENTARIOS: Record<string, InventarioData> = {
  "1731": {
    tipoInventario: "Recepción",
    fecha: "01 mar 2025",
    tipoInmueble: "Apartamento",
    realizadoPor: "Inmobiliaria Maestra",
    firmadoPorInquilino: "01 mar 2025",
    inquilino: "Nelson Diaz",
    niveles: [
      {
        nombre: "Primer piso",
        ambientes: [
          {
            tipo: "Sala comedor", fotos: 6,
            especificaciones: [
              { elementos: "Piso", estado: "Bueno", cantidad: 1, material: "Madera laminada", notas: "Rayón leve junto a la ventana" },
              { elementos: "Paredes", estado: "Excelente", cantidad: 4, material: "Pintura blanca" },
              { elementos: "Lámparas", estado: "Bueno", cantidad: 3, material: "Techo LED" },
              { elementos: "Ventanas", estado: "Bueno", cantidad: 2, material: "Aluminio y vidrio" },
            ],
          },
          {
            tipo: "Cocina", fotos: 5,
            especificaciones: [
              { elementos: "Estufa", estado: "Excelente", cantidad: 1, material: "Gas, 4 puestos" },
              { elementos: "Mesón", estado: "Bueno", cantidad: 1, material: "Granito" },
              { elementos: "Gabinetes", estado: "Regular", cantidad: 6, material: "Madera", notas: "Bisagra floja en gabinete superior izquierdo" },
            ],
          },
          {
            tipo: "Alcobas", nombre: "Principal", fotos: 4,
            especificaciones: [
              { elementos: "Clóset", estado: "Bueno", cantidad: 1, material: "Madera" },
              { elementos: "Piso", estado: "Excelente", cantidad: 1, material: "Madera laminada" },
            ],
          },
          {
            tipo: "Alcobas", nombre: "Secundaria", fotos: 3,
            especificaciones: [
              { elementos: "Clóset", estado: "Bueno", cantidad: 1, material: "Madera" },
            ],
          },
          {
            tipo: "Baño", nombre: "Principal", fotos: 4,
            especificaciones: [
              { elementos: "Sanitario", estado: "Excelente", cantidad: 1, material: "Porcelana" },
              { elementos: "Ducha", estado: "Bueno", cantidad: 1, material: "Vidrio templado" },
              { elementos: "Lavamanos", estado: "Bueno", cantidad: 1, material: "Porcelana" },
            ],
          },
          { tipo: "Zona de ropas", fotos: 2, especificaciones: [{ elementos: "Lavadero", estado: "Regular", cantidad: 1, material: "Cemento", notas: "Desgaste por uso" }] },
          { tipo: "Balcón o terraza", fotos: 2, especificaciones: [] },
        ],
      },
    ],
    notas: [
      { texto: "Se entregan 3 juegos de llaves y 2 controles del parqueadero.", fecha: "01 mar 2025" },
      { texto: "Contadores de agua y energía leídos en la entrega: 04512 m³ y 23981 kWh.", fecha: "01 mar 2025" },
    ],
  },
  "2048": {
    tipoInventario: "Recepción",
    fecha: "15 nov 2025",
    tipoInmueble: "Apartamento",
    realizadoPor: "Inmobiliaria Maestra",
    firmadoPorInquilino: "15 nov 2025",
    inquilino: "Nelson Diaz",
    niveles: [
      {
        nombre: "Primer piso",
        ambientes: [
          { tipo: "Sala comedor", fotos: 4, especificaciones: [{ elementos: "Piso", estado: "Bueno", cantidad: 1, material: "Cerámica" }] },
          { tipo: "Cocina", fotos: 3, especificaciones: [{ elementos: "Estufa", estado: "Bueno", cantidad: 1, material: "Eléctrica, 2 puestos" }] },
          { tipo: "Alcobas", fotos: 2, especificaciones: [{ elementos: "Clóset", estado: "Regular", cantidad: 1, material: "Madera", notas: "Puerta corrediza se atasca" }] },
          { tipo: "Baño", fotos: 3, especificaciones: [{ elementos: "Ducha", estado: "Bueno", cantidad: 1, material: "Cortina" }] },
        ],
      },
    ],
    notas: [],
  },
};

/** Seguimiento de 2026 sobre el mismo inmueble: cambian dos elementos respecto a la recepción. */
function seguimiento1731(): InventarioData {
  const inv: InventarioData = structuredClone(INVENTARIOS["1731"]);
  inv.tipoInventario = "Seguimiento";
  inv.fecha = "12 mar 2026";
  inv.firmadoPorInquilino = "12 mar 2026";
  const amb = inv.niveles[0].ambientes;
  amb[0].especificaciones[0] = { elementos: "Piso", estado: "Regular", cantidad: 1, material: "Madera laminada", notas: "Rayón junto a la ventana y desgaste nuevo en la entrada" };
  amb[1].especificaciones[2] = { elementos: "Gabinetes", estado: "Bueno", cantidad: 6, material: "Madera", notas: "Bisagra reparada en abril de 2025" };
  inv.notas = [{ texto: "Revisión anual sin novedades mayores. Se recomienda mantenimiento del piso de la sala.", fecha: "12 mar 2026" }];
  return inv;
}

/** Historial de inventarios por contrato del propietario demo, del más reciente al más antiguo. */
export const INVENTARIOS_PROPIETARIO: Record<string, InventarioData[]> = {
  "1731": [seguimiento1731(), INVENTARIOS["1731"]],
  "3310": [{ ...INVENTARIOS["2048"], fecha: "02 ago 2025", firmadoPorInquilino: "02 ago 2025", inquilino: "Laura Méndez" }],
};

function Galeria({ fotos }: { fotos: number }) {
  if (fotos === 0) {
    return <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Este ambiente no tiene fotos.</span>;
  }
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))" }}>
      {Array.from({ length: fotos }).map((_, i) => (
        <button
          key={i}
          className="group relative rounded-lg flex items-center justify-center transition-colors"
          style={{ aspectRatio: "4 / 3", backgroundColor: "var(--gray-2)", border: "1px solid var(--gray-4)", cursor: "pointer" }}
          aria-label={`Ver foto ${i + 1}`}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--gray-4)"; }}
        >
          <ImageIcon size={20} strokeWidth={1.5} style={{ color: "var(--gray-7)" }} />
          <span className="disclamer absolute" style={{ bottom: 4, right: 6, color: "var(--gray-8)" }}>{i + 1}</span>
        </button>
      ))}
    </div>
  );
}

function Especificaciones({ items }: { items: Especificacion[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg text-center" style={{ backgroundColor: "var(--gray-1)", padding: 14 }}>
        <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>No se registraron especificaciones para este ambiente.</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {items.map((s, i) => (
        <div
          key={i}
          /* Estado y cantidad pegados al borde derecho en columnas de ancho fijo, para que
             queden alineados entre filas; las notas van bajo el nombre como segunda línea. */
          className="grid items-center gap-x-5 rounded-lg grid-cols-[minmax(0,1fr)_minmax(0,220px)_96px] max-md:grid-cols-[minmax(0,1fr)_auto]"
          style={{ border: "1px solid var(--gray-4)", padding: "10px 14px" }}
        >
          <span className="flex flex-col min-w-0">
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>{s.elementos}</span>
            <span className="body-small-regular" style={{ color: s.notas ? "var(--gray-9)" : "var(--gray-6)", fontStyle: s.notas ? "italic" : "normal" }}>
              {s.notas ? `“${s.notas}”` : "Sin observaciones"}
            </span>
          </span>
          <span className="body-small-regular text-right max-md:hidden" style={{ color: "var(--gray-9)" }}>
            Cantidad: {s.cantidad}{s.material ? ` · ${s.material}` : ""}
          </span>
          <span className="justify-self-end">
            <StatusBadge label={s.estado} variant={ESTADO_VARIANT[s.estado] ?? "neutral"} />
          </span>
          <span className="body-small-regular md:hidden col-span-2" style={{ color: "var(--gray-9)", marginTop: 4 }}>
            Cantidad: {s.cantidad}{s.material ? ` · ${s.material}` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

const ICONO_AMBIENTE: Record<string, LucideIcon> = {
  "Sala comedor": Sofa,
  Cocina: CookingPot,
  Alcobas: BedDouble,
  Baño: Bath,
  "Zona de ropas": WashingMachine,
  "Balcón o terraza": Sun,
  Garaje: Car,
};

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/**
 * Fila de ambiente. A propósito no usa CollapsiblePanel (barra sólida del panel admin):
 * para una vista de solo lectura, siete barras púrpura compiten con las acciones reales
 * y no dejan ver jerarquía. Aquí el púrpura queda como acento del ícono y del estado abierto.
 */
function AmbienteFila({ a }: { a: Ambiente }) {
  const [open, setOpen] = useState(false);
  const Icon = ICONO_AMBIENTE[a.tipo] ?? DoorOpen;
  const observaciones = a.especificaciones.filter((e) => e.estado === "Regular" || e.estado === "Malo").length;
  return (
    <div
      className="rounded-lg overflow-hidden transition-colors"
      style={{ border: `1px solid ${open ? "var(--navy)" : "var(--gray-4)"}` }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 text-left transition-colors"
        style={{ padding: "12px 16px", cursor: "pointer", backgroundColor: open ? "var(--navy-light)" : "#ffffff" }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.backgroundColor = "var(--gray-1)"; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.backgroundColor = "#ffffff"; }}
      >
        <span
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 36, height: 36, backgroundColor: open ? "#ffffff" : "var(--navy-light)" }}
        >
          <Icon size={17} strokeWidth={1.7} style={{ color: "var(--navy)" }} />
        </span>
        <span className="flex flex-col min-w-0 flex-1">
          <span className="body-bold" style={{ color: "var(--gray-10)" }}>
            {a.tipo}{a.nombre ? ` · ${a.nombre}` : ""}
          </span>
          <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
            {plural(a.fotos, "foto", "fotos")} · {plural(a.especificaciones.length, "elemento", "elementos")}
          </span>
        </span>
        {observaciones > 0 && (
          <span className="shrink-0 max-sm:hidden">
            <StatusBadge label={plural(observaciones, "observación", "observaciones")} variant="pending" />
          </span>
        )}
        <ChevronDown
          size={18}
          className="shrink-0"
          style={{ color: "var(--gray-8)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-5" style={{ padding: "18px 16px 20px", borderTop: "1px solid var(--gray-4)", backgroundColor: "#ffffff" }}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} style={{ color: "var(--navy)" }} />
              <span className="body-bold" style={{ color: "var(--gray-10)" }}>Galería</span>
            </div>
            <Galeria fotos={a.fotos} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ListChecks size={16} style={{ color: "var(--navy)" }} />
              <span className="body-bold" style={{ color: "var(--gray-10)" }}>Especificaciones</span>
            </div>
            <Especificaciones items={a.especificaciones} />
          </div>
        </div>
      )}
    </div>
  );
}

function totales(inv: InventarioData) {
  const ambientes = inv.niveles.flatMap((l) => l.ambientes);
  const elementos = ambientes.flatMap((a) => a.especificaciones);
  return {
    ambientes: ambientes.length,
    fotos: ambientes.reduce((n, a) => n + a.fotos, 0),
    elementos: elementos.length,
    conObservaciones: elementos.filter((e) => e.estado === "Regular" || e.estado === "Malo").length,
  };
}

/** Card corta para el detalle del contrato; el inventario completo se abre aparte. */
export function ResumenInventario({ inventario, onVer, titulo, detalle, onHistorial, totalHistorial }: {
  inventario: InventarioData;
  onVer: () => void;
  /** Por defecto "Inventario"; el propietario ve la dirección porque lista varios inmuebles. */
  titulo?: string;
  detalle?: string;
  /** Si llega, se muestra "Ver historial" junto al botón principal. */
  onHistorial?: () => void;
  totalHistorial?: number;
}) {
  const t = totales(inventario);
  const buenos = t.elementos - t.conObservaciones;
  return (
    <section
      className="rounded-lg flex flex-col gap-4"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 40, height: 40, backgroundColor: "var(--navy-light)" }}
        >
          <ClipboardList size={19} strokeWidth={1.7} style={{ color: "var(--navy)" }} />
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>{titulo ?? "Inventario"}</h2>
          <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>
            {detalle ?? `${inventario.tipoInventario} · ${inventario.fecha}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 rounded-lg" style={{ backgroundColor: "var(--gray-1)", padding: "12px 4px" }}>
        {[
          { n: t.ambientes, label: "ambientes" },
          { n: t.elementos, label: "elementos" },
          { n: t.fotos, label: "fotos" },
        ].map((x, i) => (
          <div key={x.label} className="flex flex-col items-center" style={{ borderLeft: i > 0 ? "1px solid var(--gray-4)" : "none" }}>
            <span className="body-xl-bold" style={{ color: "var(--gray-10)" }}>{x.n}</span>
            <span className="disclamer" style={{ color: "var(--gray-8)" }}>{x.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="flex items-center gap-1.5 body-small-regular" style={{ color: "var(--gray-9)" }}>
          <CircleCheck size={15} strokeWidth={1.8} style={{ color: "var(--green-status)" }} />
          {buenos} en buen estado o excelente
        </span>
        {t.conObservaciones > 0 && (
          <span className="flex items-center gap-1.5 body-small-regular" style={{ color: "var(--gray-9)" }}>
            <AlertCircle size={15} strokeWidth={1.8} style={{ color: "var(--orange-status)" }} />
            {t.conObservaciones} con observaciones desde la entrega
          </span>
        )}
      </div>

      {onHistorial ? (
        <div className="grid grid-cols-2 gap-3">
          <AppButton variant="secondary" bold fullWidth onClick={onVer}>Ver inventario</AppButton>
          <AppButton variant="ghost" bold fullWidth onClick={onHistorial}>
            Ver historial{totalHistorial ? ` (${totalHistorial})` : ""}
          </AppButton>
        </div>
      ) : (
        <AppButton variant="secondary" bold fullWidth onClick={onVer}>Ver inventario completo</AppButton>
      )}
    </section>
  );
}

interface Props {
  inventario: InventarioData;
  direccion: string;
  onBack: () => void;
  onReportar: () => void;
  /** Cambia solo la redacción: el inquilino recibió el inmueble, el propietario lo entregó. */
  audiencia?: "inquilino" | "propietario";
  backLabel?: string;
}

export function InventarioInquilino({ inventario, direccion, onBack, onReportar, audiencia = "inquilino", backLabel = "Volver al contrato" }: Props) {
  const esPropietario = audiencia === "propietario";
  const { ambientes: totalAmbientes, fotos: totalFotos } = totales(inventario);

  return (
    <div className="flex flex-col gap-5">
    <BackButton onClick={onBack}>{backLabel}</BackButton>
    <section
      className="rounded-lg flex flex-col gap-5"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Inventario · {direccion}</h2>
            <span
              className="tags inline-flex items-center gap-1 rounded-full"
              style={{ backgroundColor: "var(--gray-2)", color: "var(--gray-9)", padding: "3px 10px" }}
            >
              <Eye size={12} strokeWidth={2} /> Solo lectura
            </span>
          </div>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
            {esPropietario ? "Así se entregó tu inmueble" : "Así recibiste el inmueble"}: {totalAmbientes} ambientes y {totalFotos} fotos registradas.
          </p>
        </div>
        <AppButton variant="secondary" bold>
          <Download size={16} strokeWidth={2} /> Descargar PDF
        </AppButton>
      </div>

      <div className="grid grid-cols-4 max-lg:grid-cols-2 gap-x-6 gap-y-4">
        <InfoField label="Tipo de inventario" value={inventario.tipoInventario} />
        <InfoField label="Fecha" value={inventario.fecha} />
        <InfoField label="Realizado por" value={inventario.realizadoPor} />
        {esPropietario
          ? <InfoField label="Inquilino" value={`${inventario.inquilino} · firmó el ${inventario.firmadoPorInquilino}`} />
          : <InfoField label="Firmado por ti" value={inventario.firmadoPorInquilino} />}
      </div>

      <Callout>
        {esPropietario
          ? "Este inventario es la referencia para recibir tu inmueble al final del contrato. Lo realiza y actualiza la inmobiliaria; si ves algo que no coincide, "
          : "Este inventario es la referencia para la entrega del inmueble al final del contrato. Si notas algo que no coincide, no lo modifiques por tu cuenta: "}
        <LinkText onClick={onReportar} icon="chevron">{esPropietario ? "crea una solicitud" : "repórtalo como una novedad"}</LinkText>
      </Callout>

      {inventario.niveles.map((nivel) => (
        <div key={nivel.nombre} className="flex flex-col gap-3">
          {/* Con un solo nivel el encabezado sobra: el resumen de arriba ya dice cuántos ambientes hay. */}
          {inventario.niveles.length > 1 && (
            <div className="flex items-baseline justify-between gap-3">
              <span className="body-bold" style={{ color: "var(--gray-10)" }}>{nivel.nombre}</span>
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
                {plural(nivel.ambientes.length, "ambiente", "ambientes")}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {nivel.ambientes.map((a) => (
              <AmbienteFila key={`${a.tipo}-${a.nombre ?? ""}`} a={a} />
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-3">
        <span className="body-bold" style={{ color: "var(--gray-10)" }}>Notas generales</span>
        {inventario.notas.length === 0 ? (
          <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>No se registraron notas en la entrega.</span>
        ) : (
          <div className="flex flex-col gap-2">
            {inventario.notas.map((n) => (
              <div key={n.texto} className="rounded-lg flex flex-col gap-1" style={{ border: "1px solid var(--gray-4)", padding: "10px 14px" }}>
                <span className="body-regular" style={{ color: "var(--gray-10)" }}>{n.texto}</span>
                <span className="disclamer" style={{ color: "var(--gray-7)" }}>{n.fecha}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
    </div>
  );
}

/** Lista de inventarios de un inmueble (propietario): de aquí se entra a cada uno. */
export function HistorialInventarios({ inventarios, direccion, onBack, onVer }: {
  inventarios: InventarioData[];
  direccion: string;
  onBack: () => void;
  onVer: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <BackButton onClick={onBack}>Volver al contrato</BackButton>
      <section
        className="rounded-lg flex flex-col gap-4"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}
      >
        <div>
          <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Historial de inventarios · {direccion}</h2>
          <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
            {inventarios.length === 1 ? "1 inventario registrado" : `${inventarios.length} inventarios registrados`}, del más reciente al más antiguo.
          </p>
        </div>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
        <div className="flex flex-col gap-3">
          {inventarios.map((inv, i) => {
            const t = totales(inv);
            return (
              <div
                key={`${inv.tipoInventario}-${inv.fecha}`}
                className="rounded-lg flex items-center gap-4 flex-wrap transition-colors"
                style={{ border: "1px solid var(--gray-4)", padding: "14px 16px" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--gray-4)"; }}
              >
                <span
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 40, height: 40, backgroundColor: "var(--navy-light)" }}
                >
                  <ClipboardList size={19} strokeWidth={1.7} style={{ color: "var(--navy)" }} />
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="flex items-center gap-2 flex-wrap">
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>{inv.tipoInventario} · {inv.fecha}</span>
                    {i === 0 && <StatusBadge label="Más reciente" variant="registered" />}
                  </span>
                  <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>
                    {inv.realizadoPor} · Inquilino: {inv.inquilino} · {t.ambientes} ambientes · {t.fotos} fotos
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0 max-sm:w-full max-sm:justify-between">
                  {t.conObservaciones > 0
                    ? <StatusBadge label={t.conObservaciones === 1 ? "1 observación" : `${t.conObservaciones} observaciones`} variant="pending" />
                    : <StatusBadge label="Sin observaciones" variant="active" />}
                  <AppButton variant="secondary" bold onClick={() => onVer(i)}>Ver inventario</AppButton>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
