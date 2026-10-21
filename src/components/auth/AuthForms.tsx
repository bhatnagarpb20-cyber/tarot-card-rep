"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function Unavailable() {
  return (
    <div className="panel mx-auto max-w-md p-6 text-center">
      <h1 className="text-3xl">Accounts aren't set up yet</h1>
      <p className="mt-3">
        This copy of Inhale Exhale hasn't been connected to Supabase, so sign-in is unavailable. You can still use everything in <strong>guest mode</strong> — readings and notes are saved in this browser.
      </p>
      <p className="mt-3 text-sm opacity-80">Site owner: add the Supabase environment variables described in the README.</p>
      <Link href="/daily" className="btn btn-primary mt-5">
        Continue as a guest
      </Link>
    </div>
  );
}

function Shell({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="panel mx-auto max-w-md p-6 sm:p-8">
      <h1 className="text-center text-3xl">{title}</h1>
      {intro && <p className="mt-2 text-center text-sm">{intro}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({ id, label, type = "text", value, onChange, autoComplete, hint, required = true, minLength }: { id: string; label: string; type?: string; value: string; onChange: (v: string) => void; autoComplete?: string; hint?: string; required?: boolean; minLength?: number }) {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold">
        {label}
      </label>
      <input id={id} type={type} className="field mt-1" value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} required={required} minLength={minLength} aria-describedby={hint ? `${id}-hint` : undefined} />
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs opacity-75">
          {hint}
        </p>
      )}
    </div>
  );
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
}

export function LoginForm() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(params.get("error") === "link" ? "That link has expired or was already used. Please try again." : null);
  const [busy, setBusy] = useState(false);
  if (!supabase) return <Unavailable />;

  return (
    <Shell title="Welcome back">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          setBusy(false);
          if (error) return setError(error.message === "Invalid login credentials" ? "That email and password don't match an account." : error.message);
          router.push("/daily");
          router.refresh();
        }}
      >
        <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        {error && (
          <p role="alert" className="text-sm font-semibold text-hot">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm">
        <Link href="/reset-password">Forgot your password?</Link> · <Link href="/signup">Create an account</Link>
      </p>
    </Shell>
  );
}

export function SignupForm() {
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState<{ status: "idle" | "busy" | "sent" | "error"; message?: string }>({ status: "idle" });
  if (!supabase) return <Unavailable />;
  if (state.status === "sent")
    return (
      <Shell title="Check your email">
        <p className="text-center">We've sent a confirmation link to {email}. Open it to finish creating your account.</p>
      </Shell>
    );

  return (
    <Shell title="Create your account" intro="Your journal, readings and progress are private to you and backed up.">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (password.length < 8) return setState({ status: "error", message: "Use at least 8 characters for your password." });
          if (!agree) return setState({ status: "error", message: "Please confirm you've read how the app handles your data." });
          setState({ status: "busy" });
          const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${siteUrl()}/auth/callback?next=/onboarding` } });
          if (error) return setState({ status: "error", message: error.message });
          if (data.session) {
            window.location.href = "/onboarding";
            return;
          }
          setState({ status: "sent" });
        }}
      >
        <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" minLength={8} hint="At least 8 characters." />
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>
            I've read the <Link href="/about">privacy &amp; methodology</Link> page and understand tarot here is a reflective practice, not prediction.
          </span>
        </label>
        {state.status === "error" && (
          <p role="alert" className="text-sm font-semibold text-hot">
            {state.message}
          </p>
        )}
        <button type="submit" className="btn btn-primary w-full" disabled={state.status === "busy"}>
          {state.status === "busy" ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </Shell>
  );
}

export function ResetPasswordForm() {
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  if (!supabase) return <Unavailable />;
  return (
    <Shell title="Reset your password" intro="We'll email you a link to choose a new password.">
      {state === "sent" ? (
        <p role="status" className="text-center">
          If an account exists for {email}, a reset link is on its way.
        </p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setState("busy");
            const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${siteUrl()}/auth/callback?next=/update-password` });
            if (error) {
              setError(error.message);
              setState("idle");
            } else setState("sent");
          }}
        >
          <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          {error && (
            <p role="alert" className="text-sm font-semibold text-hot">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary w-full" disabled={state === "busy"}>
            Send reset link
          </button>
        </form>
      )}
    </Shell>
  );
}

export function UpdatePasswordForm() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!supabase) return <Unavailable />;
  return (
    <Shell title="Choose a new password">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (password.length < 8) return setError("Use at least 8 characters.");
          setBusy(true);
          const { error } = await supabase.auth.updateUser({ password });
          setBusy(false);
          if (error) return setError(error.message);
          router.push("/settings?password=updated");
        }}
      >
        <Field id="password" label="New password" type="password" value={password} onChange={setPassword} autoComplete="new-password" minLength={8} />
        {error && (
          <p role="alert" className="text-sm font-semibold text-hot">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          Update password
        </button>
      </form>
    </Shell>
  );
}
