import { useState } from "react";
import { Trash2, Eye } from "lucide-react";
import { PageHeader } from "./kit/PageHeader";
import { AppButton } from "./kit/AppButton";
import { DataTable } from "./kit/DataTable";
import { IconButton } from "./kit/IconButton";
import { Pagination } from "./kit/Pagination";
import { Footer } from "./kit/Footer";
import { CrearInventarioModal } from "./CrearInventarioModal";
import type { NuevoInventario } from "./CrearInventarioModal";
import { InventarioDetalle } from "./InventarioDetalle";
import { InventarioGuia } from "./InventarioGuia";

interface InventarioRow {
  codigo: string;
  direccion: string;
  fechaCreacion: string;
}

const ALL_ROWS: InventarioRow[] = [
  { codigo: "4172", direccion: "Cabrero Cra. 3 #44 A 26 Apto 401 Torre 1", fechaCreacion: "2026-06-18 19:55:28" },
  { codigo: "4008", direccion: "Avda Pedro De Heredia Calle 32 No.30-76", fechaCreacion: "2026-06-17 17:27:23" },
  { codigo: "-", direccion: "Calle 134 #9 A -46", fechaCreacion: "2026-06-11 21:29:37" },
  { codigo: "-", direccion: "Carrera 7 #82 -62", fechaCreacion: "2026-06-11 20:43:15" },
  { codigo: "-", direccion: "carrera 28 # 43- 48", fechaCreacion: "2026-06-09 15:18:59" },
  { codigo: "-", direccion: "Transversal 55 #98 A -66", fechaCreacion: "2026-06-04 16:03:49" },
  { codigo: "-", direccion: "Carrera 15 #104 -3", fechaCreacion: "2026-06-03 21:27:44" },
  { codigo: "4364", direccion: "CL 53 # 85 M - 50 AP 103 - BRR LOS MONJES", fechaCreacion: "2026-05-28 21:27:45" },
  { codigo: "4363", direccion: "CR 85 K # 26 G - 53 AP 718 - BRR FONTIBON", fechaCreacion: "2026-05-25 17:01:14" },
  { codigo: "-", direccion: "CL 53 # 85M - 50", fechaCreacion: "2026-05-14 13:31:30" },
  { codigo: "4280", direccion: "Calle 80 # 23 - 20, Apto 301", fechaCreacion: "2026-05-10 09:15:00" },
  { codigo: "4279", direccion: "Carrera 11 # 93-47, Piso 5", fechaCreacion: "2026-05-08 14:22:10" },
  { codigo: "-", direccion: "Av. El Dorado # 68 C - 61", fechaCreacion: "2026-05-05 11:00:45" },
  { codigo: "4250", direccion: "Calle 127 # 7-30, Casa 12", fechaCreacion: "2026-04-29 16:45:30" },
  { codigo: "-", direccion: "Carrera 9 # 80-15, Apto 301", fechaCreacion: "2026-04-22 08:30:00" },
  { codigo: "4200", direccion: "Av 19 # 104-22, Apto 802", fechaCreacion: "2026-04-15 17:00:00" },
  { codigo: "-", direccion: "Cl 76 # 11-50, Local 3", fechaCreacion: "2026-04-10 10:20:00" },
  { codigo: "4180", direccion: "Cra 15 # 93-47, Apto 502", fechaCreacion: "2026-04-01 09:00:00" },
  { codigo: "-", direccion: "Calle 100 # 14-55, Oficina 201", fechaCreacion: "2026-03-25 13:00:00" },
  { codigo: "4150", direccion: "Carrera 30 # 45-20, Apto 104", fechaCreacion: "2026-03-18 15:30:00" },
  { codigo: "-", direccion: "Transversal 29 # 36-05", fechaCreacion: "2026-03-10 11:45:00" },
  { codigo: "4120", direccion: "Calle 53 # 68 C - 80, Torre 2", fechaCreacion: "2026-03-05 08:15:00" },
  { codigo: "-", direccion: "Carrera 50 # 20-30, Local 1", fechaCreacion: "2026-02-28 16:00:00" },
  { codigo: "4100", direccion: "Diagonal 22 # 39-90", fechaCreacion: "2026-02-20 10:00:00" },
  { codigo: "-", direccion: "Cra 68 # 90-12, Apto 604", fechaCreacion: "2026-02-14 14:30:00" },
  { codigo: "4080", direccion: "Av Suba # 114-84, Casa 5", fechaCreacion: "2026-02-05 09:30:00" },
  { codigo: "-", direccion: "Calle 170 # 68-50, Apto 201", fechaCreacion: "2026-01-29 12:00:00" },
  { codigo: "4060", direccion: "Carrera 7 # 32-16, Piso 8", fechaCreacion: "2026-01-22 15:45:00" },
  { codigo: "-", direccion: "Cra 11 # 70-50, Oficina 305", fechaCreacion: "2026-01-15 08:00:00" },
  { codigo: "4040", direccion: "Cl 26 # 92-32, Apto 801", fechaCreacion: "2026-01-08 10:30:00" },
  { codigo: "-", direccion: "Carrera 45 # 106-55, Casa 3", fechaCreacion: "2025-12-28 14:00:00" },
  { codigo: "4020", direccion: "Calle 72 # 10-07, Piso 3", fechaCreacion: "2025-12-20 09:15:00" },
  { codigo: "-", direccion: "Cra 23 # 67-40, Apto 102", fechaCreacion: "2025-12-12 16:30:00" },
  { codigo: "4000", direccion: "Diagonal 40 # 17-55, Local 2", fechaCreacion: "2025-12-05 11:00:00" },
  { codigo: "-", direccion: "Calle 57 # 33-20, Apto 403", fechaCreacion: "2025-11-28 13:45:00" },
  { codigo: "3980", direccion: "Carrera 19 # 85-62, Piso 2", fechaCreacion: "2025-11-20 08:30:00" },
  { codigo: "-", direccion: "Av Boyacá # 72-15, Apto 506", fechaCreacion: "2025-11-12 15:00:00" },
  { codigo: "3960", direccion: "Cra 111 # 78-90, Casa 7", fechaCreacion: "2025-11-05 10:45:00" },
  { codigo: "-", direccion: "Calle 116 # 45-20, Apto 301", fechaCreacion: "2025-10-28 14:30:00" },
  { codigo: "3940", direccion: "Transversal 78 # 100-55, Apto 204", fechaCreacion: "2025-10-20 09:00:00" },
  { codigo: "-", direccion: "Cra 55 # 47-30, Local 4", fechaCreacion: "2025-10-12 11:30:00" },
  { codigo: "3920", direccion: "Calle 90 # 14-23, Piso 6", fechaCreacion: "2025-10-05 16:00:00" },
  { codigo: "-", direccion: "Carrera 8 # 120-48, Casa 2", fechaCreacion: "2025-09-28 12:15:00" },
  { codigo: "3900", direccion: "Diagonal 60 # 55-32, Apto 101", fechaCreacion: "2025-09-20 08:45:00" },
  { codigo: "-", direccion: "Cra 24 # 38-16, Oficina 102", fechaCreacion: "2025-09-12 14:00:00" },
  { codigo: "3880", direccion: "Calle 45 # 103-62, Apto 705", fechaCreacion: "2025-09-05 10:30:00" },
  { codigo: "-", direccion: "Av Caracas # 57-20, Local 8", fechaCreacion: "2025-08-28 15:45:00" },
  { codigo: "3860", direccion: "Carrera 16 # 79-40, Piso 4", fechaCreacion: "2025-08-20 09:15:00" },
  { codigo: "-", direccion: "Calle 134 # 55-10, Casa 6", fechaCreacion: "2025-08-12 13:30:00" },
  { codigo: "3840", direccion: "Cra 70 # 64-35, Apto 302", fechaCreacion: "2025-08-05 11:00:00" },
  { codigo: "-", direccion: "Transversal 42 # 89-15, Apto 501", fechaCreacion: "2025-07-28 14:30:00" },
  { codigo: "3820", direccion: "Calle 28 # 77-20, Local 3", fechaCreacion: "2025-07-20 08:00:00" },
  { codigo: "-", direccion: "Carrera 36 # 53-48, Piso 2", fechaCreacion: "2025-07-12 16:15:00" },
  { codigo: "3800", direccion: "Av El Lago # 23-55, Apto 204", fechaCreacion: "2025-07-05 10:45:00" },
  { codigo: "-", direccion: "Cra 47 # 110-30, Oficina 401", fechaCreacion: "2025-06-28 12:30:00" },
  { codigo: "3780", direccion: "Calle 63 # 19-42, Casa 1", fechaCreacion: "2025-06-20 09:00:00" },
  { codigo: "-", direccion: "Carrera 90 # 68-25, Apto 603", fechaCreacion: "2025-06-12 14:45:00" },
  { codigo: "3760", direccion: "Diagonal 47 # 30-12, Local 5", fechaCreacion: "2025-06-05 10:15:00" },
  { codigo: "-", direccion: "Cra 13 # 82-60, Piso 7", fechaCreacion: "2025-05-28 15:30:00" },
  { codigo: "3740", direccion: "Calle 98 # 67-40, Apto 402", fechaCreacion: "2025-05-20 08:30:00" },
  { codigo: "-", direccion: "Av 68 # 21-80, Local 1", fechaCreacion: "2025-05-12 13:00:00" },
];

const PAGE_SIZE = 10;

const COLUMNS = [
  { key: "codigo", header: "Código de inmueble", width: 200 },
  { key: "direccion", header: "Dirección" },
  { key: "fechaCreacion", header: "Fecha de creación", width: 200 },
  { key: "opciones", header: "Opciones", width: 100 },
];

export function Inventarios() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(ALL_ROWS);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<NuevoInventario | null>(null);

  if (selected) {
    return <InventarioDetalle inventario={selected} onBack={() => setSelected(null)} />;
  }

  const handleCreate = (data: NuevoInventario) => {
    setModalOpen(false);
    setRows((prev) => [
      { codigo: data.codigo || "-", direccion: data.direccion, fechaCreacion: new Date().toISOString().slice(0, 19).replace("T", " ") },
      ...prev,
    ]);
    setSelected(data);
  };

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const tableRows = pageRows.map((r) => ({
    ...r,
    opciones: (
      <div className="flex items-center gap-1">
        <IconButton icon={Trash2} title="Eliminar" onClick={() => setRows((prev) => prev.filter((x) => x !== r))} />
        <IconButton
          icon={Eye}
          title="Ver inventario"
          onClick={() => setSelected({ codigo: r.codigo, direccion: r.direccion, contrato: "—", tipoInmueble: "Apartamento", pisos: 1 })}
        />
      </div>
    ),
  }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Inventarios"
        description="Consulte los registros en progreso o cree un nuevo inventario de inmueble."
        actions={<AppButton variant="primary" bold onClick={() => setModalOpen(true)}>Crear inventario</AppButton>}
      />

      <InventarioGuia />

      <section
        className="rounded-lg flex flex-col gap-4"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <span className="subtitle" style={{ color: "var(--navy)" }}>Inventarios en proceso</span>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        <DataTable
          columns={COLUMNS}
          rows={tableRows}
          onRowClick={(i) => {
            const r = pageRows[i];
            setSelected({ codigo: r.codigo, direccion: r.direccion, contrato: "—", tipoInmueble: "Apartamento", pisos: 1 });
          }}
        />

        <p className="body-regular text-right" style={{ color: "var(--gray-9)", margin: 0 }}>
          Mostrando{" "}
          <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{pageRows.length}</span>{" "}
          de{" "}
          <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{rows.length}</span>
        </p>

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </section>

      <Footer />

      <CrearInventarioModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </div>
  );
}
