import { z } from "zod";
import { ApiError, handler, json, parseBody, requireUser } from "@/lib/api";
import { aiFollowUp, requestFromReading } from "@/lib/ai/service";
import { AiUnavailableError } from "@/lib/ai/provider";
import { addFollowUp, getPrefs, getReading } from "@/lib/readings/server";

type Ctx = { params: Promise<{ id: string }> };

/** Ask a follow-up about a saved reading. The cards never change; the answer is saved. */
export const POST = handler(async (req: Request, { params }: Ctx) => {
  const { user, supabase } = await requireUser();
  const id = z.string().uuid().parse((await params).id);
  const { question } = await parseBody(req, z.object({ question: z.string().trim().min(3, "Please write a question.").max(500) }));
  const reading = await getReading(supabase, id);
  if (!reading) throw new ApiError(404, "Reading not found.", "not_found");
  const prefs = await getPrefs(supabase, user.id);
  if (!prefs.aiInterpretations) throw new ApiError(403, "AI interpretations are turned off in your settings.", "ai_disabled");
  const { data: allowed, error } = await supabase.rpc("consume_ai_quota");
  if (error) throw new Error(error.message);
  if (!allowed) throw new ApiError(429, "You've reached today's limit for AI requests.", "quota");
  const latest = reading.snapshots[reading.snapshots.length - 1]?.interpretation;
  try {
    const { answer, generator } = await aiFollowUp(requestFromReading(reading), latest ? `${latest.directAnswer}\n${latest.whyThisFits}` : "", question);
    const followUp = await addFollowUp(supabase, user.id, id, question, { text: answer.text, needsNewPull: answer.needsNewPull, source: "ai" }, generator);
    return json({ followUp }, 201);
  } catch (e) {
    if (e instanceof AiUnavailableError) throw new ApiError(502, e.message, `ai_${e.reason}`);
    throw e;
  }
});
