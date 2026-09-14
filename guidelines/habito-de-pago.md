# Widget de recaudo — Hábito de pago

ClickUp: [869ehcmz9 · Widget pagos | Contratos ejecución](https://app.clickup.com/t/869ehcmz9)

Módulo que le da a la **inmobiliaria maestra** una lectura rápida del comportamiento de pago de un
inquilino: si paga a tiempo, cuándo suele pagar y cuál ha sido su promedio.

---

## 1. Qué ve la inmobiliaria maestra

| Bloque | Qué responde |
| --- | --- |
| Anillo de puntualidad | *¿Paga a tiempo?* — % de periodos pagados dentro de la fecha límite |
| Badge de hábito | Lectura de una sola palabra: Excelente / Bueno / Irregular / Crítico |
| Pagos puntuales | Cuántos de los periodos con pago registrado fueron puntuales |
| Suele pagar el día | Día del mes promedio en que efectivamente paga, contra el día límite |
| Promedio de pago | Días promedio de diferencia contra la fecha límite (negativo = anticipado) |
| Periodos en mora | Cuántos periodos superaron el corte de mora |
| Fechas de pago por periodo | Timeline de 12 periodos, un cuadro por mes, con color por estado |
| Últimos pagos | Tabla de los 6 periodos más recientes |
| Ver historial de pagos | Modal con el histórico completo |

**Ubicación:** interna del contrato en administración (`EstadoContratoDetalle`, ruta
*Contratos → En administración → Ver resumen*). En la tarjeta **Estado de cuenta**, el link que antes
decía *Ver historial de pagos* ahora dice **Ver hábito de pago** y abre la vista del widget — es el
link señalado en la captura de la tarea de ClickUp. El histórico completo sigue disponible dentro de
esa vista, en el modal *Ver historial de pagos*.

## 2. Acceso

- El link *Ver hábito de pago* y la vista que abre solo existen si `useEsInmobiliariaMaestra()` es
  `true` (`role === "inmobiliaria"` **y** `perfil === "maestra"`, ver `src/app/store/SessionContext.tsx`).
- Para los demás perfiles la tarjeta *Estado de cuenta* se muestra sin ese link.
- Ningún otro perfil lo ve: ni inmobiliarias aliadas, ni el portal del inquilino. No hay versión
  reducida para no-maestros — el bloque simplemente no existe en el DOM.

## 3. Cómo se interpreta

### Puntualidad
`% = pagos con estado "a-tiempo" / periodos con pago registrado`.
Los periodos `pendiente` y `sin-dato` **no** entran en el denominador.

### Fechas
El timeline ordena los periodos de más antiguo a más reciente. Cada cuadro tiene tooltip con
periodo, estado y días de diferencia. Los periodos sin pago resuelto se dibujan en gris con borde
punteado para que no se lean como “a tiempo”.

### Promedio
Dos lecturas complementarias:
- **Promedio de pago**: media de `diasDiferencia` sobre todos los periodos cerrados (incluye
  anticipados, por eso puede ser negativo).
- **Suele pagar el día**: media del día del mes de `fechaPago`, comparada contra el día límite.

### Clasificación de cada pago — ⚠️ regla propuesta, no confirmada
Vive en `REGLAS_PAGO_PROPUESTAS` (`src/app/data/habitoPago.ts`) y la UI la enuncia al pie del widget:

| Estado | Regla propuesta |
| --- | --- |
| A tiempo | pago hasta el día límite (`toleranciaDias: 0`) |
| Atraso leve | 1–5 días después |
| Tardío | 6–15 días después |
| En mora | más de 15 días |
| Pendiente | periodo facturado sin pago registrado |
| Sin dato | el backend no resolvió el periodo |

Los niveles de hábito (Excelente ≥95 % sin mora · Bueno ≥80 % con máx. 1 mora · Irregular ≥60 % ·
Crítico <60 %) son también una propuesta de diseño. **Cuando negocio defina los cortes oficiales se
cambian en ese único archivo, sin tocar la UI.**

## 4. Estados diseñados

| Estado | Cuándo | Qué se muestra |
| --- | --- | --- |
| Con historial | Hay ≥1 periodo con pago registrado | Widget completo |
| Datos incompletos | `periodosSinDato > 0` | Callout ámbar + métricas calculadas solo con lo disponible; los periodos faltantes salen como “Sin dato” |
| Sin historial | Contrato en administración sin ningún pago cerrado | `EmptyState` explicando que el hábito se calcula desde el primer recaudo |
| Carga | Petición en curso | Skeletons con la silueta exacta del widget (anillo, 4 métricas, timeline, tabla) |
| Error | El servicio falló | Callout rojo con el mensaje del servicio + botón *Reintentar* |

Los cinco estados están navegables en **Guía de estilos y UI Kit → Organismos → Widget de recaudo**.

## 5. Qué necesita entregar desarrollo

Endpoint por contrato en administración, p. ej.
`GET /contratos/{idContrato}/habito-pago?periodos=12`

```ts
interface HabitoPagoResponse {
  contrato?: string;          // número de contrato mostrado como referencia
  pagos: PagoHistorico[];     // orden ascendente por periodo (más antiguo primero)
  periodosSinDato?: number;   // periodos del rango que el servicio no pudo resolver
}

interface PagoHistorico {
  periodo: string;            // "YYYY-MM"
  fechaLimite: string;        // "YYYY-MM-DD"
  fechaPago: string | null;   // "YYYY-MM-DD" | null si aún no se paga
  valor: number;              // valor recaudado, en pesos, sin formato
  diasDiferencia: number;     // fechaPago - fechaLimite; negativo = anticipado
  estado: "a-tiempo" | "leve" | "tardio" | "mora" | "pendiente" | "sin-dato";
}
```

Notas para backend:

- `diasDiferencia` y `estado` pueden venir calculados del servicio o dejarse en `null`/omitidos y el
  front los deriva con `clasificarPago()`. Preferible que los calcule el backend una vez que negocio
  fije los cortes, para que el mismo número se use en reportes.
- Mandar los periodos **completos del rango**, incluidos los que no se pudieron resolver, marcados
  como `sin-dato`; así el timeline no “salta” meses.
- El front no infiere periodos faltantes ni rellena huecos.
- Fuente actual del histórico: DDM (ya usado por la tabla de historial de pagos del contrato).

Mientras el endpoint no exista, el panel usa `generarHistorialPagos()` — serie determinística por
documento, solo para demo. Al conectar el servicio real se borra ese generador.
