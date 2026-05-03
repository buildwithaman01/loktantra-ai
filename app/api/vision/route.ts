import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { image, type } = await req.json();

  if (!image) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
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

    // Ensure we have a valid base64 string
    if (!image.includes(",")) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    const base64Data = image.split(",")[1];

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

    const text = result.response.text();
    return NextResponse.json({ result: text });
  } catch (error: unknown) {
    console.error("VISION_API_ERROR:", error);
    const message = (error as { message?: string })?.message?.toLowerCase() || "";
    
    if (message.includes("api key")) {
      return NextResponse.json({ error: "Invalid API Key. Please check your .env file." }, { status: 401 });
    }
    if (message.includes("model not found") || message.includes("model_not_found")) {
      return NextResponse.json({ error: "Model 'gemini-1.5-flash' is not enabled for this API key." }, { status: 404 });
    }
    if (message.includes("429") || message.includes("quota")) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
    }
    if (message.includes("safety")) {
      return NextResponse.json({ error: "Image flagged by safety filters. Please use a standard ID card photo." }, { status: 400 });
    }
    
    return NextResponse.json({ error: "AI Processing Error. Please try a clearer, well-lit photo." }, { status: 500 });
  }
}
