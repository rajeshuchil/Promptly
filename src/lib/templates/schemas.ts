import { z } from "zod";
import {
  PageTypeSchema,
  ThemeSchema,
  LayoutSchema,
  SectionTypeSchema,
  ComponentTypeSchema,
  DesignTokensSchema,
  TypographySchema,
  SpacingSchema,
} from "../ai/planner/schemas";

export const TemplateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  tier: z.enum(["free", "pro", "enterprise"]),
  pageType: PageTypeSchema,
  theme: ThemeSchema,
  layout: LayoutSchema,
  styleKeywords: z.array(z.string()),
  sections: z.array(SectionTypeSchema),
  components: z.array(ComponentTypeSchema),
  designTokens: DesignTokensSchema,
  typography: TypographySchema.optional(),
  spacing: SpacingSchema.optional(),
  colorPalette: z.array(z.string()).optional(),
  animationStyle: z.enum(["none", "subtle", "medium", "bold"]).optional(),
  responsiveApproach: z.enum(["mobile-first", "desktop-first", "fluid"]).optional(),
});

export const BlueprintSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  pageType: PageTypeSchema,
  defaultTheme: ThemeSchema,
  defaultLayout: LayoutSchema,
  defaultStyleKeywords: z.array(z.string()),
  requiredSections: z.array(SectionTypeSchema),
  suggestedComponents: z.array(ComponentTypeSchema),
  suggestedTokens: DesignTokensSchema,
});
