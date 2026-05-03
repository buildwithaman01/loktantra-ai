import { ElectionFormSchema, ChatInputSchema, BoothInputSchema } from "@/lib/schemas";

describe("ElectionFormSchema", () => {
  const validFormData = {
    scenario: "new_registration",
    recommendedForm: "Form 6",
    steps: ["Step 1", "Step 2"],
    documents: ["ID Proof"],
    plainTextReply: "Hello"
  };

  it("validates correct form data", () => {
    expect(() => ElectionFormSchema.parse(validFormData)).not.toThrow();
  });

  it("accepts missing deadline", () => {
    const { ...withoutDeadline } = validFormData;
    expect(() => ElectionFormSchema.parse(withoutDeadline)).not.toThrow();
  });
});

describe("ChatInputSchema", () => {
  it("validates correct input", () => {
    expect(() => ChatInputSchema.parse({ message: "Hello", language: "hi" })).not.toThrow();
  });

  it("rejects invalid language code", () => {
    expect(() => ChatInputSchema.parse({ message: "Hello", language: "zz" })).toThrow();
  });

  it("defaults language to 'en' when not provided", () => {
    const result = ChatInputSchema.parse({ message: "Hello" });
    expect(result.language).toBe("en");
  });
});

describe("BoothInputSchema", () => {
  it("validates correct 6-digit PIN code", () => {
    expect(() => BoothInputSchema.parse({ pinCode: "800001" })).not.toThrow();
  });

  it("rejects PIN codes shorter than 6 digits", () => {
    expect(() => BoothInputSchema.parse({ pinCode: "12345" })).toThrow();
  });

  it("rejects non-numeric PIN codes", () => {
    expect(() => BoothInputSchema.parse({ pinCode: "ABCDEF" })).toThrow();
  });
});
