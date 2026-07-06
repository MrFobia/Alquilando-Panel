import { AlquilandoLogo } from "./AlquilandoLogo";

export function Footer() {
  return (
    <footer
      className="flex items-center justify-center py-4 w-full"
      style={{ borderTop: "1px solid var(--gray-5)" }}
    >
      <AlquilandoLogo height={29} textColor="var(--gray-6)" iconColor="var(--gray-6)" />
    </footer>
  );
}
