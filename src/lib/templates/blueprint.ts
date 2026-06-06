import type { Blueprint } from "./types";

export const LandingPageBlueprint: Blueprint = {
  id: "blueprint-landing",
  name: "Landing Page Blueprint",
  description: "Standard structure for a high-converting landing page.",
  pageType: "landing",
  defaultTheme: "gradient",
  defaultLayout: "hero-plus-sections",
  defaultStyleKeywords: ["modern", "clean", "professional", "conversion-focused"],
  requiredSections: ["navbar", "hero", "feature-grid", "stats", "testimonials", "pricing", "call-to-action", "footer"],
  suggestedComponents: ["button", "card", "badge", "icon", "image", "input", "link"],
  suggestedTokens: {
    primaryColor: "#3b82f6", // Cool blue
    secondaryColor: "#10b981", // Emerald green
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderRadius: "8px",
    borderColor: "#e5e7eb",
    shadowIntensity: "medium",
  },
};

export const DashboardBlueprint: Blueprint = {
  id: "blueprint-dashboard",
  name: "Dashboard Blueprint",
  description: "Standard layout for administration panels and data visualization.",
  pageType: "dashboard",
  defaultTheme: "dark",
  defaultLayout: "sidebar-nav",
  defaultStyleKeywords: ["sleek", "data-rich", "compact", "functional"],
  requiredSections: ["navbar", "feature-grid", "stats", "footer"],
  suggestedComponents: ["button", "card", "dropdown", "badge", "icon", "input", "toggle"],
  suggestedTokens: {
    primaryColor: "#6366f1", // Indigo
    secondaryColor: "#ec4899", // Pink
    backgroundColor: "#0f172a", // Dark slate
    textColor: "#f8fafc",
    borderRadius: "12px",
    borderColor: "#334155",
    shadowIntensity: "strong",
  },
};

export const PortfolioBlueprint: Blueprint = {
  id: "blueprint-portfolio",
  name: "Portfolio Blueprint",
  description: "Creative structure for personal portfolios and showcase websites.",
  pageType: "portfolio",
  defaultTheme: "minimal",
  defaultLayout: "grid",
  defaultStyleKeywords: ["creative", "elegant", "minimalist", "personal"],
  requiredSections: ["navbar", "hero", "gallery", "testimonials", "contact-form", "footer"],
  suggestedComponents: ["button", "card", "badge", "image", "link", "icon"],
  suggestedTokens: {
    primaryColor: "#14b8a6", // Teal
    secondaryColor: "#f59e0b", // Amber
    backgroundColor: "#fafafa",
    textColor: "#171717",
    borderRadius: "4px",
    borderColor: "#e5e5e5",
    shadowIntensity: "subtle",
  },
};

export const BLUEPRINTS: Record<string, Blueprint> = {
  landing: LandingPageBlueprint,
  dashboard: DashboardBlueprint,
  portfolio: PortfolioBlueprint,
  "saas-homepage": LandingPageBlueprint, // Alias
  "product-showcase": LandingPageBlueprint, // Alias
};

export function getBlueprintForPageType(pageType: string): Blueprint {
  return BLUEPRINTS[pageType] || LandingPageBlueprint;
}
