import "server-only";
import { CARD_CONTENT_VERSION } from "@/content/cards";
import type { InterpretRequest, InterpretationSnapshot } from "@/lib/interpret/schema";
import type { SavedReading } from "@/lib/readings/types";
import { AiUnavailableError, getProvider, type FollowUpAnswer } from "./provider";

export interface AiStatus {
  available: boolean;
  guestAllowed: boolean;
  reason: string | null;
}

export async function aiStatus(): Promise<AiStatus> {
  const provider = await getProvider();
  return {
    available: Boolean(provider),
    guestAllowed: Boolean(provider) && process.env.ALLOW_GUEST_AI === "true",
    reason: provider ? null : "AI interpretations are not configured on this server. Reference readings from the card library are still available.",
  };
}

export function requestFromReading(r: Pick<SavedReading, "spread" | "category" | "question" | "context" | "cards">): InterpretRequest {
  return { spread: r.spread, category: r.category, question: r.question, context: r.context, cards: r.cards };
}

const TIMEOUT_MS = 100_000;

export async function aiInterpretation(req: InterpretRequest): Promise<InterpretationSnapshot> {
  const provider = await getProvider();
  if (!provider) throw new AiUnavailableError("AI interpretations are not configured on this server.", "not_configured");
  const interpretation = await provider.interpret(req, AbortSignal.timeout(TIMEOUT_MS));
  return { interpretation, generator: provider.id, contentVersion: CARD_CONTENT_VERSION, createdAt: new Date().toISOString() };
}

export async function aiFollowUp(req: InterpretRequest, previous: string, question: string): Promise<{ answer: FollowUpAnswer; generator: string }> {
  const provider = await getProvider();
  if (!provider) throw new AiUnavailableError("AI follow-ups are not configured on this server.", "not_configured");
  const answer = await provider.followUp(req, previous, question, AbortSignal.timeout(TIMEOUT_MS));
  return { answer, generator: provider.id };
}

/**
 * Very small in-memory limiter for guest AI requests (per server instance). Guest AI is off by
 * default; when enabled this caps casual abuse, but durable limits require accounts.
 */
const guestHits = new Map<string, { day: string; count: number }>();
export function consumeGuestQuota(key: string, limit = Number(process.env.GUEST_AI_DAILY_LIMIT ?? 3)): boolean {
  const day = new Date().toISOString().slice(0, 10);
  const entry = guestHits.get(key);
  if (!entry || entry.day !== day) {
    guestHits.set(key, { day, count: 1 });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
