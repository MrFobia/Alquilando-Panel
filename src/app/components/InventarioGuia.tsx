import { useState } from "react";
import { ChevronDown, BookOpen, Search, Building2, Camera, ClipboardList, StickyNote, FileSignature } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Paso {
  icon: LucideIcon;
  titulo: string;
  detalle: string;
}

const PASOS: Paso[] = [
  {
    icon: Search,
    titulo: "Busca el inmueble",
    detalle: "Pulsa “Crear inventario” y busca por Código Alquilando, Código Domus o dirección. El sistema confirma el inmueble y su contrato.",
  },
  {
    icon: Building2,
    titulo: "Define los niveles",
    detalle: "Indica cuántos pisos tiene el inmueble. Se generan automáticamente los niveles (Primer piso, Segundo piso, etc.).",
  },
  {
    icon: ClipboardList,
    titulo: "Agrega los ambientes",
    detalle: "En cada nivel, elige el tipo de ambiente (Sala comedor, Cocina, Alcobas…) y un nombre opcional. Pulsa “Agregar ambiente”.",
  },
  {
    icon: Camera,
    titulo: "Sube la galería",
    detalle: "Por cada ambiente adjunta fotos y videos del estado actual. Es la evidencia visual que respalda el inventario.",
  },
  {
    icon: ClipboardList,
    titulo: "Registra las especificaciones",
    detalle: "Detalla cada elemento: estado (Bueno, Regular…), cantidad, material y notas. Algunas aseguradoras lo exigen además del multimedia.",
  },
  {
    icon: StickyNote,
    titulo: "Añade notas generales",
    detalle: "Deja observaciones globales del inmueble. Si no hay nada que reportar, también es buena señal.",
  },
  {
    icon: FileSignature,
    titulo: "Asigna contrato y firma",
    detalle: "Pulsa “Asignar contrato” para vincular propietario e inquilino. Revisa el inventario y fírmalo digitalmente; cada actor recibe copia del documento firmado.",
  },
];

export function InventarioGuia() {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="rounded-lg overflow-hidden"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3"
        style={{ padding: "16px 24px", cursor: "pointer", backgroundColor: "transparent" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{ width: 34, height: 34, backgroundColor: "var(--navy-light)" }}
          >
            <BookOpen size={18} style={{ color: "var(--navy)" }} />
          </div>
          <div className="flex flex-col text-left">
            <span className="subtitle" style={{ color: "var(--navy)" }}>¿Cómo crear y firmar un inventario?</span>
            <span className="body-small-regular" style={{ color: "var(--gray-8)" }}>
              Guía paso a paso para todos los actores del proceso.
            </span>
          </div>
        </div>
        <ChevronDown
          size={20}
          style={{ color: "var(--gray-8)", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
        />
      </button>

      {open && (
        <div style={{ padding: "0 24px 24px" }}>
          <hr style={{ borderColor: "var(--gray-4)", margin: "0 0 20px" }} />
          <ol className="flex flex-col gap-1">
            {PASOS.map((paso, i) => {
              const Icon = paso.icon;
              const last = i === PASOS.length - 1;
              return (
                <li key={i} className="flex gap-4">
                  {/* Número + línea conectora */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="flex items-center justify-center rounded-full body-bold shrink-0"
                      style={{ width: 30, height: 30, backgroundColor: "var(--navy)", color: "#ffffff" }}
                    >
                      {i + 1}
                    </div>
                    {!last && <div className="flex-1" style={{ width: 2, backgroundColor: "var(--gray-4)", minHeight: 12 }} />}
                  </div>

                  {/* Contenido */}
                  <div className={`flex flex-col gap-1 ${last ? "" : "pb-4"}`}>
                    <div className="flex items-center gap-2">
                      <Icon size={15} style={{ color: "var(--navy)" }} />
                      <span className="body-bold" style={{ color: "var(--gray-10)" }}>{paso.titulo}</span>
                    </div>
                    <span className="body-regular" style={{ color: "var(--gray-9)" }}>{paso.detalle}</span>
                  </div>
                </li>
              );
            })}
          </ol>

          <div
            className="flex gap-3 rounded-lg"
            style={{ backgroundColor: "var(--navy-light)", borderLeft: "3px solid var(--navy)", padding: 14, marginTop: 8 }}
          >
            <FileSignature size={18} style={{ color: "var(--navy)", flexShrink: 0, marginTop: 2 }} />
            <div className="flex flex-col gap-0.5">
              <span className="body-bold" style={{ color: "var(--navy)" }}>Sobre la firma</span>
              <span className="body-regular" style={{ color: "var(--gray-10)" }}>
                El inventario solo es válido cuando está firmado por las partes. Una vez firmado queda bloqueado para edición y se
                guarda como soporte legal del estado del inmueble al inicio o cierre del arriendo.
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
