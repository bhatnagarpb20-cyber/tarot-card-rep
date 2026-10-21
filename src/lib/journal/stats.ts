import type { SavedReading } from "@/lib/readings/types";
import type { Category } from "@/lib/tarot/types";

export interface JournalStats {
  totalReadings: number;
  dailyCards: number;
  questionReadings: number;
  extraPulls: number;
  byCategory: Partial<Record<Category, number>>;
  /** Cards drawn more than once, most frequent first. */
  frequentCards: { cardId: string; count: number }[];
  majorShare: number | null;
  reversedShare: number | null;
  reflections: number;
  wroteFirst: number;
  resonance: { resonated: number; partly: number; did_not: number };
  /** Consecutive local days up to the most recent daily card. */
  currentDailyStreak: number;
}

function prevDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d - 1));
  return dt.toISOString().slice(0, 10);
}

/** All figures are counted from the readings actually stored — nothing is estimated or invented. */
export function computeStats(readings: SavedReading[]): JournalStats {
  const counts = new Map<string, number>();
  let cards = 0;
  let majors = 0;
  let reversed = 0;
  const byCategory: JournalStats["byCategory"] = {};
  const resonance = { resonated: 0, partly: 0, did_not: 0 };
  let reflections = 0;
  let wroteFirst = 0;

  for (const r of readings) {
    byCategory[r.category] = (byCategory[r.category] ?? 0) + 1;
    for (const c of r.cards) {
      cards++;
      counts.set(c.cardId, (counts.get(c.cardId) ?? 0) + 1);
      if (c.cardId.startsWith("major-")) majors++;
      if (c.reversed) reversed++;
    }
    for (const j of r.journal) {
      if (j.kind === "pre_reveal") wroteFirst++;
      else reflections++;
      if (j.resonance) resonance[j.resonance]++;
    }
  }

  const dailyDates = new Set(readings.filter((r) => r.kind === "daily").map((r) => r.localDate));
  let streak = 0;
  const latest = [...dailyDates].sort().pop();
  for (let d = latest; d && dailyDates.has(d); d = prevDay(d)) streak++;

  return {
    totalReadings: readings.length,
    dailyCards: readings.filter((r) => r.kind === "daily").length,
    questionReadings: readings.filter((r) => r.kind === "question").length,
    extraPulls: readings.filter((r) => r.kind === "daily_extra").length,
    byCategory,
    frequentCards: [...counts.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8).map(([cardId, count]) => ({ cardId, count })),
    majorShare: cards ? majors / cards : null,
    reversedShare: cards ? reversed / cards : null,
    reflections,
    wroteFirst,
    resonance,
    currentDailyStreak: streak,
  };
}
