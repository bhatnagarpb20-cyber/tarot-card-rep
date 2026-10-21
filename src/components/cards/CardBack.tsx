/** The face-down card design: a rainbow portal arch around an all-seeing eye on a starry void. */
export function CardBack({ className = "" }: { className?: string }) {
  const bands = ["var(--color-teal)", "var(--color-lilac)", "var(--color-hot)", "var(--color-sun)"];
  return (
    <div aria-hidden="true" className={`relative h-full w-full overflow-hidden rounded-[var(--radius-card)] bg-void-sunk ring-1 ring-cream/25 ${className}`}>
      <svg viewBox="0 0 200 300" className="h-full w-full" fill="none">
        <rect x="7" y="7" width="186" height="286" rx="12" stroke="var(--color-acid)" strokeWidth="1.5" />
        {/* Starfield */}
        {[
          [30, 30], [168, 44], [24, 120], [178, 150], [40, 268], [160, 262], [100, 22], [58, 210], [146, 214],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="var(--color-cream)" opacity="0.7" />
        ))}
        {/* Nested portal arch */}
        {bands.map((c, i) => {
          const inset = 26 + i * 11;
          const w = 200 - inset * 2;
          const r = w / 2;
          return <path key={c} d={`M${inset} 282V${60 + r + i * 6}a${r} ${r} 0 0 1 ${w} 0V282`} stroke={c} strokeWidth="7" />;
        })}
        {/* Eye */}
        <path d="M58 168c22-28 62-28 84 0-22 28-62 28-84 0z" fill="var(--color-cream)" stroke="var(--color-acid)" strokeWidth="2.5" />
        <circle cx="100" cy="168" r="15" fill="var(--color-cobalt)" />
        <circle cx="100" cy="168" r="8.5" fill="var(--color-void)" />
        <path d="M100 160.5c.7 4 3.5 6.8 7.5 7.5-4 .7-6.8 3.5-7.5 7.5-.7-4-3.5-6.8-7.5-7.5 4-.7 6.8-3.5 7.5-7.5z" fill="var(--color-cream)" />
        {/* Light rays below the eye */}
        <g stroke="var(--color-acid)" strokeWidth="1.5" strokeLinecap="round" opacity="0.85">
          <path d="M100 200v22M84 198l-8 18M116 198l8 18" />
        </g>
        {/* Moon and sun corners */}
        <path d="M32 46a10 10 0 1 0 8 15 8 8 0 1 1-8-15z" fill="var(--color-sun)" />
        <path d="M168 34c.8 4.6 4.4 8.2 9 9-4.6.8-8.2 4.4-9 9-.8-4.6-4.4-8.2-9-9 4.6-.8 8.2-4.4 9-9z" fill="var(--color-acid)" />
      </svg>
    </div>
  );
}
