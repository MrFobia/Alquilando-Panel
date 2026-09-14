/**
 * Hábito de pago — métricas derivadas del histórico de pagos de un contrato
 * en administración (DDM). Mientras el backend expone el histórico real, el
 * panel genera una serie determinística por documento para que la interna de
 * cada usuario siempre muestre los mismos datos.
 */

export type EstadoPago = "a-tiempo" | "leve" | "tardio" | "mora" | "pendiente" | "sin-dato";

/**
 * Cortes en días usados para clasificar un pago. Son una PROPUESTA de diseño:
 * el negocio aún no definió los rangos oficiales, así que quedan en un solo
 * lugar para reemplazarlos por lo que entregue el backend sin tocar la UI.
 */
export interface ReglasPago {
  /** Días de gracia después de la fecha límite que siguen contando como puntual */
  toleranciaDias: number;
  /** Hasta cuántos días de atraso se considera "atraso leve" */
  atrasoLeveHasta: number;
  /** Hasta cuántos días de atraso se considera "tardío"; por encima es mora */
  tardioHasta: number;
}

export const REGLAS_PAGO_PROPUESTAS: ReglasPago = {
  toleranciaDias: 0,
  atrasoLeveHasta: 5,
  tardioHasta: 15,
};

export interface PagoHistorico {
  /** Periodo facturado, formato YYYY-MM */
  periodo: string;
  /** Fecha límite de pago (YYYY-MM-DD) */
  fechaLimite: string;
  /** Fecha real de pago (YYYY-MM-DD) o null si aún no se ha pagado */
  fechaPago: string | null;
  valor: number;
  /** Días de diferencia contra la fecha límite (negativo = anticipado) */
  diasDiferencia: number;
  estado: EstadoPago;
}

/** Respuesta cruda que el widget espera del backend (ver guidelines/habito-de-pago.md). */
export interface HabitoPagoResponse {
  contrato?: string;
  pagos: PagoHistorico[];
  /** Periodos que el backend no pudo resolver; se muestran como "sin dato" */
  periodosSinDato?: number;
}

export type NivelHabito = "excelente" | "bueno" | "irregular" | "critico";

export interface HabitoPago {
  pagos: PagoHistorico[];
  /** % de pagos realizados dentro de la fecha límite */
  cumplimiento: number;
  /** Promedio de días de atraso considerando solo los pagos tardíos */
  promedioDiasMora: number;
  /** Promedio de días de diferencia contra la fecha límite (incluye anticipados) */
  promedioDiasDiferencia: number;
  /** Día del mes en que suele pagar (promedio de las fechas de pago) */
  diaPromedioPago: number | null;
  /** Día del mes en que vence el canon, según el histórico */
  diaLimite: number | null;
  /** Periodos del rango consultado que el backend no pudo resolver */
  periodosSinDato: number;
  /** Pagos consecutivos a tiempo contando desde el periodo más reciente */
  rachaATiempo: number;
  pagosATiempo: number;
  pagosTardios: number;
  pagosEnMora: number;
  nivel: NivelHabito;
}

export const NIVEL_HABITO: Record<
  NivelHabito,
  { label: string; variant: "active" | "registered" | "pending" | "rejected"; color: string; descripcion: string }
> = {
  excelente: {
    label: "Excelente",
    variant: "active",
    color: "var(--green-status)",
    descripcion: "Paga siempre dentro de la fecha límite. Cliente de bajo riesgo.",
  },
  bueno: {
    label: "Bueno",
    variant: "registered",
    color: "var(--navy)",
    descripcion: "Cumple la mayoría de los periodos con atrasos puntuales y cortos.",
  },
  irregular: {
    label: "Irregular",
    variant: "pending",
    color: "var(--orange-status)",
    descripcion: "Se atrasa con frecuencia. Conviene reforzar el recordatorio de pago.",
  },
  critico: {
    label: "Crítico",
    variant: "rejected",
    color: "var(--red-status)",
    descripcion: "Historial con moras recurrentes. Requiere gestión de cartera.",
  },
};

export const ESTADO_PAGO: Record<EstadoPago, { label: string; color: string; variant: "active" | "registered" | "pending" | "rejected" | "neutral" }> = {
  "a-tiempo": { label: "A tiempo", color: "var(--green-status)", variant: "active" },
  leve: { label: "Atraso leve", color: "var(--navy)", variant: "registered" },
  tardio: { label: "Tardío", color: "var(--orange-status)", variant: "pending" },
  mora: { label: "En mora", color: "var(--red-status)", variant: "rejected" },
  pendiente: { label: "Pendiente", color: "var(--gray-5)", variant: "neutral" },
  "sin-dato": { label: "Sin dato", color: "var(--gray-4)", variant: "neutral" },
};

/** Estados que no entran en el cálculo por no tener un pago resuelto. */
const NO_CALCULABLES: EstadoPago[] = ["pendiente", "sin-dato"];

/** Clasifica un pago por los días transcurridos frente a la fecha límite. */
export function clasificarPago(
  diasDiferencia: number,
  pagado: boolean,
  reglas: ReglasPago = REGLAS_PAGO_PROPUESTAS,
): EstadoPago {
  if (!pagado) return "pendiente";
  if (diasDiferencia <= reglas.toleranciaDias) return "a-tiempo";
  if (diasDiferencia <= reglas.atrasoLeveHasta) return "leve";
  if (diasDiferencia <= reglas.tardioHasta) return "tardio";
  return "mora";
}

function diaDelMes(iso: string) {
  return Number(iso.slice(8, 10));
}

export function calcularHabito(pagos: PagoHistorico[], periodosSinDato = 0): HabitoPago {
  const cerrados = pagos.filter((p) => !NO_CALCULABLES.includes(p.estado));
  const pagosATiempo = cerrados.filter((p) => p.estado === "a-tiempo").length;
  const tardios = cerrados.filter((p) => p.estado === "leve" || p.estado === "tardio");
  const enMora = cerrados.filter((p) => p.estado === "mora");

  const cumplimiento = cerrados.length ? Math.round((pagosATiempo / cerrados.length) * 100) : 0;

  const conAtraso = cerrados.filter((p) => p.diasDiferencia > 0);
  const promedioDiasMora = conAtraso.length
    ? Math.round(conAtraso.reduce((sum, p) => sum + p.diasDiferencia, 0) / conAtraso.length)
    : 0;

  const promedioDiasDiferencia = cerrados.length
    ? Math.round(cerrados.reduce((sum, p) => sum + p.diasDiferencia, 0) / cerrados.length)
    : 0;

  const conFecha = cerrados.filter((p) => !!p.fechaPago);
  const diaPromedioPago = conFecha.length
    ? Math.round(conFecha.reduce((sum, p) => sum + diaDelMes(p.fechaPago as string), 0) / conFecha.length)
    : null;
  const diaLimite = pagos.length ? diaDelMes(pagos[pagos.length - 1].fechaLimite) : null;

  // La racha se cuenta desde el periodo más reciente hacia atrás.
  let rachaATiempo = 0;
  for (let i = cerrados.length - 1; i >= 0; i--) {
    if (cerrados[i].estado !== "a-tiempo") break;
    rachaATiempo++;
  }

  const nivel: NivelHabito =
    cumplimiento >= 95 && enMora.length === 0
      ? "excelente"
      : cumplimiento >= 80 && enMora.length <= 1
        ? "bueno"
        : cumplimiento >= 60
          ? "irregular"
          : "critico";

  return {
    pagos,
    cumplimiento,
    promedioDiasMora,
    promedioDiasDiferencia,
    diaPromedioPago,
    diaLimite,
    periodosSinDato,
    rachaATiempo,
    pagosATiempo,
    pagosTardios: tardios.length,
    pagosEnMora: enMora.length,
    nivel,
  };
}

/** PRNG determinístico para que un mismo documento siempre genere el mismo histórico. */
function seedFrom(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

const PERFIL_PESOS: Record<"bueno" | "medio" | "malo", { aTiempo: number; leve: number; tardio: number }> = {
  bueno: { aTiempo: 0.9, leve: 0.98, tardio: 1 },
  medio: { aTiempo: 0.66, leve: 0.85, tardio: 0.96 },
  malo: { aTiempo: 0.38, leve: 0.6, tardio: 0.82 },
};

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

interface GenerarOpts {
  /** Documento o id usado como semilla */
  seed: string;
  /** Canon mensual del contrato */
  canon?: number;
  /** Cantidad de periodos a generar */
  meses?: number;
  /** Sesga el histórico: los inquilinos en mora arrancan con perfil malo */
  perfil?: "bueno" | "medio" | "malo";
  /** El último periodo queda sin pagar */
  ultimoPendiente?: boolean;
}

export function generarHistorialPagos({
  seed,
  canon = 1_250_000,
  meses = 12,
  perfil,
  ultimoPendiente = false,
}: GenerarOpts): PagoHistorico[] {
  const rand = seedFrom(seed);
  const perfilFinal = perfil ?? (rand() > 0.65 ? "bueno" : rand() > 0.3 ? "medio" : "malo");
  const pesos = PERFIL_PESOS[perfilFinal];

  const hoy = new Date();
  const pagos: PagoHistorico[] = [];

  for (let i = meses - 1; i >= 0; i--) {
    const base = new Date(hoy.getFullYear(), hoy.getMonth() - i, 5);
    const periodo = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}`;
    const fechaLimite = `${periodo}-05`;
    const esUltimo = i === 0;

    if (esUltimo && ultimoPendiente) {
      pagos.push({ periodo, fechaLimite, fechaPago: null, valor: canon, diasDiferencia: 0, estado: "pendiente" });
      continue;
    }

    const r = rand();
    let dias: number;
    if (r < pesos.aTiempo) dias = -Math.floor(rand() * 4);
    else if (r < pesos.leve) dias = 1 + Math.floor(rand() * 5);
    else if (r < pesos.tardio) dias = 6 + Math.floor(rand() * 10);
    else dias = 16 + Math.floor(rand() * 20);

    pagos.push({
      periodo,
      fechaLimite,
      fechaPago: addDays(fechaLimite, dias),
      valor: canon,
      diasDiferencia: dias,
      estado: clasificarPago(dias, true),
    });
  }

  return pagos;
}

export function formatoMoneda(valor: number) {
  return `$ ${valor.toLocaleString("es-CO")}`;
}

const MESES_CORTOS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export function etiquetaPeriodo(periodo: string) {
  const [anio, mes] = periodo.split("-");
  return `${MESES_CORTOS[Number(mes) - 1]} ${anio.slice(2)}`;
}
