import { z } from "zod";
import { PageSpecSchema, ThemeTypeSchema } from "@/lib/types/page-spec";

// V2 Plan Schema (used for AI structured generation)
export const PlanSchema = PageSpecSchema;
export type Plan = z.infer<typeof PlanSchema>;

// Legacy compatibility exports for Templates/Blueprints/Tabs
export const ThemeSchema = z.enum([
  "minimal",
  "glassmorphism",
  "bold",
  "elegant",
  "playful",
  "dark",
  "light",
  "gradient",
  "modern-dark",
  "sleek-light",
  "neo-brutalism",
  "minimalist",
]);
export type Theme = z.infer<typeof ThemeSchema>;

export const LayoutSchema = z.enum([
  "single-column",
  "two-column",
  "three-column",
  "grid",
  "asymmetric",
  "hero-plus-sections",
  "sidebar-nav",
  "full-width",
]);
export type Layout = z.infer<typeof LayoutSchema>;

export const PageTypeSchema = z.enum([
  "landing",
  "dashboard",
  "pricing",
  "billing",
  "settings",
  "login",
  "signup",
  "analytics",
  "portfolio",
  "documentation",
  "project-detail",
  "contact",
  "about",
  "saas-homepage",
]);
export type PageType = z.infer<typeof PageTypeSchema>;

export const DesignTokensSchema = z.object({
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  borderRadius: z.string().optional(),
  borderColor: z.string().optional(),
  shadowIntensity: z.enum(["none", "subtle", "medium", "strong"]).optional(),
});
export type DesignTokens = z.infer<typeof DesignTokensSchema>;

export const TypographySchema = z.object({
  headingFont: z.string().optional(),
  bodyFont: z.string().optional(),
  fontWeight: z.string().optional(),
  lineHeight: z.string().optional(),
});
export type Typography = z.infer<typeof TypographySchema>;

export const SpacingSchema = z.object({
  padding: z.string().optional(),
  margin: z.string().optional(),
  gapSize: z.enum(["compact", "normal", "spacious"]).optional(),
});
export type Spacing = z.infer<typeof SpacingSchema>;

export const SectionTypeSchema = z.enum([
  "hero",
  "navbar",
  "feature-grid", // V2 section
  "testimonials", // V2 section
  "pricing",
  "faq",
  "contact-form",
  "footer",
  "blog-grid",
  "gallery",
  "stats",
  "call-to-action", // V2 section
  "text-block",
  "image-block",
]);
export type SectionType = z.infer<typeof SectionTypeSchema>;

/**
 * Newly registered V2 Section variants:
 * 
 * - hero:
 *   - 'split'
 *   - 'centered'
 *   - 'minimal'
 *   - 'gradient'
 *   - 'spotlight-v1'
 *   - 'lamp-v1'
 * 
 * - feature-grid:
 *   - 'three-column-v1'
 *   - 'bento-v1'
 * 
 * - testimonials:
 *   - 'grid-v1'
 *   - 'carousel-v1'
 * 
 * - call-to-action:
 *   - 'newsletter-v1'
 *   - 'minimal-v1'
 */

export const ComponentTypeSchema = z.enum([
  "button",
  "card",
  "input",
  "dropdown",
  "badge",
  "icon",
  "image",
  "text-field",
  "checkbox",
  "radio",
  "toggle",
  "link",
  "breadcrumb",
]);
export type ComponentType = z.infer<typeof ComponentTypeSchema>;
