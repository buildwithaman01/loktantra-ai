import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OnboardingForm from "@/app/components/OnboardingForm";
import { useAppStore } from "@/lib/store";

// Mock the global translate function
jest.mock("../../lib/translate", () => ({
  translate: jest.fn((text) => Promise.resolve(text)),
}));

describe("Golden Path Integration Test", () => {
  it("completes the full onboarding flow", async () => {
    render(<OnboardingForm />);
    
    // Select age
    fireEvent.change(screen.getByLabelText(/Enter your age/i), { target: { value: "25" } });
    
    // Select state
    fireEvent.change(screen.getByLabelText(/Select your state/i), { target: { value: "Bihar" } });
    
    // Select scenario (radio)
    fireEvent.click(screen.getByLabelText(/I want to register as a new voter \(Form 6\)/i));
    
    // Click submit
    fireEvent.click(screen.getByRole("button", { name: /Generate my personalized election guide/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Bihar/i)).toBeInTheDocument();
    });
  });
});
