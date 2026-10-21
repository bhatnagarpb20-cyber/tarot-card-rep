"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { requireCard } from "@/content/cards";
import { ALL_LESSONS } from "@/content/academy";
import { computeStats } from "@/lib/journal/stats";
import { formatLocalDate } from "@/lib/dates";
import { learningClient } from "@/lib/learning/client";
import type { LearningState } from "@/lib/learning/types";
import { readingsClient } from "@/lib/readings/client";
import type { JournalNote, SavedReading } from "@/lib/readings/types";
import { SPREADS } from "@/lib/tarot/spreads";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/tarot/types";
import { TarotCard } from "@/components/cards/TarotCard";
import { useStorageMode } from "@/components/session/SessionContext";
import { SectionHeading } from "@/components/ornament/Ornaments";

type Tab = "readings" | "entries" | "patterns";

export function JournalHome() {
  const mode = useStorageMode();
  const client = useMemo(() => readingsClient(mode), [mode]);
  const learning = useMemo(() => learningClient(mode), [mode]);
  const [tab, setTab] = useState<Tab>("readings");
  const [readings, setReadings] = useState<SavedReading[] | null>(null);
  const [notes, setNotes] = useState<JournalNote[]>([]);
  const [learn, setLearn] = useState<LearningState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{ kind: string; category: string; bookmarked: boolean }>({ kind: "all", category: "all", bookmarked: false });

  useEffect(() => {
    Promise.all([client.list(), client.listNotes(), learning.state()])
      .then(([r, n, l]) => {
        setReadings(r);
        setNotes(n);
        setLearn(l);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load your journal."));
  }, [client, learning]);

  const filtered = (readings ?? []).filter(
    (r) => (filter.kind === "all" || (filter.kind === "daily" ? r.kind !== "question" : r.kind === "question")) && (filter.category === "all" || r.category === filter.category) && (!filter.bookmarked || r.bookmarked),
  );
  const stats = readings ? computeStats(readings) : null;

  return (
    <div className="space-y-8">
      <SectionHeading eyebrow={mode === "account" ? "Private to you" : "Saved in this browser"} title="Your journal" intro="Your readings, reflections and patterns. Everything here is private by default." />
      {error && <p role="alert" className="text-center text-hot">{error}</p>}

      <div role="tablist" aria-label="Journal sections" className="mx-auto flex w-full max-w-md rounded-full border border-line bg-void-sunk/70 p-1">
        {(
          [
            ["readings", "Readings"],
            ["entries", "Entries"],
            ["patterns", "Patterns"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            aria-controls={`panel-${key}`}
            id={`tab-${key}`}
            className={`min-h-11 flex-1 cursor-pointer rounded-full px-3 text-xs font-bold uppercase tracking-[0.1em] transition-colors sm:text-sm ${tab === key ? "bg-acid text-void" : "text-cream/80 hover:text-cream"}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {readings === null && !error && <p role="status" className="text-center">Loading…</p>}

      {tab === "readings" && readings && (
        <section id="panel-readings" role="tabpanel" aria-labelledby="tab-readings" className="space-y-6">
          <div className="grid grid-cols-2 items-end gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
            <label className="text-sm">
              Type
              <select className="field-night mt-1 block" value={filter.kind} onChange={(e) => setFilter((f) => ({ ...f, kind: e.target.value }))}>
                <option value="all">All readings</option>
                <option value="daily">Daily cards</option>
                <option value="question">Question readings</option>
              </select>
            </label>
            <label className="text-sm">
              Life area
              <select className="field-night mt-1 block" value={filter.category} onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}>
                <option value="all">All areas</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="col-span-2 flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" checked={filter.bookmarked} onChange={(e) => setFilter((f) => ({ ...f, bookmarked: e.target.checked }))} />
              Bookmarked only
            </label>
          </div>
          {readings.length === 0 ? (
            <div className="panel mx-auto max-w-xl p-6 text-center">
              <h2 className="text-2xl">No readings yet</h2>
              <p className="mt-2">Your daily cards and question readings will appear here, with your notes.</p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/daily" className="btn btn-primary">Draw today's card</Link>
                <Link href="/readings" className="btn btn-ghost">Ask a question</Link>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center">No readings match these filters.</p>
          ) : (
            <ul className="space-y-4">
              {filtered.map((r) => (
                <li key={r.id}>
                  <Link href={`/readings/${r.id}`} className="panel-night flex gap-4 p-4 text-cream no-underline hover:border-line">
                    <div className="flex shrink-0 -space-x-6">
                      {r.cards.slice(0, 3).map((c) => (
                        <TarotCard key={c.position} cardId={c.cardId} reversed={c.reversed} size="xs" />
                      ))}
                    </div>
                    <div className="min-w-0">
                      <p className="eyebrow !text-[0.7rem]">
                        {formatLocalDate(r.localDate)} · {r.kind === "daily" ? "Daily card" : r.kind === "daily_extra" ? "Additional pull" : SPREADS[r.spread].name} · {CATEGORY_LABELS[r.category]}
                        {r.bookmarked && " · ★"}
                      </p>
                      <p className="mt-1 font-[family-name:var(--font-heading)] text-xl">{r.question ? `“${r.question}”` : r.cards.map((c) => requireCard(c.cardId).name).join(", ")}</p>
                      <p className="mt-1 text-sm text-cream/75">
                        {r.cards.map((c) => `${requireCard(c.cardId).name}${c.reversed ? " (rev.)" : ""}`).join(" · ")}
                        {r.journal.length > 0 && ` — ${r.journal.length} note${r.journal.length > 1 ? "s" : ""}`}
                        {r.snapshots.some((s) => s.interpretation.source === "ai") && " — AI interpretation"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "entries" && (
        <section id="panel-entries" role="tabpanel" aria-labelledby="tab-entries" className="mx-auto max-w-3xl space-y-6">
          <NoteComposer onSave={async (body) => { const n = await client.addNote({ kind: "free", body, resonance: null }); setNotes((ns) => [n, ...ns]); }} />
          {notes.length === 0 ? (
            <p className="text-center text-cream/80">No free entries yet. Use them for observations, dreams or patterns you notice between readings.</p>
          ) : (
            <ul className="space-y-4">
              {notes.map((n) => (
                <li key={n.id} className="panel p-4">
                  <p className="text-xs opacity-70">{new Date(n.createdAt).toLocaleString()}</p>
                  <p className="mt-1 whitespace-pre-wrap">{n.body}</p>
                  <button
                    type="button"
                    className="mt-2 text-sm underline"
                    onClick={async () => {
                      if (!window.confirm("Delete this entry? This cannot be undone.")) return;
                      await client.removeNote(n.id);
                      setNotes((ns) => ns.filter((x) => x.id !== n.id));
                    }}
                  >
                    Delete entry
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "patterns" && stats && (
        <section id="panel-patterns" role="tabpanel" aria-labelledby="tab-patterns" className="space-y-6">
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["Readings", stats.totalReadings],
              ["Daily cards", stats.dailyCards],
              ["Current daily streak", `${stats.currentDailyStreak} day${stats.currentDailyStreak === 1 ? "" : "s"}`],
              ["Wrote my reading first", stats.wroteFirst],
              ["Reflections", stats.reflections],
              ["Question readings", stats.questionReadings],
              ["Major Arcana share", stats.majorShare === null ? "—" : `${Math.round(stats.majorShare * 100)}%`],
              ["Reversed share", stats.reversedShare === null ? "—" : `${Math.round(stats.reversedShare * 100)}%`],
            ].map(([label, value]) => (
              <div key={label} className="panel-night p-4 text-center">
                <dt className="text-sm text-cream/80">{label}</dt>
                <dd className="mt-1 font-[family-name:var(--font-heading)] text-3xl text-hot">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="panel p-5">
            <h2 className="text-2xl">Cards you've drawn more than once</h2>
            {stats.frequentCards.length === 0 ? (
              <p className="mt-2">No repeats yet.</p>
            ) : (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {stats.frequentCards.map((f) => (
                  <li key={f.cardId}>
                    <Link href={`/deck/${f.cardId}`}>{requireCard(f.cardId).name}</Link> — drawn {f.count} times
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-sm opacity-80">
              With 78 cards, repeats happen by chance more often than people expect. A repeated card isn't proof of fate — but it can be a useful prompt to revisit that card's themes.
            </p>
          </div>
          <div className="panel p-5">
            <h2 className="text-2xl">What resonated</h2>
            <p className="mt-2">
              Resonated: {stats.resonance.resonated} · Partly: {stats.resonance.partly} · Didn't resonate: {stats.resonance.did_not}
            </p>
            <p className="mt-2 text-sm opacity-80">Noting what didn't resonate is just as valuable — it sharpens your own judgement as a reader.</p>
          </div>
          {learn && (
            <div className="panel p-5">
              <h2 className="text-2xl">Learning progress</h2>
              <p className="mt-2">
                Lessons completed: {Object.values(learn.progress).filter((p) => p.status === "completed").length} of {ALL_LESSONS.length} · Quizzes taken: {learn.quizAttempts.length} · Practice exercises: {learn.practice.length}
              </p>
              <Link href="/academy" className="mt-2 inline-block">
                Continue learning →
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function NoteComposer({ onSave }: { onSave: (body: string) => Promise<void> }) {
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="panel space-y-3 p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!body.trim()) {
          setError("Write something before saving.");
          setStatus("error");
          return;
        }
        setStatus("saving");
        try {
          await onSave(body.trim());
          setBody("");
          setStatus("saved");
          setError(null);
        } catch (err) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Could not save.");
        }
      }}
    >
      <label htmlFor="free-note" className="block text-xl">
        New journal entry
      </label>
      <textarea id="free-note" className="field" rows={4} value={body} onChange={(e) => setBody(e.target.value)} maxLength={20000} />
      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save entry"}
        </button>
        <p role="status" className="text-sm">{status === "saved" && "Saved."}</p>
      </div>
      {error && <p role="alert" className="text-sm font-semibold text-hot">{error}</p>}
    </form>
  );
}
