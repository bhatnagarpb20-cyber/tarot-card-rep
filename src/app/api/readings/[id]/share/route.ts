import { z } from "zod";
import { ApiError, handler, json, parseBody, requireUser } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };
const idOf = async (params: Ctx["params"]) => z.string().uuid().parse((await params).id);

/** Active share link for one of the user's readings, if any. */
export const GET = handler(async (_req: Request, { params }: Ctx) => {
  const { supabase } = await requireUser();
  const id = await idOf(params);
  const { data, error } = await supabase.from("shared_readings").select("token, include_question, include_interpretation, created_at").eq("reading_id", id).is("revoked_at", null).maybeSingle();
  if (error) throw new Error(error.message);
  return json({ share: data });
});

export const POST = handler(async (req: Request, { params }: Ctx) => {
  const { user, supabase } = await requireUser();
  const id = await idOf(params);
  const { includeQuestion, includeInterpretation } = await parseBody(req, z.object({ includeQuestion: z.boolean().default(false), includeInterpretation: z.boolean().default(false) }));
  const { data: reading } = await supabase.from("readings").select("id").eq("id", id).maybeSingle();
  if (!reading) throw new ApiError(404, "Reading not found.", "not_found");
  await supabase.from("shared_readings").update({ revoked_at: new Date().toISOString() }).eq("reading_id", id).is("revoked_at", null);
  const { data, error } = await supabase.from("shared_readings").insert({ reading_id: id, user_id: user.id, include_question: includeQuestion, include_interpretation: includeInterpretation }).select("token, include_question, include_interpretation, created_at").single();
  if (error) throw new Error(error.message);
  return json({ share: data }, 201);
});

export const DELETE = handler(async (_req: Request, { params }: Ctx) => {
  const { supabase } = await requireUser();
  const id = await idOf(params);
  const { error } = await supabase.from("shared_readings").update({ revoked_at: new Date().toISOString() }).eq("reading_id", id).is("revoked_at", null);
  if (error) throw new Error(error.message);
  return json({ ok: true });
});
