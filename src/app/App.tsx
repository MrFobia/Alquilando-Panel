import { useState } from "react";
import { AppSidebar } from "./components/AppSidebar";
import { StyleGuidePage } from "./components/StyleGuidePage";
import { Inicio } from "./components/kit/Inicio";
import { InmueblesComercializacion } from "./components/InmueblesComercializacion";
import { MesaAyuda } from "./components/MesaAyuda";
import { Contratos } from "./components/Contratos";
import { InmueblesAdministracion } from "./components/InmueblesAdministracion";
import { Brokers, BROKERS_ACTIVOS_ROWS } from "./components/Brokers";
import { Inventarios } from "./components/Inventarios";
import { SegurosAdmin } from "./components/SegurosAdmin";
import { Inquilinos } from "./components/Inquilinos";
import { Propietarios } from "./components/Propietarios";
import { Solicitudes } from "./components/Solicitudes";
import { Inmobiliarias } from "./components/Inmobiliarias";
import { BrokerDetalle } from "./components/BrokerDetalle";
import { BrokersInternos, BROKERS_INTERNOS_ROWS } from "./components/BrokersInternos";
import type { BrokerRow } from "./components/Brokers";
import type { BrokerInternoRow, EstadoInterno } from "./components/BrokersInternos";
import { Toast } from "./components/kit/Toast";
import { InmuebleDetalle } from "./components/InmuebleDetalle";
import type { InmuebleData } from "./components/InmuebleDetalle";
import { FloatingChat } from "./components/FloatingChat";
import { Login } from "./components/Login";
import { PortalInquilino } from "./components/PortalInquilino";
import { ConfirmExitModal } from "./components/kit/ConfirmExitModal";
import { AppDataProvider } from "./store/AppDataContext";
import { SessionProvider, type PerfilInmobiliaria } from "./store/SessionContext";
import type { UserRole } from "./components/Login";
import { CorreoConfirmacionPoliza } from "./components/CorreoConfirmacionPoliza";

type Page = "dashboard" | "styleguide" | "login" | "portal-inquilino";

const SECTION_TITLES: Record<string, string> = {
  "inmuebles-administracion": "Inmuebles — En administración",
  "inmuebles-comercializacion": "Inmuebles — En comercialización",
  contratos: "Contratos",
  inventarios: "Inventarios",
  seguros: "Seguros",
  inquilinos: "Inquilinos",
  propietarios: "Propietarios",
  solicitudes: "Solicitudes",
  inmobiliarias: "Inmobiliarias aliadas",
  brokers: "Brokers",
  "brokers-internos": "Brokers — Internos",
  "mesa-ayuda": "Mesa de ayuda",
};

export default function App() {
  // Vista previa del correo de confirmación: pantalla suelta, fuera de sesión/login,
  // para poder abrirla en una pestaña nueva (target="_blank") desde PagoExitoso sin
  // depender del estado de React de la pestaña original. Ver CorreoConfirmacionPoliza.tsx.
  if (new URLSearchParams(window.location.search).get("vista") === "correo-confirmacion") {
    return <CorreoConfirmacionPoliza />;
  }
  return (
    <AppDataProvider>
      <AppInner />
    </AppDataProvider>
  );
}

function AppInner() {
  const [page, setPage] = useState<Page>("login");
  const [role, setRole] = useState<UserRole | null>(null);
  const [perfil, setPerfil] = useState<PerfilInmobiliaria | null>(null);
  const [active, setActive] = useState("inicio");
  const [selectedBroker, setSelectedBroker] = useState<BrokerRow | null>(null);
  const [selectedBrokerInterno, setSelectedBrokerInterno] = useState<BrokerInternoRow | null>(null);
  const [brokersInternosRows, setBrokersInternosRows] = useState<BrokerInternoRow[]>(BROKERS_INTERNOS_ROWS);
  const [brokersActivosRows, setBrokersActivosRows] = useState<BrokerRow[]>(BROKERS_ACTIVOS_ROWS);

  const currentBrokerInterno = selectedBrokerInterno
    ? brokersInternosRows.find((r) => r.id === selectedBrokerInterno.id) ?? selectedBrokerInterno
    : null;

  const currentBrokerActivo = selectedBroker && selectedBroker.estadoBroker === "activo"
    ? brokersActivosRows.find((r) => r.id === selectedBroker.id) ?? selectedBroker
    : selectedBroker;

  const handleChangeMetaMensualExterno = (metaMensual: number) => {
    if (!selectedBroker) return;
    setBrokersActivosRows((prev) =>
      prev.map((r) => (r.id === selectedBroker.id ? { ...r, metaMensual } : r)),
    );
  };

  const handleChangeEstadoInterno = (estado: EstadoInterno, meta?: { desde?: string; hasta?: string }) => {
    if (!currentBrokerInterno) return;
    setBrokersInternosRows((prev) =>
      prev.map((r) =>
        r.id === currentBrokerInterno.id
          ? { ...r, estado, estadoDesde: meta?.desde, estadoHasta: meta?.hasta }
          : r,
      ),
    );
  };

  const handleChangeMetaMensual = (metaMensual: number) => {
    if (!currentBrokerInterno) return;
    setBrokersInternosRows((prev) =>
      prev.map((r) => (r.id === currentBrokerInterno.id ? { ...r, metaMensual } : r)),
    );
  };
  const [selectedInmueble, setSelectedInmueble] = useState<InmuebleData | null>(null);
  const [pendingApprove, setPendingApprove] = useState<BrokerRow | null>(null);
  const [pendingInactivate, setPendingInactivate] = useState<BrokerRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [exitGuard, setExitGuard] = useState<{ onSave: () => void; onDiscard: () => void } | null>(null);
  const [pendingNav, setPendingNav] = useState<(() => void) | null>(null);

  const attemptNav = (fn: () => void) => { if (exitGuard) setPendingNav(() => fn); else fn(); };

  // Cuando se entra a Propietarios/Inquilinos desde el listado de "Seguros", abre directo
  // la ficha de esa persona en vez del listado. Se limpia en cualquier navegación normal
  // del sidebar para no reabrir la ficha equivocada si el usuario entra por su cuenta.
  const [personaSeguro, setPersonaSeguro] = useState<{ tipo: "propietario" | "inquilino"; cedula: string } | null>(null);
  const irAFichaDesdeSeguros = (persona: { tipo: "propietario" | "inquilino"; cedula: string }) => {
    setPersonaSeguro(persona);
    setActive(persona.tipo === "propietario" ? "propietarios" : "inquilinos");
  };

  const goToSection = (id: string) => { setActive(id); setSelectedBroker(null); setSelectedBrokerInterno(null); setSelectedInmueble(null); setPersonaSeguro(null); };
  const goToSectionGuarded = (id: string) => attemptNav(() => goToSection(id));
  const goToStyleGuideGuarded = () => attemptNav(() => setPage("styleguide"));
  const goToLogoutGuarded = () => attemptNav(() => setPage("login"));

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

  if (page === "login") {
    return (
      <Login
        onLogin={(nuevoRole, nuevoPerfil) => {
          setRole(nuevoRole);
          setPerfil(nuevoPerfil);
          if (nuevoRole === "inquilino") {
            setPage("portal-inquilino");
          } else {
            setPage("dashboard");
            goToSection("inicio");
          }
        }}
      />
    );
  }

  if (page === "portal-inquilino") {
    return <PortalInquilino onLogout={() => setPage("login")} />;
  }

  return (
    <SessionProvider value={{ role, perfil }}>
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--gray-1)", fontFamily: "Roboto, sans-serif" }}
    >
      <AppSidebar
        active={active}
        onSelect={goToSectionGuarded}
        onStyleGuide={goToStyleGuideGuarded}
        onLogout={goToLogoutGuarded}
      />
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <div className="px-4 md:px-8 py-6 max-w-[1400px] mx-auto">
          {active === "inicio" && <Inicio />}
          {active === "inmuebles-comercializacion" && (
            selectedInmueble ? (
              <InmuebleDetalle inmueble={selectedInmueble} onBack={() => setSelectedInmueble(null)} />
            ) : (
              <InmueblesComercializacion onViewInmueble={setSelectedInmueble} onDirtyChange={setExitGuard} />
            )
          )}
          {active === "mesa-ayuda" && <MesaAyuda />}
          {active === "contratos" && <Contratos onDirtyChange={setExitGuard} />}
          {active === "inmuebles-administracion" && <InmueblesAdministracion />}
          {active === "inventarios" && <Inventarios />}
          {active === "seguros" && <SegurosAdmin onVerPersona={irAFichaDesdeSeguros} />}
          {active === "inquilinos" && <Inquilinos initialCedula={personaSeguro?.tipo === "inquilino" ? personaSeguro.cedula : undefined} />}
          {active === "propietarios" && <Propietarios initialCedula={personaSeguro?.tipo === "propietario" ? personaSeguro.cedula : undefined} />}
          {active === "solicitudes" && <Solicitudes />}
          {active === "inmobiliarias" && <Inmobiliarias />}
          {active === "brokers-internos" && (
            currentBrokerInterno ? (
              <BrokerDetalle
                broker={{
                  id: currentBrokerInterno.id,
                  nombre: currentBrokerInterno.nombre,
                  asesor: currentBrokerInterno.zona,
                  estadoBroker: "activo",
                }}
                onBack={() => setSelectedBrokerInterno(null)}
                estadoInterno={currentBrokerInterno.estado}
                estadoInternoDesde={currentBrokerInterno.estadoDesde}
                estadoInternoHasta={currentBrokerInterno.estadoHasta}
                onChangeEstadoInterno={handleChangeEstadoInterno}
                desempenoInterno={{
                  contratosMes: currentBrokerInterno.contratosMes,
                  contratosAno: currentBrokerInterno.contratosAno,
                  metaMensual: currentBrokerInterno.metaMensual,
                }}
                onChangeMetaMensual={handleChangeMetaMensual}
              />
            ) : (
              <BrokersInternos rows={brokersInternosRows} onViewBroker={setSelectedBrokerInterno} />
            )
          )}
          {active === "brokers-externos" && (
            selectedInmueble ? (
              <InmuebleDetalle inmueble={selectedInmueble} onBack={() => setSelectedInmueble(null)} />
            ) : selectedBroker ? (
              <BrokerDetalle
                broker={currentBrokerActivo!}
                onBack={() => setSelectedBroker(null)}
                onApprove={handleApproveBroker}
                onInactivate={handleInactivateBroker}
                onViewInmueble={setSelectedInmueble}
                desempenoInterno={
                  currentBrokerActivo?.estadoBroker === "activo"
                    ? { contratosMes: currentBrokerActivo.contratos ?? "0", metaMensual: currentBrokerActivo.metaMensual ?? 0 }
                    : undefined
                }
                onChangeMetaMensual={handleChangeMetaMensualExterno}
              />
            ) : (
              <Brokers
                activosRows={brokersActivosRows}
                setActivosRows={setBrokersActivosRows}
                onViewBroker={setSelectedBroker}
                pendingApprove={pendingApprove}
                pendingInactivate={pendingInactivate}
                onPendingHandled={() => { setPendingApprove(null); setPendingInactivate(null); }}
              />
            )
          )}
          {!["inicio", "inmuebles-comercializacion", "inmuebles-administracion", "mesa-ayuda", "contratos", "brokers-internos", "brokers-externos", "inventarios", "seguros", "inquilinos", "propietarios", "solicitudes", "inmobiliarias"].includes(active) && (
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
      <ConfirmExitModal
        open={!!pendingNav}
        onCancel={() => setPendingNav(null)}
        onSaveExit={() => { exitGuard?.onSave(); const fn = pendingNav; setPendingNav(null); setExitGuard(null); fn?.(); }}
        onDiscard={() => { exitGuard?.onDiscard(); const fn = pendingNav; setPendingNav(null); setExitGuard(null); fn?.(); }}
      />
    </div>
    </SessionProvider>
  );
}
