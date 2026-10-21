import { handler, json } from "@/lib/api";
import { aiStatus } from "@/lib/ai/service";

/** Whether AI interpretations can be requested. Never reveals credentials. */
export const GET = handler(async () => json(await aiStatus()));
