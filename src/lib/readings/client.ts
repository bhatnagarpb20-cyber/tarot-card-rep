"use client";
import type { InterpretationSnapshot } from "@/lib/interpret/schema";
import { guestStore } from "./guest-store";
import type { CreateReadingInput, FollowUp, JournalInput, JournalNote, SavedReading } from "./types";

export type StorageMode = "guest" | "account";

export interface ClientPrefs {
  allowReversals: boolean;
  writeBeforeReveal: boolean;
  aiInterpretations: boolean;
}

export class ClientApiError extends Error {
  constructor(message: string, public code: string, public status: number) {
    super(message);
  }
}

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  } catch {
    throw new ClientApiError("You appear to be offline. Your reference reading is still available.", "offline", 0);
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ClientApiError(body.error ?? `Request failed (${res.status})`, body.code ?? "error", res.status);
  return body as T;
}

const post = <T>(url: string, data: unknown) => call<T>(url, { method: "POST", body: JSON.stringify(data) });

/** One interface for both storage modes so UI components don't care where readings live. */
export function readingsClient(mode: StorageMode) {
  if (mode === "guest") {
    return {
      mode,
      async today(localDate: string, _tz?: string) {
        const prefs = guestStore.prefs();
        return { ...guestStore.daily(localDate), prefs: { ...prefs, aiInterpretations: true } as ClientPrefs };
      },
      async create(input: CreateReadingInput) {
        return guestStore.create(input);
      },
      async get(id: string) {
        return guestStore.get(id) ?? null;
      },
      async list() {
        return guestStore.list();
      },
      async addJournal(id: string, input: JournalInput): Promise<JournalNote> {
        return guestStore.addJournal(id, input);
      },
      async requestAi(reading: SavedReading): Promise<InterpretationSnapshot> {
        const { snapshot } = await post<{ snapshot: InterpretationSnapshot }>("/api/ai/interpret", {
          reading: { spread: reading.spread, category: reading.category, question: reading.question, context: reading.context, cards: reading.cards },
        });
        guestStore.addSnapshot(reading.id, snapshot);
        return snapshot;
      },
      async followUp(reading: SavedReading, question: string): Promise<FollowUp> {
        const latest = reading.snapshots[reading.snapshots.length - 1]?.interpretation;
        const { answer } = await post<{ answer: FollowUp["answer"] }>("/api/ai/followup", {
          reading: { spread: reading.spread, category: reading.category, question: reading.question, context: reading.context, cards: reading.cards },
          previous: latest ? `${latest.directAnswer}\n${latest.whyThisFits}` : "",
          question,
        });
        return guestStore.addFollowUp(reading.id, { question, answer });
      },
      async setBookmark(id: string, bookmarked: boolean) {
        guestStore.setBookmark(id, bookmarked);
      },
      async remove(id: string) {
        guestStore.remove(id);
      },
      async listNotes() {
        return guestStore.listNotes();
      },
      async addNote(input: JournalInput) {
        return guestStore.addNote(input);
      },
      async removeNote(id: string) {
        guestStore.removeNote(id);
      },
    };
  }
  return {
    mode,
    async today(_localDate: string, tz?: string) {
      return call<{ daily: SavedReading | null; extras: SavedReading[]; prefs: ClientPrefs }>(`/api/readings/daily?tz=${encodeURIComponent(tz ?? "UTC")}`);
    },
    async create(input: CreateReadingInput) {
      return post<{ reading: SavedReading; existing: boolean }>("/api/readings", input);
    },
    async get(id: string) {
      return (await call<{ reading: SavedReading }>(`/api/readings/${id}`)).reading;
    },
    async list() {
      return (await call<{ readings: SavedReading[] }>("/api/readings?limit=200")).readings;
    },
    async addJournal(id: string, input: JournalInput) {
      return (await post<{ note: JournalNote }>(`/api/readings/${id}/journal`, input)).note;
    },
    async requestAi(reading: SavedReading) {
      return (await post<{ snapshot: InterpretationSnapshot }>(`/api/readings/${reading.id}/interpret`, {})).snapshot;
    },
    async followUp(reading: SavedReading, question: string) {
      return (await post<{ followUp: FollowUp }>(`/api/readings/${reading.id}/followup`, { question })).followUp;
    },
    async setBookmark(id: string, bookmarked: boolean) {
      await call(`/api/readings/${id}`, { method: "PATCH", body: JSON.stringify({ bookmarked }) });
    },
    async remove(id: string) {
      await call(`/api/readings/${id}`, { method: "DELETE" });
    },
    async listNotes() {
      return (await call<{ notes: JournalNote[] }>("/api/journal")).notes;
    },
    async addNote(input: JournalInput) {
      return (await post<{ note: JournalNote }>("/api/journal", input)).note;
    },
    async removeNote(id: string) {
      await call(`/api/journal/${id}`, { method: "DELETE" });
    },
  };
}

export type ReadingsClient = ReturnType<typeof readingsClient>;
