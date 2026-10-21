import { getCard } from "@/content/cards";
import { cardImageUrl, getCardArt } from "@/lib/art/registry";
import { SuitEmblem } from "./SuitEmblem";
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
  const orientation = reversed ? " Shown reversed (upside down)." : "";

  return (
    <figure className={`relative aspect-[2/3] shrink-0 ${SIZE_CLASS[size]} ${className}`}>
      <div className={`h-full w-full overflow-hidden rounded-[var(--radius-card)] shadow-[0_20px_40px_-20px_rgb(0_0_0/0.8)] ring-1 ring-gold/60 ${reversed ? "rotate-180" : ""}`}>
        {art?.image ? (
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
    <div role="img" aria-label={label} className="relative flex h-full w-full flex-col bg-[radial-gradient(circle_at_50%_40%,var(--color-indigo),var(--color-ink))] p-[5%] text-ivory">
      <div aria-hidden="true" className="absolute inset-[3%] rounded-[calc(var(--radius-card)-4px)] border border-gold/80" />
      <div aria-hidden="true" className="absolute inset-[5.5%] rounded-[calc(var(--radius-card)-6px)] border border-gold/30" />
      {/* Arched window */}
      <div aria-hidden="true" className="relative mx-[6%] mt-[9%] flex flex-1 flex-col items-center justify-center rounded-t-[999px] border-2 border-gold/80 bg-midnight/60">
        <span className="absolute -top-[0.9em] flex h-[1.8em] min-w-[1.8em] items-center justify-center rounded-full border border-gold bg-ink px-1 font-[family-name:var(--font-display)] text-[0.7em] text-ivory">
          {numeral ?? <Star size={10} className="text-gold-light" />}
        </span>
        {suit ? (
          <SuitEmblem suit={suit} className="h-1/3 w-1/3 text-gold/70" />
        ) : (
          <span className="font-[family-name:var(--font-display)] text-[2.2em] text-gold/60">{numeral}</span>
        )}
        {!compact && <span className="mt-3 px-2 text-center font-[family-name:var(--font-display)] text-[0.55em] uppercase tracking-[0.18em] text-gold-light/90">Illustration in production</span>}
      </div>
      {/* Title plate */}
      <div aria-hidden="true" className="relative mx-[2%] mb-[4%] mt-[5%] rounded border border-gold/80 bg-ink/80 px-1 py-[4%] text-center">
        <span className={`block font-[family-name:var(--font-display)] leading-tight ${compact ? "text-[0.5em]" : "text-[0.8em]"}`}>{name}</span>
      </div>
    </div>
  );
}
