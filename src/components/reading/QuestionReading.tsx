"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { requireCard } from "@/content/cards";
import { browserTimeZone } from "@/lib/dates";
import { readingsClient } from "@/lib/readings/client";
import type { SavedReading } from "@/lib/readings/types";
import { SPREADS, type SpreadId } from "@/lib/tarot/spreads";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/lib/tarot/types";
import { CardBack } from "@/components/cards/CardBack";
import { TarotCard } from "@/components/cards/TarotCard";
import { useStorageMode } from "@/components/session/SessionContext";
import { JournalComposer } from "./ReadingTools";
import { ReadingResult } from "./ReadingResult";

type Step = "setup" | "shuffling" | "choose" | "reveal" | "result";
const QUESTION_SPREADS: SpreadId[] = ["one-card", "three-card", "five-card"];
const FAN = 13;

export function QuestionReading() {
  const mode = useStorageMode();
  const client = useMemo(() => readingsClient(mode), [mode]);
  const [step, setStep] = useState<Step>("setup");
  const [spreadId, setSpreadId] = useState<SpreadId>("three-card");
  const [category, setCategory] = useState<Category>("general");
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const [reading, setReading] = useState<SavedReading | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [writeFirst, setWriteFirst] = useState(true);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const spread = SPREADS[spreadId];

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  function start(e: React.FormEvent) {
    e.preventDefault();
    if (question.trim().length < 3) {
      setError("Please write your question (at least a few words).");
      return;
    }
    setError(null);
    setPicked([]);
    setStep("shuffling");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setStep("choose"), reduced ? 50 : 1800);
  }

  async function pick(i: number) {
    if (picked.includes(i) || picked.length >= spread.positions.length) return;
    const next = [...picked, i];
    setPicked(next);
    if (next.length < spread.positions.length) return;
    try {
      const { reading } = await client.create({ kind: "question", spread: spreadId, category, question: question.trim(), context: context.trim(), timezone: browserTimeZone(), parentReadingId: parentId });
      setReading(reading);
      setRevealed(0);
      setStep("reveal");
    } catch (e) {
      setPicked([]);
      setError(e instanceof Error ? e.message : "The cards could not be drawn. Please try again.");
    }
  }

  function newPull() {
    setParentId(reading?.id ?? null);
    setReading(null);
    setPicked([]);
    setStep("setup");
  }

  if (step === "result" && reading) {
    return (
      <div className="mx-auto max-w-4xl">
        {parentId && <p className="mb-6 rounded border border-gold/40 p-3 text-sm">This is a new pull, saved as its own reading and linked to the earlier one. The earlier reading's cards are unchanged.</p>}
        <ReadingResult reading={reading} client={client} onNewPull={newPull} />
        <div className="mt-10 text-center">
          <button type="button" className="btn btn-ghost" onClick={newPull}>
            Start a new reading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {mode === "guest" && <p className="mb-6 rounded-lg border border-gold/40 bg-page-sunk/40 p-3 text-sm">Guest mode: readings are saved only in this browser.</p>}

      {step === "setup" && (
        <form onSubmit={start} className="space-y-8" noValidate>
          <div className="text-center">
            <p className="eyebrow">Question reading</p>
            <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-4xl sm:text-5xl">
              Ask the cards
            </h1>
          </div>
          <fieldset>
            <legend className="text-2xl">1. Choose a spread</legend>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {QUESTION_SPREADS.map((id) => {
                const s = SPREADS[id];
                return (
                  <label key={id} className="panel-night block cursor-pointer p-4 has-[:checked]:border-vermilion has-[:checked]:shadow-[inset_0_0_0_2px_var(--color-gold)]">
                    <span className="flex items-center gap-2">
                      <input type="radio" name="spread" value={id} checked={spreadId === id} onChange={() => setSpreadId(id)} />
                      <span className="font-[family-name:var(--font-heading)] text-xl text-vermilion">{s.name}</span>
                    </span>
                    <span className="mt-2 block text-sm text-ink/85">{s.description}</span>
                    <ol className="mt-3 space-y-1 text-sm">
                      {s.positions.map((p, i) => (
                        <li key={p.key}>
                          <strong>
                            {i + 1}. {p.label}:
                          </strong>{" "}
                          <span className="text-ink/80">{p.meaning}</span>
                        </li>
                      ))}
                    </ol>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="panel space-y-5 p-5 sm:p-6">
            <fieldset>
              <legend className="text-2xl">2. Life area</legend>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
                {CATEGORIES.map((c) => (
                  <label key={c} className="flex min-h-11 items-center gap-2 rounded border border-gold-dark/30 px-3 has-[:checked]:border-burgundy has-[:checked]:bg-white/50">
                    <input type="radio" name="category" checked={category === c} onChange={() => setCategory(c)} />
                    {CATEGORY_LABELS[c]}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="q" className="text-2xl">
                3. Your question
              </label>
              <textarea id="q" className="field mt-2" rows={3} maxLength={500} value={question} onChange={(e) => setQuestion(e.target.value)} aria-describedby="q-hint" aria-invalid={Boolean(error)} />
              <p id="q-hint" className="mt-1 text-sm opacity-80">
                Open questions about your own choices work best — e.g. “How can I approach the conversation with my manager?” rather than “Will I get promoted?”. Tarot can't reveal another person's private thoughts.
              </p>
            </div>
            <div>
              <label htmlFor="ctx" className="font-semibold">
                Context you'd like to share <span className="font-normal opacity-70">(optional)</span>
              </label>
              <textarea id="ctx" className="field mt-1" rows={2} maxLength={800} value={context} onChange={(e) => setContext(e.target.value)} aria-describedby="ctx-hint" />
              <p id="ctx-hint" className="mt-1 text-sm opacity-80">
                Only share what you're comfortable with. It is saved with the reading and sent to the AI only if you request an AI interpretation.
              </p>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={writeFirst} onChange={(e) => setWriteFirst(e.target.checked)} />
              Let me write my own interpretation before seeing the app's
            </label>
            {error && (
              <p role="alert" className="font-semibold text-burgundy">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn-primary w-full">
              Shuffle and draw {spread.positions.length} {spread.positions.length === 1 ? "card" : "cards"}
            </button>
          </div>
        </form>
      )}

      {step === "shuffling" && (
        <div className="py-16 text-center">
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl">
            Shuffling…
          </h1>
          <div className="relative mx-auto mt-10 h-48 w-32" aria-hidden="true">
            <div className="shuffle-a absolute inset-0"><CardBack /></div>
            <div className="shuffle-b absolute inset-0"><CardBack /></div>
            <div className="absolute inset-0"><CardBack /></div>
          </div>
        </div>
      )}

      {step === "choose" && (
        <section className="text-center">
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl sm:text-4xl">
            Choose {spread.positions.length} {spread.positions.length === 1 ? "card" : "cards"}
          </h1>
          <ol className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-3" aria-label="Spread positions">
            {spread.positions.map((p, i) => (
              <li key={p.key} className={`rounded-full border px-3 py-1 text-sm ${i < picked.length ? "border-gold bg-gold/20 text-vermilion" : i === picked.length ? "border-vermilion" : "border-gold/30 text-ink/70"}`}>
                {i + 1}. {p.label} {i < picked.length ? "✓" : i === picked.length ? "← next" : ""}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-ink/80" role="status" aria-live="polite">
            {picked.length < spread.positions.length ? `Choose a card for “${spread.positions[picked.length].label}”: ${spread.positions[picked.length].meaning}` : "Drawing your cards…"}
          </p>
          <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-[repeat(13,minmax(0,1fr))]" aria-label="Face-down cards">
            {Array.from({ length: FAN }, (_, i) => (
              <li key={i}>
                <button type="button" onClick={() => pick(i)} disabled={picked.includes(i) || picked.length >= spread.positions.length} aria-label={`Face-down card ${i + 1} of ${FAN}${picked.includes(i) ? ` — chosen for ${spread.positions[picked.indexOf(i)].label}` : ""}`} className={`block aspect-[2/3] w-full transition-transform hover:-translate-y-2 focus-visible:-translate-y-2 disabled:cursor-default ${picked.includes(i) ? "-translate-y-3 opacity-40" : ""}`}>
                  <CardBack />
                </button>
              </li>
            ))}
          </ul>
          {error && (
            <p role="alert" className="mt-6 text-vermilion">
              {error}
            </p>
          )}
        </section>
      )}

      {step === "reveal" && reading && (
        <section className="text-center">
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl">
            Your cards
          </h1>
          <p className="mt-1 text-sm text-ink/80">Turn each card in order.</p>
          <ol className="mt-8 flex flex-wrap justify-center gap-6">
            {reading.cards.map((c, i) => (
              <li key={c.position} className="flex flex-col items-center gap-2">
                <span className="eyebrow">{spread.positions[c.position].label}</span>
                <div className="flip-scene aspect-[2/3] w-32 sm:w-40">
                  <div className="flip-inner" data-flipped={i < revealed}>
                    <button type="button" className="flip-face" disabled={i !== revealed} onClick={() => setRevealed((r) => r + 1)} aria-label={`Turn over the ${spread.positions[c.position].label} card`}>
                      <CardBack />
                    </button>
                    <div className="flip-face flip-face-front" aria-hidden={i >= revealed}>
                      <TarotCard cardId={c.cardId} reversed={c.reversed} size="fluid" />
                    </div>
                  </div>
                </div>
                <span className="min-h-6 text-sm" aria-live="polite">
                  {i < revealed ? `${requireCard(c.cardId).name}${c.reversed ? " (reversed)" : ""}` : ""}
                </span>
              </li>
            ))}
          </ol>
          {revealed >= reading.cards.length && (
            <div className="mx-auto mt-10 max-w-xl text-left">
              {writeFirst ? (
                <div className="panel p-5">
                  <JournalComposer reading={reading} client={client} kind="pre_reveal" label="Your interpretation first" hint="How do these cards answer your question? Consider each position, then how they connect." onSaved={(n) => { setReading((r) => (r ? { ...r, journal: [...r.journal, n] } : r)); setStep("result"); }} />
                  <button type="button" className="mt-3 text-sm underline" onClick={() => setStep("result")}>
                    Skip and show the interpretation
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button type="button" className="btn btn-primary" onClick={() => setStep("result")}>
                    Show the interpretation
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
