/** Estilo compartido por los popovers anclados de la barra de herramientas de tablas. */
export const POPOVER_STYLE: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  zIndex: 30,
  minWidth: 220,
  backgroundColor: "#ffffff",
  border: "1px solid var(--gray-4)",
  borderRadius: "var(--radius-md)",
  boxShadow: "0 8px 24px rgba(16, 20, 60, 0.14)",
  overflow: "hidden",
};

/** Alto común de chips, pills y campos de la barra, para que todo lea como una sola familia. */
export const TOOLBAR_HEIGHT = 36;
