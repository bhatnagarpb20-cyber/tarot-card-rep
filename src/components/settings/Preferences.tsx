"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { browserTimeZone, isValidTimeZone } from "@/lib/dates";
import type { ProfileView } from "@/lib/profile";
import { guestStore } from "@/lib/readings/guest-store";
import { guestLearning } from "@/lib/learning/guest-store";
import { useStorageMode } from "@/components/session/SessionContext";

type Prefs = Pick<ProfileView, "displayName" | "timezone" | "allowReversals" | "writeBeforeReveal" | "aiInterpretations">;

export function PreferencesForm({ onboarding = false }: { onboarding?: boolean }) {
  const mode = useStorageMode();
  const router = useRouter();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "guest") {
      const g = guestStore.prefs();
      setPrefs({ displayName: "", timezone: browserTimeZone(), allowReversals: g.allowReversals, writeBeforeReveal: g.writeBeforeReveal, aiInterpretations: true });
      return;
    }
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Could not load your settings."))))
      .then((p: ProfileView) => {
        setEmail(p.email);
        setPrefs({ ...p, timezone: onboarding || p.timezone === "UTC" ? browserTimeZone() : p.timezone });
      })
      .catch((e) => setError(e.message));
  }, [mode, onboarding]);

  if (!prefs) return <p role="status">{error ?? "Loading settings…"}</p>;
  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) => {
    setPrefs({ ...prefs, [k]: v });
    setStatus("idle");
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!prefs) return;
    if (!isValidTimeZone(prefs.timezone)) {
      setError("That timezone isn't recognised. Use a name like Europe/London or America/New_York.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    setError(null);
    try {
      if (mode === "guest") {
        guestStore.setPrefs({ allowReversals: prefs.allowReversals, writeBeforeReveal: prefs.writeBeforeReveal });
      } else {
        const res = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...prefs, onboarded: onboarding || undefined }) });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Could not save.");
      }
      setStatus("saved");
      if (onboarding) router.push("/daily");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={save} className="space-y-6" noValidate>
      {mode === "account" && (
        <>
          {email && <p className="text-sm">Signed in as <strong>{email}</strong></p>}
          <div>
            <label htmlFor="dn" className="block font-semibold">Name to greet you by <span className="font-normal opacity-70">(optional)</span></label>
            <input id="dn" className="field mt-1" value={prefs.displayName} maxLength={80} onChange={(e) => set("displayName", e.target.value)} />
          </div>
          <div>
            <label htmlFor="tz" className="block font-semibold">Timezone</label>
            <input id="tz" className="field mt-1" value={prefs.timezone} onChange={(e) => set("timezone", e.target.value)} aria-describedby="tz-hint" />
            <p id="tz-hint" className="mt-1 text-xs opacity-75">Your daily card is tied to your local date. Detected: {browserTimeZone()}.</p>
          </div>
        </>
      )}
      <fieldset className="space-y-3">
        <legend className="text-xl">Reading preferences</legend>
        <Toggle id="rev" checked={prefs.allowReversals} onChange={(v) => set("allowReversals", v)} label="Use reversed cards" hint="When off, every card is drawn upright. Many experienced readers never use reversals." />
        <Toggle id="wbr" checked={prefs.writeBeforeReveal} onChange={(v) => set("writeBeforeReveal", v)} label="Write my own interpretation before seeing the app's" hint="Recommended — it's the best way to become a confident reader." />
        {mode === "account" && <Toggle id="ai" checked={prefs.aiInterpretations} onChange={(v) => set("aiInterpretations", v)} label="Offer AI interpretations" hint="When off, you'll only see reference readings from the card library and nothing is sent to an AI provider." />}
      </fieldset>
      {error && <p role="alert" className="font-semibold text-hot">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : onboarding ? "Save and draw my first card" : "Save settings"}
        </button>
        <p role="status" className="text-sm">{status === "saved" && !onboarding && "Settings saved."}</p>
      </div>
    </form>
  );
}

function Toggle({ id, checked, onChange, label, hint }: { id: string; checked: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <div className="flex items-start gap-3">
      <input id={id} type="checkbox" className="mt-1.5 h-5 w-5" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-describedby={`${id}-hint`} />
      <div>
        <label htmlFor={id} className="font-semibold">{label}</label>
        <p id={`${id}-hint`} className="text-sm opacity-80">{hint}</p>
      </div>
    </div>
  );
}

export function DataControls() {
  const mode = useStorageMode();
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function downloadGuest() {
    const data = { exportedAt: new Date().toISOString(), storage: "this browser (guest mode)", readings: guestStore.exportAll(), learning: guestLearning.state() };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-arcana-guest-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (mode === "guest") {
    return (
      <div className="space-y-4">
        <p>Guest data lives only in this browser.</p>
        <button type="button" className="btn btn-ghost" onClick={downloadGuest}>Download my data (JSON)</button>
        <div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              if (!window.confirm("Delete all readings, notes and learning progress stored in this browser? This cannot be undone.")) return;
              guestStore.clear();
              guestLearning.clear();
              setStatus("All guest data in this browser has been deleted.");
            }}
          >
            Delete all guest data
          </button>
        </div>
        {status && <p role="status">{status}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <a href="/api/account/export" className="btn btn-ghost" download>Download all my data (JSON)</a>
      </div>
      <form method="post" action="/auth/signout">
        <button type="submit" className="btn btn-ghost">Sign out</button>
      </form>
      <form
        className="space-y-2 rounded border border-hot/60 p-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setStatus(null);
          const res = await fetch("/api/account/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirm }) });
          setBusy(false);
          if (res.ok) {
            window.location.href = "/?account=deleted";
          } else {
            setStatus((await res.json().catch(() => ({}))).error ?? "Could not delete the account.");
          }
        }}
      >
        <h3 className="text-xl text-hot">Delete my account</h3>
        <p className="text-sm">This permanently deletes your account, readings, journal, progress and share links. Download your data first if you want a copy.</p>
        <label htmlFor="confirm-delete" className="block text-sm font-semibold">Type DELETE to confirm</label>
        <input id="confirm-delete" className="field" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" />
        <button type="submit" className="btn btn-ghost" disabled={confirm !== "DELETE" || busy}>{busy ? "Deleting…" : "Permanently delete account"}</button>
        {status && <p role="alert" className="text-sm font-semibold">{status}</p>}
      </form>
    </div>
  );
}
