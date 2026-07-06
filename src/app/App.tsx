import { useState } from "react";
import { AppSidebar } from "./components/AppSidebar";
import { StyleGuidePage } from "./components/StyleGuidePage";
import { Inicio } from "./components/kit/Inicio";
import { InmueblesComercializacion } from "./components/InmueblesComercializacion";
import { MesaAyuda } from "./components/MesaAyuda";
import { Contratos } from "./components/Contratos";
import { InmueblesAdministracion } from "./components/InmueblesAdministracion";
import { Brokers } from "./components/Brokers";
import { Inventarios } from "./components/Inventarios";
import { Inquilinos } from "./components/Inquilinos";
import { Propietarios } from "./components/Propietarios";
import { Solicitudes } from "./components/Solicitudes";
import { Inmobiliarias } from "./components/Inmobiliarias";
import { BrokerDetalle } from "./components/BrokerDetalle";
import type { BrokerRow } from "./components/Brokers";
import { Toast } from "./components/kit/Toast";
import { InmuebleDetalle } from "./components/InmuebleDetalle";
import type { InmuebleData } from "./components/InmuebleDetalle";
import { FloatingChat } from "./components/FloatingChat";

type Page = "dashboard" | "styleguide";

const SECTION_TITLES: Record<string, string> = {
  "inmuebles-administracion": "Inmuebles — En administración",
  "inmuebles-comercializacion": "Inmuebles — En comercialización",
  contratos: "Contratos",
  inventarios: "Inventarios",
  inquilinos: "Inquilinos",
  propietarios: "Propietarios",
  solicitudes: "Solicitudes",
  inmobiliarias: "Inmobiliarias aliadas",
  brokers: "Brokers",
  "brokers-internos": "Brokers — Internos",
  "mesa-ayuda": "Mesa de ayuda",
};

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [active, setActive] = useState("inicio");
  const [selectedBroker, setSelectedBroker] = useState<BrokerRow | null>(null);
  const [selectedInmueble, setSelectedInmueble] = useState<InmuebleData | null>(null);
  const [pendingApprove, setPendingApprove] = useState<BrokerRow | null>(null);
  const [pendingInactivate, setPendingInactivate] = useState<BrokerRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const goToSection = (id: string) => { setActive(id); setSelectedBroker(null); setSelectedInmueble(null); };

  const handleApproveBroker = () => {
    if (!selectedBroker) return;
    setPendingApprove(selectedBroker);
    setToast(`${selectedBroker.nombre} ahora es un broker activo.`);
    setSelectedBroker(null);
  };

  const handleInactivateBroker = () => {
    if (!selectedBroker) return;
    setPendingInactivate(selectedBroker);
    setToast(`${selectedBroker.nombre} fue marcado como inactivo.`);
    setSelectedBroker(null);
  };

  if (page === "styleguide") {
    return <StyleGuidePage onBack={() => setPage("dashboard")} />;
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--gray-1)", fontFamily: "Roboto, sans-serif" }}
    >
      <AppSidebar
        active={active}
        onSelect={goToSection}
        onTerminos={() => setPage("styleguide")}
      />
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <div className="px-4 md:px-8 py-6 max-w-[1400px] mx-auto">
          {active === "inicio" && <Inicio />}
          {active === "inmuebles-comercializacion" && (
            selectedInmueble ? (
              <InmuebleDetalle inmueble={selectedInmueble} onBack={() => setSelectedInmueble(null)} />
            ) : (
              <InmueblesComercializacion onViewInmueble={setSelectedInmueble} />
            )
          )}
          {active === "mesa-ayuda" && <MesaAyuda />}
          {active === "contratos" && <Contratos />}
          {active === "inmuebles-administracion" && <InmueblesAdministracion />}
          {active === "inventarios" && <Inventarios />}
          {active === "inquilinos" && <Inquilinos />}
          {active === "propietarios" && <Propietarios />}
          {active === "solicitudes" && <Solicitudes />}
          {active === "inmobiliarias" && <Inmobiliarias />}
          {active === "brokers-externos" && (
            selectedInmueble ? (
              <InmuebleDetalle inmueble={selectedInmueble} onBack={() => setSelectedInmueble(null)} />
            ) : selectedBroker ? (
              <BrokerDetalle
                broker={selectedBroker}
                onBack={() => setSelectedBroker(null)}
                onApprove={handleApproveBroker}
                onInactivate={handleInactivateBroker}
                onViewInmueble={setSelectedInmueble}
              />
            ) : (
              <Brokers
                onViewBroker={setSelectedBroker}
                pendingApprove={pendingApprove}
                pendingInactivate={pendingInactivate}
                onPendingHandled={() => { setPendingApprove(null); setPendingInactivate(null); }}
              />
            )
          )}
          {!["inicio", "inmuebles-comercializacion", "inmuebles-administracion", "mesa-ayuda", "contratos", "brokers-externos", "inventarios", "inquilinos", "propietarios", "solicitudes", "inmobiliarias"].includes(active) && (
            <div className="flex flex-col gap-5">
              <section
                className="rounded-lg"
                style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "24px 28px" }}
              >
                <h1 className="title-secondary" style={{ color: "var(--navy)" }}>
                  {SECTION_TITLES[active] ?? "Sección"}
                </h1>
              </section>
              <div
                className="rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", minHeight: 400 }}
              >
                <p className="title-tertiary-regular" style={{ color: "var(--gray-8)" }}>
                  Sección en construcción
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      {toast && <Toast message={toast} description="El estado se actualizó en la lista de brokers." onClose={() => setToast(null)} />}
      {active === "mesa-ayuda" && <FloatingChat />}
    </div>
  );
}
