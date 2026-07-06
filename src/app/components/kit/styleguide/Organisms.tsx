import { useState } from "react";
import { Footer } from "../Footer";
import { AppSidebar } from "../../AppSidebar";
import { PageHeader } from "../PageHeader";
import { AppButton } from "../AppButton";
import {
  Filter, Search, MessageCircle, Eye, Edit, ChevronRight, BarChart2,
} from "lucide-react";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell, Legend } from "recharts";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="title-tertiary-bold mb-6 pb-2 border-b" style={{ color: "var(--navy)", borderColor: "var(--gray-5)" }}>{children}</h3>;
}

function SidebarNav() {
  const [active, setActive] = useState("inmuebles");
  return (
    <div className="rounded-xl overflow-hidden" style={{ width: 220, height: 500, border: "1px solid var(--gray-4)" }}>
      <AppSidebar active={active} onSelect={setActive} onTerminos={() => {}} />
    </div>
  );
}


const statsData = [
  { label: "Solicitudes mes", value: "18", sub: "Mes actual" },
  { label: "Brokers activos", value: "842" },
  { label: "Contratos mes actual", value: "156" },
  { label: "Inactivos / Rechazados", value: "34" },
];

function StatsRow() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 rounded-xl border" style={{ borderColor: "var(--gray-5)", backgroundColor: "#ffffff" }}>
      {statsData.map(({ label, value, sub }) => (
        <div key={label} className="text-center">
          <p className="body-small-regular" style={{ color: "var(--gray-9)" }}>{label}</p>
          <p className="title-primary-bold mt-1" style={{ color: "var(--navy)" }}>{value}</p>
          {sub && <p className="disclamer" style={{ color: "var(--gray-8)" }}>{sub}</p>}
        </div>
      ))}
    </div>
  );
}

const tableRows = [
  { id: "1.234.567.890", name: "Laura Camila Rojas", propietario: "Registrado en la web", estado: "Sin asignar", fecha: "14 May 2026", badgeColor: "var(--gray-8)", badgeBg: "var(--gray-4)" },
  { id: "1.234.567.890", name: "Carlos Andrés Benítez", propietario: "Validación Docs", estado: "Angie / Bogotá", fecha: "14 May 2026", badgeColor: "var(--navy)", badgeBg: "var(--navy-light)" },
  { id: "1.234.567.890", name: "Diana Patricia Gómez", propietario: "Firma Contrato", estado: "Ruby / Caribe", fecha: "12 May 2026", badgeColor: "var(--green-status)", badgeBg: "var(--green-status-light)" },
  { id: "1.234.567.890", name: "Andrés Felipe Vargas", propietario: "Capacitación", estado: "Sin asignar", fecha: "10 May 2026", badgeColor: "var(--orange-status)", badgeBg: "var(--orange-status-light)" },
];
const tableHeaders = ["ID PÓLIZA", "INMUEBLE / DIRECCIÓN", "PROPIETARIO", "ESTADO", "FECHA SOLICITUD", "ACCIONES"];

function DataTable() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--gray-5)" }}>
      <div className="flex justify-between items-center px-4 py-3 border-b" style={{ borderColor: "var(--gray-5)", backgroundColor: "#ffffff" }}>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border body-small-regular" style={{ borderColor: "var(--gray-5)", color: "var(--gray-9)" }}><Filter size={14} /> Filtrar</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Buscar por:</span>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border" style={{ borderColor: "var(--gray-5)" }}>
            <Search size={14} style={{ color: "var(--gray-7)" }} />
            <input className="body-small-regular outline-none w-24 bg-transparent" style={{ color: "var(--gray-10)" }} placeholder="Buscar" />
          </div>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: "var(--gray-1)" }}>
            {tableHeaders.map((h) => (
              <th key={h} className="px-4 py-3 text-left tags" style={{ color: "var(--navy)", borderBottom: "1px solid var(--gray-5)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "var(--gray-1)", borderBottom: "1px solid var(--gray-4)" }}>
              <td className="px-4 py-3 body-regular" style={{ color: "var(--gray-9)" }}>{row.id}</td>
              <td className="px-4 py-3 body-regular" style={{ color: "var(--gray-10)" }}>{row.name}</td>
              <td className="px-4 py-3 body-regular" style={{ color: "var(--gray-10)" }}>{row.propietario}</td>
              <td className="px-4 py-3"><span className="tags px-2 py-0.5 rounded-full" style={{ color: row.badgeColor, backgroundColor: row.badgeBg }}>{row.estado}</span></td>
              <td className="px-4 py-3 body-regular" style={{ color: "var(--gray-9)" }}>{row.fecha}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button title="WhatsApp"><MessageCircle size={16} style={{ color: "#25D366" }} /></button>
                  <button title="Ver"><Eye size={16} style={{ color: "var(--navy)" }} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const detailFields = [
  { label: "Estado del inmueble", value: "Pendiente" },
  { label: "Nombre de la inmobiliaria", value: "Fonnegra Gerlein" },
  { label: "Fecha de captación", value: "16 / Junio / 2025" },
  { label: "Tipo de inmueble", value: "Apartamento" },
  { label: "La propiedad está ocupada", value: "No" },
  { label: "Ciudad", value: "Bogotá" },
  { label: "Barrio", value: "Suba" },
  { label: "Área construida", value: "800 m²" },
];

function DetailCard({ title }: { title: string }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--gray-5)", backgroundColor: "#ffffff" }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--gray-5)" }}>
        <h4 className="subtitle" style={{ color: "var(--navy)" }}>{title}</h4>
        <button className="flex items-center gap-1 body-small-regular" style={{ color: "var(--navy)" }}>
          <Edit size={14} /> Editar <ChevronRight size={14} />
        </button>
      </div>
      <div className="px-5 py-4">
        {detailFields.map(({ label, value }) => (
          <div key={label} className="flex justify-between py-2 border-b" style={{ borderColor: "var(--gray-4)" }}>
            <span className="body-regular" style={{ color: "var(--gray-9)" }}>{label}</span>
            <span className="body-regular" style={{ color: "var(--gray-10)" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const barData = [{ name: "0-30d", value: 60 }, { name: "31-60d", value: 18 }, { name: "61-90d", value: 28 }, { name: "91+d", value: 12 }];
const pieData = [{ name: "En administración", value: 40 }, { name: "En comercialización", value: 35 }, { name: "Disponibles", value: 25 }];
const CHART_COLORS = ["var(--navy)", "var(--alquilando)", "var(--violeta)"];

function ChartSection() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border" style={{ borderColor: "var(--gray-5)", backgroundColor: "#ffffff" }}>
      <div>
        <p className="subtitle mb-3" style={{ color: "var(--navy)" }}><BarChart2 size={16} className="inline mr-2" />Días de Comercialización</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--gray-9)" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--gray-9)" }} />
            <Tooltip />
            <Bar dataKey="value" fill="#1A237E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <p className="subtitle mb-3" style={{ color: "var(--navy)" }}>Zonas</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label>
              {pieData.map((_, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function Organisms() {
  return (
    <div className="space-y-16">
      <div><SectionTitle>Navegación lateral (Sidebar)</SectionTitle><SidebarNav /></div>
      <div>
        <SectionTitle>Encabezado de página</SectionTitle>
        <div className="space-y-4">
          <PageHeader title="Inmuebles" description="Administra y revisa todos tus inmuebles de manera fácil y rápida." actions={<AppButton variant="primary">Captar inmueble</AppButton>} />
          <PageHeader title="Brokers" description="Gestión de Solicitudes y Red Comercial Aliada" actions={<AppButton variant="primary">Agregar Broker</AppButton>} />
        </div>
      </div>
      <div><SectionTitle>Fila de estadísticas</SectionTitle><StatsRow /></div>
      <div><SectionTitle>Tabla de datos</SectionTitle><DataTable /></div>
      <div><SectionTitle>Tarjeta de detalle</SectionTitle><div className="max-w-lg"><DetailCard title="Inmueble" /></div></div>
      <div><SectionTitle>Sección de gráficas</SectionTitle><ChartSection /></div>
      <div>
        <SectionTitle>Footer</SectionTitle>
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: "var(--gray-5)" }}><Footer /></div>
        <p className="tags mt-3" style={{ color: "var(--gray-8)" }}>Borde superior automático · Logo centrado en <code>var(--gray-6)</code> · Altura fija 61px</p>
      </div>
    </div>
  );
}
