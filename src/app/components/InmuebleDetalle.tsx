import { useState } from "react";
import { ArrowLeft, Image as ImageIcon, Star, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import { AppButton } from "./kit/AppButton";
import { LinkText } from "./kit/LinkText";
import { StatusBadge } from "./kit/StatusBadge";
import { TabBar } from "./kit/TabBar";
import { Footer } from "./kit/Footer";
import { EmptyState } from "./kit/EmptyState";
import { FileDropzone } from "./kit/FileDropzone";
import { TextInput } from "./kit/TextInput";
import { Callout } from "./kit/Callout";

const MIN_FOTOS = 12;
const DESCRIPCION_INICIAL =
  "Hermoso apartamento en el corazón de Suba, con excelente iluminación natural, acabados de lujo y zonas comunes de primer nivel. Ideal para familias que buscan comodidad y seguridad.";
const CARACTERISTICAS_INICIALES = ["Pent-house", "3 alcobas", "2 baños", "Balcón", "Vista a los cerros"];

const CONTRATO_INCLUSION_BADGE = {
  sin: { label: "Sin contrato", variant: "neutral" as const },
  espera: { label: "En espera de firma", variant: "pending" as const },
  firmado: { label: "Firmado", variant: "active" as const },
};

export interface InmuebleData {
  id: string;
  direccion: string;
  tipo: string;
  zona: string;
  estado: { label: string; variant: "draft" | "pending" | "registered" | "active" | "rejected" | "neutral" };
  contrato: keyof typeof CONTRATO_INCLUSION_BADGE;
  fecha: string;
}

interface Props {
  inmueble: InmuebleData;
  onBack: () => void;
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-lg flex flex-col gap-4 ${className}`}
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: 16 }}
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

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 w-full">
      <span className="body-bold shrink-0" style={{ color: "var(--gray-10)" }}>{label}</span>
      <span className="body-regular text-right" style={{ color: "var(--gray-9)" }}>{value}</span>
    </div>
  );
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return <span className="body-bold w-full" style={{ color: "var(--navy)" }}>{children}</span>;
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={16} fill={i < value ? "#FFC107" : "none"} style={{ color: i < value ? "#FFC107" : "var(--gray-5)" }} />
      ))}
    </div>
  );
}

const TABS = [
  { id: "general", label: "Información general" },
  { id: "leads", label: "Leads" },
  { id: "notas", label: "Notas generales" },
  { id: "historial", label: "Historial" },
];

const CARACTERISTICAS_GENERALES = [
  ["Edificio", "Pañete, Mármol"],
  ["Características específicas", "Pent-house"],
  ["Distribución", "Duplex"],
  ["Descripción interna", "Hall de entrada, salón comedor"],
  ["Alcobas", "3"],
  ["Baños", "2"],
  ["Cocina", "Americana, independiente"],
  ["Balcón", "Sí"],
  ["Sótano", "1"],
  ["Zonas comunes", "Tenis, Piscina, Gimnasio, Guardería"],
  ["Vista", "Vista a los cerros"],
];

const AREAS_ADICIONALES = [
  ["Chimenea", "Sí"],
  ["Pisos", "Madera"],
  ["Piscina", "1"],
  ["Patio", "Sí"],
  ["Parqueadero", "1"],
  ["Bodega", "Sí"],
  ["Citófono", "Sí"],
  ["Planta eléctrica", "Suplencia total"],
  ["Depósito", "Sí"],
];

export function InmuebleDetalle({ inmueble, onBack }: Props) {
  const [tab, setTab] = useState("general");
  const contratoInclusion = CONTRATO_INCLUSION_BADGE[inmueble.contrato];

  const [editandoPublicacion, setEditandoPublicacion] = useState(false);
  const [fotos, setFotos] = useState<File[]>([]);
  const [fotosGuardadas, setFotosGuardadas] = useState<File[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [descripcion, setDescripcion] = useState(DESCRIPCION_INICIAL);
  const [caracteristicas, setCaracteristicas] = useState<string[]>(CARACTERISTICAS_INICIALES);
  const [caractInput, setCaractInput] = useState("");

  const agregarCaracteristica = () => {
    const value = caractInput.trim();
    if (value && !caracteristicas.includes(value)) {
      setCaracteristicas((prev) => [...prev, value]);
    }
    setCaractInput("");
  };

  const cancelarEdicion = () => {
    setFotos([]);
    setDescripcion(DESCRIPCION_INICIAL);
    setCaracteristicas(CARACTERISTICAS_INICIALES);
    setCaractInput("");
    setEditandoPublicacion(false);
  };

  const infoCompleta = fotos.length >= MIN_FOTOS && descripcion.trim().length > 0 && caracteristicas.length > 0;
  const puedePublicar = fotosGuardadas.length > 0 && descripcion.trim().length > 0;

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
        className="rounded-lg flex items-start justify-between gap-4 flex-wrap"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>Datos del inmueble</h1>
          <span className="subtitle" style={{ color: "var(--gray-10)" }}>
            Toda la información de tus propiedades en un solo lugar.
          </span>
        </div>
        <div className="flex items-end gap-4 shrink-0">
          <AppButton variant="secondary" bold>No aprobar</AppButton>
          <span title={!puedePublicar ? "La publicación necesita al menos una foto y una descripción" : undefined}>
            <AppButton variant="primary" bold disabled={!puedePublicar}>Publicar inmueble</AppButton>
          </span>
        </div>
      </section>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab !== "general" ? (
        <SectionCard>
          <EmptyState title="Sección en construcción" description="Esta información estará disponible próximamente." />
        </SectionCard>
      ) : (
        <div className="flex gap-6 flex-wrap items-start max-lg:flex-col">
          {/* ── Columna izquierda ─────────────────────────────────────── */}
          <div className="flex flex-col gap-6 flex-1 min-w-[320px]">
            <SectionCard>
              <SectionHeader
                title="Publicación"
                right={
                  !editandoPublicacion && (
                    <LinkText icon="chevron" onClick={() => { setFotos(fotosGuardadas); setEditandoPublicacion(true); }}>
                      Editar publicación
                    </LinkText>
                  )
                }
              />

              {editandoPublicacion ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>
                      Fotos de la publicación ({fotos.length}/{MIN_FOTOS} mínimo)
                    </span>
                    <FileDropzone
                      hint={`Selecciona o arrastra mínimo ${MIN_FOTOS} fotos`}
                      onFiles={(files) => setFotos((prev) => [...prev, ...files])}
                    />
                    {fotos.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 max-sm:grid-cols-2">
                        {fotos.map((f, i) => (
                          <div
                            key={`${f.name}-${i}`}
                            className="relative rounded-lg overflow-hidden flex items-center justify-center"
                            style={{ height: 80, backgroundColor: "var(--gray-2)" }}
                          >
                            <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                            <button
                              onClick={() => setFotos((prev) => prev.filter((_, idx) => idx !== i))}
                              className="absolute flex items-center justify-center rounded-full"
                              style={{ top: 4, right: 4, width: 20, height: 20, backgroundColor: "rgba(0,0,0,0.55)", cursor: "pointer" }}
                            >
                              <X size={12} style={{ color: "#ffffff" }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>Descripción</span>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      rows={4}
                      className="body-regular w-full"
                      style={{
                        border: "1px solid var(--gray-5)",
                        borderRadius: "var(--radius-md)",
                        padding: 12,
                        color: "var(--gray-10)",
                        outline: "none",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>Características del inmueble</span>
                    <TextInput
                      placeholder="Escribe una característica y presiona Enter"
                      value={caractInput}
                      onChange={setCaractInput}
                      onEnter={agregarCaracteristica}
                    />
                    {caracteristicas.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {caracteristicas.map((c, i) => (
                          <span
                            key={`${c}-${i}`}
                            className="tags-bold inline-flex items-center gap-1 rounded-full"
                            style={{ backgroundColor: "var(--navy-light)", color: "var(--navy)", padding: "4px 10px" }}
                          >
                            {c}
                            <button
                              onClick={() => setCaracteristicas((prev) => prev.filter((_, idx) => idx !== i))}
                              style={{ cursor: "pointer", background: "transparent", display: "flex" }}
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {infoCompleta ? (
                    <Callout variant="info" title="Información completa">
                      La publicación cumple con el mínimo de fotos, descripción y características. Puedes guardar los cambios.
                    </Callout>
                  ) : (
                    <Callout variant="warning" title="Revisa la información">
                      Faltan datos por completar: mínimo {MIN_FOTOS} fotos, una descripción y al menos una característica.
                    </Callout>
                  )}

                  <div className="flex items-center justify-end gap-3">
                    <AppButton variant="secondary" bold onClick={cancelarEdicion}>Cancelar</AppButton>
                    <AppButton
                      variant="primary"
                      bold
                      onClick={() => {
                        setFotosGuardadas(fotos);
                        setSlideIndex(0);
                        setEditandoPublicacion(false);
                      }}
                    >
                      Guardar
                    </AppButton>
                  </div>
                </div>
              ) : (
                <>
                  {fotosGuardadas.length > 0 ? (
                    <div
                      className="relative rounded-lg overflow-hidden flex items-center justify-center"
                      style={{ height: 180, backgroundColor: "var(--gray-2)" }}
                    >
                      <img
                        src={URL.createObjectURL(fotosGuardadas[slideIndex])}
                        alt={`Foto ${slideIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {fotosGuardadas.length > 1 && (
                        <>
                          <button
                            onClick={() => setSlideIndex((i) => (i - 1 + fotosGuardadas.length) % fotosGuardadas.length)}
                            className="absolute flex items-center justify-center rounded-full"
                            style={{ left: 8, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, backgroundColor: "rgba(0,0,0,0.45)", cursor: "pointer" }}
                          >
                            <ChevronLeft size={18} style={{ color: "#ffffff" }} />
                          </button>
                          <button
                            onClick={() => setSlideIndex((i) => (i + 1) % fotosGuardadas.length)}
                            className="absolute flex items-center justify-center rounded-full"
                            style={{ right: 8, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, backgroundColor: "rgba(0,0,0,0.45)", cursor: "pointer" }}
                          >
                            <ChevronRight size={18} style={{ color: "#ffffff" }} />
                          </button>
                          <div className="absolute flex gap-1.5" style={{ bottom: 8, left: "50%", transform: "translateX(-50%)" }}>
                            {fotosGuardadas.map((_, i) => (
                              <span
                                key={i}
                                className="rounded-full"
                                style={{ width: 6, height: 6, backgroundColor: i === slideIndex ? "#ffffff" : "rgba(255,255,255,0.5)" }}
                              />
                            ))}
                          </div>
                          <span
                            className="absolute tags-bold rounded-full"
                            style={{ top: 8, right: 8, padding: "2px 8px", backgroundColor: "rgba(0,0,0,0.45)", color: "#ffffff" }}
                          >
                            {slideIndex + 1}/{fotosGuardadas.length}
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div
                      className="rounded-lg flex items-center justify-center"
                      style={{ height: 180, backgroundColor: "var(--gray-2)" }}
                    >
                      <ImageIcon size={32} style={{ color: "var(--gray-6)" }} />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>Descripción</span>
                    <p className="body-regular" style={{ color: "var(--gray-9)", margin: 0 }}>{descripcion}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="body-bold" style={{ color: "var(--gray-10)" }}>Características</span>
                    <div className="flex flex-wrap gap-2">
                      {caracteristicas.map((c) => (
                        <span
                          key={c}
                          className="tags-bold rounded-full"
                          style={{ backgroundColor: "var(--navy-light)", color: "var(--navy)", padding: "4px 10px" }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

                  <Row label="Estado de la publicación" value={<StatusBadge label="Sin publicar" variant="neutral" />} />
                  <Row label="ID de Alquilando" value="1436" />
                  <Row label="ID de Domus" value="Aún no se ha creado en Domus" />
                  <Row label="ID de Simi" value="2546" />
                  <Row label="Enlace de la publicación" value={<LinkText size="small">Apartamento en arriendo - {inmueble.zona}</LinkText>} />
                  <Row label="Plataformas publicadas" value="Finca raíz, Metro cuadrado, Cien cuadras" />
                  <Row label="Fecha de publicación" value="15/05/2024" />
                  <Row label="Publicado por" value="Andrés Rodríguez" />
                </>
              )}
            </SectionCard>

            <SectionCard>
              <SectionHeader title="Planes y términos" right={<LinkText icon="chevron">Modificar</LinkText>} />
              <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
              <Row label="Plan seleccionado" value="Sin plan seleccionado" />
              <Row label="Términos y condiciones contrato de inclusión" value="Firmado" />
            </SectionCard>

            <SectionCard>
              <SectionHeader title="Contrato" right={<LinkText icon="chevron">Ver información</LinkText>} />
              <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

              <Row label="Estado del contrato de arrendamiento" value={<StatusBadge label="No firmado" variant="neutral" />} />
              <Row label="Estado del contrato de mandato" value={<StatusBadge label="No firmado" variant="neutral" />} />
              <Row label="Estado del contrato de inclusión" value={<StatusBadge label={contratoInclusion.label} variant={contratoInclusion.variant} />} />

              <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

              <GroupTitle>Datos del Inquilino</GroupTitle>
              <Row label="Inquilino" value={<LinkText size="small">Andrea Camargo Lozano</LinkText>} />
              <Row label="Número de documento" value="1.026.557.487" />
              <Row label="Teléfono" value="301 456 4434" />
              <Row label="Correo electrónico" value="propietario@gmail.com" />

              <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

              <GroupTitle>Datos del propietario</GroupTitle>
              <Row label="Nombre del propietario" value={<LinkText size="small">Andrés Camargo</LinkText>} />
              <Row label="Número de documento" value="1.234.676.354" />
              <Row label="Teléfono" value="301 456 4434" />
              <Row label="Correo electrónico" value="propietario@gmail.com" />
            </SectionCard>

            <SectionCard>
              <SectionHeader title="Costo del inmueble" />
              <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
              <Row label="Canon mensual" value="$ 1.456.900" />
              <Row label="Administración" value="$ 230.000" />
              <Row label="Administración incluida" value="Sí" />
              <Row label="Valor total mensual" value="No" />
              <Row label="Depósito requerido" value="No" />
            </SectionCard>
          </div>

          {/* ── Columna derecha ───────────────────────────────────────── */}
          <div className="flex flex-col gap-6 flex-1 min-w-[320px]">
            <SectionCard>
              <SectionHeader title="Inmueble" right={<LinkText icon="chevron">Ver información completa</LinkText>} />
              <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

              <Row label="Estado del inmueble" value={<StatusBadge label={inmueble.estado.label} variant={inmueble.estado.variant} />} />
              <Row label="Nombre de la Inmobiliaria" value="Fonnegra Gerlein" />
              <Row label="Fecha de captación" value={inmueble.fecha} />
              <Row label="Tipo de inmueble" value={inmueble.tipo} />
              <Row label="La propiedad está ocupada" value="No" />
              <Row label="Llaves Fonnegra Gerlein S.A." value="No" />
              <Row label="Calificación del inmueble" value={<Stars value={4} />} />
              <Row label="Ciudad" value="Bogotá" />
              <Row label="Barrio" value={inmueble.zona} />
              <Row
                label="Dirección"
                value={
                  <span className="inline-flex items-center gap-2 justify-end">
                    {inmueble.direccion} <MapPin size={16} style={{ color: "var(--navy)" }} />
                  </span>
                }
              />
              <Row label="Estrato del inmueble" value="3" />
              <Row label="Área construida" value="80 m²" />

              <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

              <GroupTitle>Características generales</GroupTitle>
              {CARACTERISTICAS_GENERALES.map(([label, value]) => (
                <Row key={label} label={label} value={value} />
              ))}

              <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

              <GroupTitle>Áreas adicionales y comodidades</GroupTitle>
              {AREAS_ADICIONALES.map(([label, value]) => (
                <Row key={label} label={label} value={value} />
              ))}

              <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

              <GroupTitle>Políticas y otros</GroupTitle>
              <Row label="¿Permite mascotas?" value="Sí" />
            </SectionCard>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
