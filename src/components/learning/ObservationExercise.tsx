"use client";
import { useId, useMemo, useState } from "react";
import { requireCard } from "@/content/cards";
import { compareObservations, OBSERVATION_PROMPTS, type Observations } from "@/lib/academy/observation";
import { learningClient } from "@/lib/learning/client";
import { useStorageMode } from "@/components/session/SessionContext";

/**
 * The systematic observation exercise: the learner answers eight questions about the image before
 * seeing the reference symbolism, then sees which documented symbols they noticed.
 */
export function ObservationExercise({ cardId, question = "", onDone }: { cardId: string; question?: string; onDone?: (obs: Observations) => void }) {
  const id = useId();
  const card = requireCard(cardId);
  const mode = useStorageMode();
  const client = useMemo(() => learningClient(mode), [mode]);
  const [obs, setObs] = useState<Observations>({});
  const [revealed, setRevealed] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saved" | "error">("idle");
  const feedback = revealed ? compareObservations(card, obs) : null;

  async function reveal(e: React.FormEvent) {
    e.preventDefault();
    setRevealed(true);
    onDone?.(obs);
    const fb = compareObservations(card, obs);
    if (Object.values(obs).some((v) => v?.trim())) {
      try {
        await client.addPractice({
          difficulty: "beginner",
          category: "general",
          cards: [{ cardId, reversed: false, position: 0 }],
          observations: Object.fromEntries(Object.entries(obs).filter(([, v]) => v)) as Record<string, string>,
          interpretation: "",
          feedback: { noticed: fb.noticed.map((s) => s.element), notYet: fb.notYet.map((s) => s.element) },
        });
        setSaved("saved");
      } catch {
        setSaved("error");
      }
    }
  }

  return (
    <form onSubmit={reveal} className="space-y-4" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="text-2xl">
        Guided observation
      </h2>
      <p className="text-sm">Look at the card before reading its meaning. Answer as many questions as you like — there are no wrong observations.</p>
      {question && <p className="text-sm italic">Your question: “{question}”</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {OBSERVATION_PROMPTS.map((p) => (
          <div key={p.key}>
            <label htmlFor={`${id}-${p.key}`} className="block text-sm font-semibold">
              {p.label}
            </label>
            <textarea id={`${id}-${p.key}`} rows={2} maxLength={2000} className="field mt-1" disabled={revealed} value={obs[p.key] ?? ""} onChange={(e) => setObs((o) => ({ ...o, [p.key]: e.target.value }))} />
          </div>
        ))}
      </div>
      {!revealed ? (
        <button type="submit" className="btn btn-primary">
          Reveal the reference symbolism
        </button>
      ) : (
        feedback && (
          <div role="status" aria-live="polite" className="space-y-4 rounded border border-line bg-white/40 p-4">
            <p className="font-semibold">{feedback.encouragement}</p>
            {feedback.noticed.length > 0 && (
              <div>
                <h3 className="text-lg text-hot">Traditional symbols you noticed</h3>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {feedback.noticed.map((s) => (
                    <li key={s.element}>
                      <strong>{s.element}:</strong> {s.meaning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {feedback.notYet.length > 0 && (
              <div>
                <h3 className="text-lg text-hot">Symbols to look for next time</h3>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {feedback.notYet.map((s) => (
                    <li key={s.element}>
                      <strong>{s.element}:</strong> {s.meaning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm">
              Observations outside this list can still be meaningful — tarot imagery invites more than one reading. What matters is that you can explain how what you see connects to your question.
            </p>
            <p className="text-xs opacity-75">{saved === "saved" ? "Saved to your practice history." : saved === "error" ? "Couldn't save this exercise." : ""}</p>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setRevealed(false);
                setObs({});
                setSaved("idle");
              }}
            >
              Start again
            </button>
          </div>
        )
      )}
    </form>
  );
}
