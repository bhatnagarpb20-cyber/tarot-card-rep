import { beforeEach, describe, expect, it } from "vitest";
import { guestStore } from "./guest-store";

describe("guest reading store", () => {
  beforeEach(() => localStorage.clear());

  it("keeps the same daily card for the same local date (refresh-safe)", () => {
    const at = new Date("2026-10-21T09:00:00Z");
    const first = guestStore.create({ kind: "daily", spread: "daily", category: "general", question: "", context: "", timezone: "Europe/London", parentReadingId: null }, at);
    const again = guestStore.create({ kind: "daily", spread: "daily", category: "love", question: "different", context: "", timezone: "Europe/London", parentReadingId: null }, at);
    expect(first.existing).toBe(false);
    expect(again.existing).toBe(true);
    expect(again.reading.id).toBe(first.reading.id);
    expect(again.reading.cards).toEqual(first.reading.cards);
    expect(guestStore.daily("2026-10-21").daily?.id).toBe(first.reading.id);
  });

  it("uses the user's timezone to decide the date", () => {
    // 23:30 UTC on the 21st is already the 22nd in Tokyo.
    const at = new Date("2026-10-21T23:30:00Z");
    const r = guestStore.create({ kind: "daily", spread: "daily", category: "general", question: "", context: "", timezone: "Asia/Tokyo", parentReadingId: null }, at);
    expect(r.reading.localDate).toBe("2026-10-22");
  });

  it("saves explicitly requested extra pulls as separate events", () => {
    const at = new Date("2026-10-21T09:00:00Z");
    const daily = guestStore.create({ kind: "daily", spread: "daily", category: "general", question: "", context: "", timezone: "UTC", parentReadingId: null }, at);
    const extra = guestStore.create({ kind: "daily_extra", spread: "daily", category: "general", question: "", context: "", timezone: "UTC", parentReadingId: daily.reading.id }, at);
    expect(extra.reading.id).not.toBe(daily.reading.id);
    expect(guestStore.daily("2026-10-21").extras).toHaveLength(1);
    expect(guestStore.daily("2026-10-21").daily?.id).toBe(daily.reading.id);
  });

  it("respects the reversal preference", () => {
    guestStore.setPrefs({ allowReversals: false });
    for (let i = 0; i < 20; i++) {
      const r = guestStore.create({ kind: "question", spread: "five-card", category: "career", question: "q", context: "", timezone: "UTC", parentReadingId: null });
      expect(r.reading.cards.every((c) => !c.reversed)).toBe(true);
      expect(new Set(r.reading.cards.map((c) => c.cardId)).size).toBe(5);
    }
  });

  it("stores journal notes and validates input", () => {
    const { reading } = guestStore.create({ kind: "daily", spread: "daily", category: "general", question: "", context: "", timezone: "UTC", parentReadingId: null });
    guestStore.addJournal(reading.id, { kind: "pre_reveal", body: "I notice the open sky.", resonance: null });
    expect(guestStore.get(reading.id)?.journal[0].body).toBe("I notice the open sky.");
    expect(() => guestStore.addJournal(reading.id, { kind: "reflection", body: "   ", resonance: null })).toThrow();
  });

  it("rejects an invalid timezone", () => {
    expect(() => guestStore.create({ kind: "daily", spread: "daily", category: "general", question: "", context: "", timezone: "Mars/Olympus", parentReadingId: null })).toThrow(/timezone/);
  });
});
