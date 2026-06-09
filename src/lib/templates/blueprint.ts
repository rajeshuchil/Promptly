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

export const DocumentationBlueprint: Blueprint = {
  id: "blueprint-documentation",
  name: "Documentation Site Blueprint",
  description: "Triple-column structure focusing on readability, navigation hierarchy, and anchor tags.",
  pageType: "documentation",
  defaultTheme: "minimal",
  defaultLayout: "three-column",
  defaultStyleKeywords: ["technical", "clean", "structured", "readable"],
  requiredSections: ["navbar", "feature-grid", "text-block", "footer"],
  suggestedComponents: ["button", "link", "icon", "input", "breadcrumb"],
  suggestedTokens: {
    primaryColor: "#0f766e", // Teal
    secondaryColor: "#0284c7", // Sky blue
    backgroundColor: "#fcfcfc",
    textColor: "#1e293b",
    borderRadius: "6px",
    borderColor: "#e2e8f0",
    shadowIntensity: "subtle",
  },
};

export const AdminPanelBlueprint: Blueprint = {
  id: "blueprint-admin-panel",
  name: "Admin Panel Blueprint",
  description: "Dense tabbed control panels, operational statistics, and pagination-equipped tables.",
  pageType: "dashboard",
  defaultTheme: "dark",
  defaultLayout: "sidebar-nav",
  defaultStyleKeywords: ["compact", "dense", "functional", "operational"],
  requiredSections: ["navbar", "feature-grid", "stats", "footer"],
  suggestedComponents: ["button", "card", "dropdown", "badge", "input", "checkbox", "toggle"],
  suggestedTokens: {
    primaryColor: "#3b82f6", // Blue
    secondaryColor: "#ef4444", // Red (danger actions)
    backgroundColor: "#0b0f19",
    textColor: "#f1f5f9",
    borderRadius: "8px",
    borderColor: "#1e293b",
    shadowIntensity: "strong",
  },
};

export const CRMBlueprint: Blueprint = {
  id: "blueprint-crm",
  name: "CRM Blueprint",
  description: "Split page card view containing details list, event feeds, and activity logs.",
  pageType: "dashboard",
  defaultTheme: "elegant",
  defaultLayout: "two-column",
  defaultStyleKeywords: ["sleek", "relationship-focused", "collaborative"],
  requiredSections: ["navbar", "stats", "testimonials", "footer"],
  suggestedComponents: ["button", "card", "dropdown", "badge", "input", "image", "link"],
  suggestedTokens: {
    primaryColor: "#8b5cf6", // Violet
    secondaryColor: "#10b981", // Emerald
    backgroundColor: "#0a0a0f",
    textColor: "#f3f4f6",
    borderRadius: "14px",
    borderColor: "#1f1f2e",
    shadowIntensity: "medium",
  },
};

export const AnalyticsBlueprint: Blueprint = {
  id: "blueprint-analytics",
  name: "Analytics Product Blueprint",
  description: "Highly interactive charts dashboard with metrics rows and summary widgets.",
  pageType: "analytics",
  defaultTheme: "dark",
  defaultLayout: "grid",
  defaultStyleKeywords: ["charts-dense", "analytical", "visual", "numeric"],
  requiredSections: ["navbar", "stats", "feature-grid", "footer"],
  suggestedComponents: ["button", "card", "dropdown", "badge", "icon", "toggle"],
  suggestedTokens: {
    primaryColor: "#06b6d4", // Cyan
    secondaryColor: "#f43f5e", // Rose
    backgroundColor: "#030712",
    textColor: "#f9fafb",
    borderRadius: "12px",
    borderColor: "#1f2937",
    shadowIntensity: "strong",
  },
};

export const BLUEPRINTS: Record<string, Blueprint> = {
  landing: LandingPageBlueprint,
  dashboard: DashboardBlueprint,
  pricing: LandingPageBlueprint,
  billing: DashboardBlueprint,
  settings: DashboardBlueprint,
  login: LandingPageBlueprint,
  signup: LandingPageBlueprint,
  analytics: AnalyticsBlueprint,
  portfolio: PortfolioBlueprint,
  documentation: DocumentationBlueprint,
  "project-detail": DashboardBlueprint,
  contact: LandingPageBlueprint,
  about: LandingPageBlueprint,
  "saas-homepage": LandingPageBlueprint, // Alias
};

export function getBlueprintForPageType(pageType: string): Blueprint {
  return BLUEPRINTS[pageType] || LandingPageBlueprint;
}
