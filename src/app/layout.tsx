import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import { SiteNav } from "@/components/layout/SiteNav";
import { SessionProvider } from "@/components/session/SessionContext";
import { getCurrentUser } from "@/lib/supabase/server";

const gloock = localFont({
  src: "../fonts/gloock-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-gloock",
  display: "swap",
});

const bricolage = localFont({
  src: "../fonts/bricolage-grotesque-latin-variable.woff2",
  weight: "200 800",
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Inhale Exhale — tarot for the rest of us", template: "%s · Inhale Exhale" },
  description: "Pull a card, breathe, reflect. A tarot app for beginners: daily cards, readings, all 78 cards explained and a private journal.",
};

export const viewport: Viewport = {
  themeColor: "#0f0a1a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getCurrentUser();
  return (
    <html lang="en" className={`${gloock.variable} ${bricolage.variable}`}>
      <body>
        <a href="#main" className="sr-only-focusable fixed left-4 top-2 z-50 rounded bg-acid px-3 py-2 text-void">
          Skip to main content
        </a>
        <SessionProvider signedIn={Boolean(session)}>
          <SiteNav signedIn={Boolean(session)} />
          <main id="main" className="mx-auto w-full max-w-6xl px-4 pb-28 pt-8 md:pb-16">
            {children}
          </main>
        </SessionProvider>
        <footer className="border-t border-line px-4 pb-24 pt-8 text-center text-sm text-cream/70 md:pb-8">
          <p>
            Tarot is presented here as a symbolic, reflective practice — not a way to predict the future.{" "}
            <Link href="/about">Privacy &amp; methodology</Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
