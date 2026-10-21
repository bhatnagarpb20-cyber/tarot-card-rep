import { handler, json, parseBody, requireUser } from "@/lib/api";
import { createAccountReading, listReadings } from "@/lib/readings/server";
import { createReadingSchema } from "@/lib/readings/types";
import { CATEGORIES } from "@/lib/tarot/types";

/** List the signed-in user's readings (newest first). */
export const GET = handler(async (req: Request) => {
  const { supabase } = await requireUser();
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const readings = await listReadings(supabase, {
    limit: Math.min(Number(url.searchParams.get("limit")) || 50, 200),
    category: category && (CATEGORIES as readonly string[]).includes(category) ? category : undefined,
    bookmarked: url.searchParams.get("bookmarked") === "1",
  });
  return json({ readings });
});

/** Draw and save a new reading. The server performs the random draw. */
export const POST = handler(async (req: Request) => {
  const { user, supabase } = await requireUser();
  const input = await parseBody(req, createReadingSchema);
  const result = await createAccountReading(supabase, user.id, input);
  return json(result, result.existing ? 200 : 201);
});
