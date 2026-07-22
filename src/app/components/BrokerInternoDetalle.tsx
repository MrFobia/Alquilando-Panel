import { useState } from "react";
import { ArrowLeft, MessageCircle, Eye, Download } from "lucide-react";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { StatusBadge } from "./kit/StatusBadge";
import { InfoField } from "./kit/InfoField";
import { ProgressBar } from "./kit/ProgressBar";
import { MetricsRow } from "./kit/MetricsRow";
import { DataTable } from "./kit/DataTable";
import { TabBar } from "./kit/TabBar";
import { IconButton } from "./kit/IconButton";
import { EmptyState } from "./kit/EmptyState";
import { Footer } from "./kit/Footer";
import type { BrokerInternoRow } from "./BrokersInternos";

/* ── Estado / badges ──────────────────────────────────────────────── */

const ESTADO_BADGE = {
  activo: { label: "Activo", variant: "active" as const },
  vacaciones: { label: "Vacaciones", variant: "pending" as const },
  inactivo: { label: "Inactivo", variant: "neutral" as const },
};

const CONTRATO_INCLUSION_BADGE = {
  sin: { label: "Sin contrato", variant: "neutral" as const },
  espera: { label: "En espera de firma", variant: "pending" as const },
  firmado: { label: "Firmado", variant: "active" as const },
};

/* ── Captaciones ──────────────────────────────────────────────────── */

const CAPTACION_COLUMNS = [
  { key: "id", header: "ID", width: 90 },
  { key: "fecha", header: "Fecha", width: 110 },
  { key: "direccion", header: "Dirección" },
  { key: "tipo", header: "Tipo", width: 120 },
  { key: "zona", header: "Zona", width: 110 },
  { key: "estado", header: "Estado", width: 130 },
  { key: "contrato", header: "Contrato inclusión", width: 160 },
  { key: "acciones", header: "Acciones", width: 80 },
];

const CAPTACIONES = [
  { id: "INM-2088", fecha: "12 Jul 2026", direccion: "Cra 15 # 93-47, Apto 502", tipo: "Apartamento", zona: "Bogotá", estado: { label: "En revisión", variant: "pending" as const }, contrato: "espera" as const },
  { id: "INM-2091", fecha: "09 Jul 2026", direccion: "Cl 127 # 7-30, Casa 12", tipo: "Casa", zona: "Bogotá", estado: { label: "Borrador", variant: "neutral" as const }, contrato: "sin" as const },
  { id: "INM-2095", fecha: "04 Jul 2026", direccion: "Cra 9 # 116-20, Apto 704", tipo: "Apartamento", zona: "Bogotá", estado: { label: "En revisión", variant: "pending" as const }, contrato: "espera" as const },
];

/* ── Comercializaciones ───────────────────────────────────────────── */

const COMERCIALIZACION_COLUMNS = [
  { key: "id", header: "ID", width: 90 },
  { key: "fecha", header: "Publicado", width: 110 },
  { key: "direccion", header: "Dirección" },
  { key: "tipo", header: "Tipo", width: 120 },
  { key: "canon", header: "Canon", width: 120 },
  { key: "estado", header: "Estado", width: 130 },
  { key: "acciones", header: "Acciones", width: 80 },
];

const COMERCIALIZACIONES = [
  { id: "INM-1987", fecha: "20 Mar 2026", direccion: "Cra 9 # 80-15, Apto 301", tipo: "Apartamento", canon: "$2.400.000", estado: { label: "Publicado", variant: "active" as const } },
  { id: "INM-1998", fecha: "11 Feb 2026", direccion: "Av 19 # 104-22, Apto 802", tipo: "Apartamento", canon: "$3.100.000", estado: { label: "Arrendado", variant: "registered" as const } },
  { id: "INM-2005", fecha: "30 Ene 2026", direccion: "Cl 76 # 11-50, Local 3", tipo: "Local comercial", canon: "$4.800.000", estado: { label: "Publicado", variant: "active" as const } },
  { id: "INM-2011", fecha: "18 Ene 2026", direccion: "Cra 50 # 100-14, Apto 1204", tipo: "Apartamento", canon: "$2.750.000", estado: { label: "Publicado", variant: "active" as const } },
];

/* ── Contratos ────────────────────────────────────────────────────── */

const CONTRATO_ESTADO_BADGE = {
  ejecucion: { label: "En ejecución", variant: "active" as const },
  elaboracion: { label: "En elaboración", variant: "pending" as const },
  finalizado: { label: "Finalizado", variant: "neutral" as const },
};

const CONTRATOS_COLUMNS = [
  { key: "contrato", header: "Contrato", width: 100 },
  { key: "direccion", header: "Inmueble" },
  { key: "tipo", header: "Tipo", width: 120 },
  { key: "inicio", header: "Inicio", width: 110 },
  { key: "fin", header: "Fin", width: 110 },
  { key: "estado", header: "Estado", width: 140 },
  { key: "acciones", header: "Acciones", width: 80 },
];

const CONTRATOS = [
  { contrato: "4360", direccion: "KR 85K # 26G 53 AP 1218", tipo: "Vivienda", inicio: "01 May 2026", fin: "30 Abr 2027", estado: "ejecucion" as const },
  { contrato: "4351", direccion: "CL 81 # 109 - 10 AP 203", tipo: "Vivienda", inicio: "15 Abr 2026", fin: "14 Abr 2027", estado: "ejecucion" as const },
  { contrato: "2939", direccion: "CL 18 # 100 - 08 OF 3", tipo: "Comercial", inicio: "01 Jun 2026", fin: "31 May 2027", estado: "elaboracion" as const },
  { contrato: "4287", direccion: "CR 7 # 52 - 44 AP 511", tipo: "Vivienda", inicio: "01 Feb 2025", fin: "31 Ene 2026", estado: "finalizado" as const },
];

/* ── Componentes internos ─────────────────────────────────────────── */

function SectionCard({ children, padding = 24 }: { children: React.ReactNode; padding?: number }) {
  return (
    <section
      className="rounded-lg flex flex-col gap-4"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding }}
    >
      {children}
    </section>
  );
}

function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <span className="subtitle" style={{ color: "var(--navy)" }}>{title}</span>
      {right && <div className="flex items-center gap-3 shrink-0">{right}</div>}
    </div>
  );
}

interface Props {
  broker: BrokerInternoRow;
  onBack: () => void;
}

const TAB_TITLES: Record<string, string> = {
  captaciones: "Inmuebles en Captación",
  comercializaciones: "Inmuebles en Comercialización",
  perfil: "Perfil del Broker Interno",
  contratos: "Contratos gestionados",
};

export function BrokerInternoDetalle({ broker, onBack }: Props) {
  const [tab, setTab] = useState("captaciones");
  const badge = ESTADO_BADGE[broker.estado];

  const [nombre1 = "-", nombre2 = "-", apellido1 = "-", apellido2 = "-"] = broker.nombre.split(" ");

  const METRICS = [
    { label: "Contratos (Mes actual)", value: broker.contratosMes },
    { label: "Contratos (Año actual)", value: broker.contratosAno },
    { label: "Captaciones activas", value: String(CAPTACIONES.length) },
    { label: "Comercializando", value: String(COMERCIALIZACIONES.length) },
  ];

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 body-bold w-fit"
        style={{ cursor: "pointer", color: "var(--navy)", background: "transparent" }}
      >
        <ArrowLeft size={16} /> Volver a Brokers Internos
      </button>

      {/* Cabecera */}
      <section
        className="rounded-lg flex items-start justify-between gap-4 flex-wrap"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>{broker.nombre}</h1>
          <span className="subtitle" style={{ color: "var(--gray-10)" }}>
            Documento: {broker.id} · Zona {broker.zona}
          </span>
          <div><StatusBadge label={badge.label} variant={badge.variant} /></div>
        </div>
        <div className="flex items-end gap-3 shrink-0">
          <AppButton variant="ghost" bold>
            <MessageCircle size={16} style={{ color: "#25D366" }} /> Contactar
          </AppButton>
          <AppButton variant="secondary" bold>Editar perfil</AppButton>
        </div>
      </section>

      <MetricsRow metrics={METRICS} />

      <TabBar
        tabs={[
          { id: "captaciones", label: "Captaciones", count: CAPTACIONES.length },
          { id: "comercializaciones", label: "Comercializaciones", count: COMERCIALIZACIONES.length },
          { id: "perfil", label: "Perfil" },
          { id: "contratos", label: "Contratos", count: CONTRATOS.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      <SectionCard>
        <SectionHeader
          title={TAB_TITLES[tab]}
          right={tab === "perfil" ? <LinkText icon="chevron">Editar</LinkText> : undefined}
        />
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        {/* ── Captaciones ─────────────────────────────────────────── */}
        {tab === "captaciones" && (
          CAPTACIONES.length > 0 ? (
            <DataTable
              columns={CAPTACION_COLUMNS}
              rows={CAPTACIONES.map((r) => ({
                ...r,
                estado: <StatusBadge label={r.estado.label} variant={r.estado.variant} />,
                contrato: <StatusBadge label={CONTRATO_INCLUSION_BADGE[r.contrato].label} variant={CONTRATO_INCLUSION_BADGE[r.contrato].variant} />,
                acciones: <IconButton icon={Eye} title="Ver inmueble" />,
              }))}
            />
          ) : (
            <EmptyState title="Sin captaciones" description="Este broker no tiene inmuebles en proceso de captación." />
          )
        )}

        {/* ── Comercializaciones ──────────────────────────────────── */}
        {tab === "comercializaciones" && (
          COMERCIALIZACIONES.length > 0 ? (
            <DataTable
              columns={COMERCIALIZACION_COLUMNS}
              rows={COMERCIALIZACIONES.map((r) => ({
                ...r,
                estado: <StatusBadge label={r.estado.label} variant={r.estado.variant} />,
                acciones: <IconButton icon={Eye} title="Ver inmueble" />,
              }))}
            />
          ) : (
            <EmptyState title="Sin comercializaciones" description="Este broker no tiene inmuebles en comercialización." />
          )
        )}

        {/* ── Perfil ──────────────────────────────────────────────── */}
        {tab === "perfil" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-x-6 gap-y-5 max-lg:grid-cols-2">
              <InfoField label="Tipo de documento" value="Cédula de ciudadanía" />
              <InfoField label="Número del documento" value={broker.id} />
              <InfoField label="Fecha de ingreso" value="03 Feb 2024" />
              <InfoField label="Estado" value={<StatusBadge label={badge.label} variant={badge.variant} />} />
              <InfoField label="Primer nombre" value={nombre1} />
              <InfoField label="Segundo nombre" value={nombre2} />
              <InfoField label="Primer apellido" value={apellido1} />
              <InfoField label="Segundo apellido" value={apellido2} />
              <InfoField
                label="Celular"
                value={
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle size={16} style={{ color: "#25D366" }} />
                    +57 310 987 6543
                  </span>
                }
              />
              <InfoField label="Correo electrónico" value={`${nombre1.toLowerCase()}.${apellido1.toLowerCase()}@alquilando.com`} />
              <InfoField label="Zona asignada" value={broker.zona} />
              <InfoField label="Líder comercial" value="Camila Rincón" />
            </div>

            <div className="flex items-center gap-3" style={{ marginTop: 8 }}>
              <span className="body-bold" style={{ color: "var(--navy)", whiteSpace: "nowrap" }}>
                Desempeño
              </span>
              <hr className="flex-1" style={{ borderColor: "var(--gray-5)", margin: 0 }} />
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <InfoField label="Contratos mes actual" value={broker.contratosMes} />
              <InfoField label="Contratos año actual" value={broker.contratosAno} />
              <div className="col-span-full flex flex-col gap-2">
                <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
                  Cumplimiento de meta
                </span>
                <ProgressBar value={broker.cumplimiento} />
              </div>
            </div>
          </div>
        )}

        {/* ── Contratos ───────────────────────────────────────────── */}
        {tab === "contratos" && (
          CONTRATOS.length > 0 ? (
            <DataTable
              columns={CONTRATOS_COLUMNS}
              rows={CONTRATOS.map((r) => ({
                ...r,
                estado: <StatusBadge label={CONTRATO_ESTADO_BADGE[r.estado].label} variant={CONTRATO_ESTADO_BADGE[r.estado].variant} />,
                acciones: (
                  <div className="flex items-center gap-1">
                    <IconButton icon={Eye} title="Ver contrato" />
                    <IconButton icon={Download} title="Descargar" />
                  </div>
                ),
              }))}
            />
          ) : (
            <EmptyState title="Sin contratos" description="Este broker aún no tiene contratos gestionados." />
          )
        )}
      </SectionCard>

      <Footer />
    </div>
  );
}
