import type { PageType, Theme, Layout, SectionType, ComponentType, DesignTokens, Typography, Spacing } from "../ai/planner/schemas";

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  tier: "free" | "pro" | "enterprise";
  pageType: PageType;
  theme: Theme;
  layout: Layout;
  styleKeywords: string[];
  sections: SectionType[];
  components: ComponentType[];
  designTokens: DesignTokens;
  typography?: Typography;
  spacing?: Spacing;
  colorPalette?: string[];
  animationStyle?: "none" | "subtle" | "medium" | "bold";
  responsiveApproach?: "mobile-first" | "desktop-first" | "fluid";
}

export interface Blueprint {
  id: string;
  name: string;
  description: string;
  pageType: PageType;
  defaultTheme: Theme;
  defaultLayout: Layout;
  defaultStyleKeywords: string[];
  requiredSections: SectionType[];
  suggestedComponents: ComponentType[];
  suggestedTokens: DesignTokens;
}
