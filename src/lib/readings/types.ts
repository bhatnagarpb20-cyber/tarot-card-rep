import { z } from "zod";
import type { Category, DrawnCard } from "@/lib/tarot/types";
import type { SpreadId } from "@/lib/tarot/spreads";
import type { InterpretationSnapshot } from "@/lib/interpret/schema";
import { CATEGORIES } from "@/lib/tarot/types";
import { SPREAD_IDS } from "@/lib/tarot/spreads";

export type ReadingKind = "daily" | "daily_extra" | "question";

export interface JournalNote {
  id: string;
  kind: "pre_reveal" | "reflection" | "free" | "practice";
  body: string;
  resonance: "resonated" | "partly" | "did_not" | null;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  question: string;
  answer: { text: string; source: "reference" | "ai"; needsNewPull: boolean };
  createdAt: string;
}

/** A saved reading as the UI sees it, whether stored on this device (guest) or in the account. */
export interface SavedReading {
  id: string;
  storage: "guest" | "account";
  kind: ReadingKind;
  spread: SpreadId;
  category: Category;
  question: string;
  context: string;
  localDate: string;
  timezone: string;
  allowReversals: boolean;
  parentReadingId: string | null;
  cards: DrawnCard[];
  /** Oldest first. The last one is shown; earlier ones remain as history. */
  snapshots: InterpretationSnapshot[];
  journal: JournalNote[];
  followUps: FollowUp[];
  bookmarked: boolean;
  createdAt: string;
}

export const createReadingSchema = z.object({
  kind: z.enum(["daily", "daily_extra", "question"]),
  spread: z.enum(SPREAD_IDS),
  category: z.enum(CATEGORIES).default("general"),
  question: z.string().trim().max(500).default(""),
  context: z.string().trim().max(800).default(""),
  timezone: z.string().min(1).max(64),
  parentReadingId: z.string().uuid().nullable().default(null),
});
export type CreateReadingInput = z.infer<typeof createReadingSchema>;

export const journalInputSchema = z.object({
  kind: z.enum(["pre_reveal", "reflection", "free", "practice"]),
  body: z.string().trim().min(1, "Write something before saving.").max(20000),
  resonance: z.enum(["resonated", "partly", "did_not"]).nullable().default(null),
});
export type JournalInput = z.infer<typeof journalInputSchema>;
