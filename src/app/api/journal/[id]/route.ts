import { z } from "zod";
import { ApiError, handler, json, requireUser } from "@/lib/api";

export const DELETE = handler(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { supabase } = await requireUser();
  const id = z.string().uuid().parse((await params).id);
  const { data, error } = await supabase.from("journal_entries").delete().eq("id", id).select("id");
  if (error) throw new Error(error.message);
  if (!data?.length) throw new ApiError(404, "Entry not found.", "not_found");
  return json({ ok: true });
});
