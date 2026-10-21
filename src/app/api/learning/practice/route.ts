import { handler, json, parseBody, requireUser } from "@/lib/api";
import { practiceInputSchema } from "@/lib/learning/types";

export const POST = handler(async (req: Request) => {
  const { user, supabase } = await requireUser();
  const p = await parseBody(req, practiceInputSchema);
  const { error } = await supabase.from("practice_exercises").insert({ user_id: user.id, difficulty: p.difficulty, category: p.category, cards: p.cards, observations: p.observations, interpretation: p.interpretation || null, feedback: p.feedback });
  if (error) throw new Error(error.message);
  return json({ ok: true }, 201);
});
