import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import * as z from "zod/v4";
import { interpretationSchema, type InterpretRequest, type Interpretation } from "@/lib/interpret/schema";
import { buildFollowUpMessage, buildUserMessage, SYSTEM_PROMPT } from "./grounding";
import { AiUnavailableError, type FollowUpAnswer, type InterpretationProvider } from "./provider";

/** Output shape requested from the model (structured output). Validated again with the app schema. */
const AiInterpretation = z.object({
  directAnswer: z.string(),
  cards: z.array(
    z.object({
      cardId: z.string(),
      position: z.number().int(),
      positionLabel: z.string(),
      reversed: z.boolean(),
      traditionalMeaning: z.string(),
      symbolism: z.array(z.string()),
      inContext: z.string(),
    }),
  ),
  connections: z.string().nullable(),
  patterns: z.string(),
  challengesAndOpportunities: z.string(),
  nextSteps: z.array(z.string()),
  outlook: z.string(),
  reflectionPrompt: z.string(),
  whyThisFits: z.string(),
});

const AiFollowUp = z.object({ answer: z.string(), needsNewPull: z.boolean() });

export class AnthropicProvider implements InterpretationProvider {
  readonly model = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";
  readonly id = `anthropic:${this.model}`;
  private client = new Anthropic({ timeout: 90_000, maxRetries: 2 });

  private async call<T>(format: ReturnType<typeof betaZodOutputFormat<z.ZodType<T>>>, user: string, signal?: AbortSignal): Promise<T> {
    try {
      const response = await this.client.beta.messages.parse(
        {
          model: this.model,
          max_tokens: 16000,
          betas: ["server-side-fallback-2026-07-01"],
          // If a safety classifier declines, re-run on Anthropic's recommended fallback model.
          fallbacks: "default",
          output_config: { effort: "medium", format },
          system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
          messages: [{ role: "user", content: user }],
        },
        { signal },
      );
      if (response.stop_reason === "refusal") throw new AiUnavailableError("The AI declined to interpret this reading.", "refused");
      if (response.stop_reason === "max_tokens") throw new AiUnavailableError("The AI response was cut short.", "invalid_output");
      if (!response.parsed_output) throw new AiUnavailableError("The AI returned an unreadable response.", "invalid_output");
      return response.parsed_output as T;
    } catch (e) {
      if (e instanceof AiUnavailableError) throw e;
      if (e instanceof Anthropic.APIConnectionTimeoutError) throw new AiUnavailableError("The AI service took too long to respond.", "timeout");
      if (e instanceof Anthropic.RateLimitError) throw new AiUnavailableError("The AI service is busy right now.", "upstream");
      if (e instanceof Anthropic.AuthenticationError) throw new AiUnavailableError("The AI service is not configured correctly.", "not_configured");
      if (e instanceof Anthropic.APIError) throw new AiUnavailableError(`The AI service returned an error (${e.status ?? "unknown"}).`, "upstream");
      throw new AiUnavailableError("The AI service could not be reached.", "upstream");
    }
  }

  async interpret(req: InterpretRequest, signal?: AbortSignal): Promise<Interpretation> {
    const raw = await this.call(betaZodOutputFormat(AiInterpretation), buildUserMessage(req), signal);
    return validateAiInterpretation(raw, req);
  }

  async followUp(req: InterpretRequest, previousAnswer: string, question: string, signal?: AbortSignal): Promise<FollowUpAnswer> {
    const raw = await this.call(betaZodOutputFormat(AiFollowUp), buildFollowUpMessage(req, previousAnswer, question), signal);
    const text = raw.answer.trim();
    if (text.length < 10) throw new AiUnavailableError("The AI returned an empty answer.", "invalid_output");
    return { text: text.slice(0, 4000), needsNewPull: raw.needsNewPull };
  }
}

/**
 * Accepts model output only if it is schema-valid AND describes exactly the cards that were drawn,
 * in the same positions and orientations. Anything else is rejected rather than shown.
 */
export function validateAiInterpretation(raw: unknown, req: InterpretRequest): Interpretation {
  const parsed = interpretationSchema.safeParse({ ...(raw as object), source: "ai" });
  if (!parsed.success) throw new AiUnavailableError("The AI response did not match the expected format.", "invalid_output");
  const expected = [...req.cards].sort((a, b) => a.position - b.position);
  const got = [...parsed.data.cards].sort((a, b) => a.position - b.position);
  const matches = expected.length === got.length && expected.every((c, i) => c.cardId === got[i].cardId && c.position === got[i].position && c.reversed === got[i].reversed);
  if (!matches) throw new AiUnavailableError("The AI response referred to different cards than the ones drawn.", "invalid_output");
  return { ...parsed.data, cards: got };
}
