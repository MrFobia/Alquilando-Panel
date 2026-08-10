import { CheckCircle2, Clock, Bell, FileSearch } from "lucide-react";
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

export function ContratoEnviado({ codigo, onVolver }: Props) {
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
        <h1 className="title-primary-bold" style={{ color: "var(--navy)" }}>¡Tu contrato fue enviado a aprobación!</h1>
        <p className="body-regular" style={{ color: "var(--gray-8)", maxWidth: 520 }}>
          Ya creamos tu contrato en el sistema, en la etapa "En elaboración", y lo enviamos al equipo jurídico para su revisión.
        </p>

        <div
          className="flex flex-col items-center gap-1 rounded-lg"
          style={{ backgroundColor: "var(--gray-1)", border: "1px solid var(--gray-4)", padding: "14px 28px", marginTop: 8 }}
        >
          <span className="body-small-regular" style={{ color: "var(--gray-7)" }}>Código de seguimiento</span>
          <span className="title-secondary" style={{ color: "var(--navy)" }}>{codigo}</span>
        </div>
      </section>

      <section
        className="rounded-lg flex flex-col gap-6"
        style={{ backgroundColor: "#ffffff", border: "1px solid var(--gray-4)", padding: "24px 28px" }}
      >
        <span className="subtitle" style={{ color: "var(--navy)" }}>¿Qué sigue ahora?</span>
        <hr style={{ borderColor: "var(--gray-5)", margin: 0 }} />

        <InfoRow icon={FileSearch} title="Revisión del equipo jurídico">
          El equipo jurídico validará la información y los documentos que cargaste. Si falta algo o hay un error, te devolverán la solicitud para corregirla.
        </InfoRow>
        <InfoRow icon={Bell} title="Te vamos a notificar">
          Recibirás una notificación en la plataforma y por correo apenas el contrato sea aprobado o rechazado — no tienes que estar preguntando por el estado.
        </InfoRow>
        <InfoRow icon={Clock} title="Puedes hacerle seguimiento cuando quieras">
          Entra a Contratos → "En aprobación jurídico" y busca por el código {codigo} para ver en qué va tu solicitud en cualquier momento.
        </InfoRow>
      </section>

      <div className="flex items-center justify-end">
        <AppButton variant="primary" bold onClick={onVolver}>Volver a contratos</AppButton>
      </div>

      <Footer />
    </div>
  );
}
