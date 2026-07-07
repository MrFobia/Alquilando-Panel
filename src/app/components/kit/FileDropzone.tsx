import { useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { DocumentCard } from "./DocumentCard";

interface Props {
  onFiles?: (files: File[]) => void;
  hint?: string;
  files?: File[];
  onRemove?: (index: number) => void;
  compact?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FilePreviewCard({ file, onDelete }: { file: File; onDelete?: () => void }) {
  const preview = useMemo(() => (file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined), [file]);
  return (
    <DocumentCard
      name={file.name}
      meta={`${file.type ? file.type.split("/")[1]?.toUpperCase() : "Archivo"} · ${formatSize(file.size)}`}
      preview={preview}
      onDelete={onDelete}
    />
  );
}

export function FileDropzone({ onFiles, hint = "Seleccione o arrastre aquí los archivos", files, onRemove, compact }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (list: FileList | null) => {
    if (list && list.length > 0) onFiles?.(Array.from(list));
  };

  const hasFiles = !!files && files.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-lg transition-colors"
        style={{
          border: `1.5px dashed ${dragging ? "var(--navy)" : "var(--gray-6)"}`,
          backgroundColor: dragging ? "var(--navy-light)" : "var(--gray-1)",
          padding: hasFiles || compact ? "14px 16px" : "24px 16px",
          cursor: "pointer",
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <Upload size={hasFiles || compact ? 18 : 22} style={{ color: "var(--navy)" }} />
        <span className="body-small-regular" style={{ color: "var(--navy)", fontWeight: 500 }}>
          {hasFiles ? "Agregar más archivos" : hint}
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {hasFiles && (
        <div className="flex flex-col gap-2">
          {files.map((file, i) => (
            <FilePreviewCard key={`${file.name}-${i}`} file={file} onDelete={onRemove ? () => onRemove(i) : undefined} />
          ))}
        </div>
      )}
    </div>
  );
}
