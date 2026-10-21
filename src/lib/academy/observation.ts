import type { TarotCard } from "@/lib/tarot/types";

export const OBSERVATION_PROMPTS = [
  { key: "first", label: "What is the first thing you notice?" },
  { key: "who", label: "Who or what is depicted?" },
  { key: "doing", label: "What is the figure doing?" },
  { key: "details", label: "What objects, animals, colours and symbols stand out?" },
  { key: "mood", label: "What is the emotional atmosphere?" },
  { key: "direction", label: "Where does the figure appear to be looking or moving?" },
  { key: "tension", label: "What tension, contrast or relationship exists in the scene?" },
  { key: "question", label: "How might these observations relate to your question?" },
] as const;

export type Observations = Partial<Record<(typeof OBSERVATION_PROMPTS)[number]["key"], string>>;

const STOP = new Set(["the", "a", "an", "of", "and", "with", "on", "in", "to", "at", "by", "from", "its", "his", "her", "their", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "card", "figure"]);

function words(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map((w) => w.replace(/(ies|es|s)$/, ""));
}

export interface ObservationFeedback {
  noticed: { element: string; meaning: string }[];
  notYet: { element: string; meaning: string }[];
  wordCount: number;
  encouragement: string;
}

/**
 * Compares what the learner wrote with the card's documented symbols. This rewards careful looking;
 * it does not grade intuition — anything not in the reference may still be a valid observation.
 */
export function compareObservations(card: TarotCard, obs: Observations): ObservationFeedback {
  const text = Object.values(obs).filter(Boolean).join(" ");
  const written = new Set(words(text));
  const noticed: ObservationFeedback["noticed"] = [];
  const notYet: ObservationFeedback["notYet"] = [];
  for (const s of card.symbols) {
    const keyWords = words(s.element);
    (keyWords.some((w) => written.has(w)) ? noticed : notYet).push(s);
  }
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const answered = Object.values(obs).filter((v) => v && v.trim()).length;
  let encouragement: string;
  if (answered === 0) encouragement = "Try answering at least a few of the questions — even a single word helps you look more closely.";
  else if (noticed.length >= Math.ceil(card.symbols.length / 2)) encouragement = "Careful looking — you picked out most of the key symbols. Notice how they combine into one message.";
  else if (noticed.length > 0) encouragement = "Good start. Look again at the symbols below that you haven't mentioned yet and ask what each adds.";
  else encouragement = "Your impressions are your own and may still be valid. Compare them with the traditional symbols below to deepen your reading.";
  return { noticed, notYet, wordCount, encouragement };
}
