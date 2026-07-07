import { useState } from "react";
import { TextInput } from "./kit/TextInput";
import { SelectInput } from "./kit/SelectInput";
import { DateInput } from "./kit/DateInput";
import { ToggleSwitch } from "./kit/ToggleSwitch";
import { FileDropzone } from "./kit/FileDropzone";

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

function Field({ label, required, full, children }: { label: string; required?: boolean; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "col-span-2 max-lg:col-span-1" : ""}`}>
      <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>
        {label}{required && <span style={{ color: "var(--destructive)" }}> *</span>}
      </span>
      {children}
    </label>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <span className="body-bold" style={{ color: "var(--navy)" }}>{children}</span>;
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
        <Field label="Preferencia de contacto" required full><SelectInput options={PREFERENCIA_CONTACTO_OPTIONS} value={value.preferenciaContacto} onChange={(v) => onChange({ preferenciaContacto: v })} className="max-w-xs" /></Field>
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

export function PasoInquilino() {
  const [inquilino, setInquilino] = useState<Persona>(PERSONA_VACIA);
  const updateInquilino = (patch: Partial<Persona>) => setInquilino((p) => ({ ...p, ...patch }));

  const [tieneDeudor, setTieneDeudor] = useState(false);
  const [deudor, setDeudor] = useState<Persona>(PERSONA_VACIA);
  const updateDeudor = (patch: Partial<Persona>) => setDeudor((p) => ({ ...p, ...patch }));

  const [aseguradora, setAseguradora] = useState("");
  const [numeroPoliza, setNumeroPoliza] = useState("");
  const [archivosEstudio, setArchivosEstudio] = useState<File[]>([]);

  return (
    <section
      className="rounded-lg flex flex-col gap-6"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "24px 28px" }}
    >
      <span className="subtitle" style={{ color: "var(--navy)" }}>Información del inquilino</span>
      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

      <div className="flex flex-col gap-4">
        <SubHeading>Datos del inquilino</SubHeading>
        <PersonaFields value={inquilino} onChange={updateInquilino} />
      </div>

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
    </section>
  );
}
