import { useState } from "react";
import { Filter, Eye } from "lucide-react";
import { PageHeader } from "./kit/PageHeader";
import { AppButton } from "./kit/AppButton";
import { DataTable } from "./kit/DataTable";
import { IconButton } from "./kit/IconButton";
import { Footer } from "./kit/Footer";
import { InmobiliariaDetalle } from "./InmobiliariaDetalle";

export interface InmobiliariaRow {
  nombre: string;
  telefono: string;
  correo: string;
  tasa: string;
  contratos: string;
  finalizados: string;
}

const ROWS: InmobiliariaRow[] = [
  { nombre: "Consultoria & Marketing Inmobiliario", telefono: "3144689504", correo: "cmasesoressas@hotmail.com", tasa: "4.5%", contratos: "230", finalizados: "42" },
  { nombre: "Edificatoria", telefono: "+573142976437", correo: "cesar.lara@edificatoria.net", tasa: "4.5%", contratos: "32", finalizados: "4" },
  { nombre: "Plan familia", telefono: "3144249404", correo: "planfamiliasas@gmail.com", tasa: "4.5%", contratos: "14", finalizados: "2" },
  { nombre: "Back", telefono: "300123457", correo: "pruebaasociada@backbone.digital", tasa: "4.5%", contratos: "4", finalizados: "1" },
  { nombre: "Brikss", telefono: "3185839368", correo: "l.camargo@brikss.com", tasa: "4.5%", contratos: "26", finalizados: "2" },
  { nombre: "Alquilando Caribe", telefono: "3052380617", correo: "contacto@alquilandocaribe.com", tasa: "4.5%", contratos: "58", finalizados: "9" },
  { nombre: "Hábitat Urbano", telefono: "3009876543", correo: "info@habitaturbano.com", tasa: "5.0%", contratos: "41", finalizados: "6" },
];

const COLUMNS = [
  { key: "nombre", header: "Inmobiliaria", width: 200 },
  { key: "telefono", header: "Teléfono", width: 120 },
  { key: "correo", header: "Correo" },
  { key: "tasa", header: "Tasa", width: 90 },
  { key: "contratos", header: "Contratos", width: 100 },
  { key: "finalizados", header: "Finalizados", width: 100 },
  { key: "opciones", header: "Opciones", width: 80, align: "center" as const },
];

export function Inmobiliarias() {
  const [selected, setSelected] = useState<InmobiliariaRow | null>(null);

  if (selected) {
    return <InmobiliariaDetalle inmobiliaria={selected} onBack={() => setSelected(null)} />;
  }

  const tableRows = ROWS.map((r) => ({
    ...r,
    opciones: <IconButton icon={Eye} title="Ver tablero" onClick={() => setSelected(r)} />,
  }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Inmobiliarias aliadas"
        description="Gestiona la red de inmobiliarias aliadas y su desempeño comercial."
        actions={<AppButton variant="primary" bold>Agregar nueva inmobiliaria</AppButton>}
      />

      <section
        className="rounded-lg flex flex-col gap-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex">
          <AppButton variant="ghost"><Filter size={14} /> Filtrar</AppButton>
        </div>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
        <DataTable columns={COLUMNS} rows={tableRows} onRowClick={(i) => setSelected(ROWS[i])} />
      </section>

      <Footer />
    </div>
  );
}
