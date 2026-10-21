"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readingsClient } from "@/lib/readings/client";
import type { SavedReading } from "@/lib/readings/types";
import { useStorageMode } from "@/components/session/SessionContext";
import { ReadingResult } from "./ReadingResult";

/** Loads a saved reading from the right store (account or this browser) and shows it. */
export function ReadingDetail({ id }: { id: string }) {
  const mode = useStorageMode();
  const client = useMemo(() => readingsClient(mode), [mode]);
  const [state, setState] = useState<{ status: "loading" | "ready" | "missing" | "error"; reading?: SavedReading; error?: string }>({ status: "loading" });

  useEffect(() => {
    client
      .get(id)
      .then((reading) => setState(reading ? { status: "ready", reading } : { status: "missing" }))
      .catch((e) => setState(e?.status === 404 ? { status: "missing" } : { status: "error", error: e instanceof Error ? e.message : "Could not load this reading." }));
  }, [client, id]);

  if (state.status === "loading") return <p role="status" className="py-24 text-center">Loading reading…</p>;
  if (state.status === "missing")
    return (
      <div className="panel mx-auto max-w-xl p-6 text-center">
        <h1 className="text-3xl">Reading not found</h1>
        <p className="mt-2">It may have been deleted{mode === "guest" ? ", saved in a different browser, or saved to an account (sign in to see it)" : ""}.</p>
        <Link href="/journal" className="btn btn-ghost mt-4">Back to journal</Link>
      </div>
    );
  if (state.status === "error") return <p role="alert" className="py-24 text-center">{state.error}</p>;
  return (
    <div className="mx-auto max-w-4xl">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm"><Link href="/journal">Journal</Link> / <span aria-current="page">Reading</span></nav>
      <ReadingResult reading={state.reading!} client={client} />
    </div>
  );
}
