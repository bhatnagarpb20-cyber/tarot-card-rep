import Link from "next/link";
import { TarotCard } from "@/components/cards/TarotCard";
import { Divider, CornerFlourish } from "@/components/ornament/Ornaments";

const FEATURES = [
  { href: "/daily", title: "A daily ritual", body: "Pause, set an intention and draw one card. It stays the same all day, ready for reflection." },
  { href: "/readings", title: "Thoughtful readings", body: "Ask a question and receive an interpretation grounded in each card's tradition, your spread positions and your context." },
  { href: "/academy", title: "Learn to read", body: "A twelve-level course, lessons for every one of the 78 cards, and practice that builds your own intuition." },
  { href: "/journal", title: "A private journal", body: "Record your interpretations before you see ours, notice your patterns and revisit what resonated." },
];

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="grid items-center gap-10 pt-6 md:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="eyebrow">A tarot companion</p>
          <h1 className="mt-3 text-5xl leading-[1.05] sm:text-6xl">
            Understand the cards.
            <br />
            Reflect on your life.
            <br />
            <em className="text-vermilion">Learn to read for yourself.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink/85">
            The Daily Arcana pairs the symbolism of the Rider–Waite–Smith tradition with careful, transparent interpretation — and teaches you to see what the cards show, so you don't have to rely on anyone else's reading.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/daily" className="btn btn-primary">
              Draw today's card
            </Link>
            <Link href="/academy" className="btn btn-ghost">
              Start learning
            </Link>
          </div>
        </div>
        <div className="relative mx-auto flex items-end justify-center gap-3" aria-label="The first three cards of the Major Arcana">
          <CornerFlourish className="absolute -left-6 -top-6" />
          <TarotCard cardId="major-00-the-fool" size="sm" className="-rotate-6" />
          <TarotCard cardId="major-01-the-magician" size="md" priority />
          <TarotCard cardId="major-02-the-high-priestess" size="sm" className="rotate-6" />
          <CornerFlourish className="absolute -bottom-6 -right-6 rotate-180" />
        </div>
      </section>

      <section aria-labelledby="features-h">
        <h2 id="features-h" className="text-center text-4xl">
          Five ways to practise
        </h2>
        <Divider className="mt-4" />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <li key={f.href}>
              <Link href={f.href} className="panel-night block h-full p-6 text-ink no-underline transition-colors hover:border-gold">
                <h3 className="text-2xl text-vermilion">{f.title}</h3>
                <p className="mt-2 text-ink/85">{f.body}</p>
              </Link>
            </li>
          ))}
          <li className="sm:col-span-2">
            <Link href="/deck" className="panel-night block p-6 text-ink no-underline hover:border-gold">
              <h3 className="text-2xl text-vermilion">The deck library</h3>
              <p className="mt-2 text-ink/85">Explore all 78 cards: symbolism, upright and reversed meanings, context-specific readings, quizzes and interpretation exercises.</p>
            </Link>
          </li>
        </ul>
      </section>

      <section className="panel mx-auto max-w-3xl p-6 text-center sm:p-10">
        <h2 className="text-3xl">An honest approach to tarot</h2>
        <p className="mt-4">
          Tarot here is a symbolic and reflective practice — not a scientifically validated way to predict the future. Readings never claim to know another person's private thoughts, and never guarantee outcomes. Traditional meanings are clearly separated from modern interpretation.
        </p>
        <Link href="/about" className="mt-4 inline-block">
          Read our methodology &amp; privacy approach →
        </Link>
      </section>
    </div>
  );
}
