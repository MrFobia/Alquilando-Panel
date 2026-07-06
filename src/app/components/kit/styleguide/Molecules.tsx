import { useState } from "react";
import { Search, Filter, ChevronDown, Eye, MessageCircle } from "lucide-react";
import { Stepper } from "../Stepper";
import { DocumentCard } from "../DocumentCard";
import { FileDropzone } from "../FileDropzone";
import { ProgressBar } from "../ProgressBar";
import { InfoField } from "../InfoField";
import { AppButton } from "../AppButton";
import { TabBar } from "../TabBar";
import { EmptyState } from "../EmptyState";
import { Accordion } from "../Accordion";
import { Callout } from "../Callout";
import { Pagination } from "../Pagination";
import { ToggleSwitch } from "../ToggleSwitch";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="title-tertiary-bold mb-6 pb-2 border-b" style={{ color: "var(--navy)", borderColor: "var(--gray-5)" }}>{children}</h3>;
}
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mb-10"><p className="body-bold mb-4" style={{ color: "var(--gray-9)" }}>{title}</p>{children}</div>;
}

function MiniStatCard({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="p-4 rounded-lg border flex flex-col gap-1" style={{ borderColor: "var(--gray-5)", backgroundColor: "#ffffff" }}>
      <p className="tags" style={{ color: "var(--gray-9)" }}>{label}</p>
      <p className="title-primary-bold" style={{ color: "var(--navy)" }}>{value}</p>
      {sub && <p className="disclamer" style={{ color: "var(--gray-8)" }}>{sub}</p>}
    </div>
  );
}

function DataRow({ label, value, link }: { label: string; value: string; link?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: "var(--gray-4)" }}>
      <span className="body-regular" style={{ color: "var(--gray-9)" }}>{label}</span>
      {link
        ? <span className="body-regular" style={{ color: "var(--navy)", textDecoration: "underline", cursor: "pointer" }}>{value}</span>
        : <span className="body-regular" style={{ color: "var(--gray-10)" }}>{value}</span>}
    </div>
  );
}

function PaginationDemo({ totalPages }: { totalPages: number }) {
  const [page, setPage] = useState(1);
  return <Pagination page={page} totalPages={totalPages} onChange={setPage} />;
}

function ToggleDemo() {
  const [comercial, setComercial] = useState(true);
  const [vivienda, setVivienda] = useState(false);
  return (
    <div className="flex items-center gap-8">
      <ToggleSwitch checked={comercial} onChange={setComercial} label="Comercial" />
      <ToggleSwitch checked={vivienda} onChange={setVivienda} label="Vivienda" />
    </div>
  );
}

function TabBarDemo() {
  const [active, setActive] = useState("inclusiones");
  return (
    <TabBar
      tabs={[
        { id: "inclusiones", label: "Inclusiones", count: 800 },
        { id: "comercializacion", label: "Comercialización", count: 1293 },
        { id: "captacion-portal", label: "Captación portal", count: 90 },
      ]}
      active={active}
      onChange={setActive}
    />
  );
}

function ProgressSteps() {
  const steps = [
    { id: "registrado", label: "Registrado" },
    { id: "docs", label: "Validación Docs" },
    { id: "antecedentes", label: "Antecedentes" },
    { id: "firma", label: "Firma Contrato" },
    { id: "capacitacion", label: "Capacitación" },
  ];
  return <Stepper steps={steps} current={1} />;
}

function SearchBar() {
  return (
    <div className="flex gap-2 items-center">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border flex-1" style={{ borderColor: "var(--gray-5)", backgroundColor: "#ffffff" }}>
        <Search size={16} style={{ color: "var(--gray-7)" }} />
        <input className="body-regular outline-none flex-1 bg-transparent" style={{ color: "var(--gray-10)" }} placeholder="Buscar..." />
      </div>
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg border body-regular" style={{ borderColor: "var(--gray-5)", color: "var(--gray-9)", backgroundColor: "#ffffff" }}>
        <Filter size={16} />Filtrar
      </button>
    </div>
  );
}

function StarRating({ value = 4 }: { value?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 1.5L11.1 6.3L16.5 6.93L12.5 10.59L13.7 16L9 13.13L4.3 16L5.5 10.59L1.5 6.93L6.9 6.3L9 1.5Z" fill={i < value ? "#FFC107" : "var(--gray-5)"} />
        </svg>
      ))}
    </div>
  );
}

function SelectField({ placeholder = "Selecciona" }: { placeholder?: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg border cursor-pointer" style={{ borderColor: "var(--gray-5)", backgroundColor: "#ffffff", minWidth: 160 }}>
      <span className="body-regular" style={{ color: "var(--gray-8)" }}>{placeholder}</span>
      <ChevronDown size={16} style={{ color: "var(--gray-7)" }} />
    </div>
  );
}

function ActionIconRow() {
  return (
    <div className="flex items-center gap-3">
      <button className="p-2 rounded border" style={{ borderColor: "var(--gray-5)" }} title="Ver detalle"><Eye size={16} style={{ color: "var(--navy)" }} /></button>
      <button className="p-2 rounded border" style={{ borderColor: "var(--gray-5)" }} title="Enviar WhatsApp"><MessageCircle size={16} style={{ color: "#25D366" }} /></button>
    </div>
  );
}

export function Molecules() {
  return (
    <div className="space-y-16">
      {/* Buttons */}
      <div>
        <SectionTitle>Botones</SectionTitle>
        <Block title="Variantes de botón">
          <div className="flex gap-4 flex-wrap items-center">
            {[
              [<AppButton variant="primary">Publicar inmueble</AppButton>, "Primary"],
              [<AppButton variant="secondary">No aprobar</AppButton>, "Secondary"],
              [<AppButton variant="accent">Captar inmueble</AppButton>, "Accent (Cyan)"],
              [<AppButton variant="danger">Rechazar perfil</AppButton>, "Danger"],
              [<AppButton disabled>Sin publicar</AppButton>, "Disabled"],
            ].map(([btn, lbl], i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                {btn}
                <span className="tags" style={{ color: "var(--gray-8)" }}>{lbl as string}</span>
              </div>
            ))}
          </div>
        </Block>
      </div>

      {/* Inputs */}
      <div>
        <SectionTitle>Campos de entrada</SectionTitle>
        <Block title="Text input">
          <div className="grid grid-cols-2 gap-4 max-w-xl">
            {[
              { label: "Normal", border: "var(--gray-5)", placeholder: "Nombre del propietario", defaultValue: undefined, disabled: false, error: false },
              { label: "Con valor", border: "var(--navy)", placeholder: undefined, defaultValue: "Andrés Camargo", disabled: false, error: false },
              { label: "Error", border: "var(--destructive)", placeholder: undefined, defaultValue: "correo@invalido", disabled: false, error: true },
              { label: "Deshabilitado", border: "var(--gray-4)", placeholder: undefined, defaultValue: "Sin plan seleccionado", disabled: true, error: false },
            ].map(({ label, border, placeholder, defaultValue, disabled, error }) => (
              <div key={label}>
                <p className="tags mb-1" style={{ color: "var(--gray-9)" }}>{label}</p>
                <div className="flex items-center px-3 py-2 rounded-lg border" style={{ borderColor: border, backgroundColor: disabled ? "var(--gray-1)" : undefined }}>
                  <input className="body-regular outline-none w-full bg-transparent" style={{ color: disabled ? "var(--gray-7)" : "var(--gray-10)" }} placeholder={placeholder} defaultValue={defaultValue} disabled={disabled} />
                </div>
                {error && <p className="disclamer mt-1" style={{ color: "var(--destructive)" }}>Correo inválido</p>}
              </div>
            ))}
          </div>
        </Block>
        <Block title="Buscador + Filtro"><div className="max-w-md"><SearchBar /></div></Block>
        <Block title="Select / Dropdown">
          <div className="flex gap-4 flex-wrap">
            <SelectField placeholder="Selecciona zona" />
            <SelectField placeholder="Tipo de inmueble" />
          </div>
        </Block>
      </div>

      {/* Stat cards */}
      <div>
        <SectionTitle>Tarjeta de estadística</SectionTitle>
        <div className="grid grid-cols-4 gap-4 max-w-2xl">
          <MiniStatCard value="23" label="Disponibles en arriendo" />
          <MiniStatCard value="842" label="Brokers activos" />
          <MiniStatCard value="156" label="Contratos mes actual" />
          <MiniStatCard value="34" label="Inactivos / Rechazados" />
        </div>
      </div>

      {/* Data rows */}
      <div>
        <SectionTitle>Fila de datos (Detail View)</SectionTitle>
        <div className="max-w-md rounded-lg border overflow-hidden" style={{ borderColor: "var(--gray-5)" }}>
          <DataRow label="Estado del inmueble" value="Pendiente" />
          <DataRow label="Nombre de la inmobiliaria" value="Fonnegra Gerlein" />
          <DataRow label="Tipo de inmueble" value="Apartamento" />
          <DataRow label="Inquilino" value="Andrea Camargo Lozano" link />
          <DataRow label="Canon mensual" value="$1.456.900" />
          <DataRow label="Administración" value="$230.000" />
        </div>
      </div>

      {/* Tab bar */}
      <div><SectionTitle>Barra de pestañas</SectionTitle><TabBarDemo /></div>

      <div>
        <SectionTitle>Paginación (Pagination)</SectionTitle>
        <div className="flex flex-col gap-6">
          <PaginationDemo totalPages={2} />
          <PaginationDemo totalPages={194} />
        </div>
      </div>

      <div>
        <SectionTitle>Interruptores (ToggleSwitch)</SectionTitle>
        <ToggleDemo />
      </div>

      <div>
        <SectionTitle>Acordeón (Accordion)</SectionTitle>
        <div className="rounded-xl border px-6 py-2" style={{ borderColor: "var(--gray-5)", backgroundColor: "#ffffff" }}>
          <Accordion
            items={[
              { id: "a1", title: "¿Cómo capto un inmueble nuevo?", content: <p>Pulsa Captar inmueble y completa los pasos del formulario. El inmueble queda en estado Borrador hasta finalizar.</p> },
              { id: "a2", title: "¿Cómo creo un contrato?", content: <p>Botón Crear nuevo contrato en la pestaña Pendiente de aprobación.</p> },
              { id: "a3", title: "¿Cómo cambio mi contraseña?", content: <p>Ver perfil → Cambiar contraseña: ingresa la actual y la nueva.</p> },
            ]}
          />
        </div>
      </div>

      <div>
        <SectionTitle>Avisos (Callout)</SectionTitle>
        <div className="flex flex-col gap-4">
          <Callout variant="info" title="Tip">
            Este tablero es el punto de partida recomendado cada día: permite detectar contratos próximos a vencer y solicitudes acumuladas.
          </Callout>
          <Callout variant="warning" title="Importante">
            El estado del contrato controla qué información puede modificarse. Verifica los datos bancarios antes de aprobar.
          </Callout>
        </div>
      </div>

      <div>
        <SectionTitle>Estado vacío (EmptyState)</SectionTitle>
        <div className="rounded-xl border" style={{ borderColor: "var(--gray-5)", backgroundColor: "#ffffff" }}>
          <EmptyState
            title="Sin resultados"
            description='No encontramos inmuebles que coincidan con "torre 5". Revisa el texto o intenta con otro criterio de búsqueda.'
            action={<AppButton variant="secondary">Limpiar búsqueda</AppButton>}
          />
        </div>
      </div>

      {/* Progress steps */}
      <div>
        <SectionTitle>Pasos de progreso</SectionTitle>
        <div className="overflow-x-auto"><ProgressSteps /></div>
      </div>

      {/* File cards */}
      <div>
        <SectionTitle>Tarjetas de archivo (DocumentCard)</SectionTitle>
        <div className="grid grid-cols-3 gap-4 max-w-2xl">
          <DocumentCard name="Cedula.pdf" meta="PDF · 1,2 MB" onView={() => {}} onDownload={() => {}} />
          <DocumentCard name="RUT_Actualizado.pdf" meta="PDF · 840 KB" onView={() => {}} onDelete={() => {}} />
        </div>
      </div>

      {/* File dropzone */}
      <div>
        <SectionTitle>Zona de carga (FileDropzone)</SectionTitle>
        <FileDropzone />
      </div>

      {/* Progress bar */}
      <div>
        <SectionTitle>Barra de progreso (ProgressBar)</SectionTitle>
        <div className="flex flex-col gap-3 max-w-md">
          <ProgressBar value={0} />
          <ProgressBar value={50} />
          <ProgressBar value={100} />
        </div>
      </div>

      {/* Info field */}
      <div>
        <SectionTitle>Campo informativo (InfoField)</SectionTitle>
        <div className="grid grid-cols-3 gap-6 max-w-2xl">
          <InfoField label="Tipo de persona" value="Natural" />
          <InfoField label="Número del documento" value="1.234.567.890" />
          <InfoField label="Ciudad" value="Bogotá" />
        </div>
      </div>

      {/* Star rating */}
      <div>
        <SectionTitle>Calificación</SectionTitle>
        <div className="flex gap-8 items-center">
          {[5, 4, 3].map((v) => (
            <div key={v} className="flex flex-col gap-1">
              <StarRating value={v} />
              <span className="tags" style={{ color: "var(--gray-8)" }}>{v} estrellas</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action icons */}
      <div>
        <SectionTitle>Iconos de acción</SectionTitle>
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-1 items-center">
            <ActionIconRow />
            <span className="tags" style={{ color: "var(--gray-8)" }}>Ver / WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
