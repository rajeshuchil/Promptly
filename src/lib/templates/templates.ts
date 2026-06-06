import type { Template } from "./types";

export const STARTER_TEMPLATES: Template[] = [
  {
    id: "saas-dashboard",
    title: "SaaS Dashboard",
    description: "A comprehensive control center template with sidebar layout, widgets, activity logs, and status stats.",
    category: "saas",
    tier: "free",
    pageType: "dashboard",
    theme: "dark",
    layout: "sidebar-nav",
    styleKeywords: ["clean", "professional", "sleek", "modern", "data-rich"],
    sections: ["navbar", "stats", "feature-grid", "footer"],
    components: ["button", "card", "dropdown", "badge", "icon", "input", "toggle"],
    designTokens: {
      primaryColor: "#4f46e5", // Indigo
      secondaryColor: "#10b981", // Emerald
      backgroundColor: "#0b0f19", // Very dark navy
      textColor: "#f3f4f6",
      borderRadius: "8px",
      borderColor: "#1f2937",
      shadowIntensity: "medium",
    },
    colorPalette: ["#4f46e5", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"],
    animationStyle: "subtle",
    responsiveApproach: "fluid",
  },
  {
    id: "analytics-platform",
    title: "Analytics Platform",
    description: "Advanced dashboard displaying charts, analytics metrics, visual reports, and data grids.",
    category: "saas",
    tier: "pro",
    pageType: "dashboard",
    theme: "glassmorphism",
    layout: "grid",
    styleKeywords: ["futuristic", "transparent", "gradient", "glossy", "analytics"],
    sections: ["navbar", "stats", "feature-grid", "call-to-action", "footer"],
    components: ["button", "card", "dropdown", "badge", "icon", "toggle"],
    designTokens: {
      primaryColor: "#ec4899", // Pink
      secondaryColor: "#8b5cf6", // Violet
      backgroundColor: "#030712", // Pure black
      textColor: "#f9fafb",
      borderRadius: "16px",
      borderColor: "#374151",
      shadowIntensity: "strong",
    },
    colorPalette: ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981"],
    animationStyle: "medium",
    responsiveApproach: "desktop-first",
  },
  {
    id: "ai-startup",
    title: "AI Startup Landing Page",
    description: "Vibrant, feature-rich landing page built for cutting-edge artificial intelligence platforms.",
    category: "ai",
    tier: "pro",
    pageType: "landing",
    theme: "gradient",
    layout: "hero-plus-sections",
    styleKeywords: ["futuristic", "creative", "bold", "purple", "neon"],
    sections: ["navbar", "hero", "feature-grid", "stats", "pricing", "call-to-action", "footer"],
    components: ["button", "card", "badge", "icon", "image", "input", "link"],
    designTokens: {
      primaryColor: "#a855f7", // Purple
      secondaryColor: "#06b6d4", // Cyan
      backgroundColor: "#090514", // Deep void purple
      textColor: "#f8fafc",
      borderRadius: "12px",
      borderColor: "#271c3f",
      shadowIntensity: "strong",
    },
    colorPalette: ["#a855f7", "#06b6d4", "#f43f5e", "#10b981"],
    animationStyle: "bold",
    responsiveApproach: "mobile-first",
  },
  {
    id: "crm-dashboard",
    title: "CRM Dashboard",
    description: "Customer relationship manager containing customer pipelines, task flows, activity metrics, and leads database.",
    category: "saas",
    tier: "pro",
    pageType: "dashboard",
    theme: "elegant",
    layout: "sidebar-nav",
    styleKeywords: ["corporate", "clean", "trustworthy", "structured"],
    sections: ["navbar", "stats", "feature-grid", "footer"],
    components: ["button", "card", "input", "dropdown", "badge", "icon", "checkbox"],
    designTokens: {
      primaryColor: "#0f766e", // Teal
      secondaryColor: "#0369a1", // Sky blue
      backgroundColor: "#fcfcfc", // Crisp light grey
      textColor: "#0f172a",
      borderRadius: "6px",
      borderColor: "#e2e8f0",
      shadowIntensity: "subtle",
    },
    colorPalette: ["#0f766e", "#0369a1", "#059669", "#d97706"],
    animationStyle: "none",
    responsiveApproach: "fluid",
  },
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    description: "Creative designer and developer portfolio with project showcases, gallery grids, testimonials, and bio.",
    category: "marketing",
    tier: "free",
    pageType: "portfolio",
    theme: "minimal",
    layout: "grid",
    styleKeywords: ["clean", "minimalist", "artistic", "editorial", "monochrome"],
    sections: ["navbar", "hero", "gallery", "testimonials", "contact-form", "footer"],
    components: ["button", "card", "badge", "image", "link", "icon"],
    designTokens: {
      primaryColor: "#171717", // Charcoal
      secondaryColor: "#737373", // Grey
      backgroundColor: "#ffffff",
      textColor: "#171717",
      borderRadius: "4px",
      borderColor: "#e5e5e5",
      shadowIntensity: "none",
    },
    colorPalette: ["#171717", "#737373", "#d4d4d4", "#f5f5f5"],
    animationStyle: "subtle",
    responsiveApproach: "mobile-first",
  },
  {
    id: "agency-website",
    title: "Agency Website",
    description: "Stunning marketing agency representation emphasizing visual excellence, project showcases, and team stats.",
    category: "marketing",
    tier: "pro",
    pageType: "saas-homepage",
    theme: "bold",
    layout: "hero-plus-sections",
    styleKeywords: ["loud", "vibrant", "contrasting", "expressive"],
    sections: ["navbar", "hero", "gallery", "stats", "testimonials", "call-to-action", "footer"],
    components: ["button", "card", "badge", "image", "link", "icon"],
    designTokens: {
      primaryColor: "#ea580c", // Orange
      secondaryColor: "#facc15", // Yellow
      backgroundColor: "#ffffff",
      textColor: "#0f172a",
      borderRadius: "24px",
      borderColor: "#e2e8f0",
      shadowIntensity: "medium",
    },
    colorPalette: ["#ea580c", "#facc15", "#1e1b4b", "#10b981"],
    animationStyle: "bold",
    responsiveApproach: "fluid",
  },
  {
    id: "devtools-homepage",
    title: "Developer Tool Homepage",
    description: "Sleek terminal-themed landing page designed to capture developer signups with console components and API layouts.",
    category: "ai",
    tier: "pro",
    pageType: "saas-homepage",
    theme: "dark",
    layout: "asymmetric",
    styleKeywords: ["terminal", "developer", "geeky", "mono", "neon-green"],
    sections: ["navbar", "hero", "feature-grid", "stats", "call-to-action", "footer"],
    components: ["button", "card", "badge", "icon", "image", "link"],
    designTokens: {
      primaryColor: "#22c55e", // Neon Green
      secondaryColor: "#3b82f6", // Neon Blue
      backgroundColor: "#050505", // Terminal Black
      textColor: "#e0e0e0",
      borderRadius: "4px",
      borderColor: "#1c1c1c",
      shadowIntensity: "medium",
    },
    colorPalette: ["#22c55e", "#3b82f6", "#a855f7", "#ffffff"],
    animationStyle: "subtle",
    responsiveApproach: "mobile-first",
  },
  {
    id: "documentation-site",
    title: "Documentation Site",
    description: "Information-focused documentation layout with sidebar table of contents, breadcrumbs, search grids, and content articles.",
    category: "docs",
    tier: "free",
    pageType: "documentation",
    theme: "light",
    layout: "sidebar-nav",
    styleKeywords: ["readable", "content-focused", "informative", "plain"],
    sections: ["navbar", "text-block", "feature-grid", "footer"],
    components: ["button", "link", "breadcrumb", "badge", "icon", "input"],
    designTokens: {
      primaryColor: "#2563eb", // Deep blue
      secondaryColor: "#475569", // Slate grey
      backgroundColor: "#ffffff",
      textColor: "#1e293b",
      borderRadius: "6px",
      borderColor: "#cbd5e1",
      shadowIntensity: "none",
    },
    colorPalette: ["#2563eb", "#475569", "#f1f5f9", "#e2e8f0"],
    animationStyle: "none",
    responsiveApproach: "fluid",
  },
];

export function getTemplateById(id: string): Template | undefined {
  return STARTER_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: string): Template[] {
  return STARTER_TEMPLATES.filter((t) => t.category === category);
}
