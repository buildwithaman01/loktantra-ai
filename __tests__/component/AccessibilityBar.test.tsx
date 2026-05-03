import { render, screen, fireEvent } from "@testing-library/react";
import AccessibilityBar from "@/app/components/AccessibilityBar";

describe("AccessibilityBar Component", () => {
  beforeEach(() => {
    document.documentElement.className = "";
  });

  it("renders both accessibility buttons", () => {
    render(<AccessibilityBar />);
    expect(screen.getByRole("button", { name: /CONTRAST/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /FONT/i })).toBeInTheDocument();
  });

  it("toggles high-contrast class on document root", () => {
    render(<AccessibilityBar />);
    const btn = screen.getByRole("button", { name: /CONTRAST/i });
    fireEvent.click(btn);
    // Note: useEffect in testing environment might need a tick or act
    expect(document.documentElement.classList.contains("high-contrast")).toBe(true);
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains("high-contrast")).toBe(false);
  });

  it("toggles dyslexia-font class on document root", () => {
    render(<AccessibilityBar />);
    const btn = screen.getByRole("button", { name: /FONT/i });
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains("dyslexia-font")).toBe(true);
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains("dyslexia-font")).toBe(false);
  });
});
