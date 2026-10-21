import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import { SiteNav } from "@/components/layout/SiteNav";
import { SessionProvider } from "@/components/session/SessionContext";
import { getCurrentUser } from "@/lib/supabase/server";

const cinzel = localFont({
  src: [
    { path: "../fonts/cinzel-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/cinzel-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

const sourceSerif = localFont({
  src: [
    { path: "../fonts/source-serif-4-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/source-serif-4-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/source-serif-4-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "The Daily Arcana", template: "%s · The Daily Arcana" },
  description: "A tarot companion for daily reflection, thoughtful readings, learning all 78 cards and keeping a private journal.",
};

export const viewport: Viewport = {
  themeColor: "#141b3c",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getCurrentUser();
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${sourceSerif.variable}`}>
      <body>
        <a href="#main" className="sr-only-focusable fixed left-4 top-2 z-50 rounded bg-gold px-3 py-2 text-ink">
          Skip to main content
        </a>
        <SessionProvider signedIn={Boolean(session)}>
          <SiteNav signedIn={Boolean(session)} />
          <main id="main" className="mx-auto w-full max-w-6xl px-4 pb-28 pt-8 md:pb-16">
            {children}
          </main>
        </SessionProvider>
        <footer className="border-t border-gold/20 px-4 pb-24 pt-8 text-center text-sm text-ivory/70 md:pb-8">
          <p>
            Tarot is presented here as a symbolic, reflective practice — not a way to predict the future.{" "}
            <Link href="/about">Privacy &amp; methodology</Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
