export interface ValidationIssue {
  rule: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationReport {
  valid: boolean;
  repaired: boolean;
  issues: ValidationIssue[];
  html: string;
}

export interface ValidatorOptions {
  minLength?: number;
  maxLength?: number;
  requireSemantic?: boolean;
}
