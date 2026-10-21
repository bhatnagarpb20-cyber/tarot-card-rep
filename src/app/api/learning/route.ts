import { handler, json, requireUser } from "@/lib/api";
import type { LearningState } from "@/lib/learning/types";

/** The signed-in user's learning progress, quiz attempts and practice history. */
export const GET = handler(async () => {
  const { supabase } = await requireUser();
  const [progress, quizzes, practice] = await Promise.all([
    supabase.from("learning_progress").select("lesson_id, status, completed_at"),
    supabase.from("quiz_attempts").select("id, subject_type, subject_id, score, total, answers, created_at").order("created_at", { ascending: false }).limit(200),
    supabase.from("practice_exercises").select("id, difficulty, category, cards, observations, interpretation, feedback, created_at").order("created_at", { ascending: false }).limit(100),
  ]);
  for (const r of [progress, quizzes, practice]) if (r.error) throw new Error(r.error.message);
  const state: LearningState = {
    progress: Object.fromEntries((progress.data ?? []).map((p) => [p.lesson_id, { status: p.status, completedAt: p.completed_at }])),
    quizAttempts: (quizzes.data ?? []).map((q) => ({ id: q.id, subjectType: q.subject_type, subjectId: q.subject_id, score: q.score, total: q.total, answers: q.answers, createdAt: q.created_at })),
    practice: (practice.data ?? []).map((p) => ({ id: p.id, difficulty: p.difficulty, category: p.category, cards: p.cards, observations: p.observations, interpretation: p.interpretation ?? "", feedback: p.feedback, createdAt: p.created_at })),
  };
  return json(state);
});
