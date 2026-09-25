import { CircleDollarSign, Barcode, CircleCheck, Download } from "lucide-react";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { StatusBadge } from "./kit/StatusBadge";

/**
 * Estado de cuenta del mes de un contrato. Lo usan Inicio, Mis pagos y el detalle
 * de cada contrato en Mis contratos; los colores salen de --navy, que el portal del
 * inquilino reescribe a púrpura.
 */

export interface FilaCuenta { label: string; value: string }
export interface FechaPago { label: string; value: string; vigente?: boolean }

export interface DatosEstadoCuenta {
  numeroContrato: string;
  /** "julio", "septiembre"… */
  mes: string;
  anio: number;
  estado: "pendiente" | "pagado";
  filas: FilaCuenta[];
  total: string;
  /** Tramos de pago por fecha; solo aplican mientras el mes está pendiente. */
  fechas: FechaPago[];
  /** Solo cuando estado = "pagado". */
  pago?: { fecha: string; metodo: string };
}

export const ESTADO_CUENTA_1731: DatosEstadoCuenta = {
  numeroContrato: "1731",
  mes: "julio",
  anio: 2026,
  estado: "pendiente",
  filas: [
    { label: "Canon de arrendamiento", value: "$6.980.963" },
    { label: "Administración PH", value: "$1.222.358" },
    { label: "IVA 19%", value: "$1.326.383" },
    { label: "Retención", value: "$244.334" },
    { label: "Reteica", value: "$67.436" },
    { label: "Rete IVA", value: "$0" },
    { label: "Saldo", value: "$0" },
    { label: "Servicios", value: "$0" },
    { label: "Otros", value: "$0" },
  ],
  total: "$9.055.543",
  fechas: [
    { label: "Después del 28 / 07 / 2026", value: "$10.037.543" },
    { label: "Después del 24 / 07 / 2026", value: "$9.555.543" },
    { label: "Antes del 24 / 07 / 2026", value: "$9.055.543", vigente: true },
  ],
};

export const ESTADO_CUENTA_2048: DatosEstadoCuenta = {
  numeroContrato: "2048",
  mes: "septiembre",
  anio: 2026,
  estado: "pagado",
  filas: [
    { label: "Canon de arrendamiento", value: "$1.315.000" },
    { label: "Administración PH", value: "$0" },
    { label: "Saldo", value: "$0" },
    { label: "Servicios", value: "$0" },
    { label: "Otros", value: "$0" },
  ],
  total: "$1.315.000",
  fechas: [],
  pago: { fecha: "03 sep 2026", metodo: "PSE" },
};

export const ESTADOS_CUENTA: Record<string, DatosEstadoCuenta> = {
  "1731": ESTADO_CUENTA_1731,
  "2048": ESTADO_CUENTA_2048,
};

interface Props {
  datos?: DatosEstadoCuenta;
  onVerHistorial?: () => void;
}

export function EstadoCuenta({ datos = ESTADO_CUENTA_1731, onVerHistorial }: Props) {
  const pagado = datos.estado === "pagado";
  const filas = [
    { label: "Número de contrato", value: datos.numeroContrato },
    { label: "Mes a pagar", value: `${datos.mes[0].toUpperCase()}${datos.mes.slice(1)} de ${datos.anio}` },
    ...datos.filas,
  ];

  return (
    <section className="rounded-lg flex flex-col" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "22px 24px" }}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="title-tertiary-bold" style={{ color: "var(--navy)" }}>Estado de cuenta</h2>
        {onVerHistorial && <LinkText size="small" icon="chevron" onClick={onVerHistorial}>Ver historial de pagos</LinkText>}
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap" style={{ marginTop: 18 }}>
        <span className="body-bold" style={{ color: "var(--gray-10)" }}>Canon de alquiler de {datos.mes}</span>
        {pagado ? <StatusBadge label="Pagado" variant="active" /> : <StatusBadge label="Pendiente pago" variant="pending" />}
      </div>

      <div className="flex flex-col" style={{ marginTop: 10 }}>
        {filas.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 py-1.5" style={{ borderBottom: "1px solid var(--gray-2)" }}>
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{r.label}</span>
            <span className="body-small-regular" style={{ color: "var(--gray-10)" }}>{r.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 py-2">
          <span className="body-bold" style={{ color: "var(--gray-10)" }}>TOTAL</span>
          <span className="body-bold" style={{ color: "var(--gray-10)" }}>{datos.total}</span>
        </div>
      </div>

      {pagado ? (
        <div
          className="flex items-center justify-between gap-3 flex-wrap rounded-lg"
          style={{ marginTop: 12, padding: "12px 14px", backgroundColor: "var(--green-status-light)" }}
        >
          <span className="flex items-center gap-2 body-small-regular" style={{ color: "var(--gray-10)" }}>
            <CircleCheck size={18} strokeWidth={1.8} style={{ color: "var(--green-status)", flexShrink: 0 }} />
            <span>
              <span style={{ fontWeight: 700 }}>Estás al día.</span> Pagaste {datos.total} el {datos.pago?.fecha} por {datos.pago?.metodo}.
            </span>
          </span>
          <LinkText size="small">
            <Download size={13} strokeWidth={2} /> Descargar comprobante
          </LinkText>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2" style={{ marginTop: 12 }}>
            {datos.fechas.map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between gap-4 rounded-lg px-3 py-2"
                style={{
                  border: f.vigente ? "1.5px solid var(--navy)" : "1px solid var(--gray-4)",
                  backgroundColor: f.vigente ? "var(--navy-light)" : "#ffffff",
                }}
              >
                <span className={f.vigente ? "body-small-bold" : "body-small-regular"} style={{ color: f.vigente ? "var(--navy)" : "var(--gray-9)" }}>
                  {f.label}
                </span>
                <span className={f.vigente ? "body-small-bold" : "body-small-regular"} style={{ color: f.vigente ? "var(--navy)" : "var(--gray-10)" }}>
                  {f.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap" style={{ marginTop: 18 }}>
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>Valor total a pagar</span>
            <span className="title-primary-bold" style={{ color: "var(--navy)" }}>{datos.total}</span>
          </div>

          <hr style={{ borderColor: "var(--gray-4)", margin: "18px 0" }} />

          <h3 className="body-bold" style={{ color: "var(--navy)" }}>Opciones de pago</h3>

          <div className="flex items-start gap-3" style={{ marginTop: 14 }}>
            <CircleDollarSign size={20} strokeWidth={1.6} style={{ color: "var(--navy)", flexShrink: 0, marginTop: 2 }} />
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
            <Barcode size={20} strokeWidth={1.6} style={{ color: "var(--navy)", flexShrink: 0, marginTop: 2 }} />
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
        </>
      )}
    </section>
  );
}
