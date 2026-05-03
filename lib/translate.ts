// Translation utility with client-side caching
const cache: Record<string, string> = {};

/**
 * Translates text using the internal /api/translate endpoint.
 * Supports single strings or arrays for efficiency.
 */
export async function translate<T extends string | string[]>(
  text: T,
  targetLanguage: string
): Promise<T> {
  if (!text || targetLanguage === "en") return text;

  // Check cache for single strings
  if (typeof text === "string" && cache[`${targetLanguage}:${text}`]) {
    return cache[`${targetLanguage}:${text}`] as T;
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage }),
    });

    if (!res.ok) return text;

    const data = await res.json();
    const result = data.translated;

    // Cache results
    if (typeof text === "string") {
      cache[`${targetLanguage}:${text}`] = result;
    } else if (Array.isArray(text) && Array.isArray(result)) {
      text.forEach((original, i) => {
        cache[`${targetLanguage}:${original}`] = result[i];
      });
    }

    return result;
  } catch (err) {
    console.error("Translation helper error:", err);
    return text;
  }
}
