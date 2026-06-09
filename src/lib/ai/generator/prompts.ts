import type { Plan } from "../planner/schemas";
import type { GeneratorPromptStyle } from "./types";

export const GENERATOR_SYSTEM_PROMPT = `You are FastApp's elite HTML generation engine. You produce complete, self-contained, production-quality single-page HTML documents.

ABSOLUTE RULES — violating any of these causes the output to be rejected:
1. Output RAW HTML only. No markdown. No backtick fences. No explanations.
2. Start with <!DOCTYPE html>. End with </html>. Nothing before or after.
3. Never add <!-- comments --> inside the generated HTML.
4. Never use placeholder Lorem Ipsum. Write real, purposeful copy.
5. No external image dependencies. Use CSS gradients, SVGs, or emoji for visuals.
6. The output must be complete — no "TODO" sections, no truncation. Must always include all closing tags.
7. Generate EXACTLY ONE page. DO NOT generate multiple routes, page-to-page links, client-side routing, or application maps.

SUPPORTED PAGE SCHEMAS (match request):
- Landing Page: Navbar, Hero, Features, Social proof, CTA, Footer.
- Dashboard Page: Sidebar layout, Top navigation bar, Metrics cards, Charts/data visual placeholders, Activity feed.
- Pricing Page: Pricing comparison tiers, Feature matrix checklist, FAQ accordion, conversion CTA.
- Login/Signup Page: Centered Auth form card, input validations, OAuth social buttons, application branding.
- Settings Page: Sectioned tabs (Profile settings, Preferences, Security controls).
- Billing Page: Subscription plan overview, resource usage meters, Invoice history table, upgrade CTAs.

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
  const p = plan as any;
  const tokens = p.designTokens || {};

  const lines: string[] = [
    "=== DESIGN PLAN (FOLLOW EXACTLY) ===",
    "",
    `PAGE TYPE:   ${p.pageType}`,
    `THEME:       ${p.theme}`,
    `LAYOUT:      ${p.layout}`,
    p.styleKeywords ? `STYLE MOOD:  ${p.styleKeywords.join(", ")}` : "",
    p.responsiveApproach ? `RESPONSIVE:  ${p.responsiveApproach}` : "",
    p.animationStyle ? `ANIMATION:   ${p.animationStyle}` : "",
    "",
    "SECTIONS TO BUILD (in order):",
    ...p.sections.map((s: any, i: number) => `  ${i + 1}. ${s}`),
  ].filter((l) => l !== undefined && l !== "");

  if (p.components?.length) {
    lines.push("");
    lines.push("COMPONENTS TO INCLUDE:");
    lines.push(`  ${p.components.join(", ")}`);
  }

  if (Object.keys(tokens).length) {
    lines.push("");
    lines.push("DESIGN TOKENS:");
    if (tokens.primaryColor) lines.push(`  Primary color:    ${tokens.primaryColor}`);
    if (tokens.secondaryColor) lines.push(`  Secondary color:  ${tokens.secondaryColor}`);
    if (tokens.backgroundColor) lines.push(`  Background:       ${tokens.backgroundColor}`);
    if (tokens.textColor) lines.push(`  Text color:       ${tokens.textColor}`);
    if (tokens.borderRadius) lines.push(`  Border radius:    ${tokens.borderRadius}`);
    if (tokens.shadowIntensity) lines.push(`  Shadow:           ${tokens.shadowIntensity}`);
  }

  if (p.colorPalette?.length) {
    lines.push("");
    lines.push(`  Colour palette:   ${p.colorPalette.join("  |  ")}`);
  }

  if (p.typography) {
    const t = p.typography;
    lines.push("");
    lines.push("TYPOGRAPHY:");
    if (t.headingFont) lines.push(`  Heading font: ${t.headingFont}`);
    if (t.bodyFont) lines.push(`  Body font:    ${t.bodyFont}`);
    if (t.fontWeight) lines.push(`  Weight:       ${t.fontWeight}`);
  }

  if (p.spacing) {
    const s = p.spacing;
    lines.push("");
    lines.push("SPACING:");
    if (s.gapSize) lines.push(`  Gap size:  ${s.gapSize}`);
    if (s.padding) lines.push(`  Padding:   ${s.padding}`);
  }

  if (p.description) {
    lines.push("");
    lines.push("DESIGN INTENT:");
    lines.push(`  ${p.description}`);
  }

  if (p.accessibilityFocus?.length) {
    lines.push("");
    lines.push(`ACCESSIBILITY FOCUS: ${p.accessibilityFocus.join(", ")}`);
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

export function buildModernSaasGeneratorPrompt(userPrompt: string, plan: Plan): string {
  return `ORIGINAL USER REQUEST:
"${userPrompt}"

${serialisePlan(plan)}

Generate a premium, modern SaaS-styled HTML page.
- Apply high-tech indigo/violet gradients, dark-mode-first slate colors, and precise card boundaries.
- Build clean, interactive-feeling grid structures.
- Ensure all interactive elements look professional and high-fidelity.
Output ONLY the raw HTML starting with <!DOCTYPE html>.`;
}

export function buildGlassmorphismGeneratorPrompt(userPrompt: string, plan: Plan): string {
  return `ORIGINAL USER REQUEST:
"${userPrompt}"

${serialisePlan(plan)}

Generate a stunning Glassmorphism HTML page.
- Focus on frosted translucent panels (bg-white/5 backdrop-blur-xl border border-white/8), soft neon fuchsia/violet radial glows, and floating layered layouts.
- Add CSS animations for glows and container transitions.
Output ONLY the raw HTML starting with <!DOCTYPE html>.`;
}

export function buildEnterpriseGeneratorPrompt(userPrompt: string, plan: Plan): string {
  return `ORIGINAL USER REQUEST:
"${userPrompt}"

${serialisePlan(plan)}

Generate a clean, highly professional Enterprise HTML page.
- Use sky-blue and teal highlights, sturdy slate block backgrounds, and compact layouts suitable for business platforms.
- Prioritize high legibility, clean visual zones, and accessible structures.
Output ONLY the raw HTML starting with <!DOCTYPE html>.`;
}

export function buildStartupGeneratorPrompt(userPrompt: string, plan: Plan): string {
  return `ORIGINAL USER REQUEST:
"${userPrompt}"

${serialisePlan(plan)}

Generate an energetic, bold Startup HTML page.
- Use pitch-black backgrounds, hot neon orange/pink gradients, statement-driven typography, and sharp border dividers.
- Apply springy CSS animations and high-contrast styling details.
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
    case "modern-saas":
      return buildModernSaasGeneratorPrompt;
    case "glassmorphism":
      return buildGlassmorphismGeneratorPrompt;
    case "enterprise":
      return buildEnterpriseGeneratorPrompt;
    case "startup":
      return buildStartupGeneratorPrompt;
    case "standard":
    default:
      return buildModernSaasGeneratorPrompt;
  }
}
