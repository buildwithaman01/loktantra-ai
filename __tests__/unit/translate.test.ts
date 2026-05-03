import { translate } from "@/lib/translate";

describe("Translation Utility", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    // Clear cache by resetting module or just testing different strings
  });

  it("returns original text if language is English", async () => {
    const result = await translate("Hello", "en");
    expect(result).toBe("Hello");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("fetches and caches translations", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ translated: "नमस्ते" }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result1 = await translate("Hello", "hi");
    expect(result1).toBe("नमस्ते");
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Second call should use cache
    const result2 = await translate("Hello", "hi");
    expect(result2).toBe("नमस्ते");
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("handles batch translations", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ translated: ["नमस्ते", "स्वागत"] }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await translate(["Hello", "Welcome"], "hi");
    expect(result).toEqual(["नमस्ते", "स्वागत"]);
  });

  it("falls back to original text on API error status", async () => {
    const mockResponse = { ok: false };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    const result = await translate("StatusFail", "hi");
    expect(result).toBe("StatusFail");
  });

  it("falls back to original text on API failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));
    const result = await translate("Fail", "hi");
    expect(result).toBe("Fail");
  });
});
