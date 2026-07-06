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
import { PropietarioDetalle } from "./PropietarioDetalle";

export interface PropietarioRow {
  cedula: string;
  nombre: string;
  inmobiliaria: string;
  direccion: string;
  correo: string;
  telefono: string;
  estado: "ejecucion" | "nodisponible";
  vip?: boolean;
}

const ROWS: PropietarioRow[] = [
  { cedula: "53039117", nombre: "Francy Barrera", inmobiliaria: "", direccion: "", correo: "francybarrera@gmail.com", telefono: "3148640887", estado: "nodisponible", vip: true },
  { cedula: "—", nombre: "Sandra Mora", inmobiliaria: "Alquilando Caribe", direccion: "Manga Av Jimenez Calle 26 No.17-64 Local 1", correo: "sandramoramora8@gmail.com", telefono: "3052380617", estado: "ejecucion" },
  { cedula: "51967831", nombre: "Nubia Rodriguez", inmobiliaria: "Consultoria & Marketing Inmobiliario S.a.s", direccion: "Cr 85 K # 26 G - 53 Ap 909 - Brr Modelia", correo: "nubia.rodriguez0905@gmail.com", telefono: "3138892767", estado: "ejecucion" },
  { cedula: "1044916467", nombre: "Diana Riaño", inmobiliaria: "", direccion: "", correo: "diana.riano@outlook.com", telefono: "18323346332", estado: "nodisponible" },
  { cedula: "1019066495", nombre: "Nestor Mendivelso", inmobiliaria: "Consultoria & Marketing Inmobiliario S.a.s", direccion: "Cl 53 # 85 M - 50 Ap 103 - Brr Los Monjes", correo: "ingearcoespecializada@gmail.com", telefono: "3204979552", estado: "ejecucion" },
  { cedula: "—", nombre: "Fuentes De Ortiz Sas", inmobiliaria: "", direccion: "", correo: "paula@fuentesdeortiz.com", telefono: "3107776449", estado: "nodisponible" },
  { cedula: "80796110", nombre: "Henry Gamba", inmobiliaria: "Consultoria & Marketing Inmobiliario S.a.s", direccion: "Cr 85 K # 26 G - 53 Ap 518 - Brr Fontibon", correo: "leonardogamba1@gmail.com", telefono: "3173827772", estado: "ejecucion" },
  { cedula: "73109728", nombre: "Carlos Puente", inmobiliaria: "Alquilando Caribe", direccion: "Cr 22 # 26 - 66 Ap 2 - Brr Manga", correo: "carlospuentevargas63@gmail.com", telefono: "3024177269", estado: "ejecucion" },
  { cedula: "1014299965", nombre: "Laura Zuluaga", inmobiliaria: "C&m", direccion: "Cl 53 # 85 M - 50 T 2 Ap 401", correo: "laurazuzua@gmail.com", telefono: "3226343350", estado: "ejecucion" },
  { cedula: "1051662165", nombre: "Jessica Miranda", inmobiliaria: "Alquilando Sas", direccion: "Kr 58b 130 61 Ap 414", correo: "jessica.mirandan22@gmail.com", telefono: "+34642110247", estado: "ejecucion" },
  { cedula: "79456123", nombre: "Mauricio Leon", inmobiliaria: "Alquilando Sas", direccion: "Cr 11 # 70 - 50 Of 305", correo: "mauricioleon@gmail.com", telefono: "3001112233", estado: "ejecucion", vip: true },
  { cedula: "52120987", nombre: "Patricia Soto", inmobiliaria: "Alquilando Caribe", direccion: "Cl 100 # 14 - 55 Ap 701", correo: "patriciasoto@gmail.com", telefono: "3009998877", estado: "nodisponible" },
];

const ESTADO_BADGE = {
  ejecucion: { label: "En ejecución", variant: "active" as const },
  nodisponible: { label: "No disponible", variant: "rejected" as const },
};

const COLUMNS = [
  { key: "cedula", header: "Cédula", width: 100 },
  { key: "nombre", header: "Nombre", width: 130 },
  { key: "inmobiliaria", header: "Inmobiliaria", width: 130 },
  { key: "direccion", header: "Dirección" },
  { key: "correo", header: "Correo", width: 150 },
  { key: "telefono", header: "Teléfono", width: 110 },
  { key: "estado", header: "Estado", width: 120 },
  { key: "opciones", header: "Opciones", width: 80, align: "center" as const },
];

const SEARCH_OPTIONS = [
  { value: "cedula", label: "Cédula" },
  { value: "nombre", label: "Nombre" },
  { value: "correo", label: "Correo" },
  { value: "inmobiliaria", label: "Inmobiliaria" },
];

const PAGE_SIZE = 10;
const TOTAL = 1223;

export function Propietarios() {
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<{ by: string; q: string } | null>(null);
  const [selected, setSelected] = useState<PropietarioRow | null>(null);

  if (selected) {
    return <PropietarioDetalle propietario={selected} onBack={() => setSelected(null)} />;
  }

  const doSearch = () => { setApplied({ by: searchBy, q: query }); setPage(1); };
  const clearSearch = () => { setQuery(""); setApplied(null); setPage(1); };

  const filtered = ROWS.filter((r) => {
    if (!applied || !applied.q.trim()) return true;
    const q = applied.q.trim().toLowerCase();
    const fields = applied.by ? [String(r[applied.by as keyof PropietarioRow] ?? "")] : Object.values(r).map(String);
    return fields.some((v) => v.toLowerCase().includes(q));
  });

  const totalRows = applied ? filtered.length : TOTAL;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const tableRows = pageRows.map((r) => ({
    ...r,
    estado: <StatusBadge label={ESTADO_BADGE[r.estado].label} variant={ESTADO_BADGE[r.estado].variant} />,
    opciones: <IconButton icon={Eye} title="Ver propietario" onClick={() => setSelected(r)} />,
  }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Propietarios"
        description="Gestiona los propietarios, sus inmuebles y estados de cuenta en un solo lugar."
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
            description="No encontramos propietarios que coincidan con la búsqueda. Ajusta los criterios e intenta de nuevo."
            action={<AppButton variant="secondary" onClick={clearSearch}>Limpiar búsqueda</AppButton>}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
