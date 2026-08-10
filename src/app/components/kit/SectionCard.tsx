import { LinkText } from "./LinkText";

interface Props {
  title?: string;
  link?: { label: string; onClick: () => void };
  headerExtra?: React.ReactNode;
  padding?: number | string;
  className?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, link, headerExtra, padding, className = "", children }: Props) {
  return (
    <section
      className={`rounded-lg flex flex-col gap-4 ${className}`}
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: padding ?? (title ? "24px 28px" : 16) }}
    >
      {title && (
        <>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <span className="subtitle" style={{ color: "var(--navy)" }}>{title}</span>
            {(link || headerExtra) && (
              <div className="flex items-center gap-4">
                {link && <LinkText icon="chevron" onClick={link.onClick}>{link.label}</LinkText>}
                {headerExtra}
              </div>
            )}
          </div>
          <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />
        </>
      )}
      {children}
    </section>
  );
}
