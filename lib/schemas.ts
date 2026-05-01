// Placeholder — Agent 3 fills this module
// All Zod schemas (input + Gemini output)
import { z } from "zod";

export const ElectionFormSchema = z.object({
  scenario: z.enum([
    "new_registration",
    "address_change",
    "lost_card",
    "home_voting",
  ]),
  recommendedForm: z.enum(["Form 6", "Form 7", "Form 8", "Form 12D"]),
  steps: z.array(z.string()).min(1).max(10),
  deadline: z.string().optional(),
  documents: z.array(z.string()),
});

export type ElectionFormData = z.infer<typeof ElectionFormSchema>;
