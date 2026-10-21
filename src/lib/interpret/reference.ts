import { CARD_CONTENT_VERSION, requireCard } from "@/content/cards";
import { SPREADS } from "@/lib/tarot/spreads";
import { CATEGORY_LABELS, type Category, type ContextKey, type TarotCard } from "@/lib/tarot/types";
import type { InterpretRequest, Interpretation, InterpretationSnapshot } from "./schema";

/** Spirituality and general guidance have no dedicated field; map them to the closest one. */
function contextKey(category: Category): ContextKey | null {
  if (category === "spirituality") return "growth";
  if (category === "general") return null;
  return category;
}

function contextual(card: TarotCard, reversed: boolean, category: Category): string {
  const key = contextKey(category);
  const base = key ? card.contexts[key] : reversed ? card.reversed : card.upright;
  if (!reversed || !key) return base;
  return `${base} Reversed, this may be blocked, internalised or overdone: ${lowerFirst(card.reversed)}`;
}

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const orientation = (r: boolean) => (r ? "reversed" : "upright");

/** Explains relationships between drawn cards using only facts in the card library. */
function describeConnections(cards: { card: TarotCard; reversed: boolean }[]): string | null {
  if (cards.length < 2) return null;
  const notes: string[] = [];
  const majors = cards.filter((c) => c.card.arcana === "major").length;
  if (majors >= Math.ceil(cards.length / 2)) {
    notes.push(`${majors} of ${cards.length} cards are Major Arcana, which traditionally signals that broader life themes are in play rather than passing circumstances.`);
  }
  const suits = new Map<string, number>();
  for (const { card } of cards) if (card.suit) suits.set(card.suit, (suits.get(card.suit) ?? 0) + 1);
  for (const [suit, n] of suits) {
    if (n >= 2) notes.push(`${n} ${suit} cards emphasise ${SUIT_THEME[suit]}.`);
  }
  const reversed = cards.filter((c) => c.reversed).length;
  if (reversed >= 2) notes.push(`${reversed} cards are reversed, which can suggest energy that is blocked, delayed or turned inward across the situation.`);
  for (const a of cards) {
    for (const rel of a.card.related) {
      const b = cards.find((c) => c.card.id === rel.id);
      if (b) notes.push(`${a.card.name} and ${b.card.name} are closely linked in the card library: ${lowerFirst(rel.reason)}`);
    }
  }
  if (notes.length === 0) {
    notes.push("These cards come from different suits and themes, so the reading draws on several areas of life at once; look for how each position's theme feeds into the next.");
  }
  return notes.join(" ");
}

const SUIT_THEME: Record<string, string> = {
  wands: "action, energy and initiative",
  cups: "feelings, relationships and intuition",
  swords: "thoughts, decisions and communication",
  pentacles: "practical matters, work and resources",
};

/**
 * Builds an interpretation entirely from the curated card library. Works offline, needs no AI,
 * and never invents meanings: every sentence traces back to a card field or a stated rule.
 */
export function buildReferenceInterpretation(req: InterpretRequest): Interpretation {
  const spread = SPREADS[req.spread];
  const drawn = [...req.cards]
    .sort((a, b) => a.position - b.position)
    .map((c) => ({ ...c, card: requireCard(c.cardId) }));
  const area = CATEGORY_LABELS[req.category].toLowerCase();
  const lead = drawn[drawn.length - 1];
  const first = drawn[0];

  const cards = drawn.map(({ card, reversed, position }) => {
    const pos = spread.positions[position] ?? { label: `Card ${position + 1}`, meaning: "" };
    return {
      cardId: card.id,
      position,
      positionLabel: pos.label,
      reversed,
      traditionalMeaning: card.traditional,
      symbolism: card.symbols.slice(0, 4).map((s) => `${s.element}: ${s.meaning}`),
      inContext: `${pos.meaning ? `As ${pos.label.toLowerCase()} — ${lowerFirst(pos.meaning)} ` : ""}${card.name} ${orientation(reversed)} suggests: ${reversed ? card.reversed : card.upright} In ${area}: ${lowerFirst(contextual(card, reversed, req.category))}`,
    };
  });

  const keywords = (c: (typeof drawn)[number]) => (c.reversed ? c.card.keywords.reversed : c.card.keywords.upright).slice(0, 3).join(", ");
  const questionClause = req.question ? `For your question — “${req.question}” — ` : "";
  const directAnswer =
    drawn.length === 1
      ? `${questionClause}${first.card.name} (${orientation(first.reversed)}) points to ${keywords(first)}. ${first.reversed ? first.card.reversed : first.card.upright}`
      : `${questionClause}the cards move from ${first.card.name} (${keywords(first)}) toward ${lead.card.name} (${keywords(lead)}). ${lead.reversed ? lead.card.reversed : lead.card.upright}`;

  return {
    source: "reference",
    directAnswer,
    cards,
    connections: describeConnections(drawn),
    patterns: drawn.map((c) => `${c.card.name}: ${c.card.shadow}`).join(" "),
    challengesAndOpportunities: drawn
      .map((c) => (c.reversed ? `${c.card.name} reversed asks you to watch for ${c.card.keywords.reversed.slice(0, 2).join(" and ")}.` : `${c.card.name} offers ${c.card.keywords.upright.slice(0, 2).join(" and ")}.`))
      .join(" "),
    nextSteps: dedupe(drawn.map((c) => c.card.action))
      .concat(drawn.length === 1 ? [`Write a few lines in your journal on: “${first.card.reflection[1]}”`] : [])
      .slice(0, 4),
    outlook:
      "Tarot describes tendencies and perspectives, not fixed outcomes. If the themes here continue, these cards suggest where attention could be most useful — your choices and circumstances will shape what actually happens.",
    reflectionPrompt: lead.card.reflection[0],
    whyThisFits: `This reference reading is assembled from the Daily Arcana card library (version ${CARD_CONTENT_VERSION}) using the cards you actually drew, their orientation${drawn.length > 1 ? "s and spread positions" : ""}, and the ${area} context you chose. It has not been personalised by AI, so it cannot weigh the specific details of your situation — your own reflection completes it.`,
  };
}

function dedupe(items: string[]): string[] {
  return [...new Set(items)];
}

export function referenceSnapshot(req: InterpretRequest): InterpretationSnapshot {
  return {
    interpretation: buildReferenceInterpretation(req),
    generator: `reference@${CARD_CONTENT_VERSION}`,
    contentVersion: CARD_CONTENT_VERSION,
    createdAt: new Date().toISOString(),
  };
}
