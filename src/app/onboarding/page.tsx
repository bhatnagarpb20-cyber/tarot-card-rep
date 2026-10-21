import type { Metadata } from "next";
import { SectionHeading } from "@/components/ornament/Ornaments";
import { PreferencesForm } from "@/components/settings/Preferences";

export const metadata: Metadata = { title: "Welcome", robots: { index: false } };

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <SectionHeading eyebrow="Welcome" title="Let's set up your practice" intro="A few choices about how you'd like to read. You can change any of them later in Settings." />
      <section className="panel-night p-5 text-sm">
        <h2 className="text-xl text-gold-light">How The Daily Arcana works</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Each day you can draw one card. It's saved, so it stays the same all day.</li>
          <li>Interpretations come from a curated library of all 78 cards; optional AI readings build on it, never replace it.</li>
          <li>Tarot here is for reflection and learning — not prediction. Your journal is private.</li>
        </ul>
      </section>
      <section className="panel p-5 sm:p-8">
        <PreferencesForm onboarding />
      </section>
    </div>
  );
}
