import "server-only";
import { NextResponse } from "next/server";
import { ZodError, type ZodType, type ZodTypeDef } from "zod";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export class ApiError extends Error {
  constructor(public status: number, message: string, public code = "error") {
    super(message);
  }
}

export function json<T>(data: T, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

/** Wraps a route handler with consistent error responses. Never leaks internal error details. */
export function handler<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof ApiError) return json({ error: e.message, code: e.code }, e.status);
      if (e instanceof ZodError) return json({ error: "Some of the information sent was not valid.", code: "invalid_input", issues: e.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }, 400);
      console.error(e);
      return json({ error: "Something went wrong on our side. Please try again.", code: "server_error" }, 500);
    }
  };
}

/** Requires a signed-in user; throws 401 (or 503 when accounts are not configured). */
export async function requireUser() {
  if (!isSupabaseConfigured()) throw new ApiError(503, "Accounts are not configured on this server yet.", "accounts_unavailable");
  const session = await getCurrentUser();
  if (!session) throw new ApiError(401, "Please sign in to continue.", "unauthenticated");
  return session;
}

export async function parseBody<T>(req: Request, schema: ZodType<T, ZodTypeDef, unknown>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "The request body must be JSON.", "invalid_json");
  }
  return schema.parse(body);
}
