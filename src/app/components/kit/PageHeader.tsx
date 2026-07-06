interface Props {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: Props) {
  return (
    <section
      className="flex items-start justify-between gap-4 rounded-lg flex-wrap"
      style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "24px 28px" }}
    >
      <div>
        <h1 className="title-primary-bold" style={{ color: "var(--navy)", whiteSpace: "nowrap" }}>{title}</h1>
        {description && (
          <p className="body-bold" style={{ color: "var(--gray-10)", marginTop: 4 }}>{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </section>
  );
}
