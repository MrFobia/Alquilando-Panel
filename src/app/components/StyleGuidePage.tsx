import { useState } from "react";
import { Atoms } from "./kit/styleguide/Atoms";
import { Molecules } from "./kit/styleguide/Molecules";
import { Organisms } from "./kit/styleguide/Organisms";
import { Templates } from "./kit/styleguide/Templates";
import { AlquilandoLogo } from "./kit/AlquilandoLogo";
import { ArrowLeft } from "lucide-react";

const TABS = [
  { id: "atoms", label: "Átomos" },
  { id: "molecules", label: "Moléculas" },
  { id: "organisms", label: "Organismos" },
  { id: "templates", label: "Plantillas" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface Props { onBack: () => void }

export function StyleGuidePage({ onBack }: Props) {
  const [tab, setTab] = useState<TabId>("atoms");

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--gray-1)" }}>
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-8"
        style={{ backgroundColor: "var(--navy)", borderBottom: "1px solid rgba(255,255,255,0.1)", minHeight: 56 }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 body-small-regular transition-colors"
            style={{ color: "rgba(255,255,255,0.7)", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
          >
            <ArrowLeft size={16} />
            Volver al panel
          </button>
          <div style={{ width: 1, height: 20, backgroundColor: "rgba(255,255,255,0.2)" }} />
          <AlquilandoLogo height={22} />
        </div>
        <span className="title-tertiary-regular" style={{ color: "rgba(255,255,255,0.9)" }}>
          UI Kit &amp; Guía de estilos
        </span>
      </header>

      <div
        className="sticky z-10 flex gap-0 px-8"
        style={{ top: 56, backgroundColor: "#ffffff", borderBottom: "1px solid var(--gray-4)" }}
      >
        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-5 py-3 body-regular border-b-2 -mb-px transition-colors"
              style={{ color: isActive ? "var(--navy)" : "var(--gray-8)", borderBottomColor: isActive ? "var(--navy)" : "transparent", backgroundColor: "transparent", cursor: "pointer", fontWeight: isActive ? 600 : 400 }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <main className="flex-1 px-8 py-8 max-w-[1100px] mx-auto w-full">
        <div className="rounded-xl p-8" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)" }}>
          {tab === "atoms" && <Atoms />}
          {tab === "molecules" && <Molecules />}
          {tab === "organisms" && <Organisms />}
          {tab === "templates" && <Templates />}
        </div>
      </main>
    </div>
  );
}
