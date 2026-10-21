import { describe, expect, it } from "vitest";
import { DECK, requireCard } from "@/content/cards";
import { buildCardQuiz } from "./card-quiz";
import { compareObservations } from "./observation";

describe("card quizzes", () => {
  it("builds a valid four-question quiz for every card with unique options", () => {
    for (const card of DECK) {
      const quiz = buildCardQuiz(card);
      expect(quiz).toHaveLength(4);
      for (const q of quiz) {
        expect(q.answerIndex).toBeGreaterThanOrEqual(0);
        expect(q.answerIndex).toBeLessThan(q.options.length);
        expect(new Set(q.options).size, `${card.id}: ${q.question}`).toBe(q.options.length);
      }
    }
  });

  it("marks the card's own keywords as correct", () => {
    const fool = requireCard("major-00-the-fool");
    const q = buildCardQuiz(fool)[0];
    expect(q.options[q.answerIndex]).toBe("beginnings, openness, spontaneity");
  });
});

describe("observation feedback", () => {
  it("recognises symbols the learner mentioned", () => {
    const fool = requireCard("major-00-the-fool");
    const fb = compareObservations(fool, { first: "A young person near a cliff edge", details: "a little white dog and a rose" });
    expect(fb.noticed.map((s) => s.element)).toEqual(expect.arrayContaining(["The cliff edge", "The white rose", "The white dog"]));
    expect(fb.notYet.length).toBeGreaterThan(0);
  });

  it("encourages rather than grades when nothing matches", () => {
    const fb = compareObservations(requireCard("major-02-the-high-priestess"), { mood: "calm and quiet" });
    expect(fb.encouragement).toMatch(/may still be valid/);
  });
});
