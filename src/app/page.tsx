import Link from "next/link";
import { TarotCard } from "@/components/cards/TarotCard";
import { Tilt } from "@/components/cards/Tilt";
import { CornerFlourish, Divider, RainbowArch, Star } from "@/components/ornament/Ornaments";

const FEATURES = [
  { href: "/daily", n: "01", accent: "text-acid", title: "Your daily card", body: "Breathe, set an intention, pull one card. It's yours for the whole day — come back to it tonight." },
  { href: "/readings", n: "02", accent: "text-hot", title: "Ask the deck", body: "One, three or five cards for a real question. Every position explained, no vague fortune-cookie stuff." },
  { href: "/academy", n: "03", accent: "text-teal", title: "Learn to read", body: "Twelve bite-size levels and quizzes, so you can read cards yourself instead of googling every one." },
  { href: "/journal", n: "04", accent: "text-lilac", title: "Private journal", body: "Write your take before you see ours, spot your patterns and keep what hit home." },
];

const TICKER = ["inhale", "pull a card", "exhale", "reflect", "inhale", "trust yourself", "exhale", "write it down"];

export default function Home() {
  return (
    <div className="space-y-24">
      <section className="grid items-center gap-12 pt-4 md:grid-cols-[1.05fr_1fr]">
        <div className="rise-in">
          <p className="eyebrow flex items-center gap-2">
            <Star size={10} className="text-hot" /> Tarot for beginners
          </p>
          <h1 className="mt-4 text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
            Inhale.
            <br />
            Exhale.
            <br />
            <span className="text-sunset">Pull a card.</span>
          </h1>
          <p className="mt-7 max-w-lg text-lg text-cream/80">
            Tarot as a five-minute ritual for your inner life — not fortune-telling. One card a day, meanings that actually make sense, and a journal that's only yours.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/daily" className="btn btn-primary">
              Pull today's card
            </Link>
            <Link href="/academy" className="btn btn-ghost">
              Learn the cards
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md" aria-label="The first three cards of the Major Arcana">
          <RainbowArch className="absolute inset-x-0 bottom-0 mx-auto h-[115%] w-full opacity-90 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
          <CornerFlourish className="absolute -left-2 top-2" />
          <CornerFlourish className="absolute -right-1 bottom-24 rotate-90 scale-75" />
          <div className="relative flex items-end justify-center gap-2 pb-6 pt-20">
            {/* Side cards tuck under the centre card so the fan fits a phone screen. */}
            <TarotCard cardId="major-00-the-fool" size="sm" className="-mr-8 translate-y-3 -rotate-[8deg] sm:-mr-4" />
            <Tilt className="z-10">
              <TarotCard cardId="major-01-the-magician" size="md" priority />
            </Tilt>
            <TarotCard cardId="major-02-the-high-priestess" size="sm" className="-ml-8 translate-y-3 rotate-[8deg] sm:-ml-4" />
          </div>
        </div>
      </section>

      {/* Mantra ticker */}
      <div aria-hidden="true" className="-mx-4 overflow-hidden border-y border-line bg-void-sunk/70 py-4">
        <div className="ticker flex w-max gap-10 whitespace-nowrap font-[family-name:var(--font-heading)] text-3xl">
          {[...TICKER, ...TICKER].map((w, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className={i % 2 ? "text-cream" : "text-sunset"}>{w}</span>
              <Star size={18} className={i % 3 === 0 ? "text-acid" : i % 3 === 1 ? "text-hot" : "text-teal"} />
            </span>
          ))}
        </div>
      </div>

      <section aria-labelledby="features-h">
        <p className="eyebrow text-center">What's inside</p>
        <h2 id="features-h" className="mt-3 text-center text-5xl sm:text-6xl">
          Your new <span className="text-sunset">ritual</span>
        </h2>
        <Divider className="mt-5" />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <li key={f.href}>
              <Link href={f.href} className="panel-night group block h-full p-7 text-cream no-underline hover:-translate-y-1 hover:border-cream/40">
                <span className={`font-[family-name:var(--font-heading)] text-5xl ${f.accent}`}>{f.n}</span>
                <h3 className="mt-3 text-3xl">{f.title}</h3>
                <p className="mt-2 text-cream/80">{f.body}</p>
                <span className={`mt-5 inline-block text-sm font-bold uppercase tracking-[0.14em] ${f.accent}`}>
                  Open <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </li>
          ))}
          <li className="sm:col-span-2">
            <Link href="/deck" className="panel-night group flex flex-col gap-4 p-7 text-cream no-underline hover:-translate-y-1 hover:border-cream/40 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-[family-name:var(--font-heading)] text-5xl text-sun">05</span>
                <h3 className="mt-3 text-3xl">All 78 cards, decoded</h3>
                <p className="mt-2 max-w-2xl text-cream/80">Symbols, upright and reversed meanings, what each card says about love, work and growth — plus quizzes to make it stick.</p>
              </div>
              <span className="btn btn-ghost shrink-0">Browse the deck</span>
            </Link>
          </li>
        </ul>
      </section>

      <section className="panel mx-auto max-w-3xl overflow-hidden p-8 text-center sm:p-12">
        <p className="eyebrow">Real talk</p>
        <h2 className="mt-3 text-4xl sm:text-5xl">Tarot is a mirror, not a crystal ball</h2>
        <p className="mx-auto mt-5 max-w-xl text-cream/85">
          Nobody can predict your future — not us, not the cards. Tarot here is a tool for reflection. Readings never claim to know what someone else is thinking and never promise outcomes, and we always show which meanings are traditional and which are modern.
        </p>
        <Link href="/about" className="mt-6 inline-block font-semibold">
          How it works &amp; your privacy →
        </Link>
      </section>
    </div>
  );
}
