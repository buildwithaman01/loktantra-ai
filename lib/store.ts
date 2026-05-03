import { create } from "zustand";

type Language = "en" | "hi" | "bn";

interface AppStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (val: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  language: "en",
  setLanguage: (lang): void => set({ language: lang }),
  highContrast: false,
  setHighContrast: (val): void => set({ highContrast: val }),
  dyslexiaFont: false,
  setDyslexiaFont: (val): void => set({ dyslexiaFont: val }),
}));
