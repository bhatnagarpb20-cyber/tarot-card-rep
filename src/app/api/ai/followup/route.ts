import { headers } from "next/headers";
import { z } from "zod";
import { ApiError, handler, json, parseBody } from "@/lib/api";
import { aiFollowUp, aiStatus, consumeGuestQuota } from "@/lib/ai/service";
import { AiUnavailableError } from "@/lib/ai/provider";
import { interpretRequestSchema } from "@/lib/interpret/schema";

/** Guest-mode follow-up question about an existing reading (same cards; never a silent re-draw). */
export const POST = handler(async (req: Request) => {
  const status = await aiStatus();
  if (!status.guestAllowed) throw new ApiError(403, status.available ? "Sign in to ask AI follow-up questions." : (status.reason ?? "AI unavailable."), "ai_unavailable");
  const body = await parseBody(req, z.object({ reading: interpretRequestSchema, previous: z.string().max(4000).default(""), question: z.string().trim().min(3).max(500) }));
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!consumeGuestQuota(ip)) throw new ApiError(429, "You've reached today's limit for guest AI requests.", "quota");
  try {
    const { answer } = await aiFollowUp(body.reading, body.previous, body.question);
    return json({ answer: { text: answer.text, needsNewPull: answer.needsNewPull, source: "ai" } });
  } catch (e) {
    if (e instanceof AiUnavailableError) throw new ApiError(502, e.message, `ai_${e.reason}`);
    throw e;
  }
});
