import { z } from "zod";

export const ThemeSchema = z.enum([
  "minimal",
  "glassmorphism",
  "bold",
  "elegant",
  "playful",
  "dark",
  "light",
  "gradient",
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
  "product-showcase",
  "documentation",
  "blog",
  "portfolio",
  "dashboard",
  "ecommerce",
  "saas-homepage",
  "contact",
  "about",
]);
export type PageType = z.infer<typeof PageTypeSchema>;

export const DesignTokensSchema = z.object({
  primaryColor: z.string().optional().describe("Primary brand color (hex or name)"),
  secondaryColor: z
    .string()
    .optional()
    .describe("Secondary accent color (hex or name)"),
  backgroundColor: z.string().optional().describe("Background color (hex or name)"),
  textColor: z.string().optional().describe("Primary text color (hex or name)"),
  borderRadius: z
    .string()
    .optional()
    .describe("Default border radius (e.g. '8px', 'rounded')"),
  borderColor: z.string().optional().describe("Border color (hex or name)"),
  shadowIntensity: z
    .enum(["none", "subtle", "medium", "strong"])
    .optional()
    .describe("Shadow depth"),
});
export type DesignTokens = z.infer<typeof DesignTokensSchema>;

export const TypographySchema = z.object({
  headingFont: z.string().optional().describe("Font family for headings"),
  bodyFont: z.string().optional().describe("Font family for body text"),
  fontWeight: z.string().optional().describe("Font weight (e.g. 'bold', '600')"),
  lineHeight: z.string().optional().describe("Line height for readability"),
});
export type Typography = z.infer<typeof TypographySchema>;

export const SpacingSchema = z.object({
  padding: z
    .string()
    .optional()
    .describe("Default padding (e.g. '16px', '1rem')"),
  margin: z.string().optional().describe("Default margin (e.g. '24px', '1.5rem')"),
  gapSize: z
    .enum(["compact", "normal", "spacious"])
    .optional()
    .describe("Space between elements"),
});
export type Spacing = z.infer<typeof SpacingSchema>;

export const SectionTypeSchema = z.enum([
  "hero",
  "navbar",
  "feature-grid",
  "testimonials",
  "pricing",
  "faq",
  "contact-form",
  "footer",
  "blog-grid",
  "gallery",
  "stats",
  "call-to-action",
  "text-block",
  "image-block",
]);
export type SectionType = z.infer<typeof SectionTypeSchema>;

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

export const PlanSchema = z.object({
  pageType: PageTypeSchema.describe("The type of page being designed"),
  theme: ThemeSchema.describe("The overall visual theme"),
  layout: LayoutSchema.describe("The structural layout/grid"),
  styleKeywords: z
    .array(z.string())
    .min(1)
    .max(10)
    .describe(
      "Keywords describing the visual style (e.g. 'modern', 'minimal', 'colorful')"
    ),
  sections: z
    .array(SectionTypeSchema)
    .min(1)
    .max(15)
    .describe("List of section types that make up the page"),
  components: z
    .array(ComponentTypeSchema)
    .min(1)
    .max(30)
    .describe("List of component types used throughout the design"),
  designTokens: DesignTokensSchema.describe("Color and spacing choices"),
  typography: TypographySchema.optional().describe("Font and text styling"),
  spacing: SpacingSchema.optional().describe("Spacing and gap configuration"),
  description: z
    .string()
    .optional()
    .describe("Brief description of the design approach"),
  colorPalette: z
    .array(z.string())
    .max(8)
    .optional()
    .describe("Array of colors used in the design"),
  animationStyle: z
    .enum(["none", "subtle", "medium", "bold"])
    .optional()
    .describe("Level of animation/motion"),
  responsiveApproach: z
    .enum(["mobile-first", "desktop-first", "fluid"])
    .optional()
    .describe("How the design adapts to different screen sizes"),
  accessibilityFocus: z
    .array(z.enum(["high-contrast", "large-text", "screen-reader", "keyboard-nav"]))
    .optional()
    .describe("Accessibility features prioritized"),
});

export type Plan = z.infer<typeof PlanSchema>;
