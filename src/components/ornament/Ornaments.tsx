/** Decorative SVG ornaments. All are aria-hidden: they carry no information. */

export function Divider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 320 24" className={`mx-auto h-5 w-64 max-w-full text-gold ${className}`} fill="none">
      <path d="M8 12h118M194 12h118" stroke="currentColor" strokeWidth="1" />
      <path d="M126 12c10-9 20-9 26 0-6 9-16 9-26 0zM194 12c-10-9-20-9-26 0 6 9 16 9 26 0z" stroke="currentColor" strokeWidth="1" />
      <path d="M160 3l2.6 6.4L169 12l-6.4 2.6L160 21l-2.6-6.4L151 12l6.4-2.6z" fill="currentColor" />
      <circle cx="8" cy="12" r="2" fill="currentColor" />
      <circle cx="312" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function Star({ className = "", size = 14 }: { className?: string; size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width={size} height={size} className={className} fill="currentColor">
      <path d="M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2z" />
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

/** Art Nouveau corner flourish; rotate via className for other corners. */
export function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={`h-10 w-10 text-gold ${className}`} fill="none" stroke="currentColor" strokeWidth="1.1">
      <path d="M2 62V22C2 10 10 2 22 2h40" />
      <path d="M8 62V26c0-10 8-18 18-18h36" opacity="0.6" />
      <path d="M14 30c6-2 10-8 10-16M24 14c4 6 10 8 16 8" />
      <ellipse cx="20" cy="24" rx="3.2" ry="6" transform="rotate(-45 20 24)" fill="currentColor" opacity="0.5" />
      <circle cx="40" cy="22" r="1.6" fill="currentColor" />
      <circle cx="14" cy="44" r="1.6" fill="currentColor" />
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
      {intro && <p className="mt-4 text-ivory/85">{intro}</p>}
    </header>
  );
}
