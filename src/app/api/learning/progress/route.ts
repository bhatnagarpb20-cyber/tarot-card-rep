import { ApiError, handler, json, parseBody, requireUser } from "@/lib/api";
import { getLesson } from "@/content/academy";
import { progressInputSchema } from "@/lib/learning/types";

export const POST = handler(async (req: Request) => {
  const { user, supabase } = await requireUser();
  const input = await parseBody(req, progressInputSchema);
  if (!getLesson(input.lessonId)) throw new ApiError(404, "Unknown lesson.", "not_found");
  const { data: existing } = await supabase.from("learning_progress").select("status").eq("lesson_id", input.lessonId).maybeSingle();
  if (existing?.status === "completed" && input.status === "started") return json({ ok: true });
  const { error } = await supabase.from("learning_progress").upsert({
    user_id: user.id,
    lesson_id: input.lessonId,
    status: input.status,
    completed_at: input.status === "completed" ? new Date().toISOString() : null,
  });
  if (error) throw new Error(error.message);
  return json({ ok: true });
});
