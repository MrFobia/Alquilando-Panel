import { createContext, useContext } from "react";
import type { UserRole } from "../components/Login";

/**
 * Perfil de la inmobiliaria que abre el panel. Solo la inmobiliaria maestra
 * ve los módulos de recaudo (hábito de pago); las aliadas y el portal del
 * inquilino no tienen acceso a esa lectura.
 */
export type PerfilInmobiliaria = "maestra" | "aliada";

export interface Session {
  role: UserRole | null;
  perfil: PerfilInmobiliaria | null;
}

const SessionCtx = createContext<Session>({ role: null, perfil: null });

export function SessionProvider({ value, children }: { value: Session; children: React.ReactNode }) {
  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useSession() {
  return useContext(SessionCtx);
}

/** Gate único para todo lo que sea exclusivo de la inmobiliaria maestra. */
export function useEsInmobiliariaMaestra() {
  const { role, perfil } = useSession();
  return role === "inmobiliaria" && perfil === "maestra";
}
