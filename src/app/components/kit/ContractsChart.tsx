import { useRef, useState, useEffect } from "react";
import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area } from "recharts";
import { Skeleton } from "./Skeleton";

const data = [
  { mes: "Ene 2026", admin: 450, finalizados: 12, nuevos: 18, porFinalizar: 22, siniestrados: 3 },
  { mes: "Feb 2026", admin: 463, finalizados: 14, nuevos: 24, porFinalizar: 19, siniestrados: 2 },
  { mes: "Mar 2026", admin: 471, finalizados: 11, nuevos: 21, porFinalizar: 25, siniestrados: 4 },
  { mes: "Abr 2026", admin: 480, finalizados: 16, nuevos: 27, porFinalizar: 23, siniestrados: 1 },
  { mes: "May 2026", admin: 487, finalizados: 13, nuevos: 19, porFinalizar: 21, siniestrados: 2 },
  { mes: "Jun 2026", admin: 497, finalizados: 15, nuevos: 22, porFinalizar: 24, siniestrados: 3 },
];

const SERIES = [
  { key: "admin", name: "En administración", color: "var(--violeta)" },
  { key: "finalizados", name: "Finalizados", color: "var(--green-status)" },
  { key: "nuevos", name: "Nuevos Contratos", color: "var(--orange-status)" },
  { key: "porFinalizar", name: "Por Finalizar", color: "var(--alquilando)" },
  { key: "siniestrados", name: "Siniestrados", color: "#E91E63" },
];

interface Props {
  loading?: boolean;
  actions?: React.ReactNode;
}

export function ContractsChart({ loading = false, actions }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const height = 280;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      className="rounded-lg"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap" style={{ marginBottom: 16 }}>
        <h3 className="subtitle" style={{ color: "var(--navy)" }}>Estado de contratos</h3>
        {actions}
      </div>
      <div ref={containerRef} style={{ width: "100%", height }}>
        {loading ? (
          <div className="flex flex-col gap-3 h-full justify-end pb-6">
            <Skeleton height={height - 40} radius="var(--radius-md)" />
            <div className="flex gap-6 justify-center">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height={11} width={70} />)}
            </div>
          </div>
        ) : width > 0 && (
          <AreaChart width={width} height={height} data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid key="grid" strokeDasharray="3 3" stroke="var(--gray-4)" vertical={false} />
            <XAxis key="x" dataKey="mes" tick={{ fontSize: 11, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={{ stroke: "var(--gray-5)" }} tickLine={false} />
            <YAxis key="y" tick={{ fontSize: 11, fill: "var(--gray-8)", fontFamily: "Roboto" }} axisLine={false} tickLine={false} domain={[0, 600]} ticks={[0, 100, 200, 300, 400, 500, 600]} />
            <Tooltip key="tooltip" contentStyle={{ borderRadius: "var(--radius-md)", borderWidth: 1, borderStyle: "solid", borderColor: "var(--gray-4)", backgroundColor: "#ffffff", fontFamily: "Roboto", fontSize: 12 }} />
            <Legend key="legend" iconType="square" wrapperStyle={{ fontFamily: "Roboto", fontSize: 11, paddingTop: 12 }} />
            {SERIES.map((s) => (
              <Area
                key={`area-${s.key}`}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                fill={s.color}
                fillOpacity={0.25}
                dot={{ r: 2.5, fill: s.color, stroke: s.color }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        )}
      </div>
    </section>
  );
}
