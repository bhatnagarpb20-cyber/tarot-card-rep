import { drawCards, type RandomInt, secureRandomInt } from "@/lib/tarot/draw";
import { SPREADS } from "@/lib/tarot/spreads";
import { referenceSnapshot } from "@/lib/interpret/reference";
import { isValidTimeZone, localDateISO } from "@/lib/dates";
import type { DrawnCard } from "@/lib/tarot/types";
import type { InterpretationSnapshot } from "@/lib/interpret/schema";
import type { CreateReadingInput } from "./types";

export interface PlannedReading {
  localDate: string;
  cards: DrawnCard[];
  snapshot: InterpretationSnapshot;
}

/**
 * Draws the cards for a new reading and builds its reference interpretation. Shared by guest
 * (in-browser) and account (server) storage so both behave identically. The draw uses only the
 * random source; the question and category influence the interpretation, never the cards.
 */
export function planReading(input: CreateReadingInput, allowReversals: boolean, now = new Date(), rand: RandomInt = secureRandomInt): PlannedReading {
  if (!isValidTimeZone(input.timezone)) throw new Error("Unknown timezone");
  const spread = SPREADS[input.spread];
  if ((input.kind === "daily" || input.kind === "daily_extra") && input.spread !== "daily") throw new Error("Daily readings use the daily spread");
  if (input.kind === "question" && input.spread === "daily") throw new Error("Question readings need a question spread");
  const cards = drawCards(spread.positions.length, { allowReversals, rand });
  const snapshot = referenceSnapshot({ spread: input.spread, category: input.category, question: input.question, context: input.context, cards });
  return { localDate: localDateISO(input.timezone, now), cards, snapshot };
}
