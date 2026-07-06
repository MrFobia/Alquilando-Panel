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
import { InquilinoDetalle } from "./InquilinoDetalle";

export interface InquilinoRow {
  cedula: string;
  nombre: string;
  inmobiliaria: string;
  direccion: string;
  correo: string;
  telefono: string;
  estado: "ejecucion" | "finalizado" | "mora";
}

const ROWS: InquilinoRow[] = [
  { cedula: "1032423930", nombre: "Nelson Diaz", inmobiliaria: "Alquilando Caribe", direccion: "Cr 3 # 44 A - 401 Norte 401 - Brr Cabrera", correo: "nelsondiaz_88@hotmail.com", telefono: "3138193904", estado: "ejecucion" },
  { cedula: "42001731", nombre: "Maria Lopez", inmobiliaria: "Alquilando Sas", direccion: "Cl 81 # 109 - 10 Ap 203 - Brr Bolivia", correo: "angelicapantoja1309@gmail.com", telefono: "3044677006", estado: "ejecucion" },
  { cedula: "1057570810", nombre: "Ibeth Leal", inmobiliaria: "Alquilando", direccion: "Kr 6 51 21 Ap 405", correo: "ibeth.leal07@gmail.com", telefono: "3508653006", estado: "ejecucion" },
  { cedula: "—", nombre: "Michael Arias", inmobiliaria: "Alquilando Sas", direccion: "Cl 44 13 45 Lc 1", correo: "michaelsarias2019@gmail.com", telefono: "3152743645", estado: "ejecucion" },
  { cedula: "41783650", nombre: "Claudia Alzate", inmobiliaria: "Alquilando Sas", direccion: "Ak 11 119 31 Ap 611", correo: "nenaalzate60@hotmail.com", telefono: "3153598992", estado: "ejecucion" },
  { cedula: "31658319", nombre: "Adriana Gamboa", inmobiliaria: "Consultoria & Marketing Inmobiliario S.a.s", direccion: "Cr 85 K # 26 G - 53 Ap 909 - Brr Modelia", correo: "reinosaludablesas@gmail.com", telefono: "3152537758", estado: "ejecucion" },
  { cedula: "1128053182", nombre: "Eduardo Gonzalez", inmobiliaria: "Alquilando Caribe", direccion: "Cr 74 # 31 F - 76 Ap 1001 - Brr 12 De Octubre", correo: "edugonzalez87@outlook.com", telefono: "3164423774", estado: "ejecucion" },
  { cedula: "1110060638", nombre: "Yamid Basto", inmobiliaria: "Alquilando Sas", direccion: "Cr 7 # 52 - 44 Ap 511 - Brr Chapinero", correo: "yamidb18@gmail.com", telefono: "3144084216", estado: "ejecucion" },
  { cedula: "1004383068", nombre: "Dariane Castro", inmobiliaria: "Consultoria & Marketing Inmobiliario S.a.s", direccion: "Cl 53 # 85 M - 50 Ap 103 - Brr Los Monjes", correo: "krystalvcp01@gmail.com", telefono: "3173799081", estado: "ejecucion" },
  { cedula: "—", nombre: "Gladis Malpica", inmobiliaria: "Alquilando Sas", direccion: "Calle 37 # 13-26 Local Central", correo: "nayibemalcipa@gmail.com", telefono: "3144590644", estado: "ejecucion" },
  { cedula: "79854120", nombre: "Carlos Rincon", inmobiliaria: "Alquilando Sas", direccion: "Cr 15 # 93 - 47 Ap 502 - Brr Chico", correo: "carlosrincon@gmail.com", telefono: "3001234567", estado: "finalizado" },
  { cedula: "52789456", nombre: "Paola Martinez", inmobiliaria: "Alquilando Caribe", direccion: "Cl 127 # 7 - 30 Casa 12", correo: "paomartinez@gmail.com", telefono: "3009876543", estado: "mora" },
  { cedula: "1015478932", nombre: "Andres Vargas", inmobiliaria: "Alquilando", direccion: "Av 19 # 104 - 22 Ap 802", correo: "andresvargas@gmail.com", telefono: "3015558899", estado: "ejecucion" },
];

const ESTADO_BADGE = {
  ejecucion: { label: "En ejecución", variant: "active" as const },
  finalizado: { label: "Finalizado", variant: "neutral" as const },
  mora: { label: "En mora", variant: "rejected" as const },
};

const COLUMNS = [
  { key: "cedula", header: "Cédula", width: 100 },
  { key: "nombre", header: "Nombre", width: 115 },
  { key: "inmobiliaria", header: "Inmobiliaria", width: 125 },
  { key: "direccion", header: "Dirección" },
  { key: "correo", header: "Correo", width: 140 },
  { key: "telefono", header: "Teléfono", width: 100 },
  { key: "estado", header: "Estado", width: 110 },
  { key: "opciones", header: "Opciones", width: 80, align: "center" as const },
];

const SEARCH_OPTIONS = [
  { value: "cedula", label: "Cédula" },
  { value: "nombre", label: "Nombre" },
  { value: "correo", label: "Correo" },
  { value: "inmobiliaria", label: "Inmobiliaria" },
];

const PAGE_SIZE = 10;
const TOTAL = 1552;

export function Inquilinos() {
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);
  const [selected, setSelected] = useState<InquilinoRow | null>(null);

  if (selected) {
    return <InquilinoDetalle inquilino={selected} onBack={() => setSelected(null)} />;
  }

  const doSearch = () => { setApplied({ by: searchBy, q: query }); setPage(1); };
  const clearSearch = () => { setQuery(""); setApplied(null); setPage(1); };

  const filtered = ROWS.filter((r) => {
    if (!applied || !applied.q.trim()) return true;
    const q = applied.q.trim().toLowerCase();
    const fields = applied.by ? [String(r[applied.by as keyof InquilinoRow] ?? "")] : Object.values(r).map(String);
    return fields.some((v) => v.toLowerCase().includes(q));
  });

  // La fuente real tiene 1552 registros; mostramos el set de demo en la primera página.
  const totalRows = applied ? filtered.length : TOTAL;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const tableRows = pageRows.map((r) => ({
    ...r,
    estado: <StatusBadge label={ESTADO_BADGE[r.estado].label} variant={ESTADO_BADGE[r.estado].variant} />,
    opciones: <IconButton icon={Eye} title="Ver inquilino" onClick={() => setSelected(r)} />,
  }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Inquilinos"
        description="Administra y revisa todos los inquilinos de manera fácil y rápida."
      />

      <section
        className="rounded-lg flex flex-col gap-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <AppButton variant="ghost"><Filter size={14} /> Filtrar</AppButton>
          <div className="flex items-center gap-3">
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>Buscar por:</span>
            <SelectInput options={SEARCH_OPTIONS} value={searchBy} onChange={setSearchBy} className="min-w-[160px]" />
            <TextInput placeholder="Buscar" value={query} onChange={setQuery} onEnter={doSearch} onClear={clearSearch} className="min-w-[200px]" />
            <AppButton variant="secondary" bold onClick={doSearch}>Buscar</AppButton>
          </div>
        </div>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        {tableRows.length > 0 ? (
          <>
            <DataTable columns={COLUMNS} rows={tableRows} onRowClick={(i) => setSelected(pageRows[i])} />
            <p className="body-regular text-right" style={{ color: "var(--gray-9)", margin: 0 }}>
              Mostrando <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{pageRows.length}</span> de{" "}
              <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{totalRows}</span>
            </p>
            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <EmptyState
            title="Sin resultados"
            description="No encontramos inquilinos que coincidan con la búsqueda. Ajusta los criterios e intenta de nuevo."
            action={<AppButton variant="secondary" onClick={clearSearch}>Limpiar búsqueda</AppButton>}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
