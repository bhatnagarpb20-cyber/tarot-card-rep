import { handler, json, parseBody, requireUser } from "@/lib/api";
import { addJournal } from "@/lib/readings/server";
import { journalInputSchema } from "@/lib/readings/types";

/** Free journal entries (not attached to a reading). */
export const GET = handler(async () => {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("journal_entries").select("id, kind, body, resonance, created_at").is("reading_id", null).order("created_at", { ascending: false }).limit(500);
  if (error) throw new Error(error.message);
  return json({ notes: data.map((n) => ({ id: n.id, kind: n.kind, body: n.body, resonance: n.resonance, createdAt: n.created_at })) });
});

export const POST = handler(async (req: Request) => {
  const { user, supabase } = await requireUser();
  const input = await parseBody(req, journalInputSchema);
  return json({ note: await addJournal(supabase, user.id, null, input) }, 201);
});
