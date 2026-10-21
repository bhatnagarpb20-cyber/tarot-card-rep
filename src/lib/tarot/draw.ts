import { CARD_IDS } from "@/content/cards";
import type { DrawnCard } from "./types";

/** Returns a uniformly distributed integer in [0, max). */
export type RandomInt = (max: number) => number;

/**
 * Cryptographically secure random integer using rejection sampling (no modulo bias).
 * Works in browsers and Node 18+ via the global Web Crypto API.
 */
export const secureRandomInt: RandomInt = (max) => {
  if (!Number.isInteger(max) || max <= 0 || max > 2 ** 32) throw new RangeError(`Invalid max ${max}`);
  const limit = Math.floor(2 ** 32 / max) * max;
  const buf = new Uint32Array(1);
  for (;;) {
    globalThis.crypto.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % max;
  }
};

/** Fisher–Yates shuffle; returns a new array. */
export function shuffle<T>(items: readonly T[], rand: RandomInt = secureRandomInt): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface DrawOptions {
  allowReversals: boolean;
  rand?: RandomInt;
  /** Restrict the pool (e.g. majors only for a beginner exercise). Defaults to the full deck. */
  pool?: readonly string[];
}

/**
 * Draws `count` distinct cards. The draw depends only on the random source — never on the
 * question, category or any interpretation — so a reading cannot be steered toward an outcome.
 */
export function drawCards(count: number, { allowReversals, rand = secureRandomInt, pool = CARD_IDS }: DrawOptions): DrawnCard[] {
  if (count < 1 || count > pool.length) throw new RangeError(`Cannot draw ${count} cards from ${pool.length}`);
  const order = shuffle(pool, rand);
  return order.slice(0, count).map((cardId, position) => ({
    cardId,
    position,
    reversed: allowReversals ? rand(2) === 1 : false,
  }));
}
