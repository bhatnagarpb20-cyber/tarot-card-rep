import { requireCard } from "@/content/cards";
import { compareObservations } from "./observation";
import type { DrawnCard } from "@/lib/tarot/types";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export const DIFFICULTIES: Record<Difficulty, { label: string; cards: number; goal: string }> = {
  beginner: { label: "Beginner", cards: 1, goal: "Identify the card's key symbols and keywords." },
  intermediate: { label: "Intermediate", cards: 1, goal: "Connect one card to a real question in a life area." },
  advanced: { label: "Advanced", cards: 3, goal: "Interpret three cards together — situation, challenge, guidance — and how they interact." },
};

export interface PracticeFeedback {
  strengths: string[];
  suggestions: string[];
  perCard: { cardId: string; symbolsUsed: string[]; symbolsToConsider: string[]; keywordsUsed: string[] }[];
}

const CONNECTORS = /\b(because|so|which|therefore|while|but|together|leads?|together|contrast|whereas|then|followed)\b/i;

/**
 * Constructive feedback on a practice interpretation. It notices what the learner drew on and
 * suggests what else to consider; it never marks intuition as right or wrong.
 */
export function practiceFeedback(cards: DrawnCard[], interpretation: string, difficulty: Difficulty): PracticeFeedback {
  const text = interpretation.toLowerCase();
  const words = interpretation.trim() ? interpretation.trim().split(/\s+/).length : 0;
  const perCard = cards.map((c) => {
    const card = requireCard(c.cardId);
    const obs = compareObservations(card, { first: interpretation });
    const kws = (c.reversed ? card.keywords.reversed : card.keywords.upright).filter((k) => text.includes(k.toLowerCase().split(" ")[0]));
    return { cardId: c.cardId, symbolsUsed: obs.noticed.map((s) => s.element), symbolsToConsider: obs.notYet.slice(0, 3).map((s) => s.element), keywordsUsed: kws };
  });

  const strengths: string[] = [];
  const suggestions: string[] = [];
  const totalSymbols = perCard.reduce((n, p) => n + p.symbolsUsed.length, 0);

  if (words === 0) {
    suggestions.push("Write even a few sentences before revealing the reference — the practice is in putting your reading into words.");
    return { strengths, suggestions, perCard };
  }
  if (totalSymbols > 0) strengths.push(`You grounded your reading in the imagery (${perCard.flatMap((p) => p.symbolsUsed).join(", ")}). That's the habit that makes readings specific.`);
  else suggestions.push("Try naming at least one thing you can see in the card and saying what it suggests to you — imagery makes a reading specific rather than generic.");

  if (perCard.some((p) => p.keywordsUsed.length)) strengths.push("Your interpretation touches on the card's traditional themes.");
  if (words >= 40) strengths.push("You gave yourself room to explore rather than stopping at a keyword.");
  else suggestions.push("Expand a little: what does the card suggest you could actually do?");

  if (difficulty !== "beginner" && /\b(i|my|me|you|your)\b/i.test(interpretation)) strengths.push("You related the card to the person and the question, not just its general meaning.");
  else if (difficulty !== "beginner") suggestions.push("Link the card directly to the question: how might this apply to the specific situation?");

  if (difficulty === "advanced") {
    if (CONNECTORS.test(interpretation)) strengths.push("You described how the cards relate to each other — the heart of reading a spread.");
    else suggestions.push("Explain how the cards connect: does the challenge card complicate the situation, and how does the guidance card respond to it?");
  }
  for (const p of perCard) {
    if (p.symbolsToConsider.length) suggestions.push(`For ${requireCard(p.cardId).name}, you might also consider: ${p.symbolsToConsider.join(", ")}.`);
  }
  return { strengths, suggestions: suggestions.slice(0, 5), perCard };
}
