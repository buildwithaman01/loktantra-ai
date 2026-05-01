"use client";

// Placeholder — Agent 2 fills this component
export default function AccessibilityBar(): JSX.Element {
  return (
    <div aria-label="Accessibility options" className="flex gap-2 mt-2">
      <button
        aria-label="Toggle high contrast mode"
        className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
      >
        High Contrast
      </button>
      <button
        aria-label="Toggle dyslexia-friendly font"
        className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
      >
        Dyslexia Font
      </button>
    </div>
  );
}
