import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimiter";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`translate-${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  
  const texts = Array.isArray(body.text) ? body.text : [body.text];
  const targetLanguage = body.targetLanguage || "en";

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Translation service unavailable" }, { status: 503 });
  }

  try {
    const url = new URL("https://translation.googleapis.com/language/translate/v2");
    url.searchParams.append("key", apiKey);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        q: texts, 
        target: targetLanguage, 
        format: "text" 
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Google Translate error");
    }

    const data = await res.json() as { data: { translations: Array<{ translatedText: string }> } };
    
    if (Array.isArray(body.text)) {
      const translated = data.data.translations.map(t => t.translatedText);
      return NextResponse.json({ translated });
    } else {
      const translated = data.data.translations[0]?.translatedText ?? body.text;
      return NextResponse.json({ translated });
    }
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
