import "server-only";
import type { SupabaseServerClient } from "@/lib/supabase/server";
import { CARD_CONTENT_VERSION } from "@/content/cards";
import { SPREADS } from "@/lib/tarot/spreads";
import type { InterpretationSnapshot } from "@/lib/interpret/schema";
import { planReading } from "./plan";
import type { CreateReadingInput, FollowUp, JournalInput, JournalNote, SavedReading } from "./types";

export interface AccountPrefs {
  allowReversals: boolean;
  writeBeforeReveal: boolean;
  aiInterpretations: boolean;
  defaultCategory: string;
  reducedMotion: boolean;
}

export async function getPrefs(supabase: SupabaseServerClient, userId: string): Promise<AccountPrefs> {
  const { data } = await supabase.from("user_preferences").select("*").eq("user_id", userId).maybeSingle();
  return {
    allowReversals: data?.allow_reversals ?? true,
    writeBeforeReveal: data?.write_before_reveal ?? true,
    aiInterpretations: data?.ai_interpretations ?? true,
    defaultCategory: data?.default_category ?? "general",
    reducedMotion: data?.reduced_motion ?? false,
  };
}

const READING_SELECT = `
  id, kind, spread, category, question, context, local_date, timezone, allow_reversals, parent_reading_id, bookmarked, created_at,
  reading_cards ( position, card_id, reversed ),
  interpretation_snapshots ( source, generator, content_version, interpretation, created_at ),
  journal_entries ( id, kind, body, resonance, created_at ),
  reading_followups ( id, question, answer, created_at )
`;

// Shape returned by READING_SELECT. Typed loosely because the schema types are not generated.
interface ReadingRow {
  id: string;
  kind: SavedReading["kind"];
  spread: SavedReading["spread"];
  category: SavedReading["category"];
  question: string | null;
  context: string | null;
  local_date: string;
  timezone: string;
  allow_reversals: boolean;
  parent_reading_id: string | null;
  bookmarked: boolean;
  created_at: string;
  reading_cards: { position: number; card_id: string; reversed: boolean }[];
  interpretation_snapshots: { source: string; generator: string; content_version: string; interpretation: InterpretationSnapshot["interpretation"]; created_at: string }[];
  journal_entries: { id: string; kind: JournalNote["kind"]; body: string; resonance: JournalNote["resonance"]; created_at: string }[];
  reading_followups: { id: string; question: string; answer: FollowUp["answer"]; created_at: string }[];
}

export function rowToSaved(row: ReadingRow): SavedReading {
  const byTime = <T extends { created_at: string }>(a: T, b: T) => a.created_at.localeCompare(b.created_at);
  return {
    id: row.id,
    storage: "account",
    kind: row.kind,
    spread: row.spread,
    category: row.category,
    question: row.question ?? "",
    context: row.context ?? "",
    localDate: row.local_date,
    timezone: row.timezone,
    allowReversals: row.allow_reversals,
    parentReadingId: row.parent_reading_id,
    bookmarked: row.bookmarked,
    createdAt: row.created_at,
    cards: [...row.reading_cards].sort((a, b) => a.position - b.position).map((c) => ({ cardId: c.card_id, position: c.position, reversed: c.reversed })),
    snapshots: [...row.interpretation_snapshots].sort(byTime).map((s) => ({ interpretation: s.interpretation, generator: s.generator, contentVersion: s.content_version, createdAt: s.created_at })),
    journal: [...row.journal_entries].sort(byTime).map((j) => ({ id: j.id, kind: j.kind, body: j.body, resonance: j.resonance, createdAt: j.created_at })),
    followUps: [...row.reading_followups].sort(byTime).map((f) => ({ id: f.id, question: f.question, answer: f.answer, createdAt: f.created_at })),
  };
}

export async function getReading(supabase: SupabaseServerClient, id: string): Promise<SavedReading | null> {
  const { data, error } = await supabase.from("readings").select(READING_SELECT).eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToSaved(data as unknown as ReadingRow) : null;
}

export async function getReadingsForDate(supabase: SupabaseServerClient, localDate: string) {
  const { data, error } = await supabase.from("readings").select(READING_SELECT).eq("local_date", localDate).in("kind", ["daily", "daily_extra"]).order("created_at");
  if (error) throw new Error(error.message);
  const rs = (data as unknown as ReadingRow[]).map(rowToSaved);
  return { daily: rs.find((r) => r.kind === "daily") ?? null, extras: rs.filter((r) => r.kind === "daily_extra") };
}

export async function listReadings(supabase: SupabaseServerClient, opts: { limit?: number; category?: string; bookmarked?: boolean } = {}) {
  let q = supabase.from("readings").select(READING_SELECT).order("created_at", { ascending: false }).limit(opts.limit ?? 50);
  if (opts.category) q = q.eq("category", opts.category);
  if (opts.bookmarked) q = q.eq("bookmarked", true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data as unknown as ReadingRow[]).map(rowToSaved);
}

/**
 * Creates a reading for the signed-in user. Cards are drawn here on the server with a secure RNG.
 * A second "daily" for the same local date returns the existing reading instead of re-drawing.
 */
export async function createAccountReading(supabase: SupabaseServerClient, userId: string, input: CreateReadingInput): Promise<{ reading: SavedReading; existing: boolean }> {
  const prefs = await getPrefs(supabase, userId);
  const plan = planReading(input, prefs.allowReversals);
  if (input.kind === "daily") {
    const today = await getReadingsForDate(supabase, plan.localDate);
    if (today.daily) return { reading: today.daily, existing: true };
  }

  const { data: inserted, error } = await supabase
    .from("readings")
    .insert({
      user_id: userId,
      kind: input.kind,
      spread: input.spread,
      category: input.category,
      question: input.question || null,
      context: input.context || null,
      local_date: plan.localDate,
      timezone: input.timezone,
      allow_reversals: prefs.allowReversals,
      parent_reading_id: input.parentReadingId,
      content_version: CARD_CONTENT_VERSION,
    })
    .select("id")
    .single();
  if (error) {
    // Unique violation: another tab saved today's daily card first — return that one.
    if (error.code === "23505" && input.kind === "daily") {
      const today = await getReadingsForDate(supabase, plan.localDate);
      if (today.daily) return { reading: today.daily, existing: true };
    }
    throw new Error(error.message);
  }

  const positions = SPREADS[input.spread].positions;
  const { error: cardsError } = await supabase.from("reading_cards").insert(
    plan.cards.map((c) => ({ reading_id: inserted.id, user_id: userId, position: c.position, position_key: positions[c.position].key, card_id: c.cardId, reversed: c.reversed })),
  );
  if (cardsError) {
    await supabase.from("readings").delete().eq("id", inserted.id);
    throw new Error(cardsError.message);
  }
  await addSnapshot(supabase, userId, inserted.id, plan.snapshot);

  const reading = await getReading(supabase, inserted.id);
  if (!reading) throw new Error("Reading was saved but could not be loaded");
  return { reading, existing: false };
}

export async function addSnapshot(supabase: SupabaseServerClient, userId: string, readingId: string, snapshot: InterpretationSnapshot) {
  const { error } = await supabase.from("interpretation_snapshots").insert({
    reading_id: readingId,
    user_id: userId,
    source: snapshot.interpretation.source,
    generator: snapshot.generator,
    content_version: snapshot.contentVersion,
    interpretation: snapshot.interpretation,
  });
  if (error) throw new Error(error.message);
}

export async function addJournal(supabase: SupabaseServerClient, userId: string, readingId: string | null, input: JournalInput) {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert({ user_id: userId, reading_id: readingId, kind: input.kind, body: input.body, resonance: input.resonance })
    .select("id, kind, body, resonance, created_at")
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id, kind: data.kind, body: data.body, resonance: data.resonance, createdAt: data.created_at } as JournalNote;
}

export async function addFollowUp(supabase: SupabaseServerClient, userId: string, readingId: string, question: string, answer: FollowUp["answer"], generator: string) {
  const { data, error } = await supabase
    .from("reading_followups")
    .insert({ reading_id: readingId, user_id: userId, question, answer, generator })
    .select("id, question, answer, created_at")
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id, question: data.question, answer: data.answer, createdAt: data.created_at } as FollowUp;
}
