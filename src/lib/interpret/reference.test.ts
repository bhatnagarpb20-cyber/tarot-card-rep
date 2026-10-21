import { describe, expect, it } from "vitest";
import { buildReferenceInterpretation } from "./reference";
import { interpretationSchema, interpretRequestSchema } from "./schema";
import { DECK } from "@/content/cards";
import { CATEGORIES } from "@/lib/tarot/types";

describe("reference interpretation", () => {
  it("produces a schema-valid interpretation for every card, orientation and category", () => {
    for (const card of DECK) {
      for (const reversed of [false, true]) {
        for (const category of CATEGORIES) {
          const req = interpretRequestSchema.parse({ spread: "daily", category, cards: [{ cardId: card.id, reversed, position: 0 }] });
          const result = interpretationSchema.safeParse(buildReferenceInterpretation(req));
          if (!result.success) throw new Error(`${card.id} ${reversed} ${category}: ${result.error.message}`);
        }
      }
    }
  });

  it("uses the actual drawn cards, positions and orientation", () => {
    const req = interpretRequestSchema.parse({
      spread: "three-card",
      category: "career",
      question: "Should I apply for the team lead role?",
      cards: [
        { cardId: "major-01-the-magician", reversed: false, position: 0 },
        { cardId: "swords-02-two", reversed: true, position: 1 },
        { cardId: "pentacles-08-eight", reversed: false, position: 2 },
      ],
    });
    const r = buildReferenceInterpretation(req);
    expect(r.cards.map((c) => [c.cardId, c.positionLabel, c.reversed])).toEqual([
      ["major-01-the-magician", "Situation", false],
      ["swords-02-two", "Challenge", true],
      ["pentacles-08-eight", "Guidance", false],
    ]);
    expect(r.directAnswer).toContain("Should I apply for the team lead role?");
    expect(r.cards[1].inContext).toContain("Reversed");
    // The Magician lists the Eight of Pentacles as related; the connection should be explained.
    expect(r.connections).toContain("The Magician and Eight of Pentacles");
    expect(r.source).toBe("reference");
  });

  it("never claims certainty about the future", () => {
    const req = interpretRequestSchema.parse({ spread: "daily", category: "love", cards: [{ cardId: "major-06-the-lovers", reversed: false, position: 0 }] });
    expect(buildReferenceInterpretation(req).outlook).toMatch(/not fixed outcomes/);
  });
});
