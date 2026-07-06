import { useState } from "react";
import { FileText, Eye, Download, Trash2 } from "lucide-react";
import { IconButton } from "./IconButton";

interface Props {
  name: string;
  meta?: string;
  onView?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

export function DocumentCard({ name, meta, onView, onDownload, onDelete }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="flex items-center gap-3 rounded-lg transition-colors"
      style={{
        backgroundColor: "#ffffff",
        border: `1px solid ${hover ? "var(--navy)" : "var(--gray-5)"}`,
        padding: "12px 16px",
        width: "100%",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="flex items-center justify-center rounded-lg shrink-0"
        style={{ width: 38, height: 38, backgroundColor: "var(--navy-light)" }}
      >
        <FileText size={18} style={{ color: "var(--navy)" }} />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="body-small-regular break-all" style={{ color: "var(--gray-10)", fontWeight: 500 }}>
          {name}
        </span>
        {meta && <span className="disclamer" style={{ color: "var(--gray-8)" }}>{meta}</span>}
      </div>
      <div className="flex items-center shrink-0" style={{ opacity: hover ? 1 : 0, transition: "opacity 0.15s" }}>
        {onView && <IconButton icon={Eye} title="Ver documento" onClick={onView} />}
        {onDownload && <IconButton icon={Download} title="Descargar" onClick={onDownload} />}
        {onDelete && <IconButton icon={Trash2} title="Eliminar" onClick={onDelete} />}
      </div>
    </div>
  );
}
