export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "saas",
    name: "SaaS & Dashboard",
    description: "Modern control centers, SaaS applications, and administration workspaces.",
  },
  {
    id: "marketing",
    name: "Marketing & Startup",
    description: "High-converting landing pages, portfolio displays, and agency profiles.",
  },
  {
    id: "ai",
    name: "AI & Innovation",
    description: "Cutting-edge designs tailored for AI platforms, tech startups, and developer tools.",
  },
  {
    id: "docs",
    name: "Docs & Content",
    description: "Content-focused blogs, product documentation sites, and information catalogs.",
  },
];
