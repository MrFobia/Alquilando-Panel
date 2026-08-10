import { useEffect, useState } from "react";
import { TextInput } from "./kit/TextInput";
import { CurrencyInput } from "./kit/CurrencyInput";
import { SelectInput } from "./kit/SelectInput";
import { DateInput } from "./kit/DateInput";
import { ToggleSwitch } from "./kit/ToggleSwitch";
import { Field } from "./kit/Field";
import { Checkbox } from "./kit/Checkbox";
import { Textarea } from "./kit/Textarea";

const DURACION_CONTRATO_OPTIONS = ["6", "12", "24", "36"].map((v) => ({ value: v, label: `${v} meses` }));
const IVA_CANON_OPTIONS = [
  { value: "0", label: "Excluido" },
  { value: "19", label: "Responsable de IVA (19%)" },
];
const PORCENTAJE_INCREMENTO_OPTIONS = ["IPC", "IPC + puntos porcentuales", "Fijo"].map((v) => ({ value: v, label: v }));
const UNIDAD_REFERENCIA_OPTIONS = ["IPC", "SMLV", "UVT"].map((v) => ({ value: v, label: v }));

const PORCENTAJE_HONORARIOS_GESTION_COMERCIAL = "25";
const MESES_PRE_AVISO = Array.from({ length: 12 }, (_, i) => String(i + 1));

function addMeses(fecha: string, meses: number): string {
  if (!fecha || !meses) return "";
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return "";
  d.setMonth(d.getMonth() + meses);
  return d.toISOString().slice(0, 10);
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <span className="subtitle" style={{ color: "var(--navy)" }}>{children}</span>;
}

interface Props {
  onValidityChange?: (valid: boolean) => void;
}

export function PasoCondiciones({ onValidityChange }: Props = {}) {
  const [duracionContrato, setDuracionContrato] = useState("");

  const [fechaElaboracion, setFechaElaboracion] = useState("");
  const [comisionCanon, setComisionCanon] = useState("");
  const [comisionRecaudoAdmin, setComisionRecaudoAdmin] = useState("");

  const [fechaOcupacion, setFechaOcupacion] = useState("");
  const [periodoGracia, setPeriodoGraciaRaw] = useState(false);
  const [fechaInicioPeriodoGracia, setFechaInicioPeriodoGracia] = useState("");
  const [fechaFinPeriodoGracia, setFechaFinPeriodoGracia] = useState("");
  const setPeriodoGracia = (v: boolean) => {
    setPeriodoGraciaRaw(v);
    if (!v) { setFechaInicioPeriodoGracia(""); setFechaFinPeriodoGracia(""); }
  };
  const [fechaInicio, setFechaInicio] = useState("");
  const [duracionMeses, setDuracionMeses] = useState("");
  const [honorariosGestionComercial, setHonorariosGestionComercial] = useState("");
  const [canonArrendamiento, setCanonArrendamiento] = useState("");
  const [ivaCanon, setIvaCanon] = useState("");
  const [destinacionEspecifica, setDestinacionEspecifica] = useState("");
  const [condicionesEspecialesComercial, setCondicionesEspecialesComercial] = useState("");
  const [condicionesEspecialesJuridico, setCondicionesEspecialesJuridico] = useState("");

  const [porcentajeIncremento, setPorcentajeIncremento] = useState("");
  const [unidadReferencia, setUnidadReferencia] = useState("");
  const [puntosPorcentuales, setPuntosPorcentuales] = useState("");
  const [preAviso, setPreAvisoRaw] = useState(true);
  const [mesPreAviso, setMesPreAviso] = useState("");
  const setPreAviso = (v: boolean) => {
    setPreAvisoRaw(v);
    if (!v) setMesPreAviso("");
  };

  const fechaFinMandato = addMeses(fechaElaboracion, Number(duracionContrato) || 0);
  const vigencia = duracionContrato ? `${duracionContrato} meses` : "";
  const fechaCausacion = fechaOcupacion;
  const fechaFinArrendamiento = addMeses(fechaInicio, Number(duracionMeses) || 0);
  const fechaProximoIncremento = addMeses(fechaInicio, 12);

  const canonNum = Number(canonArrendamiento) || 0;
  const ivaRate = Number(ivaCanon) || 0;
  const totalCanonArrendamiento = canonNum ? String(Math.round(canonNum + (canonNum * ivaRate) / 100)) : "";

  const valido = !!(
    fechaElaboracion && comisionCanon && comisionRecaudoAdmin &&
    fechaOcupacion && fechaInicio && honorariosGestionComercial && canonArrendamiento
  );

  useEffect(() => { onValidityChange?.(valido); }, [valido, onValidityChange]);

  return (
    <section
      className="rounded-lg flex flex-col gap-6"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "24px 28px" }}
    >
      <span className="subtitle" style={{ color: "var(--navy)" }}>Información del contrato</span>
      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

      <div className="flex flex-col gap-4">
        <SubHeading>Duración del contrato</SubHeading>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
          <Field label="Duración del contrato">
            <SelectInput options={DURACION_CONTRATO_OPTIONS} value={duracionContrato} onChange={setDuracionContrato} className="w-full" />
          </Field>
        </div>
      </div>

      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

      <div className="flex flex-col gap-4">
        <SubHeading>Contrato mandato y administración</SubHeading>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
          <Field label="Fecha de elaboración" required>
            <DateInput value={fechaElaboracion} onChange={setFechaElaboracion} className="w-full" />
          </Field>
          <Field label="Fecha fin">
            <DateInput value={fechaFinMandato} disabled className="w-full" />
          </Field>
          <Field label="Comisión Canon" required>
            <CurrencyInput placeholder="Escriba aquí" value={comisionCanon} onChange={setComisionCanon} className="w-full" />
          </Field>
          <Field label="Comisión recaudo cuota de administración" required>
            <CurrencyInput placeholder="Escriba aquí" value={comisionRecaudoAdmin} onChange={setComisionRecaudoAdmin} className="w-full" />
          </Field>
          <Field label="Vigencia">
            <TextInput value={vigencia} disabled className="w-full" />
          </Field>
        </div>
      </div>

      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

      <div className="flex flex-col gap-4">
        <SubHeading>Contrato de arrendamiento</SubHeading>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
          <Field label="Fecha de ocupación" required>
            <DateInput value={fechaOcupacion} onChange={setFechaOcupacion} className="w-full" />
          </Field>
          <Field label="Fecha de causación">
            <DateInput value={fechaCausacion} disabled className="w-full" />
          </Field>
        </div>

        <Checkbox checked={periodoGracia} onChange={setPeriodoGracia} label="Periodo de gracia" />

        {periodoGracia && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
            <Field label="Fecha de inicio de periodo de gracia">
              <DateInput value={fechaInicioPeriodoGracia} onChange={setFechaInicioPeriodoGracia} className="w-full" />
            </Field>
            <Field label="Fecha de finalización de periodo de gracia">
              <DateInput value={fechaFinPeriodoGracia} onChange={setFechaFinPeriodoGracia} min={fechaInicioPeriodoGracia} className="w-full" />
            </Field>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
          <Field label="Fecha de inicio" required>
            <DateInput value={fechaInicio} onChange={setFechaInicio} className="w-full" />
          </Field>
          <Field label="Fecha fin">
            <DateInput value={fechaFinArrendamiento} disabled className="w-full" />
          </Field>
          <Field label="Duración en meses">
            <TextInput placeholder="Escriba aquí" value={duracionMeses} onChange={setDuracionMeses} className="w-full" />
          </Field>
          <Field label="Fecha del próximo incremento">
            <DateInput value={fechaProximoIncremento} disabled className="w-full" />
          </Field>
          <Field label="Honorarios de gestión comercial" required>
            <CurrencyInput placeholder="Escriba aquí" value={honorariosGestionComercial} onChange={setHonorariosGestionComercial} className="w-full" />
          </Field>
          <Field label="Porcentaje de honorarios de gestión comercial">
            <TextInput value={PORCENTAJE_HONORARIOS_GESTION_COMERCIAL} disabled className="w-full" />
          </Field>
          <Field label="Canon de arrendamiento" required>
            <CurrencyInput placeholder="Escriba aquí" value={canonArrendamiento} onChange={setCanonArrendamiento} className="w-full" />
          </Field>
          <Field label="Iva Canon">
            <SelectInput options={IVA_CANON_OPTIONS} value={ivaCanon} onChange={setIvaCanon} className="w-full" />
          </Field>
          <Field label="Total canon de arrendamiento">
            <CurrencyInput value={totalCanonArrendamiento} disabled className="w-full" />
          </Field>
        </div>

        <Field label="Destinación específica del inmueble">
          <Textarea value={destinacionEspecifica} placeholder="Escriba aquí" rows={3} onChange={setDestinacionEspecifica} />
        </Field>
        <Field label="Condiciones especiales comercial">
          <Textarea value={condicionesEspecialesComercial} placeholder="Escriba aquí" rows={3} onChange={setCondicionesEspecialesComercial} />
        </Field>
        <Field label="Condiciones especiales jurídico">
          <Textarea value={condicionesEspecialesJuridico} placeholder="Escriba aquí" rows={3} onChange={setCondicionesEspecialesJuridico} />
        </Field>
      </div>

      <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

      <div className="flex flex-col gap-4">
        <SubHeading>Incrementos al canon</SubHeading>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-lg:grid-cols-1">
          <Field label="Porcentaje de incremento">
            <SelectInput options={PORCENTAJE_INCREMENTO_OPTIONS} value={porcentajeIncremento} onChange={setPorcentajeIncremento} className="w-full" />
          </Field>
          <Field label="Unidad de referencia">
            <SelectInput options={UNIDAD_REFERENCIA_OPTIONS} value={unidadReferencia} onChange={setUnidadReferencia} className="w-full" />
          </Field>
          <Field label="Puntos porcentuales">
            <TextInput placeholder="Escriba aquí" value={puntosPorcentuales} onChange={setPuntosPorcentuales} className="w-full" />
          </Field>
        </div>

        <div className="flex flex-col gap-2">
          <ToggleSwitch checked={preAviso} onChange={setPreAviso} label="Pre aviso" />
          <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>
            Define con cuántos meses de anticipación (antes de la fecha fin del contrato) se debe notificar al inquilino y al propietario la decisión de renovar, terminar o no dar continuidad al arrendamiento.
          </span>
        </div>
        {preAviso && (
          <div className="flex items-center gap-2 flex-wrap">
            {MESES_PRE_AVISO.map((mes) => {
              const selected = mesPreAviso === mes;
              return (
                <button
                  key={mes}
                  type="button"
                  onClick={() => setMesPreAviso(mes)}
                  className="body-regular flex items-center justify-center"
                  style={{
                    minWidth: 44,
                    height: 40,
                    padding: "0 12px",
                    borderRadius: "var(--radius-md)",
                    border: `1px solid ${selected ? "var(--navy)" : "var(--gray-5)"}`,
                    backgroundColor: selected ? "var(--navy-light)" : "#ffffff",
                    color: selected ? "var(--navy)" : "var(--gray-9)",
                    fontWeight: selected ? 700 : 400,
                    cursor: "pointer",
                  }}
                >
                  {mes}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
