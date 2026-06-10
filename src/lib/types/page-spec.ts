import { z } from "zod";

export const ThemeTypeSchema = z.enum([
  "modern-dark",
  "glassmorphism",
  "sleek-light",
  "neo-brutalism",
  "minimalist",
]);

export type ThemeType = z.infer<typeof ThemeTypeSchema>;

export const DesignTokensSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  borderRadius: z.enum(["none", "sm", "md", "lg", "full"]),
  fontFamily: z.string(),
});

export type DesignTokens = z.infer<typeof DesignTokensSchema>;

export const SectionSpecSchema = z.object({
  id: z.string(),
  type: z.string(),
  variant: z.string(),
  props: z.record(z.any()),
});

export type SectionSpec = z.infer<typeof SectionSpecSchema>;

export const PageSpecSchema = z.object({
  pageType: z.string(),
  theme: ThemeTypeSchema,
  layout: z.string(),
  designStyle: z.enum([
    "modern-saas",
    "glassmorphism",
    "minimal-light",
    "neo-brutalism",
    "luxury",
    "startup",
    "corporate",
    "fintech",
    "creative-agency",
    "futuristic-ai"
  ]).optional(),
  designTokens: DesignTokensSchema,
  sections: z.array(SectionSpecSchema),
});

export type PageSpec = z.infer<typeof PageSpecSchema>;
