import { headers } from "next/headers";
import { z } from "zod";
import { ApiError, handler, json, parseBody } from "@/lib/api";
import { aiInterpretation, aiStatus, consumeGuestQuota } from "@/lib/ai/service";
import { AiUnavailableError } from "@/lib/ai/provider";
import { interpretRequestSchema } from "@/lib/interpret/schema";

/**
 * Guest-mode AI interpretation for a reading stored on the device. Disabled unless
 * ALLOW_GUEST_AI=true. Signed-in users use /api/readings/[id]/interpret instead, which saves the
 * snapshot to their account and uses their database-enforced quota.
 */
export const POST = handler(async (req: Request) => {
  const status = await aiStatus();
  if (!status.guestAllowed) throw new ApiError(403, status.available ? "Sign in to request AI interpretations." : (status.reason ?? "AI unavailable."), "ai_unavailable");
  const { reading } = await parseBody(req, z.object({ reading: interpretRequestSchema }));
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!consumeGuestQuota(ip)) throw new ApiError(429, "You've reached today's limit for guest AI readings. The reference reading is still available.", "quota");
  try {
    return json({ snapshot: await aiInterpretation(reading) });
  } catch (e) {
    if (e instanceof AiUnavailableError) throw new ApiError(502, e.message, `ai_${e.reason}`);
    throw e;
  }
});
