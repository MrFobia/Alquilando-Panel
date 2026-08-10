// Ciudades derivadas de BROKERS_INTERNOS_ROWS (BrokersInternos.tsx) y ACTIVOS_ROWS (Brokers.tsx).
const DATA = [
  { name: "Bogotá", internos: 3, externos: 3 },
  { name: "Caribe", internos: 2, externos: 2 },
  { name: "Occidente", internos: 1, externos: 0 },
  { name: "Norte", internos: 1, externos: 0 },
  { name: "Sur", internos: 1, externos: 0 },
].sort((a, b) => (b.internos + b.externos) - (a.internos + a.externos));

const maxValue = Math.max(...DATA.flatMap((d) => [d.internos, d.externos]));
const soloInterno = DATA.filter((d) => d.internos > 0 && d.externos === 0).length;
const totalInternos = DATA.reduce((sum, d) => sum + d.internos, 0);
const totalExternos = DATA.reduce((sum, d) => sum + d.externos, 0);

function Barra({ value, color }: { value: number; color: string }) {
  const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex-1 rounded-full" style={{ height: 8, backgroundColor: "var(--gray-3)" }}>
        <div style={{ width: `${pct}%`, height: 8, backgroundColor: color, borderRadius: 999, transition: "width 200ms" }} />
      </div>
      <span className="body-bold" style={{ width: 18, textAlign: "right", color: "var(--navy)" }}>{value}</span>
    </div>
  );
}

export function BrokersComparativaChart() {
  return (
    <section
      className="rounded-lg flex flex-col"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap" style={{ marginBottom: 4 }}>
        <h3 className="subtitle" style={{ color: "var(--navy)" }}>Brokers por ciudad: internos vs. externos</h3>
        <span className="body-regular" style={{ color: "var(--gray-9)" }}>
          {totalInternos} internos · {totalExternos} externos activos ·{" "}
          <span style={{ fontWeight: 600, color: "var(--gray-10)" }}>{soloInterno}</span> ciudades sin cobertura externa
        </span>
      </div>

      <div className="flex items-center gap-6" style={{ margin: "12px 0 16px", paddingLeft: 96 }}>
        <div className="flex items-center gap-2">
          <span className="shrink-0 rounded-sm" style={{ width: 10, height: 10, backgroundColor: "var(--navy)" }} />
          <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Internos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="shrink-0 rounded-sm" style={{ width: 10, height: 10, backgroundColor: "var(--orange-status)" }} />
          <span className="body-small-regular" style={{ color: "var(--gray-9)" }}>Externos</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {DATA.map((d) => (
          <div key={d.name} className="flex items-center gap-4">
            <span className="body-bold truncate" style={{ width: 88, flexShrink: 0, color: "var(--navy)" }}>{d.name}</span>
            <Barra value={d.internos} color="var(--navy)" />
            {d.externos > 0 ? (
              <Barra value={d.externos} color="var(--orange-status)" />
            ) : (
              <div className="flex-1 flex items-center">
                <span
                  className="disclamer"
                  style={{ color: "var(--red-status)", backgroundColor: "var(--gray-2)", padding: "2px 8px", borderRadius: 999 }}
                >
                  Sin cobertura externa
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
