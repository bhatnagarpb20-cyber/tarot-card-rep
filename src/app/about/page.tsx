import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ornament/Ornaments";
import { artProgress } from "@/lib/art/registry";
import { CARD_CONTENT_VERSION, SOURCES } from "@/content/cards";

export const metadata: Metadata = { title: "Privacy & methodology" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel prose-arcana p-5 sm:p-8">
      <h2 className="text-2xl">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  const art = artProgress();
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <SectionHeading eyebrow="How this app works" title="Privacy & methodology" />

      <Section title="What tarot is — and isn't — here">
        <p>The Daily Arcana treats tarot as a symbolic and reflective practice. There is no scientific evidence that tarot predicts future events, and nothing in this app should be taken as a prediction or guarantee.</p>
        <p>Readings never claim to know another person's private thoughts, feelings, fidelity or intentions, and never promise outcomes such as a job, relationship or financial result. For health, legal, financial or safety decisions, please seek qualified professional help.</p>
      </Section>

      <Section title="How cards are drawn">
        <p>When you choose a face-down card, the app draws your card at that moment using a cryptographically secure random number generator (the Web Crypto API) and an unbiased Fisher–Yates shuffle. Because face-down cards are indistinguishable, this is equivalent to choosing from a physically shuffled deck.</p>
        <p>The draw depends only on randomness. Your question, life area, intention and any AI model play no part in which cards appear. Cards within a spread never repeat. Reversals are decided by the same random source when enabled, and you can turn them off in Settings.</p>
        <p>Your daily card is saved against your local calendar date, so refreshing or returning shows the same card. Extra pulls are always labelled and saved as separate readings; the daily card is never replaced.</p>
      </Section>

      <Section title="How interpretations are made">
        <p>Every reading starts with a <strong>reference reading</strong> assembled from our card library — keywords, traditional meanings, symbolism and context-specific meanings for all 78 cards — combined with your cards, their positions and orientations, and your chosen life area. It works offline and uses no AI.</p>
        <p>If you request an <strong>AI interpretation</strong> (signed-in users, when configured), the server sends your question, the context you chose to share, and the library entries for the cards you drew to an AI model (currently Anthropic's Claude). It does not send your name, email or journal. The AI is instructed to stay within the library's traditional meanings, to explain its reasoning, and to avoid predictions and claims about other people. Its output is checked to make sure it describes exactly the cards you drew before it is shown.</p>
        <p>Every interpretation you see is saved as a snapshot with the reading, so future changes to the library or the AI model never silently rewrite your history.</p>
      </Section>

      <Section title="Tradition and sources">
        <p>
          The deck follows the Rider–Waite–Smith tradition. Major Arcana numbering follows Waite: Strength is VIII and Justice is XI (older Marseille-style decks reverse these). Traditional meanings paraphrase {SOURCES.waite.author}, <em>{SOURCES.waite.title}</em> ({SOURCES.waite.year}, public domain). Modern reflective meanings, context readings, exercises and memory aids are original editorial content and are labelled as modern interpretation. Card content version: {CARD_CONTENT_VERSION}.
        </p>
      </Section>

      <Section title="Artwork">
        <p>The deck's illustrations are original artwork in a Celestial Art Nouveau style, produced card by card from a fixed illustration specification that preserves each card's traditional symbolism. {art.withImage} of {art.total} illustrations are complete. Cards without finished artwork show a clearly labelled placeholder face, never a substitute image.</p>
      </Section>

      <Section title="Your data">
        <p><strong>Guest mode:</strong> readings, notes and progress are saved only in your browser's local storage on this device. They are not sent to our servers (except when you request a guest AI interpretation, if enabled, which sends the reading itself but not your journal). Clearing browser data deletes them.</p>
        <p><strong>Accounts:</strong> data is stored in a PostgreSQL database (Supabase) protected by row-level security, so each account can only ever read its own readings, journal entries and progress — enforced by the database, not just the app. Journal entries are private by default; a reading is visible to others only if you create a share link, which you can revoke at any time, and share pages never include your journal or context.</p>
        <p>You can download all your data or permanently delete your account from <Link href="/settings">Settings</Link>. AI usage is limited per day to control costs.</p>
      </Section>
    </div>
  );
}
