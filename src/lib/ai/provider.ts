import "server-only";
import type { InterpretRequest, Interpretation } from "@/lib/interpret/schema";

export interface FollowUpAnswer {
  text: string;
  needsNewPull: boolean;
}

/**
 * A server-side AI provider. Implementations receive validated input and must return output that
 * passes `interpretationSchema`; callers validate again and fall back to the reference reading.
 */
export interface InterpretationProvider {
  /** Recorded with each snapshot, e.g. "anthropic:claude-opus-5-5". */
  readonly id: string;
  interpret(req: InterpretRequest, signal?: AbortSignal): Promise<Interpretation>;
  followUp(req: InterpretRequest, previousAnswer: string, question: string, signal?: AbortSignal): Promise<FollowUpAnswer>;
}

export class AiUnavailableError extends Error {
  constructor(message: string, public reason: "not_configured" | "refused" | "invalid_output" | "upstream" | "timeout" | "quota") {
    super(message);
  }
}

/** Returns the configured provider, or null when no AI credentials are set on the server. */
export async function getProvider(): Promise<InterpretationProvider | null> {
  if (process.env.AI_PROVIDER === "none") return null;
  if (process.env.AI_PROVIDER === "test-double") {
    const { TestDoubleProvider } = await import("./test-double");
    return new TestDoubleProvider();
  }
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const { AnthropicProvider } = await import("./anthropic");
  return new AnthropicProvider();
}
