// GAP 1 Fix — Zustand store for language and accessibility state
import { create } from "zustand";

type Language = "en" | "hi" | "bn";

interface AppStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  dyslexiaFont: boolean;
  toggleDyslexiaFont: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  language: "en",
  setLanguage: (lang) => set({ language: lang }),
  highContrast: false,
  toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
  dyslexiaFont: false,
  toggleDyslexiaFont: () => set((s) => ({ dyslexiaFont: !s.dyslexiaFont })),
}));
