import { useEffect, useState } from "react";
import { InventarioInquilino, ResumenInventario, INMUEBLES_PROPIETARIO } from "./InventarioInquilino";

/**
 * Sección "Inventarios" del portal del propietario: un resumen por inmueble y, al
 * entrar, el inventario completo en solo lectura (mismo componente del inquilino).
 */
export function InventariosPropietario({ onCrearSolicitud }: { onCrearSolicitud: () => void }) {
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const inmueble = INMUEBLES_PROPIETARIO.find((i) => i.id === seleccionado) ?? null;

  useEffect(() => { document.querySelector("main")?.scrollTo({ top: 0 }); }, [seleccionado]);

  if (inmueble) {
    return (
      <InventarioInquilino
        inventario={inmueble.inventario}
        direccion={inmueble.direccion}
        audiencia="propietario"
        backLabel="Volver a inventarios"
        onBack={() => setSeleccionado(null)}
        onReportar={onCrearSolicitud}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-5 items-start">
      {INMUEBLES_PROPIETARIO.map((i) => (
        <ResumenInventario
          key={i.id}
          inventario={i.inventario}
          titulo={i.direccion}
          detalle={`${i.inventario.tipoInventario} · ${i.inventario.fecha} · Inquilino: ${i.inventario.inquilino}`}
          onVer={() => setSeleccionado(i.id)}
        />
      ))}
    </div>
  );
}
