import type { QualityReport } from "./quality-evaluator";
import type { Plan } from "../planner/schemas";

export interface ValidationIssue {
  rule: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationReport {
  valid: boolean;
  repaired: boolean;
  issues: string[];
  html: string;
  quality?: QualityReport;
}

export interface ValidatorOptions {
  minLength?: number;
  maxLength?: number;
  requireSemantic?: boolean;
  plan?: Plan;
}
