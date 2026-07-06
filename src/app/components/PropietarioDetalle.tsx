import { useState } from "react";
import { ArrowLeft, Mail, Phone, MessageCircle, FileText, Crown, FileDown } from "lucide-react";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { StatusBadge } from "./kit/StatusBadge";
import { InfoField } from "./kit/InfoField";
import { SelectInput } from "./kit/SelectInput";
import { EmptyState } from "./kit/EmptyState";
import { Footer } from "./kit/Footer";
import type { PropietarioRow } from "./Propietarios";

interface Props {
  propietario: PropietarioRow;
  onBack: () => void;
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="rounded-lg flex flex-col gap-4"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
    >
      {children}
    </section>
  );
}

function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <span className="subtitle" style={{ color: "var(--navy)" }}>{title}</span>
        {right}
      </div>
      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
    </>
  );
}

function GroupDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3" style={{ marginTop: 4 }}>
      <span className="body-bold" style={{ color: "var(--navy)", whiteSpace: "nowrap" }}>{children}</span>
      <hr className="flex-1" style={{ borderColor: "var(--gray-4)", margin: 0 }} />
    </div>
  );
}

function ContactChip({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 body-small-regular rounded-full"
      style={{ backgroundColor: "var(--gray-1)", color: "var(--gray-10)", padding: "6px 12px", fontWeight: 500 }}
    >
      <Icon size={14} style={{ color: "var(--navy)" }} />
      {children}
    </span>
  );
}

const PREFERENCIA_OPTIONS = [
  { value: "telefono", label: "Teléfono" },
  { value: "celular", label: "Celular" },
  { value: "correo", label: "Correo electrónico" },
  { value: "whatsapp", label: "WhatsApp" },
];

const ANIO_OPTIONS = ["2026", "2025", "2024"].map((a) => ({ value: a, label: a }));
const MES_OPTIONS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
].map((m) => ({ value: m, label: m }));

export function PropietarioDetalle({ propietario, onBack }: Props) {
  const [editando, setEditando] = useState(false);
  const [preferencia, setPreferencia] = useState("");
  const [anio, setAnio] = useState("");
  const [mes, setMes] = useState("");
  const [inmueble, setInmueble] = useState("");

  const [n1 = "", n2 = "", a1 = "", a2 = ""] = propietario.nombre.split(" ");
  const inmuebleOptions = propietario.direccion ? [{ value: propietario.direccion, label: propietario.direccion }] : [];
  const puedeGenerar = !!anio && !!mes && !!inmueble;

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 body-bold w-fit"
        style={{ cursor: "pointer", color: "var(--navy)", background: "transparent" }}
      >
        <ArrowLeft size={16} /> Volver
      </button>

      {/* ── Encabezado ─────────────────────────────────────────────────── */}
      <section
        className="rounded-lg flex items-start justify-between gap-5 flex-wrap"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>{propietario.nombre}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge
              label={propietario.estado === "ejecucion" ? "En ejecución" : "No disponible"}
              variant={propietario.estado === "ejecucion" ? "active" : "rejected"}
            />
            {propietario.vip && (
              <span
                className="inline-flex items-center gap-1.5 tags-bold rounded-full"
                style={{ backgroundColor: "#FFF7E0", color: "#B7791F", padding: "3px 10px" }}
              >
                <Crown size={12} /> Cliente VIP
              </span>
            )}
            {propietario.inmobiliaria && (
              <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>{propietario.inmobiliaria}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ContactChip icon={Phone}>{propietario.telefono}</ContactChip>
          <ContactChip icon={Mail}>{propietario.correo}</ContactChip>
          <AppButton variant="secondary" bold>
            <MessageCircle size={15} /> Contactar
          </AppButton>
        </div>
      </section>

      {/* ── Información general ─────────────────────────────────────────── */}
      <SectionCard>
        <SectionHeader title="Información general" />

        <GroupDivider>Identificación</GroupDivider>
        <div className="grid grid-cols-4 gap-x-6 gap-y-5 max-lg:grid-cols-2">
          <InfoField label="Primer nombre" value={n1 || "—"} />
          <InfoField label="Segundo nombre" value={n2 || "—"} />
          <InfoField label="Primer apellido" value={a1 || "—"} />
          <InfoField label="Segundo apellido" value={a2 || "—"} />
          <InfoField label="Tipo de documento" value="Cédula de ciudadanía" />
          <InfoField label="Número del documento" value={propietario.cedula} />
          <InfoField label="Tipo de persona" value="No responsable de IVA" />
          <InfoField label="Edad" value="Sin información" />
        </div>

        <GroupDivider>Contacto</GroupDivider>
        <div className="grid grid-cols-4 gap-x-6 gap-y-5 max-lg:grid-cols-2">
          <InfoField
            label="Celular"
            value={
              <span className="inline-flex items-center gap-2">
                <MessageCircle size={15} style={{ color: "#25D366" }} /> {propietario.telefono}
              </span>
            }
          />
          <InfoField label="Teléfono" value={propietario.telefono} />
          <InfoField label="Correo electrónico" value={propietario.correo} />
          <InfoField label="Dirección correspondencia" value={propietario.direccion || "Sin información"} />
        </div>

        <GroupDivider>Relación comercial</GroupDivider>
        <div className="grid grid-cols-4 gap-x-6 gap-y-5 max-lg:grid-cols-2">
          <InfoField label="Fecha de vinculación" value="09 Jun 2026" />
          <InfoField label="Cliente Alquilando desde" value="09 Jun 2026" />
          <InfoField
            label="Estado de la relación"
            value={<StatusBadge label={propietario.estado === "ejecucion" ? "Activa" : "No disponible"} variant={propietario.estado === "ejecucion" ? "active" : "rejected"} />}
          />
          <InfoField label="Tipo de cliente" value="Propietario" />
        </div>
      </SectionCard>

      {/* ── Actualizar datos de contacto ───────────────────────────────── */}
      <SectionCard>
        <SectionHeader
          title="Actualizar datos de contacto"
          right={
            editando
              ? <LinkText icon="chevron" onClick={() => setEditando(false)}>Guardar</LinkText>
              : <LinkText icon="chevron" onClick={() => setEditando(true)}>Editar</LinkText>
          }
        />

        <div className="grid grid-cols-2 gap-x-6 gap-y-5 max-sm:grid-cols-1">
          <Field label="Teléfono" defaultValue={propietario.telefono} editando={editando} />
          <Field label="Email *" defaultValue={propietario.correo} editando={editando} />
          <Field label="Celular" placeholder="Escriba aquí" editando={editando} />
          <Field label="Dirección correspondencia *" defaultValue={propietario.direccion} placeholder="Escriba aquí" editando={editando} />
          <label className="flex flex-col gap-1.5">
            <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Preferencia del contacto *</span>
            <SelectInput options={PREFERENCIA_OPTIONS} value={preferencia} onChange={setPreferencia} className="w-full" />
          </label>
          <Field label="Contacto alternativo" placeholder="Escriba aquí" editando={editando} />
          <Field label="Relación" placeholder="Escriba aquí" editando={editando} />
          <Field label="Teléfono del contacto" placeholder="Escriba aquí" editando={editando} />
        </div>

        <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
          Última actualización de datos: 09 Jun 2026 · 22:18
        </span>
      </SectionCard>

      {/* ── Notas del usuario ──────────────────────────────────────────── */}
      <SectionCard>
        <SectionHeader title="Notas del usuario" />
        <EmptyState title="No hay notas disponibles" description="Aún no se han registrado notas para este propietario." />
      </SectionCard>

      {/* ── Contratos ──────────────────────────────────────────────────── */}
      <SectionCard>
        <SectionHeader title="Contratos" />
        <EmptyState title="No hay contratos" description="Este propietario aún no tiene contratos asociados." />
      </SectionCard>

      {/* ── Estados de cuenta ──────────────────────────────────────────── */}
      <SectionCard>
        <SectionHeader title="Estados de cuenta" />
        <p className="body-regular" style={{ color: "var(--gray-9)", margin: 0 }}>
          Toma el control de tus pagos y estados de cuenta de forma simple y segura.
        </p>
        <div className="flex items-end gap-4 flex-wrap">
          <label className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
            <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Selecciona un año *</span>
            <SelectInput options={ANIO_OPTIONS} value={anio} onChange={setAnio} placeholder="Año" className="w-full" />
          </label>
          <label className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
            <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Selecciona un mes *</span>
            <SelectInput options={MES_OPTIONS} value={mes} onChange={setMes} placeholder="Mes" className="w-full" />
          </label>
          <label className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
            <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>Selecciona un inmueble *</span>
            <SelectInput options={inmuebleOptions} value={inmueble} onChange={setInmueble} placeholder="Inmueble" className="w-full" />
          </label>
          <AppButton variant="primary" bold disabled={!puedeGenerar}>
            <FileDown size={15} /> Generar
          </AppButton>
        </div>
        <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
          Mantente al día con tus pagos y ten siempre a mano los documentos necesarios para tus trámites. ¡Fácil y rápido!
        </span>
      </SectionCard>

      {/* ── Documentos del usuario ─────────────────────────────────────── */}
      <SectionCard>
        <SectionHeader title="Documentos del usuario" />
        <div
          className="flex flex-col items-center gap-2 rounded-lg text-center"
          style={{ backgroundColor: "var(--gray-1)", padding: "28px" }}
        >
          <FileText size={26} style={{ color: "var(--gray-6)" }} />
          <span className="body-bold" style={{ color: "var(--gray-9)" }}>0 archivos en total</span>
          <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
            Este propietario aún no tiene documentos cargados.
          </span>
        </div>
      </SectionCard>

      <Footer />
    </div>
  );
}

function Field({ label, defaultValue, placeholder, editando }: { label: string; defaultValue?: string; placeholder?: string; editando: boolean }) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <label className="flex flex-col gap-1.5">
      <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={!editando}
        onChange={(e) => setValue(e.target.value)}
        className="body-regular w-full"
        style={{
          border: "1px solid var(--gray-5)",
          borderRadius: "var(--radius-md)",
          padding: "0 12px",
          height: 40,
          color: "var(--gray-10)",
          outline: "none",
          backgroundColor: editando ? "#ffffff" : "var(--gray-1)",
          cursor: editando ? "text" : "not-allowed",
        }}
        onFocus={(e) => { if (editando) e.currentTarget.style.borderColor = "var(--navy)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--gray-5)"; }}
      />
    </label>
  );
}
