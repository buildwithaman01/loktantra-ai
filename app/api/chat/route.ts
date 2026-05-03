import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/gemini";
import { ChatInputSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/rateLimiter";

/**
 * Chat API POST Handler
 * 
 * Orchestrates a streaming AI conversation with multi-model failover.
 * Supports gemini-2.5-flash and gemini-1.5-flash fallback.
 * 
 * @param {NextRequest} req - The incoming request with message and userProfile.
 * @returns {Promise<Response>} - A streaming text/event-stream response.
 */
export async function POST(req: NextRequest): Promise<Response> {
  const ip: string = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`chat-${ip}`, 10, 60_000)) {
    return new Response(JSON.stringify({ error: "Too many requests. Please wait." }), { status: 429 });
  }

  const body: unknown = await req.json().catch(() => null);
  const parsed = ChatInputSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
  }

  const { message, language, userProfile } = parsed.data;
  const prompt: string = `${SYSTEM_PROMPT}\n\nUser Profile: ${JSON.stringify(userProfile)}\nLanguage preference: ${language}\nUser message: ${message}`;

  const modelsToTry: string[] = ["gemini-2.5-flash", "gemini-1.5-flash"];
  const keysToTry: string[] = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter((k): k is string => !!k);

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  (async (): Promise<void> => {
    let success: boolean = false;

    for (const modelName of modelsToTry) {
      if (success) break;
      for (const apiKey of keysToTry) {
        if (success) break;

        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContentStream(prompt);

          success = true; 
          
          for await (const chunk of result.stream) {
            const chunkText: string = chunk.text();
            if (chunkText) {
              await writer.write(encoder.encode(chunkText));
            }
          }
        } catch (error: unknown) {
          const errorMessage: string = error instanceof Error ? error.message : "Chat API Error";
          const errorWithStatus = error as { status?: number };
          if (errorWithStatus.status === 429 || errorWithStatus.status === 404 || errorMessage.includes("not found")) {
            continue;
          } else if (success) {
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
  })().catch((): void => {
    writer.abort();
  });

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
