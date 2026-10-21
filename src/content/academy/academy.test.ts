import { describe, expect, it } from "vitest";
import { ALL_LESSONS, COURSES } from "./index";
import { lessonSchema } from "./types";
import { getCard } from "@/content/cards";

describe("academy content", () => {
  it("has a 12-level beginner path and four suit lessons", () => {
    expect(COURSES.find((c) => c.id === "beginner-path")?.lessons).toHaveLength(12);
    expect(COURSES.find((c) => c.id === "four-suits")?.lessons.map((l) => l.id)).toEqual(["suits-wands", "suits-cups", "suits-swords", "suits-pentacles"]);
  });

  it("every lesson is complete and valid", () => {
    const ids = new Set<string>();
    for (const lesson of ALL_LESSONS) {
      expect(() => lessonSchema.parse(lesson), lesson.id).not.toThrow();
      expect(ids.has(lesson.id)).toBe(false);
      ids.add(lesson.id);
      for (const q of lesson.quiz) expect(q.answerIndex).toBeLessThan(q.options.length);
      for (const id of lesson.cards) expect(getCard(id), `${lesson.id} → ${id}`).toBeDefined();
    }
  });
});
