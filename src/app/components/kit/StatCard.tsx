import { LinkText } from "./LinkText";
import { Skeleton } from "./Skeleton";

interface Row {
  label: string;
  value: string;
  href?: string;
  onClick?: () => void;
}

interface Props {
  title: string;
  rows: Row[];
  loading?: boolean;
}

export function StatCard({ title, rows, loading = false }: Props) {
  return (
    <section
      className="rounded-lg"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "20px 24px" }}
    >
      <h3 className="subtitle" style={{ color: "var(--navy)", marginBottom: 16 }}>{title}</h3>
      <div className="flex flex-col">
        {loading
          ? rows.map((row, i) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-2.5"
                style={{ borderTop: i === 0 ? "none" : "1px solid var(--gray-3)" }}
              >
                <Skeleton height={14} width="55%" />
                <Skeleton height={14} width={60} />
              </div>
            ))
          : rows.map((row, i) => {
              const isLink = !!row.href || !!row.onClick;
              return (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-2.5"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--gray-3)" }}
                >
                  <span className="body-regular" style={{ color: "var(--gray-10)" }}>{row.label}</span>
                  {isLink ? (
                    <LinkText onClick={row.onClick} bold icon="chevron">
                      {row.value}
                    </LinkText>
                  ) : (
                    <span className="body-regular" style={{ color: "var(--gray-10)", fontWeight: 600 }}>
                      {row.value}
                    </span>
                  )}
                </div>
              );
            })}
      </div>
    </section>
  );
}
