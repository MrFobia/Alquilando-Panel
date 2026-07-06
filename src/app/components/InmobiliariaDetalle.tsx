import { useState } from "react";
import { ArrowLeft, ChevronRight, Bell } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { AppButton } from "./kit/AppButton";
import { SelectInput } from "./kit/SelectInput";
import { ContractsChart } from "./kit/ContractsChart";
import { Footer } from "./kit/Footer";
import type { InmobiliariaRow } from "./Inmobiliarias";

interface Props {
  inmobiliaria: InmobiliariaRow;
  onBack: () => void;
}

const MESES =["Ene 2026", "Feb 2026", "Mar 2026", "Abr 2026", "May 2026", "Jun 2026"];

const PORTAFOLIO = [
  { name: "En operación", value: 183, color: "#7c3aed" },
  { name: "Siniestrados", value: 1, color: "#ef4444" },
  { name: "En comercialización", value: 0, color: "#06b6d4" },
  { name: "En terminación", value: 0, color: "#3b82f6" },
];

const HONORARIOS = [
  { label: "Honorarios de Admin Canon Mes", value: "$ 13.494.662", pct: "7.24 %" },
  { label: "Honorarios de gestión comercial", value: "0", pct: "0.00 %" },
  { label: "H. de Admin Admin PH Mes", value: "$ 696.367", pct: "0.37 %" },
  { label: "Ingresos x Mora", value: "0", pct: "0.00 %" },
  { label: "Aseguradora", value: "$ 827.327", pct: "0.44 %" },
  { label: "Cláusulas Incumplimiento", value: "$ 300.163", pct: "0.16 %" },
  { label: "Productos & Servicios", value: "0", pct: "0.00 %" },
];

const MES_OPTIONS = MESES.map((m) => ({ value: m, label: m }));

function Card({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section
      className="rounded-lg flex flex-col gap-4"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <span className="subtitle" style={{ color: "var(--navy)" }}>{title}</span>
        {right}
      </div>
      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
      {children}
    </section>
  );
}

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="body-bold" style={{ color: "var(--navy)" }}>{label}</span>
      <span className="body-regular" style={{ color: "var(--gray-10)" }}>{value}</span>
    </div>
  );
}

function ClienteRow({ label, value }: { label: string; value: number }) {
  return (
    <button
      className="flex items-center justify-between gap-4 w-full"
      style={{ cursor: "pointer", background: "transparent" }}
    >
      <span className="body-bold" style={{ color: "var(--navy)" }}>{label}</span>
      <span className="inline-flex items-center gap-1 body-regular" style={{ color: "var(--gray-10)" }}>
        {value} <ChevronRight size={15} style={{ color: "var(--gray-7)" }} />
      </span>
    </button>
  );
}

export function InmobiliariaDetalle({ inmobiliaria, onBack }: Props) {
  const [mes, setMes] = useState("");
  const totalPortafolio = PORTAFOLIO.reduce((a, p) => a + p.value, 0);

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
        <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>{inmobiliaria.nombre}</h1>
        <AppButton variant="primary" bold><Bell size={15} /> Notificación por migración</AppButton>
      </section>

      {/* Filtro fecha */}
      <div className="flex items-center justify-end gap-3">
        <span className="body-bold" style={{ color: "var(--gray-10)" }}>Fecha:</span>
        <SelectInput options={MES_OPTIONS} value={mes} onChange={setMes} placeholder="Seleccione un mes" className="min-w-[220px]" />
      </div>

      {/* Estado de contratos (mismo componente del Inicio) */}
      <ContractsChart />

      {/* Dos columnas */}
      <div className="flex gap-5 items-start max-lg:flex-col">
        {/* Izquierda */}
        <div className="flex flex-col gap-5 flex-1 min-w-0 max-lg:w-full">
          <Card title="Estado de la cartera">
            <StatRow label="Valor cartera inicial" value="$ 186.464.949" />
            <StatRow label="Ingresos nuevos mes" value="$ 1.080.158" />
            <StatRow label="Devoluciones" value="$ 0" />
          </Card>

          <Card title="Clientes inactivos">
            <ClienteRow label="Propietarios" value={0} />
            <ClienteRow label="Inquilinos" value={0} />
            <ClienteRow label="Co propietarios" value={25} />
          </Card>

          <Card title="Portafolio actual">
            <div className="flex items-center gap-6 flex-wrap">
              <div style={{ width: 200, flexShrink: 0, position: "relative" }}>
                <PieChart width={200} height={200}>
                  <Pie data={PORTAFOLIO} cx="50%" cy="50%" innerRadius={62} outerRadius={92} dataKey="value" startAngle={90} endAngle={-270} isAnimationActive={false}>
                    {PORTAFOLIO.map((p) => <Cell key={p.name} fill={p.color} />)}
                  </Pie>
                </PieChart>
                <div className="absolute flex flex-col items-center" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                  <span className="title-tertiary-bold" style={{ color: "var(--navy)" }}>{totalPortafolio}</span>
                  <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Total inmuebles<br />portafolio</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1 min-w-[180px]">
                {PORTAFOLIO.map((p) => (
                  <div key={p.name} className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 body-regular" style={{ color: "var(--gray-10)" }}>
                      <span className="rounded-full" style={{ width: 10, height: 10, backgroundColor: p.color }} /> {p.name}
                    </span>
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Derecha */}
        <div className="flex flex-col gap-5 flex-1 min-w-0 max-lg:w-full">
          <Card
            title="Honorarios"
            right={<span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Total ingresos: <span className="body-bold" style={{ color: "var(--navy)" }}>$ 15.318.519</span></span>}
          >
            {HONORARIOS.map((h) => (
              <div key={h.label} className="flex items-center justify-between gap-4">
                <span className="body-bold" style={{ color: "var(--navy)" }}>{h.label}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="body-regular" style={{ color: "var(--gray-10)" }}>{h.value}</span>
                  <span
                    className="tags rounded-full px-2.5 py-0.5"
                    style={{ backgroundColor: "var(--green-status-light)", color: "var(--green-status)", border: "1px solid var(--green-status)" }}
                  >
                    {h.pct}
                  </span>
                </div>
              </div>
            ))}
          </Card>

          <Card title="Solicitudes">
            <StatRow label="Recibidas" value="22" />
            <StatRow label="Abiertas" value="22" />
            <StatRow label="Cartas terminación" value="0" />
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
