import { describe, expect, it } from "vitest";
import { validateAiInterpretation } from "./anthropic";
import { buildUserMessage, SYSTEM_PROMPT } from "./grounding";
import { buildReferenceInterpretation } from "@/lib/interpret/reference";
import { interpretRequestSchema } from "@/lib/interpret/schema";

const req = interpretRequestSchema.parse({
  spread: "three-card",
  category: "love",
  question: "How can I communicate better with my partner?",
  context: "We have been arguing about chores.",
  cards: [
    { cardId: "cups-02-two", reversed: false, position: 0 },
    { cardId: "swords-05-five", reversed: true, position: 1 },
    { cardId: "major-14-temperance", reversed: false, position: 2 },
  ],
});

// A well-formed model response, shaped like the reference interpretation.
const good = { ...buildReferenceInterpretation(req), source: undefined };

describe("AI output validation", () => {
  it("accepts schema-valid output that matches the drawn cards", () => {
    const out = validateAiInterpretation(good, req);
    expect(out.source).toBe("ai");
    expect(out.cards.map((c) => c.cardId)).toEqual(["cups-02-two", "swords-05-five", "major-14-temperance"]);
  });

  it("rejects output that swaps in a different card", () => {
    const tampered = { ...good, cards: good.cards.map((c, i) => (i === 1 ? { ...c, cardId: "major-19-the-sun" } : c)) };
    expect(() => validateAiInterpretation(tampered, req)).toThrow(/different cards/);
  });

  it("rejects output that flips an orientation", () => {
    const flipped = { ...good, cards: good.cards.map((c, i) => (i === 1 ? { ...c, reversed: false } : c)) };
    expect(() => validateAiInterpretation(flipped, req)).toThrow(/different cards/);
  });

  it("rejects output missing required sections", () => {
    const { nextSteps: _omit, ...missing } = good;
    expect(() => validateAiInterpretation(missing, req)).toThrow(/expected format/);
  });
});

describe("AI grounding", () => {
  it("sends the question, chosen context and only the drawn cards' reference data", () => {
    const msg = JSON.parse(buildUserMessage(req));
    expect(msg.question).toBe(req.question);
    expect(msg.contextSharedByPerson).toBe(req.context);
    expect(msg.cards.map((c: { cardId: string }) => c.cardId)).toEqual(["cups-02-two", "swords-05-five", "major-14-temperance"]);
    expect(msg.cards[1].orientation).toBe("reversed");
    expect(msg.cards[0].contextMeaning).toContain("attraction");
    expect(JSON.stringify(msg)).not.toMatch(/user_?id|email/i);
  });

  it("states the safety principles in the system prompt", () => {
    expect(SYSTEM_PROMPT).toMatch(/Never state what another person secretly thinks/);
    expect(SYSTEM_PROMPT).toMatch(/Never guarantee outcomes/);
    expect(SYSTEM_PROMPT).toMatch(/Do not introduce traditional meanings/);
  });
});
