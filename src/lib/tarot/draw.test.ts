import { describe, expect, it } from "vitest";
import { drawCards, secureRandomInt, shuffle, type RandomInt } from "./draw";
import { CARD_IDS } from "@/content/cards";

/** Small deterministic PRNG (mulberry32) so tests are reproducible. */
function seeded(seed: number): RandomInt {
  let a = seed >>> 0;
  return (max) => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return Math.floor((((t ^ (t >>> 14)) >>> 0) / 4294967296) * max);
  };
}

describe("drawCards", () => {
  it("draws the requested number of distinct cards with sequential positions", () => {
    const cards = drawCards(5, { allowReversals: true });
    expect(cards).toHaveLength(5);
    expect(new Set(cards.map((c) => c.cardId)).size).toBe(5);
    expect(cards.map((c) => c.position)).toEqual([0, 1, 2, 3, 4]);
    cards.forEach((c) => expect(CARD_IDS).toContain(c.cardId));
  });

  it("never reverses cards when reversals are disabled", () => {
    for (let i = 0; i < 50; i++) {
      expect(drawCards(3, { allowReversals: false }).every((c) => !c.reversed)).toBe(true);
    }
  });

  it("can draw the entire deck without duplicates", () => {
    const all = drawCards(78, { allowReversals: false });
    expect(new Set(all.map((c) => c.cardId)).size).toBe(78);
  });

  it("rejects impossible draw sizes", () => {
    expect(() => drawCards(0, { allowReversals: false })).toThrow(RangeError);
    expect(() => drawCards(79, { allowReversals: false })).toThrow(RangeError);
  });

  it("is reproducible given the same random source", () => {
    const a = drawCards(3, { allowReversals: true, rand: seeded(42) });
    const b = drawCards(3, { allowReversals: true, rand: seeded(42) });
    expect(a).toEqual(b);
  });

  it("gives every card a roughly equal chance of being first", () => {
    const counts = new Map<string, number>();
    const rand = seeded(7);
    const trials = 78 * 400;
    for (let i = 0; i < trials; i++) {
      const [c] = drawCards(1, { allowReversals: false, rand });
      counts.set(c.cardId, (counts.get(c.cardId) ?? 0) + 1);
    }
    expect(counts.size).toBe(78);
    for (const n of counts.values()) {
      expect(n).toBeGreaterThan(400 * 0.7);
      expect(n).toBeLessThan(400 * 1.3);
    }
  });
});

describe("secureRandomInt", () => {
  it("stays within range", () => {
    for (let i = 0; i < 1000; i++) {
      const n = secureRandomInt(78);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(78);
    }
  });

  it("rejects invalid bounds", () => {
    expect(() => secureRandomInt(0)).toThrow();
    expect(() => secureRandomInt(1.5)).toThrow();
  });
});

describe("shuffle", () => {
  it("returns a permutation without mutating the input", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5]);
  });
});
