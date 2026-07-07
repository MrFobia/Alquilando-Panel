import { useState } from "react";
import { Filter, Eye } from "lucide-react";
import { PageHeader } from "./kit/PageHeader";
import { AppButton } from "./kit/AppButton";
import { DataTable } from "./kit/DataTable";
import { StatusBadge } from "./kit/StatusBadge";
import { IconButton } from "./kit/IconButton";
import { TextInput } from "./kit/TextInput";
import { SelectInput } from "./kit/SelectInput";
import { Pagination } from "./kit/Pagination";
import { EmptyState } from "./kit/EmptyState";
import { Footer } from "./kit/Footer";
import { InmuebleDetalle } from "./InmuebleDetalle";
import type { InmuebleData } from "./InmuebleDetalle";

const PAGE_SIZE = 10;

interface InmuebleRow {
  id: string;
  inmobiliaria: string;
  metros: string;
  direccion: string;
  tipo: string;
  zona: string;
}

const ROWS_DATA: InmuebleRow[] = [
  { id: "6455", inmobiliaria: "Alquilando sas", metros: "0.00", direccion: "Cl 18 # 100 - 08 of 3", tipo: "-", zona: "Bogota" },
  { id: "6382", inmobiliaria: "C&m", metros: "40.00", direccion: "Cr 73 c # 39 - 36 sur ap 101", tipo: "Apartamento", zona: "-" },
  { id: "6377", inmobiliaria: "C&m", metros: "26.00", direccion: "Cl 53 # 85 m - 50 t 2 ap 401", tipo: "Apartaestudio", zona: "Norocciden" },
  { id: "6365", inmobiliaria: "Alquilando sas", metros: "60.00", direccion: "Cl 50 sur 93d 38 in 5 ap 204", tipo: "Apartamento", zona: "-" },
  { id: "6364", inmobiliaria: "C&m", metros: "72.00", direccion: "Cl 50 a sur # 87 d - 86 ap 301", tipo: "Apartamento", zona: "-" },
  { id: "6358", inmobiliaria: "Alquilando sas", metros: "60.00", direccion: "Kr 85k 26g 53 to 1 ap 1218", tipo: "Apartamento", zona: "Occidente" },
  { id: "6347", inmobiliaria: "C&m", metros: "30.00", direccion: "Cr 73 c # 39 - 36 sur ap 202", tipo: "Apartaestudio", zona: "-" },
  { id: "6344", inmobiliaria: "C&m", metros: "40.00", direccion: "Cr 73 c # 39 - 36 sur ap 102", tipo: "Apartamento", zona: "-" },
  { id: "6323", inmobiliaria: "Alquilando sas", metros: "0.00", direccion: "Cl 18 100 08 of 201", tipo: "Oficina", zona: "Bogota" },
  { id: "6275", inmobiliaria: "Alquilando sas", metros: "89", direccion: "Cr 14 # 117 - 56 ap 403 - brr santa barbara", tipo: "Apartamento", zona: "Norte" },
  { id: "6271", inmobiliaria: "Alquilando Caribe", metros: "55.00", direccion: "Cl 147 # 8 - 55 ap 902", tipo: "Apartamento", zona: "Norte" },
  { id: "6268", inmobiliaria: "Izban", metros: "48.00", direccion: "Cr 85 k # 26 g - 53 ap 718 - brr fontibon", tipo: "Apartamento", zona: "Occidente" },
  { id: "6254", inmobiliaria: "Alquilando sas", metros: "120.00", direccion: "Cl 81 # 109 - 10 ap 203 - brr bolivia", tipo: "Casa", zona: "Occidente" },
];

const COLUMNS = [
  { key: "id", header: "# Inmueble", width: 110 },
  { key: "inmobiliaria", header: "Inmobiliaria", width: 150 },
  { key: "metros", header: "Metros²", width: 100 },
  { key: "direccion", header: "Dirección" },
  { key: "tipo", header: "Tipo de inmueble", width: 150 },
  { key: "zona", header: "Zona", width: 120 },
  { key: "estado", header: "Estado", width: 125 },
  { key: "opciones", header: "Opciones", width: 90 },
];

const SEARCH_OPTIONS = [
  { value: "id", label: "# Inmueble" },
  { value: "inmobiliaria", label: "Inmobiliaria" },
  { value: "direccion", label: "Dirección" },
  { value: "zona", label: "Zona" },
];

export function InmueblesAdministracion() {
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);
  const [selected, setSelected] = useState<InmuebleRow | null>(null);

  if (selected) {
    const data: InmuebleData = {
      id: selected.id,
      direccion: selected.direccion,
      tipo: selected.tipo,
      zona: selected.zona,
      estado: { label: "Arrendado", variant: "active" },
      contrato: "firmado",
      fecha: "-",
    };
    return <InmuebleDetalle inmueble={data} onBack={() => setSelected(null)} />;
  }

  const doSearch = () => { setApplied({ by: searchBy, q: query }); setPage(1); };
  const clearSearch = () => { setQuery(""); setApplied(null); setPage(1); };

  const filtered = ROWS_DATA.filter((r) => {
    if (!applied || !applied.q.trim()) return true;
    const q = applied.q.trim().toLowerCase();
    const fields = applied.by
      ? [String(r[applied.by as keyof InmuebleRow] ?? "")]
      : Object.values(r).map(String);
    return fields.some((v) => v.toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const rows = pageRows.map((r) => ({
    ...r,
    estado: <StatusBadge label="Arrendado" variant="active" />,
    opciones: <IconButton icon={Eye} title="Ver ficha del inmueble" onClick={() => setSelected(r)} />,
  }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Inmuebles en administración"
        description="Administra y revisa todos tus inmuebles de manera fácil y rápida."
      />

      <section
        className="rounded-lg flex flex-col gap-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <AppButton variant="ghost"><Filter size={14} /> Filtrar</AppButton>
          <div className="flex items-center gap-3">
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>Buscar por:</span>
            <SelectInput options={SEARCH_OPTIONS} value={searchBy} onChange={setSearchBy} className="min-w-[180px]" />
            <TextInput placeholder="Escriba aquí" value={query} onChange={setQuery} onEnter={doSearch} onClear={clearSearch} className="min-w-[200px]" />
            <AppButton variant="secondary" bold onClick={doSearch}>Buscar</AppButton>
          </div>
        </div>

        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        {rows.length > 0 ? (
          <>
            <DataTable columns={COLUMNS} rows={rows} onRowClick={(i) => setSelected(pageRows[i])} />
            <p className="body-regular text-right" style={{ color: "var(--gray-9)", margin: 0 }}>
              Mostrando <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{pageRows.length}</span> de{" "}
              <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{filtered.length}</span>
            </p>
            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <EmptyState
            title="Sin resultados"
            description={`No encontramos inmuebles que coincidan con "${applied?.q ?? ""}". Revisa el texto o intenta con otro criterio de búsqueda.`}
            action={<AppButton variant="secondary" onClick={clearSearch}>Limpiar búsqueda</AppButton>}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
