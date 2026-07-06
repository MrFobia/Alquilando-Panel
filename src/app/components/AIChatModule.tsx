import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, X } from "lucide-react";
import { AppButton } from "./kit/AppButton";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ── Respuestas simuladas ────────────────────────────────────────────────────

type Rule = { keywords: string[]; answer: string };

const RULES: Rule[] = [
  {
    keywords: ["publicar", "publicación", "publicar inmueble"],
    answer:
      "Para publicar un inmueble:\n1. Ve a **Inmuebles en comercialización**.\n2. Abre la ficha del inmueble y haz clic en **Editar publicación**.\n3. Sube mínimo 12 fotos, agrega una descripción y las características.\n4. Cuando la información esté completa, el botón **Publicar inmueble** se habilita en la esquina superior derecha.\n\nRecuerda que sin fotos ni descripción el sistema no permite publicar.",
  },
  {
    keywords: ["broker", "aprobar broker", "activar broker", "postulación", "postulante"],
    answer:
      "Para aprobar un broker externo:\n1. Entra a **Brokers Externos** en el menú lateral.\n2. En la pestaña **Solicitudes**, haz clic en el ojo para abrir la postulación.\n3. Revisa los 5 pasos: documentos, antecedentes, firma de contrato y capacitación.\n4. Una vez todos los pasos estén aprobados, el botón **Aprobar y activar** se habilita.\n5. Al aprobarlo recibirás una confirmación y el broker pasará a la pestaña **Activos**.",
  },
  {
    keywords: ["inactivar", "inactivar broker", "desactivar broker"],
    answer:
      "Para inactivar un broker activo:\n1. Ingresa a su ficha desde la pestaña **Activos**.\n2. En la esquina superior derecha verás el botón rojo **Inactivar broker**.\n3. Confirma la acción — el broker pasará automáticamente a **Rechazados / Inactivos**.",
  },
  {
    keywords: ["contrato", "contratos", "contrato activo", "arrendamiento"],
    answer:
      "Los contratos se gestionan en la sección **Contratos** del menú lateral. Allí encuentras:\n• Contratos activos, por vencer y finalizados.\n• Detalle de cada contrato con inquilino, propietario y canon.\n• Opción de filtrar por estado, zona o asesor.\n\nPara crear un contrato nuevo, usa el botón **Nuevo contrato** en la cabecera de esa sección.",
  },
  {
    keywords: ["captación", "captar", "captar inmueble", "inmueble captación"],
    answer:
      "Para captar un inmueble:\n1. Ve a **Inmuebles en comercialización**.\n2. Haz clic en **Captar inmueble** (botón azul arriba a la derecha).\n3. Completa los datos del inmueble: tipo, dirección, zona, estrato y área.\n4. Asigna el broker o asesor correspondiente.\n5. El inmueble quedará en estado **Borrador** hasta que se complete la información y se publique.",
  },
  {
    keywords: ["inmueble", "inmuebles", "ficha inmueble", "datos inmueble"],
    answer:
      "Desde la ficha de un inmueble puedes:\n• Ver y editar la **Publicación** (fotos, descripción, características).\n• Revisar el estado de los **Contratos** (arrendamiento, mandato, inclusión).\n• Consultar el **Costo** (canon, administración, depósito).\n• Ver las **Características generales** y áreas adicionales.\n\nNavega por las pestañas: Información general · Leads · Notas · Historial.",
  },
  {
    keywords: ["zona", "zonas", "norte", "sur", "occidente", "noroccidente"],
    answer:
      "Las zonas disponibles en el panel son: Norte, Sur, Oriente, Occidente, Noroccidente, Centro y Caribe. Puedes filtrar por zona en las tablas de inmuebles, brokers y contratos usando el filtro de búsqueda en cada sección.",
  },
  {
    keywords: ["pago", "pagos", "reporte", "factura", "honorario"],
    answer:
      "Los reportes de pagos y honorarios se encuentran en la sección **Contratos**. Dentro de cada contrato activo puedes ver el historial de pagos del canon mensual. Para reportes consolidados, usa el botón **Descargar** disponible en la sección de Inmuebles en comercialización.",
  },
  {
    keywords: ["inquilino", "propietario", "cliente"],
    answer:
      "Inquilinos y propietarios se gestionan desde sus respectivas secciones en el menú lateral. En cada ficha encuentras:\n• Datos personales y de contacto.\n• Contratos asociados.\n• Solicitudes abiertas.\n• Historial de pagos.\n\nDesde la ficha de un contrato también puedes acceder directamente al perfil del inquilino o propietario vinculado.",
  },
  {
    keywords: ["solicitud", "ticket", "soporte", "ayuda", "problema"],
    answer:
      "Para crear un ticket de soporte:\n1. Ve a la sección **Solicitudes** en el menú.\n2. Haz clic en **Nueva solicitud**.\n3. Elige la categoría: pagos, documentos, mantenimiento, reportes, actualización de datos u otros.\n4. Describe el problema y adjunta evidencia si la tienes.\n\nTambién puedes escribir directamente a soporte.tech@alquilando.com para problemas técnicos urgentes.",
  },
  {
    keywords: ["mesa de ayuda", "guía", "manual", "tutorial"],
    answer:
      "Esta sección de Mesa de ayuda tiene guías paso a paso para todas las funciones del panel. Usa el buscador o los filtros por categoría para encontrar lo que necesitas. Las categorías disponibles son: Acceso y perfil, Inicio, Inmuebles, Contratos, Inventarios, Inquilinos y propietarios, Solicitudes, e Inmobiliarias y brokers.",
  },
  {
    keywords: ["hola", "buenos días", "buenas tardes", "buenas noches", "hey"],
    answer:
      "¡Hola! Soy el asistente virtual de Alquilando. Estoy aquí para ayudarte con cualquier duda sobre el panel de administración. ¿En qué puedo ayudarte hoy?",
  },
  {
    keywords: ["gracias", "ok", "perfecto", "listo", "entendido"],
    answer:
      "¡Con gusto! Si tienes alguna otra pregunta sobre el panel, aquí estaré. 😊",
  },
];

const FALLBACK =
  "Esa consulta puede requerir atención personalizada. Te recomiendo:\n• Revisar las guías en la sección de preguntas frecuentes de esta página.\n• Escribir a soporte.tech@alquilando.com para problemas técnicos.\n• Crear un ticket en la sección **Solicitudes** si es un caso operativo.\n\n¿Hay algo más específico del panel en lo que pueda orientarte?";

function getMockReply(text: string): Promise<string> {
  const normalized = text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const match = RULES.find((r) =>
    r.keywords.some((kw) => normalized.includes(kw.normalize("NFD").replace(/[̀-ͯ]/g, "")))
  );
  const reply = match?.answer ?? FALLBACK;
  const delay = 900 + Math.random() * 700;
  return new Promise((resolve) => setTimeout(() => resolve(reply), delay));
}

// ── UI ──────────────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1" style={{ padding: "10px 14px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="rounded-full"
          style={{
            width: 7,
            height: 7,
            backgroundColor: "var(--gray-6)",
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

const STARTER_QUESTIONS = [
  "¿Cómo publico un inmueble?",
  "¿Cómo apruebo un broker externo?",
  "¿Dónde veo los contratos activos?",
  "¿Cómo capturo un inmueble?",
];

interface Props {
  onClose?: () => void;
}

export function AIChatModule({ onClose }: Props = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    const reply = await getMockReply(trimmed);
    setMessages([...updated, { role: "assistant", content: reply }]);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="flex flex-col overflow-hidden" style={{ backgroundColor: "#ffffff", height: "100%" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 shrink-0"
        style={{ backgroundColor: "var(--navy)", padding: "14px 20px" }}
      >
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 34, height: 34, backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <Bot size={18} style={{ color: "#ffffff" }} />
        </div>
        <div className="flex flex-col flex-1">
          <span className="body-bold" style={{ color: "#ffffff" }}>Asistente Alquilando</span>
          <span className="disclamer" style={{ color: "rgba(255,255,255,0.65)" }}>IA · Responde al instante</span>
        </div>
        <span
          className="tags-bold rounded-full"
          style={{ padding: "3px 10px", backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff" }}
        >
          Demo
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full"
            style={{ width: 28, height: 28, cursor: "pointer", backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <X size={16} style={{ color: "#ffffff" }} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3" style={{ padding: "16px 20px" }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-4" style={{ paddingTop: 24 }}>
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 56, height: 56, backgroundColor: "var(--navy-light)" }}
            >
              <Bot size={26} style={{ color: "var(--navy)" }} />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="body-bold" style={{ color: "var(--gray-10)" }}>¿En qué puedo ayudarte?</span>
              <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
                Pregunta sobre inmuebles, contratos, brokers o cualquier función del panel.
              </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="tags rounded-full"
                  style={{
                    padding: "6px 14px",
                    border: "1px solid var(--gray-4)",
                    backgroundColor: "#ffffff",
                    color: "var(--navy)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--navy-light)"; e.currentTarget.style.borderColor = "var(--navy)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.borderColor = "var(--gray-4)"; }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 items-end ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: 28, height: 28, backgroundColor: m.role === "user" ? "var(--navy)" : "var(--gray-2)" }}
            >
              {m.role === "user"
                ? <User size={14} style={{ color: "#ffffff" }} />
                : <Bot size={14} style={{ color: "var(--navy)" }} />}
            </div>
            <div
              className="body-regular"
              style={{
                maxWidth: "76%",
                padding: "10px 14px",
                backgroundColor: m.role === "user" ? "var(--navy)" : "var(--gray-1)",
                color: m.role === "user" ? "#ffffff" : "var(--gray-10)",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
              }}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-end">
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: 28, height: 28, backgroundColor: "var(--gray-2)" }}
            >
              <Bot size={14} style={{ color: "var(--navy)" }} />
            </div>
            <div style={{ backgroundColor: "var(--gray-1)", borderRadius: "18px 18px 18px 4px" }}>
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-end gap-3 shrink-0"
        style={{ borderTop: "1px solid var(--gray-4)", padding: "12px 16px" }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
          }}
          placeholder="Escribe tu pregunta…"
          rows={1}
          disabled={loading}
          className="body-regular flex-1"
          style={{
            border: "1px solid var(--gray-5)",
            borderRadius: "var(--radius-md)",
            padding: "9px 12px",
            color: "var(--gray-10)",
            outline: "none",
            resize: "none",
            maxHeight: 96,
            lineHeight: 1.5,
            backgroundColor: "#ffffff",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--gray-5)"; }}
        />
        <AppButton variant="primary" bold disabled={!input.trim() || loading} onClick={() => send()}>
          <Send size={15} />
        </AppButton>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
