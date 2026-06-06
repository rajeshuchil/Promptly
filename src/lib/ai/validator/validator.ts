import { AI_REFUSAL_PATTERNS, SEMANTIC_TAG_PATTERNS } from "./schemas";
import { repairHtml } from "./repair";
import type { ValidationIssue, ValidationReport, ValidatorOptions } from "./types";

export class HtmlValidator {
  private static instance: HtmlValidator;

  private constructor() {}

  public static getInstance(): HtmlValidator {
    if (!HtmlValidator.instance) {
      HtmlValidator.instance = new HtmlValidator();
    }
    return HtmlValidator.instance;
  }

  /**
   * Run structural and semantic checks on the HTML content.
   */
  public validate(html: string, options?: ValidatorOptions): ValidationReport {
    const minLength = options?.minLength ?? 200;
    const maxLength = options?.maxLength ?? 120000;
    const requireSemantic = options?.requireSemantic ?? true;

    const issues: ValidationIssue[] = [];
    
    // 1. Type check
    if (typeof html !== "string") {
      issues.push({
        rule: "is_string",
        message: "Generated output must be a string",
        severity: "error",
      });
      return {
        valid: false,
        repaired: false,
        issues: issues.map((i) => `[${i.severity.toUpperCase()}] ${i.message}`),
        html: String(html || ""),
      };
    }

    // 2. Empty/Existence check
    if (!html || html.trim().length === 0) {
      issues.push({
        rule: "non_empty",
        message: "Generated output is empty",
        severity: "error",
      });
      return {
        valid: false,
        repaired: false,
        issues: issues.map((i) => `[${i.severity.toUpperCase()}] ${i.message}`),
        html,
      };
    }

    const trimmedHtml = html.trim();

    // 3. Length threshold checks
    if (trimmedHtml.length < minLength) {
      issues.push({
        rule: "min_length",
        message: `Content length (${trimmedHtml.length}) is below the threshold of ${minLength} characters`,
        severity: "error",
      });
    }
    if (trimmedHtml.length > maxLength) {
      issues.push({
        rule: "max_length",
        message: `Content length (${trimmedHtml.length}) exceeds the maximum limit of ${maxLength} characters`,
        severity: "error",
      });
    }

    // 4. AI Refusal/Failure check
    for (const pattern of AI_REFUSAL_PATTERNS) {
      if (pattern.test(trimmedHtml)) {
        issues.push({
          rule: "ai_refusal",
          message: `Potential AI refusal or error response detected matching pattern: ${pattern.source}`,
          severity: "error",
        });
        break; // Stop at first matched refusal pattern
      }
    }

    // 5. Required root element checks
    if (!/<!DOCTYPE html>/i.test(trimmedHtml)) {
      issues.push({
        rule: "doctype_missing",
        message: "Missing <!DOCTYPE html> declaration",
        severity: "error",
      });
    }

    if (!/<html[\s>]/i.test(trimmedHtml) || !/<\/html>/i.test(trimmedHtml)) {
      issues.push({
        rule: "html_element_missing",
        message: "Missing opening or closing <html> tags",
        severity: "error",
      });
    }

    if (!/<head[\s>]/i.test(trimmedHtml) || !/<\/head>/i.test(trimmedHtml)) {
      issues.push({
        rule: "head_element_missing",
        message: "Missing opening or closing <head> tags",
        severity: "error",
      });
    }

    if (!/<body[\s>]/i.test(trimmedHtml) || !/<\/body>/i.test(trimmedHtml)) {
      issues.push({
        rule: "body_element_missing",
        message: "Missing opening or closing <body> tags",
        severity: "error",
      });
    }

    // 5b. Code fence check
    if (/(^|\n)```/.test(trimmedHtml)) {
      issues.push({
        rule: "markdown_fence_leak",
        message: "Generated output contains markdown code fences",
        severity: "error",
      });
    }

    // 6. Semantic checks
    if (requireSemantic) {
      if (!SEMANTIC_TAG_PATTERNS.header.test(trimmedHtml)) {
        issues.push({
          rule: "semantic_header_missing",
          message: "Missing semantic header or navigation element (<header> or <nav>)",
          severity: "warning",
        });
      }
      if (!SEMANTIC_TAG_PATTERNS.main.test(trimmedHtml)) {
        issues.push({
          rule: "semantic_main_missing",
          message: "Missing main content container (<main> or a primary section)",
          severity: "warning",
        });
      }
      if (!SEMANTIC_TAG_PATTERNS.footer.test(trimmedHtml)) {
        issues.push({
          rule: "semantic_footer_missing",
          message: "Missing semantic footer element (<footer>)",
          severity: "warning",
        });
      }
    }

    // Check if there are any error severity issues
    const hasErrors = issues.some((issue) => issue.severity === "error");

    return {
      valid: !hasErrors,
      repaired: false,
      issues: issues.map((i) => `[${i.severity.toUpperCase()}] ${i.rule}: ${i.message}`),
      html,
    };
  }

  /**
   * Validate HTML, apply repair steps if needed, and return the final status.
   */
  public validateAndRepair(html: string, options?: ValidatorOptions): ValidationReport {
    // Initial validation
    const initialReport = this.validate(html, options);
    if (initialReport.valid) {
      return initialReport;
    }

    // Attempt repair
    const repairResult = repairHtml(html);
    
    // Validate repaired HTML
    const repairedReport = this.validate(repairResult.html, options);

    // If repair was applied, document it
    const finalIssues = [...repairedReport.issues];
    if (repairResult.repaired) {
      for (const action of repairResult.actions) {
        finalIssues.push(`[WARNING] repair_applied: Auto-repair action: ${action}`);
      }
    }

    return {
      valid: repairedReport.valid,
      repaired: repairResult.repaired || initialReport.repaired,
      issues: finalIssues,
      html: repairResult.html,
    };
  }
}
