import { ArrowLeft, DollarSign, Barcode, Download } from "lucide-react";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { StatusBadge } from "./kit/StatusBadge";
import { ProgressBar } from "./kit/ProgressBar";
import { EmptyState } from "./kit/EmptyState";
import { InfoField } from "./kit/InfoField";
import { DataTable } from "./kit/DataTable";
import { PaymentOptionCard } from "./kit/PaymentOptionCard";
import { Footer } from "./kit/Footer";

interface Props {
  onBack: () => void;
}

const CONTRATO = {
  numeroBitrix: "83133",
  numeroSimi: "4368",
  fechaInicio: "2026-07-01",
  fechaFin: "2027-06-30",
  fechaIncremento: "2027-07-01",
  aseguradora: "Afianzadora nacional sa",
  mesActual: 1,
  totalMeses: 12,
};

const CUENTA = {
  numeroContrato: "6941",
  canon: "$ 1.250.000",
  saldo: "$ 371.875",
  otros: "$ 4.500",
  total: "$ 1.626.375",
  cuotas: ["2026-07-06", "2026-07-06", "2026-07-06", "2026-07-06"],
  valorCuota: "$1,626,375",
};

function FieldRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="body-regular" style={{ color: bold ? "var(--gray-10)" : "var(--gray-9)" }}>{label}</span>
      <span className={bold ? "body-bold" : "body-regular"} style={{ color: "var(--gray-10)" }}>{value}</span>
    </div>
  );
}

const CUOTAS_COLUMNS = [
  { key: "fecha", header: "Fecha límite" },
  { key: "valor", header: "Valor", align: "right" as const },
];

function SectionCard({
  title, link, headerExtra, children,
}: { title: string; link?: { label: string; onClick: () => void }; headerExtra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-lg flex flex-col gap-4" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <span className="subtitle" style={{ color: "var(--navy)" }}>{title}</span>
        <div className="flex items-center gap-4">
          {link && <LinkText icon="chevron" onClick={link.onClick}>{link.label}</LinkText>}
          {headerExtra}
        </div>
      </div>
      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
      {children}
    </section>
  );
}

export function EstadoContratoDetalle({ onBack }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 body-bold w-fit"
        style={{ cursor: "pointer", color: "var(--navy)", background: "transparent" }}
      >
        <ArrowLeft size={16} /> Volver
      </button>

      <section
        className="rounded-lg flex items-start justify-between gap-4 flex-wrap"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div>
          <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>Estado del contrato</h1>
          <p className="body-bold" style={{ color: "var(--gray-10)", marginTop: 4 }}>
            Consulta de manera sencilla y rápida toda la información de tus contratos.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <SectionCard
          title="Estado de cuenta"
          link={{ label: "Ver historial de pagos", onClick: () => {} }}
        >
          <div
            className="rounded-lg flex flex-col gap-4"
            style={{ backgroundColor: "var(--navy-light)", padding: "20px 24px" }}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="body-bold" style={{ color: "var(--navy)" }}>Canon de alquiler de julio</span>
              <StatusBadge label="Pendiente de pago" variant="pending" />
            </div>

            <hr style={{ borderColor: "rgba(26, 35, 126, 0.12)", margin: 0 }} />

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex flex-col gap-0.5">
                <span className="body-regular" style={{ color: "var(--gray-9)" }}>Total a pagar</span>
                <span className="title-primary-bold" style={{ color: "var(--navy)" }}>{CUENTA.total}</span>
              </div>
              <AppButton variant="primary" bold><Download size={15} /> Descargar estado de cuenta</AppButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <InfoField label="Número de contrato" value={CUENTA.numeroContrato} />
            <InfoField label="Canon de arrendamiento" value={CUENTA.canon} />
            <InfoField label="Saldo" value={CUENTA.saldo} />
            <InfoField label="Otros" value={CUENTA.otros} />
          </div>

          <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

          <div className="flex flex-col gap-2">
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>Historial de cuotas</span>
            <DataTable
              columns={CUOTAS_COLUMNS}
              rows={CUENTA.cuotas.map((fecha) => ({ fecha: `Hasta el ${fecha}`, valor: CUENTA.valorCuota }))}
            />
          </div>

          <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

          <div className="flex flex-col gap-3">
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>Opciones de pago</span>

            <PaymentOptionCard
              icon={DollarSign}
              title="Para pago por PSE"
              description="Paga tu alquiler fácil y seguro con PSE. Ingresa, elige tu banco y listo: ¡sin moverte de casa!"
              actionLabel="Ir a pagar"
              actionVariant="primary"
              badge={
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: 64, height: 40, backgroundColor: "var(--navy)", color: "#ffffff" }}
                >
                  <span className="tags-bold" style={{ letterSpacing: "0.04em" }}>PSE</span>
                </div>
              }
            />

            <PaymentOptionCard
              icon={Barcode}
              title="Para pago por consignación"
              description="Simplificamos tus pagos: genera tu código de barras y realiza la consignación en puntos autorizados."
              actionLabel="Generar código de barras"
              actionIcon={Barcode}
              actionVariant="secondary"
            />
          </div>
        </SectionCard>

        <div className="flex flex-col gap-5">
          <SectionCard title="Contrato" link={{ label: "Ver información del contrato", onClick: () => {} }}>
            <div className="flex items-center justify-between gap-4">
              <span className="body-regular" style={{ color: "var(--gray-9)" }}>Estado del contrato</span>
              <StatusBadge label="En ejecucion" variant="active" />
            </div>
            <div className="flex flex-col gap-1.5">
              <ProgressBar value={(CONTRATO.mesActual / CONTRATO.totalMeses) * 100} showLabel={false} />
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
                Mes {CONTRATO.mesActual} de {CONTRATO.totalMeses}
              </span>
            </div>
            <div className="flex flex-col">
              <FieldRow label="Número de contrato Bitrix" value={CONTRATO.numeroBitrix} />
              <FieldRow label="Número de contrato Simi" value={CONTRATO.numeroSimi} />
              <FieldRow label="Fecha de inicio de contrato" value={CONTRATO.fechaInicio} />
              <FieldRow label="Fecha de fin de contrato" value={CONTRATO.fechaFin} />
              <FieldRow label="Fecha de incremento" value={CONTRATO.fechaIncremento} />
              <FieldRow label="Aseguradora" value={CONTRATO.aseguradora} />
            </div>
          </SectionCard>

          <SectionCard title="Solicitudes" link={{ label: "Ver todas", onClick: () => {} }}>
            <EmptyState
              title="Todo está en orden. Si tienes algún problema o inquietud, no dudes en abrir una nueva solicitud."
              description="En Alquilando, cuando no pasa nada, también es buena señal."
              action={<AppButton variant="secondary" bold>Crear nueva solicitud</AppButton>}
            />
          </SectionCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}
