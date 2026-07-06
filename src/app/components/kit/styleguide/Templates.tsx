const screens = [
  {
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    title: "Datos del inmueble",
    description: "Vista de detalle de un inmueble con toda su información: publicación, planes, contrato, datos del inquilino y propietario, costo, y características.",
    tags: ["Detail Page", "Atoms", "Molecules", "Organisms"],
  },
  {
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
    title: "Evaluación de Postulante — Arrendamiento",
    description: "Pantalla de evaluación de un postulante a arrendamiento. Muestra información del inmueble, del inquilino, del deudor y documentos adjuntos.",
    tags: ["Form Page", "Detail View", "File Cards"],
  },
  {
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    title: "Listado de Inmuebles",
    description: "Dashboard principal de inmuebles con métricas de disponibilidad, gráficas de comercialización y zonas, tabs de estado y tabla filtrable.",
    tags: ["Dashboard", "Charts", "Data Table", "Stats Row"],
  },
  {
    img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80",
    title: "Gestión de Brokers",
    description: "Listado de solicitudes de brokers con estadísticas de activos/inactivos, tabs de estado (Activos, Solicitudes, Rechazados) y tabla de datos.",
    tags: ["List Page", "Tabs", "Data Table", "Stats"],
  },
  {
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    title: "Evaluación de Broker",
    description: "Vista de perfil de broker con pasos de progreso del proceso de vinculación, datos del postulante, documentos, validación de antecedentes y capacitación.",
    tags: ["Profile Page", "Progress Steps", "Documents", "Actions"],
  },
];

export function Templates() {
  return (
    <div className="space-y-16">
      <h3 className="title-tertiary-bold mb-6 pb-2 border-b" style={{ color: "var(--navy)", borderColor: "var(--gray-5)" }}>
        Pantallas del sistema
      </h3>
      <div className="grid grid-cols-1 gap-10">
        {screens.map(({ img, title, description, tags }) => (
          <div key={title} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--gray-5)" }}>
            <div className="relative overflow-hidden" style={{ backgroundColor: "var(--gray-1)", maxHeight: 420 }}>
              <img src={img} alt={`Pantalla: ${title}`} className="w-full object-cover object-top" style={{ maxHeight: 420 }} />
              <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: "linear-gradient(to top, rgba(255,255,255,0.9), transparent)" }} />
            </div>
            <div className="px-6 py-5" style={{ backgroundColor: "#ffffff" }}>
              <h4 className="subtitle mb-2" style={{ color: "var(--navy)" }}>{title}</h4>
              <p className="body-regular mb-4" style={{ color: "var(--gray-9)" }}>{description}</p>
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <span key={tag} className="tags px-2 py-1 rounded" style={{ backgroundColor: "var(--navy-light)", color: "var(--navy)" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
