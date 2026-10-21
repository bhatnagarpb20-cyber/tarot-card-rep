import { z } from "zod";
import { CARD_ID_PATTERN, CATEGORIES } from "@/lib/tarot/types";
import { SPREAD_IDS } from "@/lib/tarot/spreads";

const text = (min = 1, max = 2000) => z.string().trim().min(min).max(max);

/** Input to any interpreter (reference or AI). Validated on the server before use. */
export const interpretRequestSchema = z.object({
  spread: z.enum(SPREAD_IDS),
  category: z.enum(CATEGORIES),
  question: z.string().trim().max(500).default(""),
  /** Optional context the user chose to share. Kept short to limit personal data sent to providers. */
  context: z.string().trim().max(800).default(""),
  cards: z
    .array(
      z.object({
        cardId: z.string().regex(CARD_ID_PATTERN),
        reversed: z.boolean(),
        position: z.number().int().min(0).max(9),
      }),
    )
    .min(1)
    .max(5),
});
export type InterpretRequest = z.infer<typeof interpretRequestSchema>;

export const cardInterpretationSchema = z.object({
  cardId: z.string().regex(CARD_ID_PATTERN),
  position: z.number().int().min(0),
  positionLabel: text(1, 80),
  reversed: z.boolean(),
  traditionalMeaning: text(10, 1200),
  symbolism: z.array(text(5, 400)).min(1).max(6),
  inContext: text(10, 1500),
});

/**
 * One interpretation, whatever produced it. Saved as an immutable snapshot with the reading so
 * later model or content changes never rewrite a user's history.
 */
export const interpretationSchema = z.object({
  source: z.enum(["reference", "ai"]),
  directAnswer: text(10, 1500),
  cards: z.array(cardInterpretationSchema).min(1).max(5),
  connections: text(10, 1500).nullable(),
  patterns: text(10, 1200),
  challengesAndOpportunities: text(10, 1200),
  nextSteps: z.array(text(5, 400)).min(2).max(4),
  outlook: text(10, 1000),
  reflectionPrompt: text(10, 400),
  whyThisFits: text(10, 1500),
});
export type Interpretation = z.infer<typeof interpretationSchema>;

export interface InterpretationSnapshot {
  interpretation: Interpretation;
  /** e.g. "reference@1.0.0" or "anthropic:claude-sonnet-5-5". */
  generator: string;
  contentVersion: string;
  createdAt: string;
}
