import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DECK, getCard, requireCard } from "@/content/cards";
import { CATEGORY_LABELS, CONTEXT_KEYS } from "@/lib/tarot/types";
import { buildCardQuiz } from "@/lib/academy/card-quiz";
import { TarotCard } from "@/components/cards/TarotCard";
import { Divider, Star } from "@/components/ornament/Ornaments";
import { Quiz } from "@/components/learning/Quiz";
import { ObservationExercise } from "@/components/learning/ObservationExercise";
import { InterpretationExercise } from "@/components/learning/InterpretationExercise";

export function generateStaticParams() {
  return DECK.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const card = getCard((await params).id);
  return card ? { title: card.name, description: `${card.name}: ${card.keywords.upright.join(", ")}. Symbolism, meanings and practice.` } : {};
}

function Block({ id, title, children, tone = "panel" }: { id?: string; title: string; children: React.ReactNode; tone?: "panel" | "night" }) {
  return (
    <section id={id} aria-labelledby={`${id ?? title}-h`} className={`${tone === "panel" ? "panel" : "panel-night"} scroll-mt-24 p-5 sm:p-7`}>
      <h2 id={`${id ?? title}-h`} className="text-2xl">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const card = getCard((await params).id);
  if (!card) notFound();
  const index = DECK.findIndex((c) => c.id === card.id);
  const prev = DECK[(index + DECK.length - 1) % DECK.length];
  const next = DECK[(index + 1) % DECK.length];
  const subtitle = card.arcana === "major" ? `Major Arcana · ${card.numeral}` : `Minor Arcana · ${card.suit!.charAt(0).toUpperCase() + card.suit!.slice(1)} · ${card.numeral}`;

  return (
    <article className="space-y-8">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link href="/deck">Deck library</Link> <span aria-hidden="true">/</span> <span aria-current="page">{card.name}</span>
      </nav>

      <header className="grid items-start gap-8 md:grid-cols-[auto_1fr]">
        <TarotCard cardId={card.id} size="lg" priority className="mx-auto" />
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h1 className="mt-2 text-5xl">{card.name}</h1>
          <Divider className="!mx-0 mt-4" />
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="eyebrow">Upright keywords</dt>
              <dd className="mt-1">{card.keywords.upright.join(" · ")}</dd>
            </div>
            <div>
              <dt className="eyebrow">Reversed keywords</dt>
              <dd className="mt-1">{card.keywords.reversed.join(" · ")}</dd>
            </div>
          </dl>
          <p className="mt-5 text-lg italic text-cream/90">{card.memoryAid}</p>
          <ul className="mt-5 flex flex-wrap gap-2 text-sm">
            {[
              ["#symbolism", "Symbolism"],
              ["#meanings", "Meanings"],
              ["#contexts", "In context"],
              ["#observe", "Observe"],
              ["#exercise", "Exercise"],
              ["#quiz", "Quiz"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="btn btn-ghost !min-h-9 !px-3 !text-xs">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <Block title="Traditional meaning" tone="night">
        <p className="eyebrow !text-xs">Established tradition · Waite, 1911 (paraphrased)</p>
        <p className="mt-2">{card.traditional}</p>
      </Block>

      <Block id="symbolism" title="Symbolism — and why it matters">
        <ul className="space-y-3">
          {card.symbols.map((s) => (
            <li key={s.element} className="flex gap-3">
              <Star className="mt-2 shrink-0 text-acid" size={10} />
              <span>
                <strong>{s.element}.</strong> {s.meaning}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <strong>How they work together:</strong> {card.upright}
        </p>
      </Block>

      <Block id="meanings" title="Upright and reversed">
        <p className="eyebrow !text-xs !text-hot">Modern reflective interpretation</p>
        <h3 className="mt-2 text-xl">Upright</h3>
        <p>{card.upright}</p>
        <h3 className="mt-4 text-xl">Reversed</h3>
        <p>{card.reversed}</p>
        <p className="mt-3 text-sm">Reversals can show this energy blocked, turned inward, overdone or in need of reconsideration — not simply its opposite.</p>
      </Block>

      <Block id="contexts" title="In different areas of life">
        <dl className="grid gap-4 sm:grid-cols-2">
          {CONTEXT_KEYS.map((k) => (
            <div key={k} className="rounded border border-line p-3">
              <dt className="font-semibold text-hot">{CATEGORY_LABELS[k]}</dt>
              <dd className="mt-1">{card.contexts[k]}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <div className="grid gap-8 md:grid-cols-2">
        <Block title="Shadow & misconceptions">
          <p>
            <strong>Shadow expression:</strong> {card.shadow}
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {card.misconceptions.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Block>
        <Block title="A practical example">
          <p>{card.example}</p>
          <p className="mt-3">
            <strong>Try this:</strong> {card.action}
          </p>
        </Block>
      </div>

      <Block title="Reflection questions" tone="night">
        <ul className="space-y-2">
          {card.reflection.map((r) => (
            <li key={r} className="font-[family-name:var(--font-heading)] text-xl italic">
              {r}
            </li>
          ))}
        </ul>
      </Block>

      <Block id="observe" title="Look closely">
        <ObservationExercise cardId={card.id} />
      </Block>

      <Block id="exercise" title="Apply it">
        <InterpretationExercise cardId={card.id} />
      </Block>

      <Block id="quiz" title="Test yourself">
        <Quiz questions={buildCardQuiz(card)} subjectType="card" subjectId={card.id} title={`${card.name} quiz`} />
      </Block>

      <Block title="Related cards" tone="night">
        <ul className="grid gap-4 sm:grid-cols-3">
          {card.related.map((r) => {
            const rc = requireCard(r.id);
            return (
              <li key={r.id} className="flex gap-3">
                <TarotCard cardId={rc.id} size="xs" />
                <span>
                  <Link href={`/deck/${rc.id}`} className="font-semibold">
                    {rc.name}
                  </Link>
                  <span className="block text-sm text-cream/80">{r.reason}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </Block>

      <footer className="space-y-4 text-sm text-cream/75">
        <p>
          <strong>Sources:</strong>{" "}
          {card.sources.map((s, i) => (
            <span key={s.title}>
              {i > 0 && "; "}
              {s.url ? <a href={s.url}>{s.title}</a> : s.title} ({s.author}, {s.year}) — {s.note}
            </span>
          ))}{" "}
          Content version {card.contentVersion}.
        </p>
        <nav aria-label="Adjacent cards" className="flex justify-between gap-4">
          <Link href={`/deck/${prev.id}`}>← {prev.name}</Link>
          <Link href={`/deck/${next.id}`}>{next.name} →</Link>
        </nav>
      </footer>
    </article>
  );
}
