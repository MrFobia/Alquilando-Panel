import { useEffect, useRef, useState } from "react";
import {
  Home, Building2, Search, Droplets, Lightbulb, Flame,
  Wifi, Trash2, Sparkles, Plus, User, FolderSearch,
} from "lucide-react";
import { BackButton } from "./kit/BackButton";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { SelectInput } from "./kit/SelectInput";
import { TextInput } from "./kit/TextInput";
import { CurrencyInput } from "./kit/CurrencyInput";
import { DateInput } from "./kit/DateInput";
import { ToggleSwitch } from "./kit/ToggleSwitch";
import { FileDropzone } from "./kit/FileDropzone";
import { Callout } from "./kit/Callout";
import { Stepper } from "./kit/Stepper";
import type { StepStatus } from "./kit/Stepper";
import { Footer } from "./kit/Footer";
import { SegmentedControl } from "./kit/SegmentedControl";
import { StatusBadge } from "./kit/StatusBadge";
import { InfoField } from "./kit/InfoField";
import { QuantityStepper } from "./kit/QuantityStepper";
import { IconButton } from "./kit/IconButton";
import { Field } from "./kit/Field";
import { SectionCard } from "./kit/SectionCard";
import { ConfirmExitModal } from "./kit/ConfirmExitModal";
import { PasoPropietario } from "./PasoPropietario";
import type { PropietarioData } from "./PasoPropietario";
import { PasoInquilino } from "./PasoInquilino";
import type { InquilinoData } from "./PasoInquilino";
import { PasoCondiciones } from "./PasoCondiciones";
import { ContratoEnviado } from "./ContratoEnviado";
import { useAppData } from "../store/AppDataContext";

type TipoContrato = "vivienda" | "comercio";

export interface NuevoContratoResumen {
  direccion: string;
  inmueble: string;
  zona: string;
  inmobiliaria: string;
  tipo: "vivienda" | "comercial";
  propietario?: string;
  inquilino?: string;
}

interface Props {
  onBack: () => void;
  onFinish: () => void;
  onSubmit?: (data: NuevoContratoResumen) => void;
  onDirtyChange?: (guard: { onSave: () => void; onDiscard: () => void } | null) => void;
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
const OTROS_SERVICIOS_OPTIONS = ["Internet", "Aseo"].map((c) => ({ value: c, label: c }));
const TIPO_COPROPIEDAD_OPTIONS = ["Residencial", "Comercial", "Mixto"].map((c) => ({ value: c, label: c }));
const TIPO_GIRO_OPTIONS = ["Consignación", "Transferencia", "PSE"].map((c) => ({ value: c, label: c }));
const OTROS_SERVICIOS_COPROPIEDAD_OPTIONS = ["Vigilancia", "Parqueadero visitantes", "Zonas comunes"].map((c) => ({ value: c, label: c }));

const OTROS_SERVICIOS_ICONS: Record<string, React.ElementType> = {
  "Internet": Wifi,
  "Aseo": Sparkles,
};

interface ServicioExtra {
  id: string;
  label: string;
  cuenta: string;
  contador: string;
  compartido: boolean;
  porcentaje: string;
}
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
  "1234": {
    id: "1234",
    codigoSimi: "",
    direccion: "CL 86 # 11 - 50 AP 503 - BRR CHICO VIRREY",
    zona: "Norte",
    area: "130",
    tipo: "Apartamento",
    inmobiliaria: "Alquilando SAS",
  },
};

const DOCUMENTOS_REQUERIDOS_IZQUIERDA = [
  "Cédula arrendatario",
  "Cédula deudor solidario",
  "Rut inquilino",
  "Rut deudor solidario",
  "Certificado de existencia y representación legal de persona jurídica",
  "Cédula representante legal",
  "Rut sociedad",
  "Rut representante legal",
  "Certificado de tradición y libertad del inmueble",
  "Recibo de servicios públicos",
];

const DOCUMENTOS_REQUERIDOS_DERECHA = [
  "Comprobante de pago de servicios públicos",
  "Cuenta de cobro administración último mes",
  "Paz y salvo administración",
  "Escrituras del inmueble",
  "Permiso para el uso del suelo (Comercio)",
  "PDF aprobación de condiciones por parte del inquilino",
  "PDF aprobación de condiciones por parte del propietario",
  "Resultado de estudio de asegurabilidad",
  "Poderes (Sí aplica)",
];


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
                  <TextInput placeholder="Escriba aquí" value={item.numero} onChange={(v) => onItemChange(i, { numero: v })} className="w-full" error={attempted && !item.numero.trim()} />
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

function ServicioRow({
  icon: Icon, label, cuenta, contador, compartido, porcentaje, onCuenta, onContador, onCompartido, onPorcentaje, onRemove,
}: {
  icon: React.ElementType; label: string; cuenta: string; contador: string; compartido: boolean; porcentaje: string;
  onCuenta: (v: string) => void; onContador: (v: string) => void; onCompartido: (v: boolean) => void; onPorcentaje: (v: string) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-end gap-4 flex-wrap">
      <div className="flex items-center gap-2 rounded-lg shrink-0" style={{ backgroundColor: "var(--navy-light)", padding: "9px 14px", height: 40, width: 104 }}>
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
      {onRemove && (
        <div className="shrink-0" style={{ height: 40, display: "flex", alignItems: "center" }}>
          <IconButton icon={Trash2} title={`Eliminar ${label}`} onClick={onRemove} />
        </div>
      )}
    </div>
  );
}

export function CrearContrato({ onBack, onFinish, onSubmit, onDirtyChange }: Props) {
  const { findInmueble, propietarios, addPropietario, inquilinos, addInquilino } = useAppData();
  const [stepIndex, setStepIndexRaw] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const setStepIndex = (updater: number | ((i: number) => number)) => {
    setStepIndexRaw((prev) => {
      const next = typeof updater === "function" ? (updater as (i: number) => number)(prev) : updater;
      setMaxStepReached((m) => Math.max(m, next));
      return next;
    });
  };
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
    const registro = findInmueble(numeroBusqueda.trim()) ?? MOCK_INMUEBLES[numeroBusqueda.trim()];
    const match: InmuebleEncontrado | undefined = registro && "id" in registro && "codigoSimi" in registro
      ? (registro as InmuebleEncontrado)
      : registro
        ? { id: registro.id, codigoSimi: "", direccion: registro.direccion, zona: registro.zona, area: registro.metros, tipo: registro.tipo, inmobiliaria: registro.inmobiliaria }
        : undefined;
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
  const [tipoCopropiedad, setTipoCopropiedad] = useState("");
  const [valorAdminConDescuento, setValorAdminConDescuento] = useState("");
  const [valorAdminSinDescuento, setValorAdminSinDescuento] = useState("");
  const [fechaPagoAdminProntoPago, setFechaPagoAdminProntoPago] = useState("");
  const [fechaPagoAdmin2, setFechaPagoAdmin2] = useState("");
  const [fechaPagoAdmin3, setFechaPagoAdmin3] = useState("");
  const [correoCopropiedad, setCorreoCopropiedad] = useState("");
  const [telefonoCopropiedad, setTelefonoCopropiedad] = useState("");
  const [razonSocialCopropiedad, setRazonSocialCopropiedad] = useState("");
  const [nitCopropiedad, setNitCopropiedad] = useState("");
  const [tipoGiroCopropiedad, setTipoGiroCopropiedad] = useState("");
  const [otroServicioCopropiedad, setOtroServicioCopropiedad] = useState("");
  const [serviciosCopropiedadExtra, setServiciosCopropiedadExtra] = useState<string[]>([]);
  const [attemptedStep0, setAttemptedStep0] = useState(false);

  const otrosServiciosCopropiedadDisponibles = OTROS_SERVICIOS_COPROPIEDAD_OPTIONS.filter(
    (o) => !serviciosCopropiedadExtra.includes(o.value)
  );

  const agregarServicioCopropiedadExtra = () => {
    if (!otroServicioCopropiedad.trim()) return;
    setServiciosCopropiedadExtra((prev) => [...prev, otroServicioCopropiedad]);
    setOtroServicioCopropiedad("");
  };

  const quitarServicioCopropiedadExtra = (label: string) => setServiciosCopropiedadExtra((prev) => prev.filter((s) => s !== label));

  const copropiedadInvalid = copropiedad && (
    !tipoCopropiedad || !valorAdminConDescuento || !valorAdminSinDescuento ||
    !fechaPagoAdminProntoPago || !fechaPagoAdmin2 ||
    !razonSocialCopropiedad || !nitCopropiedad || !tipoGiroCopropiedad
  );

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
  const [serviciosExtra, setServiciosExtra] = useState<ServicioExtra[]>([]);

  const otrosServiciosDisponibles = OTROS_SERVICIOS_OPTIONS.filter(
    (o) => !serviciosExtra.some((s) => s.label === o.value)
  );

  const agregarServicioExtra = () => {
    if (!otroServicio.trim()) return;
    setServiciosExtra((prev) => [
      ...prev,
      { id: `${otroServicio}-${Date.now()}`, label: otroServicio, cuenta: "", contador: "", compartido: false, porcentaje: "" },
    ]);
    setOtroServicio("");
  };

  const quitarServicioExtra = (id: string) => setServiciosExtra((prev) => prev.filter((s) => s.id !== id));

  const actualizarServicioExtra = (id: string, patch: Partial<ServicioExtra>) =>
    setServiciosExtra((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const [documentosGenerales, setDocumentosGenerales] = useState<File[]>([]);
  const agregarDocumentosGenerales = (files: File[]) => setDocumentosGenerales((prev) => [...prev, ...files]);
  const quitarDocumentoGeneral = (index: number) => setDocumentosGenerales((prev) => prev.filter((_, i) => i !== index));
  const [buscarDocumentoNumero, setBuscarDocumentoNumero] = useState("");

  const [certificadoLibertadTradicion, setCertificadoLibertadTradicion] = useState<File[]>([]);
  const [liquidacionInicial, setLiquidacionInicial] = useState<File[]>([]);
  const documentosIncompletos = certificadoLibertadTradicion.length === 0 || liquidacionInicial.length === 0;

  const direccionCompleta = [
    tipoVia && `${tipoVia} ${numeroVia}${letraVia ? ` ${letraVia}` : ""}${bisVia ? " BIS" : ""}${cardinalVia ? ` ${cardinalVia}` : ""}`,
    numeroCruce && `# ${numeroCruce}${cardinalCruce ? ` ${cardinalCruce}` : ""}`,
    numeroPlaca && `- ${numeroPlaca}`,
    complemento,
    conjunto && `CONJ. ${conjunto}`,
    barrio && `BRR ${barrio}`,
  ].filter(Boolean).join(" ");

  const showRestOfForm = origen === "nuevo" || busquedaEstado === "found";

  const tipoInmuebleOptions = tipoContrato === "vivienda" ? TIPO_INMUEBLE_VIVIENDA : TIPO_INMUEBLE_COMERCIO;

  const inmuebleSinSeleccionar = origen === "portafolio" && busquedaEstado !== "found";

  const nuevoInmuebleInvalid = origen === "nuevo" && (
    !inmobiliaria || !tipoInmueble || !matricula || !chip ||
    !ciudad || !localidad || !tipoVia || !numeroVia || !numeroCruce || !numeroPlaca || !barrio || !zona
  );

  const especificacionesInvalid =
    (tipoContrato === "vivienda" && !estrato) ||
    (tipoContrato === "comercio" && !usoComercial) ||
    (garajeTiene && (!garajeCantidad || garajeItems.some((it) => !it.numero.trim()))) ||
    (depositoTiene && (!depositoCantidad || depositoItems.some((it) => !it.numero.trim())));

  const step0Invalid = inmuebleSinSeleccionar || nuevoInmuebleInvalid || (showRestOfForm && (especificacionesInvalid || copropiedadInvalid));

  const idleBannerRef = useRef<HTMLDivElement>(null);
  const nuevoBannerRef = useRef<HTMLDivElement>(null);
  const specBannerRef = useRef<HTMLDivElement>(null);

  const goNext = () => {
    if (stepIndex === 0) {
      setAttemptedStep0(true);
      if (step0Invalid) {
        setTimeout(() => {
          const target = nuevoBannerRef.current ?? idleBannerRef.current ?? specBannerRef.current;
          target?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 0);
        return;
      }
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));
  const isLastStep = stepIndex === STEPS.length - 1;

  const [propietarioValido, setPropietarioValido] = useState(false);
  const [inquilinoValido, setInquilinoValido] = useState(false);
  const [condicionesValido, setCondicionesValido] = useState(false);
  const [propietarioData, setPropietarioData] = useState<PropietarioData | null>(null);
  const [inquilinoData, setInquilinoData] = useState<InquilinoData | null>(null);

  const stepStatus: StepStatus[] = [
    step0Invalid ? "incomplete" : "complete",
    propietarioValido ? "complete" : "incomplete",
    inquilinoValido ? "complete" : "incomplete",
    condicionesValido ? "complete" : "incomplete",
    documentosIncompletos ? "incomplete" : "complete",
  ];

  const goToStep = (i: number) => {
    if (i <= maxStepReached) setStepIndex(i);
  };

  const pasosIncompletos = [
    step0Invalid && "Inmueble",
    !propietarioValido && "Propietario",
    !inquilinoValido && "Inquilino",
    !condicionesValido && "Condiciones",
    documentosIncompletos && "Documentos",
  ].filter((p): p is string => !!p);

  const [enviado, setEnviado] = useState(false);
  const [codigoSolicitud, setCodigoSolicitud] = useState("");

  const buildResumen = (): NuevoContratoResumen => {
    let nombrePropietario = propietarioData?.nombre || "-";
    if (propietarioData && propietarioData.origen === "nuevo" && propietarioData.numeroDocumento) {
      const registrado = addPropietario({
        tipoDocumento: propietarioData.tipoDocumento,
        numeroDocumento: propietarioData.numeroDocumento,
        nombre: propietarioData.nombre,
        correo: propietarioData.correo,
        telefono: propietarioData.telefono,
        direccion: propietarioData.direccion,
      });
      nombrePropietario = registrado.nombre;
    }

    let nombreInquilino = inquilinoData?.nombre || "-";
    if (inquilinoData && inquilinoData.origen === "nuevo" && inquilinoData.numeroDocumento) {
      const registrado = addInquilino({
        tipoDocumento: inquilinoData.tipoDocumento,
        numeroDocumento: inquilinoData.numeroDocumento,
        nombre: inquilinoData.nombre,
        correo: inquilinoData.correo,
        telefono: inquilinoData.telefono,
        direccion: inquilinoData.direccion,
      });
      nombreInquilino = registrado.nombre;
    }

    return {
      direccion: direccionCompleta || inmuebleEncontrado?.direccion || "-",
      inmueble: inmuebleEncontrado?.tipo || tipoInmueble || "-",
      zona: zona || inmuebleEncontrado?.zona || "-",
      inmobiliaria: inmobiliaria || inmuebleEncontrado?.inmobiliaria || "Alquilando SAS",
      tipo: tipoContrato === "vivienda" ? "vivienda" : "comercial",
      propietario: nombrePropietario,
      inquilino: nombreInquilino,
    };
  };

  const saveDraft = () => onSubmit?.(buildResumen());

  const [showExitModal, setShowExitModal] = useState(false);
  const guardRef = useRef({ onSave: saveDraft, onDiscard: () => {} });
  guardRef.current = { onSave: saveDraft, onDiscard: () => {} };

  useEffect(() => {
    onDirtyChange?.({
      onSave: () => guardRef.current.onSave(),
      onDiscard: () => guardRef.current.onDiscard(),
    });
    return () => onDirtyChange?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnviarAprobacion = () => {
    onSubmit?.(buildResumen());
    setCodigoSolicitud(`SOL-${Date.now().toString().slice(-6)}`);
    setEnviado(true);
  };

  if (enviado) {
    return <ContratoEnviado codigo={codigoSolicitud} onVolver={onFinish} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <BackButton onClick={() => setShowExitModal(true)} />

      <ConfirmExitModal
        open={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onSaveExit={() => { saveDraft(); setShowExitModal(false); onFinish(); }}
        onDiscard={() => { setShowExitModal(false); onBack(); }}
      />

      <section
        className="rounded-lg flex items-center justify-between gap-6 flex-wrap"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 28px" }}
      >
        <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>Creación de contrato</h1>
        <Stepper steps={STEPS} current={stepIndex} status={stepStatus} maxReached={maxStepReached} onStepClick={goToStep} />
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

                  {busquedaEstado === "idle" && attemptedStep0 && (
                    <div ref={idleBannerRef}>
                      <Callout variant="error" title="Debes buscar y seleccionar un inmueble antes de continuar.">
                        <span style={{ color: "var(--red-status)" }}>
                          Usa el buscador para encontrar el inmueble del portafolio con el que quieres crear el contrato.
                        </span>
                      </Callout>
                    </div>
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
                  {attemptedStep0 && nuevoInmuebleInvalid && (
                    <div ref={nuevoBannerRef}>
                      <Callout variant="error" title="Completa los campos obligatorios del inmueble antes de continuar.">
                        <span style={{ color: "var(--red-status)" }}>
                          Revisa los campos marcados en rojo: son requeridos para crear el contrato.
                        </span>
                      </Callout>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>General</span>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
                      <Field label="Inmobiliaria" required error={attemptedStep0 && !inmobiliaria}><SelectInput options={INMOBILIARIA_OPTIONS} value={inmobiliaria} onChange={setInmobiliaria} className="w-full" error={attemptedStep0 && !inmobiliaria} /></Field>
                      <Field label="Tipo de inmueble" required error={attemptedStep0 && !tipoInmueble}><SelectInput options={tipoInmuebleOptions} value={tipoInmueble} onChange={setTipoInmueble} className="w-full" error={attemptedStep0 && !tipoInmueble} /></Field>
                      <Field label="Área construida (mts)"><TextInput placeholder="Escriba aquí" value={area} onChange={setArea} className="w-full" /></Field>
                      <Field label="Número de matrícula inmobiliaria" required error={attemptedStep0 && !matricula}><TextInput placeholder="Escriba aquí" value={matricula} onChange={setMatricula} className="w-full" error={attemptedStep0 && !matricula} /></Field>
                      <Field label="Número de chip" required error={attemptedStep0 && !chip}><TextInput placeholder="Escriba aquí" value={chip} onChange={setChip} className="w-full" error={attemptedStep0 && !chip} /></Field>
                      <Field label="Cédula catastral (Opcional)"><TextInput placeholder="Escriba aquí" value={catastral} onChange={setCatastral} className="w-full" /></Field>
                    </div>
                  </div>

                  <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

                  <div className="flex flex-col gap-4">
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>Dirección</span>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
                      <Field label="Ciudad" required error={attemptedStep0 && !ciudad}><SelectInput options={CIUDAD_OPTIONS} value={ciudad} onChange={setCiudad} className="w-full" error={attemptedStep0 && !ciudad} /></Field>
                      <Field label="Localidad" required error={attemptedStep0 && !localidad}><SelectInput options={LOCALIDAD_OPTIONS} value={localidad} onChange={setLocalidad} className="w-full" error={attemptedStep0 && !localidad} /></Field>
                    </div>

                    <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>Vía principal (antes del #)</span>
                    <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-2">
                      <Field label="Tipo de vía" required error={attemptedStep0 && !tipoVia}><SelectInput options={TIPO_VIA_OPTIONS} value={tipoVia} onChange={setTipoVia} className="w-full" error={attemptedStep0 && !tipoVia} /></Field>
                      <Field label="Número" required error={attemptedStep0 && !numeroVia}><TextInput placeholder="Escriba aquí" value={numeroVia} onChange={setNumeroVia} className="w-full" error={attemptedStep0 && !numeroVia} /></Field>
                      <Field label="Letra (Opcional)"><SelectInput options={LETRA_OPTIONS} value={letraVia} onChange={setLetraVia} className="w-full" /></Field>
                      <Field label="Bis (Opcional)"><SelectInput options={[{ value: "si", label: "Sí" }]} value={bisVia} onChange={setBisVia} className="w-full" /></Field>
                      <Field label="Cardinal (Opcional)"><SelectInput options={CARDINAL_OPTIONS} value={cardinalVia} onChange={setCardinalVia} className="w-full" /></Field>
                    </div>

                    <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>Número de intersección (después del #)</span>
                    <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2">
                      <Field label="Número de cruce" required error={attemptedStep0 && !numeroCruce}><TextInput placeholder="Escriba aquí" value={numeroCruce} onChange={setNumeroCruce} className="w-full" error={attemptedStep0 && !numeroCruce} /></Field>
                      <Field label="Cardinal (Opcional)"><SelectInput options={CARDINAL_OPTIONS} value={cardinalCruce} onChange={setCardinalCruce} className="w-full" /></Field>
                      <Field label="Número de placa (después del -)" required error={attemptedStep0 && !numeroPlaca}><TextInput placeholder="Escriba aquí" value={numeroPlaca} onChange={setNumeroPlaca} className="w-full" error={attemptedStep0 && !numeroPlaca} /></Field>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
                      <Field label="Complemento (Apto / Torre / Interior)"><TextInput placeholder="Escriba aquí" value={complemento} onChange={setComplemento} className="w-full" /></Field>
                      <Field label="Conjunto (Opcional)"><TextInput placeholder="Escriba aquí" value={conjunto} onChange={setConjunto} className="w-full" /></Field>
                      <Field label="Barrio" required error={attemptedStep0 && !barrio}><SelectInput options={BARRIO_OPTIONS} value={barrio} onChange={setBarrio} className="w-full" error={attemptedStep0 && !barrio} /></Field>
                      <Field label="Zona" required error={attemptedStep0 && !zona}><SelectInput options={ZONA_OPTIONS} value={zona} onChange={setZona} className="w-full" error={attemptedStep0 && !zona} /></Field>
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

                  {attemptedStep0 && especificacionesInvalid && (
                    <div ref={specBannerRef}>
                      <Callout variant="error" title="Completa los campos obligatorios antes de continuar.">
                        <span style={{ color: "var(--red-status)" }}>
                          Revisa los campos marcados en rojo en Especificaciones: son requeridos para crear el contrato.
                        </span>
                      </Callout>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>Especificaciones</span>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-4 max-lg:grid-cols-1">
                      {tipoContrato === "vivienda" ? (
                        <Field label="Estrato" required error={attemptedStep0 && !estrato}><SelectInput options={ESTRATO_OPTIONS} value={estrato} onChange={setEstrato} className="w-full" error={attemptedStep0 && !estrato} /></Field>
                      ) : (
                        <>
                          <Field label="Uso comercial" required error={attemptedStep0 && !usoComercial}><SelectInput options={USO_COMERCIAL_OPTIONS} value={usoComercial} onChange={setUsoComercial} className="w-full" error={attemptedStep0 && !usoComercial} /></Field>
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
                <div className="flex flex-col gap-5">
                  <ToggleSwitch checked={copropiedad} onChange={setCopropiedad} label="Copropiedad" />
                  {copropiedad && (
                    <>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <Field label="Tipo de copropiedad" required error={attemptedStep0 && !tipoCopropiedad}>
                          <SelectInput options={TIPO_COPROPIEDAD_OPTIONS} value={tipoCopropiedad} onChange={setTipoCopropiedad} className="w-full" error={attemptedStep0 && !tipoCopropiedad} />
                        </Field>
                        <Field label="Valor de administración (con descuento)" required error={attemptedStep0 && !valorAdminConDescuento}>
                          <CurrencyInput placeholder="Escriba aquí" value={valorAdminConDescuento} onChange={setValorAdminConDescuento} className="w-full" error={attemptedStep0 && !valorAdminConDescuento} />
                        </Field>
                        <Field label="Valor de administración (sin descuento)" required error={attemptedStep0 && !valorAdminSinDescuento}>
                          <CurrencyInput placeholder="Escriba aquí" value={valorAdminSinDescuento} onChange={setValorAdminSinDescuento} className="w-full" error={attemptedStep0 && !valorAdminSinDescuento} />
                        </Field>
                        <Field label="Fecha de pago de la administración (Pronto pago)" required error={attemptedStep0 && !fechaPagoAdminProntoPago}>
                          <DateInput value={fechaPagoAdminProntoPago} onChange={setFechaPagoAdminProntoPago} className="w-full" />
                        </Field>
                        <Field label="Fecha de pago de la administración 2" required error={attemptedStep0 && !fechaPagoAdmin2}>
                          <DateInput value={fechaPagoAdmin2} onChange={setFechaPagoAdmin2} className="w-full" />
                        </Field>
                        <Field label="Fecha de pago de la administración 3">
                          <DateInput value={fechaPagoAdmin3} onChange={setFechaPagoAdmin3} className="w-full" />
                        </Field>
                        <Field label="Correo electrónico copropiedad">
                          <TextInput placeholder="Escriba aquí" value={correoCopropiedad} onChange={setCorreoCopropiedad} className="w-full" />
                        </Field>
                        <Field label="Teléfono copropiedad">
                          <TextInput placeholder="Escriba aquí" value={telefonoCopropiedad} onChange={setTelefonoCopropiedad} className="w-full" />
                        </Field>
                      </div>

                      <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

                      <p className="body-bold" style={{ color: "var(--gray-10)" }}>Pagos de administración</p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <Field label="Razón social" required error={attemptedStep0 && !razonSocialCopropiedad}>
                          <TextInput placeholder="Escriba aquí" value={razonSocialCopropiedad} onChange={setRazonSocialCopropiedad} className="w-full" error={attemptedStep0 && !razonSocialCopropiedad} />
                        </Field>
                        <Field label="Nit" required error={attemptedStep0 && !nitCopropiedad}>
                          <TextInput placeholder="Escriba aquí" value={nitCopropiedad} onChange={setNitCopropiedad} className="w-full" error={attemptedStep0 && !nitCopropiedad} />
                        </Field>
                        <Field label="Tipo de giro" required error={attemptedStep0 && !tipoGiroCopropiedad}>
                          <SelectInput options={TIPO_GIRO_OPTIONS} value={tipoGiroCopropiedad} onChange={setTipoGiroCopropiedad} className="w-full" error={attemptedStep0 && !tipoGiroCopropiedad} />
                        </Field>
                      </div>

                      <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

                      <p className="body-bold" style={{ color: "var(--gray-10)" }}>Servicios copropiedad</p>
                      <Field label="Agregar otros servicios">
                        <div className="flex items-center gap-3 flex-wrap">
                          <SelectInput options={otrosServiciosCopropiedadDisponibles} value={otroServicioCopropiedad} onChange={setOtroServicioCopropiedad} className="w-full max-w-[320px]" />
                          <AppButton variant="secondary" bold onClick={agregarServicioCopropiedadExtra} disabled={!otroServicioCopropiedad}>
                            <Plus size={15} /> Agregar
                          </AppButton>
                        </div>
                      </Field>
                      {serviciosCopropiedadExtra.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {serviciosCopropiedadExtra.map((label) => (
                            <span
                              key={label}
                              className="body-regular inline-flex items-center gap-2"
                              style={{
                                border: "1px solid var(--gray-5)",
                                borderRadius: "var(--radius-md)",
                                padding: "6px 10px",
                                color: "var(--gray-10)",
                              }}
                            >
                              {label}
                              <button type="button" onClick={() => quitarServicioCopropiedadExtra(label)} aria-label={`Quitar ${label}`}>
                                <Trash2 size={14} style={{ color: "var(--gray-8)" }} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </>
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

                  {serviciosExtra.length > 0 && (
                    <>
                      <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />
                      {serviciosExtra.map((s) => (
                        <ServicioRow
                          key={s.id}
                          icon={OTROS_SERVICIOS_ICONS[s.label] ?? Plus} label={s.label}
                          cuenta={s.cuenta} contador={s.contador} compartido={s.compartido} porcentaje={s.porcentaje}
                          onCuenta={(v) => actualizarServicioExtra(s.id, { cuenta: v })}
                          onContador={(v) => actualizarServicioExtra(s.id, { contador: v })}
                          onCompartido={(v) => actualizarServicioExtra(s.id, { compartido: v })}
                          onPorcentaje={(v) => actualizarServicioExtra(s.id, { porcentaje: v })}
                          onRemove={() => quitarServicioExtra(s.id)}
                        />
                      ))}
                    </>
                  )}

                  <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

                  <Field label="Agregar otros servicios">
                    <div className="flex items-center gap-3 flex-wrap">
                      <SelectInput options={otrosServiciosDisponibles} value={otroServicio} onChange={setOtroServicio} className="w-full max-w-[320px]" />
                      <AppButton variant="secondary" bold onClick={agregarServicioExtra} disabled={!otroServicio}>
                        <Plus size={15} /> Agregar
                      </AppButton>
                    </div>
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Documentos">
                <div className="flex flex-col gap-5">
                  <p className="body-regular" style={{ color: "var(--gray-9)" }}>
                    Sube aquí los documentos necesarios para la elaboración de tu contrato de arrendamiento.
                  </p>

                  <div className="grid grid-cols-2 gap-x-10 gap-y-1 max-lg:grid-cols-1">
                    <ul className="list-disc pl-5 flex flex-col gap-1">
                      {DOCUMENTOS_REQUERIDOS_IZQUIERDA.map((d) => (
                        <li key={d} className="body-regular" style={{ color: "var(--gray-10)" }}>{d}</li>
                      ))}
                    </ul>
                    <ul className="list-disc pl-5 flex flex-col gap-1">
                      {DOCUMENTOS_REQUERIDOS_DERECHA.map((d) => (
                        <li key={d} className="body-regular" style={{ color: "var(--gray-10)" }}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col">
                    <p className="body-small-regular" style={{ color: "var(--gray-8)" }}>Formato permitido: PDF, JPG o PNG.</p>
                    <p className="body-small-regular" style={{ color: "var(--gray-8)" }}>Asegúrate de que los documentos sean claros y legibles.</p>
                    <p className="body-small-regular" style={{ color: "var(--gray-8)" }}>El tamaño máximo por archivo es de 4MB.</p>
                    <p className="body-small-regular" style={{ color: "var(--gray-8)" }}>Si un documento tiene varias páginas, sube un solo archivo en PDF en lugar de imágenes separadas.</p>
                  </div>

                  <div className="flex items-center gap-4 rounded-lg flex-wrap" style={{ backgroundColor: "var(--navy-light)", padding: 16 }}>
                    <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: 40, height: 40, backgroundColor: "#ffffff" }}>
                      <User size={18} style={{ color: "var(--navy)" }} />
                    </div>
                    <div className="flex flex-col" style={{ minWidth: 220 }}>
                      <span className="body-bold" style={{ color: "var(--navy)" }}>Desea buscar archivos por número de documento</span>
                      <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Puedes ver los documentos directamente a través del número de documento.</span>
                    </div>
                    <TextInput placeholder="Escriba aquí" value={buscarDocumentoNumero} onChange={setBuscarDocumentoNumero} className="w-full max-w-[220px]" />
                    <AppButton variant="primary" bold onClick={() => {}}>
                      <FolderSearch size={15} /> Buscar por documento
                    </AppButton>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="body-bold" style={{ color: "var(--navy)" }}>Documentos (recuerda nombrarlos adecuadamente)</span>
                    <FileDropzone
                      hint="Seleccione o arrastre aquí los archivos (Máx: 10MB)"
                      files={documentosGenerales}
                      onFiles={agregarDocumentosGenerales}
                      onRemove={quitarDocumentoGeneral}
                    />
                  </div>

                  <Callout variant="info" title="Verifica tus documentos antes de enviarlos">
                    Asegúrate de que los documentos que estás subiendo sean los correctos y cumplan con los requisitos establecidos. Si hay errores o falta algún documento, el equipo jurídico podría devolver la solicitud para correcciones, retrasando el proceso de aprobación.
                  </Callout>
                </div>
              </SectionCard>
            </>
          )}
        </>
      ) : null}

      <div style={{ display: stepIndex === 1 ? "contents" : "none" }}>
        <PasoPropietario onValidityChange={setPropietarioValido} onDataChange={setPropietarioData} existentes={propietarios} />
      </div>
      <div style={{ display: stepIndex === 2 ? "contents" : "none" }}>
        <PasoInquilino onValidityChange={setInquilinoValido} onDataChange={setInquilinoData} existentes={inquilinos} />
      </div>
      <div style={{ display: stepIndex === 3 ? "contents" : "none" }}>
        <PasoCondiciones onValidityChange={setCondicionesValido} />
      </div>

      {stepIndex === 4 && (
        <SectionCard title="Documentos asociados">
          <div className="flex flex-col gap-5">
            <Field label="Certificado de libertad y tradición" required>
              <FileDropzone
                hint="Elegir archivo"
                compact
                files={certificadoLibertadTradicion}
                onFiles={(files) => setCertificadoLibertadTradicion([files[files.length - 1]])}
                onRemove={() => setCertificadoLibertadTradicion([])}
              />
            </Field>

            <Field label="Liquidación Inicial" required>
              <FileDropzone
                hint="Elegir archivo"
                compact
                files={liquidacionInicial}
                onFiles={(files) => setLiquidacionInicial([files[files.length - 1]])}
                onRemove={() => setLiquidacionInicial([])}
              />
            </Field>

            <Callout variant="info" title="Verifica tus documentos antes de enviarlos">
              Asegúrate de que los documentos que estás subiendo sean los correctos y cumplan con los requisitos establecidos. Si hay errores o falta algún documento, el equipo jurídico podría devolver la solicitud para correcciones, retrasando el proceso de aprobación.
            </Callout>
          </div>
        </SectionCard>
      )}

      {isLastStep && pasosIncompletos.length > 0 && (
        <Callout variant="error" title="Faltan pasos por completar antes de enviar a aprobación.">
          Faltan datos obligatorios en: {pasosIncompletos.join(", ")}. Usa el stepper de arriba para volver a esos pasos y completarlos.
        </Callout>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <LinkText onClick={onBack}>Cancelar contrato</LinkText>
        <div className="flex items-center gap-3">
          {stepIndex > 0 && <AppButton variant="secondary" bold onClick={goBack}>Paso anterior</AppButton>}
          <AppButton
            variant="primary"
            bold
            disabled={isLastStep && pasosIncompletos.length > 0}
            onClick={isLastStep ? handleEnviarAprobacion : goNext}
          >
            {isLastStep ? "Enviar a aprobación" : "Siguiente paso"}
          </AppButton>
        </div>
      </div>

      <Footer />
    </div>
  );
}
