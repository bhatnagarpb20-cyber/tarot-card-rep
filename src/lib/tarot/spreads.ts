export interface SpreadPosition {
  key: string;
  label: string;
  /** What this position asks of the card, shown before selection. */
  meaning: string;
}

export interface Spread {
  id: SpreadId;
  name: string;
  description: string;
  positions: SpreadPosition[];
}

export const SPREAD_IDS = ["daily", "one-card", "three-card", "five-card"] as const;
export type SpreadId = (typeof SPREAD_IDS)[number];

export const SPREADS: Record<SpreadId, Spread> = {
  daily: {
    id: "daily",
    name: "Daily card",
    description: "A single card to reflect on through the day.",
    positions: [{ key: "today", label: "Today's card", meaning: "A theme, quality or question to carry with you today." }],
  },
  "one-card": {
    id: "one-card",
    name: "One-card reading",
    description: "A focused perspective on your question: its central theme and a recommended action.",
    positions: [{ key: "focus", label: "Focus", meaning: "The central theme of your question and the perspective most worth considering." }],
  },
  "three-card": {
    id: "three-card",
    name: "Three-card reading",
    description: "Situation, challenge and guidance — a compact story about your question.",
    positions: [
      { key: "situation", label: "Situation", meaning: "Where things stand now; the context around your question." },
      { key: "challenge", label: "Challenge", meaning: "The obstacle, tension or lesson at the heart of the matter." },
      { key: "guidance", label: "Guidance", meaning: "An approach or attitude that could help you move forward." },
    ],
  },
  "five-card": {
    id: "five-card",
    name: "Five-card reading",
    description: "A deeper look: context, hidden influence, obstacle, opportunity and recommended action.",
    positions: [
      { key: "context", label: "Context", meaning: "The background and present circumstances of your question." },
      { key: "influence", label: "Underlying influence", meaning: "A less visible factor — a motive, belief or pressure shaping things." },
      { key: "obstacle", label: "Obstacle", meaning: "What stands in the way or needs to be worked through." },
      { key: "opportunity", label: "Opportunity", meaning: "A possibility or strength you could draw on." },
      { key: "action", label: "Recommended action", meaning: "A practical step or stance to take next." },
    ],
  },
};

export function getSpread(id: string): Spread | undefined {
  return (SPREADS as Record<string, Spread>)[id];
}
