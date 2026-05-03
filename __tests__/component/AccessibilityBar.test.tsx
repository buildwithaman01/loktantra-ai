import { render, screen, fireEvent } from "@testing-library/react";
import AccessibilityBar from "@/app/components/AccessibilityBar";

describe("AccessibilityBar", () => {
  beforeEach(() => {
    document.documentElement.className = "";
  });

  it("renders both accessibility buttons", () => {
    render(<AccessibilityBar />);
    expect(screen.getByRole("button", { name: /high contrast/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dyslexia/i })).toBeInTheDocument();
  });

  it("toggles high-contrast class on document root when clicked", () => {
    render(<AccessibilityBar />);
    const btn = screen.getByRole("button", { name: /enable high contrast/i });
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains("high-contrast")).toBe(true);
  });

  it("removes high-contrast class on second click", () => {
    render(<AccessibilityBar />);
    const btn = screen.getByRole("button", { name: /enable high contrast/i });
    fireEvent.click(btn);
    fireEvent.click(screen.getByRole("button", { name: /disable high contrast/i }));
    expect(document.documentElement.classList.contains("high-contrast")).toBe(false);
  });

  it("high contrast button has correct aria-pressed state", () => {
    render(<AccessibilityBar />);
    const btn = screen.getByRole("button", { name: /enable high contrast/i });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(btn);
    expect(screen.getByRole("button", { name: /disable high contrast/i }))
      .toHaveAttribute("aria-pressed", "true");
  });

  it("toggles dyslexia-font class on document root", () => {
    render(<AccessibilityBar />);
    const btn = screen.getByRole("button", { name: /enable dyslexia/i });
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains("dyslexia-font")).toBe(true);
  });
});
