import type { Metadata } from "next";
import { SectionHeading } from "@/components/ornament/Ornaments";
import { DataControls, PreferencesForm } from "@/components/settings/Preferences";
import { getCurrentUser } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata: Metadata = { title: "Settings", robots: { index: false } };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ password?: string }> }) {
  const session = await getCurrentUser();
  const { password } = await searchParams;
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <SectionHeading eyebrow={session ? "Your account" : "Guest mode"} title="Settings" />
      {password === "updated" && <p role="status" className="text-center">Your password has been updated.</p>}
      {!session && (
        <p className="text-center text-sm">
          You're using guest mode. <Link href="/signup">Create an account</Link> to keep a private, backed-up journal across devices.
        </p>
      )}
      <section className="panel p-5 sm:p-8"><PreferencesForm /></section>
      <section className="panel p-5 sm:p-8">
        <h2 className="text-2xl">Your data</h2>
        <div className="mt-4"><DataControls /></div>
      </section>
      {session && (
        <p className="text-center text-sm">
          <Link href="/reset-password">Change password</Link>
        </p>
      )}
    </div>
  );
}
