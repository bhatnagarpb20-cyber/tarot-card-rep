import { describe, expect, it } from "vitest";
import { computeStats } from "./stats";
import type { SavedReading } from "@/lib/readings/types";

function reading(p: Partial<SavedReading> & Pick<SavedReading, "cards">): SavedReading {
  return {
    id: crypto.randomUUID(), storage: "guest", kind: "daily", spread: "daily", category: "general", question: "", context: "",
    localDate: "2026-10-21", timezone: "UTC", allowReversals: true, parentReadingId: null, snapshots: [], journal: [], followUps: [],
    bookmarked: false, createdAt: "2026-10-21T08:00:00Z", ...p,
  };
}

describe("journal statistics", () => {
  it("counts only what is stored", () => {
    const rs = [
      reading({ localDate: "2026-10-19", cards: [{ cardId: "major-00-the-fool", reversed: false, position: 0 }] }),
      reading({ localDate: "2026-10-20", cards: [{ cardId: "major-00-the-fool", reversed: true, position: 0 }], journal: [{ id: "1", kind: "pre_reveal", body: "x", resonance: null, createdAt: "" }, { id: "2", kind: "reflection", body: "y", resonance: "resonated", createdAt: "" }] }),
      reading({ localDate: "2026-10-21", cards: [{ cardId: "cups-02-two", reversed: false, position: 0 }] }),
      reading({ kind: "question", spread: "three-card", category: "love", cards: [
        { cardId: "cups-02-two", reversed: false, position: 0 },
        { cardId: "swords-03-three", reversed: true, position: 1 },
        { cardId: "major-17-the-star", reversed: false, position: 2 },
      ] }),
    ];
    const s = computeStats(rs);
    expect(s.totalReadings).toBe(4);
    expect(s.dailyCards).toBe(3);
    expect(s.questionReadings).toBe(1);
    expect(s.frequentCards).toEqual([{ cardId: "cups-02-two", count: 2 }, { cardId: "major-00-the-fool", count: 2 }]);
    expect(s.majorShare).toBeCloseTo(3 / 6);
    expect(s.reversedShare).toBeCloseTo(2 / 6);
    expect(s.wroteFirst).toBe(1);
    expect(s.reflections).toBe(1);
    expect(s.resonance.resonated).toBe(1);
    expect(s.currentDailyStreak).toBe(3);
    expect(s.byCategory).toEqual({ general: 3, love: 1 });
  });

  it("handles an empty journal", () => {
    const s = computeStats([]);
    expect(s.totalReadings).toBe(0);
    expect(s.majorShare).toBeNull();
    expect(s.currentDailyStreak).toBe(0);
  });
});
