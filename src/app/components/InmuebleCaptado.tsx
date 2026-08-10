import { CheckCircle2, ListChecks, Bell, FileSearch } from "lucide-react";
import { AppButton } from "./kit/AppButton";
import { Footer } from "./kit/Footer";

interface Props {
  codigo: string;
  onVolver: () => void;
}

function InfoRow({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 40, height: 40, backgroundColor: "var(--navy-light)" }}
      >
        <Icon size={18} style={{ color: "var(--navy)" }} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="body-bold" style={{ color: "var(--gray-10)" }}>{title}</span>
        <span className="body-regular" style={{ color: "var(--gray-8)" }}>{children}</span>
      </div>
    </div>
  );
}

export function InmuebleCaptado({ codigo, onVolver }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <section
        className="rounded-lg flex flex-col items-center gap-3 text-center"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "40px 28px" }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 64, height: 64, backgroundColor: "var(--green-status-light)" }}
        >
          <CheckCircle2 size={32} style={{ color: "var(--green-status)" }} />
        </div>
        <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>¡Inmueble captado con éxito!</h1>
        <p className="body-regular" style={{ color: "var(--gray-8)", maxWidth: 520 }}>
          Ya creamos el inmueble en el sistema, en la sección Inclusiones, con toda la información y el plan que registraste.
        </p>

        <div
          className="flex flex-col items-center gap-1 rounded-lg"
          style={{ backgroundColor: "var(--gray-1)", border: "1px solid var(--gray-4)", padding: "14px 28px", marginTop: 8 }}
        >
          <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>Código del inmueble</span>
          <span className="title-secondary" style={{ color: "var(--navy)" }}>{codigo}</span>
        </div>
      </section>

      <section
        className="rounded-lg flex flex-col gap-6"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "24px 28px" }}
      >
        <span className="subtitle" style={{ color: "var(--navy)" }}>¿Qué sigue ahora?</span>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        <InfoRow icon={ListChecks} title="Ya está en tu lista de inclusiones">
          Búscalo en Inmuebles → En comercialización → Inclusiones, con el estado y los datos que acabas de registrar.
        </InfoRow>
        <InfoRow icon={FileSearch} title="Revisión y publicación">
          El equipo de comercialización validará la información antes de publicarlo en los canales según el plan seleccionado.
        </InfoRow>
        <InfoRow icon={Bell} title="Te vamos a notificar">
          Si enviaste el contrato a firma del propietario, te avisaremos en la plataforma en cuanto quede firmado.
        </InfoRow>
      </section>

      <div className="flex items-center justify-end">
        <AppButton variant="primary" bold onClick={onVolver}>Volver a inmuebles</AppButton>
      </div>

      <Footer />
    </div>
  );
}
