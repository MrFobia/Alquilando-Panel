import { useState } from "react";
import { Search, Loader2, CheckCircle2 } from "lucide-react";
import { Modal } from "./kit/Modal";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { SelectInput } from "./kit/SelectInput";
import { FileDropzone } from "./kit/FileDropzone";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TIPO_OPTIONS = [
  { value: "servicio", label: "Servicio al cliente" },
  { value: "reparaciones", label: "Reparaciones" },
  { value: "facturacion", label: "Facturación" },
  { value: "juridico", label: "Jurídico" },
  { value: "administraciones", label: "Administraciones" },
  { value: "servicios", label: "Servicios públicos" },
];

const PRIORIDAD_OPTIONS = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Media" },
  { value: "baja", label: "Baja" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>{children}</span>;
}

function TextField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="body-regular w-full"
      style={{ border: "1px solid var(--gray-5)", borderRadius: "var(--radius-md)", padding: "0 12px", height: 40, color: "var(--gray-10)", outline: "none" }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--gray-5)"; }}
    />
  );
}

export function CrearSolicitudModal({ open, onClose }: Props) {
  const [codigo, setCodigo] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [archivos, setArchivos] = useState<File[]>([]);
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const valido = codigo.trim() && titulo.trim() && tipo && prioridad && descripcion.trim();

  const reset = () => {
    setCodigo(""); setBuscando(false); setTitulo(""); setTipo(""); setPrioridad("");
    setArchivos([]); setDescripcion(""); setEnviando(false); setExito(false);
  };

  const close = () => { reset(); onClose(); };

  const buscar = () => {
    if (!codigo.trim()) return;
    setBuscando(true);
    setTimeout(() => setBuscando(false), 800);
  };

  const crear = () => {
    if (!valido) return;
    setEnviando(true);
    setTimeout(() => { setEnviando(false); setExito(true); }, 1100);
  };

  return (
    <Modal open={open} onClose={close} title={exito ? "Solicitud enviada" : "Crear solicitud"} width={560}>
      {exito ? (
        <div className="flex flex-col items-center gap-4 text-center" style={{ padding: "12px 0" }}>
          <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, backgroundColor: "var(--green-status-light)" }}>
            <CheckCircle2 size={32} style={{ color: "var(--green-status)" }} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="title-tertiary-bold" style={{ color: "var(--navy)" }}>¡Solicitud creada correctamente!</span>
            <span className="body-regular" style={{ color: "var(--gray-9)" }}>
              Tu solicitud fue registrada con éxito. Nuestro equipo de soporte la revisará y te contactará pronto.
            </span>
          </div>
          <div
            className="flex flex-col gap-1 rounded-lg w-full"
            style={{ backgroundColor: "var(--gray-1)", padding: "12px 16px" }}
          >
            <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Número de radicado</span>
            <span className="body-bold" style={{ color: "var(--gray-10)" }}>#{Math.floor(80000 + Math.random() * 9999)}</span>
          </div>
          <AppButton variant="primary" bold fullWidth onClick={close}>Entendido</AppButton>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-3">
            <label className="flex flex-col gap-1.5 flex-1">
              <FieldLabel>Código SIMI *</FieldLabel>
              <TextField value={codigo} onChange={setCodigo} placeholder="Escriba aquí" />
            </label>
            <AppButton variant="primary" bold disabled={!codigo.trim() || buscando} onClick={buscar}>
              {buscando ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />} Buscar
            </AppButton>
          </div>

          <label className="flex flex-col gap-1.5">
            <FieldLabel>Título de la solicitud *</FieldLabel>
            <TextField value={titulo} onChange={setTitulo} placeholder="Escriba aquí" />
          </label>

          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <label className="flex flex-col gap-1.5">
              <FieldLabel>Tipo de solicitud *</FieldLabel>
              <SelectInput options={TIPO_OPTIONS} value={tipo} onChange={setTipo} className="w-full" />
            </label>
            <label className="flex flex-col gap-1.5">
              <FieldLabel>Prioridad *</FieldLabel>
              <SelectInput options={PRIORIDAD_OPTIONS} value={prioridad} onChange={setPrioridad} className="w-full" />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <FieldLabel>Adjuntar archivos</FieldLabel>
            <FileDropzone hint="Seleccione o arrastre aquí los archivos (Máx: 10MB)" onFiles={(f) => setArchivos((p) => [...p, ...f])} />
            {archivos.length > 0 && (
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
                {archivos.length} {archivos.length === 1 ? "archivo adjunto" : "archivos adjuntos"}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1.5">
            <FieldLabel>Descripción de la solicitud *</FieldLabel>
            <textarea
              value={descripcion}
              placeholder="Escriba aquí"
              rows={4}
              onChange={(e) => setDescripcion(e.target.value)}
              className="body-regular w-full"
              style={{ border: "1px solid var(--gray-5)", borderRadius: "var(--radius-md)", padding: 12, color: "var(--gray-10)", outline: "none", resize: "vertical" }}
            />
          </label>

          <div className="flex items-center justify-between gap-4" style={{ marginTop: 4 }}>
            <LinkText onClick={close}>Cancelar</LinkText>
            <AppButton variant="primary" bold disabled={!valido || enviando} onClick={crear}>
              {enviando ? <><Loader2 size={15} className="animate-spin" /> Enviando…</> : "Crear solicitud"}
            </AppButton>
          </div>
        </div>
      )}
    </Modal>
  );
}
