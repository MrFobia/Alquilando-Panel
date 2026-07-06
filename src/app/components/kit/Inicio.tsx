import { useEffect, useState } from "react";
import { StatCard } from "./StatCard";
import { ContractsChart } from "./ContractsChart";
import { Footer } from "./Footer";
import { MonthRangePicker } from "./MonthRangePicker";

export function Inicio() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Welcome banner */}
      <section
        className="rounded-lg"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "24px 28px" }}
      >
        <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>¡Hola!, Inmobiliaria Maestra</h1>
        <p className="body-regular" style={{ color: "var(--gray-9)", marginTop: 4 }}>
          Administra y revisa todos tus procesos de manera fácil y rápida. ¡Todo lo que necesitas está aquí!
        </p>
      </section>

      {/* Date filter */}
      <div className="flex items-center justify-end gap-3">
        <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Fecha:</span>
        <MonthRangePicker />
      </div>

      {/* Contracts chart */}
      <ContractsChart loading={loading} />

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">
          <StatCard loading={loading}
            title="Portafolio Actual"
            rows={[
              { label: "Número de contratos activos", value: "1578" },
              { label: "Inm. portafolio comercialización", value: "164" },
              { label: "Total portafolio", value: "1742" },
            ]}
          />
          <StatCard loading={loading}
            title="Movimiento contratos junio de 2026"
            rows={[
              { label: "Nuevos contratos", value: "0 / Contratos", onClick: () => {} },
              { label: "Sustituciones", value: "2 / Contratos", onClick: () => {} },
              { label: "En vencimiento", value: "128 / Contratos", onClick: () => {} },
              { label: "Devoluciones", value: "5 / Finalizados", onClick: () => {} },
              { label: "En integración", value: "1 / Contratos", onClick: () => {} },
              { label: "Crecimiento neto", value: "-2 / Contratos" },
            ]}
          />
          <StatCard loading={loading}
            title="Clientes del sistema"
            rows={[
              { label: "Propietarios", value: "1013" },
              { label: "Inquilinos", value: "1578" },
              { label: "Co propietarios", value: "210" },
              { label: "Inmobiliarias aliadas", value: "6" },
            ]}
          />
          <StatCard loading={loading}
            title="Clientes Inactivos"
            rows={[
              { label: "Propietarios", value: "90", onClick: () => {} },
              { label: "Inquilinos", value: "0", onClick: () => {} },
              { label: "Co propietarios", value: "165", onClick: () => {} },
            ]}
          />
        </div>

        <div className="flex flex-col gap-5">
          <StatCard loading={loading}
            title="Canon promedio"
            rows={[
              { label: "Valor por mes", value: "$ 2.842.338" },
              { label: "% de administración promedio", value: "5" },
            ]}
          />
          <StatCard loading={loading}
            title="Administración P.H."
            rows={[
              { label: "Administraciones", value: "754" },
              { label: "Administraciones gestionadas", value: "651" },
            ]}
          />
          <StatCard loading={loading}
            title="Solicitudes"
            rows={[
              { label: "Recibidas del mes", value: "522" },
              { label: "Gestionadas del mes", value: "335" },
              { label: "Cartas terminación este mes", value: "1" },
              { label: "Total abiertas", value: "187" },
              { label: "Vencidas", value: "0" },
              { label: "Alquicaja", value: "0" },
            ]}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
