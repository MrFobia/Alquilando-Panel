import { useState } from "react";
import { AlquilandoLogo } from "./kit/AlquilandoLogo";
import { LinkText } from "./kit/LinkText";
import { AppButton } from "./kit/AppButton";
import {
  Home, Building2, FileText, ClipboardList, User, Users,
  Inbox, Handshake, Briefcase, LifeBuoy, ChevronDown, ChevronRight,
  ChevronLeft, Menu, X, LogOut, UserCircle, Palette,
} from "lucide-react";

const NAV = [
  { id: "inicio", label: "Inicio", icon: Home },
  {
    id: "inmuebles",
    label: "Inmuebles",
    icon: Building2,
    children: [
      { id: "inmuebles-administracion", label: "En administración" },
      { id: "inmuebles-comercializacion", label: "En comercialización" },
    ],
  },
  { id: "contratos", label: "Contratos", icon: FileText },
  { id: "inventarios", label: "Inventarios", icon: ClipboardList },
  { id: "inquilinos", label: "Inquilinos", icon: User },
  { id: "propietarios", label: "Propietarios", icon: Users },
  { id: "solicitudes", label: "Solicitudes", icon: Inbox },
  { id: "inmobiliarias", label: "Inmobiliarias aliadas", icon: Handshake },
  {
    id: "brokers",
    label: "Brokers",
    icon: Briefcase,
    children: [
      { id: "brokers-internos", label: "Internos" },
      { id: "brokers-externos", label: "Externos" },
    ],
  },
  { id: "mesa-ayuda", label: "Mesa de ayuda", icon: LifeBuoy },
];

const NAV_UTILIDADES = [
  { id: "styleguide", label: "Guía de estilos y UI Kit", icon: Palette },
];

interface Props {
  active: string;
  onSelect: (id: string) => void;
  onStyleGuide: () => void;
  onLogout: () => void;
}

interface NavListProps {
  active: string;
  collapsed: boolean;
  openGroups: Record<string, boolean>;
  onToggleGroup: (id: string) => void;
  onSelect: (id: string) => void;
  onStyleGuide: () => void;
}

function NavList({ active, collapsed, openGroups, onToggleGroup, onSelect, onStyleGuide }: NavListProps) {
  const handleClick = (item: { id: string; children?: unknown[] }) => {
    if (item.children?.length) return onToggleGroup(item.id);
    if (item.id === "styleguide") return onStyleGuide();
    return onSelect(item.id);
  };
  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 flex flex-col gap-0.5" style={{ paddingLeft: 12, paddingRight: 12 }}>
      {!collapsed && (
        <span className="tags px-3 pb-2" style={{ color: "var(--gray-7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Menú
        </span>
      )}
      {NAV.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id || active.startsWith(`${item.id}-`);
        const isOpen = openGroups[item.id];
        const hasChildren = !!item.children?.length;

        return (
          <div key={item.id}>
            <button
              onClick={() => handleClick(item)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-lg text-left transition-colors ${collapsed ? "justify-center" : "gap-3"}`}
              style={{
                cursor: "pointer",
                padding: collapsed ? "10px 0" : "9px 12px",
                backgroundColor: isActive ? "var(--navy-light)" : "transparent",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--gray-1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isActive ? "var(--navy-light)" : "transparent"; }}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.6} style={{ color: isActive ? "var(--navy)" : "var(--gray-9)", flexShrink: 0 }} />
              {!collapsed && (
                <>
                  <span className="body-regular" style={{ color: isActive ? "var(--navy)" : "var(--gray-10)", fontWeight: isActive ? 600 : 400, flex: 1 }}>
                    {item.label}
                  </span>
                  {hasChildren && (isOpen
                    ? <ChevronDown size={14} style={{ color: "var(--gray-8)" }} />
                    : <ChevronRight size={14} style={{ color: "var(--gray-8)" }} />)}
                </>
              )}
            </button>

            {hasChildren && isOpen && !collapsed && (
              <div className="flex flex-col gap-0.5 mt-0.5" style={{ paddingLeft: 21 }}>
                <div style={{ borderLeft: "1px solid var(--gray-4)", paddingLeft: 8 }} className="flex flex-col gap-0.5">
                  {item.children!.map((child) => {
                    const childActive = active === child.id;
                    return (
                      <button
                        key={child.id}
                        onClick={() => onSelect(child.id)}
                        className="w-full text-left rounded-lg transition-colors"
                        style={{
                          cursor: "pointer",
                          padding: "7px 12px",
                          backgroundColor: childActive ? "var(--navy-light)" : "transparent",
                          color: childActive ? "var(--navy)" : "var(--gray-9)",
                          fontWeight: childActive ? 600 : 400,
                        }}
                        onMouseEnter={(e) => { if (!childActive) e.currentTarget.style.backgroundColor = "var(--gray-1)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = childActive ? "var(--navy-light)" : "transparent"; }}
                      >
                        <span className="body-small-regular">{child.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ height: 1, backgroundColor: "var(--gray-4)", margin: collapsed ? "8px 0" : "8px 12px" }} />

      {NAV_UTILIDADES.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            title={collapsed ? item.label : undefined}
            className={`w-full flex items-center rounded-lg text-left transition-colors ${collapsed ? "justify-center" : "gap-3"}`}
            style={{
              cursor: "pointer",
              padding: collapsed ? "10px 0" : "9px 12px",
              backgroundColor: isActive ? "var(--navy-light)" : "transparent",
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--gray-1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isActive ? "var(--navy-light)" : "transparent"; }}
          >
            <Icon size={18} strokeWidth={1.6} style={{ color: "var(--gray-9)", flexShrink: 0 }} />
            {!collapsed && (
              <span className="body-regular" style={{ color: "var(--gray-10)", flex: 1 }}>{item.label}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

interface FooterProps {
  collapsed: boolean;
  onLogout: () => void;
}

function SidebarFooter({ collapsed, onLogout }: FooterProps) {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1 py-3" style={{ borderTop: "1px solid var(--gray-4)" }}>
        <button
          title="Administrar mi perfil"
          className="flex items-center justify-center rounded-lg transition-colors"
          style={{ cursor: "pointer", width: 40, height: 40, backgroundColor: "transparent", color: "var(--navy)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--navy-light)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <UserCircle size={20} strokeWidth={1.6} />
        </button>
        <button
          title="Cerrar sesión"
          onClick={onLogout}
          className="flex items-center justify-center rounded-lg transition-colors"
          style={{ cursor: "pointer", width: 40, height: 40, backgroundColor: "transparent", color: "var(--gray-9)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--gray-1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <LogOut size={18} strokeWidth={1.6} />
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-3" style={{ borderTop: "1px solid var(--gray-4)" }}>
      <span className="body-bold px-1" style={{ color: "var(--gray-10)" }}>Inmobiliaria Maestra</span>

      <AppButton variant="secondary" fullWidth bold>
        Administrar mi perfil
      </AppButton>

      <LinkText size="small" onClick={onLogout} className="w-full justify-center">
        Cerrar sesión
      </LinkText>

      <LinkText size="small" onClick={() => {}} className="w-full justify-center">
        Términos y condiciones
      </LinkText>
    </div>
  );
}

export function AppSidebar({ active, onSelect, onStyleGuide, onLogout }: Props) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleGroupDesktop = (id: string) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenGroups((prev) => ({ ...prev, [id]: true }));
    } else {
      toggleGroup(id);
    }
  };

  const selectMobile = (id: string) => {
    onSelect(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ─── Mobile top bar ─── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4"
        style={{ height: 56, backgroundColor: "var(--navy)" }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          className="flex items-center justify-center rounded-lg"
          style={{ cursor: "pointer", width: 40, height: 40, backgroundColor: "transparent", color: "#ffffff" }}
        >
          <Menu size={22} />
        </button>
        <AlquilandoLogo height={24} />
      </header>

      {/* ─── Mobile backdrop ─── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(15, 18, 63, 0.45)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─── Mobile drawer ─── */}
      <aside
        className="md:hidden fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-transform duration-200"
        style={{
          width: 280,
          backgroundColor: "#ffffff",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          boxShadow: mobileOpen ? "0 8px 32px rgba(26, 35, 126, 0.18)" : "none",
        }}
      >
        <div className="px-4 flex items-center justify-between" style={{ height: 56, backgroundColor: "var(--navy)" }}>
          <AlquilandoLogo height={24} />
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
            className="flex items-center justify-center rounded-lg"
            style={{ cursor: "pointer", width: 36, height: 36, backgroundColor: "transparent", color: "#ffffff" }}
          >
            <X size={20} />
          </button>
        </div>
        <NavList
          active={active}
          collapsed={false}
          openGroups={openGroups}
          onToggleGroup={toggleGroup}
          onSelect={selectMobile}
          onStyleGuide={() => { onStyleGuide(); setMobileOpen(false); }}
        />
        <SidebarFooter collapsed={false} onLogout={onLogout} />
      </aside>

      {/* ─── Desktop sidebar ─── */}
      <aside
        className="hidden md:flex sticky top-0 h-screen flex-col shrink-0 transition-all duration-200"
        style={{
          width: collapsed ? 72 : 240,
          backgroundColor: "#ffffff",
          borderRight: "1px solid var(--gray-4)",
        }}
      >
        <div
          className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-4`}
          style={{ height: 60, backgroundColor: "var(--navy)" }}
        >
          <AlquilandoLogo height={26} iconOnly={collapsed} />
        </div>

        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
          title={collapsed ? "Expandir menú" : "Contraer menú"}
          className="absolute z-10 flex items-center justify-center rounded-full transition-colors"
          style={{
            cursor: "pointer",
            width: 26,
            height: 26,
            top: 74,
            right: -13,
            backgroundColor: "#ffffff",
            border: "1px solid var(--gray-4)",
            color: "var(--navy)",
            boxShadow: "0 1px 4px rgba(26, 35, 126, 0.12)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--navy-light)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>

        <NavList
          active={active}
          collapsed={collapsed}
          openGroups={openGroups}
          onToggleGroup={toggleGroupDesktop}
          onSelect={onSelect}
          onStyleGuide={onStyleGuide}
        />
        <SidebarFooter collapsed={collapsed} onLogout={onLogout} />
      </aside>
    </>
  );
}
