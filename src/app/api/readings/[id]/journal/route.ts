import { z } from "zod";
import { ApiError, handler, json, parseBody, requireUser } from "@/lib/api";
import { addJournal } from "@/lib/readings/server";
import { journalInputSchema } from "@/lib/readings/types";

type Ctx = { params: Promise<{ id: string }> };

/** Add a journal note (e.g. the user's own interpretation) to one of their readings. */
export const POST = handler(async (req: Request, { params }: Ctx) => {
  const { user, supabase } = await requireUser();
  const id = z.string().uuid().parse((await params).id);
  const input = await parseBody(req, journalInputSchema);
  // RLS would reject a note on someone else's reading anyway; check first for a clear 404.
  const { data: reading } = await supabase.from("readings").select("id").eq("id", id).maybeSingle();
  if (!reading) throw new ApiError(404, "Reading not found.", "not_found");
  const note = await addJournal(supabase, user.id, id, input);
  return json({ note }, 201);
});
