"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { requireCard } from "@/content/cards";
import type { ReadingsClient } from "@/lib/readings/client";
import type { SavedReading } from "@/lib/readings/types";
import { SPREADS } from "@/lib/tarot/spreads";
import { CATEGORY_LABELS } from "@/lib/tarot/types";
import { formatLocalDate } from "@/lib/dates";
import { TarotCard } from "@/components/cards/TarotCard";
import { InterpretationView } from "./InterpretationView";
import { AiRequest, FollowUpPanel, JournalComposer, SavedNotes } from "./ReadingTools";

export function useAiStatus(mode: "guest" | "account") {
  const [ai, setAi] = useState<{ ok: boolean; reason: string | null }>({ ok: false, reason: null });
  useEffect(() => {
    fetch("/api/ai/status")
      .then((r) => r.json())
      .then((s: { available: boolean; guestAllowed: boolean; reason: string | null }) => {
        const ok = mode === "account" ? s.available : s.guestAllowed;
        setAi({ ok, reason: ok ? null : s.available ? "Sign in to request AI interpretations. Guest mode includes the full reference reading." : s.reason });
      })
      .catch(() => setAi({ ok: false, reason: "AI status could not be checked — you may be offline." }));
  }, [mode]);
  return ai;
}

/** Full view of a saved reading: cards, interpretation versions, AI request, journal and follow-ups. */
export function ReadingResult({ reading: initial, client, onNewPull, aiEnabledInPrefs = true }: { reading: SavedReading; client: ReadingsClient; onNewPull?: () => void; aiEnabledInPrefs?: boolean }) {
  const [reading, setReading] = useState(initial);
  const [shownIndex, setShownIndex] = useState<number | null>(null);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const ai = useAiStatus(client.mode);
  const spread = SPREADS[reading.spread];
  const idx = shownIndex ?? reading.snapshots.length - 1;
  const shown = reading.snapshots[idx];

  useEffect(() => setReading(initial), [initial]);

  async function toggleBookmark() {
    const next = !reading.bookmarked;
    setReading((r) => ({ ...r, bookmarked: next }));
    try {
      await client.setBookmark(reading.id, next);
      setBookmarkError(null);
    } catch (e) {
      setReading((r) => ({ ...r, bookmarked: !next }));
      setBookmarkError(e instanceof Error ? e.message : "Could not update bookmark.");
    }
  }

  return (
    <div className="space-y-10">
      <header className="text-center">
        <p className="eyebrow">
          {reading.kind === "daily" ? "Daily card" : reading.kind === "daily_extra" ? "Additional daily pull" : spread.name} · {formatLocalDate(reading.localDate)} · {CATEGORY_LABELS[reading.category]}
        </p>
        <h1 className="mt-2 text-4xl">{reading.question ? `“${reading.question}”` : reading.cards.length === 1 ? requireCard(reading.cards[0].cardId).name : "Your reading"}</h1>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-ghost" aria-pressed={reading.bookmarked} onClick={toggleBookmark}>
            {reading.bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
          </button>
          {reading.storage === "account" && (
            <Link href={`/readings/${reading.id}/share`} className="btn btn-ghost">
              Share…
            </Link>
          )}
        </div>
        {bookmarkError && (
          <p role="alert" className="mt-2 text-sm text-gold-light">
            {bookmarkError}
          </p>
        )}
        <ol className="mt-8 flex flex-wrap justify-center gap-6">
          {reading.cards.map((c) => (
            <li key={c.position} className="flex flex-col items-center gap-2">
              <span className="eyebrow">{spread.positions[c.position]?.label}</span>
              <TarotCard cardId={c.cardId} reversed={c.reversed} size={reading.cards.length > 3 ? "sm" : "md"} />
              <span className="text-sm">
                {requireCard(c.cardId).name}
                {c.reversed ? " (reversed)" : ""}
              </span>
            </li>
          ))}
        </ol>
      </header>

      {reading.snapshots.length > 1 && (
        <div role="tablist" aria-label="Interpretation versions" className="flex justify-center gap-2">
          {reading.snapshots.map((s, i) => (
            <button key={s.createdAt} role="tab" type="button" aria-selected={i === idx} className={`btn ${i === idx ? "btn-primary" : "btn-ghost"}`} onClick={() => setShownIndex(i)}>
              {s.interpretation.source === "ai" ? "AI interpretation" : "Reference reading"}
            </button>
          ))}
        </div>
      )}
      {shown && <InterpretationView snapshot={shown} showCards={reading.cards.length > 1} />}

      <AiRequest
        reading={reading}
        client={client}
        available={{ ok: ai.ok && aiEnabledInPrefs, reason: aiEnabledInPrefs ? ai.reason : "AI interpretations are turned off in your settings." }}
        onSnapshot={(s) => {
          setReading((r) => ({ ...r, snapshots: [...r.snapshots, s] }));
          setShownIndex(null);
        }}
      />

      <section aria-labelledby="rr-journal" className="panel p-5 sm:p-8">
        <h2 id="rr-journal" className="text-2xl">
          Your journal
        </h2>
        <div className="mt-4 space-y-6">
          <SavedNotes notes={reading.journal} />
          <JournalComposer reading={reading} client={client} kind="reflection" label="Your interpretation and reflections" hint={shown ? `Try responding to: “${shown.interpretation.reflectionPrompt}”` : undefined} withResonance onSaved={(n) => setReading((r) => ({ ...r, journal: [...r.journal, n] }))} />
        </div>
      </section>

      <div className="panel-night p-5 sm:p-6">
        <FollowUpPanel reading={reading} client={client} available={ai.ok && aiEnabledInPrefs} onAdded={(f) => setReading((r) => ({ ...r, followUps: [...r.followUps, f] }))} onNewPull={onNewPull} />
      </div>
    </div>
  );
}
