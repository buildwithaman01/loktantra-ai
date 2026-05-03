import { sanitizeHtml, stripHtml } from "@/lib/sanitize";

describe("sanitizeHtml", () => {
  it("allows safe HTML tags", () => {
    const input = "<p>Register at <strong>voterportal.eci.gov.in</strong></p>";
    const result = sanitizeHtml(input);
    expect(result).toContain("<p>");
    expect(result).toContain("<strong>");
  });

  it("removes script tags", () => {
    const malicious = '<p>Hello</p><script>alert("xss")</script>';
    const result = sanitizeHtml(malicious);
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("alert");
  });

  it("removes onclick attributes", () => {
    const malicious = '<p onclick="alert(1)">Click me</p>';
    const result = sanitizeHtml(malicious);
    expect(result).not.toContain("onclick");
  });

  it("removes iframe tags", () => {
    const malicious = '<iframe src="https://evil.com"></iframe>';
    const result = sanitizeHtml(malicious);
    expect(result).not.toContain("<iframe>");
  });
});

describe("stripHtml", () => {
  it("removes all HTML tags and returns plain text", () => {
    const input = "<p>Hello <strong>world</strong></p>";
    const result = stripHtml(input);
    expect(result).toBe("Hello world");
    expect(result).not.toContain("<");
  });

  it("returns original string when no HTML present", () => {
    const plain = "Just plain text, no tags.";
    expect(stripHtml(plain)).toBe(plain);
  });
});
