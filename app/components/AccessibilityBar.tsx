"use client";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

/**
 * AccessibilityBar Component
 * 
 * Provides global toggles for accessibility features including:
 * - High Contrast Mode (WCAG 2.1 compliance)
 * - Dyslexia-Friendly Typography (OpenDyslexic inspired)
 * 
 * Syncs state with the global AppStore for cross-session persistence.
 */
export default function AccessibilityBar(): JSX.Element {
  const { highContrast, dyslexiaFont, setHighContrast, setDyslexiaFont } = useAppStore();

  useEffect((): void => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect((): void => {
    document.documentElement.classList.toggle("dyslexia-font", dyslexiaFont);
  }, [dyslexiaFont]);

  return (
    <aside aria-label="Accessibility options" className="flex gap-2 p-1 bg-white/5 rounded-xl backdrop-blur-sm border border-white/5">
      <button
        onClick={() => setHighContrast(!highContrast)}
        aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
        aria-pressed={highContrast}
        className={`text-xs font-bold px-3 py-2 rounded-lg border transition-all
          ${highContrast 
            ? "bg-yellow-400 border-yellow-400 text-black shadow-md scale-105" 
            : "border-white/30 text-white/80 hover:border-white/60 hover:text-white"}`}
      >
        CONTRAST
      </button>
      <button
        onClick={() => setDyslexiaFont(!dyslexiaFont)}
        aria-label={dyslexiaFont ? "Disable dyslexia-friendly font" : "Enable dyslexia-friendly font"}
        aria-pressed={dyslexiaFont}
        className={`text-xs font-bold px-3 py-2 rounded-lg border transition-all
          ${dyslexiaFont 
            ? "bg-green-400 border-green-400 text-black shadow-md scale-105" 
            : "border-white/30 text-white/80 hover:border-white/60 hover:text-white"}`}
      >
        FONT
      </button>
    </aside>
  );
}
