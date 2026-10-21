"use client";
import { useEffect, useState } from "react";
import { onSoundChange, playTap, setSoundEnabled, soundEnabled } from "@/lib/sound/sfx";

/** Header switch for ritual sounds and haptics. */
export function SoundToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(soundEnabled());
    return onSoundChange(setOn);
  }, []);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label="Sound effects"
      title={on ? "Sound on" : "Sound off"}
      onClick={() => {
        setSoundEnabled(!on);
        if (!on) playTap();
      }}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:border-cream aria-pressed:text-acid"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" fillOpacity="0.2" />
        {on ? (
          <>
            <path d="M16.5 8.5a5 5 0 0 1 0 7" />
            <path d="M19 6a8.5 8.5 0 0 1 0 12" />
          </>
        ) : (
          <path d="M17 9.5l5 5M22 9.5l-5 5" />
        )}
      </svg>
    </button>
  );
}
