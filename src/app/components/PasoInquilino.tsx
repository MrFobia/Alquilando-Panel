import { useEffect, useState } from "react";
import { TextInput } from "./kit/TextInput";
import { SelectInput } from "./kit/SelectInput";
import { DateInput } from "./kit/DateInput";
import { ToggleSwitch } from "./kit/ToggleSwitch";
import { FileDropzone } from "./kit/FileDropzone";
import { Field } from "./kit/Field";
import { SubHeading } from "./kit/SubHeading";
import { SectionCard } from "./kit/SectionCard";
import { Radio } from "./kit/Radio";
import type { PersonaRecord } from "../store/AppDataContext";

const TIPO_PERSONA_OPTIONS = ["Persona Natural", "Persona Jurídica"].map((v) => ({ value: v, label: v }));
const TIPO_DOCUMENTO_NATURAL_OPTIONS = ["Cédula de ciudadanía", "Cédula de extranjería", "Pasaporte"].map((v) => ({ value: v, label: v }));
const TIPO_DOCUMENTO_JURIDICA_OPTIONS = ["NIT"].map((v) => ({ value: v, label: v }));
const CIUDAD_OPTIONS = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"].map((v) => ({ value: v, label: v }));
const GENERO_OPTIONS = ["Femenino", "Masculino", "Otro", "Prefiero no decir"].map((v) => ({ value: v, label: v }));
const PREFERENCIA_CONTACTO_OPTIONS = ["Correo electrónico", "Teléfono", "Celular", "WhatsApp"].map((v) => ({ value: v, label: v }));
const ASEGURADORA_OPTIONS = ["El Libertador", "Afianzadora nacional sa", "Confianza SA", "Solidaria"].map((v) => ({ value: v, label: v }));

function calcEdad(fecha: string): string {
  if (!fecha) return "";
  const nacimiento = new Date(fecha);
  if (Number.isNaN(nacimiento.getTime())) return "";
  const años = Math.floor((Date.now() - nacimiento.getTime()) / (365.25 * 24 * 3600 * 1000));
  return años >= 0 ? String(años) : "";
}

interface Persona {
  tipoPersona: string;
  tipoDocumento: string; numeroDocumento: string; ciudadExpedicion: string; fechaNacimiento: string;
  primerNombre: string; segundoNombre: string; primerApellido: string; segundoApellido: string;
  razonSocial: string; nombreRepLegal: string;
  telefono: string; celular: string; correo: string; ciudadNacimiento: string; genero: string;
  direccion: string; preferenciaContacto: string;
}
const PERSONA_VACIA: Persona = {
  tipoPersona: "",
  tipoDocumento: "", numeroDocumento: "", ciudadExpedicion: "", fechaNacimiento: "",
  primerNombre: "", segundoNombre: "", primerApellido: "", segundoApellido: "",
  razonSocial: "", nombreRepLegal: "",
  telefono: "", celular: "", correo: "", ciudadNacimiento: "", genero: "", direccion: "", preferenciaContacto: "",
};

const isPersonaValid = (p: Persona) => {
  const esJuridica = p.tipoPersona === "Persona Jurídica";
  const base = !!(p.tipoPersona && p.tipoDocumento && p.numeroDocumento && p.ciudadExpedicion &&
    p.celular && p.correo && p.direccion && p.preferenciaContacto);
  if (esJuridica) return base && !!(p.razonSocial && p.nombreRepLegal);
  return base && !!(p.primerNombre && p.primerApellido && p.ciudadNacimiento && p.genero);
};

function PersonaFields({ value, onChange }: { value: Persona; onChange: (patch: Partial<Persona>) => void }) {
  const esJuridica = value.tipoPersona === "Persona Jurídica";

  return (
    <>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
        <Field label="Tipo de persona" required>
          <SelectInput
            options={TIPO_PERSONA_OPTIONS}
            value={value.tipoPersona}
            onChange={(v) => onChange({ tipoPersona: v, tipoDocumento: "" })}
            className="w-full"
          />
        </Field>
        <Field label="Tipo de documento" required>
          <SelectInput
            options={esJuridica ? TIPO_DOCUMENTO_JURIDICA_OPTIONS : TIPO_DOCUMENTO_NATURAL_OPTIONS}
            value={value.tipoDocumento}
            onChange={(v) => onChange({ tipoDocumento: v })}
            className="w-full"
          />
        </Field>
        <Field label={esJuridica ? "Número de NIT" : "Número del documento"} required>
          <TextInput placeholder="Escriba aquí" value={value.numeroDocumento} onChange={(v) => onChange({ numeroDocumento: v })} className="w-full" />
        </Field>
        <Field label="Ciudad de expedición del documento" required>
          <SelectInput options={CIUDAD_OPTIONS} value={value.ciudadExpedicion} onChange={(v) => onChange({ ciudadExpedicion: v })} className="w-full" />
        </Field>

        {esJuridica ? (
          <>
            <Field label="Razón social" required><TextInput placeholder="Escriba aquí" value={value.razonSocial} onChange={(v) => onChange({ razonSocial: v })} className="w-full" /></Field>
            <Field label="Nombre del representante legal" required><TextInput placeholder="Escriba aquí" value={value.nombreRepLegal} onChange={(v) => onChange({ nombreRepLegal: v })} className="w-full" /></Field>
          </>
        ) : (
          <>
            <Field label="Primer nombre" required><TextInput placeholder="Escriba aquí" value={value.primerNombre} onChange={(v) => onChange({ primerNombre: v })} className="w-full" /></Field>
            <Field label="Segundo nombre"><TextInput placeholder="Escriba aquí" value={value.segundoNombre} onChange={(v) => onChange({ segundoNombre: v })} className="w-full" /></Field>
            <Field label="Primer apellido" required><TextInput placeholder="Escriba aquí" value={value.primerApellido} onChange={(v) => onChange({ primerApellido: v })} className="w-full" /></Field>
            <Field label="Segundo apellido"><TextInput placeholder="Escriba aquí" value={value.segundoApellido} onChange={(v) => onChange({ segundoApellido: v })} className="w-full" /></Field>
          </>
        )}
      </div>

      <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

      <SubHeading>Contacto</SubHeading>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
        <Field label="Teléfono"><TextInput placeholder="Escriba aquí" value={value.telefono} onChange={(v) => onChange({ telefono: v })} className="w-full" /></Field>
        <Field label={esJuridica ? "Celular del representante legal" : "Celular"} required><TextInput placeholder="Escriba aquí" value={value.celular} onChange={(v) => onChange({ celular: v })} className="w-full" /></Field>
        <Field label={esJuridica ? "Correo del representante legal" : "Correo electrónico"} required><TextInput placeholder="Escriba aquí" value={value.correo} onChange={(v) => onChange({ correo: v })} className="w-full" /></Field>
        <Field label="Dirección correspondencia" required><TextInput placeholder="Escriba aquí" value={value.direccion} onChange={(v) => onChange({ direccion: v })} className="w-full" /></Field>
        <Field label="Preferencia de contacto" required><SelectInput options={PREFERENCIA_CONTACTO_OPTIONS} value={value.preferenciaContacto} onChange={(v) => onChange({ preferenciaContacto: v })} className="w-full" /></Field>
      </div>

      {!esJuridica && (
        <>
          <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />
          <SubHeading>Datos adicionales</SubHeading>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
            <Field label="Fecha de nacimiento"><DateInput value={value.fechaNacimiento} onChange={(v) => onChange({ fechaNacimiento: v })} className="w-full" /></Field>
            <Field label="Edad"><TextInput value={calcEdad(value.fechaNacimiento)} disabled className="w-full" /></Field>
            <Field label="Ciudad de nacimiento" required><SelectInput options={CIUDAD_OPTIONS} value={value.ciudadNacimiento} onChange={(v) => onChange({ ciudadNacimiento: v })} className="w-full" /></Field>
            <Field label="Género" required><SelectInput options={GENERO_OPTIONS} value={value.genero} onChange={(v) => onChange({ genero: v })} className="w-full" /></Field>
          </div>
        </>
      )}
    </>
  );
}

export interface InquilinoData {
  origen: "existente" | "nuevo";
  existenteId?: string;
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  telefono: string;
  direccion: string;
}

interface Props {
  onValidityChange?: (valid: boolean) => void;
  onDataChange?: (data: InquilinoData) => void;
  existentes?: PersonaRecord[];
}

export function PasoInquilino({ onValidityChange, onDataChange, existentes = [] }: Props = {}) {
  const [origen, setOrigen] = useState<"existente" | "nuevo">("nuevo");
  const [existenteId, setExistenteId] = useState("");
  const inquilinoExistente = existentes.find((p) => p.id === existenteId);
  const [inquilino, setInquilino] = useState<Persona>(PERSONA_VACIA);
  const updateInquilino = (patch: Partial<Persona>) => setInquilino((p) => ({ ...p, ...patch }));

  const [tieneDeudor, setTieneDeudor] = useState(false);
  const [deudor, setDeudor] = useState<Persona>(PERSONA_VACIA);
  const updateDeudor = (patch: Partial<Persona>) => setDeudor((p) => ({ ...p, ...patch }));

  const [aseguradora, setAseguradora] = useState("");
  const [numeroPoliza, setNumeroPoliza] = useState("");
  const [archivosEstudio, setArchivosEstudio] = useState<File[]>([]);

  const inquilinoValido = origen === "existente" ? !!existenteId : isPersonaValid(inquilino);
  const valido = inquilinoValido && (!tieneDeudor || isPersonaValid(deudor)) && !!aseguradora;
  useEffect(() => { onValidityChange?.(valido); }, [valido, onValidityChange]);

  useEffect(() => {
    onDataChange?.({
      origen,
      existenteId: existenteId || undefined,
      nombre: origen === "existente" ? (inquilinoExistente?.nombre ?? "") : `${inquilino.primerNombre} ${inquilino.primerApellido}`.trim() || inquilino.razonSocial,
      tipoDocumento: origen === "existente" ? (inquilinoExistente?.tipoDocumento ?? "") : inquilino.tipoDocumento,
      numeroDocumento: origen === "existente" ? (inquilinoExistente?.numeroDocumento ?? "") : inquilino.numeroDocumento,
      correo: origen === "existente" ? (inquilinoExistente?.correo ?? "") : inquilino.correo,
      telefono: origen === "existente" ? (inquilinoExistente?.telefono ?? "") : (inquilino.celular || inquilino.telefono),
      direccion: origen === "existente" ? (inquilinoExistente?.direccion ?? "") : inquilino.direccion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origen, existenteId, inquilino]);

  return (
    <SectionCard title="Información del inquilino" padding="24px 28px">
      {existentes.length > 0 && (
        <div className="flex items-center gap-6">
          <Radio checked={origen === "existente"} onChange={() => setOrigen("existente")} label="Inquilino existente" />
          <Radio checked={origen === "nuevo"} onChange={() => setOrigen("nuevo")} label="Inquilino nuevo" />
        </div>
      )}

      {origen === "existente" ? (
        <div className="flex flex-col gap-4">
          <Field label="Selecciona el inquilino" required>
            <SelectInput
              options={existentes.map((p) => ({ value: p.id, label: `${p.nombre} — ${p.numeroDocumento}` }))}
              value={existenteId}
              onChange={setExistenteId}
              className="max-w-md"
            />
          </Field>
          {inquilinoExistente && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-lg max-lg:grid-cols-1" style={{ backgroundColor: "var(--gray-1)", padding: 16 }}>
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}><b>Documento:</b> {inquilinoExistente.tipoDocumento} {inquilinoExistente.numeroDocumento}</span>
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}><b>Correo:</b> {inquilinoExistente.correo}</span>
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}><b>Teléfono:</b> {inquilinoExistente.telefono}</span>
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}><b>Dirección:</b> {inquilinoExistente.direccion}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <SubHeading>Datos del inquilino</SubHeading>
          <PersonaFields value={inquilino} onChange={updateInquilino} />
        </div>
      )}

      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

      <div className="flex flex-col gap-4">
        <ToggleSwitch checked={tieneDeudor} onChange={setTieneDeudor} label="Deudor solidario" />
        {tieneDeudor && (
          <div className="flex flex-col gap-4">
            <SubHeading>Datos del deudor solidario</SubHeading>
            <PersonaFields value={deudor} onChange={updateDeudor} />
          </div>
        )}
      </div>

      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

      <div className="flex flex-col gap-4">
        <SubHeading>Póliza de aseguramiento</SubHeading>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
          <Field label="Nombre de aseguradora" required>
            <SelectInput options={ASEGURADORA_OPTIONS} value={aseguradora} onChange={setAseguradora} className="w-full" />
          </Field>
          <Field label="Número de póliza (Opcional)">
            <TextInput placeholder="Escriba aquí" value={numeroPoliza} onChange={setNumeroPoliza} className="w-full" />
          </Field>
        </div>
        <Field label="Estudio de aseguribilidad">
          <FileDropzone
            hint="Seleccione o arrastre aquí el archivo"
            files={archivosEstudio}
            onFiles={(files) => setArchivosEstudio((prev) => [...prev, ...files])}
            onRemove={(i) => setArchivosEstudio((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </Field>
      </div>
    </SectionCard>
  );
}
