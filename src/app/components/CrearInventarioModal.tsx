import { useState } from "react";
import { CheckCircle2, Search, Loader2, MapPin, FileText, Home } from "lucide-react";
import { Modal } from "./kit/Modal";
import { SelectInput } from "./kit/SelectInput";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";

export interface NuevoInventario {
  codigo: string;
  direccion: string;
  contrato: string;
  tipoInmueble: string;
  pisos: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: NuevoInventario) => void;
}

const TIPO_BUSQUEDA = [
  { value: "alquilando", label: "Código Alquilando" },
  { value: "domus", label: "Código Domus" },
  { value: "direccion", label: "Dirección" },
];

const PISOS_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }));

/** Convierte texto en MAYÚSCULAS a Capitalización por palabra. */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b([a-záéíóúñ])/g, (m) => m.toUpperCase());
}

// Simulación de la base de inmuebles
const MOCK_INMUEBLE = {
  direccion: titleCase("AVE CARRERA 70 NO 65 A - 78 APTO 203 APARTAESTUDIO ESTRADA"),
  contrato: "2987",
  tipoInmueble: "Apartamento",
};

export function CrearInventarioModal({ open, onClose, onCreate }: Props) {
  const [tipoBusqueda, setTipoBusqueda] = useState("alquilando");
  const [idInmueble, setIdInmueble] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [encontrado, setEncontrado] = useState(false);
  const [pisos, setPisos] = useState("1");

  const reset = () => {
    setTipoBusqueda("alquilando");
    setIdInmueble("");
    setBuscando(false);
    setEncontrado(false);
    setPisos("1");
  };

  const close = () => { reset(); onClose(); };

  const buscar = () => {
    if (!idInmueble.trim()) return;
    setBuscando(true);
    setEncontrado(false);
    setTimeout(() => {
      setBuscando(false);
      setEncontrado(true);
    }, 900);
  };

  const crear = () => {
    onCreate({
      codigo: idInmueble.trim(),
      direccion: MOCK_INMUEBLE.direccion,
      contrato: MOCK_INMUEBLE.contrato,
      tipoInmueble: MOCK_INMUEBLE.tipoInmueble,
      pisos: Number(pisos),
    });
    reset();
  };

  return (
    <Modal open={open} onClose={close} title="Crear nuevo inventario" width={580}>
      <div className="flex flex-col gap-5">
        {/* Paso 1: búsqueda */}
        <div className="flex items-end gap-3 flex-wrap">
          <label className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
            <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Tipo de búsqueda *</span>
            <SelectInput
              options={TIPO_BUSQUEDA}
              value={tipoBusqueda}
              onChange={(v) => { setTipoBusqueda(v); setEncontrado(false); }}
              className="w-full"
            />
          </label>
          <label className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
            <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
              {tipoBusqueda === "direccion" ? "Dirección del inmueble *" : "Id inmueble Alquilando *"}
            </span>
            <input
              type="text"
              value={idInmueble}
              placeholder={tipoBusqueda === "direccion" ? "Ej. Cra 70 # 65-78" : "Ej. 4172"}
              onChange={(e) => { setIdInmueble(e.target.value); setEncontrado(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") buscar(); }}
              className="body-regular w-full"
              style={{
                border: "1px solid var(--gray-5)",
                borderRadius: "var(--radius-md)",
                padding: "0 12px",
                height: 40,
                color: "var(--gray-10)",
                outline: "none",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--gray-5)"; }}
            />
          </label>
          <AppButton variant="primary" bold disabled={!idInmueble.trim() || buscando} onClick={buscar}>
            {buscando ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            Buscar
          </AppButton>
        </div>

        {/* Resultado */}
        {encontrado && (
          <>
            <div
              className="flex flex-col rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--green-status)" }}
            >
              {/* Encabezado de éxito */}
              <div className="flex items-center gap-2" style={{ backgroundColor: "var(--green-status-light)", padding: "10px 16px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--green-status)", flexShrink: 0 }} />
                <span className="body-bold" style={{ color: "var(--green-status)" }}>Inmueble encontrado</span>
              </div>

              {/* Datos del inmueble */}
              <div className="flex flex-col" style={{ backgroundColor: "#ffffff" }}>
                <div className="flex items-start gap-3" style={{ padding: "14px 16px" }}>
                  <MapPin size={16} style={{ color: "var(--gray-7)", flexShrink: 0, marginTop: 2 }} />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Dirección</span>
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>{MOCK_INMUEBLE.direccion}</span>
                  </div>
                </div>
                <hr style={{ borderColor: "var(--gray-3)", margin: 0 }} />
                <div className="flex items-center gap-6" style={{ padding: "14px 16px" }}>
                  <div className="flex items-start gap-3 flex-1">
                    <FileText size={16} style={{ color: "var(--gray-7)", flexShrink: 0, marginTop: 2 }} />
                    <div className="flex flex-col gap-0.5">
                      <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Contrato</span>
                      <span className="body-bold" style={{ color: "var(--gray-10)" }}>{MOCK_INMUEBLE.contrato}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 flex-1">
                    <Home size={16} style={{ color: "var(--gray-7)", flexShrink: 0, marginTop: 2 }} />
                    <div className="flex flex-col gap-0.5">
                      <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Tipo de inmueble</span>
                      <span className="body-bold" style={{ color: "var(--gray-10)" }}>{MOCK_INMUEBLE.tipoInmueble}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>¿Cuántos pisos tiene el inmueble? *</span>
              <SelectInput options={PISOS_OPTIONS} value={pisos} onChange={setPisos} className="w-full" />
            </label>
          </>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between gap-4" style={{ marginTop: 4 }}>
          <LinkText onClick={close}>Cancelar</LinkText>
          <AppButton variant="primary" bold disabled={!encontrado} onClick={crear}>
            Crear inventario
          </AppButton>
        </div>
      </div>
    </Modal>
  );
}
