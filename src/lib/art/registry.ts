import registry from "@/generated/card-art.json";
import { VECTOR_ART } from "@/components/cards/art";

export interface CardArt {
  alt: string;
  reviewStatus: "not_reviewed" | "approved" | "changes_requested" | "rejected";
  image: null | { hash: string; widths: number[]; formats: string[]; width: number; height: number; lqip: string };
}

const REGISTRY = registry as Record<string, CardArt>;

export function getCardArt(cardId: string): CardArt | undefined {
  return REGISTRY[cardId];
}

export function cardImageUrl(cardId: string, hash: string, width: number, format: string): string {
  return `/cards/${cardId}.${hash}-${width}.${format}`;
}

/** Counts used to report artwork progress honestly in the UI and docs. */
export function artProgress(): { total: number; withImage: number; approved: number } {
  const entries = Object.values(REGISTRY);
  return {
    total: entries.length,
    // Hand-drawn vector cards (components/cards/art) count as illustrated alongside raster art.
    withImage: Object.entries(REGISTRY).filter(([id, e]) => e.image || id in VECTOR_ART).length,
    approved: entries.filter((e) => e.image && e.reviewStatus === "approved").length,
  };
}
