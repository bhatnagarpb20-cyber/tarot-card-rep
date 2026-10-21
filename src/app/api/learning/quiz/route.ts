import { handler, json, parseBody, requireUser } from "@/lib/api";
import { quizInputSchema } from "@/lib/learning/types";

export const POST = handler(async (req: Request) => {
  const { user, supabase } = await requireUser();
  const q = await parseBody(req, quizInputSchema);
  const { error } = await supabase.from("quiz_attempts").insert({ user_id: user.id, subject_type: q.subjectType, subject_id: q.subjectId, score: q.score, total: q.total, answers: q.answers });
  if (error) throw new Error(error.message);
  return json({ ok: true }, 201);
});
