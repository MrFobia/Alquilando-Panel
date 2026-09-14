import { useState } from "react";
import { Search } from "lucide-react";
import { StatCard } from "./kit/StatCard";
import { DataTable } from "./kit/DataTable";
import { TextInput } from "./kit/TextInput";
import { Callout } from "./kit/Callout";
import { PROPIETARIOS_ROWS } from "./Propietarios";
import { INQUILINOS_ROWS } from "./Inquilinos";

/**
 * Vista interna para el equipo de Alquilando (Inmobiliaria Maestra): quién tiene
 * póliza de hogar activa y un resumen de la operación con Seguros Bolívar.
 * Pedido en la reunión de estrategia de marketing del 11-sep-2026 — "tab de
 * Seguros en la inmobiliaria maestra" + "dashboard con asegurados, pólizas
 * vendidas, tendencia y datos para liquidar comisiones".
 *
 * Todo lo que aquí se ve es MOCK: no hay integración real con Bitrix ni con la
 * API de liquidación de Bolívar (bloqueada — ver memoria del proyecto).
 */

/** Único tipo de "póliza de hogar" del panel: lo usan Propietarios, Inquilinos y esta vista,
 * así el listado de asegurados y la ficha de cada persona muestran siempre los mismos datos. */
export interface PolizaHogarInfo {
  numeroPoliza: string;
  plan: "Plan Básico" | "Plan Clásico" | "Plan Premium";
  asistencia: "Asistencias S" | "Asistencias M" | "Asistencias L";
  inmueble: string;
  desde: string;
}

interface AseguradoRow {
  cedula: string;
  nombre: string;
  rol: "Propietario" | "Arrendatario";
  poliza: PolizaHogarInfo;
}

/** Se arma a partir de los mismos registros de Propietarios/Inquilinos (los que tienen
 * polizaHogar): un solo lugar donde vive cada persona, no un mock aparte que se desincroniza. */
const ASEGURADOS: AseguradoRow[] = [
  ...PROPIETARIOS_ROWS.filter((r) => r.polizaHogar).map((r) => ({
    cedula: r.cedula, nombre: r.nombre, rol: "Propietario" as const, poliza: r.polizaHogar!,
  })),
  ...INQUILINOS_ROWS.filter((r) => r.polizaHogar).map((r) => ({
    cedula: r.cedula, nombre: r.nombre, rol: "Arrendatario" as const, poliza: r.polizaHogar!,
  })),
];

const TENDENCIA = [
  { mes: "Jun 2026", polizas: 3 },
  { mes: "Jul 2026", polizas: 7 },
  { mes: "Ago 2026", polizas: 14 },
  { mes: "Sept 2026", polizas: 22 },
];

const PLANES_VENDIDOS = [
  { label: "Plan Básico", value: "8" },
  { label: "Plan Clásico", value: "10" },
  { label: "Plan Premium", value: "4" },
];

/** Barras simples en CSS: evita depender de recharts para un solo mini-gráfico de tendencia. */
function TendenciaChart() {
  const max = Math.max(...TENDENCIA.map((t) => t.polizas));
  return (
    <section className="rounded-lg" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}>
      <h3 className="subtitle" style={{ color: "var(--navy)" }}>Tendencia de ventas de pólizas</h3>
      <div className="flex items-end gap-6" style={{ height: 200, marginTop: 20, padding: "0 8px" }}>
        {TENDENCIA.map((t) => (
          <div key={t.mes} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <span className="body-small-bold" style={{ color: "var(--navy)" }}>{t.polizas}</span>
            <div
              className="w-full rounded-t-md"
              style={{ height: `${(t.polizas / max) * 140}px`, backgroundColor: "var(--violeta)", minHeight: 4 }}
            />
            <span className="disclamer" style={{ color: "var(--gray-8)" }}>{t.mes}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

interface Props {
  /** Al hacer clic en una fila: la inmobiliaria maestra navega a la ficha completa de esa
   * persona (Propietarios/Inquilinos), donde se ve el resto de su información además del seguro. */
  onVerPersona: (persona: { tipo: "propietario" | "inquilino"; cedula: string }) => void;
}

export function SegurosAdmin({ onVerPersona }: Props) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = ASEGURADOS.filter((a) => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return true;
    return a.nombre.toLowerCase().includes(q) || a.poliza.inmueble.toLowerCase().includes(q) || a.poliza.numeroPoliza.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-lg" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "24px 28px" }}>
        <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>Seguros</h1>
        <p className="body-regular" style={{ color: "var(--gray-9)", marginTop: 4 }}>
          Clientes con Seguro de Hogar activo y desempeño de la venta en alianza con Seguros Bolívar.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <StatCard title="Asegurados activos" rows={[
          { label: "Total pólizas activas", value: String(ASEGURADOS.length) },
          { label: "Propietarios", value: String(ASEGURADOS.filter((a) => a.rol === "Propietario").length) },
          { label: "Arrendatarios", value: String(ASEGURADOS.filter((a) => a.rol === "Arrendatario").length) },
        ]} />
        <StatCard title="Pólizas vendidas por plan" rows={PLANES_VENDIDOS} />
        <StatCard title="Suscriptores activos" rows={[
          { label: "Este mes", value: "22" },
          { label: "Meta del mes", value: "20" },
          { label: "Cumplimiento", value: "110%" },
        ]} />
      </div>

      <TendenciaChart />

      <Callout variant="info" title="Comisiones con Seguros Bolívar">
        Alquilando factura el 20% de lo suscrito mensualmente. El detalle de liquidación por póliza depende de
        la API de liquidación de Bolívar — bloqueada a la fecha, ver seguimiento con el equipo de tecnología.
      </Callout>

      <section className="rounded-lg flex flex-col gap-4" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h3 className="subtitle" style={{ color: "var(--navy)" }}>Clientes con póliza hogar</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto" style={{ maxWidth: 320 }}>
            <Search size={16} style={{ color: "var(--gray-7)" }} />
            <TextInput placeholder="Buscar por nombre, inmueble o póliza" value={busqueda} onChange={setBusqueda} className="w-full" />
          </div>
        </div>

        <DataTable
          columns={[
            { key: "nombre", header: "Cliente" },
            { key: "rol", header: "Rol" },
            { key: "inmueble", header: "Inmueble" },
            { key: "tipoPoliza", header: "Tipo de póliza" },
            { key: "numeroPoliza", header: "Póliza" },
          ]}
          rows={filtrados.map((a) => ({
            nombre: <span className="body-bold" style={{ color: "var(--gray-10)" }}>{a.nombre}</span>,
            rol: a.rol,
            inmueble: a.poliza.inmueble,
            tipoPoliza: a.poliza.plan,
            numeroPoliza: a.poliza.numeroPoliza,
          }))}
          onRowClick={(i) => {
            const a = filtrados[i];
            onVerPersona({ tipo: a.rol === "Propietario" ? "propietario" : "inquilino", cedula: a.cedula });
          }}
        />
      </section>
    </div>
  );
}
