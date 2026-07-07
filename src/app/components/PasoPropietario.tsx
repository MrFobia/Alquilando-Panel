import { useState } from "react";
import { Trash2 } from "lucide-react";
import { TextInput } from "./kit/TextInput";
import { SelectInput } from "./kit/SelectInput";
import { DateInput } from "./kit/DateInput";
import { ToggleSwitch } from "./kit/ToggleSwitch";
import { LinkText } from "./kit/LinkText";
import { CollapsiblePanel } from "./kit/CollapsiblePanel";

const TIPO_PERSONA_OPTIONS = ["Persona Natural", "Persona Jurídica", "Responsable de IVA", "No Responsable de IVA"].map((v) => ({ value: v, label: v }));
const TIPO_DOCUMENTO_OPTIONS = ["Cédula de ciudadanía", "Cédula de extranjería", "NIT", "Pasaporte"].map((v) => ({ value: v, label: v }));
const CIUDAD_OPTIONS = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"].map((v) => ({ value: v, label: v }));
const GENERO_OPTIONS = ["Femenino", "Masculino", "Otro", "Prefiero no decir"].map((v) => ({ value: v, label: v }));
const PREFERENCIA_CONTACTO_OPTIONS = ["Correo electrónico", "Teléfono", "Celular", "WhatsApp"].map((v) => ({ value: v, label: v }));
const PORCENTAJE_OPTIONS = Array.from({ length: 10 }, (_, i) => String((i + 1) * 10)).map((v) => ({ value: v, label: `${v}%` }));
const TIPO_CUENTA_OPTIONS = ["Ahorros", "Corriente"].map((v) => ({ value: v, label: v }));
const BANCO_OPTIONS = ["Bancolombia", "Davivienda", "BBVA", "Banco de Bogotá", "Nequi", "Banco Caja Social"].map((v) => ({ value: v, label: v }));
const DIA_PAGO_OPTIONS = Array.from({ length: 28 }, (_, i) => String(i + 1)).map((v) => ({ value: v, label: v }));

function calcEdad(fecha: string): string {
  if (!fecha) return "";
  const nacimiento = new Date(fecha);
  if (Number.isNaN(nacimiento.getTime())) return "";
  const años = Math.floor((Date.now() - nacimiento.getTime()) / (365.25 * 24 * 3600 * 1000));
  return años >= 0 ? String(años) : "";
}

let uid = 0;
const nextId = () => `p-${++uid}`;

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

interface DatosPropietario {
  tipoPersona: string; porcentaje: string; tipoDocumento: string; numeroDocumento: string;
  ciudadExpedicion: string; fechaNacimiento: string; primerNombre: string; segundoNombre: string;
  primerApellido: string; segundoApellido: string; telefono: string; celular: string; correo: string;
  ciudadNacimiento: string; genero: string; direccion: string; preferenciaContacto: string;
}
const PROPIETARIO_VACIO: DatosPropietario = {
  tipoPersona: "", porcentaje: "", tipoDocumento: "", numeroDocumento: "", ciudadExpedicion: "",
  fechaNacimiento: "", primerNombre: "", segundoNombre: "", primerApellido: "", segundoApellido: "",
  telefono: "", celular: "", correo: "", ciudadNacimiento: "", genero: "", direccion: "", preferenciaContacto: "",
};

interface Egreso {
  numeroDocumento: string; concepto: string; entidad: string;
  valorCargo: string; porcentajeAplicar: string; tipoCuenta: string; banco: string; numeroCuenta: string;
}
const EGRESO_VACIO: Egreso = {
  numeroDocumento: "", concepto: "", entidad: "",
  valorCargo: "", porcentajeAplicar: "", tipoCuenta: "", banco: "", numeroCuenta: "",
};

interface Copropietario {
  id: string; tipoPersona: string; porcentaje: string; razonSocial: string; tipoDocumento: string;
  numeroDocumento: string; telefonoRepLegal: string; correoRepLegal: string; direccion: string;
  preferenciaContacto: string; tipoCuenta: string; banco: string; numeroCuenta: string;
}
const nuevoCopropietario = (): Copropietario => ({
  id: nextId(), tipoPersona: "", porcentaje: "", razonSocial: "", tipoDocumento: "", numeroDocumento: "",
  telefonoRepLegal: "", correoRepLegal: "", direccion: "", preferenciaContacto: "", tipoCuenta: "", banco: "", numeroCuenta: "",
});

interface Apoderado {
  nombre: string; tipoDocumento: string; numeroDocumento: string; direccion: string; telefono: string; preferenciaContacto: string;
}
const APODERADO_VACIO: Apoderado = { nombre: "", tipoDocumento: "", numeroDocumento: "", direccion: "", telefono: "", preferenciaContacto: "" };

interface Beneficiario extends Egreso {
  id: string; diaPago: string;
}
const nuevoBeneficiario = (): Beneficiario => ({ id: nextId(), ...EGRESO_VACIO, diaPago: "" });

function EgresoFields({
  value, onChange, diaPago,
}: {
  value: Egreso;
  onChange: (patch: Partial<Egreso>) => void;
  diaPago?: { value: string; onChange: (v: string) => void };
}) {
  return (
    <div className="flex flex-col gap-4">
      <SubHeading>Destinación de egresos</SubHeading>
      <div className="grid grid-cols-3 gap-x-6 gap-y-4 max-lg:grid-cols-1">
        <Field label="Número de documento (NIT / Cédula de ciudadanía)" required>
          <TextInput placeholder="Escriba aquí" value={value.numeroDocumento} onChange={(v) => onChange({ numeroDocumento: v })} className="w-full" />
        </Field>
        <Field label="Concepto" required>
          <TextInput placeholder="Escriba aquí" value={value.concepto} onChange={(v) => onChange({ concepto: v })} className="w-full" />
        </Field>
        <Field label="Entidad / Nombre" required>
          <TextInput placeholder="Escriba aquí" value={value.entidad} onChange={(v) => onChange({ entidad: v })} className="w-full" />
        </Field>
      </div>

      <SubHeading>Valor a aplicar en la destinación del egreso</SubHeading>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
        <Field label="Valor cargo" required>
          <TextInput placeholder="Escriba aquí" value={value.valorCargo} onChange={(v) => onChange({ valorCargo: v })} className="w-full" />
        </Field>
        <Field label="% a aplicar" required>
          <SelectInput options={PORCENTAJE_OPTIONS} value={value.porcentajeAplicar} onChange={(v) => onChange({ porcentajeAplicar: v })} className="w-full" />
        </Field>
        <Field label="Tipo de cuenta" required>
          <SelectInput options={TIPO_CUENTA_OPTIONS} value={value.tipoCuenta} onChange={(v) => onChange({ tipoCuenta: v })} className="w-full" />
        </Field>
        <Field label="Banco" required>
          <SelectInput options={BANCO_OPTIONS} value={value.banco} onChange={(v) => onChange({ banco: v })} className="w-full" />
        </Field>
        <Field label="Número de cuenta" required>
          <TextInput placeholder="Escriba aquí" value={value.numeroCuenta} onChange={(v) => onChange({ numeroCuenta: v })} className="w-full" />
        </Field>
        {diaPago && (
          <Field label="Día de pago" required>
            <SelectInput options={DIA_PAGO_OPTIONS} value={diaPago.value} onChange={diaPago.onChange} className="w-full" />
          </Field>
        )}
      </div>
    </div>
  );
}

export function PasoPropietario() {
  const [propietario, setPropietario] = useState<DatosPropietario>(PROPIETARIO_VACIO);
  const updateProp = (patch: Partial<DatosPropietario>) => setPropietario((p) => ({ ...p, ...patch }));

  const [egreso, setEgreso] = useState<Egreso>(EGRESO_VACIO);
  const updateEgreso = (patch: Partial<Egreso>) => setEgreso((e) => ({ ...e, ...patch }));

  const [tieneCopropietario, setTieneCopropietario] = useState(false);
  const [copropietarios, setCopropietarios] = useState<Copropietario[]>([]);
  const toggleCopropietario = (v: boolean) => {
    setTieneCopropietario(v);
    setCopropietarios(v ? [nuevoCopropietario()] : []);
  };
  const addCopropietario = () => setCopropietarios((prev) => [...prev, nuevoCopropietario()]);
  const removeCopropietario = (id: string) => setCopropietarios((prev) => prev.filter((c) => c.id !== id));
  const updateCopropietario = (id: string, patch: Partial<Copropietario>) =>
    setCopropietarios((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const [tieneApoderado, setTieneApoderado] = useState(false);
  const [apoderado, setApoderado] = useState<Apoderado>(APODERADO_VACIO);
  const updateApoderado = (patch: Partial<Apoderado>) => setApoderado((a) => ({ ...a, ...patch }));

  const [tieneBeneficiario, setTieneBeneficiario] = useState(false);
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const toggleBeneficiario = (v: boolean) => {
    setTieneBeneficiario(v);
    setBeneficiarios(v ? [nuevoBeneficiario()] : []);
  };
  const addBeneficiario = () => setBeneficiarios((prev) => [...prev, nuevoBeneficiario()]);
  const removeBeneficiario = (id: string) => setBeneficiarios((prev) => prev.filter((b) => b.id !== id));
  const updateBeneficiario = (id: string, patch: Partial<Beneficiario>) =>
    setBeneficiarios((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  return (
    <section
      className="rounded-lg flex flex-col gap-6"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "24px 28px" }}
    >
      <span className="subtitle" style={{ color: "var(--navy)" }}>Información del propietario</span>
      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

      <div className="flex flex-col gap-4">
        <SubHeading>Identificación</SubHeading>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
          <Field label="Tipo de persona" required><SelectInput options={TIPO_PERSONA_OPTIONS} value={propietario.tipoPersona} onChange={(v) => updateProp({ tipoPersona: v })} className="w-full" /></Field>
          <Field label="Tipo de documento" required><SelectInput options={TIPO_DOCUMENTO_OPTIONS} value={propietario.tipoDocumento} onChange={(v) => updateProp({ tipoDocumento: v })} className="w-full" /></Field>
          <Field label="Número del documento" required><TextInput placeholder="Escriba aquí" value={propietario.numeroDocumento} onChange={(v) => updateProp({ numeroDocumento: v })} className="w-full" /></Field>
          <Field label="Ciudad de expedición del documento" required><SelectInput options={CIUDAD_OPTIONS} value={propietario.ciudadExpedicion} onChange={(v) => updateProp({ ciudadExpedicion: v })} className="w-full" /></Field>
          <Field label="Primer nombre" required><TextInput placeholder="Escriba aquí" value={propietario.primerNombre} onChange={(v) => updateProp({ primerNombre: v })} className="w-full" /></Field>
          <Field label="Segundo nombre"><TextInput placeholder="Escriba aquí" value={propietario.segundoNombre} onChange={(v) => updateProp({ segundoNombre: v })} className="w-full" /></Field>
          <Field label="Primer apellido" required><TextInput placeholder="Escriba aquí" value={propietario.primerApellido} onChange={(v) => updateProp({ primerApellido: v })} className="w-full" /></Field>
          <Field label="Segundo apellido"><TextInput placeholder="Escriba aquí" value={propietario.segundoApellido} onChange={(v) => updateProp({ segundoApellido: v })} className="w-full" /></Field>
        </div>

        <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

        <SubHeading>Contacto</SubHeading>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
          <Field label="Teléfono"><TextInput placeholder="Escriba aquí" value={propietario.telefono} onChange={(v) => updateProp({ telefono: v })} className="w-full" /></Field>
          <Field label="Celular" required><TextInput placeholder="Escriba aquí" value={propietario.celular} onChange={(v) => updateProp({ celular: v })} className="w-full" /></Field>
          <Field label="Correo electrónico" required><TextInput placeholder="Escriba aquí" value={propietario.correo} onChange={(v) => updateProp({ correo: v })} className="w-full" /></Field>
          <Field label="Dirección correspondencia" required><TextInput placeholder="Escriba aquí" value={propietario.direccion} onChange={(v) => updateProp({ direccion: v })} className="w-full" /></Field>
          <Field label="Preferencia de contacto" required full><SelectInput options={PREFERENCIA_CONTACTO_OPTIONS} value={propietario.preferenciaContacto} onChange={(v) => updateProp({ preferenciaContacto: v })} className="max-w-xs" /></Field>
        </div>

        <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

        <SubHeading>Datos adicionales</SubHeading>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
          <Field label="Fecha de nacimiento"><DateInput value={propietario.fechaNacimiento} onChange={(v) => updateProp({ fechaNacimiento: v })} className="w-full" /></Field>
          <Field label="Edad"><TextInput value={calcEdad(propietario.fechaNacimiento)} disabled className="w-full" /></Field>
          <Field label="Ciudad de nacimiento" required><SelectInput options={CIUDAD_OPTIONS} value={propietario.ciudadNacimiento} onChange={(v) => updateProp({ ciudadNacimiento: v })} className="w-full" /></Field>
          <Field label="Género" required><SelectInput options={GENERO_OPTIONS} value={propietario.genero} onChange={(v) => updateProp({ genero: v })} className="w-full" /></Field>
          <Field label="Porcentaje de participación en el inmueble" required full><SelectInput options={PORCENTAJE_OPTIONS} value={propietario.porcentaje} onChange={(v) => updateProp({ porcentaje: v })} className="max-w-xs" /></Field>
        </div>
      </div>

      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
      <EgresoFields value={egreso} onChange={updateEgreso} />

      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

      {/* Copropietario */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <ToggleSwitch checked={tieneCopropietario} onChange={toggleCopropietario} label="Copropietario" />
          {tieneCopropietario && <LinkText icon="chevron" onClick={addCopropietario}>Agregar copropietario</LinkText>}
        </div>
        {tieneCopropietario && (
          <div className="flex flex-col gap-3">
            {copropietarios.map((c, i) => (
              <CollapsiblePanel
                key={c.id}
                defaultOpen
                title={`Copropietario ${i + 1}`}
                right={
                  copropietarios.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeCopropietario(c.id); }}
                      className="inline-flex items-center gap-1 tags"
                      style={{ cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.8)" }}
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  )
                }
              >
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
                  <Field label="Tipo de persona" required><SelectInput options={TIPO_PERSONA_OPTIONS} value={c.tipoPersona} onChange={(v) => updateCopropietario(c.id, { tipoPersona: v })} className="w-full" /></Field>
                  <Field label="Porcentaje de participación en el inmueble" required><SelectInput options={PORCENTAJE_OPTIONS} value={c.porcentaje} onChange={(v) => updateCopropietario(c.id, { porcentaje: v })} className="w-full" /></Field>
                  <Field label="Razón social" required><TextInput placeholder="Escriba aquí" value={c.razonSocial} onChange={(v) => updateCopropietario(c.id, { razonSocial: v })} className="w-full" /></Field>
                  <Field label="Tipo de documento" required><SelectInput options={TIPO_DOCUMENTO_OPTIONS} value={c.tipoDocumento} onChange={(v) => updateCopropietario(c.id, { tipoDocumento: v })} className="w-full" /></Field>
                  <Field label="Número del documento" required><TextInput placeholder="Escriba aquí" value={c.numeroDocumento} onChange={(v) => updateCopropietario(c.id, { numeroDocumento: v })} className="w-full" /></Field>
                  <Field label="Teléfono del representante legal" required><TextInput placeholder="Escriba aquí" value={c.telefonoRepLegal} onChange={(v) => updateCopropietario(c.id, { telefonoRepLegal: v })} className="w-full" /></Field>
                  <Field label="Correo electrónico del representante legal" required><TextInput placeholder="Escriba aquí" value={c.correoRepLegal} onChange={(v) => updateCopropietario(c.id, { correoRepLegal: v })} className="w-full" /></Field>
                  <Field label="Dirección correspondencia" required><TextInput placeholder="Escriba aquí" value={c.direccion} onChange={(v) => updateCopropietario(c.id, { direccion: v })} className="w-full" /></Field>
                  <Field label="Preferencia de contacto" required><SelectInput options={PREFERENCIA_CONTACTO_OPTIONS} value={c.preferenciaContacto} onChange={(v) => updateCopropietario(c.id, { preferenciaContacto: v })} className="w-full" /></Field>
                  <Field label="Tipo de cuenta" required><SelectInput options={TIPO_CUENTA_OPTIONS} value={c.tipoCuenta} onChange={(v) => updateCopropietario(c.id, { tipoCuenta: v })} className="w-full" /></Field>
                  <Field label="Banco" required><SelectInput options={BANCO_OPTIONS} value={c.banco} onChange={(v) => updateCopropietario(c.id, { banco: v })} className="w-full" /></Field>
                  <Field label="Número de cuenta" required><TextInput placeholder="Escriba aquí" value={c.numeroCuenta} onChange={(v) => updateCopropietario(c.id, { numeroCuenta: v })} className="w-full" /></Field>
                </div>
              </CollapsiblePanel>
            ))}
          </div>
        )}
      </div>

      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

      {/* Apoderado */}
      <div className="flex flex-col gap-4">
        <ToggleSwitch checked={tieneApoderado} onChange={setTieneApoderado} label="Apoderado" />
        {tieneApoderado && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
            <Field label="Nombre del apoderado" required><TextInput placeholder="Escriba aquí" value={apoderado.nombre} onChange={(v) => updateApoderado({ nombre: v })} className="w-full" /></Field>
            <Field label="Tipo de documento" required><SelectInput options={TIPO_DOCUMENTO_OPTIONS} value={apoderado.tipoDocumento} onChange={(v) => updateApoderado({ tipoDocumento: v })} className="w-full" /></Field>
            <Field label="Número del documento" required><TextInput placeholder="Escriba aquí" value={apoderado.numeroDocumento} onChange={(v) => updateApoderado({ numeroDocumento: v })} className="w-full" /></Field>
            <Field label="Dirección correspondencia" required><TextInput placeholder="Escriba aquí" value={apoderado.direccion} onChange={(v) => updateApoderado({ direccion: v })} className="w-full" /></Field>
            <Field label="Teléfono" required><TextInput placeholder="Escriba aquí" value={apoderado.telefono} onChange={(v) => updateApoderado({ telefono: v })} className="w-full" /></Field>
            <Field label="Preferencia de contacto" required><SelectInput options={PREFERENCIA_CONTACTO_OPTIONS} value={apoderado.preferenciaContacto} onChange={(v) => updateApoderado({ preferenciaContacto: v })} className="w-full" /></Field>
          </div>
        )}
      </div>

      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

      {/* Beneficiario de renta */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <ToggleSwitch checked={tieneBeneficiario} onChange={toggleBeneficiario} label="Beneficiario de renta" />
          {tieneBeneficiario && <LinkText icon="chevron" onClick={addBeneficiario}>Agregar otros beneficiarios de renta</LinkText>}
        </div>
        {tieneBeneficiario && (
          <div className="flex flex-col gap-3">
            {beneficiarios.map((b, i) => (
              <CollapsiblePanel
                key={b.id}
                defaultOpen
                title={`Beneficiario de renta ${i + 1}`}
                right={
                  beneficiarios.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeBeneficiario(b.id); }}
                      className="inline-flex items-center gap-1 tags"
                      style={{ cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.8)" }}
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  )
                }
              >
                <EgresoFields
                  value={b}
                  onChange={(patch) => updateBeneficiario(b.id, patch)}
                  diaPago={{ value: b.diaPago, onChange: (v) => updateBeneficiario(b.id, { diaPago: v }) }}
                />
              </CollapsiblePanel>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
