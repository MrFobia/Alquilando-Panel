import { ArrowLeft, Eye, ExternalLink } from "lucide-react";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { IconButton } from "./kit/IconButton";
import { Footer } from "./kit/Footer";
import { EstadoBadge } from "./Solicitudes";
import type { Solicitud } from "./Solicitudes";

interface Props {
  solicitud: Solicitud;
  onBack: () => void;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-lg flex flex-col gap-4"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
    >
      <span className="subtitle" style={{ color: "var(--navy)" }}>{title}</span>
      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="body-bold shrink-0" style={{ color: "var(--gray-10)" }}>{label}</span>
      <span className="body-regular text-right" style={{ color: "var(--gray-9)" }}>{value}</span>
    </div>
  );
}

function LinkValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 justify-end">
      <LinkText size="small">{children}</LinkText>
      <IconButton icon={Eye} title="Ver" />
    </span>
  );
}

const PRIORIDAD_COLOR: Record<string, { bg: string; color: string }> = {
  Alta: { bg: "var(--red-status-light)", color: "var(--red-status)" },
  Media: { bg: "var(--orange-status-light)", color: "var(--orange-status)" },
  Baja: { bg: "var(--green-status-light)", color: "var(--green-status)" },
};

function PrioridadBadge({ nivel }: { nivel: string }) {
  const c = PRIORIDAD_COLOR[nivel] ?? { bg: "var(--gray-4)", color: "var(--gray-9)" };
  return (
    <span className="tags px-3 py-1 rounded-full inline-block" style={{ backgroundColor: c.bg, color: c.color, border: `1px solid ${c.color}` }}>
      {nivel}
    </span>
  );
}

export function SolicitudDetalle({ solicitud, onBack }: Props) {
  const ticket = solicitud.titulo.match(/#(\d+)/)?.[1] ?? "—";

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 body-bold w-fit"
        style={{ cursor: "pointer", color: "var(--navy)", background: "transparent" }}
      >
        <ArrowLeft size={16} /> Volver
      </button>

      {/* Header */}
      <section
        className="rounded-lg flex items-start justify-between gap-4 flex-wrap"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>{solicitud.titulo}</h1>
          <div><EstadoBadge estado={solicitud.estado} /></div>
        </div>
        <AppButton variant="primary" bold>
          <ExternalLink size={15} /> Gestionar en BITRIX
        </AppButton>
      </section>

      {/* Dos columnas */}
      <div className="flex gap-5 items-start max-lg:flex-col">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-5 flex-1 min-w-0 max-lg:w-full">
          <SectionCard title="Datos de la solicitud">
            <Row label="Estado de la solicitud" value={<EstadoBadge estado={solicitud.estado} />} />
            <Row label="Código Simi" value={solicitud.codigo} />
            <Row label="Número de contrato Alquilando" value={<LinkValue>6188</LinkValue>} />
            <Row label="Medio de comunicación" value="Webform" />
            <Row label="Tipo de solicitud" value="Servicio al cliente" />
            <Row label="Dirección del inmueble" value={<LinkValue>{solicitud.direccion}</LinkValue>} />
            <Row label="Información adicional" value="—" />

            <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

            <div className="flex flex-col gap-1">
              <span className="body-bold" style={{ color: "var(--navy)" }}>Descripción de la solicitud</span>
              <p className="body-regular" style={{ color: "var(--gray-9)", margin: 0 }}>
                Arrendataria solicita la actualización y habilitación del código de barras y del medio de pago PSE en la
                plataforma, con el fin de realizar el pago anticipado de los cánones de arrendamiento correspondientes a los
                meses de julio, agosto y septiembre de 2026. Adicionalmente, se solicita que la plataforma quede habilitada
                para efectuar dichos pagos entre los días 23 y 26 de junio de 2026.
              </p>
            </div>

            <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

            <div className="flex flex-col gap-2">
              <span className="body-bold" style={{ color: "var(--navy)" }}>Comentarios</span>
              <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>No hay comentarios registrados.</span>
            </div>
          </SectionCard>

          <SectionCard title="Arrendatario">
            <Row label="Nombre" value={<LinkValue>Ruth Prieto</LinkValue>} />
            <Row label="Teléfono" value="3202751416" />
          </SectionCard>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-5 flex-1 min-w-0 max-lg:w-full">
          <SectionCard title="Datos de la operación">
            <Row label="Número de ticket" value={ticket} />
            <Row label="Prioridad" value={<PrioridadBadge nivel="Alta" />} />
            <Row label="Fecha de creación del ticket" value={solicitud.fecha} />
            <Row label="Fecha de la última gestión" value={solicitud.fecha.slice(0, 10)} />
            <Row label="Nombre del ejecutivo" value="Juan Rozo" />
            <Row label="Encargado en Alquilando" value="Lorena Ramírez" />
          </SectionCard>

          <SectionCard title="Responsable de ejecución">
            <Row label="Contratista" value="—" />
            <Row label="Responsable" value="Lorena Ramírez" />
            <div><LinkText icon="chevron">Informe inicial</LinkText></div>
          </SectionCard>

          <SectionCard title="Propietario">
            <Row label="Nombre" value={<LinkValue>Jenny Quiroz</LinkValue>} />
            <Row label="Teléfono" value="61466996895" />
          </SectionCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}
