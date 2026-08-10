import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { AppButton } from "./AppButton";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSaveExit: () => void;
  onDiscard: () => void;
}

export function ConfirmExitModal({ open, onCancel, onSaveExit, onDiscard }: Props) {
  return (
    <Modal open={open} onClose={onCancel} title="¿Seguro que quieres salir?" width={460}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: 36, height: 36, backgroundColor: "var(--orange-status-light)" }}
          >
            <AlertTriangle size={18} style={{ color: "var(--orange-status)" }} />
          </div>
          <p className="body-regular" style={{ color: "var(--gray-9)" }}>
            Vas a salir de este proceso sin finalizarlo. Puedes guardar lo que llevas como borrador para continuar después, o eliminarlo.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 flex-wrap">
          <AppButton variant="ghost" onClick={onCancel}>Cancelar</AppButton>
          <AppButton variant="danger" bold onClick={onDiscard}>Eliminar</AppButton>
          <AppButton variant="primary" bold onClick={onSaveExit}>Guardar y salir</AppButton>
        </div>
      </div>
    </Modal>
  );
}
