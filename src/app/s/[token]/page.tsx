import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { interpretationSchema } from "@/lib/interpret/schema";
import { SPREAD_IDS, SPREADS } from "@/lib/tarot/spreads";
import { CARD_ID_PATTERN, CATEGORIES, CATEGORY_LABELS } from "@/lib/tarot/types";
import { requireCard } from "@/content/cards";
import { TarotCard } from "@/components/cards/TarotCard";
import { InterpretationView } from "@/components/reading/InterpretationView";

export const metadata: Metadata = { title: "A shared reading", robots: { index: false, follow: false } };

const sharedSchema = z.object({
  spread: z.enum(SPREAD_IDS),
  category: z.enum(CATEGORIES),
  question: z.string().nullable(),
  createdAt: z.string(),
  cards: z.array(z.object({ cardId: z.string().regex(CARD_ID_PATTERN), position: z.number(), reversed: z.boolean() })),
  interpretation: interpretationSchema.nullable(),
});

export default async function SharedReadingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{24}$/.test(token)) notFound();
  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();
  const { data, error } = await supabase.rpc("get_shared_reading", { share_token: token });
  if (error || !data) notFound();
  const parsed = sharedSchema.safeParse(data);
  if (!parsed.success) notFound();
  const r = parsed.data;
  const spread = SPREADS[r.spread];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="text-center">
        <p className="eyebrow">A shared reading · {spread.name} · {CATEGORY_LABELS[r.category]}</p>
        <h1 className="mt-2 text-4xl">{r.question ? `“${r.question}”` : "A tarot reading"}</h1>
        <ol className="mt-8 flex flex-wrap justify-center gap-6">
          {r.cards.map((c) => (
            <li key={c.position} className="flex flex-col items-center gap-2">
              <span className="eyebrow">{spread.positions[c.position]?.label}</span>
              <TarotCard cardId={c.cardId} reversed={c.reversed} size="md" />
              <span className="text-sm">{requireCard(c.cardId).name}{c.reversed ? " (reversed)" : ""}</span>
            </li>
          ))}
        </ol>
      </header>
      {r.interpretation && <InterpretationView snapshot={{ interpretation: r.interpretation, generator: r.interpretation.source === "ai" ? "AI" : "reference", contentVersion: "", createdAt: r.createdAt }} showCards={false} />}
      <p className="text-center text-sm">Tarot is shared here as reflection, not prediction. <Link href="/">Explore Inhale Exhale</Link></p>
    </div>
  );
}
