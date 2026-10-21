import { ApiError, handler, json, parseBody, requireUser } from "@/lib/api";
import { isValidTimeZone } from "@/lib/dates";
import { profileUpdateSchema, type ProfileView } from "@/lib/profile";

export const GET = handler(async () => {
  const { user, supabase } = await requireUser();
  const [{ data: p }, { data: prefs }] = await Promise.all([
    supabase.from("profiles").select("display_name, timezone, onboarded_at").eq("id", user.id).maybeSingle(),
    supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle(),
  ]);
  const view: ProfileView = {
    email: user.email ?? null,
    displayName: p?.display_name ?? "",
    timezone: p?.timezone ?? "UTC",
    onboarded: Boolean(p?.onboarded_at),
    allowReversals: prefs?.allow_reversals ?? true,
    writeBeforeReveal: prefs?.write_before_reveal ?? true,
    aiInterpretations: prefs?.ai_interpretations ?? true,
    defaultCategory: prefs?.default_category ?? "general",
    reducedMotion: prefs?.reduced_motion ?? false,
  };
  return json(view);
});

export const PATCH = handler(async (req: Request) => {
  const { user, supabase } = await requireUser();
  const u = await parseBody(req, profileUpdateSchema);
  if (u.timezone && !isValidTimeZone(u.timezone)) throw new ApiError(400, "Unknown timezone.", "invalid_timezone");
  const profile: Record<string, unknown> = {};
  if (u.displayName !== undefined) profile.display_name = u.displayName || null;
  if (u.timezone) profile.timezone = u.timezone;
  if (u.onboarded) profile.onboarded_at = new Date().toISOString();
  const prefs: Record<string, unknown> = {};
  if (u.allowReversals !== undefined) prefs.allow_reversals = u.allowReversals;
  if (u.writeBeforeReveal !== undefined) prefs.write_before_reveal = u.writeBeforeReveal;
  if (u.aiInterpretations !== undefined) prefs.ai_interpretations = u.aiInterpretations;
  if (u.defaultCategory) prefs.default_category = u.defaultCategory;
  if (u.reducedMotion !== undefined) prefs.reduced_motion = u.reducedMotion;
  if (Object.keys(profile).length) {
    const { error } = await supabase.from("profiles").update(profile).eq("id", user.id);
    if (error) throw new Error(error.message);
  }
  if (Object.keys(prefs).length) {
    const { error } = await supabase.from("user_preferences").update(prefs).eq("user_id", user.id);
    if (error) throw new Error(error.message);
  }
  return json({ ok: true });
});
