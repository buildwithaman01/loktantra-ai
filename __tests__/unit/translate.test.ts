import { translate } from "@/lib/translate";

// Mock fetch globally
global.fetch = jest.fn();

describe("translate utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns original text if target is 'en'", async () => {
    const result = await translate("Hello English", "en");
    expect(result).toBe("Hello English");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns original text if text is empty", async () => {
    const result = await translate("", "hi");
    expect(result).toBe("");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("calls API for new translations and caches them", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ translated: "नमस्ते" }),
    });

    const result1 = await translate("Hello Cache", "hi");
    expect(result1).toBe("नमस्ते");
    expect(fetch).toHaveBeenCalledTimes(1);

    // Second call should use cache
    const result2 = await translate("Hello Cache", "hi");
    expect(result2).toBe("नमस्ते");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("handles array translations", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ translated: ["नमस्ते", "स्वागत"] }),
    });

    const result = await translate(["Word1", "Word2"], "hi");
    expect(result).toEqual(["नमस्ते", "स्वागत"]);
  });

  it("gracefully falls back to original text on API error", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    // Use a fresh string that isn't cached
    const result = await translate("Error Test 1", "hi");
    expect(result).toBe("Error Test 1");
  });

  it("gracefully falls back on network failure", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    // Use a fresh string that isn't cached
    const result = await translate("Error Test 2", "hi");
    expect(result).toBe("Error Test 2");
  });
});
