import { describe, expect, it } from "vitest";
import { practiceFeedback } from "./practice-feedback";

describe("practice feedback", () => {
  it("recognises imagery and connections without grading intuition", () => {
    const fb = practiceFeedback(
      [
        { cardId: "major-09-the-hermit", reversed: false, position: 0 },
        { cardId: "swords-02-two", reversed: false, position: 1 },
        { cardId: "major-17-the-star", reversed: false, position: 2 },
      ],
      "The lantern shows I am searching for my own answer, but the blindfold means I'm avoiding a decision, so the star suggests hope will return once I choose.",
      "advanced",
    );
    expect(fb.strengths.join(" ")).toMatch(/imagery/);
    expect(fb.strengths.join(" ")).toMatch(/relate to each other/);
    expect(JSON.stringify(fb)).not.toMatch(/\b(wrong|incorrect)\b/i);
  });

  it("encourages writing when nothing is submitted", () => {
    const fb = practiceFeedback([{ cardId: "major-00-the-fool", reversed: false, position: 0 }], "", "intermediate");
    expect(fb.suggestions[0]).toMatch(/Write even a few sentences/);
  });
});
