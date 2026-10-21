/**
 * Guest-mode storage in this browser's localStorage. Limitations (stated in the UI): data stays on
 * this device only, is lost if browser data is cleared, and is not backed up or synced.
 */
import type { InterpretationSnapshot } from "@/lib/interpret/schema";
import { planReading } from "./plan";
import { createReadingSchema, journalInputSchema, type CreateReadingInput, type FollowUp, type JournalInput, type JournalNote, type SavedReading } from "./types";

const KEY = "daily-arcana:guest:v1";

export interface GuestPrefs {
  allowReversals: boolean;
  writeBeforeReveal: boolean;
}

interface GuestData {
  readings: SavedReading[];
  prefs: GuestPrefs;
}

const DEFAULT_PREFS: GuestPrefs = { allowReversals: true, writeBeforeReveal: true };

function uid(): string {
  return globalThis.crypto.randomUUID();
}

function load(): GuestData {
  try {
    const raw = globalThis.localStorage?.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GuestData>;
      return { readings: parsed.readings ?? [], prefs: { ...DEFAULT_PREFS, ...parsed.prefs } };
    }
  } catch {
    // Corrupt or inaccessible storage: start fresh rather than crash.
  }
  return { readings: [], prefs: { ...DEFAULT_PREFS } };
}

function save(data: GuestData) {
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(data));
  } catch {
    throw new Error("This browser would not let us save on this device (storage may be full or disabled).");
  }
}

export const guestStore = {
  isAvailable(): boolean {
    try {
      const k = `${KEY}:probe`;
      localStorage.setItem(k, "1");
      localStorage.removeItem(k);
      return true;
    } catch {
      return false;
    }
  },

  prefs(): GuestPrefs {
    return load().prefs;
  },

  setPrefs(update: Partial<GuestPrefs>): GuestPrefs {
    const data = load();
    data.prefs = { ...data.prefs, ...update };
    save(data);
    return data.prefs;
  },

  list(): SavedReading[] {
    return [...load().readings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  get(id: string): SavedReading | undefined {
    return load().readings.find((r) => r.id === id);
  },

  daily(localDate: string): { daily: SavedReading | null; extras: SavedReading[] } {
    const rs = load().readings.filter((r) => r.localDate === localDate);
    return { daily: rs.find((r) => r.kind === "daily") ?? null, extras: rs.filter((r) => r.kind === "daily_extra") };
  },

  /** Creates a reading. A second "daily" for the same local date returns the existing one. */
  create(raw: CreateReadingInput, now = new Date()): { reading: SavedReading; existing: boolean } {
    const input = createReadingSchema.parse(raw);
    const data = load();
    const plan = planReading(input, data.prefs.allowReversals, now);
    if (input.kind === "daily") {
      const existing = data.readings.find((r) => r.kind === "daily" && r.localDate === plan.localDate);
      if (existing) return { reading: existing, existing: true };
    }
    const reading: SavedReading = {
      id: uid(),
      storage: "guest",
      kind: input.kind,
      spread: input.spread,
      category: input.category,
      question: input.question,
      context: input.context,
      localDate: plan.localDate,
      timezone: input.timezone,
      allowReversals: data.prefs.allowReversals,
      parentReadingId: input.parentReadingId,
      cards: plan.cards,
      snapshots: [plan.snapshot],
      journal: [],
      followUps: [],
      bookmarked: false,
      createdAt: now.toISOString(),
    };
    data.readings.push(reading);
    save(data);
    return { reading, existing: false };
  },

  addJournal(readingId: string, raw: JournalInput): JournalNote {
    const input = journalInputSchema.parse(raw);
    const data = load();
    const r = data.readings.find((x) => x.id === readingId);
    if (!r) throw new Error("Reading not found");
    const note: JournalNote = { id: uid(), kind: input.kind, body: input.body, resonance: input.resonance, createdAt: new Date().toISOString() };
    r.journal.push(note);
    save(data);
    return note;
  },

  addSnapshot(readingId: string, snapshot: InterpretationSnapshot) {
    const data = load();
    const r = data.readings.find((x) => x.id === readingId);
    if (!r) throw new Error("Reading not found");
    r.snapshots.push(snapshot);
    save(data);
  },

  addFollowUp(readingId: string, followUp: Omit<FollowUp, "id" | "createdAt">): FollowUp {
    const data = load();
    const r = data.readings.find((x) => x.id === readingId);
    if (!r) throw new Error("Reading not found");
    const f: FollowUp = { ...followUp, id: uid(), createdAt: new Date().toISOString() };
    r.followUps.push(f);
    save(data);
    return f;
  },

  setBookmark(readingId: string, bookmarked: boolean) {
    const data = load();
    const r = data.readings.find((x) => x.id === readingId);
    if (!r) throw new Error("Reading not found");
    r.bookmarked = bookmarked;
    save(data);
  },

  remove(readingId: string) {
    const data = load();
    data.readings = data.readings.filter((r) => r.id !== readingId);
    save(data);
  },

  exportAll(): GuestData {
    return load();
  },

  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* nothing stored */
    }
  },
};
