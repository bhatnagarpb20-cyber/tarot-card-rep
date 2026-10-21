/** Decorative burst of sparkles radiating from behind a card at the moment it is revealed. */
const COLORS = ["var(--color-acid)", "var(--color-hot)", "var(--color-teal)", "var(--color-cream)", "var(--color-sun)"];

export function SparkleBurst({ count = 18 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 360 + (i % 2 ? 7 : -5);
        const distance = 150 + (i % 4) * 34;
        const size = 8 + (i % 3) * 5;
        return (
          <svg
            key={i}
            viewBox="0 0 20 20"
            width={size}
            height={size}
            className="sparkle absolute"
            style={{
              ["--angle" as string]: `${angle}deg`,
              ["--distance" as string]: `${distance}px`,
              animationDelay: `${(i % 5) * 40}ms`,
              color: COLORS[i % COLORS.length],
            }}
            fill="currentColor"
          >
            <path d="M10 0c.9 5.2 4.8 9.1 10 10-5.2.9-9.1 4.8-10 10-.9-5.2-4.8-9.1-10-10C5.2 9.1 9.1 5.2 10 0z" />
          </svg>
        );
      })}
    </div>
  );
}
