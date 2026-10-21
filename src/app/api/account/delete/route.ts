import { z } from "zod";
import { ApiError, handler, json, parseBody, requireUser } from "@/lib/api";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Permanently deletes the signed-in user's account. All their rows are removed by ON DELETE
 * CASCADE from auth.users. Requires typing DELETE to confirm.
 */
export const POST = handler(async (req: Request) => {
  const { user, supabase } = await requireUser();
  await parseBody(req, z.object({ confirm: z.literal("DELETE") }));
  const admin = createSupabaseAdminClient();
  if (!admin) throw new ApiError(503, "Account deletion is not configured on this server (missing service role key). Please contact the site owner.", "not_configured");
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw new Error(error.message);
  await supabase.auth.signOut();
  return json({ ok: true });
});
