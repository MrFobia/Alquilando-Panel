import { useState } from "react";
import { ArrowLeft, MessageCircle, CheckCircle2, Eye } from "lucide-react";
import { IconButton } from "./kit/IconButton";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { StatusBadge } from "./kit/StatusBadge";
import { SelectInput } from "./kit/SelectInput";
import { Stepper } from "./kit/Stepper";
import { InfoField } from "./kit/InfoField";
import { DocumentCard } from "./kit/DocumentCard";
import { FileDropzone } from "./kit/FileDropzone";
import { ProgressBar } from "./kit/ProgressBar";
import { Footer } from "./kit/Footer";
import { DataTable } from "./kit/DataTable";
import { TabBar } from "./kit/TabBar";

const STEPS = [
  { id: "registrado", label: "Registrado" },
  { id: "docs", label: "Validación Docs" },
  { id: "antecedentes", label: "Antecedentes" },
  { id: "firma", label: "Firma Contrato" },
  { id: "capacitacion", label: "Capacitación" },
];

const INITIAL_DOCS = [
  { name: "Cedula.pdf", meta: "PDF · 1,2 MB" },
  { name: "RUT_Actualizado.pdf", meta: "PDF · 840 KB" },
  { name: "Cert_Bancaria_Bco.pdf", meta: "PDF · 512 KB" },
  { name: "Ref_Comercial_C21.pdf", meta: "PDF · 1,8 MB" },
];

const ANTECEDENTES = ["Policía", "Procuraduría", "Contraloría"];

const ANTECEDENTE_OPTIONS = [
  { value: "sin", label: "Sin antecedentes" },
  { value: "con", label: "Con antecedentes" },
];

const CONTRATO_INCLUSION_BADGE = {
  sin: { label: "Sin contrato", variant: "neutral" as const },
  espera: { label: "En espera de firma", variant: "pending" as const },
  firmado: { label: "Firmado", variant: "active" as const },
};

const INMUEBLES_COLUMNS = [
  { key: "id", header: "ID", width: 90 },
  { key: "fecha", header: "Fecha", width: 110 },
  { key: "direccion", header: "Dirección" },
  { key: "tipo", header: "Tipo", width: 120 },
  { key: "zona", header: "Zona", width: 110 },
  { key: "estado", header: "Estado", width: 130 },
  { key: "contrato", header: "Contrato inclusión", width: 160 },
];

const CAPTACION_COLUMNS = [...INMUEBLES_COLUMNS, { key: "acciones", header: "Acciones", width: 90 }];

const INMUEBLES_CAPTACION = [
  { id: "INM-2031", direccion: "Cra 15 # 93-47, Apto 502", tipo: "Apartamento", zona: "Norte", estado: { label: "En revisión", variant: "pending" as const }, contrato: "espera" as const, fecha: "08 May 2026" },
  { id: "INM-2044", direccion: "Cl 127 # 7-30, Casa 12", tipo: "Casa", zona: "Noroccidente", estado: { label: "Borrador", variant: "neutral" as const }, contrato: "sin" as const, fecha: "02 May 2026" },
];

const INMUEBLES_COMERCIALIZACION = [
  { id: "INM-1987", direccion: "Cra 9 # 80-15, Apto 301", tipo: "Apartamento", zona: "Norte", estado: { label: "Publicado", variant: "active" as const }, contrato: "firmado" as const, fecha: "20 Mar 2026" },
  { id: "INM-1998", direccion: "Av 19 # 104-22, Apto 802", tipo: "Apartamento", zona: "Oeste", estado: { label: "Arrendado", variant: "registered" as const }, contrato: "firmado" as const, fecha: "11 Feb 2026" },
  { id: "INM-2005", direccion: "Cl 76 # 11-50, Local 3", tipo: "Local comercial", zona: "Sur", estado: { label: "Publicado", variant: "active" as const }, contrato: "espera" as const, fecha: "30 Ene 2026" },
];

const ASESOR_OPTIONS = [
  { value: "sin", label: "Sin asignación" },
  { value: "angie", label: "Angie / Bogotá" },
  { value: "ruby", label: "Ruby / Caribe" },
];

interface BrokerDetail {
  id: string;
  nombre: string;
  celular?: string;
  asesor: string;
  estadoBroker?: "activo" | "inactivo" | "rechazado";
}

interface Props {
  broker: BrokerDetail;
  onBack: () => void;
  onApprove?: () => void;
  onInactivate?: () => void;
  onViewInmueble?: (inmueble: (typeof INMUEBLES_CAPTACION)[number]) => void;
}

function SectionCard({ children, padding = 24, className = "" }: { children: React.ReactNode; padding?: number; className?: string }) {
  return (
    <section
      className={`rounded-lg flex flex-col gap-4 ${className}`}
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding }}
    >
      {children}
    </section>
  );
}

function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <span className="subtitle" style={{ color: "var(--navy)" }}>{title}</span>
      {right && <div className="flex items-center gap-3 shrink-0">{right}</div>}
    </div>
  );
}

/** Wraps a disabled action with the "approve previous step first" hint. */
function Gated({ blocked, children }: { blocked: boolean; children: React.ReactNode }) {
  return (
    <span title={blocked ? "Primero debe aprobar el paso anterior" : undefined}>
      {children}
    </span>
  );
}

export function BrokerDetalle({ broker, onBack, onApprove, onInactivate, onViewInmueble }: Props) {
  const isActiveBroker = broker.estadoBroker === "activo";

  // Step 0 (Registrado) is completed on arrival; `current` is the step being worked on.
  const [current, setCurrent] = useState(1);
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [antecedentes, setAntecedentes] = useState<Record<string, string>>(
    Object.fromEntries(ANTECEDENTES.map((a) => [a, "sin"])),
  );
  const [contratoEnviado, setContratoEnviado] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [asesor, setAsesor] = useState("sin");
  const [brokerTab, setBrokerTab] = useState("captacion");

  const allDone = current >= STEPS.length;
  const approveStep = (step: number) => { if (current === step) setCurrent(step + 1); };

  const [nombre1 = "-", nombre2 = "-", apellido1 = "-", apellido2 = "-"] = broker.nombre.split(" ");

  const estadoActual = allDone
    ? { label: "Activo", variant: "active" as const }
    : { label: STEPS[current].label, variant: "pending" as const };

  const BROKER_TAB_TITLES: Record<string, string> = {
    captacion: "Inmuebles en Captación",
    comercializacion: "Inmuebles en Comercialización",
    perfil: "Perfil del Broker",
  };

  const docsDone = current > 1;
  const antecedentesDone = current > 2;
  const firmaDone = current > 3;

  const avanzarCapacitacion = () => {
    const next = Math.min(100, progreso + 25);
    setProgreso(next);
    if (next === 100) approveStep(4);
  };

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 body-bold w-fit"
        style={{ cursor: "pointer", color: "var(--navy)", background: "transparent" }}
      >
        <ArrowLeft size={16} /> Volver a Brokers
      </button>

      <section
        className="rounded-lg flex items-start justify-between gap-4 flex-wrap"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>{broker.nombre}</h1>
          <span className="subtitle" style={{ color: "var(--gray-10)" }}>
            {isActiveBroker ? `Código: ${broker.id}` : "Evaluación de Postulante"}
          </span>
          <div><StatusBadge label={isActiveBroker ? "Activo" : estadoActual.label} variant={isActiveBroker ? "active" : estadoActual.variant} /></div>
        </div>
        <div className="flex items-end gap-4 shrink-0">
          {isActiveBroker ? (
            <AppButton variant="danger" bold onClick={onInactivate}>Inactivar broker</AppButton>
          ) : (
            <>
              <AppButton variant="secondary" bold>Rechazar perfil</AppButton>
              <Gated blocked={!allDone}>
                <AppButton variant="primary" bold disabled={!allDone} onClick={onApprove}>Aprobar y activar</AppButton>
              </Gated>
            </>
          )}
        </div>
      </section>

      {!isActiveBroker && (
        <SectionCard padding={20}>
          <Stepper steps={STEPS} current={current} />
        </SectionCard>
      )}

      {/* ── Perfil / Inmuebles (broker activo) o Datos del Postulante ───── */}
      {isActiveBroker ? (
        <>
          <TabBar
            tabs={[
              { id: "captacion", label: "Captación", count: INMUEBLES_CAPTACION.length },
              { id: "comercializacion", label: "Comercialización", count: INMUEBLES_COMERCIALIZACION.length },
              { id: "perfil", label: "Perfil" },
            ]}
            active={brokerTab}
            onChange={setBrokerTab}
          />

          <SectionCard>
            <SectionHeader
              title={BROKER_TAB_TITLES[brokerTab]}
              right={brokerTab === "perfil" ? <LinkText icon="chevron">Editar</LinkText> : undefined}
            />
            <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

          {brokerTab === "perfil" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-x-6 gap-y-5 max-lg:grid-cols-2">
                <InfoField label="Tipo de persona" value="Natural" />
                <InfoField label="Tipo de documento" value="Cédula de ciudadanía" />
                <InfoField label="Número del documento" value={broker.id} />
                <InfoField label="Fecha de postulación" value="14 May 2026" />
                <InfoField label="Primer nombre" value={nombre1} />
                <InfoField label="Segundo nombre" value={nombre2} />
                <InfoField label="Primer apellido" value={apellido1} />
                <InfoField label="Segundo apellido" value={apellido2} />
                <InfoField
                  label="Celular"
                  value={
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle size={16} style={{ color: "#25D366" }} />
                      {broker.celular ?? "+57 310 987 6543"}
                    </span>
                  }
                />
                <InfoField label="Correo electrónico" value="laura.rojas@gmail.com" />
                <InfoField label="Dirección correspondencia" value="CL 81 # 109 - 10 AP 203" fullWidth={false} />
                <InfoField
                  label="Asesor comercial a cargo"
                  value={<SelectInput options={ASESOR_OPTIONS} value={asesor} onChange={setAsesor} className="w-full max-w-[220px]" />}
                />
              </div>

              <div className="flex items-center gap-3" style={{ marginTop: 8 }}>
                <span className="body-bold" style={{ color: "var(--navy)", whiteSpace: "nowrap" }}>
                  Ubicación y Experiencia Comercial
                </span>
                <hr className="flex-1" style={{ borderColor: "var(--gray-5)", margin: 0 }} />
              </div>

              <div className="grid grid-cols-4 gap-x-6 gap-y-5 max-lg:grid-cols-2">
                <InfoField label="Ciudad" value="Bogotá" />
                <InfoField label="Zona" value="Occidente" />
                <InfoField label="Años de experiencia comercial" value="3 años" />
                <InfoField label="Vínculos inmobiliarios" value="Independiente" />
              </div>

              <div className="rounded-lg" style={{ backgroundColor: "var(--gray-1)", padding: "14px 16px" }}>
                <InfoField
                  label="Experiencia"
                  value={
                    <span className="body-regular" style={{ fontWeight: 400, color: "var(--gray-9)" }}>
                      Nací y crecí viendo evolucionar esta ciudad, lo que me da una perspectiva única que ningún
                      algoritmo puede ofrecer. Mi experiencia es la suma de años de relaciones directas, cierres
                      exitosos y un ojo entrenado para detectar oportunidades donde otros no ven nada. No solo busco
                      propiedades; encuentro el lugar exacto donde tu visión y la realidad se conectan.
                    </span>
                  }
                />
              </div>
            </div>
          )}

          {brokerTab === "captacion" && (
            INMUEBLES_CAPTACION.length > 0 ? (
              <DataTable
                columns={CAPTACION_COLUMNS}
                rows={INMUEBLES_CAPTACION.map((r) => ({
                  ...r,
                  estado: <StatusBadge label={r.estado.label} variant={r.estado.variant} />,
                  contrato: <StatusBadge label={CONTRATO_INCLUSION_BADGE[r.contrato].label} variant={CONTRATO_INCLUSION_BADGE[r.contrato].variant} />,
                  acciones: <IconButton icon={Eye} title="Ver inmueble" onClick={() => onViewInmueble?.(r)} />,
                }))}
              />
            ) : (
              <p className="body-regular" style={{ color: "var(--gray-8)", margin: 0 }}>
                Este broker no tiene inmuebles en proceso de captación.
              </p>
            )
          )}

          {brokerTab === "comercializacion" && (
            INMUEBLES_COMERCIALIZACION.length > 0 ? (
              <DataTable
                columns={INMUEBLES_COLUMNS}
                rows={INMUEBLES_COMERCIALIZACION.map((r) => ({
                  ...r,
                  estado: <StatusBadge label={r.estado.label} variant={r.estado.variant} />,
                  contrato: <StatusBadge label={CONTRATO_INCLUSION_BADGE[r.contrato].label} variant={CONTRATO_INCLUSION_BADGE[r.contrato].variant} />,
                }))}
              />
            ) : (
              <p className="body-regular" style={{ color: "var(--gray-8)", margin: 0 }}>
                Este broker no tiene inmuebles en comercialización.
              </p>
            )
          )}
          </SectionCard>
        </>
      ) : (
        <SectionCard>
          <SectionHeader title="Datos del Postulante" right={<LinkText icon="chevron">Editar</LinkText>} />
          <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

          <div className="grid grid-cols-4 gap-x-6 gap-y-5 max-lg:grid-cols-2">
            <InfoField label="Tipo de persona" value="Natural" />
            <InfoField label="Tipo de documento" value="Cédula de ciudadanía" />
            <InfoField label="Número del documento" value={broker.id} />
            <InfoField label="Fecha de postulación" value="14 May 2026" />
            <InfoField label="Primer nombre" value={nombre1} />
            <InfoField label="Segundo nombre" value={nombre2} />
            <InfoField label="Primer apellido" value={apellido1} />
            <InfoField label="Segundo apellido" value={apellido2} />
            <InfoField
              label="Celular"
              value={
                <span className="inline-flex items-center gap-2">
                  <MessageCircle size={16} style={{ color: "#25D366" }} />
                  {broker.celular ?? "+57 310 987 6543"}
                </span>
              }
            />
            <InfoField label="Correo electrónico" value="laura.rojas@gmail.com" />
            <InfoField label="Dirección correspondencia" value="CL 81 # 109 - 10 AP 203" fullWidth={false} />
            <InfoField
              label="Asesor comercial a cargo"
              value={<SelectInput options={ASESOR_OPTIONS} value={asesor} onChange={setAsesor} className="w-full max-w-[220px]" />}
            />
          </div>

          <div className="flex items-center gap-3" style={{ marginTop: 8 }}>
            <span className="body-bold" style={{ color: "var(--navy)", whiteSpace: "nowrap" }}>
              Ubicación y Experiencia Comercial
            </span>
            <hr className="flex-1" style={{ borderColor: "var(--gray-5)", margin: 0 }} />
          </div>

          <div className="grid grid-cols-4 gap-x-6 gap-y-5 max-lg:grid-cols-2">
            <InfoField label="Ciudad" value="Bogotá" />
            <InfoField label="Zona" value="Occidente" />
            <InfoField label="Años de experiencia comercial" value="3 años" />
            <InfoField label="Vínculos inmobiliarios" value="Independiente" />
          </div>

          <div className="rounded-lg" style={{ backgroundColor: "var(--gray-1)", padding: "14px 16px" }}>
            <InfoField
              label="Experiencia"
              value={
                <span className="body-regular" style={{ fontWeight: 400, color: "var(--gray-9)" }}>
                  Nací y crecí viendo evolucionar esta ciudad, lo que me da una perspectiva única que ningún
                  algoritmo puede ofrecer. Mi experiencia es la suma de años de relaciones directas, cierres
                  exitosos y un ojo entrenado para detectar oportunidades donde otros no ven nada. No solo busco
                  propiedades; encuentro el lugar exacto donde tu visión y la realidad se conectan.
                </span>
              }
            />
          </div>
        </SectionCard>
      )}

      {!isActiveBroker && (
      <>
      {/* ── Paso 2: Documentos ─────────────────────────────────────────── */}
      <SectionCard>
        <SectionHeader
          title="Documentos cargados en la postulación"
          right={
            <>
              <StatusBadge label={docsDone ? "Aprobado" : "Pendiente"} variant={docsDone ? "active" : "pending"} />
              {!docsDone && (
                <AppButton variant="primary" bold onClick={() => approveStep(1)}>Aprobar documentos</AppButton>
              )}
            </>
          }
        />
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {docs.map((doc) => (
            <DocumentCard
              key={doc.name}
              name={doc.name}
              meta={doc.meta}
              onView={() => {}}
              onDownload={() => {}}
              onDelete={docsDone ? undefined : () => setDocs((d) => d.filter((x) => x.name !== doc.name))}
            />
          ))}
        </div>

        {!docsDone && (
          <FileDropzone
            onFiles={(files) =>
              setDocs((d) => [
                ...d,
                ...files
                  .filter((f) => !d.some((x) => x.name === f.name))
                  .map((f) => ({ name: f.name, meta: `${(f.size / 1024).toFixed(0)} KB` })),
              ])
            }
          />
        )}

        <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
          {docs.length} {docs.length === 1 ? "archivo" : "archivos"} en total
        </span>
      </SectionCard>

      {/* ── Paso 3: Antecedentes ───────────────────────────────────────── */}
      <SectionCard>
        <SectionHeader
          title="Validación de Antecedentes"
          right={
            <>
              <StatusBadge label={antecedentesDone ? "Aprobado" : "Pendiente"} variant={antecedentesDone ? "active" : "pending"} />
              {!antecedentesDone && (
                <Gated blocked={current < 2}>
                  <AppButton variant="primary" bold disabled={current < 2} onClick={() => approveStep(2)}>
                    Aprobar antecedentes
                  </AppButton>
                </Gated>
              )}
            </>
          }
        />
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        <div className="flex items-stretch gap-6 flex-wrap">
          {ANTECEDENTES.map((nombre, i) => (
            <div key={nombre} className="flex items-stretch gap-6 flex-1 min-w-[220px]">
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="body-bold" style={{ color: "var(--gray-10)" }}>{nombre}</span>
                  <LinkText size="small" disabled={antecedentesDone}>Validar antecedente</LinkText>
                </div>
                <SelectInput
                  options={ANTECEDENTE_OPTIONS}
                  value={antecedentes[nombre]}
                  onChange={(v) => !antecedentesDone && setAntecedentes((prev) => ({ ...prev, [nombre]: v }))}
                />
              </div>
              {i < ANTECEDENTES.length - 1 && (
                <div style={{ width: 1, backgroundColor: "var(--gray-5)" }} />
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Pasos 4 y 5 ────────────────────────────────────────────────── */}
      <div className="flex gap-6 flex-wrap items-stretch">
        <SectionCard className="flex-1 min-w-[300px]">
          <SectionHeader
            title="Formalización de Vinculación"
            right={
              <StatusBadge
                label={firmaDone ? "Firmado" : contratoEnviado ? "Pendiente de firma" : "Sin enviar"}
                variant={firmaDone ? "active" : contratoEnviado ? "pending" : "neutral"}
              />
            }
          />
          <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
          <p className="body-regular" style={{ color: "var(--gray-9)", margin: 0 }}>
            El broker debe firmar electrónicamente las políticas y términos de Alquilando.
          </p>
          <div className="flex items-center gap-4 mt-auto">
            {!contratoEnviado ? (
              <Gated blocked={current < 3}>
                <AppButton variant="primary" bold disabled={current < 3} onClick={() => setContratoEnviado(true)}>
                  Enviar contrato
                </AppButton>
              </Gated>
            ) : !firmaDone ? (
              <>
                <AppButton variant="primary" bold onClick={() => approveStep(3)}>Confirmar firma</AppButton>
                <LinkText size="small">Reenviar contrato</LinkText>
              </>
            ) : (
              <span className="inline-flex items-center gap-2 body-regular" style={{ color: "var(--green-status)" }}>
                <CheckCircle2 size={16} /> Contrato firmado electrónicamente
              </span>
            )}
          </div>
        </SectionCard>

        <SectionCard className="flex-1 min-w-[300px]">
          <SectionHeader
            title="Tutoriales y Capacitación"
            right={
              <StatusBadge
                label={progreso === 100 ? "Completada" : "Pendiente"}
                variant={progreso === 100 ? "active" : "pending"}
              />
            }
          />
          <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
          <p className="body-regular" style={{ color: "var(--gray-9)", margin: 0 }}>
            Progreso de consumo de material educativo obligatorio en la academia.
          </p>
          <ProgressBar value={progreso} />
          {progreso < 100 && (
            <div className="mt-auto">
              <Gated blocked={current < 4}>
                <AppButton variant="secondary" bold disabled={current < 4} onClick={avanzarCapacitacion}>
                  Registrar avance
                </AppButton>
              </Gated>
            </div>
          )}
        </SectionCard>
      </div>

      <section
        className="rounded-lg flex items-center justify-end gap-4 flex-wrap"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "16px 24px" }}
      >
        <AppButton variant="secondary" bold>Rechazar perfil</AppButton>
        <Gated blocked={!allDone}>
          <AppButton variant="primary" bold disabled={!allDone} onClick={onApprove}>Aprobar y activar</AppButton>
        </Gated>
      </section>
      </>
      )}

      <Footer />
    </div>
  );
}
