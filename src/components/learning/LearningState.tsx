"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { learningClient } from "@/lib/learning/client";
import type { LearningState } from "@/lib/learning/types";
import { useStorageMode } from "@/components/session/SessionContext";

interface Ctx {
  state: LearningState | null;
  error: string | null;
  complete: (lessonId: string) => Promise<void>;
  start: (lessonId: string) => Promise<void>;
}

const LearningContext = createContext<Ctx | null>(null);

export function LearningStateProvider({ children }: { children: React.ReactNode }) {
  const mode = useStorageMode();
  const client = useMemo(() => learningClient(mode), [mode]);
  const [state, setState] = useState<LearningState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client.state().then(setState).catch((e) => setError(e instanceof Error ? e.message : "Could not load progress."));
  }, [client]);

  const set = useCallback(
    async (lessonId: string, status: "started" | "completed") => {
      await client.setProgress({ lessonId, status });
      setState((s) => {
        const base = s ?? { progress: {}, quizAttempts: [], practice: [] };
        if (base.progress[lessonId]?.status === "completed" && status === "started") return base;
        return { ...base, progress: { ...base.progress, [lessonId]: { status, completedAt: status === "completed" ? new Date().toISOString() : null } } };
      });
    },
    [client],
  );

  const value = useMemo<Ctx>(() => ({ state, error, complete: (id) => set(id, "completed"), start: (id) => set(id, "started") }), [state, error, set]);
  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning(): Ctx {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error("useLearning must be used inside LearningStateProvider");
  return ctx;
}

export function LessonStatus({ lessonId }: { lessonId: string }) {
  const { state } = useLearning();
  const s = state?.progress[lessonId]?.status;
  const pill = "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold";
  if (!s) return <span className={`${pill} border-cream/25 text-cream/75`}>Not started</span>;
  if (s === "completed") return <span className={`${pill} border-teal/60 bg-teal/10 text-teal`}>✓ Completed</span>;
  return (
    <span className={`${pill} border-hot/60 bg-hot/10 text-hot`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-hot" />
      In progress
    </span>
  );
}

export function CourseProgress({ lessonIds }: { lessonIds: string[] }) {
  const { state } = useLearning();
  const done = lessonIds.filter((id) => state?.progress[id]?.status === "completed").length;
  const pct = Math.round((done / lessonIds.length) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm text-cream/80">
        <span>
          {done} of {lessonIds.length} lessons completed
        </span>
        <span className="font-semibold text-cream">{pct}%</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cream/10 ring-1 ring-cream/15" role="progressbar" aria-valuemin={0} aria-valuemax={lessonIds.length} aria-valuenow={done} aria-label="Course progress">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-hot),var(--color-sun),var(--color-acid))]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function MarkLessonComplete({ lessonId }: { lessonId: string }) {
  const { state, complete, start } = useLearning();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const done = state?.progress[lessonId]?.status === "completed";
  useEffect(() => {
    if (state && !state.progress[lessonId]) start(lessonId).catch(() => undefined);
  }, [state, lessonId, start]);
  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        disabled={done || busy}
        onClick={async () => {
          setBusy(true);
          try {
            await complete(lessonId);
            setErr(null);
          } catch (e) {
            setErr(e instanceof Error ? e.message : "Couldn't save progress.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {done ? "✓ Lesson completed" : busy ? "Saving…" : "Mark lesson complete"}
      </button>
      {err && <p role="alert" className="mt-2 text-sm">{err}</p>}
    </div>
  );
}
