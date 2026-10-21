import { z } from "zod";
import { handler, json, parseBody, requireUser } from "@/lib/api";
import { addJournal } from "@/lib/readings/server";
import { journalInputSchema } from "@/lib/readings/types";

type Ctx = { params: Promise<{ id: string }> };

/** Add a journal note (e.g. the user's own interpretation) to one of their readings. */
export const POST = handler(async (req: Request, { params }: Ctx) => {
  const { user, supabase } = await requireUser();
  const id = z.string().uuid().parse((await params).id);
  const input = await parseBody(req, journalInputSchema);
  const note = await addJournal(supabase, user.id, id, input);
  return json({ note }, 201);
});
