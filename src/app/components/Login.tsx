import { useState } from "react";
import { Eye, EyeOff, UserRound, CircleCheck } from "lucide-react";
import { AlquilandoLogo } from "./kit/AlquilandoLogo";

const PURPLE = "#6d28d9";
const PURPLE_DARK = "#5b21b6";
const PURPLE_BG = "#f5f3ff";

export type UserRole = "inmobiliaria" | "inquilino";

/** Usuarios demo: inmobiliaria entra al panel de administración, inquilino a su portal. */
const USUARIOS: { match: string[]; role: UserRole }[] = [
  { match: ["inmobiliariamaestra@alquilando.com"], role: "inmobiliaria" },
  { match: ["inquilino@alquilando.com", "1032423876"], role: "inquilino" },
];

const BENEFICIOS = [
  "Paga tu arriendo en línea a través de PSE",
  "Consulta contratos, comprobantes y fechas clave",
  "Descarga tu código de barras para pagos presenciales",
  "Gestiona tus solicitudes y novedades",
  "Accede desde cualquier dispositivo, cuando quieras",
];

interface Props {
  onLogin: (role: UserRole) => void;
}

export function Login({ onLogin }: Props) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valido = usuario.trim() && password.trim();

  const entrar = () => {
    const u = usuario.trim().toLowerCase();
    const found = USUARIOS.find((x) => x.match.some((m) => m.toLowerCase() === u));
    if (!found) {
      setError("No encontramos una cuenta con ese usuario. Verifica tu cédula, NIT o correo.");
      return;
    }
    setError(null);
    onLogin(found.role);
  };

  const inputStyle: React.CSSProperties = {
    border: "1px solid var(--gray-5)",
    borderRadius: "var(--radius-md)",
    padding: "0 12px",
    height: 44,
    color: "var(--gray-10)",
    outline: "none",
    width: "100%",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#ffffff", fontFamily: "Roboto, sans-serif" }}>
      {/* Logo */}
      <header style={{ padding: "28px 40px" }}>
        <AlquilandoLogo height={34} textColor={PURPLE} iconColor={PURPLE} />
      </header>

      {/* Contenido central */}
      <main className="flex-1 flex items-center justify-center" style={{ padding: "24px 40px 48px" }}>
        <div className="grid grid-cols-2 gap-10 w-full max-lg:grid-cols-1" style={{ maxWidth: 1250 }}>
          {/* Card de login */}
          <section
            className="rounded-lg flex flex-col gap-5"
            style={{ border: "1px solid var(--gray-4)", padding: "44px 48px", backgroundColor: "#ffffff" }}
          >
            <h1 className="title-secondary text-center" style={{ color: PURPLE }}>
              Entra a tu portal de Alquilando
            </h1>
            <p className="body-bold text-center" style={{ color: "var(--gray-10)", marginTop: -8 }}>
              Gestiona tus pagos, contratos y solicitudes en un solo lugar.
            </p>

            {/* Callout inquilino/propietario */}
            <div
              className="flex items-start gap-3 rounded-lg"
              style={{ backgroundColor: PURPLE_BG, padding: "14px 16px" }}
            >
              <div
                className="flex items-center justify-center rounded-full shrink-0"
                style={{ width: 34, height: 34, backgroundColor: "#ede9fe" }}
              >
                <UserRound size={17} style={{ color: PURPLE }} />
              </div>
              <p className="body-small-regular" style={{ color: PURPLE, margin: 0 }}>
                <span style={{ fontWeight: 700 }}>Eres Inquilino o propietario:</span>{" "}
                ingresa tu número de cédula o NIT (Sin número de verificación) asociado a tu contrato.
              </p>
            </div>

            {/* Usuario */}
            <label className="flex flex-col gap-1.5">
              <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 700 }}>Tu usuario*</span>
              <input
                type="text"
                value={usuario}
                placeholder="Cédula, NIT o correo"
                onChange={(e) => setUsuario(e.target.value)}
                className="body-regular"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = PURPLE; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--gray-5)"; }}
              />
            </label>

            {/* Contraseña */}
            <label className="flex flex-col gap-1.5">
              <span className="body-small-regular" style={{ color: "var(--gray-10)", fontWeight: 700 }}>Contraseña*</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Escriba aquí"
                  onChange={(e) => setPassword(e.target.value)}
                  className="body-regular"
                  style={{ ...inputStyle, paddingRight: 42 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = PURPLE; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--gray-5)"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute flex items-center justify-center"
                  style={{ right: 10, top: 0, bottom: 0, cursor: "pointer", color: "var(--gray-7)", backgroundColor: "transparent" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && (
              <div
                className="body-small-regular rounded-lg"
                style={{ backgroundColor: "var(--red-status-light)", color: "var(--red-status)", padding: "10px 14px" }}
              >
                {error}
              </div>
            )}

            {/* Entrar */}
            <button
              onClick={entrar}
              disabled={!valido}
              className="body-bold rounded-lg w-full transition-colors"
              style={{
                height: 46,
                backgroundColor: valido ? PURPLE : "var(--gray-5)",
                color: "#ffffff",
                cursor: valido ? "pointer" : "not-allowed",
                border: "none",
              }}
              onMouseEnter={(e) => { if (valido) e.currentTarget.style.backgroundColor = PURPLE_DARK; }}
              onMouseLeave={(e) => { if (valido) e.currentTarget.style.backgroundColor = PURPLE; }}
            >
              Entrar al portal
            </button>

            <hr style={{ borderColor: "var(--gray-4)", margin: 0 }} />

            <p className="body-regular text-center" style={{ color: "var(--gray-10)", margin: 0 }}>
              ¿No tienes contraseña o la olvidaste?
            </p>

            <button
              className="body-bold rounded-lg w-full transition-colors"
              style={{
                height: 46,
                backgroundColor: "transparent",
                color: PURPLE,
                border: `1.5px solid ${PURPLE}`,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = PURPLE_BG; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              Generar nueva contraseña
            </button>
          </section>

          {/* Panel de beneficios */}
          <section
            className="rounded-xl flex flex-col gap-6"
            style={{ backgroundColor: PURPLE, padding: "48px 52px" }}
          >
            <h2 className="title-primary-bold" style={{ color: "#ffffff", lineHeight: 1.25 }}>
              Alquilando es tu portal de gestión inmobiliaria
            </h2>
            <p className="title-tertiary-regular" style={{ color: "#ffffff", margin: 0 }}>
              Solo necesitas tu cédula o NIT y una contraseña.
            </p>
            <ul className="flex flex-col gap-5" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {BENEFICIOS.map((b) => (
                <li key={b} className="flex items-center gap-4">
                  <CircleCheck size={26} strokeWidth={1.6} style={{ color: "var(--alquilando)", flexShrink: 0 }} />
                  <span className="body-bold" style={{ color: "#ffffff" }}>{b}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="flex items-center justify-center py-5 w-full"
        style={{ borderTop: "1px solid var(--gray-4)" }}
      >
        <AlquilandoLogo height={26} textColor="var(--gray-6)" iconColor="var(--gray-6)" />
      </footer>
    </div>
  );
}
