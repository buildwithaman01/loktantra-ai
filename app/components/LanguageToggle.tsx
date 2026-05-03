"use client";
import { useAppStore } from "@/lib/store";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हि" },
  { code: "bn", label: "বা" },
] as const;

export default function LanguageToggle(): JSX.Element {
  const { language, setLanguage } = useAppStore();

  return (
    <nav aria-label="Language selection" className="flex bg-white/10 p-1 rounded-xl backdrop-blur-sm border border-white/5">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          aria-label={`Switch to ${lang.code === "en" ? "English" : lang.code === "hi" ? "Hindi" : "Bengali"}`}
          aria-pressed={language === lang.code}
          className={`text-xs font-black px-4 py-2 rounded-lg transition-all
            ${language === lang.code
              ? "bg-white text-blue-900 shadow-md scale-105"
              : "text-white/70 hover:text-white hover:bg-white/5"
            }
            focus:outline-none focus:ring-2 focus:ring-orange-400`}
        >
          {lang.label}
        </button>
      ))}
    </nav>
  );
}
