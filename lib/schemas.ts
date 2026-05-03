/**
 * Election Form Schemas and Type Definitions
 */
import { z } from "zod";

/**
 * User Profile Schema
 */
export const UserProfileSchema = z.object({
  age: z.string(),
  state: z.string(),
  voterStatus: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

/**
 * Election Form Selection Schema
 * 
 * Defines the structured JSON output required from Gemini for
 * personalized voter guidance.
 */
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
  documents: z.array(z.string()).min(1),
  deadline: z.string().optional(),
  plainTextReply: z.string().optional(),
});

export type ElectionFormData = z.infer<typeof ElectionFormSchema>;

/**
 * Chat Input Validation Schema
 */
export const ChatInputSchema = z.object({
  message: z.string().min(1).max(5000),
  language: z.enum(["en", "hi", "bn"]).default("en"),
  userProfile: UserProfileSchema.optional(),
});

/**
 * Booth Input Validation Schema
 */
export const BoothInputSchema = z.object({
  pinCode: z.string().length(6).regex(/^\d+$/),
});
