import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LinkText } from "./LinkText";
import { Callout } from "./Callout";

export type HelpBlock =
  | { type: "text"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "slider"; images: Array<{ src: string; alt?: string; caption?: string }> }
  | { type: "video"; src: string; caption?: string }
  | { type: "link"; label: string; href: string }
  | { type: "callout"; variant?: "info" | "warning"; title?: string; text: string };

function isYoutube(src: string) {
  return src.includes("youtube.com") || src.includes("youtu.be");
}

function toYoutubeEmbed(src: string) {
  const idMatch = src.match(/(?:v=|youtu\.be\/)([\w-]+)/);
  return idMatch ? `https://www.youtube.com/embed/${idMatch[1]}` : src;
}

// ─── Image Slider ────────────────────────────────────────────────────────────
interface SliderImage {
  src: string;
  alt?: string;
  caption?: string;
}

function ImageSlider({ images }: { images: SliderImage[] }) {
  const [current, setCurrent] = useState(0);
  const total = images.length;


  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const slide = images[current];

  return (
    <figure className="flex flex-col gap-2">
      <div style={{ position: "relative", overflow: "hidden", backgroundColor: "var(--gray-2)", borderRadius: 8, aspectRatio: "16 / 9" }}>
        {/* Imagen */}
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt ?? ""}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "opacity 0.25s ease",
          }}
        />

        {/* Overlay oscuro en bordes para dar profundidad */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.35))",
            pointerEvents: "none",
          }}
        />

        {/* Contador */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            backgroundColor: "rgba(0,0,0,0.55)",
            color: "#fff",
            borderRadius: 99,
            padding: "2px 10px",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          {current + 1} / {total}
        </div>

        {/* Flechas de navegación (solo si hay más de una imagen) */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.92)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                transition: "background 0.15s",
              }}
            >
              <ChevronLeft size={18} style={{ color: "var(--navy)" }} />
            </button>
            <button
              onClick={next}
              aria-label="Imagen siguiente"
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.92)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                transition: "background 0.15s",
              }}
            >
              <ChevronRight size={18} style={{ color: "var(--navy)" }} />
            </button>
          </>
        )}

        {/* Dots */}
        {total > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 6,
            }}
          >
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Ir a imagen ${idx + 1}`}
                style={{
                  width: idx === current ? 20 : 8,
                  height: 8,
                  borderRadius: 99,
                  backgroundColor: idx === current ? "#fff" : "rgba(255,255,255,0.5)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Caption de la imagen actual */}
      {slide.caption && (
        <figcaption
          className="disclamer"
          style={{ color: "var(--gray-8)" }}
        >
          {slide.caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─── HelpBlocks ──────────────────────────────────────────────────────────────
interface Props {
  blocks: HelpBlock[];
  onNavigate?: (target: string) => void;
}

export function HelpBlocks({ blocks, onNavigate }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "text":
            return <p key={i}>{block.text}</p>;

          case "list":
            return (
              <ol key={i} className="list-decimal flex flex-col gap-1" style={{ paddingLeft: 20 }}>
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ol>
            );

          case "link": {
            const isInternal = block.href.startsWith("#");
            return (
              <LinkText
                key={i}
                icon={isInternal ? "chevron" : "external"}
                onClick={() => {
                  if (isInternal) onNavigate?.(block.href.slice(1));
                  else window.open(block.href, "_blank", "noopener,noreferrer");
                }}
              >
                {block.label}
              </LinkText>
            );
          }

          case "callout":
            return (
              <Callout key={i} variant={block.variant ?? "info"} title={block.title}>
                {block.text}
              </Callout>
            );

          // Imagen individual — contenida en el acordeón, proporción 16:9
          case "image":
            return (
              <figure key={i} className="flex flex-col gap-2">
                <div style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "16 / 9" }}>
                  <img
                    src={block.src}
                    alt={block.alt ?? ""}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                {block.caption && (
                  <figcaption
                    className="disclamer"
                    style={{ color: "var(--gray-8)" }}
                  >
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          // Slider de imágenes
          case "slider":
            return <ImageSlider key={i} images={block.images} />;

          case "video":
            return (
              <figure key={i} className="flex flex-col gap-2">
                {isYoutube(block.src) ? (
                  <div style={{ aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 8 }}>
                    <iframe
                      src={toYoutubeEmbed(block.src)}
                      title={block.caption ?? "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                    />
                  </div>
                ) : (
                  <div style={{ aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 8 }}>
                    <video
                      src={block.src}
                      controls
                      style={{ width: "100%", height: "100%", display: "block", backgroundColor: "#000" }}
                    />
                  </div>
                )}
                {block.caption && (
                  <figcaption
                    className="disclamer"
                    style={{ color: "var(--gray-8)" }}
                  >
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
