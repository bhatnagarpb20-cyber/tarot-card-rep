import { z } from "zod";
import { ApiError, handler, json, parseBody, requireUser } from "@/lib/api";
import { getReading } from "@/lib/readings/server";

type Ctx = { params: Promise<{ id: string }> };
const idSchema = z.string().uuid();

export const GET = handler(async (_req: Request, { params }: Ctx) => {
  const { supabase } = await requireUser();
  const id = idSchema.parse((await params).id);
  // Row-level security guarantees only the owner's reading can be returned.
  const reading = await getReading(supabase, id);
  if (!reading) throw new ApiError(404, "Reading not found.", "not_found");
  return json({ reading });
});

export const PATCH = handler(async (req: Request, { params }: Ctx) => {
  const { supabase } = await requireUser();
  const id = idSchema.parse((await params).id);
  const { bookmarked } = await parseBody(req, z.object({ bookmarked: z.boolean() }));
  const { data, error } = await supabase.from("readings").update({ bookmarked }).eq("id", id).select("id");
  if (error) throw new Error(error.message);
  if (!data?.length) throw new ApiError(404, "Reading not found.", "not_found");
  return json({ ok: true });
});

export const DELETE = handler(async (_req: Request, { params }: Ctx) => {
  const { supabase } = await requireUser();
  const id = idSchema.parse((await params).id);
  const { data, error } = await supabase.from("readings").delete().eq("id", id).select("id");
  if (error) throw new Error(error.message);
  if (!data?.length) throw new ApiError(404, "Reading not found.", "not_found");
  return json({ ok: true });
});
