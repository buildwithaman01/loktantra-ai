import { renderHook, act } from "@testing-library/react";
import { useAppStore } from "@/lib/store";

describe("Global App Store (Zustand)", () => {
  it("initializes with default values", () => {
    const { result } = renderHook(() => useAppStore());
    expect(result.current.language).toBe("en");
    expect(result.current.highContrast).toBe(false);
    expect(result.current.dyslexiaFont).toBe(false);
  });

  it("updates language correctly", () => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.setLanguage("hi");
    });
    expect(result.current.language).toBe("hi");
  });

  it("toggles accessibility modes", () => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.setHighContrast(true);
      result.current.setDyslexiaFont(true);
    });
    expect(result.current.highContrast).toBe(true);
    expect(result.current.dyslexiaFont).toBe(true);
  });
});
