"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandMark, Star } from "@/components/ornament/Ornaments";
import { SoundToggle } from "@/components/sound/SoundToggle";

const LINKS = [
  {
    href: "/daily",
    label: "Daily card",
    hint: "One card, one breath",
    accent: "text-acid",
  },
  {
    href: "/readings",
    label: "Readings",
    hint: "Ask the deck a question",
    accent: "text-hot",
  },
  {
    href: "/deck",
    label: "Deck",
    hint: "All 78 cards, decoded",
    accent: "text-teal",
  },
  {
    href: "/academy",
    label: "Academy",
    hint: "Learn to read for yourself",
    accent: "text-lilac",
  },
  {
    href: "/journal",
    label: "Journal",
    hint: "Your private notes",
    accent: "text-sun",
  },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-void/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-cream no-underline"
          >
            <BrandMark />
            <span className="font-[family-name:var(--font-heading)] text-xl lowercase tracking-tight sm:text-2xl">
              inhale <span className="text-hot">exhale</span>
            </span>
          </Link>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={
                      isActive(pathname, l.href) ? "page" : undefined
                    }
                    className="rounded-full px-3.5 py-2 text-sm font-medium text-cream/85 no-underline transition-colors hover:text-acid aria-[current=page]:bg-cream/10 aria-[current=page]:text-acid"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <SoundToggle />
            <Link
              href={signedIn ? "/settings" : "/login"}
              className="btn btn-ghost !hidden !min-h-9 !px-4 !text-xs md:!inline-flex"
            >
              {signedIn ? "Account" : "Sign in"}
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cream/30 text-cream md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h10" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside the header: its backdrop blur would otherwise confine this fixed panel to the header. */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="menu-in fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-void px-6 pb-10 pt-6 md:hidden"
        >
          <ul className="space-y-1">
            {LINKS.map((l, i) => (
              <li
                key={l.href}
                className="menu-item"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <Link
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={l.href}
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                  className="group flex items-baseline justify-between border-b border-line py-4 text-cream no-underline"
                >
                  <span>
                    <span className="block font-[family-name:var(--font-heading)] text-4xl group-aria-[current=page]:text-acid">
                      {l.label}
                    </span>
                    <span className="mt-1 block text-sm text-cream/65">
                      {l.hint}
                    </span>
                  </span>
                  <Star size={16} className={l.accent} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={signedIn ? "/settings" : "/login"}
              className="btn btn-primary w-full"
            >
              {signedIn ? "Account & settings" : "Sign in"}
            </Link>
            {!signedIn && (
              <Link href="/signup" className="btn btn-ghost w-full">
                Create an account
              </Link>
            )}
            <Link
              href="/about"
              className="mt-2 text-center text-sm text-cream/70"
            >
              How it works &amp; privacy
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
