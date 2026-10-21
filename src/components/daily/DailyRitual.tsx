"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { requireCard } from "@/content/cards";
import { browserTimeZone, formatLongDate, localDateISO } from "@/lib/dates";
import { readingsClient, type ClientPrefs, type StorageMode } from "@/lib/readings/client";
import { guestStore } from "@/lib/readings/guest-store";
import type { SavedReading } from "@/lib/readings/types";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/lib/tarot/types";
import { TarotCard } from "@/components/cards/TarotCard";
import { CardBack } from "@/components/cards/CardBack";
import { InterpretationView } from "@/components/reading/InterpretationView";
import { AiRequest, FollowUpPanel, JournalComposer, SavedNotes } from "@/components/reading/ReadingTools";
import { Divider, Star } from "@/components/ornament/Ornaments";

type Phase = "loading" | "welcome" | "intention" | "shuffling" | "choose" | "revealing" | "impressions" | "interpretation" | "error";

const FACE_DOWN_COUNT = 7;

function greeting(tz: string) {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "numeric", hourCycle: "h23" }).format(new Date()));
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DailyRitual({ mode }: { mode: StorageMode }) {
  const client = useMemo(() => readingsClient(mode), [mode]);
  const [phase, setPhase] = useState<Phase>("loading");
  const [tz, setTz] = useState("UTC");
  const [prefs, setPrefs] = useState<ClientPrefs>({ allowReversals: true, writeBeforeReveal: true, aiInterpretations: true });
  const [daily, setDaily] = useState<SavedReading | null>(null);
  const [extras, setExtras] = useState<SavedReading[]>([]);
  const [current, setCurrent] = useState<SavedReading | null>(null);
  const [isExtra, setIsExtra] = useState(false);
  const [intention, setIntention] = useState("");
  const [category, setCategory] = useState<Category>("general");
  const [question, setQuestion] = useState("");
  const [chosen, setChosen] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [ai, setAi] = useState<{ ok: boolean; reason: string | null; followUps: boolean }>({ ok: false, reason: null, followUps: false });
  const [showSnapshot, setShowSnapshot] = useState<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the new step's heading so screen-reader and keyboard users follow the ritual.
  useEffect(() => {
    if (phase !== "loading") headingRef.current?.focus();
  }, [phase]);

  const load = useCallback(async () => {
    const zone = browserTimeZone();
    const date = localDateISO(zone);
    setTz(zone);
    try {
      if (mode === "guest" && !guestStore.isAvailable()) {
        setNotice("This browser is blocking local storage, so guest readings can't be saved. You can still draw and read, but nothing will be kept.");
      }
      const today = await client.today(date, zone);
      setPrefs(today.prefs);
      setDaily(today.daily);
      setExtras(today.extras);
      if (today.daily) {
        setCurrent(today.daily);
        setPhase("interpretation");
      } else {
        setPhase("welcome");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load today's reading.");
      setPhase("error");
    }
    fetch("/api/ai/status")
      .then((r) => r.json())
      .then((s: { available: boolean; guestAllowed: boolean; reason: string | null }) => {
        const ok = mode === "account" ? s.available : s.guestAllowed;
        setAi({ ok, followUps: ok, reason: ok ? null : s.available ? "Sign in to request AI interpretations. Guest mode includes the full reference reading." : s.reason });
      })
      .catch(() => setAi({ ok: false, followUps: false, reason: "AI status could not be checked — you may be offline. The reference reading works offline." }));
  }, [client, mode]);

  useEffect(() => {
    load();
  }, [load]);

  function startShuffle() {
    setPhase("shuffling");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setPhase("choose"), reduced ? 50 : 2200);
  }

  async function choose(index: number) {
    if (chosen !== null) return;
    setChosen(index);
    setError(null);
    try {
      // The card is drawn now, by a secure random generator. Your question never affects which card appears.
      const { reading, existing } = await client.create({
        kind: isExtra ? "daily_extra" : "daily",
        spread: "daily",
        category,
        question: question.trim(),
        context: intention.trim() ? `Intention: ${intention.trim()}` : "",
        timezone: tz,
        parentReadingId: isExtra ? (daily?.id ?? null) : null,
      });
      if (existing) setNotice("You had already drawn today's card (perhaps in another tab), so that saved card is shown instead.");
      setCurrent(reading);
      if (isExtra) setExtras((x) => [...x, reading]);
      else setDaily(reading);
      setPhase("revealing");
      window.setTimeout(() => setFlipped(true), 60);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(() => setPhase(prefs.writeBeforeReveal && !existing ? "impressions" : "interpretation"), reduced ? 300 : 1400);
    } catch (e) {
      setChosen(null);
      setError(e instanceof Error ? e.message : "The card could not be drawn. Please try again.");
    }
  }

  function startExtraPull() {
    setIsExtra(true);
    setChosen(null);
    setFlipped(false);
    setQuestion("");
    setNotice(null);
    setShowSnapshot(null);
    setPhase("intention");
  }

  function updateCurrent(update: (r: SavedReading) => SavedReading) {
    setCurrent((r) => {
      if (!r) return r;
      const next = update(r);
      if (daily?.id === next.id) setDaily(next);
      setExtras((xs) => xs.map((x) => (x.id === next.id ? next : x)));
      return next;
    });
  }

  const card = current ? requireCard(current.cards[0].cardId) : null;
  const drawn = current?.cards[0];
  const snapshots = current?.snapshots ?? [];
  const shownIndex = showSnapshot ?? snapshots.length - 1;
  const shown = snapshots[shownIndex];

  return (
    <div className="mx-auto max-w-3xl">
      {mode === "guest" && (
        <p className="mb-6 rounded-lg border border-gold/40 bg-indigo/40 p-3 text-sm text-ivory/90">
          <strong className="text-gold-light">Guest mode:</strong> readings are saved only in this browser on this device and are lost if you clear browser data. <Link href="/login">Sign in</Link> to keep a private, backed-up journal.
        </p>
      )}
      {notice && (
        <p role="status" className="mb-6 rounded-lg border border-gold/40 p-3 text-sm">
          {notice}
        </p>
      )}

      {phase === "loading" && (
        <p role="status" className="py-24 text-center text-ivory/80">
          Preparing your reading…
        </p>
      )}

      {phase === "error" && (
        <div className="panel p-6 text-center">
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl">
            Something interrupted the ritual
          </h1>
          <p className="mt-2">{error}</p>
          <button type="button" className="btn btn-ghost mt-4" onClick={load}>
            Try again
          </button>
        </div>
      )}

      {phase === "welcome" && (
        <section className="rise-in text-center">
          <p className="eyebrow">{formatLongDate(tz)}</p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-4xl sm:text-5xl">
            {greeting(tz)}. Your daily card awaits.
          </h1>
          <Divider className="mt-5" />
          <p className="mx-auto mt-5 max-w-xl text-ivory/85">
            Take a moment for yourself. You'll pause, set an intention, shuffle and choose one card to reflect on today. Your card is saved, so it will be the same if you come back later.
          </p>
          <button type="button" className="btn btn-primary mt-8" onClick={() => setPhase("intention")}>
            Begin the ritual
          </button>
        </section>
      )}

      {phase === "intention" && (
        <section className="rise-in">
          <div className="text-center">
            <p className="eyebrow">{isExtra ? "Additional pull · saved separately" : "Pause & set an intention"}</p>
            <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-4xl">
              Breathe, then ask
            </h1>
          </div>
          <div className="my-8 flex flex-col items-center gap-3" aria-hidden="true">
            <div className="breath-orb h-28 w-28 rounded-full border border-gold/70 bg-[radial-gradient(circle,rgb(217_188_116/0.35),transparent_70%)]" />
          </div>
          <p className="text-center text-sm text-ivory/80">Breathe in as the circle grows, out as it softens. Three breaths are plenty.</p>
          {isExtra && (
            <p className="mx-auto mt-4 max-w-xl rounded border border-gold/40 p-3 text-sm">
              This is an <strong>additional pull</strong>. Today's card stays as it is; this new card will be saved as a separate, clearly labelled reading.
            </p>
          )}
          <form
            className="panel mx-auto mt-8 max-w-xl space-y-5 p-5 sm:p-6"
            onSubmit={(e) => {
              e.preventDefault();
              startShuffle();
            }}
          >
            <div>
              <label htmlFor="intention" className="block font-semibold">
                Your intention <span className="font-normal opacity-70">(optional)</span>
              </label>
              <input id="intention" className="field mt-1" value={intention} onChange={(e) => setIntention(e.target.value)} maxLength={200} placeholder="e.g. to stay patient with myself" />
            </div>
            <fieldset>
              <legend className="font-semibold">Theme for today</legend>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {CATEGORIES.map((c) => (
                  <label key={c} className="flex min-h-11 items-center gap-2 rounded border border-gold-dark/30 px-3 has-[:checked]:border-burgundy has-[:checked]:bg-white/50">
                    <input type="radio" name="category" value={c} checked={category === c} onChange={() => setCategory(c)} />
                    {CATEGORY_LABELS[c]}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="question" className="block font-semibold">
                A personal question <span className="font-normal opacity-70">(optional)</span>
              </label>
              <textarea id="question" className="field mt-1" rows={2} value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={500} aria-describedby="question-hint" />
              <p id="question-hint" className="mt-1 text-sm opacity-75">
                Open questions work best, like “What should I focus on today?” Your question shapes the interpretation, never which card is drawn.
              </p>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Shuffle the deck
            </button>
          </form>
        </section>
      )}

      {phase === "shuffling" && (
        <section className="text-center">
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl">
            Shuffling…
          </h1>
          <div className="relative mx-auto mt-10 h-56 w-36" aria-hidden="true">
            <div className="shuffle-a absolute inset-0">
              <CardBack />
            </div>
            <div className="shuffle-b absolute inset-0">
              <CardBack />
            </div>
            <div className="absolute inset-0">
              <CardBack />
            </div>
          </div>
          <p role="status" className="mt-8 text-sm text-ivory/80">
            Hold your question in mind.
          </p>
        </section>
      )}

      {phase === "choose" && (
        <section className="rise-in text-center">
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl sm:text-4xl">
            Choose the card that calls to you
          </h1>
          <p className="mt-2 text-sm text-ivory/80">Use a tap, a click, or Tab and Enter.</p>
          <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2 sm:flex-nowrap sm:gap-0" aria-label="Face-down cards">
            {Array.from({ length: FACE_DOWN_COUNT }, (_, i) => {
              const angle = (i - (FACE_DOWN_COUNT - 1) / 2) * 5;
              return (
                <li key={i} className="sm:-mx-2" style={{ transform: `rotate(${angle}deg)` }}>
                  <button
                    type="button"
                    onClick={() => choose(i)}
                    disabled={chosen !== null}
                    aria-label={`Face-down card ${i + 1} of ${FACE_DOWN_COUNT}`}
                    className={`block aspect-[2/3] w-20 rounded-[var(--radius-card)] transition-transform duration-300 hover:-translate-y-3 focus-visible:-translate-y-3 sm:w-24 ${chosen === i ? "-translate-y-4" : ""}`}
                  >
                    <CardBack />
                  </button>
                </li>
              );
            })}
          </ul>
          {chosen !== null && (
            <p role="status" className="mt-8 text-sm">
              Turning your card…
            </p>
          )}
          {error && (
            <p role="alert" className="mt-6 font-semibold text-gold-light">
              {error}
            </p>
          )}
        </section>
      )}

      {(phase === "revealing" || phase === "impressions") && current && card && drawn && (
        <section className="text-center">
          <div className="flip-scene mx-auto aspect-[2/3] w-64 sm:w-72">
            <div className="flip-inner" data-flipped={flipped}>
              <div className="flip-face">
                <CardBack />
              </div>
              <div className="flip-face flip-face-front">
                <TarotCard cardId={card.id} reversed={drawn.reversed} size="fluid" priority />
              </div>
            </div>
          </div>
          <h1 ref={headingRef} tabIndex={-1} className="mt-6 text-4xl">
            {card.name}
          </h1>
          <p className="eyebrow mt-1">{drawn.reversed ? "Reversed" : "Upright"}</p>
          {phase === "impressions" && (
            <div className="panel mx-auto mt-8 max-w-xl p-5 text-left">
              <JournalComposer
                reading={current}
                client={client}
                kind="pre_reveal"
                label="Before you read the interpretation: what do you notice?"
                hint="Look at the image. What stands out first? What feeling does it give you? Writing your own reading first is how you become a confident reader."
                onSaved={(note) => {
                  updateCurrent((r) => ({ ...r, journal: [...r.journal, note] }));
                  setPhase("interpretation");
                }}
              />
              <button type="button" className="mt-3 text-sm underline" onClick={() => setPhase("interpretation")}>
                Skip and show the interpretation
              </button>
            </div>
          )}
        </section>
      )}

      {phase === "interpretation" && current && card && drawn && shown && (
        <div className="space-y-10">
          <header className="text-center">
            <p className="eyebrow">
              {current.kind === "daily" ? `Today's card · ${formatLongDate(current.timezone, new Date(current.createdAt))}` : "Additional pull · saved as a separate reading"}
            </p>
            <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-4xl sm:text-5xl">
              {card.name}
            </h1>
            <p className="mt-1 text-ivory/80">
              {drawn.reversed ? "Reversed" : "Upright"} · {CATEGORY_LABELS[current.category]}
              {current.question && <> · “{current.question}”</>}
            </p>
            <div className="mt-6 flex justify-center">
              <TarotCard cardId={card.id} reversed={drawn.reversed} size="lg" priority />
            </div>
          </header>

          <section aria-labelledby="symbols-h" className="panel-night p-5 sm:p-6">
            <h2 id="symbols-h" className="text-2xl">
              Reading the symbols in {card.name}
            </h2>
            <ul className="mt-3 space-y-2">
              {card.symbols.slice(0, 3).map((s) => (
                <li key={s.element} className="flex gap-2">
                  <Star className="mt-1.5 shrink-0 text-gold" size={10} />
                  <span>
                    <strong className="text-gold-light">{s.element}:</strong> {s.meaning}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm italic text-ivory/85">Memory aid: {card.memoryAid}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/deck/${card.id}`} className="btn btn-ghost">
                Learn this card
              </Link>
              <Link href={`/deck/${card.id}#observe`} className="btn btn-ghost">
                Guided observation
              </Link>
              <Link href={`/deck/${card.id}#quiz`} className="btn btn-ghost">
                Quick quiz
              </Link>
            </div>
            <p className="mt-4 text-sm text-ivory/80">
              Related cards:{" "}
              {card.related.map((r, i) => (
                <span key={r.id}>
                  {i > 0 && ", "}
                  <Link href={`/deck/${r.id}`}>{requireCard(r.id).name}</Link>
                </span>
              ))}
            </p>
          </section>

          {snapshots.length > 1 && (
            <div role="tablist" aria-label="Interpretation versions" className="flex justify-center gap-2">
              {snapshots.map((s, i) => (
                <button key={s.createdAt} role="tab" type="button" aria-selected={i === shownIndex} className={`btn ${i === shownIndex ? "btn-primary" : "btn-ghost"}`} onClick={() => setShowSnapshot(i)}>
                  {s.interpretation.source === "ai" ? "AI interpretation" : "Reference reading"}
                </button>
              ))}
            </div>
          )}

          <InterpretationView snapshot={shown} showCards={false} />

          <AiRequest
            reading={current}
            client={client}
            available={{ ok: ai.ok && prefs.aiInterpretations, reason: !prefs.aiInterpretations ? "AI interpretations are turned off in your settings." : ai.reason }}
            onSnapshot={(s) => {
              updateCurrent((r) => ({ ...r, snapshots: [...r.snapshots, s] }));
              setShowSnapshot(null);
            }}
          />

          <section aria-labelledby="journal-h" className="panel p-5 sm:p-8">
            <h2 id="journal-h" className="text-2xl">
              Your journal
            </h2>
            <div className="mt-4 space-y-6">
              <SavedNotes notes={current.journal} />
              <JournalComposer
                reading={current}
                client={client}
                kind="reflection"
                label="Your own interpretation and reflections"
                hint={`Try responding to: “${shown.interpretation.reflectionPrompt}”`}
                withResonance
                onSaved={(note) => updateCurrent((r) => ({ ...r, journal: [...r.journal, note] }))}
              />
            </div>
          </section>

          <div className="panel-night p-5 sm:p-6">
            <FollowUpPanel reading={current} client={client} available={ai.followUps && prefs.aiInterpretations} onAdded={(f) => updateCurrent((r) => ({ ...r, followUps: [...r.followUps, f] }))} onNewPull={startExtraPull} />
          </div>

          <section aria-labelledby="more-h" className="text-center">
            <h2 id="more-h" className="text-2xl">
              Today's other pulls
            </h2>
            {extras.length > 0 ? (
              <ul className="mt-4 flex flex-wrap justify-center gap-4">
                {[daily, ...extras].filter(Boolean).map((r) => {
                  const c = requireCard(r!.cards[0].cardId);
                  return (
                    <li key={r!.id}>
                      <button type="button" onClick={() => { setCurrent(r); setShowSnapshot(null); }} aria-current={r!.id === current.id} className="flex flex-col items-center gap-2 rounded p-2 aria-[current=true]:ring-2 aria-[current=true]:ring-gold">
                        <TarotCard cardId={c.id} reversed={r!.cards[0].reversed} size="xs" />
                        <span className="text-sm">{r!.kind === "daily" ? "Daily card" : "Additional pull"}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ivory/75">Just one card today. That's usually enough.</p>
            )}
            <button type="button" className="btn btn-ghost mt-6" onClick={startExtraPull}>
              Draw an additional card
            </button>
            <p className="mt-2 text-xs text-ivory/70">Additional pulls are labelled and saved separately; your daily card never changes.</p>
          </section>
        </div>
      )}
    </div>
  );
}
