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
  setLanguage: (lang): void => set({ language: lang }),
  highContrast: false,
  toggleHighContrast: (): void => set((s) => ({ highContrast: !s.highContrast })),
  dyslexiaFont: false,
  toggleDyslexiaFont: (): void => set((s) => ({ dyslexiaFont: !s.dyslexiaFont })),
}));
