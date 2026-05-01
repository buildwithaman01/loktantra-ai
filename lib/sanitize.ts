// Placeholder — Agent 3 fills this module
// DOMPurify input/output sanitizer
import DOMPurify from "isomorphic-dompurify";

export const sanitizeMarkdown = (html: string): string =>
  DOMPurify.sanitize(html);
