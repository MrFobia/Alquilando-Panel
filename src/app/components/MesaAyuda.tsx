import { useState } from "react";
import {
  Shield, Home, Building2, FileText, ClipboardList, Users, Inbox, Handshake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "./kit/PageHeader";
import { AppButton } from "./kit/AppButton";
import { TextInput } from "./kit/TextInput";
import { TabBar } from "./kit/TabBar";
import { Accordion } from "./kit/Accordion";
import { Callout } from "./kit/Callout";
import { EmptyState } from "./kit/EmptyState";
import { LinkText } from "./kit/LinkText";
import { Footer } from "./kit/Footer";
import { HelpBlocks } from "./kit/HelpBlocks";
import type { HelpBlock } from "./kit/HelpBlocks";
import { CrearSolicitudModal } from "./CrearSolicitudModal";

interface HelpItem {
  id: string;
  q: string;
  steps: string[];
  extra?: HelpBlock[];
}

interface HelpCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  items: HelpItem[];
}

// Imágenes de Unsplash — temáticas de real estate, dashboards y gestión
// Login / acceso
const IMG_LOGIN_1     = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&q=80";
const IMG_LOGIN_2     = "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=900&q=80";
const IMG_LOGIN_3     = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80";
// Dashboard / inicio
const IMG_DASH_1      = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80";
const IMG_DASH_2      = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80";
const IMG_DASH_3      = "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=900&q=80";
// Inmuebles
const IMG_BUILD_1     = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80";
const IMG_BUILD_2     = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80";
const IMG_BUILD_3     = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80";
// Contratos
const IMG_CONTRACT_1  = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80";
const IMG_CONTRACT_2  = "https://images.unsplash.com/photo-1568234928966-359c35dd8327?w=900&q=80";
const IMG_CONTRACT_3  = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=80";
// Equipo / clientes
const IMG_TEAM_1      = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80";
const IMG_TEAM_2      = "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=900&q=80";
const IMG_TEAM_3      = "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=900&q=80";
// Inventario
const IMG_INV_1       = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80";
const IMG_INV_2       = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80";
// Solicitudes
const IMG_REQ_1       = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80";
const IMG_REQ_2       = "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=80";
// Aliadas / brokers
const IMG_ALLY_1      = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=900&q=80";
const IMG_ALLY_2      = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80";

// Videos de YouTube de dominio público sobre software / tutoriales
const VID_INTRO       = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // placeholder YouTube
const VID_CONTRACTS   = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const CATEGORIES: HelpCategory[] = [
  {
    id: "acceso",
    label: "Acceso y perfil",
    icon: Shield,
    items: [
      {
        id: "acceso-ingreso",
        q: "¿Cómo ingreso a la plataforma?",
        steps: [
          "Entra a alquilando.com e inicia sesión con tu usuario y contraseña.",
          "Tu usuario es tu número de cédula o NIT (clientes) o tu correo corporativo (usuarios internos).",
        ],
        extra: [
          {
            type: "slider",
            images: [
              { src: IMG_LOGIN_1, alt: "Pantalla de inicio de sesión", caption: "Ingresa con tu cédula/NIT o correo corporativo." },
              { src: IMG_LOGIN_2, alt: "Interfaz de acceso al sistema", caption: "Acceso disponible desde cualquier dispositivo con conexión a internet." },
              { src: IMG_LOGIN_3, alt: "Soporte al equipo", caption: "El equipo de soporte está disponible si tienes problemas para ingresar." },
            ],
          },
          {
            type: "link",
            label: "Ir a alquilando.com",
            href: "https://alquilando.com",
          },
        ],
      },
      {
        id: "acceso-recuperar",
        q: "Olvidé mi contraseña, ¿qué hago?",
        steps: [
          "Usa la opción de recuperación en el inicio de sesión.",
          "Recibirás una contraseña temporal por correo electrónico o SMS.",
          "Si el sistema no encuentra tu cuenta, escribe a soporte.tech@alquilando.com.",
        ],
        extra: [
          {
            type: "callout",
            variant: "warning",
            title: "Importante",
            text: "La contraseña temporal expira en 24 horas. Cámbiala desde Ver perfil apenas ingreses.",
          },
          {
            type: "video",
            src: VID_INTRO,
            caption: "Tutorial: cómo recuperar acceso a tu cuenta paso a paso.",
          },
        ],
      },
      {
        id: "acceso-cambiar-clave",
        q: "¿Cómo cambio mi contraseña?",
        steps: [
          "Abre Ver perfil (bajo tu nombre en el menú lateral).",
          "En el bloque Cambiar contraseña ingresa la contraseña actual y la nueva.",
          "Guarda los cambios. Se recomienda actualizarla periódicamente.",
        ],
        extra: [
          {
            type: "callout",
            variant: "info",
            title: "Consejo de seguridad",
            text: "Usa mínimo 8 caracteres combinando mayúsculas, números y símbolos. Evita usar tu nombre o fecha de nacimiento.",
          },
          {
            type: "link",
            label: "Política de contraseñas de Alquilando",
            href: "https://alquilando.com/seguridad",
          },
        ],
      },
      {
        id: "acceso-datos",
        q: "¿Cómo actualizo mis datos de contacto?",
        steps: [
          "Ver perfil → Información de contacto.",
          "Edita nombres, documento, preferencia de contacto, teléfono, celular y dirección.",
          "Los campos con asterisco (*) son obligatorios.",
        ],
        extra: [
          {
            type: "slider",
            images: [
              { src: IMG_TEAM_1, alt: "Sección de perfil", caption: "Ver perfil → Información de contacto — edita tus datos aquí." },
              { src: IMG_TEAM_2, alt: "Equipo de soporte", caption: "Nuestro equipo puede ayudarte a corregir datos de cédula o NIT." },
            ],
          },
          {
            type: "text",
            text: "Si tu número de cédula o NIT tiene un error, comunícate con el equipo de soporte para que lo corrija directamente en el sistema.",
          },
          {
            type: "link",
            label: "Contactar soporte técnico",
            href: "mailto:soporte.tech@alquilando.com",
          },
        ],
      },
    ],
  },
  {
    id: "inicio",
    label: "Inicio",
    icon: Home,
    items: [
      {
        id: "inicio-tablero",
        q: "¿Qué muestra el tablero de Inicio?",
        steps: [
          "Indicadores en tiempo real: portafolio actual, movimiento de contratos del mes, clientes del sistema e inactivos, canon promedio, administración P.H. y solicitudes.",
          "Puedes filtrar la información por fecha en la parte superior.",
          "Úsalo como punto de partida diario: permite detectar contratos próximos a vencer y solicitudes acumuladas.",
        ],
        extra: [
          {
            type: "slider",
            images: [
              { src: IMG_DASH_1, alt: "Tablero de inicio", caption: "Vista general del tablero de Inicio — métricas actualizadas en tiempo real." },
              { src: IMG_DASH_2, alt: "Gráficas de indicadores", caption: "Analiza tendencias con las gráficas de movimiento de contratos por mes." },
              { src: IMG_DASH_3, alt: "Filtro por fecha", caption: "El filtro de fecha en la parte superior actualiza todos los indicadores." },
            ],
          },
          {
            type: "text",
            text: "Los indicadores se calculan con base en el rango de fechas seleccionado. Si no ves datos, verifica que el filtro de fecha esté configurado correctamente.",
          },
          {
            type: "link",
            label: "Ver documentación completa de indicadores",
            href: "https://ayuda.alquilando.com/tablero",
          },
        ],
      },
    ],
  },
  {
    id: "inmuebles",
    label: "Inmuebles",
    icon: Building2,
    items: [
      {
        id: "inm-administracion",
        q: "¿Dónde veo los inmuebles arrendados?",
        steps: [
          "Menú Inmuebles → En administración.",
          "La tabla muestra # Inmueble, inmobiliaria, metros², dirección, tipo, zona y estado.",
          "Desde Opciones abres la ficha completa: publicación, contrato, datos del inquilino y propietario, y costos.",
        ],
        extra: [
          {
            type: "slider",
            images: [
              { src: IMG_BUILD_1, alt: "Listado de inmuebles", caption: "Tabla de inmuebles en administración — busca por dirección, zona o estado." },
              { src: IMG_BUILD_2, alt: "Fachada de edificio en administración", caption: "Cada inmueble tiene su propia ficha con datos de publicación y contrato." },
              { src: IMG_BUILD_3, alt: "Inmueble residencial", caption: "Desde Opciones accedes a la ficha completa del propietario e inquilino." },
            ],
          },
          {
            type: "list",
            items: [
              "Columna Estado: muestra si el contrato está vigente, próximo a vencer o vencido.",
              "Opciones → Ver ficha: accede a todos los detalles del inmueble.",
              "Opciones → Ver contrato: abre el resumen contractual directamente.",
            ],
          },
        ],
      },
      {
        id: "inm-comercializacion",
        q: "¿Dónde veo los inmuebles disponibles?",
        steps: [
          "Menú Inmuebles → En comercialización.",
          "Incluye indicadores de disponibles, segmentación por categoría, captaciones, días de comercialización y zonas.",
          "Las pestañas agrupan por origen: inclusiones, comercialización, captaciones portal, re-comercialización, captación aliada y broker externo.",
        ],
        extra: [
          {
            type: "video",
            src: VID_INTRO,
            caption: "Video guía: cómo navegar la sección de inmuebles en comercialización.",
          },
          {
            type: "text",
            text: "Los inmuebles con más de 90 días sin arrendar se destacan en rojo para priorizar su gestión comercial.",
          },
        ],
      },
      {
        id: "inm-captar",
        q: "¿Cómo capto un inmueble nuevo?",
        steps: [
          "Pulsa Captar inmueble en la sección En comercialización.",
          "Completa los pasos del formulario: propietario y edificio, datos del inmueble, características, y planes y términos.",
          "Puedes guardar y continuar después: el inmueble queda en estado Borrador.",
          "Al completar el último paso se genera el contrato de inclusión, que se envía al propietario para firma digital.",
        ],
        extra: [
          {
            type: "text",
            text: "Si necesitas retomar una captación inconclusa, búscala en En comercialización con el filtro de estado Borrador.",
          },
          {
            type: "callout",
            variant: "info",
            title: "¿No encuentras el propietario?",
            text: "Si el propietario no está registrado en el sistema, puedes crearlo desde el mismo formulario de captación en el paso 1.",
          },
          {
            type: "link",
            label: "Ir a Inmuebles en comercialización",
            href: "#inmuebles-comercializacion",
          },
          {
            type: "link",
            label: "Descargar guía de captación (PDF)",
            href: "https://ayuda.alquilando.com/guia-captacion.pdf",
          },
        ],
      },
      {
        id: "inm-recomercializacion",
        q: "¿Qué es Recomercialización?",
        steps: [
          "Permite volver a publicar un inmueble que ya estuvo en administración.",
          "Se busca por código Simi o Domus y se accede directo a la edición, sin pasar por contrato y sin selección de plan (aplica el plan por defecto).",
        ],
        extra: [
          {
            type: "slider",
            images: [
              { src: IMG_BUILD_2, alt: "Inmueble disponible para recomercializar", caption: "Formulario de recomercialización — ingresa el código Simi o Domus." },
              { src: IMG_BUILD_1, alt: "Portal de búsqueda de inmueble", caption: "Busca por código para acceder directo a la edición sin nuevo contrato." },
            ],
          },
          {
            type: "callout",
            variant: "warning",
            title: "Atención",
            text: "La recomercialización aplica el plan tarifario por defecto. Si el propietario requiere condiciones especiales, coordina con el equipo comercial antes de proceder.",
          },
        ],
      },
      {
        id: "inm-borrador",
        q: "¿Qué significa el estado Borrador?",
        steps: [
          "El inmueble tiene información incompleta.",
          "Desde la columna Opciones continúas su edición hasta completarla.",
        ],
        extra: [
          {
            type: "list",
            items: [
              "Un inmueble en Borrador no aparece en las búsquedas de inquilinos.",
              "Puedes volver a él en cualquier momento desde la lista de En comercialización.",
              "Al completar todos los pasos, el estado cambia automáticamente a Disponible.",
            ],
          },
          {
            type: "link",
            label: "Ver todos los estados posibles de un inmueble",
            href: "https://ayuda.alquilando.com/estados-inmueble",
          },
        ],
      },
    ],
  },
  {
    id: "contratos",
    label: "Contratos",
    icon: FileText,
    items: [
      {
        id: "con-pestanas",
        q: "¿Cómo se organiza la sección de Contratos?",
        steps: [
          "Tres pestañas: En estudio póliza, Contratos en administración y Pendiente de aprobación.",
          "Pendiente de aprobación permite filtrar por tipo Comercial o Vivienda.",
        ],
        extra: [
          {
            type: "slider",
            images: [
              { src: IMG_CONTRACT_1, alt: "Sección de contratos", caption: "Navega entre las tres pestañas según el estado del contrato." },
              { src: IMG_CONTRACT_2, alt: "Firma digital de contrato", caption: "Los contratos se firman digitalmente — propietario e inquilino reciben notificación." },
              { src: IMG_CONTRACT_3, alt: "Revisión de documentos contractuales", caption: "Verifica los datos bancarios antes de aprobar cualquier contrato." },
            ],
          },
          {
            type: "text",
            text: "Los contratos en 'Estudio póliza' están en proceso de evaluación crediticia. El sistema notifica automáticamente cuando hay una actualización.",
          },
        ],
      },
      {
        id: "con-crear",
        q: "¿Cómo creo un contrato nuevo?",
        steps: [
          "Pulsa Crear nuevo contrato (visible en la pestaña Pendiente de aprobación).",
          "Selecciona el inmueble, datos del propietario y del inquilino, condiciones económicas y fechas.",
          "El contrato queda en estado Pre contrato hasta completar firmas y aprobaciones.",
        ],
        extra: [
          {
            type: "video",
            src: VID_CONTRACTS,
            caption: "Video tutorial: paso a paso para crear un nuevo contrato de arrendamiento.",
          },
          {
            type: "callout",
            variant: "warning",
            title: "Verifica los datos bancarios",
            text: "Antes de aprobar, confirma que los datos bancarios para la destinación de egresos sean correctos. Un error aquí puede generar problemas en los pagos al propietario.",
          },
          {
            type: "link",
            label: "Plantilla de contrato de arrendamiento",
            href: "https://ayuda.alquilando.com/plantilla-contrato",
          },
        ],
      },
      {
        id: "con-estados",
        q: "¿Qué controla el estado del contrato?",
        steps: [
          "El flujo es Pre contrato → En ejecución → Finalizado.",
          "El estado define qué información puede modificarse en el resumen del contrato.",
          "Verifica los datos bancarios de la destinación de egresos antes de aprobar.",
        ],
        extra: [
          {
            type: "list",
            items: [
              "Pre contrato: en espera de firmas digitales de propietario e inquilino.",
              "En ejecución: contrato activo; solo se pueden modificar campos permitidos.",
              "Finalizado: contrato cerrado; solo lectura, sin edición posible.",
            ],
          },
          {
            type: "image",
            src: IMG_CONTRACT_3,
            alt: "Diagrama de flujo de estados de contrato",
            caption: "Flujo de estados de un contrato: Pre contrato → En ejecución → Finalizado.",
          },
        ],
      },
    ],
  },
  {
    id: "inventarios",
    label: "Inventarios",
    icon: ClipboardList,
    items: [
      {
        id: "inv-crear",
        q: "¿Cómo creo un inventario?",
        steps: [
          "Pulsa Crear inventarios.",
          "Selecciona el tipo de búsqueda, digita el ID del inmueble Alquilando y pulsa Buscar.",
          "Indica cuántos pisos tiene el inmueble y el total de ambientes: el sistema genera la estructura por niveles.",
        ],
        extra: [
          {
            type: "slider",
            images: [
              { src: IMG_INV_1, alt: "Formulario de creación de inventario", caption: "Formulario de inventario — define pisos y ambientes para generar la estructura." },
              { src: IMG_INV_2, alt: "Registro fotográfico de inmueble", caption: "Adjunta fotos de cada ambiente para documentar el estado del inmueble." },
            ],
          },
          {
            type: "text",
            text: "Cada ambiente puede tener su propio estado (Bueno, Regular, Malo) y observaciones fotográficas adjuntas.",
          },
          {
            type: "link",
            label: "Descargar formato de inventario físico (Excel)",
            href: "https://ayuda.alquilando.com/formato-inventario.xlsx",
          },
        ],
      },
      {
        id: "inv-gestionar",
        q: "¿Cómo gestiono un inventario?",
        steps: [
          "Asignar contrato vincula el inventario al contrato correspondiente.",
          "En Niveles registras el estado de cada ambiente por piso.",
          "Agrega observaciones con el campo Nueva nota y el botón Agregar nota.",
        ],
        extra: [
          {
            type: "callout",
            variant: "info",
            title: "Buena práctica",
            text: "Registra el inventario de entrada y salida con fotos adjuntas. Esto evita conflictos al momento de la devolución del inmueble.",
          },
          {
            type: "list",
            items: [
              "Puedes adjuntar fotos de cada ambiente desde el botón 'Agregar fotos'.",
              "El informe de inventario se genera en PDF y se puede enviar por correo al inquilino.",
              "Vincula el inventario al contrato antes de que el inquilino se mude.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "clientes",
    label: "Inquilinos y propietarios",
    icon: Users,
    items: [
      {
        id: "cli-listados",
        q: "¿Qué muestran los listados?",
        steps: [
          "Cédula, nombre, inmobiliaria, dirección del inmueble, correo, teléfono y estado del contrato.",
          "El botón Filtrar permite búsquedas por cualquiera de estos criterios.",
        ],
        extra: [
          {
            type: "slider",
            images: [
              { src: IMG_TEAM_1, alt: "Listado de clientes", caption: "Vista de listado de clientes — filtra por nombre, cédula o estado del contrato." },
              { src: IMG_TEAM_2, alt: "Reunión con clientes", caption: "Gestiona propietarios e inquilinos desde una sola vista unificada." },
              { src: IMG_TEAM_3, alt: "Atención personalizada", caption: "Exporta el listado completo a Excel con el botón Exportar." },
            ],
          },
          {
            type: "text",
            text: "Puedes exportar el listado completo a Excel usando el botón Exportar en la esquina superior derecha.",
          },
          {
            type: "link",
            label: "Ver guía de gestión de clientes",
            href: "https://ayuda.alquilando.com/clientes",
          },
        ],
      },
      {
        id: "cli-ficha",
        q: "¿Qué contiene la ficha de un cliente?",
        steps: [
          "Información general, actualización de datos de contacto (botón Editar), notas internas, contratos asociados y documentos.",
          "La ficha del propietario suma: etiqueta de cliente (ej. VIP), botón Crear solicitud y estados de cuenta por año y mes.",
        ],
        extra: [
          {
            type: "list",
            items: [
              "Notas internas: visibles solo para el equipo Alquilando, no para el cliente.",
              "Documentos: cédula, RUT, certificado bancario y otros documentos requeridos.",
              "Estado de cuenta propietario: liquidaciones mensuales descargables en PDF.",
            ],
          },
          {
            type: "callout",
            variant: "info",
            title: "Etiqueta VIP",
            text: "Los propietarios con etiqueta VIP reciben atención prioritaria. Para asignar esta etiqueta, comunícate con el líder de cuenta.",
          },
          {
            type: "link",
            label: "Solicitar actualización de datos del cliente",
            href: "mailto:soporte.tech@alquilando.com",
          },
        ],
      },
    ],
  },
  {
    id: "solicitudes",
    label: "Solicitudes",
    icon: Inbox,
    items: [
      {
        id: "sol-que-es",
        q: "¿Qué es la sección Solicitudes?",
        steps: [
          "Es la mesa de ayuda de la operación: concentra los tickets de propietarios, inquilinos y equipo interno.",
          "Categorías: administraciones, desocupaciones, facturación, jurídico, reparaciones, servicio al cliente y servicios públicos.",
          "Vistas disponibles: solicitudes activas, cerradas y vencidas.",
        ],
        extra: [
          {
            type: "slider",
            images: [
              { src: IMG_REQ_1, alt: "Panel de solicitudes", caption: "Vista de tickets activos organizados por categoría y prioridad." },
              { src: IMG_REQ_2, alt: "Gestión de tickets", caption: "Desde cada ticket puedes asignar responsable, cambiar estado y agregar notas." },
            ],
          },
          {
            type: "video",
            src: VID_INTRO,
            caption: "Tutorial: cómo navegar y gestionar tickets en la sección de Solicitudes.",
          },
        ],
      },
      {
        id: "sol-flujo",
        q: "¿Cuál es el flujo de un ticket?",
        steps: [
          "Toda solicitud entra con estado Inicio.",
          "Pasa a Análisis de solicitud con un responsable asignado y se gestiona hasta su cierre.",
          "Las solicitudes vencidas se destacan para seguimiento prioritario.",
          "Gestionar en BITRIX abre el ticket en Bitrix para su gestión por la mesa de ayuda.",
        ],
        extra: [
          {
            type: "list",
            items: [
              "Inicio: ticket recién creado, sin responsable asignado.",
              "Análisis: en revisión por el equipo correspondiente.",
              "En gestión: solución en proceso.",
              "Cerrado: resuelto satisfactoriamente.",
              "Vencido: superó el SLA sin resolverse — requiere atención inmediata.",
            ],
          },
          {
            type: "callout",
            variant: "warning",
            title: "Solicitudes vencidas",
            text: "Los tickets vencidos generan alertas automáticas al supervisor. Gestiónalos con prioridad máxima para evitar impacto en la satisfacción del cliente.",
          },
        ],
      },
      {
        id: "sol-crear",
        q: "¿Cómo creo una solicitud?",
        steps: [
          "Pulsa Crear solicitud en la sección Solicitudes, o desde la ficha del propietario.",
          "Categorías disponibles: pagos o estados de cuenta, documentos o contrato, mantenimiento o novedades, reportes del inmueble, actualización de datos, asesoría y otros temas.",
        ],
        extra: [
          {
            type: "text",
            text: "Al crear la solicitud, selecciona la categoría correcta para que llegue al equipo adecuado. Una categoría incorrecta puede demorar la resolución.",
          },
          {
            type: "callout",
            variant: "info",
            title: "Adjunta evidencia",
            text: "Incluye fotos, pantallazos o documentos relevantes al crear el ticket. Esto agiliza el análisis y reduce el tiempo de respuesta.",
          },
          {
            type: "link",
            label: "Ver SLAs por categoría de solicitud",
            href: "https://ayuda.alquilando.com/sla-solicitudes",
          },
          {
            type: "link",
            label: "Escalar una solicitud urgente",
            href: "mailto:soporte.tech@alquilando.com",
          },
        ],
      },
    ],
  },
  {
    id: "aliados",
    label: "Inmobiliarias y brokers",
    icon: Handshake,
    items: [
      {
        id: "ali-inmobiliarias",
        q: "¿Cómo gestiono las inmobiliarias aliadas?",
        steps: [
          "El listado muestra teléfono, correo, tasa de administración (%), total de contratos y finalizados.",
          "Agregar nueva inmobiliaria registra una aliada; los usuarios de las inmobiliarias los crea el equipo Alquilando al cerrar el partnership.",
        ],
        extra: [
          {
            type: "slider",
            images: [
              { src: IMG_ALLY_1, alt: "Listado de inmobiliarias aliadas", caption: "Gestión de aliadas — tasa de administración, contratos activos y finalizados." },
              { src: IMG_ALLY_2, alt: "Reunión de alianza comercial", caption: "El equipo Alquilando crea los usuarios de la inmobiliaria al cerrar el partnership." },
            ],
          },
          {
            type: "text",
            text: "La tasa de administración se configura por inmobiliaria y aplica a todos los contratos gestionados bajo esa alianza.",
          },
          {
            type: "link",
            label: "Contrato tipo de alianza inmobiliaria",
            href: "https://ayuda.alquilando.com/alianza-inmobiliaria",
          },
          {
            type: "link",
            label: "Solicitar nuevo partnership",
            href: "mailto:alianzas@alquilando.com",
          },
        ],
      },
      {
        id: "ali-tablero",
        q: "¿Qué muestra el tablero individual?",
        steps: [
          "Cada inmobiliaria o broker tiene su propio tablero con filtro por fecha.",
          "Incluye estado de la cartera, clientes inactivos, portafolio actual, honorarios y solicitudes.",
        ],
        extra: [
          {
            type: "slider",
            images: [
              { src: IMG_DASH_1, alt: "Tablero individual de inmobiliaria", caption: "Métricas de cartera, honorarios y solicitudes de la inmobiliaria aliada." },
              { src: IMG_DASH_2, alt: "Análisis de portafolio", caption: "Filtra por fecha para ver el desempeño en cualquier período." },
            ],
          },
          {
            type: "list",
            items: [
              "Cartera activa: inmuebles vigentes bajo administración de la aliada.",
              "Honorarios: comisiones generadas en el período seleccionado.",
              "Clientes inactivos: propietarios sin contrato activo que podrían reactivarse.",
            ],
          },
          {
            type: "callout",
            variant: "info",
            title: "Reporte mensual",
            text: "El tablero genera un reporte mensual automático que se envía al correo registrado de la inmobiliaria aliada.",
          },
        ],
      },
    ],
  },
];

const SOPORTE_EMAIL = "soporte.tech@alquilando.com";

function matches(item: HelpItem, q: string) {
  const text = `${item.q} ${item.steps.join(" ")}`.toLowerCase();
  return text.includes(q);
}

export function MesaAyuda() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("todos");
  const [solicitudOpen, setSolicitudOpen] = useState(false);

  const q = query.trim().toLowerCase();

  const visible = CATEGORIES
    .filter((c) => tab === "todos" || c.id === tab)
    .map((c) => ({ ...c, items: q ? c.items.filter((it) => matches(it, q)) : c.items }))
    .filter((c) => c.items.length > 0);

  const tabs = [
    { id: "todos", label: "Todos", count: CATEGORIES.reduce((acc, c) => acc + c.items.length, 0) },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: c.items.length })),
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Mesa de ayuda"
        description="Encuentra guías rápidas para realizar cada acción en el panel."
        actions={
          <AppButton variant="primary" bold onClick={() => setSolicitudOpen(true)}>
            Contactar soporte
          </AppButton>
        }
      />

      <section
        className="rounded-lg flex flex-col gap-4"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
      >
        <TextInput
          placeholder="Busca una pregunta, ej. cambiar contraseña, captar inmueble…"
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          className="w-full"
        />
        <TabBar tabs={tabs} active={tab} onChange={setTab} />
      </section>

      {visible.length === 0 ? (
        <section className="rounded-lg" style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)" }}>
          <EmptyState
            title="Sin resultados"
            description={`No encontramos guías que coincidan con "${query}". Intenta con otra palabra o contacta al equipo de soporte.`}
            action={
              <AppButton variant="secondary" onClick={() => setQuery("")}>
                Limpiar búsqueda
              </AppButton>
            }
          />
        </section>
      ) : (
        visible.map((cat) => {
          const Icon = cat.icon;
          return (
            <section
              key={cat.id}
              className="rounded-lg"
              style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
            >
              <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
                <div
                  className="flex items-center justify-center rounded-lg shrink-0"
                  style={{ width: 36, height: 36, backgroundColor: "var(--navy-light)" }}
                >
                  <Icon size={18} strokeWidth={1.8} style={{ color: "var(--navy)" }} />
                </div>
                <h2 className="subtitle" style={{ color: "var(--navy)" }}>{cat.label}</h2>
              </div>
              <Accordion
                openAll={!!q}
                items={cat.items.map((it) => ({
                  id: it.id,
                  title: it.q,
                  content: (
                    <div className="flex flex-col gap-4">
                      {/* Pasos principales */}
                      {it.steps.length > 1 ? (
                        <ol className="list-decimal flex flex-col gap-1" style={{ paddingLeft: 20 }}>
                          {it.steps.map((s, i) => <li key={i}>{s}</li>)}
                        </ol>
                      ) : (
                        <p>{it.steps[0]}</p>
                      )}
                      {/* Bloques de contenido enriquecido */}
                      {it.extra && it.extra.length > 0 && (
                        <HelpBlocks blocks={it.extra} />
                      )}
                    </div>
                  ),
                }))}
              />
            </section>
          );
        })
      )}

      <Callout variant="info" title="¿No encuentras lo que buscas?">
        Escribe a{" "}
        <LinkText onClick={() => { window.location.href = `mailto:${SOPORTE_EMAIL}`; }}>
          {SOPORTE_EMAIL}
        </LinkText>{" "}
        para problemas de acceso, validación de datos (NIT o cédula asociada al contrato) y fallas técnicas, o crea un
        ticket desde la sección Solicitudes.
      </Callout>

      <Footer />

      <CrearSolicitudModal open={solicitudOpen} onClose={() => setSolicitudOpen(false)} />
    </div>
  );
}
