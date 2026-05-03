import { useAppStore } from "@/lib/store";

describe("app store", () => {
  it("initializes with default values", () => {
    const state = useAppStore.getState();
    expect(state.language).toBe("en");
    expect(state.highContrast).toBe(false);
    expect(state.dyslexiaFont).toBe(false);
  });

  it("updates language", () => {
    useAppStore.getState().setLanguage("hi");
    expect(useAppStore.getState().language).toBe("hi");
  });

  it("toggles high contrast", () => {
    const initial = useAppStore.getState().highContrast;
    useAppStore.getState().toggleHighContrast();
    expect(useAppStore.getState().highContrast).toBe(!initial);
  });

  it("toggles dyslexia font", () => {
    const initial = useAppStore.getState().dyslexiaFont;
    useAppStore.getState().toggleDyslexiaFont();
    expect(useAppStore.getState().dyslexiaFont).toBe(!initial);
  });
});
