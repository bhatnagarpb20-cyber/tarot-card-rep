import { requireCard } from "@/content/cards";
import { SPREADS } from "@/lib/tarot/spreads";
import { CATEGORY_LABELS, type ContextKey } from "@/lib/tarot/types";
import type { InterpretRequest } from "@/lib/interpret/schema";

/**
 * Principles every AI interpretation must follow. Kept stable (no dates or ids) so it can be
 * prompt-cached, and phrased as reasons rather than shouted rules.
 */
export const SYSTEM_PROMPT = `You are the interpretation engine of The Daily Arcana, a tarot app for reflection and learning in the Rider–Waite–Smith tradition.

How to interpret:
- Ground every statement in the card reference data you are given. The "traditional" field paraphrases A. E. Waite (1911); the other fields are the app's curated modern meanings. Do not introduce traditional meanings, symbols or historical claims that are not in the data. If the data does not cover something, say so rather than inventing it.
- Read the actual cards drawn, in their positions and orientations, against the person's actual question and the context they chose to share. Make it specific to them; a reading that could apply to anyone is a failed reading.
- Explain your reasoning: which symbols and meanings led to each point, and where more than one reading is reasonable.
- Reversed cards are not automatically the opposite of upright. Consider blocked, internalised, excessive or reconsidered expressions and pick what fits the question.

What tarot is and is not:
- Present tarot as a symbolic, reflective practice. Do not claim it predicts events or is scientifically validated.
- Never state what another person secretly thinks, feels or intends, whether they are faithful, or what they will do. Offer ways for the person to reflect on or ask about these things instead.
- Never guarantee outcomes such as a job, relationship, money or health result. Any outlook must name its uncertainty and depend on the person's choices.
- For health, legal, financial or safety decisions, encourage appropriate professional help alongside reflection. If the question suggests someone may be in danger, gently point to emergency or crisis support.

Style: warm, clear and grounded; British or American spelling is fine; no mystical filler, no flattery. Address the person as "you".`;

function contextKeyFor(category: InterpretRequest["category"]): ContextKey | null {
  if (category === "spirituality") return "growth";
  if (category === "general") return null;
  return category;
}

/** Builds the user message: the person's input plus only the reference data for the drawn cards. */
export function buildUserMessage(req: InterpretRequest): string {
  const spread = SPREADS[req.spread];
  const key = contextKeyFor(req.category);
  const cards = [...req.cards]
    .sort((a, b) => a.position - b.position)
    .map((c) => {
      const card = requireCard(c.cardId);
      const pos = spread.positions[c.position];
      return {
        cardId: card.id,
        name: card.name,
        position: c.position,
        positionLabel: pos?.label,
        positionMeaning: pos?.meaning,
        orientation: c.reversed ? "reversed" : "upright",
        arcana: card.arcana,
        suit: card.suit,
        keywords: c.reversed ? card.keywords.reversed : card.keywords.upright,
        traditional: card.traditional,
        modernMeaning: c.reversed ? card.reversed : card.upright,
        contextMeaning: key ? card.contexts[key] : null,
        symbols: card.symbols,
        shadow: card.shadow,
        misconceptions: card.misconceptions,
        relatedInThisSpread: card.related.filter((r) => req.cards.some((o) => o.cardId === r.id)),
      };
    });

  return JSON.stringify(
    {
      task: "Interpret this tarot reading. Return the structured interpretation. Use exactly the cards, positions and orientations listed.",
      spread: { id: spread.id, name: spread.name },
      lifeArea: CATEGORY_LABELS[req.category],
      question: req.question || "(No specific question — offer guidance for the day in this life area.)",
      contextSharedByPerson: req.context || null,
      cards,
    },
    null,
    2,
  );
}

export function buildFollowUpMessage(req: InterpretRequest, previousAnswer: string, followUp: string): string {
  return JSON.stringify(
    {
      task: "Answer the person's follow-up question about this existing reading using ONLY the cards already drawn. Do not draw or imagine new cards. If answering properly would genuinely need a new card pull, say so plainly and set needsNewPull to true.",
      reading: JSON.parse(buildUserMessage(req)),
      previousInterpretationSummary: previousAnswer.slice(0, 2000),
      followUpQuestion: followUp,
    },
    null,
    2,
  );
}
