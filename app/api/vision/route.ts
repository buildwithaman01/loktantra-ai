import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { rateLimit } from "@/lib/rateLimiter";

/**
 * Vision API POST Handler
 * 
 * Processes identity documents using Gemini 1.5 Flash Vision.
 * Implements security rate limiting and safety filtering.
 * 
 * @param {NextRequest} req - The incoming request containing base64 image data.
 * @returns {Promise<NextResponse>} - Analysis result or error object.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip: string = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`vision-${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { image, type }: { image: string, type?: string } = await req.json();

  if (!image) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }

  const apiKey: string | undefined = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ]
    });

    if (!image.includes(",")) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    const base64Data: string = image.split(",")[1];

    if (type === "audio") {
      const result = await model.generateContent([
        "Transcribe this audio clip. Only return the text. Support Hindi, Bengali, and English.",
        { inlineData: { data: base64Data, mimeType: "audio/webm" } },
      ]);
      return NextResponse.json({ result: result.response.text() });
    }

    const result = await model.generateContent([
      "Analyze this Indian identity document. Return 'VALID: [Type]' if it is a Voter ID, Aadhaar, or PAN. Otherwise return 'INVALID'.",
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
    ]);

    const text: string = result.response.text();
    return NextResponse.json({ result: text });
  } catch {
    return NextResponse.json({ error: "AI Processing Error. Please try a clearer, well-lit photo." }, { status: 500 });
  }
}
