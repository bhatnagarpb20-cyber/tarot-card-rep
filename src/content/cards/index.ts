import { MAJOR_NAMES, majorId, minorId, minorName, toRoman, RANK_WORDS } from "@/lib/tarot/ids";
import { SUITS, type CardContent, type Source, type Suit, type TarotCard } from "@/lib/tarot/types";
import { MAJOR_CONTENT } from "./major";
import { WANDS_CONTENT } from "./wands";
import { CUPS_CONTENT } from "./cups";
import { SWORDS_CONTENT } from "./swords";
import { PENTACLES_CONTENT } from "./pentacles";

/** Bump when card meanings change; saved readings record the version they were interpreted with. */
export const CARD_CONTENT_VERSION = "1.0.0";

export const SOURCES: Record<"waite" | "editorial", Source> = {
  waite: {
    title: "The Pictorial Key to the Tarot",
    author: "Arthur Edward Waite",
    year: 1911,
    note: "Part III divinatory meanings, paraphrased in the `traditional` field. Public domain.",
    url: "https://sacred-texts.com/tarot/pkt/index.htm",
  },
  editorial: {
    title: "The Daily Arcana card library",
    author: "The Daily Arcana editorial team",
    year: 2026,
    note: "Contemporary reflective interpretations, context meanings, exercises and memory aids written for this app. Modern practice, not historical tradition.",
  },
};

const SUIT_CONTENT: Record<Suit, CardContent[]> = {
  wands: WANDS_CONTENT,
  cups: CUPS_CONTENT,
  swords: SWORDS_CONTENT,
  pentacles: PENTACLES_CONTENT,
};

const sources = [SOURCES.waite, SOURCES.editorial];

function buildDeck(): TarotCard[] {
  const majors: TarotCard[] = MAJOR_NAMES.map((name, n) => ({
    ...MAJOR_CONTENT[n],
    id: majorId(n),
    name,
    arcana: "major",
    suit: null,
    number: n,
    numeral: toRoman(n),
    sources,
    contentVersion: CARD_CONTENT_VERSION,
  }));
  const minors: TarotCard[] = SUITS.flatMap((suit) =>
    SUIT_CONTENT[suit].map((content, i) => {
      const rank = i + 1;
      const word = RANK_WORDS[i];
      return {
        ...content,
        id: minorId(suit, rank),
        name: minorName(suit, rank),
        arcana: "minor" as const,
        suit,
        number: rank,
        numeral: word.charAt(0).toUpperCase() + word.slice(1),
        sources,
        contentVersion: CARD_CONTENT_VERSION,
      };
    }),
  );
  return [...majors, ...minors];
}

/** The full 78-card deck in canonical order: majors 0–21, then wands, cups, swords, pentacles (Ace → King). */
export const DECK: readonly TarotCard[] = buildDeck();

const BY_ID = new Map(DECK.map((c) => [c.id, c]));

export function getCard(id: string): TarotCard | undefined {
  return BY_ID.get(id);
}

export function requireCard(id: string): TarotCard {
  const card = BY_ID.get(id);
  if (!card) throw new Error(`Unknown card id: ${id}`);
  return card;
}

export const CARD_IDS: readonly string[] = DECK.map((c) => c.id);
