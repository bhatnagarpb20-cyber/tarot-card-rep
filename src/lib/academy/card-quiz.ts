import { DECK } from "@/content/cards";
import type { QuizQuestion } from "@/content/academy/types";
import type { TarotCard } from "@/lib/tarot/types";

const SUIT_THEMES: Record<string, string> = {
  wands: "Action, initiative and creative energy (fire)",
  cups: "Emotions, relationships and intuition (water)",
  swords: "Thoughts, communication and decisions (air)",
  pentacles: "Work, resources and practical life (earth)",
};

/** Deterministic distractor cards so the quiz is stable between visits and server renders. */
function others(card: TarotCard, n: number, filter: (c: TarotCard) => boolean = () => true): TarotCard[] {
  const idx = DECK.findIndex((c) => c.id === card.id);
  const out: TarotCard[] = [];
  for (const step of [7, 23, 41, 13, 59, 31, 5, 67]) {
    const c = DECK[(idx + step) % DECK.length];
    if (c.id !== card.id && filter(c) && !out.includes(c)) out.push(c);
    if (out.length === n) break;
  }
  return out;
}

/** Places the correct answer at a stable but card-dependent position. */
function arrange(correct: string, wrong: string[], seed: number): { options: string[]; answerIndex: number } {
  const answerIndex = seed % (wrong.length + 1);
  const options = [...wrong];
  options.splice(answerIndex, 0, correct);
  return { options, answerIndex };
}

/** Builds a short quiz for a card entirely from the knowledge base — no hand-written answers to drift. */
export function buildCardQuiz(card: TarotCard): QuizQuestion[] {
  const seed = DECK.findIndex((c) => c.id === card.id);
  const kw = (c: TarotCard, r = false) => (r ? c.keywords.reversed : c.keywords.upright).slice(0, 3).join(", ");
  const qs: QuizQuestion[] = [];

  const a = arrange(kw(card), others(card, 3).map((c) => kw(c)), seed);
  qs.push({ question: `Which keywords belong to ${card.name} upright?`, ...a, explanation: `${card.name} upright: ${card.keywords.upright.join(", ")}.` });

  const symbol = card.symbols[seed % card.symbols.length];
  const b = arrange(symbol.meaning, others(card, 3).map((c) => c.symbols[0].meaning), seed + 1);
  qs.push({ question: `In ${card.name}, what does “${symbol.element}” suggest?`, ...b, explanation: `${symbol.element}: ${symbol.meaning}` });

  if (card.arcana === "major") {
    const nums = others(card, 3, (c) => c.arcana === "major").map((c) => c.numeral);
    const c = arrange(card.numeral, nums, seed + 2);
    qs.push({ question: `What is ${card.name}'s number in the Major Arcana (Rider–Waite–Smith order)?`, ...c, explanation: `${card.name} is ${card.numeral} in Waite's sequence.` });
  } else {
    const correct = SUIT_THEMES[card.suit!];
    const c = arrange(correct, Object.entries(SUIT_THEMES).filter(([s]) => s !== card.suit).map(([, t]) => t), seed + 2);
    qs.push({ question: `${card.name} belongs to a suit. Which broad themes does that suit bring?`, ...c, explanation: `The ${card.suit} suit: ${correct}.` });
  }

  const d = arrange(kw(card, true), others(card, 3).map((c) => kw(c, true)), seed + 3);
  qs.push({ question: `Which keywords are associated with ${card.name} reversed?`, ...d, explanation: `${card.name} reversed: ${card.keywords.reversed.join(", ")}. Remember that reversals are not simply opposites.` });
  return qs;
}
