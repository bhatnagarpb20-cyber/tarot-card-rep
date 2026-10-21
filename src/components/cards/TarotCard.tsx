import { getCard } from "@/content/cards";
import { cardImageUrl, getCardArt } from "@/lib/art/registry";
import { SuitEmblem } from "./SuitEmblem";
import { VECTOR_ART } from "./art";
import { Star } from "@/components/ornament/Ornaments";
import type { Suit } from "@/lib/tarot/types";

export type CardSize = "xs" | "sm" | "md" | "lg" | "fluid";

const SIZE_CLASS: Record<CardSize, string> = {
  xs: "w-20",
  sm: "w-28 sm:w-32",
  md: "w-44 sm:w-52",
  lg: "w-64 sm:w-72",
  fluid: "w-full",
};

/** `sizes` hints so the browser downloads the smallest adequate image. */
const SIZES_ATTR: Record<CardSize, string> = {
  xs: "80px",
  sm: "(min-width: 640px) 128px, 112px",
  md: "(min-width: 640px) 208px, 176px",
  lg: "(min-width: 640px) 288px, 256px",
  fluid: "(min-width: 1024px) 320px, 45vw",
};

interface TarotCardProps {
  cardId: string;
  reversed?: boolean;
  size?: CardSize;
  /** Load eagerly (use for the main card on a page). */
  priority?: boolean;
  className?: string;
}

/**
 * The one card component used throughout the app. Shows processed artwork when it exists;
 * otherwise an explicitly labelled "illustration in production" face — never a broken image
 * or an unrelated placeholder.
 */
export function TarotCard({ cardId, reversed = false, size = "md", priority = false, className = "" }: TarotCardProps) {
  const card = getCard(cardId);
  if (!card) return null;
  const art = getCardArt(cardId);
  const vector = VECTOR_ART[cardId];
  const orientation = reversed ? " Shown reversed (upside down)." : "";

  return (
    <figure className={`relative aspect-[2/3] shrink-0 ${SIZE_CLASS[size]} ${className}`}>
      <div className={`h-full w-full overflow-hidden rounded-[var(--radius-card)] shadow-[0_24px_50px_-24px_rgb(255_95_168/0.45)] ring-1 ring-cream/25 ${reversed ? "rotate-180" : ""}`}>
        {vector ? (
          <div role="img" aria-label={`${vector.alt}${orientation}`} className="h-full w-full">
            <div aria-hidden="true" className="h-full w-full">
              <vector.Component />
            </div>
          </div>
        ) : art?.image ? (
          <picture>
            {art.image.formats
              .filter((f) => f !== "jpg")
              .map((format) => (
                <source
                  key={format}
                  type={`image/${format}`}
                  sizes={SIZES_ATTR[size]}
                  srcSet={art.image!.widths.map((w) => `${cardImageUrl(cardId, art.image!.hash, w, format)} ${w}w`).join(", ")}
                />
              ))}
            {/* Plain <img>: assets are pre-optimised by the art pipeline with explicit srcset. */}
            <img
              src={cardImageUrl(cardId, art.image.hash, 720, "jpg")}
              srcSet={art.image.widths.map((w) => `${cardImageUrl(cardId, art.image!.hash, w, "jpg")} ${w}w`).join(", ")}
              sizes={SIZES_ATTR[size]}
              width={art.image.width}
              height={art.image.height}
              alt={`${art.alt}${orientation}`}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              className="h-full w-full object-cover"
              style={{ backgroundImage: `url(${art.image.lqip})`, backgroundSize: "cover" }}
            />
          </picture>
        ) : (
          <PendingCardFace name={card.name} numeral={card.arcana === "major" ? card.numeral : null} suit={card.suit} label={`${card.name}. Illustration not yet available.${orientation}${art ? ` Traditional scene: ${art.alt.replace(`${card.name} tarot card. `, "")}` : ""}`} compact={size === "xs" || size === "sm"} />
        )}
      </div>
    </figure>
  );
}

function PendingCardFace({ name, numeral, suit, label, compact }: { name: string; numeral: string | null; suit: Suit | null; label: string; compact: boolean }) {
  return (
    <div role="img" aria-label={label} className="relative flex h-full w-full flex-col bg-[radial-gradient(120%_70%_at_50%_0%,var(--color-void-raised),var(--color-void-sunk))] p-[6%] text-cream">
      <div aria-hidden="true" className="absolute inset-[3%] rounded-[calc(var(--radius-card)-4px)] border border-acid/70" />
      {/* Portal window: three rainbow bands framing the numeral or suit */}
      <div aria-hidden="true" className="relative mx-[4%] mt-[6%] flex flex-1 items-center justify-center rounded-t-[999px] border-[0.35em] border-b-0 border-teal">
        <div className="absolute inset-[0.3em] rounded-t-[999px] border-[0.35em] border-b-0 border-hot" />
        <div className="absolute inset-[0.95em] rounded-t-[999px] border-[0.35em] border-b-0 border-acid" />
        <div className="relative flex flex-col items-center">
          {suit ? (
            <SuitEmblem suit={suit} className="h-[3.2em] w-[3.2em] text-acid" />
          ) : (
            <span className="font-[family-name:var(--font-heading)] text-[2.4em] leading-none text-acid">{numeral}</span>
          )}
        </div>
      </div>
      {/* Title plate */}
      <div aria-hidden="true" className="relative mt-[5%] mb-[2%] text-center">
        <span className={`block font-[family-name:var(--font-heading)] leading-tight ${compact ? "text-[0.62em]" : "text-[0.95em]"}`}>{name}</span>
        {!compact && (
          <span className="mt-1 flex items-center justify-center gap-1 font-[family-name:var(--font-display)] text-[0.42em] font-bold uppercase tracking-[0.16em] text-cream/85">
            <Star size={6} className="text-hot" /> Art coming soon
          </span>
        )}
      </div>
    </div>
  );
}
