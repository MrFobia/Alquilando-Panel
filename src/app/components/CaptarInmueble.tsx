import { Fragment, useEffect, useRef, useState } from "react";
import { Home, Building2, Briefcase, Store, Warehouse, AlertCircle, Send, PenLine, CheckCircle2 } from "lucide-react";
import { BackButton } from "./kit/BackButton";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { SelectInput } from "./kit/SelectInput";
import { TextInput } from "./kit/TextInput";
import { CurrencyInput } from "./kit/CurrencyInput";
import { ToggleSwitch } from "./kit/ToggleSwitch";
import { SegmentedControl } from "./kit/SegmentedControl";
import { FileDropzone } from "./kit/FileDropzone";
import { Callout } from "./kit/Callout";
import { Stepper } from "./kit/Stepper";
import type { StepStatus } from "./kit/Stepper";
import { Footer } from "./kit/Footer";
import { Field } from "./kit/Field";
import { SubHeading } from "./kit/SubHeading";
import { SectionCard } from "./kit/SectionCard";
import { Checkbox } from "./kit/Checkbox";
import { Radio } from "./kit/Radio";
import { Textarea } from "./kit/Textarea";
import { TagInput } from "./kit/TagInput";
import { ConfirmExitModal } from "./kit/ConfirmExitModal";
import { InmuebleCaptado } from "./InmuebleCaptado";

type TipoInmueble = "apartamento" | "casa" | "oficina" | "local" | "bodega";

const TIPO_INMUEBLE_OPTIONS: { value: TipoInmueble; label: string; icon: typeof Home }[] = [
  { value: "apartamento", label: "Apartamento", icon: Building2 },
  { value: "casa", label: "Casa", icon: Home },
  { value: "oficina", label: "Oficina", icon: Briefcase },
  { value: "local", label: "Local", icon: Store },
  { value: "bodega", label: "Bodega", icon: Warehouse },
];

const TIPO_DOCUMENTO_OPTIONS = ["Cédula de ciudadanía", "Cédula de extranjería", "NIT", "Pasaporte"].map((v) => ({ value: v, label: v }));
const CIUDAD_OPTIONS = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Chiquinquirá"].map((v) => ({ value: v, label: v }));
const BARRIO_OPTIONS = ["Chicó", "El Poblado", "Santa Bárbara", "Modelia", "12 de Octubre", "Centro"].map((v) => ({ value: v, label: v }));
const CALIFICACION_OPTIONS = [
  "1 Estrella (Malo)", "2 Estrellas (Regular)", "3 Estrellas (Bueno)", "4 Estrellas (Muy bueno)", "5 Estrellas (Excelente)",
].map((v) => ({ value: v, label: v }));
const NUMERO_GARAJES_OPTIONS = Array.from({ length: 10 }, (_, i) => String(i + 1)).map((v) => ({ value: v, label: v }));
const NUMERO_AMBIENTES_OPTIONS = Array.from({ length: 6 }, (_, i) => String(i + 1)).map((v) => ({ value: v, label: v }));

const LOCALIDAD_OPTIONS = ["Chapinero", "Usaquén", "Suba", "Kennedy", "Engativá", "Fontibón"].map((v) => ({ value: v, label: v }));
const TIPO_VIA_OPTIONS = ["Calle", "Carrera", "Avenida", "Transversal", "Diagonal"].map((v) => ({ value: v, label: v }));
const CARDINAL_OPTIONS = ["Norte", "Sur", "Este", "Oeste"].map((v) => ({ value: v, label: v }));
const LETRA_OPTIONS = ["A", "B", "C", "D"].map((v) => ({ value: v, label: v }));
const BIS_OPTIONS = [{ value: "si", label: "Sí" }];
const COMPLEMENTO_TIPO_OPTIONS = ["Apartamento", "Casa", "Torre", "Interior", "Bloque", "Local", "Oficina", "Bodega"].map((v) => ({ value: v, label: v }));
const ZONA_OPTIONS = ["Norte", "Sur", "Occidente", "Oriente", "Centro"].map((v) => ({ value: v, label: v }));
const ESTRATO_OPTIONS = ["1", "2", "3", "4", "5", "6"].map((v) => ({ value: v, label: v }));
const UBICACION_LLAVES_OPTIONS = ["Portería", "Oficina Alquilando", "Propietario", "Administración", "Otro"].map((v) => ({ value: v, label: v }));

const ESTADO_INMUEBLE_OPTIONS = ["En construcción", "Estrenar", "Obra gris", "Obra blanca", "Remodelación", "En buen estado"];

interface Plan {
  id: string;
  nombre: string;
  resumen: string;
  detalle: string;
}

const PLANES: Plan[] = [
  { id: "alquiexpress", nombre: "AlquiExpress", resumen: "1 canon de alquiler", detalle: "Póliza Individual de Seguro Alquiler" },
  { id: "alquiplus", nombre: "AlquiPlus", resumen: "4% del canon Administración + IVA", detalle: "Póliza Colectiva de Alquiler* 2.57% IVA incluido — pago mes a mes. Amparo integral: $125.000 pago anual" },
  { id: "alquilando", nombre: "Alquilando", resumen: "20% del primer canon de alquiler", detalle: "8% sobre el valor del canon y administración + IVA. Póliza Colectiva de Alquiler* 2.57% IVA incluido — pago mes a mes. Amparo integral: $125.000 pago anual" },
  { id: "alquielite", nombre: "AlquiElite", resumen: "20% del primer canon de alquiler", detalle: "10% sobre el valor del canon y administración + IVA. Póliza Colectiva de Alquiler* 2.57% IVA incluido — pago mes a mes. Amparo integral: $125.000 pago anual" },
];

const STEPS = [
  { id: "propietario-edificio", label: "Propietario y edificio" },
  { id: "inmueble-caracteristicas", label: "Inmueble y características" },
  { id: "planes-terminos", label: "Planes y términos" },
];

function useCheckboxGroup(initial: string[] = []) {
  const [set, setSet] = useState<Set<string>>(new Set(initial));
  const toggle = (item: string) => setSet((prev) => {
    const next = new Set(prev);
    if (next.has(item)) next.delete(item); else next.add(item);
    return next;
  });
  return { has: (item: string) => set.has(item), toggle };
}

function CheckboxRows({ rows, group }: { rows: [string, string?][]; group: ReturnType<typeof useCheckboxGroup> }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3 max-lg:grid-cols-1">
      {rows.map(([left, right]) => (
        <Fragment key={left}>
          <Checkbox checked={group.has(left)} onChange={() => group.toggle(left)} label={left} />
          {right && <Checkbox checked={group.has(right)} onChange={() => group.toggle(right)} label={right} />}
        </Fragment>
      ))}
    </div>
  );
}

export interface NuevoInmuebleResumen {
  direccion: string;
  ciudad: string;
  zona: string;
  metros: string;
  tipo: string;
}

interface Props {
  onBack: () => void;
  onFinish: () => void;
  onSubmit?: (data: NuevoInmuebleResumen) => void;
  onSaveDraft?: (data: NuevoInmuebleResumen) => void;
  onDiscard?: () => void;
  onDirtyChange?: (guard: { onSave: () => void; onDiscard: () => void } | null) => void;
}

export function CaptarInmueble({ onBack, onFinish, onSubmit, onSaveDraft, onDiscard, onDirtyChange }: Props) {
  const [tipoInmueble, setTipoInmueble] = useState<TipoInmueble>("apartamento");

  const [stepIndex, setStepIndexRaw] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const setStepIndex = (updater: number | ((i: number) => number)) => {
    setStepIndexRaw((prev) => {
      const next = typeof updater === "function" ? (updater as (i: number) => number)(prev) : updater;
      setMaxStepReached((m) => Math.max(m, next));
      return next;
    });
  };
  const goNext = () => {
    if (stepIndex === 0) {
      setAttemptedStep0(true);
      if (step0Invalid) return;
    }
    if (stepIndex === 1) {
      setAttemptedStep1(true);
      if (step1Invalid) return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const buildResumen = (): NuevoInmuebleResumen => ({
    direccion: direccionCompletaInmueble || "-",
    ciudad: ciudadInmueble || "-",
    zona: zonaInmueble || "-",
    metros: areaConstruida || "-",
    tipo: TIPO_INMUEBLE_OPTIONS.find((o) => o.value === tipoInmueble)?.label ?? "-",
  });

  const saveDraft = () => (onSaveDraft ?? onSubmit)?.(buildResumen());

  const [showExitModal, setShowExitModal] = useState(false);
  const guardRef = useRef({ onSave: saveDraft, onDiscard: () => onDiscard?.() });
  guardRef.current = { onSave: saveDraft, onDiscard: () => onDiscard?.() };

  useEffect(() => {
    onDirtyChange?.({
      onSave: () => guardRef.current.onSave(),
      onDiscard: () => guardRef.current.onDiscard(),
    });
    return () => onDirtyChange?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinalizar = () => {
    setAttemptedStep2(true);
    if (step2Invalid) return;
    onSubmit?.(buildResumen());
    setCodigoInmueble(`INM-${Date.now().toString().slice(-6)}`);
    setEnviado(true);
  };
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));
  const goToStep = (i: number) => { if (i <= maxStepReached) setStepIndex(i); };
  const isLastStep = stepIndex === STEPS.length - 1;

  const esApartamento = tipoInmueble === "apartamento";
  const esConZonasComunes = tipoInmueble === "apartamento" || tipoInmueble === "casa";

  const [origenPropietario, setOrigenPropietario] = useState<"existente" | "nuevo">("nuevo");
  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [barrio, setBarrio] = useState("");

  const [propiedadOcupada, setPropiedadOcupada] = useState(true);
  const [citaPrevia, setCitaPrevia] = useState(false);

  const publicidad = useCheckboxGroup(["Aviso"]);
  const [telefonoAdmin, setTelefonoAdmin] = useState("");
  const [telefonoPorteria, setTelefonoPorteria] = useState("");

  const [calificacionInmueble, setCalificacionInmueble] = useState("");
  const [tiempoConstruccion, setTiempoConstruccion] = useState("");
  const materiales = useCheckboxGroup();
  const [numeroGarajes, setNumeroGarajes] = useState("");
  const [parqueaderosVisitantes, setParqueaderosVisitantes] = useState("");
  const seguridad = useCheckboxGroup();
  const otrasEspecificaciones = useCheckboxGroup();
  const [cantidadAscensores, setCantidadAscensores] = useState("");
  const [cantidadTorres, setCantidadTorres] = useState("");
  const [apartamentosPorTorre, setApartamentosPorTorre] = useState("");
  const [apartamentosPorPiso, setApartamentosPorPiso] = useState("");
  const [cantidadTotalApartamentos, setCantidadTotalApartamentos] = useState("");
  const plantaElectrica = useCheckboxGroup();
  const zonasComunes = useCheckboxGroup();

  const [reciboServicio, setReciboServicio] = useState<File[]>([]);
  const [certificadoLibertad, setCertificadoLibertad] = useState<File[]>([]);
  const [copiaCedula, setCopiaCedula] = useState<File[]>([]);

  const [attemptedStep0, setAttemptedStep0] = useState(false);

  const step0Invalid = !(
    primerNombre && primerApellido && numeroDocumento && correo && calificacionInmueble
  );

  // Paso 2: Inmueble y características
  const [tipoPropiedad, setTipoPropiedad] = useState<"urbano" | "rural">("urbano");
  const [nombrePropiedad, setNombrePropiedad] = useState("");
  const [ciudadInmueble, setCiudadInmueble] = useState("");
  const [localidadInmueble, setLocalidadInmueble] = useState("");
  const [tipoViaInmueble, setTipoViaInmueble] = useState("");
  const [numeroViaInmueble, setNumeroViaInmueble] = useState("");
  const [letraViaInmueble, setLetraViaInmueble] = useState("");
  const [cardinalViaInmueble, setCardinalViaInmueble] = useState("");
  const [bisViaInmueble, setBisViaInmueble] = useState("");
  const [numeroCruceInmueble, setNumeroCruceInmueble] = useState("");
  const [cardinalCruceInmueble, setCardinalCruceInmueble] = useState("");
  const [numeroPlacaInmueble, setNumeroPlacaInmueble] = useState("");
  const [complementoTipo, setComplementoTipo] = useState("");
  const [complementoNumero, setComplementoNumero] = useState("");
  const [conjuntoInmueble, setConjuntoInmueble] = useState("");
  const [barrioInmueble, setBarrioInmueble] = useState("");
  const [zonaInmueble, setZonaInmueble] = useState("");
  const [estratoInmueble, setEstratoInmueble] = useState("");
  const [areaConstruida, setAreaConstruida] = useState("");
  const [tipoNegocio, setTipoNegocio] = useState("");
  const [costoAdministracion, setCostoAdministracion] = useState("");
  const [costoCanon, setCostoCanon] = useState("");
  const [registroMatricula, setRegistroMatricula] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const buscarCoordenadas = () => { setLatitud("4.710989"); setLongitud("-74.072092"); };
  const [caracteristicasEspecificas, setCaracteristicasEspecificas] = useState("");

  const distribucion = useCheckboxGroup();
  const vista = useCheckboxGroup();
  const [caracteristicasInteriores, setCaracteristicasInteriores] = useState<string[]>([]);
  const [caracteristicasExteriores, setCaracteristicasExteriores] = useState<string[]>([]);
  const [caracteristicasSector, setCaracteristicasSector] = useState<string[]>([]);
  const chimenea = useCheckboxGroup();
  const tipoChimenea = useCheckboxGroup();
  const pisos = useCheckboxGroup();
  const [terraza, setTerraza] = useState(true);
  const [balcon, setBalcon] = useState(true);
  const [jardin, setJardin] = useState(true);
  const cocina = useCheckboxGroup();
  const [estadoInmueble, setEstadoInmueble] = useState("");
  const [ubicacionLlaves, setUbicacionLlaves] = useState("");
  const [numeroAlcobas, setNumeroAlcobas] = useState("");
  const [numeroBanos, setNumeroBanos] = useState("");
  const [calentador, setCalentador] = useState(true);
  const [calefaccion, setCalefaccion] = useState(true);
  const [depositos, setDepositos] = useState(true);

  const [attemptedStep1, setAttemptedStep1] = useState(false);

  const direccionCompletaInmueble = [
    tipoViaInmueble && `${tipoViaInmueble} ${numeroViaInmueble}${letraViaInmueble ? ` ${letraViaInmueble}` : ""}${bisViaInmueble ? " BIS" : ""}${cardinalViaInmueble ? ` ${cardinalViaInmueble}` : ""}`,
    numeroCruceInmueble && `# ${numeroCruceInmueble}${cardinalCruceInmueble ? ` ${cardinalCruceInmueble}` : ""}`,
    numeroPlacaInmueble && `- ${numeroPlacaInmueble}`,
    complementoTipo && `${complementoTipo}${complementoNumero ? ` ${complementoNumero}` : ""}`,
    conjuntoInmueble && `CONJ. ${conjuntoInmueble}`,
    barrioInmueble && `BRR ${barrioInmueble}`,
  ].filter(Boolean).join(" ");

  const step1Invalid = !(
    ciudadInmueble && tipoViaInmueble && numeroViaInmueble && barrioInmueble && zonaInmueble && estratoInmueble &&
    areaConstruida && costoAdministracion && costoCanon && registroMatricula &&
    caracteristicasInteriores.length > 0 && caracteristicasExteriores.length > 0 && caracteristicasSector.length > 0 &&
    numeroAlcobas && numeroBanos
  );

  // Paso 3: Planes y términos
  const [planSeleccionado, setPlanSeleccionado] = useState("");
  const [negociacionEspecial, setNegociacionEspecial] = useState(false);
  const [enviadoAFirma, setEnviadoAFirma] = useState(false);
  const [contratoFirmado, setContratoFirmado] = useState(false);
  const [attemptedStep2, setAttemptedStep2] = useState(false);

  const step2Invalid = !planSeleccionado || !(enviadoAFirma || contratoFirmado);

  const stepStatus: StepStatus[] = [
    step0Invalid ? "incomplete" : "complete",
    step1Invalid ? "incomplete" : "complete",
    step2Invalid ? "incomplete" : "complete",
  ];

  const [enviado, setEnviado] = useState(false);
  const [codigoInmueble, setCodigoInmueble] = useState("");

  if (enviado) {
    return <InmuebleCaptado codigo={codigoInmueble} onVolver={onFinish} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <BackButton onClick={() => setShowExitModal(true)} />

      <ConfirmExitModal
        open={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onSaveExit={() => { saveDraft(); setShowExitModal(false); onFinish(); }}
        onDiscard={() => { onDiscard?.(); setShowExitModal(false); onBack(); }}
      />

      <section
        className="rounded-lg flex flex-col gap-1"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 28px" }}
      >
        <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>Captar nuevo inmueble</h1>
        <span className="body-regular" style={{ color: "var(--gray-8)" }}>Incluye aquí toda la información relevante sobre el inmueble.</span>
      </section>

      <section
        className="rounded-lg flex items-center justify-center"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 28px" }}
      >
        <Stepper steps={STEPS} current={stepIndex} status={stepStatus} maxReached={maxStepReached} onStepClick={goToStep} />
      </section>

      {stepIndex === 0 ? (
        <>
          <SectionCard title="Tipo de inmueble">
            <div className="flex flex-col gap-3">
              <SegmentedControl value={tipoInmueble} onChange={setTipoInmueble} options={TIPO_INMUEBLE_OPTIONS} />
              <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
                Esta selección ajusta los campos del edificio y las características que verás a continuación.
              </span>
            </div>
          </SectionCard>

          <SectionCard title="Datos generales">
            <div className="flex items-center gap-6">
              <Radio checked={origenPropietario === "existente"} onChange={() => setOrigenPropietario("existente")} label="Propietario existente" />
              <Radio checked={origenPropietario === "nuevo"} onChange={() => setOrigenPropietario("nuevo")} label="Propietario nuevo" />
            </div>

            <SubHeading>Información del propietario</SubHeading>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
              <Field label="Primer nombre" required error={attemptedStep0 && !primerNombre}>
                <TextInput placeholder="Escriba aquí" value={primerNombre} onChange={setPrimerNombre} className="w-full" error={attemptedStep0 && !primerNombre} />
              </Field>
              <Field label="Segundo nombre"><TextInput placeholder="Escriba aquí" value={segundoNombre} onChange={setSegundoNombre} className="w-full" /></Field>
              <Field label="Primer apellido" required error={attemptedStep0 && !primerApellido}>
                <TextInput placeholder="Escriba aquí" value={primerApellido} onChange={setPrimerApellido} className="w-full" error={attemptedStep0 && !primerApellido} />
              </Field>
              <Field label="Segundo apellido"><TextInput placeholder="Escriba aquí" value={segundoApellido} onChange={setSegundoApellido} className="w-full" /></Field>
              <Field label="Tipo de documento"><SelectInput options={TIPO_DOCUMENTO_OPTIONS} value={tipoDocumento} onChange={setTipoDocumento} className="w-full" /></Field>
              <Field label="Número de documento" required error={attemptedStep0 && !numeroDocumento}>
                <TextInput placeholder="Escriba aquí" value={numeroDocumento} onChange={setNumeroDocumento} className="w-full" error={attemptedStep0 && !numeroDocumento} />
              </Field>
              <Field label="Teléfono"><TextInput placeholder="Escriba aquí" value={telefono} onChange={setTelefono} className="w-full" /></Field>
              <Field label="Celular"><TextInput placeholder="Escriba aquí" value={celular} onChange={setCelular} className="w-full" /></Field>
              <Field label="Correo electrónico" required error={attemptedStep0 && !correo}>
                <TextInput placeholder="Escriba aquí" value={correo} onChange={setCorreo} className="w-full" error={attemptedStep0 && !correo} />
              </Field>
              <Field label="Dirección"><TextInput placeholder="Escriba aquí" value={direccion} onChange={setDireccion} className="w-full" /></Field>
              <Field label="Ciudad"><SelectInput options={CIUDAD_OPTIONS} value={ciudad} onChange={setCiudad} className="w-full" /></Field>
              <Field label="Barrio"><SelectInput options={BARRIO_OPTIONS} value={barrio} onChange={setBarrio} className="w-full" /></Field>
            </div>

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <SubHeading>Datos de la propiedad</SubHeading>
            <div className="flex flex-col gap-3">
              <ToggleSwitch checked={propiedadOcupada} onChange={setPropiedadOcupada} label="La propiedad está ocupada" />
              <ToggleSwitch checked={citaPrevia} onChange={setCitaPrevia} label="Cita previa" />
            </div>

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <SubHeading>Publicidad</SubHeading>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 max-lg:grid-cols-1">
              <Checkbox checked={publicidad.has("Aviso")} onChange={() => publicidad.toggle("Aviso")} label="Aviso" />
              <Checkbox checked={publicidad.has("Fotos")} onChange={() => publicidad.toggle("Fotos")} label="Fotos" />
              <Checkbox checked={publicidad.has("Pendón")} onChange={() => publicidad.toggle("Pendón")} label="Pendón" />
            </div>

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <SubHeading>Administración</SubHeading>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
              <Field label="Teléfono Administración"><TextInput placeholder="Escriba aquí" value={telefonoAdmin} onChange={setTelefonoAdmin} className="w-full" /></Field>
              <Field label="Teléfono portería"><TextInput placeholder="Escriba aquí" value={telefonoPorteria} onChange={setTelefonoPorteria} className="w-full" /></Field>
            </div>
          </SectionCard>

          <SectionCard title="Características del edificio">
            <Field label="Calificación del inmueble" required error={attemptedStep0 && !calificacionInmueble}>
              <SelectInput options={CALIFICACION_OPTIONS} value={calificacionInmueble} onChange={setCalificacionInmueble} className="max-w-sm" error={attemptedStep0 && !calificacionInmueble} />
            </Field>

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <SubHeading>Edificio</SubHeading>
            <Field label="Tiempo de construcción">
              <TextInput placeholder="Escriba aquí" value={tiempoConstruccion} onChange={setTiempoConstruccion} className="max-w-sm" />
            </Field>
            <CheckboxRows
              group={materiales}
              rows={[["Ladrillo", "Pañete"], ["Cemento", "Piedra muñeca"], ["Marmol", "Granito"], ["Vidrio", "Otros"]]}
            />

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <SubHeading>Parqueaderos</SubHeading>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
              <Field label="Número de garajes"><SelectInput options={NUMERO_GARAJES_OPTIONS} value={numeroGarajes} onChange={setNumeroGarajes} className="w-full" /></Field>
              <Field label="Número de parqueaderos para visitantes"><TextInput placeholder="Escriba aquí" value={parqueaderosVisitantes} onChange={setParqueaderosVisitantes} className="w-full" /></Field>
            </div>

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <SubHeading>Seguridad / Vigilancia</SubHeading>
            <CheckboxRows
              group={seguridad}
              rows={[
                ["12 horas", "24 horas"],
                ["Citófono", "Circuito cerrado TV"],
                ["Alarma", "Alarma perimetral"],
                ["Recepción", "Portería externa"],
                ["Conserje", "Alarma monitoreada"],
                ["Puerta de seguridad", "Puerta blindada"],
              ]}
            />

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <SubHeading>Otras especificaciones</SubHeading>
            <CheckboxRows
              group={otrasEspecificaciones}
              rows={[
                ["Casilleros Correspondencia", "Lavandería Comunal"],
                ["Gabinete de Incendios", "Escaleras de Emergencia"],
                ["Ascensor"],
              ]}
            />

            {esApartamento && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
                <Field label="Cantidad de ascensores"><TextInput placeholder="Escriba aquí" value={cantidadAscensores} onChange={setCantidadAscensores} className="w-full" /></Field>
                <Field label="Cantidad de torres"><TextInput placeholder="Escriba aquí" value={cantidadTorres} onChange={setCantidadTorres} className="w-full" /></Field>
                <Field label="Apartamentos por torre"><TextInput placeholder="Escriba aquí" value={apartamentosPorTorre} onChange={setApartamentosPorTorre} className="w-full" /></Field>
                <Field label="Apartamentos por piso"><TextInput placeholder="Escriba aquí" value={apartamentosPorPiso} onChange={setApartamentosPorPiso} className="w-full" /></Field>
                <Field label="Cantidad total de apartamentos">
                  <TextInput placeholder="Ingrese la cantidad total" value={cantidadTotalApartamentos} onChange={setCantidadTotalApartamentos} className="w-full" />
                </Field>
              </div>
            )}

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <SubHeading>Planta eléctrica</SubHeading>
            <div className="flex items-center gap-8">
              <Checkbox checked={plantaElectrica.has("Suplencia total")} onChange={() => plantaElectrica.toggle("Suplencia total")} label="Suplencia total" />
              <Checkbox checked={plantaElectrica.has("Suplencia parcial")} onChange={() => plantaElectrica.toggle("Suplencia parcial")} label="Suplencia parcial" />
            </div>

            {esConZonasComunes && (
              <>
                <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
                <SubHeading>Zonas comunes</SubHeading>
                <CheckboxRows
                  group={zonasComunes}
                  rows={[
                    ["Salón comunal", "Guardería"],
                    ["Parque infantil", "Terraza BBQ"],
                    ["Tenis", "Salón de Juegos"],
                    ["Gimnasio", "Jaula de Golf"],
                    ["Squash", "Cancha múltiple"],
                    ["Piscina", "Sauna / Turco"],
                    ["Otros"],
                  ]}
                />
              </>
            )}
          </SectionCard>

          <SectionCard title="Documentos">
            <Field label="Recibo de Servicio público (Cualquiera)">
              <FileDropzone hint="Elegir archivo" compact files={reciboServicio} onFiles={(f) => setReciboServicio([f[f.length - 1]])} onRemove={() => setReciboServicio([])} />
            </Field>
            <Field label="Certificado de libertad y tradición">
              <FileDropzone hint="Elegir archivo" compact files={certificadoLibertad} onFiles={(f) => setCertificadoLibertad([f[f.length - 1]])} onRemove={() => setCertificadoLibertad([])} />
            </Field>
            <Field label="Copia de la cédula">
              <FileDropzone hint="Elegir archivo" compact files={copiaCedula} onFiles={(f) => setCopiaCedula([f[f.length - 1]])} onRemove={() => setCopiaCedula([])} />
            </Field>
            <Callout variant="info" title="Verifica tus documentos antes de enviarlos">
              Asegúrate de que los documentos que estás subiendo sean los correctos y cumplan con los requisitos establecidos.
            </Callout>
          </SectionCard>

          {attemptedStep0 && step0Invalid && (
            <Callout variant="error" title="Completa los campos obligatorios antes de continuar.">
              Revisa los campos marcados en rojo: son requeridos para captar el inmueble.
            </Callout>
          )}
        </>
      ) : stepIndex === 1 ? (
        <>
          <SectionCard title="Ubicación del inmueble">
            <div className="flex items-center gap-6">
              <Radio checked={tipoPropiedad === "urbano"} onChange={() => setTipoPropiedad("urbano")} label="Urbano" />
              <Radio checked={tipoPropiedad === "rural"} onChange={() => setTipoPropiedad("rural")} label="Rural" />
            </div>

            <Field label="Nombre de la propiedad">
              <TextInput placeholder="Escriba aquí" value={nombrePropiedad} onChange={setNombrePropiedad} className="w-full" />
            </Field>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
              <Field label="Ciudad" required error={attemptedStep1 && !ciudadInmueble}>
                <SelectInput options={CIUDAD_OPTIONS} value={ciudadInmueble} onChange={setCiudadInmueble} className="w-full" error={attemptedStep1 && !ciudadInmueble} />
              </Field>
              <Field label="Localidad (Opcional Bogotá)"><SelectInput options={LOCALIDAD_OPTIONS} value={localidadInmueble} onChange={setLocalidadInmueble} className="w-full" /></Field>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
              <Field label="Tipo de vía" required error={attemptedStep1 && !tipoViaInmueble}>
                <SelectInput options={TIPO_VIA_OPTIONS} value={tipoViaInmueble} onChange={setTipoViaInmueble} className="w-full" error={attemptedStep1 && !tipoViaInmueble} />
              </Field>
              <Field label="Número" required error={attemptedStep1 && !numeroViaInmueble}>
                <TextInput placeholder="Escriba aquí" value={numeroViaInmueble} onChange={setNumeroViaInmueble} className="w-full" error={attemptedStep1 && !numeroViaInmueble} />
              </Field>
              <Field label="Letra (Opcional)"><SelectInput options={LETRA_OPTIONS} value={letraViaInmueble} onChange={setLetraViaInmueble} className="w-full" /></Field>
              <Field label="Bis (Opcional)"><SelectInput options={BIS_OPTIONS} value={bisViaInmueble} onChange={setBisViaInmueble} className="w-full" /></Field>
              <Field label="Cardinal (Opcional)"><SelectInput options={CARDINAL_OPTIONS} value={cardinalViaInmueble} onChange={setCardinalViaInmueble} className="w-full" /></Field>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
              <Field label="Número de cruce"><TextInput placeholder="Escriba aquí" value={numeroCruceInmueble} onChange={setNumeroCruceInmueble} className="w-full" /></Field>
              <Field label="Cardinal (Opcional)"><SelectInput options={CARDINAL_OPTIONS} value={cardinalCruceInmueble} onChange={setCardinalCruceInmueble} className="w-full" /></Field>
              <Field label="Número de placa (después del -)"><TextInput placeholder="Escriba aquí" value={numeroPlacaInmueble} onChange={setNumeroPlacaInmueble} className="w-full" /></Field>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
              <Field label="Complemento (Opcional)"><SelectInput options={COMPLEMENTO_TIPO_OPTIONS} value={complementoTipo} onChange={setComplementoTipo} className="w-full" /></Field>
              <Field label="Número"><TextInput placeholder="Escriba aquí" value={complementoNumero} onChange={setComplementoNumero} className="w-full" /></Field>
              <Field label="Conjunto (Opcional)"><TextInput placeholder="Escriba aquí" value={conjuntoInmueble} onChange={setConjuntoInmueble} className="w-full" /></Field>
              <Field label="Barrio" required error={attemptedStep1 && !barrioInmueble}>
                <SelectInput options={BARRIO_OPTIONS} value={barrioInmueble} onChange={setBarrioInmueble} className="w-full" error={attemptedStep1 && !barrioInmueble} />
              </Field>
            </div>

            <Field label="Dirección completa">
              <div
                className="rounded-md body-regular"
                style={{ backgroundColor: "var(--gray-2)", color: direccionCompletaInmueble ? "var(--gray-10)" : "var(--gray-7)", padding: "10px 12px", minHeight: 40 }}
              >
                {direccionCompletaInmueble || "Se genera automáticamente con los datos de arriba"}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
              <Field label="Zona" required error={attemptedStep1 && !zonaInmueble}>
                <SelectInput options={ZONA_OPTIONS} value={zonaInmueble} onChange={setZonaInmueble} className="w-full" error={attemptedStep1 && !zonaInmueble} />
              </Field>
              <Field label="Estrato" required error={attemptedStep1 && !estratoInmueble}>
                <SelectInput options={ESTRATO_OPTIONS} value={estratoInmueble} onChange={setEstratoInmueble} className="w-full" error={attemptedStep1 && !estratoInmueble} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Coordenadas del mapa">
            <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
              Busca la dirección del inmueble en el mapa para obtener sus coordenadas automáticamente; si no se encuentra, puedes ingresarlas manualmente.
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <AppButton variant="primary" bold onClick={buscarCoordenadas} disabled={!direccionCompletaInmueble}>Buscar con dirección completa registrada</AppButton>
              <AppButton variant="secondary" bold onClick={buscarCoordenadas}>Buscar manualmente</AppButton>
              <AppButton variant="secondary" bold onClick={buscarCoordenadas}>Asignar coordenadas manualmente</AppButton>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
              <Field label="Latitud" required error={attemptedStep1 && !latitud}>
                <TextInput placeholder="Escriba aquí" value={latitud} onChange={setLatitud} className="w-full" error={attemptedStep1 && !latitud} />
              </Field>
              <Field label="Longitud" required error={attemptedStep1 && !longitud}>
                <TextInput placeholder="Escriba aquí" value={longitud} onChange={setLongitud} className="w-full" error={attemptedStep1 && !longitud} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Datos comerciales">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
              <Field label="Área construida (m²)" required error={attemptedStep1 && !areaConstruida}>
                <TextInput placeholder="Escriba aquí" value={areaConstruida} onChange={setAreaConstruida} className="w-full" error={attemptedStep1 && !areaConstruida} />
              </Field>
              <Field label="Tipo de negocio (Opcional)"><TextInput placeholder="Escriba aquí" value={tipoNegocio} onChange={setTipoNegocio} className="w-full" /></Field>
              <Field label="Costo administración" required error={attemptedStep1 && !costoAdministracion}>
                <CurrencyInput placeholder="Escriba aquí" value={costoAdministracion} onChange={setCostoAdministracion} className="w-full" error={attemptedStep1 && !costoAdministracion} />
              </Field>
              <Field label="Costo canon" required error={attemptedStep1 && !costoCanon}>
                <CurrencyInput placeholder="Escriba aquí" value={costoCanon} onChange={setCostoCanon} className="w-full" error={attemptedStep1 && !costoCanon} />
              </Field>
              <Field label="Registro Matrícula" required error={attemptedStep1 && !registroMatricula}>
                <TextInput placeholder="Escriba aquí" value={registroMatricula} onChange={setRegistroMatricula} className="w-full" error={attemptedStep1 && !registroMatricula} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Características del inmueble">
            <Field label="Descripción del inmueble">
              <Textarea value={caracteristicasEspecificas} placeholder="Hall de entrada, Penthouse, …" rows={3} onChange={setCaracteristicasEspecificas} />
            </Field>

            <Field label="Características interiores" required error={attemptedStep1 && caracteristicasInteriores.length === 0}>
              <TagInput value={caracteristicasInteriores} onChange={setCaracteristicasInteriores} placeholder="Sala independiente, salón comedor, …" error={attemptedStep1 && caracteristicasInteriores.length === 0} />
              <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>Escribe cada característica y separa con coma para convertirla en etiqueta.</span>
            </Field>

            <Field label="Características exteriores" required error={attemptedStep1 && caracteristicasExteriores.length === 0}>
              <TagInput value={caracteristicasExteriores} onChange={setCaracteristicasExteriores} placeholder="Sala independiente, salón comedor, …" error={attemptedStep1 && caracteristicasExteriores.length === 0} />
              <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>Escribe cada característica y separa con coma para convertirla en etiqueta.</span>
            </Field>

            <Field label="Características del sector" required error={attemptedStep1 && caracteristicasSector.length === 0}>
              <TagInput value={caracteristicasSector} onChange={setCaracteristicasSector} placeholder="Sala independiente, salón comedor, …" error={attemptedStep1 && caracteristicasSector.length === 0} />
              <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>Escribe cada característica y separa con coma para convertirla en etiqueta.</span>
            </Field>
          </SectionCard>

          <SectionCard title="Distribución y acabados">
            <SubHeading>Distribución</SubHeading>
            <CheckboxRows group={distribucion} rows={[["Duplex", "Niveles"], ["Exterior", "Interior"], ["Posterior"]]} />

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <SubHeading>Vista</SubHeading>
            <CheckboxRows group={vista} rows={[["Vista a los cerros", "Vista a la ciudad"]]} />

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <SubHeading>Pisos</SubHeading>
            <CheckboxRows group={pisos} rows={[["Madera", "Laminado"], ["Alfombra", "Mármol"], ["Baldosa", "Otro"]]} />

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <SubHeading>Chimenea</SubHeading>
            <CheckboxRows group={chimenea} rows={[["Sala", "Comedor"], ["Estudio", "Alcoba PPAL"]]} />

            <SubHeading>Tipo chimenea</SubHeading>
            <CheckboxRows group={tipoChimenea} rows={[["Gas", "Natural"]]} />

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <SubHeading>Cocina</SubHeading>
            <CheckboxRows
              group={cocina}
              rows={[
                ["Integral", "Americana"],
                ["Eléctrica", "Mixta"],
                ["Gas natural", "Gas propano"],
                ["Despensa", "Comedor auxiliar"],
                ["Lavandería", "Independiente"],
                ["Cuarto de servicio", "Baño de servicio"],
              ]}
            />
          </SectionCard>

          <SectionCard title="Espacios y comodidades">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
              <Field label="Número de Alcobas" required error={attemptedStep1 && !numeroAlcobas}>
                <SelectInput options={NUMERO_AMBIENTES_OPTIONS} value={numeroAlcobas} onChange={setNumeroAlcobas} className="w-full" error={attemptedStep1 && !numeroAlcobas} />
              </Field>
              <Field label="Número de baños" required error={attemptedStep1 && !numeroBanos}>
                <SelectInput options={NUMERO_AMBIENTES_OPTIONS} value={numeroBanos} onChange={setNumeroBanos} className="w-full" error={attemptedStep1 && !numeroBanos} />
              </Field>
            </div>

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <div className="flex flex-col gap-3">
              <ToggleSwitch checked={terraza} onChange={setTerraza} label="Terraza" />
              <ToggleSwitch checked={balcon} onChange={setBalcon} label="Balcón" />
              <ToggleSwitch checked={jardin} onChange={setJardin} label="Jardín" />
              <ToggleSwitch checked={calentador} onChange={setCalentador} label="Calentador (caldera)" />
              <ToggleSwitch checked={calefaccion} onChange={setCalefaccion} label="Calefacción suelo radiante" />
              <ToggleSwitch checked={depositos} onChange={setDepositos} label="Depósitos" />
            </div>

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <SubHeading>Estado</SubHeading>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 max-lg:grid-cols-1">
              {ESTADO_INMUEBLE_OPTIONS.map((op) => (
                <Radio key={op} checked={estadoInmueble === op} onChange={() => setEstadoInmueble(op)} label={op} />
              ))}
            </div>

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <Field label="Ubicación de llaves"><SelectInput options={UBICACION_LLAVES_OPTIONS} value={ubicacionLlaves} onChange={setUbicacionLlaves} className="max-w-sm" /></Field>
          </SectionCard>

          {attemptedStep1 && step1Invalid && (
            <Callout variant="error" title="Completa los campos obligatorios antes de continuar.">
              Revisa los campos marcados en rojo: son requeridos para captar el inmueble.
            </Callout>
          )}
        </>
      ) : (
        <>
          <SectionCard title="Planes de vinculación">
            <SubHeading>Selección de plan</SubHeading>
            <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {PLANES.map((plan) => {
                const selected = planSeleccionado === plan.id;
                return (
                  <div
                    key={plan.id}
                    className="flex flex-col gap-3 rounded-lg"
                    style={{
                      border: `1.5px solid ${selected ? "var(--navy)" : "var(--gray-5)"}`,
                      padding: 16,
                      backgroundColor: selected ? "var(--navy-light)" : "#ffffff",
                    }}
                  >
                    <span className="body-bold" style={{ color: "var(--navy)" }}>{plan.nombre}</span>
                    <span className="body-regular" style={{ color: "var(--gray-10)" }}>{plan.resumen}</span>
                    <span className="body-small-regular flex-1" style={{ color: "var(--gray-8)" }}>{plan.detalle}</span>
                    <AppButton
                      variant={selected ? "primary" : "secondary"}
                      bold
                      onClick={() => setPlanSeleccionado(plan.id)}
                    >
                      {selected ? "Seleccionado" : "Seleccionar"}
                    </AppButton>
                  </div>
                );
              })}
            </div>

            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

            <ToggleSwitch checked={negociacionEspecial} onChange={setNegociacionEspecial} label="Negociación especial" />

            {attemptedStep2 && !planSeleccionado && (
              <span className="flex items-center gap-1 body-small-regular" style={{ color: "var(--red-status)" }}>
                <AlertCircle size={13} strokeWidth={2} /> Debes seleccionar un mínimo un plan para poder continuar el proceso.
              </span>
            )}
          </SectionCard>

          <SectionCard title="Firma del contrato">
            <p className="body-regular" style={{ color: "var(--gray-8)" }}>
              Formaliza la vinculación del inmueble con Alquilando y autoriza su gestión comercial. El documento debe ser firmado por el propietario para autorizar la gestión comercial.
            </p>

            <div
              className="rounded-lg flex flex-col gap-3"
              style={{ border: "1px solid var(--gray-4)", padding: 20, backgroundColor: "var(--gray-1)" }}
            >
              <span className="body-bold text-center" style={{ color: "var(--navy)" }}>
                Contrato integral de administración, comercialización y mandato de venta de inmuebles
              </span>
              <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 max-lg:grid-cols-1">
                <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
                  <b>Propietario:</b> {primerNombre || "—"} {primerApellido || ""}
                </span>
                <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
                  <b>Documento:</b> {numeroDocumento || "—"}
                </span>
                <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
                  <b>Dirección:</b> {direccionCompletaInmueble || "—"}
                </span>
                <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
                  <b>Ciudad:</b> {ciudadInmueble || "—"}
                </span>
                <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
                  <b>Matrícula inmobiliaria:</b> {registroMatricula || "—"}
                </span>
                <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
                  <b>Tipo de inmueble:</b> {TIPO_INMUEBLE_OPTIONS.find((o) => o.value === tipoInmueble)?.label ?? "—"}
                </span>
                <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
                  <b>Plan seleccionado:</b> {PLANES.find((p) => p.id === planSeleccionado)?.nombre ?? "—"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="body-bold" style={{ color: "var(--navy)" }}>Términos y condiciones contrato de inclusión</span>
              <span className="body-regular" style={{ color: "var(--gray-8)" }}>
                Al firmar este documento, el propietario autoriza a Alquilando a promocionar el inmueble en los canales definidos, declara que la información suministrada es veraz y acepta el plan seleccionado y sus condiciones comerciales.
              </span>
              <span className="body-regular" style={{ color: "var(--gray-8)" }}>
                En caso que no estés con el propietario, puedes enviar el documento en formato PDF para que lo revise y firme de manera remota.
              </span>
            </div>

            {contratoFirmado ? (
              <Callout variant="info" title="Contrato firmado">
                El propietario firmó el contrato de inclusión. Ya puedes finalizar la captación.
              </Callout>
            ) : (
              <>
                <div
                  className="rounded-lg flex flex-col items-center gap-3"
                  style={{ border: "1px solid var(--gray-4)", padding: "28px 20px" }}
                >
                  <span className="body-bold" style={{ color: enviadoAFirma ? "var(--green-status)" : "var(--gray-10)" }}>
                    {enviadoAFirma ? "Enviado — esperando firma del propietario" : "Listo para enviar a firma del propietario"}
                  </span>
                  <AppButton variant="primary" bold onClick={() => setEnviadoAFirma(true)} disabled={enviadoAFirma}>
                    <Send size={15} /> {enviadoAFirma ? "Reenviar" : "Enviar a firma del propietario"}
                  </AppButton>
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <span className="body-regular" style={{ color: "var(--gray-8)" }}>O puedes firmar el documento de una vez</span>
                  <AppButton variant="secondary" bold onClick={() => setContratoFirmado(true)}>
                    <PenLine size={15} /> Firmar contrato
                  </AppButton>
                </div>
              </>
            )}
          </SectionCard>

          {attemptedStep2 && step2Invalid && (
            <Callout variant="error" title="Completa los campos obligatorios antes de continuar.">
              Selecciona un plan de vinculación y envía o firma el contrato de inclusión para poder finalizar.
            </Callout>
          )}
        </>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <LinkText onClick={onBack}>Cancelar captación</LinkText>
        <div className="flex items-center gap-3">
          {stepIndex > 0 && <AppButton variant="secondary" bold onClick={goBack}>Paso anterior</AppButton>}
          <AppButton variant="primary" bold onClick={isLastStep ? handleFinalizar : goNext}>
            {isLastStep ? <><CheckCircle2 size={15} /> Finalizar</> : "Siguiente paso"}
          </AppButton>
        </div>
      </div>

      <Footer />
    </div>
  );
}
