import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface Props {
  onFiles?: (files: File[]) => void;
  hint?: string;
}

export function FileDropzone({ onFiles, hint = "Seleccione o arrastre aquí los archivos" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (list: FileList | null) => {
    if (list && list.length > 0) onFiles?.(Array.from(list));
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-2 rounded-lg transition-colors"
      style={{
        border: `1.5px dashed ${dragging ? "var(--navy)" : "var(--gray-6)"}`,
        backgroundColor: dragging ? "var(--navy-light)" : "var(--gray-1)",
        padding: "24px 16px",
        cursor: "pointer",
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
    >
      <Upload size={22} style={{ color: "var(--navy)" }} />
      <span className="body-small-regular" style={{ color: "var(--navy)", fontWeight: 500 }}>{hint}</span>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}
