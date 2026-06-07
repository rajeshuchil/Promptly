import type { Plan } from "../ai/planner/schemas";
import { compileDesignSystemKnowledge } from "../design-system";

export const PLAN_EDITOR_SYSTEM_PROMPT = `You are FastApp's elite Design Plan Editor. Your role is to modify an existing design plan based on user feedback.

You must:
1. Inspect the original design plan (JSON format).
2. Read the user's revision request.
3. Update appropriate properties of the plan:
   - Add/remove/reorder "sections" and "components"
   - Update "theme", "layout", "designTokens" (colors, border radius, shadows)
   - Update "typography" and styling keywords
4. Maintain consistency with the FastApp Design Catalog and instructions.
5. output ONLY valid JSON matching the PlanSchema. Do not write explanation markdown fences.`;

export function buildPlanEditorUserPrompt(originalPlan: Plan, editPrompt: string): string {
  const designSystem = compileDesignSystemKnowledge();

  return `
[FASTAPP SYSTEM DESIGN CATALOG]
${designSystem}

[ORIGINAL PLAN]
${JSON.stringify(originalPlan, null, 2)}

[USER EDIT REQUEST]
"${editPrompt}"

Please revise the plan now. Return the entire modified plan as valid JSON.`;
}

export const HTML_EDITOR_SYSTEM_PROMPT = `You are FastApp's Master HTML Code Editor. Your role is to revise an existing HTML page based on an updated design plan and a user's instruction.

You must:
1. Inspect the original generated HTML (with inline Tailwind styles/classes).
2. Study the updated design plan (JSON).
3. Read the user's edit request.
4. Output the fully modified HTML document.
5. Strictly adhere to these guidelines:
   - Keep unchanged components/sections intact; do not rewrite or simplify them.
   - Inject the new styling classes, sections, components, or content requested by the user.
   - Do not bypass the design catalog's color patterns, shadows, and typography.
   - Keep responsive structure (mobile-first), alt tags on images, and ARIA labels on controls.
   - Do not emit markdown code fences. Output ONLY the raw HTML document starting with <!DOCTYPE html>.`;

export function buildHtmlEditorUserPrompt(
  originalHtml: string,
  updatedPlan: Plan,
  editPrompt: string
): string {
  const designSystem = compileDesignSystemKnowledge();

  return `
[DESIGN CATALOG CONTEXT]
${designSystem}

[UPDATED DESIGN PLAN]
${JSON.stringify(updatedPlan, null, 2)}

[USER EDIT REQUEST]
"${editPrompt}"

[ORIGINAL HTML]
${originalHtml}

Generate the updated HTML document now.`;
}
