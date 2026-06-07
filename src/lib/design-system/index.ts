import { COLOR_SYSTEMS, SPACING, BORDER_RADIUS, SHADOWS } from "./tokens";
import { FONT_PAIRINGS, TYPOGRAPHY_SCALE, TYPOGRAPHY_RULES } from "./typography";
import { LAYOUT_BLUEPRINTS } from "./layouts";
import { SECTION_BLUEPRINTS } from "./sections";
import { COMPONENT_CATALOG } from "./components";
import { DESIGN_PATTERNS } from "./patterns";

export * from "./tokens";
export * from "./typography";
export * from "./layouts";
export * from "./sections";
export * from "./components";
export * from "./patterns";

/**
 * Compiles the design system knowledge base into an formatted guidelines string.
 * This is injected into the AI planner & generator prompts.
 */
export function compileDesignSystemKnowledge(): string {
  const sectionsText = Object.entries(SECTION_BLUEPRINTS)
    .map(([key, value]) => {
      return `### SECTION: ${value.name} (${key})
- Description: ${value.description}
- Recommended Classes: "${value.recommendedClasses}"
- Included Subcomponents: ${value.subComponents.join(", ")}
- Structural HTML/Tailwind rules:
${value.htmlGuidance.trim()}`;
    })
    .join("\n\n");

  const componentsText = Object.entries(COMPONENT_CATALOG)
    .map(([key, value]) => {
      return `### COMPONENT: ${value.name}
- Description: ${value.description}
- Base Tailwind classes: "${value.tailwindSpecs.base}"
- Variants: ${JSON.stringify(value.tailwindSpecs.variants)}
- States: ${value.tailwindSpecs.states}
- Accessibility rules: ${value.accessibilityGuidelines}`;
    })
    .join("\n\n");

  const layoutsText = Object.entries(LAYOUT_BLUEPRINTS)
    .map(([key, value]) => {
      return `- ${key}: ${value.name}. Grid: ${value.gridStructure}. Flow structure: ${value.structureSequence.join(" -> ")}`;
    })
    .join("\n");

  const patternsText = Object.entries(DESIGN_PATTERNS)
    .map(([key, value]) => {
      return `### Preset style: "${key}"
- Mood: ${value.visualMood}
- Background: ${value.backgroundEffect}
- Accent Gradients: bg-gradient-to-r ${value.gradientFlow}
- Card Style: "${value.cardStyle}"
- Global styling rules:
${value.tailwindGlobalRules.trim()}`;
    })
    .join("\n\n");

  return `
=============================================
FASTAPP SYSTEM DESIGN CATALOG & GUIDELINES
=============================================

This catalog defines the design standard for websites built using FastApp. You MUST match this exact styling to generate production-ready code.

1. SUPPORTED LAYOUT TYPES:
${layoutsText}

2. DESIGN PRESET STYLES (THEMES):
${patternsText}

3. STANDARD SECTION BLUEPRINTS:
${sectionsText}

4. STANDARD COMPONENT SYSTEM:
${componentsText}

5. SPACING TOKENS:
- Extra Small (xs): ${SPACING.xs}
- Small (sm): ${SPACING.sm}
- Medium (md): ${SPACING.md}
- Large (lg): ${SPACING.lg}
- Extra Large (xl): ${SPACING.xl}
- Layout Margin: ${SPACING.layout}

6. SHADOW DEPTHS:
- Subtle: "${SHADOWS.subtle}"
- Medium: "${SHADOWS.medium}"
- Strong: "${SHADOWS.strong}"
- Glow: "${SHADOWS.glow}"

7. TYPOGRAPHY RULES:
${TYPOGRAPHY_RULES.trim()}
`;
}
