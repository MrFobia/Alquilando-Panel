import { LayoutTemplate } from "lucide-react";

const screens = [
  {
    title: "Contratos",
    file: "Contratos.tsx",
    description: "Tabs (En estudio poliza / Contratos en administración / Pendiente de aprobación) con contador, filtros Comercial/Vivienda y tabla de datos paginada.",
    tags: ["TabBar", "DataTable", "ToggleSwitch", "Pagination"],
  },
  {
    title: "Creación de contrato",
    file: "CrearContrato.tsx",
    description: "Wizard de 5 pasos (Stepper) con selector de tipo de contrato, búsqueda de inmueble en portafolio, y secciones condicionales según Vivienda/Comercio.",
    tags: ["Stepper", "SegmentedControl", "Callout", "FileDropzone"],
  },
  {
    title: "Inicio",
    file: "kit/Inicio.tsx",
    description: "Dashboard principal con selector de rango de fechas, gráfica de estado de contratos y tarjetas de estadística agrupadas por tema.",
    tags: ["MonthRangePicker", "ContractsChart", "StatCard"],
  },
  {
    title: "Brokers Externos",
    file: "Brokers.tsx",
    description: "Listado con métricas, tabs de estado (Activos / Solicitudes / Rechazados), búsqueda y tabla con acciones por fila.",
    tags: ["MetricsRow", "TabBar", "DataTable", "IconButton"],
  },
  {
    title: "Detalle de inventario",
    file: "InventarioDetalle.tsx",
    description: "Vista de detalle con paneles colapsables por nivel/ambiente, carga de galería, especificaciones y notas generales.",
    tags: ["InfoField", "FileDropzone", "StatusBadge"],
  },
];

export function Templates() {
  return (
    <div className="space-y-16">
      <h3 className="title-tertiary-bold mb-6 pb-2 border-b" style={{ color: "var(--navy)", borderColor: "var(--gray-5)" }}>
        Pantallas del sistema
      </h3>
      <p className="body-regular" style={{ color: "var(--gray-9)" }}>
        Plantillas reales del proyecto — cada una combina los átomos, moléculas y organismos de este UI Kit. Archivo fuente indicado bajo cada título.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {screens.map(({ title, file, description, tags }) => (
          <div key={title} className="rounded-xl border overflow-hidden flex flex-col" style={{ borderColor: "var(--gray-5)" }}>
            <div className="flex items-center justify-center" style={{ backgroundColor: "var(--navy-light)", height: 100 }}>
              <LayoutTemplate size={28} style={{ color: "var(--navy)" }} />
            </div>
            <div className="px-6 py-5 flex flex-col gap-2" style={{ backgroundColor: "#ffffff" }}>
              <h4 className="subtitle" style={{ color: "var(--navy)" }}>{title}</h4>
              <span className="tags" style={{ color: "var(--gray-7)" }}>{file}</span>
              <p className="body-regular" style={{ color: "var(--gray-9)" }}>{description}</p>
              <div className="flex gap-2 flex-wrap mt-2">
                {tags.map((tag) => (
                  <span key={tag} className="tags px-2 py-1 rounded" style={{ backgroundColor: "var(--navy-light)", color: "var(--navy)" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
