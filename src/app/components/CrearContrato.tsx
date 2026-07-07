import { useState } from "react";
import {
  ArrowLeft, Home, Building2, Search, Droplets, Lightbulb, Flame,
  ShieldCheck, FileUp,
} from "lucide-react";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { SelectInput } from "./kit/SelectInput";
import { TextInput } from "./kit/TextInput";
import { ToggleSwitch } from "./kit/ToggleSwitch";
import { FileDropzone } from "./kit/FileDropzone";
import { Callout } from "./kit/Callout";
import { Stepper } from "./kit/Stepper";
import { Footer } from "./kit/Footer";
import { SegmentedControl } from "./kit/SegmentedControl";
import { StatusBadge } from "./kit/StatusBadge";
import { InfoField } from "./kit/InfoField";
import { QuantityStepper } from "./kit/QuantityStepper";
import { PasoPropietario } from "./PasoPropietario";
import { PasoInquilino } from "./PasoInquilino";

type TipoContrato = "vivienda" | "comercio";

interface Props {
  onBack: () => void;
  onFinish: () => void;
}

const STEPS = [
  { id: "inmueble", label: "Inmueble" },
  { id: "propietario", label: "Propietario" },
  { id: "inquilino", label: "Inquilino" },
  { id: "condiciones", label: "Condiciones" },
  { id: "documentos", label: "Documentos" },
];

const CIUDAD_OPTIONS = ["Bogotá", "Medellín", "Cali", "Barranquilla"].map((c) => ({ value: c, label: c }));
const LOCALIDAD_OPTIONS = ["Chapinero", "Usaquén", "Suba", "Kennedy"].map((c) => ({ value: c, label: c }));
const TIPO_VIA_OPTIONS = ["Calle", "Carrera", "Avenida", "Transversal", "Diagonal"].map((c) => ({ value: c, label: c }));
const CARDINAL_OPTIONS = ["Norte", "Sur", "Este", "Oeste"].map((c) => ({ value: c, label: c }));
const LETRA_OPTIONS = ["A", "B", "C", "D"].map((c) => ({ value: c, label: c }));
const BARRIO_OPTIONS = ["Chicó", "El Poblado", "Santa Bárbara", "Modelia"].map((c) => ({ value: c, label: c }));
const ZONA_OPTIONS = ["Norte", "Sur", "Occidente", "Oriente", "Centro"].map((c) => ({ value: c, label: c }));
const ESTRATO_OPTIONS = ["1", "2", "3", "4", "5", "6"].map((c) => ({ value: c, label: c }));
const USO_COMERCIAL_OPTIONS = ["Local", "Oficina", "Bodega", "Consultorio"].map((c) => ({ value: c, label: c }));
const TIPO_INMUEBLE_VIVIENDA = ["Apartamento", "Casa", "Apartaestudio"].map((c) => ({ value: c, label: c }));
const TIPO_INMUEBLE_COMERCIO = ["Local comercial", "Oficina", "Bodega", "Consultorio"].map((c) => ({ value: c, label: c }));
const OTROS_SERVICIOS_OPTIONS = ["Internet", "Gas natural (Bombona)", "Vigilancia", "Aseo"].map((c) => ({ value: c, label: c }));
const INMOBILIARIA_OPTIONS = ["Alquilando SAS", "Alquilando Caribe", "C&M", "Izban"].map((c) => ({ value: c, label: c }));
const BUSCAR_POR_OPTIONS = ["Código domus", "Id Alquilando", "Matrícula inmobiliaria", "Dirección"].map((c) => ({ value: c, label: c }));

interface InmuebleEncontrado {
  id: string;
  codigoSimi: string;
  direccion: string;
  zona: string;
  area: string;
  tipo: string;
  inmobiliaria: string;
}

const MOCK_INMUEBLES: Record<string, InmuebleEncontrado> = {
  "6551": {
    id: "6551",
    codigoSimi: "",
    direccion: "CL 86 # 11 - 50 AP 503 - BRR CHICO VIRREY",
    zona: "Norte",
    area: "130",
    tipo: "Apartamento",
    inmobiliaria: "Alquilando SAS",
  },
};

const DOCS_COMUNES = [
  "Cuenta de cobro administración último mes",
  "Paz y salvo administración",
  "Recibo de servicios públicos",
  "Certificado de tradición y libertad del inmueble",
  "PDF aprobación de condiciones por parte del propietario",
];

const DOCS_VIVIENDA = [
  "Cédula arrendatario",
  "Cédula deudor solidario",
  "PDF aprobación de condiciones por parte del inquilino",
  "Resultado de estudio de aseguribilidad",
];

const DOCS_COMERCIO = [
  "Rut inquilino",
  "Rut deudor solidario",
  "Certificado de existencia y representación legal de persona jurídica",
  "Cédula representante legal",
  "Rut sociedad",
  "Rut representante legal",
  "Permiso para el uso del suelo (Comercio)",
];

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>
        {label}{required && <span style={{ color: "var(--destructive)" }}> *</span>}
      </span>
      {children}
      {error && <span className="body-small-regular" style={{ color: "var(--destructive)" }}>Este campo es obligatorio</span>}
    </label>
  );
}

interface UnidadItem {
  numero: string;
  matricula: string;
}

function resizeUnidades(count: string, prev: UnidadItem[]): UnidadItem[] {
  const n = Number(count) || 0;
  return Array.from({ length: n }, (_, i) => prev[i] ?? { numero: "", matricula: "" });
}

function UnidadesBlock({
  label, tiene, cantidad, items, onTiene, onCantidad, onItemChange, attempted,
}: {
  label: string;
  tiene: boolean;
  cantidad: string;
  items: UnidadItem[];
  onTiene: (v: boolean) => void;
  onCantidad: (v: string) => void;
  onItemChange: (i: number, patch: Partial<UnidadItem>) => void;
  attempted: boolean;
}) {
  const labelLower = label.toLowerCase();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-6 flex-wrap">
        <ToggleSwitch checked={tiene} onChange={onTiene} label={`¿Tiene ${labelLower}?`} />
        {tiene && (
          <div className="flex items-center gap-3">
            <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Cantidad</span>
            <QuantityStepper value={Number(cantidad) || 1} onChange={(n) => onCantidad(String(n))} />
          </div>
        )}
      </div>

      {tiene && items.length > 0 && (
        <div className="rounded-lg" style={{ border: "1px solid var(--gray-4)" }}>
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 flex-wrap"
              style={{ padding: "14px 16px", borderTop: i > 0 ? "1px solid var(--gray-4)" : "none" }}
            >
              <div
                className="rounded-full body-bold flex items-center justify-center shrink-0"
                style={{ width: 32, height: 32, backgroundColor: "var(--navy-light)", color: "var(--navy)" }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-[200px]">
                <Field label={`Número de ${labelLower}`} required error={attempted && !item.numero.trim()}>
                  <TextInput placeholder="Escriba aquí" value={item.numero} onChange={(v) => onItemChange(i, { numero: v })} className="w-full" />
                </Field>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Field label="Número de matrícula (Opcional)">
                  <TextInput placeholder="Escriba aquí" value={item.matricula} onChange={(v) => onItemChange(i, { matricula: v })} className="w-full" />
                </Field>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-lg flex flex-col gap-5"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "24px 28px" }}
    >
      <span className="subtitle" style={{ color: "var(--navy)" }}>{title}</span>
      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
      {children}
    </section>
  );
}

function ServicioRow({
  icon: Icon, label, cuenta, contador, compartido, porcentaje, onCuenta, onContador, onCompartido, onPorcentaje,
}: {
  icon: React.ElementType; label: string; cuenta: string; contador: string; compartido: boolean; porcentaje: string;
  onCuenta: (v: string) => void; onContador: (v: string) => void; onCompartido: (v: boolean) => void; onPorcentaje: (v: string) => void;
}) {
  return (
    <div className="flex items-end gap-4 flex-wrap">
      <div className="flex items-center gap-2 rounded-lg shrink-0" style={{ backgroundColor: "var(--navy-light)", padding: "9px 14px", height: 40 }}>
        <Icon size={16} style={{ color: "var(--navy)" }} />
        <span className="body-bold" style={{ color: "var(--navy)" }}>{label}</span>
      </div>
      <div className="flex-1 min-w-[160px]">
        <Field label="Número de cuenta"><TextInput placeholder="Escriba aquí" value={cuenta} onChange={onCuenta} className="w-full" /></Field>
      </div>
      <div className="flex-1 min-w-[160px]">
        <Field label="Contador"><TextInput placeholder="Escriba aquí" value={contador} onChange={onContador} className="w-full" /></Field>
      </div>
      <div className="flex items-center gap-2 shrink-0" style={{ height: 40 }}>
        <ToggleSwitch checked={compartido} onChange={onCompartido} label="Servicio compartido" />
      </div>
      <div className="flex-1 min-w-[160px]">
        <Field label="Porcentaje del servicio compartido">
          <TextInput placeholder="Escriba aquí" value={porcentaje} onChange={onPorcentaje} className="w-full" disabled={!compartido} />
        </Field>
      </div>
    </div>
  );
}

export function CrearContrato({ onBack, onFinish }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [tipoContrato, setTipoContrato] = useState<TipoContrato>("vivienda");
  const [origen, setOrigenRaw] = useState<"portafolio" | "nuevo">("portafolio");
  const [copropiedad, setCopropiedad] = useState(false);

  const [buscarPor, setBuscarPor] = useState("");
  const [numeroBusqueda, setNumeroBusqueda] = useState("");
  const [busquedaEstado, setBusquedaEstado] = useState<"idle" | "found" | "notfound">("idle");
  const [inmuebleEncontrado, setInmuebleEncontrado] = useState<InmuebleEncontrado | null>(null);

  const setOrigen = (o: "portafolio" | "nuevo") => {
    setOrigenRaw(o);
    setBusquedaEstado("idle");
    setInmuebleEncontrado(null);
  };

  const buscarInmueble = () => {
    if (!numeroBusqueda.trim()) return;
    const match = MOCK_INMUEBLES[numeroBusqueda.trim()];
    if (match) {
      setInmuebleEncontrado(match);
      setBusquedaEstado("found");
    } else {
      setInmuebleEncontrado(null);
      setBusquedaEstado("notfound");
    }
  };

  const limpiarBusqueda = () => {
    setNumeroBusqueda("");
    setBusquedaEstado("idle");
    setInmuebleEncontrado(null);
  };

  const [inmobiliaria, setInmobiliaria] = useState("");
  const [tipoInmueble, setTipoInmueble] = useState("");
  const [area, setArea] = useState("");
  const [matricula, setMatricula] = useState("");
  const [chip, setChip] = useState("");
  const [catastral, setCatastral] = useState("");

  const [ciudad, setCiudad] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [tipoVia, setTipoVia] = useState("");
  const [numeroVia, setNumeroVia] = useState("");
  const [letraVia, setLetraVia] = useState("");
  const [bisVia, setBisVia] = useState("");
  const [cardinalVia, setCardinalVia] = useState("");
  const [numeroCruce, setNumeroCruce] = useState("");
  const [cardinalCruce, setCardinalCruce] = useState("");
  const [numeroPlaca, setNumeroPlaca] = useState("");
  const [complemento, setComplemento] = useState("");
  const [conjunto, setConjunto] = useState("");
  const [barrio, setBarrio] = useState("");
  const [zona, setZona] = useState("");
  const [estrato, setEstrato] = useState("");
  const [usoComercial, setUsoComercial] = useState("");
  const [camaraComercio, setCamaraComercio] = useState("");
  const [garajeTiene, setGarajeTiene] = useState(false);
  const [garajeCantidad, setGarajeCantidad] = useState("");
  const [garajeItems, setGarajeItems] = useState<UnidadItem[]>([]);
  const [depositoTiene, setDepositoTiene] = useState(false);
  const [depositoCantidad, setDepositoCantidad] = useState("");
  const [depositoItems, setDepositoItems] = useState<UnidadItem[]>([]);
  const [cuotaAdmin, setCuotaAdmin] = useState("");
  const [attemptedStep0, setAttemptedStep0] = useState(false);

  const handleGarajeTiene = (v: boolean) => {
    setGarajeTiene(v);
    if (v) { setGarajeCantidad("1"); setGarajeItems(resizeUnidades("1", garajeItems)); }
    else { setGarajeCantidad(""); setGarajeItems([]); }
  };
  const handleGarajeCantidad = (v: string) => { setGarajeCantidad(v); setGarajeItems((prev) => resizeUnidades(v, prev)); };
  const handleGarajeItem = (i: number, patch: Partial<UnidadItem>) =>
    setGarajeItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const handleDepositoTiene = (v: boolean) => {
    setDepositoTiene(v);
    if (v) { setDepositoCantidad("1"); setDepositoItems(resizeUnidades("1", depositoItems)); }
    else { setDepositoCantidad(""); setDepositoItems([]); }
  };
  const handleDepositoCantidad = (v: string) => { setDepositoCantidad(v); setDepositoItems((prev) => resizeUnidades(v, prev)); };
  const handleDepositoItem = (i: number, patch: Partial<UnidadItem>) =>
    setDepositoItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const [agua, setAgua] = useState({ cuenta: "", contador: "", compartido: false, porcentaje: "" });
  const [luz, setLuz] = useState({ cuenta: "", contador: "", compartido: false, porcentaje: "" });
  const [gas, setGas] = useState({ cuenta: "", contador: "", compartido: false, porcentaje: "" });
  const [otroServicio, setOtroServicio] = useState("");

  const [busquedaDoc, setBusquedaDoc] = useState("");

  const direccionCompleta = [
    tipoVia && `${tipoVia} ${numeroVia}${letraVia ? ` ${letraVia}` : ""}${bisVia ? " BIS" : ""}${cardinalVia ? ` ${cardinalVia}` : ""}`,
    numeroCruce && `# ${numeroCruce}${cardinalCruce ? ` ${cardinalCruce}` : ""}`,
    numeroPlaca && `- ${numeroPlaca}`,
    complemento,
    conjunto && `CONJ. ${conjunto}`,
    barrio && `BRR ${barrio}`,
  ].filter(Boolean).join(" ");

  const showRestOfForm = origen === "nuevo" || busquedaEstado === "found";

  const docsChecklist = [...DOCS_COMUNES, ...(tipoContrato === "vivienda" ? DOCS_VIVIENDA : DOCS_COMERCIO)];
  const tipoInmuebleOptions = tipoContrato === "vivienda" ? TIPO_INMUEBLE_VIVIENDA : TIPO_INMUEBLE_COMERCIO;

  const step0Invalid = showRestOfForm && (
    (tipoContrato === "vivienda" && !estrato) ||
    (tipoContrato === "comercio" && !usoComercial) ||
    (garajeTiene && (!garajeCantidad || garajeItems.some((it) => !it.numero.trim()))) ||
    (depositoTiene && (!depositoCantidad || depositoItems.some((it) => !it.numero.trim())))
  );

  const goNext = () => {
    if (stepIndex === 0) {
      setAttemptedStep0(true);
      if (step0Invalid) return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));
  const isLastStep = stepIndex === STEPS.length - 1;

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 body-bold w-fit"
        style={{ cursor: "pointer", color: "var(--navy)", background: "transparent" }}
      >
        <ArrowLeft size={16} /> Volver
      </button>

      <section
        className="rounded-lg flex items-center justify-between gap-6 flex-wrap"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 28px" }}
      >
        <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>Creación de contrato</h1>
        <Stepper steps={STEPS} current={stepIndex} />
      </section>

      {stepIndex === 0 ? (
        <>
          <SectionCard title="Tipo de contrato">
            <div className="flex flex-col gap-3">
              <SegmentedControl
                value={tipoContrato}
                onChange={setTipoContrato}
                options={[
                  { value: "vivienda", label: "Vivienda", icon: Home },
                  { value: "comercio", label: "Comercio", icon: Building2 },
                ]}
              />
              <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
                Esta selección ajusta los campos de uso del inmueble y los documentos requeridos más adelante.
              </span>
            </div>
          </SectionCard>

          <SectionCard title="Información general del inmueble">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <span className="body-bold" style={{ color: "var(--gray-10)" }}>Inmueble</span>
                <div className="flex items-center gap-6">
                  {(["portafolio", "nuevo"] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setOrigen(o)}
                      className="inline-flex items-center gap-2"
                      style={{ cursor: "pointer", background: "transparent" }}
                    >
                      <span
                        className="flex items-center justify-center rounded-full shrink-0"
                        style={{ width: 18, height: 18, border: `1.5px solid ${origen === o ? "var(--navy)" : "var(--gray-6)"}` }}
                      >
                        {origen === o && <span className="rounded-full" style={{ width: 10, height: 10, backgroundColor: "var(--navy)" }} />}
                      </span>
                      <span className="body-regular" style={{ color: "var(--gray-10)" }}>
                        {o === "portafolio" ? "Portafolio / Re-Comercialización" : "Nuevo"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

              {origen === "portafolio" ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-end gap-3 flex-wrap">
                    <div style={{ width: 200 }}>
                      <Field label="Buscar por"><SelectInput options={BUSCAR_POR_OPTIONS} value={buscarPor} onChange={setBuscarPor} className="w-full" /></Field>
                    </div>
                    <div className="flex-1" style={{ minWidth: 160 }}>
                      <Field label="N°"><TextInput placeholder="0000" value={numeroBusqueda} onChange={setNumeroBusqueda} onEnter={buscarInmueble} onClear={limpiarBusqueda} className="w-full" /></Field>
                    </div>
                    <AppButton variant="primary" bold onClick={buscarInmueble}>
                      <Search size={15} /> Buscar inmueble
                    </AppButton>
                  </div>

                  {busquedaEstado === "notfound" && (
                    <Callout variant="error" title="No hay inmuebles que coincidan o cumplan con los requisitos para el contrato.">
                      <span style={{ color: "var(--red-status)" }}>
                        {buscarPor || "Código"}: <strong>{numeroBusqueda}</strong>, Verifica los datos e intenta nuevamente.
                      </span>
                    </Callout>
                  )}

                  {busquedaEstado === "found" && inmuebleEncontrado && (
                    <div className="flex flex-col gap-3">
                      <span className="body-bold" style={{ color: "var(--navy)" }}>Inmueble encontrado</span>
                      <div className="flex items-start gap-4 rounded-lg" style={{ backgroundColor: "var(--navy-light)", padding: "16px 20px" }}>
                        <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 44, height: 44, backgroundColor: "#ffffff" }}>
                          <Building2 size={20} style={{ color: "var(--navy)" }} />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="body-bold" style={{ color: "var(--navy)" }}>{inmuebleEncontrado.direccion}</span>
                            <StatusBadge label="Seleccionado" variant="registered" />
                          </div>
                          <span className="body-regular" style={{ color: "var(--gray-10)" }}>
                            ID: {inmuebleEncontrado.id} | Código simi: {inmuebleEncontrado.codigoSimi}
                          </span>
                          <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>
                            Zona: {inmuebleEncontrado.zona} | Área: {inmuebleEncontrado.area}m²
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-x-6 gap-y-4 max-lg:grid-cols-2">
                        <InfoField label="Inmobiliaria" value={inmuebleEncontrado.inmobiliaria} />
                        <InfoField label="Tipo de inmueble" value={inmuebleEncontrado.tipo} />
                        <InfoField label="Área construida" value={`${inmuebleEncontrado.area} m²`} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4">
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>General</span>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
                      <Field label="Inmobiliaria" required><SelectInput options={INMOBILIARIA_OPTIONS} value={inmobiliaria} onChange={setInmobiliaria} className="w-full" /></Field>
                      <Field label="Tipo de inmueble" required><SelectInput options={tipoInmuebleOptions} value={tipoInmueble} onChange={setTipoInmueble} className="w-full" /></Field>
                      <Field label="Área construida (mts)"><TextInput placeholder="Escriba aquí" value={area} onChange={setArea} className="w-full" /></Field>
                      <Field label="Número de matrícula inmobiliaria" required><TextInput placeholder="Escriba aquí" value={matricula} onChange={setMatricula} className="w-full" /></Field>
                      <Field label="Número de chip" required><TextInput placeholder="Escriba aquí" value={chip} onChange={setChip} className="w-full" /></Field>
                      <Field label="Cédula catastral (Opcional)"><TextInput placeholder="Escriba aquí" value={catastral} onChange={setCatastral} className="w-full" /></Field>
                    </div>
                  </div>

                  <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

                  <div className="flex flex-col gap-4">
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>Dirección</span>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
                      <Field label="Ciudad" required><SelectInput options={CIUDAD_OPTIONS} value={ciudad} onChange={setCiudad} className="w-full" /></Field>
                      <Field label="Localidad" required><SelectInput options={LOCALIDAD_OPTIONS} value={localidad} onChange={setLocalidad} className="w-full" /></Field>
                    </div>

                    <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>Vía principal (antes del #)</span>
                    <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-2">
                      <Field label="Tipo de vía" required><SelectInput options={TIPO_VIA_OPTIONS} value={tipoVia} onChange={setTipoVia} className="w-full" /></Field>
                      <Field label="Número" required><TextInput placeholder="Escriba aquí" value={numeroVia} onChange={setNumeroVia} className="w-full" /></Field>
                      <Field label="Letra (Opcional)"><SelectInput options={LETRA_OPTIONS} value={letraVia} onChange={setLetraVia} className="w-full" /></Field>
                      <Field label="Bis (Opcional)"><SelectInput options={[{ value: "si", label: "Sí" }]} value={bisVia} onChange={setBisVia} className="w-full" /></Field>
                      <Field label="Cardinal (Opcional)"><SelectInput options={CARDINAL_OPTIONS} value={cardinalVia} onChange={setCardinalVia} className="w-full" /></Field>
                    </div>

                    <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>Número de intersección (después del #)</span>
                    <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2">
                      <Field label="Número de cruce" required><TextInput placeholder="Escriba aquí" value={numeroCruce} onChange={setNumeroCruce} className="w-full" /></Field>
                      <Field label="Cardinal (Opcional)"><SelectInput options={CARDINAL_OPTIONS} value={cardinalCruce} onChange={setCardinalCruce} className="w-full" /></Field>
                      <Field label="Número de placa (después del -)" required><TextInput placeholder="Escriba aquí" value={numeroPlaca} onChange={setNumeroPlaca} className="w-full" /></Field>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
                      <Field label="Complemento (Apto / Torre / Interior)"><TextInput placeholder="Escriba aquí" value={complemento} onChange={setComplemento} className="w-full" /></Field>
                      <Field label="Conjunto (Opcional)"><TextInput placeholder="Escriba aquí" value={conjunto} onChange={setConjunto} className="w-full" /></Field>
                      <Field label="Barrio" required><SelectInput options={BARRIO_OPTIONS} value={barrio} onChange={setBarrio} className="w-full" /></Field>
                      <Field label="Zona" required><SelectInput options={ZONA_OPTIONS} value={zona} onChange={setZona} className="w-full" /></Field>
                    </div>

                    <Field label="Dirección completa">
                      <div
                        className="body-regular w-full rounded-lg"
                        style={{ backgroundColor: "var(--gray-2)", color: direccionCompleta ? "var(--gray-10)" : "var(--gray-7)", padding: "10px 12px", minHeight: 40 }}
                      >
                        {direccionCompleta || "Se genera automáticamente con los datos de arriba"}
                      </div>
                    </Field>
                  </div>
                </>
              )}

              {showRestOfForm && (
                <>
                  <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

                  <div className="flex flex-col gap-4">
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>Especificaciones</span>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-4 max-lg:grid-cols-1">
                      {tipoContrato === "vivienda" ? (
                        <Field label="Estrato" required error={attemptedStep0 && !estrato}><SelectInput options={ESTRATO_OPTIONS} value={estrato} onChange={setEstrato} className="w-full" /></Field>
                      ) : (
                        <>
                          <Field label="Uso comercial" required error={attemptedStep0 && !usoComercial}><SelectInput options={USO_COMERCIAL_OPTIONS} value={usoComercial} onChange={setUsoComercial} className="w-full" /></Field>
                          <Field label="Cámara de comercio (Opcional)"><TextInput placeholder="Escriba aquí" value={camaraComercio} onChange={setCamaraComercio} className="w-full" /></Field>
                        </>
                      )}
                    </div>

                    <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

                    <UnidadesBlock
                      label="Garaje"
                      tiene={garajeTiene} cantidad={garajeCantidad} items={garajeItems}
                      onTiene={handleGarajeTiene} onCantidad={handleGarajeCantidad} onItemChange={handleGarajeItem}
                      attempted={attemptedStep0}
                    />

                    <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

                    <UnidadesBlock
                      label="Depósito"
                      tiene={depositoTiene} cantidad={depositoCantidad} items={depositoItems}
                      onTiene={handleDepositoTiene} onCantidad={handleDepositoCantidad} onItemChange={handleDepositoItem}
                      attempted={attemptedStep0}
                    />
                  </div>
                </>
              )}
            </div>
          </SectionCard>

          {showRestOfForm && (
            <>
              <SectionCard title="Información de la copropiedad">
                <div className="flex flex-col gap-4">
                  <ToggleSwitch checked={copropiedad} onChange={setCopropiedad} label="Copropiedad" />
                  {copropiedad && (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1" style={{ maxWidth: 420 }}>
                      <Field label="Valor cuota de administración"><TextInput placeholder="Escriba aquí" value={cuotaAdmin} onChange={setCuotaAdmin} className="w-full" /></Field>
                    </div>
                  )}
                </div>
              </SectionCard>

              <SectionCard title="Servicios públicos">
                <div className="flex flex-col gap-5">
                  <ServicioRow
                    icon={Droplets} label="Agua"
                    cuenta={agua.cuenta} contador={agua.contador} compartido={agua.compartido} porcentaje={agua.porcentaje}
                    onCuenta={(v) => setAgua((s) => ({ ...s, cuenta: v }))}
                    onContador={(v) => setAgua((s) => ({ ...s, contador: v }))}
                    onCompartido={(v) => setAgua((s) => ({ ...s, compartido: v }))}
                    onPorcentaje={(v) => setAgua((s) => ({ ...s, porcentaje: v }))}
                  />
                  <ServicioRow
                    icon={Lightbulb} label="Luz"
                    cuenta={luz.cuenta} contador={luz.contador} compartido={luz.compartido} porcentaje={luz.porcentaje}
                    onCuenta={(v) => setLuz((s) => ({ ...s, cuenta: v }))}
                    onContador={(v) => setLuz((s) => ({ ...s, contador: v }))}
                    onCompartido={(v) => setLuz((s) => ({ ...s, compartido: v }))}
                    onPorcentaje={(v) => setLuz((s) => ({ ...s, porcentaje: v }))}
                  />
                  <ServicioRow
                    icon={Flame} label="Gas"
                    cuenta={gas.cuenta} contador={gas.contador} compartido={gas.compartido} porcentaje={gas.porcentaje}
                    onCuenta={(v) => setGas((s) => ({ ...s, cuenta: v }))}
                    onContador={(v) => setGas((s) => ({ ...s, contador: v }))}
                    onCompartido={(v) => setGas((s) => ({ ...s, compartido: v }))}
                    onPorcentaje={(v) => setGas((s) => ({ ...s, porcentaje: v }))}
                  />

                  <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

                  <Field label="Agregar otros servicios">
                    <SelectInput options={OTROS_SERVICIOS_OPTIONS} value={otroServicio} onChange={setOtroServicio} className="w-full max-w-[320px]" />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Documentos">
                <div className="flex flex-col gap-4">
                  <p className="body-regular" style={{ color: "var(--gray-10)" }}>
                    Sube aquí los documentos necesarios para la elaboración de tu contrato de arrendamiento.
                    {tipoContrato === "comercio" && " Como es un contrato comercial, se requieren documentos adicionales de la persona jurídica."}
                  </p>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 max-lg:grid-cols-1">
                    {docsChecklist.map((d) => (
                      <div key={d} className="flex items-start gap-2">
                        <span className="rounded-full shrink-0" style={{ width: 5, height: 5, backgroundColor: "var(--navy)", marginTop: 8 }} />
                        <span className="body-regular" style={{ color: "var(--gray-10)" }}>{d}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>Formato permitido: PDF, JPG o PNG.</span>
                    <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>Asegúrate de que los documentos sean claros y legibles.</span>
                    <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>El tamaño máximo por archivo es de 4MB.</span>
                    <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>Si un documento tiene varias páginas, sube un solo archivo en PDF en lugar de imágenes separadas.</span>
                  </div>

                  <div className="flex items-center gap-4 rounded-lg flex-wrap" style={{ backgroundColor: "var(--navy-light)", padding: "16px 20px" }}>
                    <Search size={18} style={{ color: "var(--navy)", flexShrink: 0 }} />
                    <div className="flex flex-col gap-0.5 flex-1 min-w-[220px]">
                      <span className="body-bold" style={{ color: "var(--navy)" }}>Desea buscar archivos por número de documento</span>
                      <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Puedes ver los documentos directamente a través del número de documento.</span>
                    </div>
                    <TextInput placeholder="Escriba aquí" value={busquedaDoc} onChange={setBusquedaDoc} className="min-w-[200px]" />
                    <AppButton variant="primary" bold><FileUp size={15} /> Buscar por documento</AppButton>
                  </div>

                  <Field label="Documentos (recuerda nombrarlos adecuadamente)">
                    <FileDropzone hint="Seleccione o arrastre aquí los archivos (Máx: 10MB)" />
                  </Field>

                  <Callout variant="info" title="Verifica tus documentos antes de enviarlos">
                    Asegúrate de que los documentos que estás subiendo sean los correctos y cumplan con los requisitos establecidos.
                    Si hay errores o falta algún documento, el equipo jurídico podría devolver la solicitud para correcciones, retrasando el proceso de aprobación.
                  </Callout>
                </div>
              </SectionCard>
            </>
          )}
        </>
      ) : stepIndex === 1 ? (
        <PasoPropietario />
      ) : stepIndex === 2 ? (
        <PasoInquilino />
      ) : (
        <section
          className="rounded-lg flex flex-col items-center justify-center gap-3 text-center"
          style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", minHeight: 320, padding: "24px 28px" }}
        >
          <ShieldCheck size={28} style={{ color: "var(--navy)" }} />
          <span className="title-tertiary-regular" style={{ color: "var(--navy)" }}>{STEPS[stepIndex].label}</span>
          <p className="body-regular" style={{ color: "var(--gray-8)" }}>Este paso está en construcción.</p>
        </section>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <LinkText onClick={onBack}>Cancelar contrato</LinkText>
        <div className="flex items-center gap-3">
          {stepIndex > 0 && <AppButton variant="secondary" bold onClick={goBack}>Paso anterior</AppButton>}
          <AppButton variant="primary" bold onClick={isLastStep ? onFinish : goNext}>
            {isLastStep ? "Finalizar" : "Siguiente paso"}
          </AppButton>
        </div>
      </div>

      <Footer />
    </div>
  );
}
