"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Share {
  token: string;
  include_question: boolean;
  created_at: string;
}

/** Create, copy and revoke a public link for one reading. */
export function ShareManager({ readingId }: { readingId: string }) {
  const [share, setShare] = useState<Share | null | undefined>(undefined);
  const [includeQuestion, setIncludeQuestion] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/readings/${readingId}/share`)
      .then(async (r) => (r.ok ? (await r.json()).share : Promise.reject((await r.json()).error)))
      .then(setShare)
      .catch((e) => {
        setShare(null);
        setMsg(typeof e === "string" ? e : "Could not load sharing status.");
      });
  }, [readingId]);

  const url = share ? `${typeof window !== "undefined" ? window.location.origin : ""}/s/${share.token}` : "";

  return (
    <div className="panel mx-auto max-w-xl space-y-4 p-6">
      <h1 className="text-3xl">Share this reading</h1>
      <p className="text-sm">A share link shows the cards and interpretation. It never includes your journal, your context notes, or who you are. Your question is included only if you choose.</p>
      {share === undefined ? (
        <p role="status">Loading…</p>
      ) : share ? (
        <>
          <label htmlFor="share-url" className="block font-semibold">Public link</label>
          <input id="share-url" readOnly className="field" value={url} onFocus={(e) => e.target.select()} />
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={async () => { await navigator.clipboard.writeText(url); setMsg("Link copied."); }}>Copy link</button>
            <button type="button" className="btn btn-ghost" onClick={async () => { const r = await fetch(`/api/readings/${readingId}/share`, { method: "DELETE" }); if (r.ok) { setShare(null); setMsg("Link revoked — it no longer works."); } }}>Revoke link</button>
          </div>
          <p className="text-sm">Question included: {share.include_question ? "yes" : "no"}</p>
        </>
      ) : (
        <form className="space-y-3" onSubmit={async (e) => { e.preventDefault(); const r = await fetch(`/api/readings/${readingId}/share`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ includeQuestion }) }); const body = await r.json(); if (r.ok) { setShare(body.share); setMsg(null); } else setMsg(body.error); }}>
          <label className="flex items-center gap-2"><input type="checkbox" checked={includeQuestion} onChange={(e) => setIncludeQuestion(e.target.checked)} /> Include my question</label>
          <button type="submit" className="btn btn-primary">Create share link</button>
        </form>
      )}
      {msg && <p role="status" className="text-sm font-semibold">{msg}</p>}
      <Link href={`/readings/${readingId}`} className="inline-block text-sm">← Back to the reading</Link>
    </div>
  );
}
