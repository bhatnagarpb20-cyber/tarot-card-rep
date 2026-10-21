import "server-only";
import { buildReferenceInterpretation } from "@/lib/interpret/reference";
import type { InterpretRequest, Interpretation } from "@/lib/interpret/schema";
import type { FollowUpAnswer, InterpretationProvider } from "./provider";
import { validateAiInterpretation } from "./anthropic";

/**
 * Deterministic stand-in for an AI provider, used only by end-to-end tests (AI_PROVIDER=test-double).
 * Its output is clearly labelled so it can never be mistaken for a real interpretation.
 */
export class TestDoubleProvider implements InterpretationProvider {
  readonly id = "test-double";

  async interpret(req: InterpretRequest): Promise<Interpretation> {
    const base = buildReferenceInterpretation(req);
    return validateAiInterpretation({ ...base, directAnswer: `[Test AI] ${base.directAnswer}` }, req);
  }

  async followUp(_req: InterpretRequest, _previous: string, question: string): Promise<FollowUpAnswer> {
    return { text: `[Test AI] Considering the same cards for “${question}”: reflect on the guidance position.`, needsNewPull: /new card|another card/i.test(question) };
  }
}
