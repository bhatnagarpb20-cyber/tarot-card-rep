"use client";
import { useId, useMemo, useState } from "react";
import type { QuizQuestion } from "@/content/academy/types";
import { learningClient } from "@/lib/learning/client";
import { useStorageMode } from "@/components/session/SessionContext";

/** Multiple-choice knowledge check. Records the attempt to the user's learning history. */
export function Quiz({ questions, subjectType, subjectId, title = "Knowledge check" }: { questions: QuizQuestion[]; subjectType: "lesson" | "card"; subjectId: string; title?: string }) {
  const id = useId();
  const mode = useStorageMode();
  const client = useMemo(() => learningClient(mode), [mode]);
  const [answers, setAnswers] = useState<number[]>(() => questions.map(() => -1));
  const [submitted, setSubmitted] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [missing, setMissing] = useState(false);
  const score = answers.reduce((n, a, i) => n + (a === questions[i].answerIndex ? 1 : 0), 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (answers.some((a) => a < 0)) {
      setMissing(true);
      return;
    }
    setMissing(false);
    setSubmitted(true);
    try {
      await client.addQuiz({ subjectType, subjectId, score, total: questions.length, answers });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function reset() {
    setAnswers(questions.map(() => -1));
    setSubmitted(false);
    setSaveState("idle");
  }

  return (
    <form onSubmit={submit} aria-labelledby={`${id}-title`} className="space-y-6" noValidate>
      <h2 id={`${id}-title`} className="text-2xl">
        {title}
      </h2>
      {questions.map((q, qi) => {
        const correct = answers[qi] === q.answerIndex;
        return (
          <fieldset key={q.question} className="space-y-2" aria-describedby={submitted ? `${id}-exp-${qi}` : undefined}>
            <legend className="font-semibold">
              {qi + 1}. {q.question}
            </legend>
            {q.options.map((opt, oi) => (
              <label key={opt} className={`flex min-h-11 items-start gap-3 rounded border px-3 py-2 ${submitted && oi === q.answerIndex ? "border-sage bg-sage/15" : submitted && answers[qi] === oi ? "border-burgundy bg-burgundy/10" : "border-gold-dark/30"}`}>
                <input type="radio" className="mt-1.5" name={`${id}-q${qi}`} checked={answers[qi] === oi} disabled={submitted} onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))} />
                <span>
                  {opt}
                  {submitted && oi === q.answerIndex && <span className="ml-2 text-sm font-semibold">(correct answer)</span>}
                  {submitted && answers[qi] === oi && oi !== q.answerIndex && <span className="ml-2 text-sm font-semibold">(your answer)</span>}
                </span>
              </label>
            ))}
            {submitted && (
              <p id={`${id}-exp-${qi}`} className="text-sm">
                <strong>{correct ? "Correct. " : "Not quite. "}</strong>
                {q.explanation}
              </p>
            )}
          </fieldset>
        );
      })}
      {missing && (
        <p role="alert" className="font-semibold text-burgundy">
          Please answer every question before checking.
        </p>
      )}
      {!submitted ? (
        <button type="submit" className="btn btn-primary">
          Check my answers
        </button>
      ) : (
        <div role="status" aria-live="polite" className="space-y-2">
          <p className="text-lg font-semibold">
            You scored {score} of {questions.length}.
          </p>
          <p className="text-sm">
            {saveState === "saved" && (mode === "account" ? "Saved to your learning history." : "Saved in this browser.")}
            {saveState === "error" && "Your score couldn't be saved, but your answers are shown above."}
          </p>
          <button type="button" className="btn btn-ghost" onClick={reset}>
            Try again
          </button>
        </div>
      )}
    </form>
  );
}
