import { z } from "zod";
import { ApiError, handler, json, requireUser } from "@/lib/api";
import { aiInterpretation, requestFromReading } from "@/lib/ai/service";
import { AiUnavailableError } from "@/lib/ai/provider";
import { addSnapshot, getPrefs, getReading } from "@/lib/readings/server";

type Ctx = { params: Promise<{ id: string }> };

/** Request an AI interpretation for a saved reading; stored as an immutable snapshot. */
export const POST = handler(async (_req: Request, { params }: Ctx) => {
  const { user, supabase } = await requireUser();
  const id = z.string().uuid().parse((await params).id);
  const reading = await getReading(supabase, id);
  if (!reading) throw new ApiError(404, "Reading not found.", "not_found");
  const prefs = await getPrefs(supabase, user.id);
  if (!prefs.aiInterpretations) throw new ApiError(403, "AI interpretations are turned off in your settings.", "ai_disabled");
  const existingAi = reading.snapshots.find((s) => s.interpretation.source === "ai");
  if (existingAi) return json({ snapshot: existingAi, existing: true });

  const { data: allowed, error } = await supabase.rpc("consume_ai_quota");
  if (error) throw new Error(error.message);
  if (!allowed) throw new ApiError(429, "You've reached today's limit for AI interpretations. The reference reading is still here, and the limit resets tomorrow.", "quota");

  try {
    const snapshot = await aiInterpretation(requestFromReading(reading));
    await addSnapshot(supabase, user.id, id, snapshot);
    return json({ snapshot }, 201);
  } catch (e) {
    if (e instanceof AiUnavailableError) throw new ApiError(502, e.message, `ai_${e.reason}`);
    throw e;
  }
});
