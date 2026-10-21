import { NextResponse } from "next/server";
import { handler, requireUser } from "@/lib/api";

const TABLES = ["profiles", "user_preferences", "readings", "reading_cards", "interpretation_snapshots", "reading_followups", "reading_feedback", "journal_entries", "learning_progress", "quiz_attempts", "practice_exercises", "shared_readings", "ai_usage"] as const;

/** Downloads everything stored about the signed-in user as JSON. RLS limits each query to their rows. */
export const GET = handler(async () => {
  const { user, supabase } = await requireUser();
  const out: Record<string, unknown> = { exportedAt: new Date().toISOString(), account: { id: user.id, email: user.email } };
  for (const t of TABLES) {
    const { data, error } = await supabase.from(t).select("*");
    if (error) throw new Error(`${t}: ${error.message}`);
    out[t] = data;
  }
  return new NextResponse(JSON.stringify(out, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="daily-arcana-export-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
});
