import { ShieldCheck, Wrench, Zap, Home } from "lucide-react";
import { AlquilandoLogo } from "./kit/AlquilandoLogo";
import logoSegurosBolivar from "../../assets/logo-seguros-bolivar.png";

const PURPLE = "#6d28d9";
const PURPLE_DARK = "#5b21b6";
const PURPLE_LIGHT = "#f5f3ff";

/**
 * Vista previa del correo de confirmación de compra del Seguro de Hogar.
 * Vive DENTRO del panel (no es un artifact externo): se abre en una pestaña
 * nueva desde "Ver correo de confirmación" en PagoExitoso, leyendo los datos
 * reales de la póliza recién comprada desde localStorage (clave
 * CORREO_PREVIEW_KEY, ver CotizadorHogar.tsx) — así el correo refleja el plan
 * y el inmueble que el usuario realmente eligió, no un mock fijo.
 *
 * El envío real del correo (asunto, remitente, disparo) es responsabilidad de
 * Seguros Bolívar — esto es solo el diseño del contenido para aprobar copy.
 */
export const CORREO_PREVIEW_KEY = "alquilando_correo_preview";

export interface CorreoPreviewData {
  nombreTitular: string;
  correoTitular: string;
  numeroPoliza: string;
  inmuebleDireccion: string;
  planNombre: string;
  asistenciaNombre: string;
  fechaPago: string;
  proximaRenovacion: string;
  totalPeriodo: number;
  periodo: "mes" | "anio";
}

const EJEMPLO: CorreoPreviewData = {
  nombreTitular: "Nelson Diaz",
  correoTitular: "nelson.diaz@email.com",
  numeroPoliza: "AL-778354",
  inmuebleDireccion: "Carrera 23 # 45 - 34 sur",
  planNombre: "Plan Clásico",
  asistenciaNombre: "Asistencias S",
  fechaPago: "14 Sept. 2026",
  proximaRenovacion: "14 Oct. 2026",
  totalPeriodo: 101441,
  periodo: "mes",
};

function leerPreview(): CorreoPreviewData {
  try {
    const raw = localStorage.getItem(CORREO_PREVIEW_KEY);
    if (raw) return JSON.parse(raw) as CorreoPreviewData;
  } catch { /* modo privado o dato corrupto: cae al ejemplo */ }
  return EJEMPLO;
}

function Row({ label, value, destacado }: { label: string; value: string; destacado?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4" style={{ padding: "11px 0", borderBottom: "1px solid var(--gray-4)" }}>
      <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>{label}</span>
      <span
        className={destacado ? "title-tertiary-bold" : "body-regular"}
        style={{ color: destacado ? PURPLE : "var(--gray-10)", fontWeight: destacado ? 700 : 500, fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </span>
    </div>
  );
}

export function CorreoConfirmacionPoliza() {
  const d = leerPreview();
  const esEjemplo = d === EJEMPLO;
  const totalFmt = "$" + d.totalPeriodo.toLocaleString("es-CO") + (d.periodo === "mes" ? "/mes" : "/año");

  return (
    <div className="flex flex-col items-center" style={{ backgroundColor: "#eee9f8", minHeight: "100vh", fontFamily: "Roboto, sans-serif", padding: "40px 16px" }}>
      <div className="w-full" style={{ maxWidth: 560 }}>
        <p className="disclamer text-center" style={{ color: "var(--gray-8)", marginBottom: 16 }}>
          {esEjemplo
            ? "Vista previa con datos de ejemplo — compra un seguro para ver tu correo real."
            : `Confirmación de compra · Póliza ${d.numeroPoliza}`}
        </p>

        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", boxShadow: "0 20px 45px -28px rgba(91,33,182,0.45)" }}>
          {/* Banda de marca */}
          <div className="flex items-center" style={{ background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_DARK} 100%)`, padding: "22px 28px" }}>
            <AlquilandoLogo height={22} textColor="#ffffff" iconColor="#ffffff" />
          </div>

          {/* Hero */}
          <div className="flex flex-col items-center text-center" style={{ padding: "34px 28px 6px" }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: 54, height: 54, backgroundColor: "var(--green-status-light)", marginBottom: 16 }}>
              <ShieldCheck size={26} strokeWidth={1.8} style={{ color: "var(--green-status)" }} />
            </div>
            <h1 className="title-secondary" style={{ color: "var(--gray-10)", margin: 0 }}>Tu Seguro de Hogar ya está activo</h1>
            <p className="body-regular" style={{ color: "var(--gray-9)", marginTop: 10, maxWidth: 400 }}>
              Hola {d.nombreTitular.split(" ")[0]}, confirmamos tu suscripción al <span style={{ fontWeight: 700 }}>{d.planNombre}</span>.
              Seguros Bolívar te enviará tu póliza y factura oficiales a <span style={{ fontWeight: 700 }}>{d.correoTitular}</span> en las próximas horas.
            </p>
          </div>

          {/* Resumen de la póliza */}
          <div className="rounded-lg" style={{ margin: "22px 28px 0", border: "1px solid var(--gray-4)", overflow: "hidden" }}>
            <div className="flex items-center justify-between" style={{ backgroundColor: PURPLE_LIGHT, padding: "12px 18px" }}>
              <span className="body-bold" style={{ color: PURPLE_DARK }}>Póliza {d.numeroPoliza}</span>
              <span className="tags-bold rounded-full" style={{ backgroundColor: "var(--green-status-light)", color: "var(--green-status)", padding: "3px 10px" }}>Activa</span>
            </div>
            <div style={{ padding: "2px 18px" }}>
              <Row label="Inmueble asegurado" value={d.inmuebleDireccion} />
              <Row label="Plan" value={d.planNombre} />
              <Row label="Asistencia incluida" value={d.asistenciaNombre} />
              <Row label="Fecha de cobertura" value={d.fechaPago} />
              <Row label="Próximo cobro" value={d.proximaRenovacion} />
              <Row label="Suscripción" value={totalFmt} destacado />
            </div>
          </div>

          {/* CTA */}
          <div className="text-center" style={{ padding: "26px 28px 4px" }}>
            <span
              className="body-bold inline-flex items-center justify-center rounded-lg"
              style={{ backgroundColor: PURPLE, color: "#ffffff", padding: "13px 26px", cursor: "default" }}
            >
              Ver mi póliza en Alquilando
            </span>
          </div>

          {/* Qué incluye */}
          <div style={{ padding: "22px 28px 6px" }}>
            <span className="disclamer" style={{ color: "var(--gray-8)", letterSpacing: 1 }}>TU PLAN INCLUYE</span>
            <div className="grid grid-cols-3 gap-2" style={{ marginTop: 12 }}>
              {[
                { icon: ShieldCheck, label: "Robo y daños" },
                { icon: Wrench, label: "Plomería y cerrajería" },
                { icon: Zap, label: "Daños eléctricos" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center text-center rounded-lg" style={{ border: "1px solid var(--gray-4)", padding: "12px 8px" }}>
                  <Icon size={18} strokeWidth={1.8} style={{ color: PURPLE, marginBottom: 6 }} />
                  <span className="body-small-bold" style={{ color: "var(--gray-10)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nota de asistencia 24/7 */}
          <div className="flex items-start gap-2.5 rounded-lg" style={{ margin: "20px 28px 0", backgroundColor: PURPLE_LIGHT, padding: "14px 16px" }}>
            <Home size={15} strokeWidth={1.8} style={{ color: PURPLE, flexShrink: 0, marginTop: 2 }} />
            <p className="body-small-regular" style={{ color: "var(--gray-10)", margin: 0 }}>
              <span style={{ fontWeight: 700 }}>¿Necesitas asistencia o quieres reportar un siniestro?</span> Comunícate
              directamente con Seguros Bolívar, disponible 24/7. Tu póliza sigue activa hasta que decidas
              cancelarla — puedes hacerlo cuando quieras desde "Mis seguros".
            </p>
          </div>

          <hr style={{ borderColor: "var(--gray-4)", margin: "26px 28px 0" }} />

          {/* Footer legal */}
          <div className="flex flex-col items-center text-center" style={{ padding: "18px 28px 28px" }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
              <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Emitido por</span>
              <img src={logoSegurosBolivar} alt="Seguros Bolívar" style={{ height: 20, width: "auto" }} />
            </div>
            <p className="disclamer" style={{ color: "var(--gray-8)", maxWidth: 420, margin: 0 }}>
              Este correo confirma tu suscripción mensual del Seguro de Hogar contratado a través de Alquilando.
              Las reclamaciones, coberturas y condiciones de la póliza corresponden a Seguros Bolívar.
            </p>
          </div>
        </div>

        <p className="disclamer text-center" style={{ color: "var(--gray-8)", marginTop: 16 }}>
          Diseño de contenido para aprobación interna · el envío real del correo lo hace Seguros Bolívar.
        </p>
      </div>
    </div>
  );
}
