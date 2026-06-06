import { z } from "zod";

export const AI_REFUSAL_PATTERNS = [
  /i am sorry/i,
  /i cannot/i,
  /i apologize/i,
  /unable to generate/i,
  /rate limit/i,
  /safety guidelines/i,
  /violates policy/i,
  /context length exceeded/i,
  /internal server error/i,
  /api key/i,
];

/**
 * Semantic HTML tag patterns.
 */
export const SEMANTIC_TAG_PATTERNS = {
  header: /<(header|nav)[\s>]/i,
  main: /<(main|section|div[^>]*id=["']main["'])[\s>]/i,
  footer: /<footer[\s>]/i,
};
