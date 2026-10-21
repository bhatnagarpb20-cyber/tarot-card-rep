import { z } from "zod";

export const SUITS = ["wands", "cups", "swords", "pentacles"] as const;
export type Suit = (typeof SUITS)[number];

export const ARCANA = ["major", "minor"] as const;
export type Arcana = (typeof ARCANA)[number];

/** Life areas a reading or interpretation can be framed around. */
export const CATEGORIES = [
  "love",
  "career",
  "finances",
  "family",
  "growth",
  "spirituality",
  "general",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  love: "Love & relationships",
  career: "Career & work",
  finances: "Money & finances",
  family: "Family",
  growth: "Personal growth",
  spirituality: "Spirituality",
  general: "General guidance",
};

/** Context fields every card must carry. Spirituality and general guidance fall back to `growth` and `upright`. */
export const CONTEXT_KEYS = ["love", "career", "finances", "family", "growth"] as const;
export type ContextKey = (typeof CONTEXT_KEYS)[number];

/** Canonical ID: `major-00-the-fool`, `cups-01-ace`, `swords-13-queen`. Shared by DB, art, academy and readings. */
export const CARD_ID_PATTERN = /^(major-(0\d|1\d|2[01])-[a-z-]+|(wands|cups|swords|pentacles)-(0[1-9]|1[0-4])-(ace|two|three|four|five|six|seven|eight|nine|ten|page|knight|queen|king))$/;

const nonEmpty = z.string().trim().min(1);
const sentence = z.string().trim().min(12);

export const symbolSchema = z.object({
  element: nonEmpty,
  meaning: sentence,
});

export const relatedSchema = z.object({
  id: z.string().regex(CARD_ID_PATTERN),
  reason: sentence,
});

/** Hand-authored content for one card. Identity fields are derived from the ID, not authored. */
export const cardContentSchema = z.object({
  keywords: z.object({
    upright: z.array(nonEmpty).min(3),
    reversed: z.array(nonEmpty).min(3),
  }),
  /** Meaning as recorded in the early-20th-century Rider–Waite–Smith tradition (paraphrased). */
  traditional: sentence,
  symbols: z.array(symbolSchema).min(3),
  /** Contemporary reflective reading, upright. */
  upright: sentence,
  reversed: sentence,
  contexts: z.object({
    love: sentence,
    career: sentence,
    finances: sentence,
    family: sentence,
    growth: sentence,
  }),
  shadow: sentence,
  misconceptions: z.array(sentence).min(1),
  example: sentence,
  reflection: z.array(sentence).min(2),
  memoryAid: sentence,
  action: sentence,
  related: z.array(relatedSchema).min(2),
});
export type CardContent = z.infer<typeof cardContentSchema>;

export const sourceSchema = z.object({
  title: nonEmpty,
  author: nonEmpty,
  year: z.number().int(),
  note: nonEmpty,
  url: z.string().url().optional(),
});
export type Source = z.infer<typeof sourceSchema>;

export const tarotCardSchema = cardContentSchema.extend({
  id: z.string().regex(CARD_ID_PATTERN),
  name: nonEmpty,
  arcana: z.enum(ARCANA),
  suit: z.enum(SUITS).nullable(),
  /** Major: 0–21. Minor: 1 (Ace) – 14 (King). */
  number: z.number().int().min(0).max(21),
  /** Display label: Roman numeral for majors, rank word for minors. */
  numeral: nonEmpty,
  sources: z.array(sourceSchema).min(1),
  contentVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
});
export type TarotCard = z.infer<typeof tarotCardSchema>;

export type Orientation = "upright" | "reversed";

export interface DrawnCard {
  cardId: string;
  reversed: boolean;
  /** 0-based position within the spread. */
  position: number;
}
