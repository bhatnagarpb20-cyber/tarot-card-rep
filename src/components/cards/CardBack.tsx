/** The face-down card design: midnight field, gold sun-and-moon medallion, starfield border. */
export function CardBack({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative h-full w-full overflow-hidden rounded-[var(--radius-card)] bg-[radial-gradient(circle_at_50%_50%,var(--color-indigo),var(--color-ink))] ring-1 ring-gold/70 ${className}`}>
      <svg viewBox="0 0 200 300" className="h-full w-full text-gold" fill="none" stroke="currentColor">
        <rect x="8" y="8" width="184" height="284" rx="10" strokeWidth="2" />
        <rect x="15" y="15" width="170" height="270" rx="6" strokeWidth="0.8" opacity="0.6" />
        <g strokeWidth="0.8" opacity="0.55">
          <circle cx="100" cy="150" r="62" />
          <circle cx="100" cy="150" r="50" />
          <path d="M100 70v160M20 150h160M43 93l114 114M157 93L43 207" opacity="0.5" />
        </g>
        <circle cx="100" cy="150" r="24" fill="currentColor" fillOpacity="0.15" strokeWidth="1.2" />
        <path d="M108 132a20 20 0 1 0 0 36 16 16 0 1 1 0-36z" fill="currentColor" stroke="none" />
        {[
          [100, 40], [100, 260], [40, 60], [160, 60], [40, 240], [160, 240], [30, 150], [170, 150],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y - 6}l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z`} fill="currentColor" stroke="none" />
        ))}
      </svg>
    </div>
  );
}
