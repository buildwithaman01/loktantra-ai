import { ElectionFormSchema, ChatInputSchema, BoothInputSchema } from "@/lib/schemas";

describe("ElectionFormSchema", () => {
  const validFormData = {
    scenario: "new_registration",
    recommendedForm: "Form 6",
    steps: ["Fill form online at voterportal.eci.gov.in", "Attach proof of age", "Submit to BLO"],
    documents: ["Aadhaar Card", "Proof of age (birth certificate)"],
    plainTextReply: "As a first-time voter, you need to fill Form 6 for registration.",
  };

  it("validates correct election form data", () => {
    expect(() => ElectionFormSchema.parse(validFormData)).not.toThrow();
  });

  it("accepts optional deadline field", () => {
    const withDeadline = { ...validFormData, deadline: "November 15, 2026" };
    expect(() => ElectionFormSchema.parse(withDeadline)).not.toThrow();
  });

  it("rejects invalid scenario values", () => {
    const invalid = { ...validFormData, scenario: "invalid_scenario" };
    expect(() => ElectionFormSchema.parse(invalid)).toThrow();
  });

  it("rejects invalid form names", () => {
    const invalid = { ...validFormData, recommendedForm: "Form 99" };
    expect(() => ElectionFormSchema.parse(invalid)).toThrow();
  });

  it("rejects empty steps array", () => {
    const invalid = { ...validFormData, steps: [] };
    expect(() => ElectionFormSchema.parse(invalid)).toThrow();
  });

  it("rejects missing plainTextReply", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { plainTextReply, ...withoutReply } = validFormData;
    expect(() => ElectionFormSchema.parse(withoutReply)).toThrow();
  });
});

describe("ChatInputSchema", () => {
  it("validates correct chat input", () => {
    expect(() => ChatInputSchema.parse({ message: "How do I register to vote?", language: "en" })).not.toThrow();
  });

  it("rejects empty message", () => {
    expect(() => ChatInputSchema.parse({ message: "", language: "en" })).toThrow();
  });

  it("rejects message over 500 characters", () => {
    expect(() => ChatInputSchema.parse({ message: "a".repeat(501), language: "en" })).toThrow();
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

  it("rejects PIN codes with letters", () => {
    expect(() => BoothInputSchema.parse({ pinCode: "80000A" })).toThrow();
  });

  it("rejects empty string", () => {
    expect(() => BoothInputSchema.parse({ pinCode: "" })).toThrow();
  });
});
