import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

export function TagInput({ value, onChange, placeholder, error = false, disabled = false, className = "" }: Props) {
  const [draft, setDraft] = useState("");

  const commit = (text: string) => {
    const tag = text.trim();
    if (tag) onChange([...value, tag]);
  };

  const handleChange = (raw: string) => {
    if (!raw.includes(",")) {
      setDraft(raw);
      return;
    }
    const parts = raw.split(",");
    const last = parts.pop() ?? "";
    parts.forEach((p) => commit(p));
    setDraft(last);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (draft.trim()) { commit(draft); setDraft(""); }
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div
      className={`flex flex-wrap items-center gap-2 w-full ${className}`}
      style={{
        border: `${error ? "1.5px" : "1px"} solid ${error ? "var(--red-status)" : "var(--gray-5)"}`,
        borderRadius: "var(--radius-md)",
        padding: "8px 10px",
        minHeight: 40,
        backgroundColor: disabled ? "var(--gray-2)" : error ? "var(--red-status-light)" : "#ffffff",
      }}
      onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
    >
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="tags inline-flex items-center gap-1 rounded-full"
          style={{ backgroundColor: "var(--navy-light)", color: "var(--navy)", padding: "4px 8px" }}
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
              style={{ cursor: "pointer", display: "flex", color: "var(--navy)" }}
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          )}
        </span>
      ))}
      <input
        type="text"
        value={draft}
        placeholder={value.length === 0 ? placeholder : undefined}
        disabled={disabled}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (draft.trim()) { commit(draft); setDraft(""); } }}
        className="body-regular flex-1 min-w-[120px]"
        style={{ border: "none", outline: "none", background: "transparent", color: "var(--gray-10)" }}
      />
    </div>
  );
}
