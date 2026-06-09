export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "landing-pages",
    name: "Landing Pages",
    description: "High-converting single-page landing layouts.",
  },
  {
    id: "dashboards",
    name: "Dashboards",
    description: "SaaS control centers, dashboards, and layouts.",
  },
  {
    id: "authentication-pages",
    name: "Authentication Pages",
    description: "Login, signup, and registration card layouts.",
  },
  {
    id: "pricing-pages",
    name: "Pricing Pages",
    description: "SaaS tier listings and feature comparisons.",
  },
  {
    id: "billing-pages",
    name: "Billing Pages",
    description: "Current plan overview and payment portals.",
  },
  {
    id: "analytics-pages",
    name: "Analytics Pages",
    description: "Metrics grids, data charts, and tables.",
  },
  {
    id: "portfolio-pages",
    name: "Portfolio Pages",
    description: "Minimalist project highlights and gallery displays.",
  },
  {
    id: "documentation-pages",
    name: "Documentation Pages",
    description: "Content-focused blogs and readable article guides.",
  },
  {
    id: "settings-pages",
    name: "Settings Pages",
    description: "User profile forms, preferences, and privacy controls.",
  },
];
