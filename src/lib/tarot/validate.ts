import { SUITS, tarotCardSchema, type TarotCard } from "./types";

/**
 * Checks the deck is complete and internally consistent. Returns a list of human-readable
 * problems; an empty list means the deck is valid. Used by tests and `npm run validate:content`.
 */
export function validateDeck(deck: readonly TarotCard[]): string[] {
  const problems: string[] = [];
  if (deck.length !== 78) problems.push(`Expected 78 cards, found ${deck.length}`);

  const ids = new Set<string>();
  for (const card of deck) {
    if (ids.has(card.id)) problems.push(`Duplicate id ${card.id}`);
    ids.add(card.id);
    const parsed = tarotCardSchema.safeParse(card);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        problems.push(`${card.id}: ${issue.path.join(".")} — ${issue.message}`);
      }
    }
  }

  const majors = deck.filter((c) => c.arcana === "major");
  if (majors.length !== 22) problems.push(`Expected 22 major arcana, found ${majors.length}`);
  majors.forEach((c, i) => {
    if (c.number !== i) problems.push(`Major arcana out of order at ${c.id} (number ${c.number}, position ${i})`);
  });
  for (const suit of SUITS) {
    const cards = deck.filter((c) => c.suit === suit);
    if (cards.length !== 14) problems.push(`Expected 14 ${suit}, found ${cards.length}`);
    cards.forEach((c, i) => {
      if (c.number !== i + 1) problems.push(`${suit} out of order at ${c.id}`);
    });
  }

  for (const card of deck) {
    for (const rel of card.related) {
      if (rel.id === card.id) problems.push(`${card.id} lists itself as related`);
      else if (!ids.has(rel.id)) problems.push(`${card.id} relates to unknown card ${rel.id}`);
    }
    const kw = [...card.keywords.upright, ...card.keywords.reversed].map((k) => k.toLowerCase());
    if (new Set(kw).size !== kw.length) problems.push(`${card.id} repeats a keyword`);
  }
  return problems;
}
