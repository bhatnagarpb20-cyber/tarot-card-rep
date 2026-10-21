import { ApiError, handler, json, requireUser } from "@/lib/api";
import { getPrefs, getReadingsForDate } from "@/lib/readings/server";
import { isValidTimeZone, localDateISO } from "@/lib/dates";

/** Today's saved daily card (and any extra pulls) for the user's timezone. */
export const GET = handler(async (req: Request) => {
  const { user, supabase } = await requireUser();
  const tz = new URL(req.url).searchParams.get("tz") ?? "UTC";
  if (!isValidTimeZone(tz)) throw new ApiError(400, "Unknown timezone.", "invalid_timezone");
  const localDate = localDateISO(tz);
  const [today, prefs] = await Promise.all([getReadingsForDate(supabase, localDate), getPrefs(supabase, user.id)]);
  return json({ localDate, ...today, prefs });
});
