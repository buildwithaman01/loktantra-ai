import { render, screen } from "@testing-library/react";
import ChatAssistant from "@/app/components/ChatAssistant";
import IDScanner from "@/app/components/IDScanner";
import OnboardingForm from "@/app/components/OnboardingForm";
import EligibilityWizard from "@/app/components/EligibilityWizard";

describe("Accessibility & Semantic HTML Audit", () => {
  const mockProfile = { age: "25", state: "Bihar", voterStatus: "new_registration" };

  it("ChatAssistant has proper ARIA live regions and roles", () => {
    render(<ChatAssistant userProfile={mockProfile} />);
    expect(screen.getByRole("log")).toBeInTheDocument();
    expect(screen.getByRole("log")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByPlaceholderText(/Ask a question/i)).toBeInTheDocument();
  });

  it("IDScanner uses descriptive icons and buttons", () => {
    render(<IDScanner onResult={() => {}} />);
    expect(screen.getByRole("button", { name: /UPLOAD YOUR ID CARD/i })).toBeInTheDocument();
    expect(screen.getByText(/Files are processed instantly/i)).toBeInTheDocument();
  });

  it("OnboardingForm uses proper form structure", () => {
    render(<OnboardingForm />);
    expect(screen.getByRole("heading", { name: /Personalize your guide/i })).toBeInTheDocument();
  });

  it("Home Voting Checker has correct semantic structure", () => {
    render(<EligibilityWizard />);
    expect(screen.getByText(/Home Voting Checker/i)).toBeInTheDocument();
    expect(screen.getByText(/FORM 12D/i)).toBeInTheDocument();
  });
});
