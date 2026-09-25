import { useEffect, useState } from "react";
import {
  Home, LayoutGrid, List, Eye, CalendarClock, TrendingUp, Wrench, CircleCheck,
  FileSignature, Download, MessageSquarePlus, CalendarCheck, Flag, BellRing, Building2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppButton } from "./kit/AppButton";
import { BackButton } from "./kit/BackButton";
import { Callout } from "./kit/Callout";
import { DataTable } from "./kit/DataTable";
import { DocumentCard } from "./kit/DocumentCard";
import { EmptyState } from "./kit/EmptyState";
import { IconButton } from "./kit/IconButton";
import { InfoField } from "./kit/InfoField";
import { LinkText } from "./kit/LinkText";
import { StatusBadge } from "./kit/StatusBadge";
import { EstadoCuenta, ESTADOS_CUENTA } from "./EstadoCuenta";
import bannerContratoImg from "../../assets/banner-contrato.webp";
import { InventarioInquilino, ResumenInventario, INVENTARIOS } from "./InventarioInquilino";

// ─── Datos ───────────────────────────────────────────────────────────────────

type EstadoPago = "al-dia" | "pendiente" | "en-mora";

interface SolicitudContrato {
  id: string;
  titulo: string;
  fecha: string;
  estado: "abierta" | "cerrada";
}

interface Contrato {
  numero: string;
  direccion: string;
  tipo: string;
  ciudad: string;
  administradoPor: string;
  aseguradora: string;
  canon: string;
  administracion: string | null;
  /** ISO yyyy-mm-dd */
  inicio: string;
  fin: string;
  /** null = todavía no hay incremento programado (p. ej. se define al renovar). */
  proximoIncremento: string | null;
  reglaIncremento: string;
  diaPago: string;
  estadoPago: EstadoPago;
  mesPago: string;
  solicitudes: SolicitudContrato[];
  documentos: { nombre: string; meta: string }[];
}

const CONTRATOS: Contrato[] = [
  {
    numero: "1731",
    direccion: "Carrera 23 # 45 - 34 sur",
    tipo: "Apartamento",
    ciudad: "Bogotá",
    administradoPor: "Inmobiliaria Maestra",
    aseguradora: "El Libertador",
    canon: "$6.980.963",
    administracion: "$1.222.358",
    inicio: "2025-03-01",
    fin: "2027-02-28",
    proximoIncremento: "2027-03-01",
    reglaIncremento: "IPC del año anterior",
    diaPago: "Primeros 5 días de cada mes",
    estadoPago: "pendiente",
    mesPago: "julio",
    solicitudes: [
      { id: "SOL-2291", titulo: "Revisión de calentador de gas", fecha: "2026-05-12", estado: "cerrada" },
    ],
    documentos: [
      { nombre: "Contrato de arrendamiento firmado.pdf", meta: "Firmado el 20 feb 2025 · 1,2 MB" },
      { nombre: "Acta de entrega del inmueble.pdf", meta: "01 mar 2025 · 840 KB" },
      { nombre: "Inventario inicial.pdf", meta: "01 mar 2025 · 3,4 MB" },
      { nombre: "Otrosí incremento 2026.pdf", meta: "01 mar 2026 · 210 KB" },
    ],
  },
  {
    numero: "2048",
    direccion: "Calle 80 # 12 - 08, apto 502",
    tipo: "Apartamento",
    ciudad: "Bogotá",
    administradoPor: "Inmobiliaria Maestra",
    aseguradora: "El Libertador",
    canon: "$1.315.000",
    administracion: null,
    inicio: "2025-11-15",
    fin: "2026-11-14",
    proximoIncremento: null,
    reglaIncremento: "IPC del año anterior",
    diaPago: "Primeros 5 días de cada mes",
    estadoPago: "al-dia",
    mesPago: "septiembre",
    solicitudes: [
      { id: "SOL-2417", titulo: "Filtración en el baño principal", fecha: "2026-09-08", estado: "abierta" },
    ],
    documentos: [
      { nombre: "Contrato de arrendamiento firmado.pdf", meta: "Firmado el 10 nov 2025 · 1,1 MB" },
      { nombre: "Acta de entrega del inmueble.pdf", meta: "15 nov 2025 · 790 KB" },
    ],
  },
];

/** Ley 820: el inquilino debe avisar con 3 meses de anticipación si no renueva. */
const MESES_PREAVISO = 3;
/** A partir de cuántos días antes del fin se marca "Por renovar". */
const DIAS_POR_RENOVAR = 90;

const ESTADO_PAGO: Record<EstadoPago, { label: string; variant: "active" | "pending" | "rejected" }> = {
  "al-dia": { label: "Al día", variant: "active" },
  pendiente: { label: "Pendiente", variant: "pending" },
  "en-mora": { label: "En mora", variant: "rejected" },
};

// ─── Helpers de fecha ────────────────────────────────────────────────────────

const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const parseISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const fecha = (iso: string) => {
  const d = parseISO(iso);
  return `${String(d.getDate()).padStart(2, "0")} ${MESES_CORTOS[d.getMonth()]} ${d.getFullYear()}`;
};

const DIA_MS = 86_400_000;

function vigencia(c: Contrato, hoy = new Date()) {
  const fin = parseISO(c.fin).getTime();
  const diasRestantes = Math.ceil((fin - hoy.getTime()) / DIA_MS);
  const preaviso = parseISO(c.fin);
  preaviso.setMonth(preaviso.getMonth() - MESES_PREAVISO);
  return {
    diasRestantes,
    porRenovar: diasRestantes >= 0 && diasRestantes <= DIAS_POR_RENOVAR,
    terminado: diasRestantes < 0,
    preaviso,
    preavisoVencido: hoy.getTime() > preaviso.getTime(),
  };
}

const fechaDeDate = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")} ${MESES_CORTOS[d.getMonth()]} ${d.getFullYear()}`;

// ─── Piezas compartidas ──────────────────────────────────────────────────────

function EstadoContratoBadge({ c }: { c: Contrato }) {
  const v = vigencia(c);
  if (v.terminado) return <StatusBadge label="Terminado" variant="neutral" />;
  if (v.porRenovar) return <StatusBadge label="Por renovar" variant="pending" />;
  return <StatusBadge label="Vigente" variant="active" />;
}

function Pendiente({ children }: { children: React.ReactNode }) {
  return <span className="body-small-regular" style={{ color: "var(--gray-8)", fontWeight: 400 }}>{children}</span>;
}

function Dato({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="flex items-center gap-1.5 body-small-regular" style={{ color: "var(--gray-8)" }}>
        <Icon size={14} strokeWidth={1.7} /> {label}
      </span>
      <div className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 500 }}>{children}</div>
    </div>
  );
}

function ResumenSolicitudes({ c }: { c: Contrato }) {
  const abiertas = c.solicitudes.filter((s) => s.estado === "abierta").length;
  if (abiertas === 0) {
    return (
      <span className="flex items-center gap-1.5 body-small-regular" style={{ color: "var(--gray-9)" }}>
        <CircleCheck size={15} strokeWidth={1.8} style={{ color: "var(--green-status)" }} />
        Sin solicitudes abiertas
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 body-small-bold" style={{ color: "var(--orange-status)" }}>
      <Wrench size={15} strokeWidth={1.8} />
      {abiertas === 1 ? "1 solicitud abierta" : `${abiertas} solicitudes abiertas`}
    </span>
  );
}

// ─── Listado ─────────────────────────────────────────────────────────────────

function ContratoCard({ c, onGestionar }: { c: Contrato; onGestionar: () => void }) {
  const pago = ESTADO_PAGO[c.estadoPago];
  return (
    <article
      className="rounded-lg flex flex-col overflow-hidden transition-colors"
      style={{ border: "1px solid var(--gray-4)", backgroundColor: "#ffffff" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--gray-4)"; }}
    >
      {/* Cabecera: inmueble + estado del contrato */}
      <div className="flex items-start justify-between gap-3 max-sm:flex-col-reverse max-sm:gap-2" style={{ padding: "18px 20px 14px" }}>
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="flex items-center justify-center rounded-full shrink-0 max-sm:hidden"
            style={{ width: 40, height: 40, backgroundColor: "var(--navy-light)" }}
          >
            <Home size={19} strokeWidth={1.7} style={{ color: "var(--navy)" }} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="body-xl-bold" style={{ color: "var(--gray-10)" }}>{c.direccion}</span>
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>
              {c.tipo} · {c.ciudad} · Contrato N.º {c.numero}
            </span>
          </div>
        </div>
        <div className="shrink-0"><EstadoContratoBadge c={c} /></div>
      </div>

      <hr style={{ borderColor: "var(--gray-3)", margin: "0 20px" }} />

      {/* Datos clave */}
      <div className="grid grid-cols-3 max-sm:grid-cols-2 gap-x-4 gap-y-4" style={{ padding: "16px 20px 20px" }}>
        <Dato icon={CalendarCheck} label="Canon mensual">{c.canon}</Dato>
        <Dato icon={CalendarClock} label={`Pago de ${c.mesPago}`}>
          <StatusBadge label={pago.label} variant={pago.variant} />
        </Dato>
        <Dato icon={TrendingUp} label="Próximo incremento">
          {c.proximoIncremento ? fecha(c.proximoIncremento) : <Pendiente>Se define al renovar</Pendiente>}
        </Dato>
      </div>


      {/* Footer: solicitudes + acción */}
      <div
        className="flex items-center justify-between gap-3 flex-wrap mt-auto"
        style={{ padding: "12px 20px", backgroundColor: "var(--gray-1)" }}
      >
        <ResumenSolicitudes c={c} />
        <AppButton variant="secondary" bold onClick={onGestionar}>Gestionar contrato</AppButton>
      </div>
    </article>
  );
}

const COLUMNS = [
  { key: "inmueble", header: "Inmueble", width: "28%" },
  { key: "numero", header: "Contrato", width: "10%" },
  { key: "estado", header: "Estado", width: "13%" },
  { key: "pago", header: "Pago del mes", width: "13%" },
  { key: "canon", header: "Canon", align: "right" as const, width: "13%" },
  { key: "incremento", header: "Próx. incremento", width: "14%" },
  { key: "solicitudes", header: "Solicitudes", align: "center" as const, width: "11%" },
  { key: "ver", header: "", align: "center" as const, width: 56 },
];

function ListadoContratos({ onGestionar }: { onGestionar: (numero: string) => void }) {
  const [vista, setVista] = useState<"grid" | "list">("grid");
  const porRenovar = CONTRATOS.filter((c) => vigencia(c).porRenovar);
  const abiertas = CONTRATOS.reduce((n, c) => n + c.solicitudes.filter((s) => s.estado === "abierta").length, 0);

  const rows = CONTRATOS.map((c) => {
    const pago = ESTADO_PAGO[c.estadoPago];
    const abiertasC = c.solicitudes.filter((s) => s.estado === "abierta").length;
    return {
      inmueble: c.direccion,
      numero: c.numero,
      estado: <EstadoContratoBadge c={c} />,
      pago: <StatusBadge label={pago.label} variant={pago.variant} />,
      canon: c.canon,
      incremento: c.proximoIncremento ? fecha(c.proximoIncremento) : <Pendiente>Al renovar</Pendiente>,
      solicitudes: abiertasC > 0
        ? <span className="body-bold" style={{ color: "var(--orange-status)" }}>{abiertasC}</span>
        : <Pendiente>0</Pendiente>,
      ver: <IconButton icon={Eye} title="Gestionar contrato" onClick={() => onGestionar(c.numero)} />,
    };
  });

  return (
    <div className="flex flex-col gap-5">
      {porRenovar.map((c) => {
        const v = vigencia(c);
        return (
          <Callout key={c.numero} variant="warning" title={`Tu contrato de ${c.direccion} termina el ${fecha(c.fin)}`}>
            {v.preavisoVencido
              ? "Ya pasó la fecha de preaviso, así que el contrato se renovará automáticamente. Si necesitas entregar el inmueble, habla con tu asesor."
              : `Si no vas a renovar, avísanos antes del ${fechaDeDate(v.preaviso)}. Si no dices nada, se renueva automáticamente.`}{" "}
            <LinkText size="regular" icon="chevron" onClick={() => onGestionar(c.numero)}>Revisar contrato</LinkText>
          </Callout>
        );
      })}

      <section
        className="rounded-lg flex flex-col gap-4 p-4 sm:px-6 sm:py-[22px]"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)" }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Lista de contratos</h2>
            <p className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
              {CONTRATOS.length === 1 ? "Tienes 1 contrato" : `Tienes ${CONTRATOS.length} contratos`}
              {porRenovar.length > 0 && ` · ${porRenovar.length} por renovar`}
              {abiertas > 0 && ` · ${abiertas} solicitud${abiertas > 1 ? "es" : ""} abierta${abiertas > 1 ? "s" : ""}`}.
            </p>
          </div>
          {/* La tabla no cabe en mobile: allí solo hay tarjetas. */}
          <div className="flex items-center gap-1 max-md:hidden">
            <IconButton icon={LayoutGrid} title="Vista de tarjetas" active={vista === "grid"} onClick={() => setVista("grid")} />
            <IconButton icon={List} title="Vista de lista" active={vista === "list"} onClick={() => setVista("list")} />
          </div>
        </div>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        {CONTRATOS.length === 0 ? (
          <EmptyState
            icon={FileSignature}
            title="Aún no tienes contratos"
            description="Cuando firmes tu contrato de arrendamiento con Alquilando, lo verás aquí con sus fechas y documentos."
          />
        ) : (
          <>
            <div className={`grid grid-cols-2 gap-4 max-lg:grid-cols-1 ${vista === "list" ? "md:hidden" : ""}`}>
              {CONTRATOS.map((c) => (
                <ContratoCard key={c.numero} c={c} onGestionar={() => onGestionar(c.numero)} />
              ))}
            </div>
            {vista === "list" && (
              <div className="max-md:hidden">
                <DataTable columns={COLUMNS} rows={rows} onRowClick={(i) => onGestionar(CONTRATOS[i].numero)} />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

// ─── Detalle ─────────────────────────────────────────────────────────────────

interface Hito {
  icon: LucideIcon;
  titulo: string;
  fecha: string;
  nota?: string;
  estado: "hecho" | "proximo" | "futuro";
  /** Solo para ordenar. */
  t: number;
}

function hitos(c: Contrato): Hito[] {
  const v = vigencia(c);
  const hoy = Date.now();
  const estadoDe = (t: number): Hito["estado"] => (t <= hoy ? "hecho" : "futuro");
  const lista: Hito[] = [
    { icon: FileSignature, titulo: "Inicio del contrato", fecha: fecha(c.inicio), estado: "hecho", t: parseISO(c.inicio).getTime() },
  ];
  if (c.proximoIncremento) {
    lista.push({
      icon: TrendingUp,
      titulo: "Incremento del canon",
      fecha: fecha(c.proximoIncremento),
      nota: c.reglaIncremento,
      estado: estadoDe(parseISO(c.proximoIncremento).getTime()),
      t: parseISO(c.proximoIncremento).getTime(),
    });
  }
  lista.push({
    icon: BellRing,
    titulo: "Límite para avisar si no renuevas",
    fecha: fechaDeDate(v.preaviso),
    nota: `${MESES_PREAVISO} meses antes del fin`,
    estado: estadoDe(v.preaviso.getTime()),
    t: v.preaviso.getTime(),
  });
  lista.push({
    icon: Flag,
    titulo: "Fin del contrato",
    fecha: fecha(c.fin),
    nota: "Se renueva automáticamente si nadie avisa",
    estado: estadoDe(parseISO(c.fin).getTime()),
    t: parseISO(c.fin).getTime(),
  });
  lista.sort((a, b) => a.t - b.t);
  const primeroFuturo = lista.find((h) => h.estado === "futuro");
  if (primeroFuturo) primeroFuturo.estado = "proximo";
  return lista;
}

function LineaDeTiempo({ c }: { c: Contrato }) {
  const items = hitos(c);
  return (
    <ol className="flex flex-col" style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {items.map((h, i) => {
        const Icon = h.icon;
        const hecho = h.estado === "hecho";
        const proximo = h.estado === "proximo";
        return (
          <li key={h.titulo} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="flex items-center justify-center rounded-full shrink-0"
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: proximo ? "var(--navy)" : hecho ? "var(--navy-light)" : "#ffffff",
                  border: proximo || hecho ? "none" : "1.5px solid var(--gray-5)",
                }}
              >
                <Icon size={15} strokeWidth={1.8} style={{ color: proximo ? "#ffffff" : hecho ? "var(--navy)" : "var(--gray-8)" }} />
              </div>
              {i < items.length - 1 && (
                <div className="flex-1" style={{ width: 2, minHeight: 16, backgroundColor: hecho ? "var(--navy-light)" : "var(--gray-3)" }} />
              )}
            </div>
            <div className="flex flex-col pb-4 min-w-0" style={{ paddingTop: 5 }}>
              <span className={proximo ? "body-bold" : "body-regular"} style={{ color: hecho ? "var(--gray-9)" : "var(--gray-10)" }}>
                {h.titulo}
              </span>
              <span className="body-small-regular" style={{ color: proximo ? "var(--navy)" : "var(--gray-8)", fontWeight: proximo ? 600 : 400 }}>
                {h.fecha}{h.nota ? ` · ${h.nota}` : ""}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Tarjeta({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section
      className="rounded-lg flex flex-col gap-4"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Banner de marca: mismo mensaje del portal actual, con el personaje de alquilando.com. */
function BannerAlquilando() {
  return (
    <section
      className="rounded-lg flex items-end gap-2 overflow-hidden"
      style={{ backgroundColor: "var(--navy)", padding: "22px 0 0 24px" }}
    >
      <div className="flex flex-col gap-2 flex-1 min-w-0" style={{ paddingBottom: 22 }}>
        <h2 className="body-xl-bold" style={{ color: "var(--alquilando)", margin: 0 }}>
          Llegó Alquilando: la primera plataforma de autogestión inmobiliaria
        </h2>
        <p className="body-small-regular" style={{ color: "#ffffff", margin: 0 }}>
          Gestiona tus contratos, documentos y pagos, y vive una experiencia inmobiliaria más simple y conectada.
        </p>
      </div>
      <img
        src={bannerContratoImg}
        alt=""
        className="shrink-0 self-end"
        style={{ width: "44%", maxWidth: 220, height: "auto", display: "block" }}
      />
    </section>
  );
}

interface DetalleProps {
  c: Contrato;
  onBack: () => void;
  onIrAPagos: () => void;
  onIrASolicitudes: () => void;
  onVerInventario: () => void;
}

function ContratoDetalle({ c, onBack, onIrAPagos, onIrASolicitudes, onVerInventario }: DetalleProps) {
  const v = vigencia(c);

  return (
    <div className="flex flex-col gap-5">
      <BackButton onClick={onBack}>Volver a mis contratos</BackButton>

      {/* Resumen */}
      <section
        className="rounded-lg flex flex-col gap-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: 48, height: 48, backgroundColor: "var(--navy-light)" }}
            >
              <Home size={22} strokeWidth={1.7} style={{ color: "var(--navy)" }} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="title-tertiary-bold" style={{ color: "var(--gray-10)" }}>{c.direccion}</h2>
                <EstadoContratoBadge c={c} />
              </div>
              <span className="body-small-regular" style={{ color: "var(--gray-9)", marginTop: 2 }}>
                {c.tipo} · {c.ciudad} · Contrato N.º {c.numero}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap max-sm:w-full">
            <AppButton variant="secondary" bold onClick={onIrASolicitudes} className="max-sm:flex-1">
              <MessageSquarePlus size={16} strokeWidth={2} /> Reportar novedad
            </AppButton>
            <AppButton variant="primary" bold className="max-sm:flex-1">
              <Download size={16} strokeWidth={2} /> Descargar contrato
            </AppButton>
          </div>
        </div>

        {v.porRenovar && (
          <Callout variant="warning" title={v.preavisoVencido ? "Tu contrato se renovará automáticamente" : "Tu contrato está por terminar"}>
            {v.preavisoVencido
              ? `El plazo para avisar que no renuevas venció el ${fechaDeDate(v.preaviso)}. Si necesitas entregar el inmueble, habla con tu asesor para revisar tu caso.`
              : `Si no vas a renovar, avísanos antes del ${fechaDeDate(v.preaviso)}.`}
          </Callout>
        )}
      </section>

      <div className="grid grid-cols-[3fr_2fr] max-lg:grid-cols-1 gap-5 items-start">
        <div className="flex flex-col gap-5">
          {ESTADOS_CUENTA[c.numero] && <EstadoCuenta datos={ESTADOS_CUENTA[c.numero]} onVerHistorial={onIrAPagos} />}

          <Tarjeta title="Condiciones">
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-x-6 gap-y-4">
              <InfoField label="Canon mensual" value={c.canon} />
              <InfoField
                label="Administración"
                value={c.administracion ?? <Pendiente>Incluida en el canon</Pendiente>}
              />
              <InfoField label="Fecha de pago" value={c.diaPago} />
              <InfoField label="Incremento anual" value={c.reglaIncremento} />
              <InfoField
                label="Próximo incremento"
                value={c.proximoIncremento ? fecha(c.proximoIncremento) : <Pendiente>Se define al renovar</Pendiente>}
              />
              <InfoField label="Vigencia" value={`${fecha(c.inicio)} – ${fecha(c.fin)}`} />
              <InfoField label="Aseguradora" value={c.aseguradora} />
              <InfoField
                label="Administrado por"
                value={<span className="inline-flex items-center gap-1.5"><Building2 size={14} strokeWidth={1.7} style={{ color: "var(--gray-8)" }} />{c.administradoPor}</span>}
              />
            </div>
          </Tarjeta>

          <Tarjeta title="Documentos">
            <div className="flex flex-col gap-2">
              {c.documentos.map((d) => (
                <DocumentCard key={d.nombre} name={d.nombre} meta={d.meta} onView={() => {}} onDownload={() => {}} />
              ))}
            </div>
          </Tarjeta>
        </div>

        <div className="flex flex-col gap-5">
          <Tarjeta title="Fechas clave">
            <LineaDeTiempo c={c} />
          </Tarjeta>

          <Tarjeta
            title="Solicitudes"
            action={<LinkText size="small" icon="chevron" onClick={onIrASolicitudes}>Ver todas</LinkText>}
          >
            {c.solicitudes.length === 0 ? (
              <p className="body-small-regular" style={{ color: "var(--gray-9)", margin: 0 }}>
                No has reportado novedades en este inmueble.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {c.solicitudes.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 rounded-lg"
                    style={{ border: "1px solid var(--gray-4)", padding: "12px 14px" }}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="body-small-bold" style={{ color: "var(--gray-10)" }}>{s.titulo}</span>
                      <span className="disclamer" style={{ color: "var(--gray-8)" }}>{s.id} · {fecha(s.fecha)}</span>
                    </div>
                    {s.estado === "abierta"
                      ? <StatusBadge label="En proceso" variant="pending" />
                      : <StatusBadge label="Cerrada" variant="neutral" />}
                  </div>
                ))}
              </div>
            )}
          </Tarjeta>

          {INVENTARIOS[c.numero] && <ResumenInventario inventario={INVENTARIOS[c.numero]} onVer={onVerInventario} />}

          <BannerAlquilando />
        </div>
      </div>
    </div>
  );
}

// ─── Sección ─────────────────────────────────────────────────────────────────

interface Props {
  onIrAPagos: () => void;
  onIrASolicitudes: () => void;
}

export function MisContratos({ onIrAPagos, onIrASolicitudes }: Props) {
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [verInventario, setVerInventario] = useState(false);
  // Cambiar de vista dentro de la sección debe arrancar arriba, no donde estaba el scroll.
  useEffect(() => { document.querySelector("main")?.scrollTo({ top: 0 }); }, [seleccionado, verInventario]);
  const contrato = CONTRATOS.find((c) => c.numero === seleccionado) ?? null;

  if (contrato && verInventario && INVENTARIOS[contrato.numero]) {
    return (
      <InventarioInquilino
        inventario={INVENTARIOS[contrato.numero]}
        direccion={contrato.direccion}
        onBack={() => setVerInventario(false)}
        onReportar={onIrASolicitudes}
      />
    );
  }

  if (contrato) {
    return (
      <ContratoDetalle
        c={contrato}
        onBack={() => setSeleccionado(null)}
        onIrAPagos={onIrAPagos}
        onIrASolicitudes={onIrASolicitudes}
        onVerInventario={() => setVerInventario(true)}
      />
    );
  }
  return <ListadoContratos onGestionar={setSeleccionado} />;
}
