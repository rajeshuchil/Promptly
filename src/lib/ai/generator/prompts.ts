import type { Plan } from "../planner/schemas";
import type { GeneratorPromptStyle } from "./types";

export const GENERATOR_SYSTEM_PROMPT = `You are FastApp's elite HTML generation engine. You produce complete, self-contained, production-quality single-page websites.

ABSOLUTE RULES — violating any of these causes the output to be rejected:
1. Output RAW HTML only. No markdown. No backtick fences. No explanations.
2. Start with <!DOCTYPE html>. End with </html>. Nothing before or after.
3. Never add <!-- comments --> inside the generated HTML.
4. Never use placeholder Lorem Ipsum. Write real, purposeful copy.
5. No external image dependencies. Use CSS gradients, SVGs, or emoji for visuals.
6. The output must be complete — no "TODO" sections, no truncation.

FASTAPP DESIGN SYSTEM (always apply):

Typography:
  Fonts: Load Inter (body) and JetBrains Mono (code/mono) from Google Fonts.
  Scale: text-xs / text-sm / text-base / text-lg / text-xl / text-2xl / text-3xl / text-4xl / text-5xl
  Weights: font-normal (400) | font-medium (500) | font-semibold (600) | font-bold (700) | font-extrabold (800)

Colour palette (dark-mode-first — always use these):
  Backgrounds:  bg-[#0a0b0d] (page) | bg-[#111218] (card) | bg-[#16171f] (raised card)
  Borders:      border-[#2a2b35] | border-[#3a3b48]
  Text:         text-[#f0f0f5] (primary) | text-[#a0a0b8] (muted) | text-[#6b6b85] (placeholder)
  Brand:        from-[#7c6af0] to-[#a78bfa] (violet-purple gradient) — use for CTAs and highlights
  Success:      text-[#34d399]
  Warning:      text-[#fbbf24]
  Destructive:  text-[#f87171]

Glassmorphism (apply to cards, modals, hero sections):
  bg-white/5 backdrop-blur-xl border border-white/8 rounded-2xl
  For stronger glass: bg-white/8 backdrop-blur-2xl

Bento grid (use when layout calls for "grid" or "feature-grid"):
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
  Each card: bg-[#111218] border border-[#2a2b35] rounded-2xl p-6 hover:border-[#7c6af0]/50 transition-all

Animations (subtle, CSS-only — no JS required):
  Fade-in: @keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
  Glow pulse: @keyframes glowPulse { 0%,100% { box-shadow:0 0 20px #7c6af044 } 50% { box-shadow:0 0 40px #7c6af088 } }

Tailwind CDN:
  Always include: <script src="https://cdn.tailwindcss.com"></script>
  Always extend the theme inside a <script>tailwind.config={ ... }</script> block to add custom colours.

RESPONSIVENESS:
  Mobile-first. Use sm: / md: / lg: / xl: breakpoints.
  Sidebar layouts become stacked on mobile.
  Font sizes scale down one step on mobile.

ACCESSIBILITY:
  All images must have alt attributes.
  All interactive elements must have aria-label where text is not visible.
  Use semantic HTML: <header> <nav> <main> <section> <article> <aside> <footer>
  Headings must follow h1 → h2 → h3 hierarchy. Only ONE h1 per page.`;

// ─────────────────────────────────────────────────────────────────────────────
// PLAN SERIALISER
// ─────────────────────────────────────────────────────────────────────────────


function serialisePlan(plan: Plan): string {
  const tokens = plan.designTokens;

  const lines: string[] = [
    "=== DESIGN PLAN (FOLLOW EXACTLY) ===",
    "",
    `PAGE TYPE:   ${plan.pageType}`,
    `THEME:       ${plan.theme}`,
    `LAYOUT:      ${plan.layout}`,
    `STYLE MOOD:  ${plan.styleKeywords.join(", ")}`,
    `RESPONSIVE:  ${plan.responsiveApproach ?? "mobile-first"}`,
    `ANIMATION:   ${plan.animationStyle ?? "subtle"}`,
    "",
    "SECTIONS TO BUILD (in order):",
    ...plan.sections.map((s, i) => `  ${i + 1}. ${s}`),
    "",
    "COMPONENTS TO INCLUDE:",
    `  ${plan.components.join(", ")}`,
    "",
    "DESIGN TOKENS:",
    tokens.primaryColor ? `  Primary color:    ${tokens.primaryColor}` : "",
    tokens.secondaryColor ? `  Secondary color:  ${tokens.secondaryColor}` : "",
    tokens.backgroundColor ? `  Background:       ${tokens.backgroundColor}` : "",
    tokens.textColor ? `  Text color:       ${tokens.textColor}` : "",
    tokens.borderRadius ? `  Border radius:    ${tokens.borderRadius}` : "",
    tokens.shadowIntensity ? `  Shadow:           ${tokens.shadowIntensity}` : "",
  ].filter((l) => l !== undefined);

  if (plan.colorPalette?.length) {
    lines.push(`  Colour palette:   ${plan.colorPalette.join("  |  ")}`);
  }

  if (plan.typography) {
    const t = plan.typography;
    lines.push("");
    lines.push("TYPOGRAPHY:");
    if (t.headingFont) lines.push(`  Heading font: ${t.headingFont}`);
    if (t.bodyFont) lines.push(`  Body font:    ${t.bodyFont}`);
    if (t.fontWeight) lines.push(`  Weight:       ${t.fontWeight}`);
  }

  if (plan.spacing) {
    const s = plan.spacing;
    lines.push("");
    lines.push("SPACING:");
    if (s.gapSize) lines.push(`  Gap size:  ${s.gapSize}`);
    if (s.padding) lines.push(`  Padding:   ${s.padding}`);
  }

  if (plan.description) {
    lines.push("");
    lines.push("DESIGN INTENT:");
    lines.push(`  ${plan.description}`);
  }

  if (plan.accessibilityFocus?.length) {
    lines.push("");
    lines.push(`ACCESSIBILITY FOCUS: ${plan.accessibilityFocus.join(", ")}`);
  }

  lines.push("");
  lines.push("=== END PLAN ===");

  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// USER PROMPT BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Standard generator user prompt.
 * Injects the original user prompt + the full serialised plan.
 */
export function buildGeneratorUserPrompt(userPrompt: string, plan: Plan): string {
  return `ORIGINAL USER REQUEST:
"${userPrompt}"

${serialisePlan(plan)}

Generate the complete HTML page now.
- Follow the plan above exactly.
- Use the FastApp design system from your instructions.
- Apply glassmorphism, dark mode, and responsive layouts as specified.
- Output ONLY the raw HTML. Begin with <!DOCTYPE html>.`;
}

/**
 * Minimal generator prompt — lighter output, fewer visual flourishes.
 * Used when style === "minimal".
 */
export function buildMinimalGeneratorPrompt(userPrompt: string, plan: Plan): string {
  return `ORIGINAL USER REQUEST:
"${userPrompt}"

${serialisePlan(plan)}

Generate a clean, minimal HTML page. Prioritise clarity and whitespace over visual complexity.
Keep the section count to the essentials listed in the plan.
Output ONLY the raw HTML starting with <!DOCTYPE html>.`;
}

/**
 * Rich generator prompt — maximum visual detail, more animations, more sections.
 * Used when style === "rich".
 */
export function buildRichGeneratorPrompt(userPrompt: string, plan: Plan): string {
  return `ORIGINAL USER REQUEST:
"${userPrompt}"

${serialisePlan(plan)}

Generate a visually stunning, richly detailed HTML page.
- Add CSS keyframe animations for hero elements (fade-in, slide-up).
- Use gradient text for headings.
- Apply glassmorphism cards with hover transitions (scale, glow).
- Add micro-interactions via CSS :hover and :focus-visible states.
- Ensure the bento grid has varied cell sizes (col-span-2 / row-span-2) for visual rhythm.
Output ONLY the raw HTML starting with <!DOCTYPE html>.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT SELECTOR
// ─────────────────────────────────────────────────────────────────────────────

export function selectGeneratorPromptBuilder(
  style: GeneratorPromptStyle
): (prompt: string, plan: Plan) => string {
  switch (style) {
    case "minimal":
      return buildMinimalGeneratorPrompt;
    case "rich":
      return buildRichGeneratorPrompt;
    case "standard":
    default:
      return buildGeneratorUserPrompt;
  }
}
