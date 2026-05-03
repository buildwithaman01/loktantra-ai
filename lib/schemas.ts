import { z } from "zod";

// Input validation schemas
export const ChatInputSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Message too long")
    .trim(),
  language: z.enum(["en", "hi", "bn"]).default("en"),
  userProfile: z.object({
    age: z.string(),
    state: z.string(),
    voterStatus: z.string(),
  }).optional(),
});

export const TranslateInputSchema = z.object({
  text: z.union([z.string(), z.array(z.string())]),
  targetLanguage: z.string(),
});

export const BoothInputSchema = z.object({
  pinCode: z
    .string()
    .regex(/^\d{6}$/, "PIN code must be exactly 6 digits"),
});

// Gemini output validation schema
export const ElectionFormSchema = z.object({
  scenario: z.enum([
    "new_registration",
    "address_change",
    "correction",
    "lost_card",
    "home_voting",
    "overseas_voter",
    "service_voter",
    "general_info",
  ]),
  recommendedForm: z.enum([
    "Form 6",
    "Form 6A",
    "Form 7",
    "Form 8",
    "Form 12D",
    "Form 2/2A/3",
    "No form needed",
  ]),
  steps: z.array(z.string()).min(1).max(10),
  deadline: z.string().optional(),
  documents: z.array(z.string()).min(0).max(10),
  plainTextReply: z.string().min(1, "A plain text response is required"),
});

export type ElectionFormData = z.infer<typeof ElectionFormSchema>;
export type ChatInput = z.infer<typeof ChatInputSchema>;
