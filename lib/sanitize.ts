import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes HTML string to prevent XSS.
 * Use on ALL Gemini outputs before rendering as HTML.
 */
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["p", "strong", "em", "ul", "ol", "li", "br", "h3", "h4"],
    ALLOWED_ATTR: [],
  });
}

/**
 * Strips all HTML tags, returns plain text.
 */
export function stripHtml(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}
