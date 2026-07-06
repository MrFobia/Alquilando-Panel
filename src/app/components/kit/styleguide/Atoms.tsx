import { AlquilandoLogo } from "../AlquilandoLogo";
import { LinkText } from "../LinkText";
import { StatusBadge } from "../StatusBadge";
import {
  Eye, Search, Filter, Home, Users, FileText, Building2, MessageCircle,
  ChevronDown, ChevronRight, ArrowUpRight, Plus, Edit, Trash2, LogOut,
  Star, Check, X, Bell, MapPin, Phone, Mail, Calendar, BarChart2,
  User, Shield, Upload, Download, ExternalLink,
} from "lucide-react";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="title-tertiary-bold mb-6 pb-2 border-b" style={{ color: "var(--navy)", borderColor: "var(--gray-5)" }}>
      {children}
    </h3>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return <p className="tags mt-2 text-center" style={{ color: "var(--gray-9)" }}>{children}</p>;
}

const brandColors = [
  { name: "--navy", hex: "#1A237E", label: "Navy Principal", textWhite: true },
  { name: "--alquilando", hex: "#00D1FF", label: "Alquilando Cyan", textWhite: false },
  { name: "--violeta", hex: "#5C6BC0", label: "Violeta", textWhite: true },
];
const statusColors = [
  { name: "--orange-status", hex: "#FB8C00", label: "Pendiente", textWhite: true },
  { name: "--green-status", hex: "#48785A", label: "Activo / Disponible", textWhite: true },
  { name: "--red-status", hex: "#D32F2F", label: "Rechazado / Error", textWhite: true },
  { name: "--destructive", hex: "#D4183D", label: "Destructive", textWhite: true },
];
const grayScale = [
  { name: "--gray-10", hex: "#3F364B", label: "Gray 10 — Texto oscuro", textWhite: true },
  { name: "--gray-9", hex: "#616161", label: "Gray 9 — Texto secundario", textWhite: true },
  { name: "--gray-8", hex: "#9E9E9E", label: "Gray 8 — Placeholder", textWhite: false },
  { name: "--gray-7", hex: "#B0B0B0", label: "Gray 7", textWhite: false },
  { name: "--gray-6", hex: "#BEBEBE", label: "Gray 6 — Disabled", textWhite: false },
  { name: "--gray-5", hex: "#E0E0E0", label: "Gray 5 — Bordes", textWhite: false },
  { name: "--gray-4", hex: "#E8E8E8", label: "Gray 4", textWhite: false },
  { name: "--gray-3", hex: "#EDEDED", label: "Gray 3", textWhite: false },
  { name: "--gray-2", hex: "#EEEEEE", label: "Gray 2", textWhite: false },
  { name: "--gray-1", hex: "#F6F6F6", label: "Gray 1 — Fondo alterno", textWhite: false },
];

function ColorSwatch({ name, hex, label, textWhite }: { name: string; hex: string; label: string; textWhite: boolean }) {
  return (
    <div className="flex flex-col">
      <div className="w-full h-16 rounded-lg border flex items-end p-2" style={{ backgroundColor: `var(${name})`, borderColor: "var(--gray-5)" }}>
        <span className="tags" style={{ color: textWhite ? "#ffffff" : "var(--gray-9)" }}>{hex}</span>
      </div>
      <SubLabel>
        <span className="body-small-regular block" style={{ color: "var(--gray-10)" }}>{label}</span>
        <span className="tags" style={{ color: "var(--gray-8)" }}>{name}</span>
      </SubLabel>
    </div>
  );
}

const typeScale = [
  { cls: "display-primary", label: "Display Primary", sample: "Alquilando", meta: "Roboto Bold 64px" },
  { cls: "display-secondary", label: "Display Secondary", sample: "Plataforma Inmobiliaria", meta: "Roboto SemiBold 40px" },
  { cls: "display-tertiary", label: "Display Tertiary", sample: "Gestión de Inmuebles", meta: "Roboto SemiBold 24px" },
  { cls: "title-primary-bold", label: "Title Primary Bold", sample: "Datos del inmueble", meta: "Roboto Bold 32px" },
  { cls: "title-primary", label: "Title Primary", sample: "Datos del inmueble", meta: "Roboto Regular 32px" },
  { cls: "title-secondary", label: "Title Secondary", sample: "Información general", meta: "Roboto SemiBold 24px" },
  { cls: "title-tertiary-bold", label: "Title Tertiary Bold", sample: "Publicación", meta: "Roboto Bold 20px" },
  { cls: "title-tertiary-regular", label: "Title Tertiary Regular", sample: "Publicación", meta: "Roboto Regular 20px" },
  { cls: "subtitle", label: "Subtitle", sample: "Estado de la publicación", meta: "Roboto SemiBold 18px" },
  { cls: "body-xl-bold", label: "Body XL Bold", sample: "Canon mensual: $1.456.900", meta: "Roboto Bold 18px" },
  { cls: "body-xl-regular", label: "Body XL Regular", sample: "Canon mensual: $1.456.900", meta: "Roboto Regular 18px" },
  { cls: "body-large-bold", label: "Body Large Bold", sample: "Inmobiliaria Benítez", meta: "Roboto Regular 16px" },
  { cls: "body-large-regular", label: "Body Large Regular", sample: "Inmobiliaria Benítez", meta: "Roboto Regular 16px" },
  { cls: "body-bold", label: "Body Bold", sample: "Tipo de inmueble: Apartamento", meta: "Roboto Bold 14px" },
  { cls: "body-regular", label: "Body Regular", sample: "Tipo de inmueble: Apartamento", meta: "Roboto Regular 14px" },
  { cls: "body-small-bold", label: "Body Small Bold", sample: "Sin publicar · Ver más", meta: "Roboto Regular 12px" },
  { cls: "body-small-regular", label: "Body Small Regular", sample: "Sin publicar · Ver más", meta: "Roboto Regular 12px" },
  { cls: "tags-bold", label: "Tags Bold", sample: "PENDIENTE · ACTIVO", meta: "Roboto Regular 12px" },
  { cls: "tags", label: "Tags", sample: "PENDIENTE · ACTIVO", meta: "Roboto Regular 12px" },
  { cls: "disclamer", label: "Disclamer", sample: "* Términos y condiciones aplican", meta: "Roboto Regular 10px" },
];

const spacingTokens = [
  { label: "4px", value: "4px" }, { label: "8px", value: "8px" },
  { label: "12px", value: "12px" }, { label: "16px", value: "16px" },
  { label: "24px", value: "24px" }, { label: "32px", value: "32px" },
  { label: "48px", value: "48px" }, { label: "64px", value: "64px" },
];

const radiusTokens = [
  { label: "sm — 6px", value: "var(--radius-sm)" },
  { label: "md — 8px", value: "var(--radius-md)" },
  { label: "lg — 10px", value: "var(--radius-lg)" },
  { label: "xl — 14px", value: "var(--radius-xl)" },
  { label: "pill — 50px", value: "50px" },
];

const badges: { label: string; variant: "draft" | "pending" | "registered" | "active" | "rejected" | "neutral" }[] = [
  { label: "Borrador", variant: "draft" },
  { label: "En elaboración", variant: "pending" },
  { label: "Asignado", variant: "registered" },
  { label: "En ejecucion", variant: "active" },
  { label: "Rechazado", variant: "rejected" },
  { label: "Sin publicar", variant: "neutral" },
];

const icons = [
  { icon: Eye, name: "Eye" }, { icon: Search, name: "Search" }, { icon: Filter, name: "Filter" },
  { icon: Home, name: "Home" }, { icon: Users, name: "Users" }, { icon: FileText, name: "FileText" },
  { icon: Building2, name: "Building2" }, { icon: MessageCircle, name: "MessageCircle" },
  { icon: ChevronDown, name: "ChevronDown" }, { icon: ChevronRight, name: "ChevronRight" },
  { icon: ArrowUpRight, name: "ArrowUpRight" }, { icon: Plus, name: "Plus" },
  { icon: Edit, name: "Edit" }, { icon: Trash2, name: "Trash2" }, { icon: LogOut, name: "LogOut" },
  { icon: Star, name: "Star" }, { icon: Check, name: "Check" }, { icon: X, name: "X" },
  { icon: Bell, name: "Bell" }, { icon: MapPin, name: "MapPin" }, { icon: Phone, name: "Phone" },
  { icon: Mail, name: "Mail" }, { icon: Calendar, name: "Calendar" }, { icon: BarChart2, name: "BarChart2" },
  { icon: User, name: "User" }, { icon: Shield, name: "Shield" }, { icon: Upload, name: "Upload" },
  { icon: Download, name: "Download" }, { icon: ExternalLink, name: "ExternalLink" },
];

export function Atoms() {
  return (
    <div className="space-y-16">
      {/* Logo */}
      <div>
        <SectionTitle>Logotipo</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[{ bg: "var(--navy)", label: "Fondo navy (uso principal)" }, { bg: "var(--violeta)", label: "Fondo violeta" }, { bg: "var(--gray-10)", label: "Fondo oscuro neutro" }].map(({ bg, label }) => (
            <div key={bg} className="rounded-xl flex flex-col items-center justify-center gap-4 p-8" style={{ backgroundColor: bg }}>
              <AlquilandoLogo height={36} />
              <span className="disclamer" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="body-bold mb-4" style={{ color: "var(--gray-9)" }}>Tamaños permitidos</p>
          <div className="rounded-xl flex items-end justify-start gap-10 p-8 flex-wrap" style={{ backgroundColor: "var(--navy)" }}>
            {[{ h: 20, label: "20px — mín." }, { h: 28, label: "28px" }, { h: 36, label: "36px" }, { h: 48, label: "48px" }].map(({ h, label }) => (
              <div key={h} className="flex flex-col items-center gap-3">
                <AlquilandoLogo height={h} />
                <span className="disclamer" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Colors */}
      <div>
        <SectionTitle>Paleta de colores</SectionTitle>
        <div className="mb-6">
          <p className="body-bold mb-3" style={{ color: "var(--gray-9)" }}>Marca</p>
          <div className="grid grid-cols-3 gap-4">{brandColors.map((c) => <ColorSwatch key={c.name} {...c} />)}</div>
        </div>
        <div className="mb-6">
          <p className="body-bold mb-3" style={{ color: "var(--gray-9)" }}>Estados</p>
          <div className="grid grid-cols-4 gap-4">{statusColors.map((c) => <ColorSwatch key={c.name} {...c} />)}</div>
        </div>
        <div>
          <p className="body-bold mb-3" style={{ color: "var(--gray-9)" }}>Escala de grises</p>
          <div className="grid grid-cols-5 gap-3">{grayScale.map((c) => <ColorSwatch key={c.name} {...c} />)}</div>
        </div>
      </div>

      {/* Typography */}
      <div>
        <SectionTitle>Tipografía</SectionTitle>
        <div className="space-y-1">
          {typeScale.map(({ cls, sample, meta }) => (
            <div key={cls} className="flex items-baseline justify-between py-3 border-b" style={{ borderColor: "var(--gray-4)" }}>
              <div className="flex-1"><span className={cls} style={{ color: "var(--gray-10)" }}>{sample}</span></div>
              <div className="flex gap-8 shrink-0">
                <span className="tags" style={{ color: "var(--gray-8)" }}>.{cls}</span>
                <span className="tags" style={{ color: "var(--gray-6)", minWidth: 180, textAlign: "right" }}>{meta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Icons */}
      <div>
        <SectionTitle>Iconografía (Lucide React)</SectionTitle>
        <div className="grid grid-cols-6 gap-4 sm:grid-cols-8 lg:grid-cols-10">
          {icons.map(({ icon: Icon, name }) => (
            <div key={name} className="flex flex-col items-center gap-2 p-3 rounded-lg border" style={{ borderColor: "var(--gray-5)" }}>
              <Icon size={20} style={{ color: "var(--navy)" }} />
              <span className="disclamer text-center" style={{ color: "var(--gray-8)" }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div>
        <SectionTitle>Espaciado</SectionTitle>
        <div className="flex items-end gap-6 flex-wrap">
          {spacingTokens.map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="rounded" style={{ width: value, height: value, backgroundColor: "var(--alquilando)", minWidth: value }} />
              <span className="tags" style={{ color: "var(--gray-9)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Radius */}
      <div>
        <SectionTitle>Radio de bordes</SectionTitle>
        <div className="flex gap-8 flex-wrap">
          {radiusTokens.map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 border-2" style={{ borderRadius: value, borderColor: "var(--navy)", backgroundColor: "var(--navy-light)" }} />
              <span className="tags text-center" style={{ color: "var(--gray-9)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div>
        <SectionTitle>Enlaces (Links)</SectionTitle>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[
            { label: "Regular — navegación en línea", el: <LinkText onClick={() => {}}>Ver perfil</LinkText> },
            { label: "Regular bold con chevron — valores accionables (StatCard)", el: <LinkText onClick={() => {}} bold icon="chevron">128 / Contratos</LinkText> },
            { label: "Small — enlaces secundarios (sidebar, footer)", el: <LinkText onClick={() => {}} size="small">Términos y condiciones</LinkText> },
            { label: "Small con icono externo", el: <LinkText onClick={() => {}} size="small" icon="external">Ver publicación</LinkText> },
            { label: "Disclamer — acciones terciarias (limpiar filtros)", el: <LinkText onClick={() => {}} size="disclamer">Limpiar selección</LinkText> },
            { label: "Deshabilitado", el: <LinkText disabled>No disponible</LinkText> },
          ].map(({ label, el }) => (
            <div key={label} className="flex flex-col gap-2 p-4 rounded-lg border" style={{ borderColor: "var(--gray-5)" }}>
              {el}
              <span className="tags" style={{ color: "var(--gray-8)" }}>{label}</span>
            </div>
          ))}
        </div>
        <p className="body-small-regular mt-4" style={{ color: "var(--gray-9)" }}>
          Componente: <span className="tags" style={{ color: "var(--gray-8)" }}>kit/LinkText</span> — color <span className="tags" style={{ color: "var(--violeta)" }}>--violeta</span>, subrayado al hover.
        </p>
      </div>

      {/* Badges */}
      <div>
        <SectionTitle>Badges / Estados</SectionTitle>
        <div className="flex gap-3 flex-wrap">
          {badges.map(({ label, variant }) => <StatusBadge key={variant} label={label} variant={variant} />)}
        </div>
        <p className="body-small-regular mt-4" style={{ color: "var(--gray-9)" }}>
          Componente: <span className="tags" style={{ color: "var(--gray-8)" }}>kit/StatusBadge</span> — variantes: draft (sólido), pending, registered, active, rejected, neutral.
        </p>
      </div>

      {/* Dividers */}
      <div>
        <SectionTitle>Divisores</SectionTitle>
        <div className="space-y-6">
          <div>
            <p className="body-small-regular mb-2" style={{ color: "var(--gray-9)" }}>Divisor estándar</p>
            <hr style={{ borderColor: "var(--gray-5)" }} />
          </div>
          <div>
            <p className="body-small-regular mb-2" style={{ color: "var(--gray-9)" }}>Divisor con opacidad</p>
            <hr style={{ borderColor: "var(--gray-5)", opacity: 0.4 }} />
          </div>
          <div>
            <p className="body-small-regular mb-2" style={{ color: "var(--gray-9)" }}>Divisor de sección (accent)</p>
            <div className="h-px" style={{ backgroundColor: "var(--navy)", opacity: 0.15 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
