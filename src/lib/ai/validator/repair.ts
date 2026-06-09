

export interface RepairResult {
  html: string;
  repaired: boolean;
  actions: string[];
}

export function repairHtml(rawHtml: string): RepairResult {
  let html = rawHtml.trim();
  const actions: string[] = [];
  let repaired = false;

  // 1. Strip markdown code fences (e.g., ```html ... ```)
  const codeFenceRegex = /```(?:html|xml|markdown)?\s*([\s\S]*?)\s*```/i;
  const match = html.match(codeFenceRegex);
  if (match) {
    html = match[1].trim();
    repaired = true;
    actions.push("Extracted HTML content from markdown code block");
  }

  // 2. Remove conversational text before <!DOCTYPE> or <html>
  const htmlStartRegex = /(<!DOCTYPE html>|<html[\s>])/i;
  const startMatch = html.match(htmlStartRegex);
  if (startMatch && startMatch.index !== undefined && startMatch.index > 0) {
    html = html.substring(startMatch.index).trim();
    repaired = true;
    actions.push("Stripped leading conversational text");
  }

  // 2b. Prepend missing <!DOCTYPE html> if <html> and </html> are present
  if (!/<!DOCTYPE html>/i.test(html) && /<html[\s>]/i.test(html) && /<\/html>/i.test(html)) {
    html = "<!DOCTYPE html>\n" + html;
    repaired = true;
    actions.push("Prepended missing <!DOCTYPE html> declaration");
  }

  // 3. Remove conversational text after </html>
  const htmlEndRegex = /<\/html>/gi;
  const endMatches = [...html.matchAll(htmlEndRegex)];
  if (endMatches.length > 0) {
    // Take the last </html> tag index
    const lastEndMatch = endMatches[endMatches.length - 1];
    if (lastEndMatch.index !== undefined && lastEndMatch.index + 7 < html.length) {
      html = html.substring(0, lastEndMatch.index + 7).trim();
      repaired = true;
      actions.push("Stripped trailing conversational text");
    }
  }

  // 4. Handle multiple or nested <html> wrappers (e.g. duplicate headers)
  // If we see <html> twice before a single closing </html>, or nesting
  // Let's strip duplicate consecutive <!DOCTYPE html>
  if (/(<!DOCTYPE html>\s*){2,}/i.test(html)) {
    html = html.replace(/(<!DOCTYPE html>\s*)+/i, "<!DOCTYPE html>\n");
    repaired = true;
    actions.push("Removed duplicate <!DOCTYPE html> wrappers");
  }

  // 5. Basic malformed element fixes (e.g., unclosed root html if </html> is completely missing)
  if (!/<\/html>/i.test(html) && /<html/i.test(html)) {
    html = html + "\n</html>";
    repaired = true;
    actions.push("Appended missing closing </html> tag");
  }

  return {
    html,
    repaired,
    actions,
  };
}
