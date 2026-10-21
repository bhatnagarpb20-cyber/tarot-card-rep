"use client";
import { useId, useState } from "react";
import type { InterpretationSnapshot } from "@/lib/interpret/schema";
import type { ReadingsClient } from "@/lib/readings/client";
import { ClientApiError } from "@/lib/readings/client";
import type { FollowUp, JournalNote, SavedReading } from "@/lib/readings/types";

const RESONANCE = [
  { value: "resonated", label: "Resonated" },
  { value: "partly", label: "Partly" },
  { value: "did_not", label: "Didn't resonate" },
] as const;

export function JournalComposer({
  reading,
  client,
  kind,
  label,
  hint,
  onSaved,
  withResonance = false,
}: {
  reading: SavedReading;
  client: ReadingsClient;
  kind: JournalNote["kind"];
  label: string;
  hint?: string;
  onSaved: (note: JournalNote) => void;
  withResonance?: boolean;
}) {
  const id = useId();
  const [body, setBody] = useState("");
  const [resonance, setResonance] = useState<JournalNote["resonance"]>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) {
      setError("Write something before saving.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    setError(null);
    try {
      const note = await client.addJournal(reading.id, { kind, body, resonance });
      onSaved(note);
      setBody("");
      setStatus("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your note.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={save} className="space-y-3" noValidate>
      <label htmlFor={id} className="block font-semibold">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm opacity-80">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          if (status !== "idle") setStatus("idle");
        }}
        rows={5}
        maxLength={20000}
        aria-describedby={[hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}
        aria-invalid={status === "error"}
        className="field"
      />
      {withResonance && (
        <fieldset>
          <legend className="text-sm font-semibold">Did this reading resonate? (optional)</legend>
          <div className="mt-1 flex flex-wrap gap-3">
            {RESONANCE.map((r) => (
              <label key={r.value} className="inline-flex min-h-11 items-center gap-2">
                <input type="radio" name={`${id}-resonance`} value={r.value} checked={resonance === r.value} onChange={() => setResonance(r.value)} />
                {r.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save to journal"}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status === "saved" && "Saved to your journal."}
        </p>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-semibold text-hot">
          {error}
        </p>
      )}
    </form>
  );
}

export function SavedNotes({ notes }: { notes: JournalNote[] }) {
  if (!notes.length) return null;
  const labels: Record<JournalNote["kind"], string> = { pre_reveal: "Your first impressions (written before the interpretation)", reflection: "Your reflection", free: "Note", practice: "Practice notes" };
  return (
    <ul className="space-y-3">
      {notes.map((n) => (
        <li key={n.id} className="rounded-xl border border-line bg-cream/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-hot">{labels[n.kind]}</p>
          <p className="mt-1 whitespace-pre-wrap">{n.body}</p>
          <p className="mt-1 text-xs opacity-70">
            {new Date(n.createdAt).toLocaleString()}
            {n.resonance && ` · ${RESONANCE.find((r) => r.value === n.resonance)?.label}`}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Lets the user request an AI interpretation; explains clearly when it is unavailable. */
export function AiRequest({ reading, client, available, onSnapshot }: { reading: SavedReading; client: ReadingsClient; available: { ok: boolean; reason: string | null }; onSnapshot: (s: InterpretationSnapshot) => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const hasAi = reading.snapshots.some((s) => s.interpretation.source === "ai");
  if (hasAi) return null;

  if (!available.ok) {
    return (
      <div className="panel-night p-4 text-sm">
        <p className="font-semibold text-hot">AI interpretation unavailable</p>
        <p className="mt-1 text-cream/85">{available.reason}</p>
      </div>
    );
  }

  async function request() {
    setStatus("loading");
    setMessage(null);
    try {
      onSnapshot(await client.requestAi(reading));
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof ClientApiError || e instanceof Error ? e.message : "The AI interpretation failed.");
    }
  }

  return (
    <div className="panel-night p-4">
      <p className="text-sm text-cream/85">
        Want a deeper reading tailored to your question? The AI uses the same cards, positions and the card library — it cannot change your cards.
      </p>
      <button type="button" className="btn btn-primary mt-3" onClick={request} disabled={status === "loading"} aria-describedby="ai-status">
        {status === "loading" ? "Interpreting… (this can take up to a minute)" : "Get a detailed AI interpretation"}
      </button>
      <p id="ai-status" role="status" aria-live="polite" className="mt-2 text-sm text-hot">
        {status === "error" && `${message} Your reference reading above is still complete.`}
      </p>
    </div>
  );
}

/** Follow-up questions about the same cards. Never redraws silently. */
export function FollowUpPanel({ reading, client, available, onAdded, onNewPull }: { reading: SavedReading; client: ReadingsClient; available: boolean; onAdded: (f: FollowUp) => void; onNewPull?: () => void }) {
  const id = useId();
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (question.trim().length < 3) {
      setError("Please write a question.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      onAdded(await client.followUp(reading, question.trim()));
      setQuestion("");
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not answer the follow-up.");
      setStatus("error");
    }
  }

  return (
    <section aria-labelledby={`${id}-h`} className="space-y-4">
      <h3 id={`${id}-h`} className="text-2xl">
        Follow-up questions
      </h3>
      <p className="text-sm opacity-85">Follow-ups are answered from the cards already in this reading. If a question genuinely needs a new card, we'll say so — the cards are never swapped behind the scenes.</p>
      {reading.followUps.map((f) => (
        <div key={f.id} className="rounded border border-line p-3">
          <p className="font-semibold">You asked: {f.question}</p>
          <p className="mt-2 whitespace-pre-wrap">{f.answer.text}</p>
          {f.answer.needsNewPull && (
            <p className="mt-2 text-sm">
              This question would be better served by a new pull.{" "}
              {onNewPull && (
                <button type="button" className="underline" onClick={onNewPull}>
                  Start a new, separately saved reading
                </button>
              )}
            </p>
          )}
        </div>
      ))}
      {available ? (
        <form onSubmit={ask} className="space-y-2" noValidate>
          <label htmlFor={id} className="block font-semibold">
            Ask about these cards
          </label>
          <input id={id} className="field-night" value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={500} aria-invalid={status === "error"} />
          <button type="submit" className="btn btn-ghost" disabled={status === "loading"}>
            {status === "loading" ? "Thinking…" : "Ask follow-up"}
          </button>
          {error && (
            <p role="alert" className="text-sm text-hot">
              {error}
            </p>
          )}
        </form>
      ) : (
        <p className="text-sm opacity-80">AI follow-ups are not available right now. Try exploring each card's page for more depth.</p>
      )}
    </section>
  );
}
