import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/gemini";
import { ChatInputSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/rateLimiter";

export async function POST(req: NextRequest): Promise<Response> {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`chat-${ip}`, 10, 60_000)) {
    return new Response(JSON.stringify({ error: "Too many requests. Please wait." }), { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ChatInputSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
  }

  const { message, language, userProfile } = parsed.data;
  const prompt = `${SYSTEM_PROMPT}\n\nUser Profile: ${JSON.stringify(userProfile)}\nLanguage preference: ${language}\nUser message: ${message}`;

  const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"];
  const keysToTry = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter(Boolean) as string[];

  const encoder = new TextEncoder();

  // Create a TransformStream to handle our output
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Handle the logic in an async block
  (async () => {
    let success = false;

    for (const modelName of modelsToTry) {
      if (success) break;
      for (const apiKey of keysToTry) {
        if (success) break;

        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContentStream(prompt);

          success = true; // If we get here, the stream has started
          
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              await writer.write(encoder.encode(chunkText));
            }
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Chat API Error";
          console.error(`Error with ${modelName}:`, errorMessage);
          const errorWithStatus = error as { status?: number };
          if (errorWithStatus.status === 429 || errorWithStatus.status === 404 || errorMessage.includes("not found")) {
            // Cascade to next key/model
            continue;
          } else if (success) {
            // We already started streaming, so we can't retry cleanly
            await writer.write(encoder.encode("\n\n[Error: Stream interrupted. Please refresh.]"));
            break;
          }
        }
      }
    }

    if (!success) {
      await writer.write(encoder.encode(JSON.stringify({ error: "All AI models are currently busy. Please try again." })));
    }
    
    await writer.close();
  })().catch(err => {
    console.error("Critical streaming error:", err);
    writer.abort(err);
  });

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
