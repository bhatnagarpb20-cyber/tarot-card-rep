"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crescent } from "@/components/ornament/Ornaments";

const LINKS = [
  { href: "/daily", label: "Daily card", short: "Daily" },
  { href: "/readings", label: "Readings", short: "Read" },
  { href: "/deck", label: "Deck", short: "Deck" },
  { href: "/academy", label: "Academy", short: "Learn" },
  { href: "/journal", label: "Journal", short: "Journal" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gold/30 bg-page/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-2 text-ink no-underline">
            <Crescent className="text-gold-ink" />
            <span className="font-[family-name:var(--font-display)] text-sm tracking-[0.2em] sm:text-base">THE DAILY ARCANA</span>
          </Link>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive(pathname, l.href) ? "page" : undefined}
                    className="rounded-full px-3 py-2 text-sm text-ink/85 no-underline hover:text-vermilion aria-[current=page]:text-vermilion aria-[current=page]:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link href={signedIn ? "/settings" : "/login"} className="btn btn-ghost !min-h-9 !px-4 !text-xs">
            {signedIn ? "Account" : "Sign in"}
          </Link>
        </div>
      </header>
      {/* Mobile tab bar: thumb-reachable primary navigation. */}
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/30 bg-page/95 backdrop-blur md:hidden">
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(pathname, l.href) ? "page" : undefined}
                className="flex min-h-14 flex-col items-center justify-center border-t-2 border-transparent text-xs text-ink/80 no-underline aria-[current=page]:border-gold aria-[current=page]:text-vermilion"
              >
                {l.short}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
