"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { requireCard } from "@/content/cards";
import { drawCards } from "@/lib/tarot/draw";
import { SPREADS } from "@/lib/tarot/spreads";
import { buildReferenceInterpretation } from "@/lib/interpret/reference";
import { buildCardQuiz } from "@/lib/academy/card-quiz";
import { DIFFICULTIES, practiceFeedback, type Difficulty, type PracticeFeedback } from "@/lib/academy/practice-feedback";
import { learningClient } from "@/lib/learning/client";
import { CATEGORIES, CATEGORY_LABELS, type Category, type DrawnCard } from "@/lib/tarot/types";
import { TarotCard } from "@/components/cards/TarotCard";
import { InterpretationView } from "@/components/reading/InterpretationView";
import { useStorageMode } from "@/components/session/SessionContext";
import { ObservationExercise } from "./ObservationExercise";
import { Quiz } from "./Quiz";

export function PracticeMode() {
  const mode = useStorageMode();
  const client = useMemo(() => learningClient(mode), [mode]);
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [category, setCategory] = useState<Category>("career");
  const [allowReversals, setAllowReversals] = useState(false);
  const [cards, setCards] = useState<DrawnCard[] | null>(null);
  const [question, setQuestion] = useState("");
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<PracticeFeedback | null>(null);
  const [saved, setSaved] = useState<"idle" | "saved" | "error">("idle");

  function draw() {
    const spreadSize = DIFFICULTIES[difficulty].cards;
    setCards(drawCards(spreadSize, { allowReversals }));
    setText("");
    setFeedback(null);
    setSaved("idle");
    setQuestion(difficulty === "beginner" ? "" : defaultQuestion(category));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!cards) return;
    const fb = practiceFeedback(cards, text, difficulty);
    setFeedback(fb);
    try {
      await client.addPractice({ difficulty, category, cards, observations: { question }, interpretation: text, feedback: { strengths: fb.strengths, suggestions: fb.suggestions } });
      setSaved("saved");
    } catch {
      setSaved("error");
    }
  }

  const spread = difficulty === "advanced" ? SPREADS["three-card"] : SPREADS["one-card"];
  const reference = cards && feedback ? buildReferenceInterpretation({ spread: spread.id, category, question, context: "", cards }) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <form
        className="panel space-y-5 p-5 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          draw();
        }}
      >
        <fieldset>
          <legend className="text-2xl">Difficulty</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {(Object.keys(DIFFICULTIES) as Difficulty[]).map((d) => (
              <label key={d} className="block rounded border border-line p-3 has-[:checked]:border-hot has-[:checked]:bg-white/50">
                <span className="flex items-center gap-2 font-semibold">
                  <input type="radio" name="difficulty" checked={difficulty === d} onChange={() => setDifficulty(d)} />
                  {DIFFICULTIES[d].label}
                </span>
                <span className="mt-1 block text-sm">{DIFFICULTIES[d].goal}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {difficulty !== "beginner" && (
          <label className="block">
            <span className="font-semibold">Question category</span>
            <select className="field mt-1" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={allowReversals} onChange={(e) => setAllowReversals(e.target.checked)} />
          Include reversed cards
        </label>
        <button type="submit" className="btn btn-primary">
          {cards ? "Draw new practice cards" : "Draw practice cards"}
        </button>
      </form>

      {cards && difficulty === "beginner" && (
        <div className="space-y-8">
          <div className="flex justify-center">
            <TarotCard cardId={cards[0].cardId} reversed={cards[0].reversed} size="lg" />
          </div>
          <div className="panel p-5 sm:p-8">
            <ObservationExercise key={cards[0].cardId} cardId={cards[0].cardId} />
          </div>
          <div className="panel p-5 sm:p-8">
            <Quiz key={`q-${cards[0].cardId}`} questions={buildCardQuiz(requireCard(cards[0].cardId))} subjectType="card" subjectId={cards[0].cardId} title={`Keywords check: ${requireCard(cards[0].cardId).name}`} />
          </div>
        </div>
      )}

      {cards && difficulty !== "beginner" && (
        <form onSubmit={submit} className="space-y-6">
          <ol className="flex flex-wrap justify-center gap-6">
            {cards.map((c) => (
              <li key={c.position} className="text-center">
                <span className="eyebrow">{spread.positions[c.position].label}</span>
                <TarotCard cardId={c.cardId} reversed={c.reversed} size="md" className="mt-2" />
                <span className="mt-1 block text-sm">
                  {requireCard(c.cardId).name}
                  {c.reversed ? " (reversed)" : ""}
                </span>
              </li>
            ))}
          </ol>
          <div className="panel space-y-3 p-5">
            <label htmlFor="pq" className="block font-semibold">
              Practice question
            </label>
            <input id="pq" className="field" value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={300} />
            <label htmlFor="pi" className="block font-semibold">
              Your interpretation {difficulty === "advanced" && "(cover each position and how the cards relate)"}
            </label>
            <textarea id="pi" className="field" rows={7} value={text} onChange={(e) => setText(e.target.value)} maxLength={10000} disabled={Boolean(feedback)} />
            {!feedback && (
              <button type="submit" className="btn btn-primary">
                Submit and reveal the reference
              </button>
            )}
          </div>
        </form>
      )}

      {feedback && reference && (
        <div className="space-y-6" role="region" aria-label="Practice feedback">
          <section className="panel-night p-5">
            <h2 className="text-2xl">Feedback on your reasoning</h2>
            {feedback.strengths.length > 0 && (
              <>
                <h3 className="mt-3 text-lg text-hot">What worked well</h3>
                <ul className="mt-1 list-disc space-y-1 pl-5">{feedback.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
              </>
            )}
            {feedback.suggestions.length > 0 && (
              <>
                <h3 className="mt-3 text-lg text-hot">To consider next time</h3>
                <ul className="mt-1 list-disc space-y-1 pl-5">{feedback.suggestions.map((s) => <li key={s}>{s}</li>)}</ul>
              </>
            )}
            <p className="mt-3 text-sm text-cream/80">Several interpretations can be reasonable. Compare your reasoning with the reference below — differences are worth thinking about, not mistakes to fix.</p>
            <p className="mt-2 text-xs text-cream/70">{saved === "saved" ? "Saved to your practice history." : saved === "error" ? "Couldn't save this exercise." : ""}</p>
          </section>
          <InterpretationView snapshot={{ interpretation: reference, generator: "reference", contentVersion: "", createdAt: "" }} headingLevel="h2" />
          <p className="text-center text-sm">
            Want to go deeper? Study {cards!.map((c, i) => (
              <span key={c.cardId}>
                {i > 0 && ", "}
                <Link href={`/deck/${c.cardId}`}>{requireCard(c.cardId).name}</Link>
              </span>
            ))}.
          </p>
        </div>
      )}
    </div>
  );
}

function defaultQuestion(category: Category): string {
  return {
    love: "How can I nurture my closest relationship this month?",
    career: "What should I focus on in my work right now?",
    finances: "What would help me feel more secure with money?",
    family: "How can I support my family at the moment?",
    growth: "What is this season of life asking me to learn?",
    spirituality: "What practice would bring me more meaning?",
    general: "What should I keep in mind this week?",
  }[category];
}
