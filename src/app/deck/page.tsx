import type { Metadata } from "next";
import Link from "next/link";
import { DECK } from "@/content/cards";
import { TarotCard } from "@/components/cards/TarotCard";
import { Tilt } from "@/components/cards/Tilt";
import { SectionHeading } from "@/components/ornament/Ornaments";
import { artProgress } from "@/lib/art/registry";

export const metadata: Metadata = { title: "The deck library" };

const GROUPS = [
  { key: "major", label: "Major Arcana", blurb: "Twenty-two archetypes, numbered 0–XXI in the Rider–Waite–Smith sequence (Strength VIII, Justice XI)." },
  { key: "wands", label: "Wands", blurb: "Fire — action, initiative, creativity and ambition." },
  { key: "cups", label: "Cups", blurb: "Water — emotions, relationships and intuition." },
  { key: "swords", label: "Swords", blurb: "Air — thoughts, communication, decisions and conflict." },
  { key: "pentacles", label: "Pentacles", blurb: "Earth — work, resources and practical life." },
] as const;

export default async function DeckPage({ searchParams }: { searchParams: Promise<{ group?: string }> }) {
  const { group } = await searchParams;
  const active = GROUPS.find((g) => g.key === group);
  const shown = active ? GROUPS.filter((g) => g.key === active.key) : GROUPS;
  const art = artProgress();

  return (
    <div className="space-y-10">
      <SectionHeading eyebrow="All 78 cards" title="The deck library" intro="Explore each card's imagery, traditional meaning and modern interpretations — and practise reading it yourself." />
      <p className="text-center text-sm text-cream/75">
        Artwork: {art.withImage} of {art.total} illustrations completed. Cards without finished artwork show a labelled placeholder face.
      </p>
      <nav aria-label="Filter the deck" className="flex flex-wrap justify-center gap-2">
        <Link href="/deck" aria-current={!active ? "page" : undefined} className={`btn ${!active ? "btn-primary" : "btn-ghost"}`}>
          All
        </Link>
        {GROUPS.map((g) => (
          <Link key={g.key} href={`/deck?group=${g.key}`} aria-current={active?.key === g.key ? "page" : undefined} className={`btn ${active?.key === g.key ? "btn-primary" : "btn-ghost"}`}>
            {g.label}
          </Link>
        ))}
      </nav>
      {shown.map((g) => {
        const cards = g.key === "major" ? DECK.filter((c) => c.arcana === "major") : DECK.filter((c) => c.suit === g.key);
        return (
          <section key={g.key} aria-labelledby={`g-${g.key}`}>
            <h2 id={`g-${g.key}`} className="text-3xl">
              {g.label}
            </h2>
            <p className="mt-1 text-cream/80">{g.blurb}</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
              {cards.map((c) => (
                <li key={c.id}>
                  <Link href={`/deck/${c.id}`} className="group block text-center text-cream no-underline">
                    <Tilt>
                      <TarotCard cardId={c.id} size="fluid" />
                    </Tilt>
                    <span className="mt-2 block font-[family-name:var(--font-heading)] text-lg group-hover:text-hot">{c.name}</span>
                    <span className="block text-xs text-cream/70">{c.keywords.upright.slice(0, 2).join(" · ")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
