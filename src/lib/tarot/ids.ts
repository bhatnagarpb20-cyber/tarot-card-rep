import type { Suit } from "./types";

export const MAJOR_NAMES = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World",
] as const;

export const RANK_WORDS = [
  "ace",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "page",
  "knight",
  "queen",
  "king",
] as const;
export type RankWord = (typeof RANK_WORDS)[number];

const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];

export function toRoman(n: number): string {
  const r = ROMAN[n];
  if (r === undefined) throw new Error(`No numeral for ${n}`);
  return r;
}

const pad = (n: number) => String(n).padStart(2, "0");
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function majorId(number: number): string {
  const name = MAJOR_NAMES[number];
  if (!name) throw new Error(`No major arcana card ${number}`);
  return `major-${pad(number)}-${slug(name)}`;
}

export function minorId(suit: Suit, rank: number): string {
  const word = RANK_WORDS[rank - 1];
  if (!word) throw new Error(`No rank ${rank}`);
  return `${suit}-${pad(rank)}-${word}`;
}

export function minorName(suit: Suit, rank: number): string {
  return `${cap(RANK_WORDS[rank - 1])} of ${cap(suit)}`;
}

export function isCourt(rank: number): boolean {
  return rank >= 11;
}
