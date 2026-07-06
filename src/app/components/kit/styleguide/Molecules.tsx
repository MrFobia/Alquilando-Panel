import { useState } from "react";
import { Eye, MessageCircle, Home, Building2, LayoutGrid, List } from "lucide-react";
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
import { TextInput } from "../TextInput";
import { SelectInput } from "../SelectInput";
import { IconButton } from "../IconButton";
import { SegmentedControl } from "../SegmentedControl";
import { MonthRangePicker } from "../MonthRangePicker";
import { StatCard } from "../StatCard";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="title-tertiary-bold mb-6 pb-2 border-b" style={{ color: "var(--navy)", borderColor: "var(--gray-5)" }}>{children}</h3>;
}
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mb-10"><p className="body-bold mb-4" style={{ color: "var(--gray-9)" }}>{title}</p>{children}</div>;
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
        { id: "inclusiones", label: "Inclusiones", count: 4 },
        { id: "comercializacion", label: "Comercialización", count: 213 },
        { id: "captacion-portal", label: "Captaciones portal", count: 0 },
      ]}
      active={active}
      onChange={setActive}
    />
  );
}

function ProgressSteps() {
  const steps = [
    { id: "inmueble", label: "Inmueble" },
    { id: "propietario", label: "Propietario" },
    { id: "inquilino", label: "Inquilino" },
    { id: "condiciones", label: "Condiciones" },
    { id: "documentos", label: "Documentos" },
  ];
  return <Stepper steps={steps} current={1} />;
}

function SegmentedControlDemo() {
  const [value, setValue] = useState<"vivienda" | "comercio">("vivienda");
  return (
    <SegmentedControl
      value={value}
      onChange={setValue}
      options={[
        { value: "vivienda", label: "Vivienda", icon: Home },
        { value: "comercio", label: "Comercio", icon: Building2 },
      ]}
    />
  );
}

function ViewToggleDemo() {
  const [view, setView] = useState<"list" | "grid">("list");
  return (
    <div className="flex items-center gap-1">
      <IconButton icon={LayoutGrid} title="Vista de tarjetas" active={view === "grid"} onClick={() => setView("grid")} />
      <IconButton icon={List} title="Vista de lista" active={view === "list"} onClick={() => setView("list")} />
    </div>
  );
}

export function Molecules() {
  return (
    <div className="space-y-16">
      {/* Buttons */}
      <div>
        <SectionTitle>Botones (AppButton)</SectionTitle>
        <Block title="Variantes">
          <div className="flex gap-4 flex-wrap items-center">
            {[
              [<AppButton variant="primary">Publicar inmueble</AppButton>, "Primary"],
              [<AppButton variant="secondary">No aprobar</AppButton>, "Secondary"],
              [<AppButton variant="accent">Captar inmueble</AppButton>, "Accent (Cyan)"],
              [<AppButton variant="danger">Rechazar perfil</AppButton>, "Danger"],
              [<AppButton variant="ghost">Filtrar</AppButton>, "Ghost"],
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
        <Block title="Text input (TextInput)">
          <div className="grid grid-cols-2 gap-4 max-w-xl">
            <div>
              <p className="tags mb-1" style={{ color: "var(--gray-9)" }}>Normal</p>
              <TextInput placeholder="Nombre del propietario" className="w-full" />
            </div>
            <div>
              <p className="tags mb-1" style={{ color: "var(--gray-9)" }}>Con valor + limpiar</p>
              <TextInput value="Andrés Camargo" onChange={() => {}} onClear={() => {}} className="w-full" />
            </div>
            <div>
              <p className="tags mb-1" style={{ color: "var(--gray-9)" }}>Deshabilitado</p>
              <TextInput value="Sin plan seleccionado" disabled className="w-full" />
            </div>
            <div>
              <p className="tags mb-1" style={{ color: "var(--gray-9)" }}>Con error de validación</p>
              <TextInput value="" placeholder="Escriba aquí" className="w-full" />
              <p className="body-small-regular mt-1" style={{ color: "var(--destructive)" }}>Este campo es obligatorio</p>
            </div>
          </div>
        </Block>
        <Block title="Select / Dropdown (SelectInput)">
          <div className="flex gap-4 flex-wrap">
            <SelectInput placeholder="Selecciona zona" options={[{ value: "norte", label: "Norte" }, { value: "sur", label: "Sur" }]} />
            <SelectInput placeholder="Tipo de inmueble" options={[{ value: "apto", label: "Apartamento" }, { value: "casa", label: "Casa" }]} />
          </div>
        </Block>
        <Block title="Selector segmentado (SegmentedControl)">
          <SegmentedControlDemo />
        </Block>
        <Block title="Selector de rango de meses (MonthRangePicker)">
          <MonthRangePicker />
        </Block>
      </div>

      {/* StatCard */}
      <div>
        <SectionTitle>Tarjeta de estadísticas (StatCard)</SectionTitle>
        <div className="max-w-md">
          <StatCard
            title="Portafolio Actual"
            rows={[
              { label: "Número de contratos activos", value: "1578" },
              { label: "Nuevos contratos", value: "0 / Contratos", onClick: () => {} },
              { label: "Inm. portafolio comercialización", value: "164" },
            ]}
          />
        </div>
        <p className="body-small-regular mt-4" style={{ color: "var(--gray-9)" }}>
          Filas con <span className="tags" style={{ color: "var(--gray-8)" }}>onClick</span> se muestran como LinkText bold con chevron (usado en Inicio).
        </p>
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

      {/* Tab bar */}
      <div><SectionTitle>Barra de pestañas (TabBar)</SectionTitle><TabBarDemo /></div>

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
          <Callout variant="info" title="Verifica tus documentos antes de enviarlos">
            Asegúrate de que los documentos que estás subiendo sean los correctos y cumplan con los requisitos establecidos.
          </Callout>
          <Callout variant="warning" title="Importante">
            El estado del contrato controla qué información puede modificarse. Verifica los datos bancarios antes de aprobar.
          </Callout>
          <Callout variant="error" title="No hay inmuebles que coincidan o cumplan con los requisitos para el contrato.">
            Código: <strong>0000</strong>, Verifica los datos e intenta nuevamente.
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
        <SectionTitle>Pasos de progreso (Stepper)</SectionTitle>
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

      {/* Icon buttons */}
      <div>
        <SectionTitle>Botones de icono (IconButton)</SectionTitle>
        <div className="flex gap-8 items-center flex-wrap">
          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center gap-3">
              <IconButton icon={Eye} title="Ver detalle" />
              <IconButton icon={MessageCircle} title="Contactar por WhatsApp" />
            </div>
            <span className="tags" style={{ color: "var(--gray-8)" }}>Acciones en tabla (con tooltip)</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <ViewToggleDemo />
            <span className="tags" style={{ color: "var(--gray-8)" }}>Toggle vista lista / tarjetas (estado activo)</span>
          </div>
        </div>
        <p className="body-small-regular mt-4" style={{ color: "var(--gray-9)" }}>
          El tooltip se renderiza en un portal (<span className="tags" style={{ color: "var(--gray-8)" }}>createPortal</span>) para no recortarse dentro de contenedores con scroll, como las tablas.
        </p>
      </div>
    </div>
  );
}
