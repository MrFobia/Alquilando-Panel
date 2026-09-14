import {
  TrendingUp,
  CalendarClock,
  CalendarDays,
  AlertTriangle,
  WalletMinimal,
  RefreshCw,
} from "lucide-react";
import { SectionCard } from "./SectionCard";
import { StatusBadge } from "./StatusBadge";
import { DataTable } from "./DataTable";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "./Skeleton";
import { Callout } from "./Callout";
import { AppButton } from "./AppButton";
import {
  ESTADO_PAGO,
  NIVEL_HABITO,
  REGLAS_PAGO_PROPUESTAS,
  calcularHabito,
  etiquetaPeriodo,
  formatoMoneda,
  type PagoHistorico,
} from "../../data/habitoPago";

interface Props {
  pagos: PagoHistorico[];
  /** Contrato al que pertenece el histórico; se muestra como referencia. */
  numeroContrato?: string;
  title?: string;
  /** Estado de carga del histórico */
  loading?: boolean;
  /** Mensaje de error devuelto por el servicio de recaudo */
  error?: string | null;
  /** Periodos del rango consultado que el backend no pudo resolver */
  periodosSinDato?: number;
  onReintentar?: () => void;
}

const RING_SIZE = 132;
const RING_STROKE = 12;

function Ring({ value, color }: { value: number; color: string }) {
  const r = (RING_SIZE - RING_STROKE) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      className="relative shrink-0"
      style={{ width: RING_SIZE, height: RING_SIZE }}
    >
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={r}
          fill="none"
          stroke="var(--gray-3)"
          strokeWidth={RING_STROKE}
        />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.max(0, Math.min(100, value))) / 100}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span
          className="title-primary-bold"
          style={{ color: "var(--navy)", lineHeight: 1 }}
        >
          {value} %
        </span>
        <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
          puntualidad
        </span>
      </div>
    </div>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
  hint,
  color,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  hint?: string;
  color?: string;
}) {
  return (
    <div
      className="flex flex-col gap-1 rounded-lg"
      style={{ backgroundColor: "var(--gray-1)", padding: "12px 14px" }}
    >
      <span
        className="body-small-regular inline-flex items-center gap-1.5"
        style={{ color: "var(--gray-8)" }}
      >
        <Icon size={14} style={{ color: color ?? "var(--navy)" }} /> {label}
      </span>
      <span
        className="title-tertiary-bold"
        style={{ color: color ?? "var(--navy)" }}
      >
        {value}
      </span>
      {hint && (
        <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

function esNeutro(estado: PagoHistorico["estado"]) {
  return estado === "pendiente" || estado === "sin-dato";
}

const HISTORIAL_COLUMNS = [
  { key: "periodo", header: "Periodo", width: 110 },
  { key: "fechaLimite", header: "Fecha límite", width: 130 },
  { key: "fechaPago", header: "Fecha de pago", width: 140 },
  { key: "dias", header: "Días", width: 90, align: "right" as const },
  { key: "valor", header: "Valor", width: 140, align: "right" as const },
  { key: "estadoPago", header: "Estado", width: 130 },
];

function filasHistorial(pagos: PagoHistorico[]) {
  return [...pagos].reverse().map((p) => ({
    periodo: etiquetaPeriodo(p.periodo),
    fechaLimite: p.fechaLimite,
    fechaPago: p.fechaPago ?? "—",
    dias: esNeutro(p.estado)
      ? "—"
      : p.diasDiferencia > 0
        ? `+${p.diasDiferencia}`
        : String(p.diasDiferencia),
    valor: p.valor ? formatoMoneda(p.valor) : "—",
    estadoPago: (
      <StatusBadge
        label={ESTADO_PAGO[p.estado].label}
        variant={ESTADO_PAGO[p.estado].variant}
      />
    ),
  }));
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-6 flex-wrap">
        <Skeleton width={RING_SIZE} height={RING_SIZE} radius="50%" />
        <div className="flex flex-col gap-2" style={{ width: 240 }}>
          <Skeleton height={22} width={140} radius={999} />
          <Skeleton height={14} />
          <Skeleton height={14} width="70%" />
        </div>
        <div className="grid grid-cols-2 gap-3 flex-1 min-w-[280px]">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={72} radius="var(--radius-md)" />
          ))}
        </div>
      </div>
      <Skeleton height={14} width={200} />
      <Skeleton height={220} radius="var(--radius-md)" />
    </div>
  );
}

export function HabitoPagoCard({
  pagos,
  numeroContrato,
  title = "Hábito de pago",
  loading = false,
  error = null,
  periodosSinDato = 0,
  onReintentar,
}: Props) {
  const habito = calcularHabito(pagos, periodosSinDato);
  const nivel = NIVEL_HABITO[habito.nivel];
  const calculables = pagos.filter(
    (p) => p.estado !== "pendiente" && p.estado !== "sin-dato",
  ).length;
  const hayDatos = calculables > 0;

  const subtitulo = (
    <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
      Comportamiento de recaudo
      {numeroContrato ? ` del contrato ${numeroContrato}` : ""} · visible solo
      para la inmobiliaria maestra
    </span>
  );

  // ── Carga ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SectionCard title={title} padding="20px 24px">
        {subtitulo}
        <LoadingState />
      </SectionCard>
    );
  }

  // ── Error del servicio ────────────────────────────────────────────────
  if (error) {
    return (
      <SectionCard title={title} padding="20px 24px">
        {subtitulo}
        <Callout variant="error" title="No pudimos cargar el hábito de pago">
          {error}
        </Callout>
        {onReintentar && (
          <div>
            <AppButton variant="secondary" bold onClick={onReintentar}>
              <RefreshCw size={15} /> Reintentar
            </AppButton>
          </div>
        )}
      </SectionCard>
    );
  }

  // ── Sin historial ─────────────────────────────────────────────────────
  if (!hayDatos) {
    return (
      <SectionCard title={title} padding="20px 24px">
        {subtitulo}
        <EmptyState
          icon={WalletMinimal}
          title="Aún no hay historial de pagos"
          description={
            pagos.length > 0
              ? "El contrato ya está en administración pero todavía no se ha registrado ningún pago cerrado. El hábito se calcula desde el primer recaudo."
              : "Este contrato no tiene periodos facturados en el sistema de recaudo."
          }
        />
      </SectionCard>
    );
  }

  // ── Con historial ─────────────────────────────────────────────────────
  return (
    <SectionCard title={title} padding="20px 24px">
      {subtitulo}

      {periodosSinDato > 0 && (
        <Callout variant="warning" title="Histórico incompleto">
          {periodosSinDato} periodo(s) del rango consultado no llegaron desde el
          sistema de recaudo. Las métricas se calculan solo con los{" "}
          {calculables} periodos disponibles.
        </Callout>
      )}

      <div className="flex items-start gap-6 flex-wrap">
        <div className="flex items-center gap-5">
          <Ring value={habito.cumplimiento} color={nivel.color} />
          <div className="flex flex-col gap-2" style={{ maxWidth: 260 }}>
            <StatusBadge
              label={`Hábito ${nivel.label.toLowerCase()}`}
              variant={nivel.variant}
            />
            <span
              className="body-small-regular"
              style={{ color: "var(--gray-8)" }}
            >
              {nivel.descripcion}
            </span>
            <span
              className="body-small-regular"
              style={{ color: "var(--gray-7)" }}
            >
              Calculado sobre {calculables} periodo(s) con pago registrado.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1 min-w-[280px] max-md:grid-cols-1">
          <MiniMetric
            icon={TrendingUp}
            label="Pagos puntuales"
            value={`${habito.pagosATiempo} de ${calculables}`}
            hint={`dentro de la fecha límite${habito.diaLimite ? ` (día ${habito.diaLimite})` : ""}`}
          />
          <MiniMetric
            icon={CalendarDays}
            label="Suele pagar el día"
            value={
              habito.diaPromedioPago ? String(habito.diaPromedioPago) : "—"
            }
            hint={
              habito.diaLimite && habito.diaPromedioPago
                ? habito.diaPromedioPago <= habito.diaLimite
                  ? "antes de la fecha límite"
                  : `${habito.diaPromedioPago - habito.diaLimite} día(s) después del límite`
                : "promedio del histórico"
            }
          />
          <MiniMetric
            icon={CalendarClock}
            label="Promedio de pago"
            value={
              habito.promedioDiasDiferencia === 0
                ? "El día límite"
                : habito.promedioDiasDiferencia > 0
                  ? `+${habito.promedioDiasDiferencia} días`
                  : `${habito.promedioDiasDiferencia} días`
            }
            hint={
              habito.promedioDiasMora > 0
                ? `${habito.promedioDiasMora} días de atraso cuando se retrasa`
                : "frente a la fecha límite"
            }
            color={
              habito.promedioDiasDiferencia >
              REGLAS_PAGO_PROPUESTAS.atrasoLeveHasta
                ? "var(--orange-status)"
                : undefined
            }
          />
          <MiniMetric
            icon={AlertTriangle}
            label="Periodos en mora"
            value={String(habito.pagosEnMora)}
            hint={`más de ${REGLAS_PAGO_PROPUESTAS.tardioHasta} días`}
            color={habito.pagosEnMora > 0 ? "var(--red-status)" : undefined}
          />
        </div>
      </div>

      <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

      <div className="flex flex-col gap-3">
        <span className="body-bold" style={{ color: "var(--gray-10)" }}>
          Historial de pagos
        </span>
        <DataTable columns={HISTORIAL_COLUMNS} rows={filasHistorial(pagos)} />
      </div>

      <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
        Rangos de clasificación propuestos por diseño (puntual hasta el día
        límite · atraso leve hasta {REGLAS_PAGO_PROPUESTAS.atrasoLeveHasta} días
        · tardío hasta {REGLAS_PAGO_PROPUESTAS.tardioHasta} días · mora por
        encima). Pendiente de confirmación de negocio.
      </span>
    </SectionCard>
  );
}
