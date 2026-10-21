/** Decorative SVG ornaments. All are aria-hidden: they carry no information. */

export function Divider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 320 24" className={`mx-auto h-5 w-56 max-w-full ${className}`} fill="none">
      <path d="M12 12h112M196 12h112" stroke="var(--color-line)" strokeWidth="1.2" />
      <path d="M136 12l3.2-1.8L141 7l1.8 3.2L146 12l-3.2 1.8L141 17l-1.8-3.2z" fill="var(--color-hot)" />
      <path d="M160 1l3.2 7.8L171 12l-7.8 3.2L160 23l-3.2-7.8L149 12l7.8-3.2z" fill="var(--color-acid)" />
      <path d="M174 12l3.2-1.8L179 7l1.8 3.2L184 12l-3.2 1.8L179 17l-1.8-3.2z" fill="var(--color-teal)" />
    </svg>
  );
}

/** Four-point sparkle, the brand's basic star. */
export function Star({ className = "", size = 14 }: { className?: string; size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width={size} height={size} className={className} fill="currentColor">
      <path d="M10 0c.9 5.2 4.8 9.1 10 10-5.2.9-9.1 4.8-10 10-.9-5.2-4.8-9.1-10-10C5.2 9.1 9.1 5.2 10 0z" />
    </svg>
  );
}

export function Crescent({ className = "", size = 18 }: { className?: string; size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      <path d="M15.5 2.5a9.5 9.5 0 1 0 6 16.9A8 8 0 1 1 15.5 2.5z" />
    </svg>
  );
}

/** Brand mark: a sun that breathes — sunset core inside a rainbow ring. */
export function BrandMark({ className = "", size = 28 }: { className?: string; size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" width={size} height={size} className={className}>
      <circle cx="16" cy="16" r="15" fill="none" stroke="var(--color-teal)" strokeWidth="2" />
      <circle cx="16" cy="16" r="11.5" fill="none" stroke="var(--color-hot)" strokeWidth="2" />
      <circle cx="16" cy="16" r="8" fill="var(--color-acid)" />
      <path d="M12.2 15.4c.9.8 1.9.8 2.8 0M17 15.4c.9.8 1.9.8 2.8 0" stroke="var(--color-void)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <path d="M14.4 19c1 .7 2.2.7 3.2 0" stroke="var(--color-void)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Nested rainbow arch (portal) — the brand's signature shape. Purely decorative. */
export function RainbowArch({ className = "" }: { className?: string }) {
  const bands = ["var(--color-teal)", "var(--color-cobalt)", "var(--color-lilac)", "var(--color-hot)", "var(--color-sun)", "var(--color-acid)"];
  return (
    <svg aria-hidden="true" viewBox="0 0 400 460" className={className} fill="none" preserveAspectRatio="xMidYMax meet">
      {bands.map((c, i) => {
        const inset = 14 + i * 22;
        const w = 400 - inset * 2;
        const r = w / 2;
        return <path key={c} d={`M${inset} 460V${r + inset}a${r} ${r} 0 0 1 ${w} 0V460`} stroke={c} strokeWidth="14" />;
      })}
    </svg>
  );
}

/** Sparkle cluster for corners. */
export function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={`h-12 w-12 ${className}`}>
      <path d="M22 4c1.4 8 7.6 14.2 15.6 15.6C29.6 21 23.4 27.2 22 35.2 20.6 27.2 14.4 21 6.4 19.6 14.4 18.2 20.6 12 22 4z" fill="var(--color-acid)" />
      <path d="M46 30c.8 4.6 4.4 8.2 9 9-4.6.8-8.2 4.4-9 9-.8-4.6-4.4-8.2-9-9 4.6-.8 8.2-4.4 9-9z" fill="var(--color-hot)" />
      <circle cx="14" cy="50" r="2.4" fill="var(--color-teal)" />
    </svg>
  );
}

/** Framed section heading with eyebrow, title and divider. */
export function SectionHeading({ eyebrow, title, intro, as: Tag = "h1" }: { eyebrow?: string; title: string; intro?: string; as?: "h1" | "h2" }) {
  return (
    <header className="mx-auto max-w-2xl text-center">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className={Tag === "h1" ? "mt-2 text-4xl sm:text-5xl" : "mt-1 text-3xl"}>{title}</Tag>
      <Divider className="mt-4" />
      {intro && <p className="mt-4 text-cream/80">{intro}</p>}
    </header>
  );
}
