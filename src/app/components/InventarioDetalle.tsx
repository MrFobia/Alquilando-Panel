import { useState } from "react";
import { ArrowLeft, Plus, ImagePlus, Trash2, ListPlus, Image as ImageIcon } from "lucide-react";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { SelectInput } from "./kit/SelectInput";
import { InfoField } from "./kit/InfoField";
import { FileDropzone } from "./kit/FileDropzone";
import { StatusBadge } from "./kit/StatusBadge";
import { CollapsiblePanel } from "./kit/CollapsiblePanel";
import { Footer } from "./kit/Footer";
import type { NuevoInventario } from "./CrearInventarioModal";
import { titleCase } from "./CrearInventarioModal";

const ORDINALES = ["Primer", "Segundo", "Tercer", "Cuarto", "Quinto"];

const AMBIENTE_TYPES = [
  "Sala comedor", "Vestier", "Hall", "Zona de ropas", "Cocina",
  "Acceso escalera segundo piso", "Alcobas", "Balcón o terraza",
  "Baño", "Estudio", "Garaje", "Patio",
].map((t) => ({ value: t, label: t }));

const ESTADO_OPTIONS = ["Excelente", "Bueno", "Regular", "Malo"].map((e) => ({ value: e, label: e }));
const CANTIDAD_OPTIONS = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

const ESTADO_VARIANT: Record<string, "active" | "registered" | "pending" | "rejected"> = {
  Excelente: "active",
  Bueno: "registered",
  Regular: "pending",
  Malo: "rejected",
};

interface Especificacion {
  elementos: string;
  estado: string;
  cantidad: string;
  material: string;
  notas: string;
}

interface Ambiente {
  id: string;
  tipo: string;
  nombre: string;
  fotos: number;
  especificaciones: Especificacion[];
}

interface Nivel {
  id: string;
  nombre: string;
  ambientes: Ambiente[];
}

interface NotaItem {
  id: string;
  texto: string;
  fecha: string;
}

interface Props {
  inventario: NuevoInventario;
  onBack: () => void;
}

let uid = 0;
const nextId = () => `id-${++uid}`;

function CountChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="tags-bold rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#ffffff", padding: "2px 9px" }}>
      {children}
    </span>
  );
}

/* ── Builder de un ambiente ─────────────────────────────────────────────── */
function AmbientePanel({
  ambiente, onAddFotos, onAddSpec, onDeleteSpec, onDelete,
}: {
  ambiente: Ambiente;
  onAddFotos: (n: number) => void;
  onAddSpec: (s: Especificacion) => void;
  onDeleteSpec: (i: number) => void;
  onDelete: () => void;
}) {
  const [galeriaOpen, setGaleriaOpen] = useState(false);
  const [specOpen, setSpecOpen] = useState(false);
  const [pendingFotos, setPendingFotos] = useState(0);
  const [spec, setSpec] = useState<Especificacion>({ elementos: "", estado: "", cantidad: "", material: "", notas: "" });

  const specValido = spec.elementos.trim() && spec.estado && spec.cantidad;

  const guardarSpec = () => {
    if (!specValido) return;
    onAddSpec(spec);
    setSpec({ elementos: "", estado: "", cantidad: "", material: "", notas: "" });
    setSpecOpen(false);
  };

  const subirFotos = () => {
    if (pendingFotos === 0) return;
    onAddFotos(pendingFotos);
    setPendingFotos(0);
    setGaleriaOpen(false);
  };

  return (
    <CollapsiblePanel
      title={ambiente.nombre ? `${ambiente.tipo} · ${ambiente.nombre}` : ambiente.tipo}
      right={
        <div className="flex items-center gap-2">
          <CountChip>{ambiente.fotos} fotos</CountChip>
          <CountChip>{ambiente.especificaciones.length} ítems</CountChip>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Galería */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} style={{ color: "var(--navy)" }} />
              <span className="body-bold" style={{ color: "var(--navy)" }}>Galería</span>
              {ambiente.fotos > 0 && <StatusBadge label={`${ambiente.fotos} archivos`} variant="neutral" />}
            </div>
            {!galeriaOpen && <LinkText icon="chevron" onClick={() => setGaleriaOpen(true)}>Agregar galería</LinkText>}
          </div>

          {galeriaOpen && (
            <div className="flex flex-col gap-3">
              <FileDropzone onFiles={(files) => setPendingFotos((n) => n + files.length)} />
              {pendingFotos > 0 && (
                <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
                  {pendingFotos} {pendingFotos === 1 ? "archivo listo" : "archivos listos"} para subir
                </span>
              )}
              <div className="flex items-center justify-end gap-3">
                <LinkText onClick={() => { setGaleriaOpen(false); setPendingFotos(0); }}>Cancelar</LinkText>
                <AppButton variant="primary" bold disabled={pendingFotos === 0} onClick={subirFotos}>
                  <ImagePlus size={15} /> Subir archivos
                </AppButton>
              </div>
            </div>
          )}
        </div>

        <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

        {/* Especificaciones */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ListPlus size={16} style={{ color: "var(--navy)" }} />
              <span className="body-bold" style={{ color: "var(--navy)" }}>Especificaciones</span>
            </div>
            {!specOpen && <LinkText icon="chevron" onClick={() => setSpecOpen(true)}>Agregar nueva especificación</LinkText>}
          </div>

          {/* Lista de specs guardadas */}
          {ambiente.especificaciones.length > 0 ? (
            <div className="flex flex-col gap-2">
              {ambiente.especificaciones.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg flex-wrap"
                  style={{ border: "1px solid var(--gray-4)", padding: "10px 14px" }}
                >
                  <span className="body-bold" style={{ color: "var(--gray-10)", minWidth: 120 }}>{s.elementos}</span>
                  <StatusBadge label={s.estado} variant={ESTADO_VARIANT[s.estado] ?? "neutral"} />
                  <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Cantidad: {s.cantidad}</span>
                  {s.material && <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>· {s.material}</span>}
                  {s.notas && <span className="body-small-regular flex-1" style={{ color: "var(--gray-7)" }}>"{s.notas}"</span>}
                  <button
                    onClick={() => onDeleteSpec(i)}
                    className="ml-auto flex items-center justify-center"
                    style={{ cursor: "pointer", background: "transparent", color: "var(--destructive)" }}
                    title="Eliminar especificación"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : !specOpen && (
            <div
              className="flex flex-col items-center gap-1 rounded-lg text-center"
              style={{ backgroundColor: "var(--gray-1)", padding: "16px" }}
            >
              <span className="body-bold" style={{ color: "var(--navy)" }}>No hay especificaciones para este ambiente</span>
              <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
                Recuerde que algunas aseguradoras no reciben solamente archivos multimedia del inventario.
              </span>
            </div>
          )}

          {/* Form de spec */}
          {specOpen && (
            <div className="flex flex-col gap-4 rounded-lg" style={{ backgroundColor: "var(--gray-1)", padding: "16px" }}>
              <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Elementos *</span>
                  <FieldInput value={spec.elementos} placeholder="Escriba aquí" onChange={(v) => setSpec((p) => ({ ...p, elementos: v }))} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Estado *</span>
                  <SelectInput options={ESTADO_OPTIONS} value={spec.estado} onChange={(v) => setSpec((p) => ({ ...p, estado: v }))} className="w-full" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Cantidad *</span>
                  <SelectInput options={CANTIDAD_OPTIONS} value={spec.cantidad} onChange={(v) => setSpec((p) => ({ ...p, cantidad: v }))} className="w-full" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Material</span>
                  <FieldInput value={spec.material} placeholder="Escriba aquí" onChange={(v) => setSpec((p) => ({ ...p, material: v }))} />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Notas</span>
                <textarea
                  value={spec.notas}
                  placeholder="Escriba aquí"
                  rows={2}
                  onChange={(e) => setSpec((p) => ({ ...p, notas: e.target.value }))}
                  className="body-regular w-full"
                  style={{ border: "1px solid var(--gray-5)", borderRadius: "var(--radius-md)", padding: 12, color: "var(--gray-10)", outline: "none", resize: "vertical", backgroundColor: "#ffffff" }}
                />
              </label>
              <div className="flex items-center justify-end gap-3">
                <LinkText onClick={() => setSpecOpen(false)}>Cancelar</LinkText>
                <AppButton variant="primary" bold disabled={!specValido} onClick={guardarSpec}>Guardar</AppButton>
              </div>
            </div>
          )}
        </div>

        <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />
        <div className="flex justify-end">
          <LinkText onClick={onDelete}>
            <span className="inline-flex items-center gap-1" style={{ color: "var(--destructive)" }}>
              <Trash2 size={14} /> Eliminar ambiente
            </span>
          </LinkText>
        </div>
      </div>
    </CollapsiblePanel>
  );
}

function FieldInput({ value, placeholder, onChange }: { value: string; placeholder?: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="body-regular w-full"
      style={{ border: "1px solid var(--gray-5)", borderRadius: "var(--radius-md)", padding: "0 12px", height: 40, color: "var(--gray-10)", outline: "none", backgroundColor: "#ffffff" }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--gray-5)"; }}
    />
  );
}

/* ── Builder de un nivel ────────────────────────────────────────────────── */
function NivelPanel({
  nivel, onAddAmbiente, onUpdateAmbiente, onDeleteAmbiente,
}: {
  nivel: Nivel;
  onAddAmbiente: (tipo: string, nombre: string) => void;
  onUpdateAmbiente: (id: string, fn: (a: Ambiente) => Ambiente) => void;
  onDeleteAmbiente: (id: string) => void;
}) {
  const [tipo, setTipo] = useState("");
  const [nombre, setNombre] = useState("");

  const agregar = () => {
    if (!tipo) return;
    onAddAmbiente(tipo, nombre.trim());
    setTipo("");
    setNombre("");
  };

  return (
    <CollapsiblePanel
      title={nivel.nombre}
      defaultOpen
      right={<CountChip>{nivel.ambientes.length} {nivel.ambientes.length === 1 ? "ambiente" : "ambientes"}</CountChip>}
    >
      <div className="flex flex-col gap-5">
        {/* Agregar ambiente */}
        <div className="flex flex-col gap-3">
          <span className="body-bold" style={{ color: "var(--navy)" }}>Características generales del ambiente</span>
          <div className="flex items-end gap-4 flex-wrap">
            <label className="flex flex-col gap-1.5 flex-1 min-w-[220px]">
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Tipo de ambiente *</span>
              <SelectInput options={AMBIENTE_TYPES} value={tipo} onChange={setTipo} className="w-full" />
            </label>
            <label className="flex flex-col gap-1.5 flex-1 min-w-[220px]">
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Nombre del ambiente (si aplica)</span>
              <FieldInput value={nombre} placeholder="Escriba aquí" onChange={setNombre} />
            </label>
            <AppButton variant="primary" bold disabled={!tipo} onClick={agregar}>
              <Plus size={15} /> Agregar ambiente
            </AppButton>
          </div>
        </div>

        {/* Lista de ambientes */}
        {nivel.ambientes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {nivel.ambientes.map((amb) => (
              <AmbientePanel
                key={amb.id}
                ambiente={amb}
                onAddFotos={(n) => onUpdateAmbiente(amb.id, (a) => ({ ...a, fotos: a.fotos + n }))}
                onAddSpec={(s) => onUpdateAmbiente(amb.id, (a) => ({ ...a, especificaciones: [...a.especificaciones, s] }))}
                onDeleteSpec={(i) => onUpdateAmbiente(amb.id, (a) => ({ ...a, especificaciones: a.especificaciones.filter((_, idx) => idx !== i) }))}
                onDelete={() => onDeleteAmbiente(amb.id)}
              />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center gap-1 rounded-lg text-center"
            style={{ backgroundColor: "var(--gray-1)", padding: "20px" }}
          >
            <span className="body-bold" style={{ color: "var(--navy)" }}>Aún no hay ambientes en este nivel</span>
            <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
              Selecciona el tipo de ambiente y pulsa "Agregar ambiente" para empezar.
            </span>
          </div>
        )}
      </div>
    </CollapsiblePanel>
  );
}

/* ── Página principal ───────────────────────────────────────────────────── */
export function InventarioDetalle({ inventario, onBack }: Props) {
  const [niveles, setNiveles] = useState<Nivel[]>(() =>
    Array.from({ length: inventario.pisos }, (_, i) => ({
      id: nextId(),
      nombre: `${ORDINALES[i] ?? `Nivel ${i + 1}`} piso`,
      ambientes: [],
    })),
  );
  const [notas, setNotas] = useState<NotaItem[]>([]);
  const [nuevaNota, setNuevaNota] = useState("");

  const totalAmbientes = niveles.reduce((acc, n) => acc + n.ambientes.length, 0);

  const updateNivel = (nivelId: string, fn: (n: Nivel) => Nivel) =>
    setNiveles((prev) => prev.map((n) => (n.id === nivelId ? fn(n) : n)));

  const addAmbiente = (nivelId: string, tipo: string, nombre: string) =>
    updateNivel(nivelId, (n) => ({ ...n, ambientes: [...n.ambientes, { id: nextId(), tipo, nombre, fotos: 0, especificaciones: [] }] }));

  const updateAmbiente = (nivelId: string, ambId: string, fn: (a: Ambiente) => Ambiente) =>
    updateNivel(nivelId, (n) => ({ ...n, ambientes: n.ambientes.map((a) => (a.id === ambId ? fn(a) : a)) }));

  const deleteAmbiente = (nivelId: string, ambId: string) =>
    updateNivel(nivelId, (n) => ({ ...n, ambientes: n.ambientes.filter((a) => a.id !== ambId) }));

  const agregarNota = () => {
    if (!nuevaNota.trim()) return;
    setNotas((prev) => [{ id: nextId(), texto: nuevaNota.trim(), fecha: new Date().toLocaleString("es-CO") }, ...prev]);
    setNuevaNota("");
  };

  const fechaCreacion = new Date().toLocaleString("es-CO");

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 body-bold w-fit"
        style={{ cursor: "pointer", color: "var(--navy)", background: "transparent" }}
      >
        <ArrowLeft size={16} /> Volver
      </button>

      {/* Header */}
      <section
        className="rounded-lg flex items-start justify-between gap-4 flex-wrap"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>Inventario</h1>
          <span className="subtitle" style={{ color: "var(--gray-10)" }}>{titleCase(inventario.direccion)}</span>
        </div>
        <AppButton variant="primary" bold>Asignar contrato</AppButton>
      </section>

      {/* Info */}
      <section
        className="rounded-lg flex flex-col gap-4"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <span className="subtitle" style={{ color: "var(--navy)" }}>Información del inventario</span>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
        <div className="grid grid-cols-4 gap-x-6 gap-y-5 max-lg:grid-cols-2">
          <InfoField label="Nombre del inventario" value="Inventario" />
          <InfoField label="Fecha de creación" value={fechaCreacion} />
          <InfoField label="Tipo de inmueble" value={inventario.tipoInmueble} />
          <InfoField label="Niveles del inmueble" value={String(inventario.pisos)} />
          <InfoField label="Propietario" value="Por asignar" />
          <InfoField label="Inquilino" value="Por asignar" />
          <InfoField label="Total ambientes" value={String(totalAmbientes)} />
          <InfoField label="Tipo de inventario" value="Recepción" />
        </div>
      </section>

      {/* Niveles */}
      <section
        className="rounded-lg flex flex-col gap-4"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="subtitle" style={{ color: "var(--navy)" }}>Niveles</span>
          <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
            {totalAmbientes} {totalAmbientes === 1 ? "ambiente registrado" : "ambientes registrados"}
          </span>
        </div>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
        <div className="flex flex-col gap-4">
          {niveles.map((nivel) => (
            <NivelPanel
              key={nivel.id}
              nivel={nivel}
              onAddAmbiente={(tipo, nombre) => addAmbiente(nivel.id, tipo, nombre)}
              onUpdateAmbiente={(ambId, fn) => updateAmbiente(nivel.id, ambId, fn)}
              onDeleteAmbiente={(ambId) => deleteAmbiente(nivel.id, ambId)}
            />
          ))}
        </div>
      </section>

      {/* Notas */}
      <section
        className="rounded-lg flex flex-col gap-4"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <span className="subtitle" style={{ color: "var(--navy)" }}>Notas generales</span>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        {notas.length === 0 ? (
          <div className="flex flex-col gap-0.5">
            <span className="body-bold" style={{ color: "var(--navy)" }}>No hay notas disponibles actualmente</span>
            <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
              Si no hay nada que reportar, también es buena señal.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notas.map((n) => (
              <div key={n.id} className="rounded-lg flex flex-col gap-1" style={{ border: "1px solid var(--gray-4)", padding: "10px 14px" }}>
                <span className="body-regular" style={{ color: "var(--gray-10)" }}>{n.texto}</span>
                <span className="disclamer" style={{ color: "var(--gray-7)" }}>{n.fecha}</span>
              </div>
            ))}
          </div>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Nueva nota</span>
          <textarea
            value={nuevaNota}
            placeholder="Escriba aquí"
            rows={3}
            onChange={(e) => setNuevaNota(e.target.value)}
            className="body-regular w-full"
            style={{ border: "1px solid var(--gray-5)", borderRadius: "var(--radius-md)", padding: 12, color: "var(--gray-10)", outline: "none", resize: "vertical", backgroundColor: "#ffffff" }}
          />
        </label>
        <div className="flex justify-end">
          <AppButton variant="primary" bold disabled={!nuevaNota.trim()} onClick={agregarNota}>
            <Plus size={15} /> Agregar nota
          </AppButton>
        </div>
      </section>

      <Footer />
    </div>
  );
}
