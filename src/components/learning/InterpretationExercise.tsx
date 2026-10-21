"use client";
import { useId, useState } from "react";
import { requireCard } from "@/content/cards";
import { CATEGORY_LABELS, type Category } from "@/lib/tarot/types";

const SAMPLE_QUESTIONS: Record<Category, string> = {
  love: "What do I need to understand about my current relationship?",
  career: "How should I approach the next step in my work?",
  finances: "What attitude toward money would serve me now?",
  family: "How can I support my family right now?",
  growth: "What is this season of my life asking me to learn?",
  spirituality: "What practice would deepen my sense of meaning?",
  general: "What should I keep in mind this week?",
};

/** Practise applying one card to a sample question, then compare with the reference context meaning. */
export function InterpretationExercise({ cardId }: { cardId: string }) {
  const id = useId();
  const card = requireCard(cardId);
  const [category, setCategory] = useState<Exclude<Category, "spirituality" | "general">>("career");
  const [text, setText] = useState("");
  const [shown, setShown] = useState(false);

  return (
    <section aria-labelledby={`${id}-h`} className="space-y-3">
      <h2 id={`${id}-h`} className="text-2xl">
        Interpretation exercise
      </h2>
      <div>
        <label htmlFor={`${id}-cat`} className="block text-sm font-semibold">
          Imagine you drew {card.name} for a question about…
        </label>
        <select
          id={`${id}-cat`}
          className="field mt-1 sm:w-auto"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as typeof category);
            setShown(false);
          }}
        >
          {(["love", "career", "finances", "family", "growth"] as const).map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>
      <p className="italic">Question: “{SAMPLE_QUESTIONS[category]}”</p>
      <label htmlFor={`${id}-text`} className="block text-sm font-semibold">
        Your interpretation (use the symbols, not only keywords)
      </label>
      <textarea id={`${id}-text`} className="field" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      <button type="button" className="btn btn-primary" onClick={() => setShown(true)}>
        Compare with the reference
      </button>
      {shown && (
        <div role="status" className="rounded border border-gold-dark/40 bg-white/40 p-4">
          <p>
            <strong>Reference meaning in {CATEGORY_LABELS[category].toLowerCase()}:</strong> {card.contexts[category]}
          </p>
          <p className="mt-2">
            <strong>Example:</strong> {card.example}
          </p>
          <p className="mt-2 text-sm">
            {text.trim()
              ? "Compare your reasoning: which symbols did you draw on? Where do you differ from the reference — and can you explain why your reading also fits?"
              : "Try writing your own interpretation first next time; it's the fastest way to build confidence."}
          </p>
        </div>
      )}
    </section>
  );
}
