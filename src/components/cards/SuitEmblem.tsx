import type { Suit } from "@/lib/tarot/types";

/** Simple line emblems for the four suits, used on pending card faces and in the deck library. */
export function SuitEmblem({ suit, className = "" }: { suit: Suit; className?: string }) {
  const common = { "aria-hidden": true as const, viewBox: "0 0 48 48", className, fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (suit) {
    case "wands":
      return (
        <svg {...common}>
          <path d="M18 44L30 4" />
          <path d="M26 16c4-2 7-1 9 1-3 1-6 1-9-1zM22 28c-4-1-7 0-9 3 3 0 6 0 9-3zM28 10c1-3 3-5 6-5-1 3-3 5-6 5z" fill="currentColor" fillOpacity="0.35" />
        </svg>
      );
    case "cups":
      return (
        <svg {...common}>
          <path d="M12 8h24c0 10-5 17-12 17S12 18 12 8z" />
          <path d="M24 25v11M16 42h16M19 36h10" />
          <path d="M15 12h18" opacity="0.6" />
        </svg>
      );
    case "swords":
      return (
        <svg {...common}>
          <path d="M24 3v32" />
          <path d="M21 6l3-3 3 3v29h-6z" fill="currentColor" fillOpacity="0.2" />
          <path d="M14 35h20M24 35v8M21 45h6" />
        </svg>
      );
    case "pentacles":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="18" />
          <circle cx="24" cy="24" r="14.5" opacity="0.6" />
          <path d="M24 11l3.9 12h12.4l-10 7.3 3.8 12-10.1-7.4-10.1 7.4 3.8-12-10-7.3h12.4z" transform="scale(0.72) translate(9.3 9.6)" />
        </svg>
      );
  }
}
