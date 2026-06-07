export interface LayoutBlueprint {
  type: string;
  name: string;
  description: string;
  gridStructure: string;
  sidebarBehavior: string;
  recommendedWidth: string;
  structureSequence: string[];
}

export const LAYOUT_BLUEPRINTS: Record<string, LayoutBlueprint> = {
  "SaaS Dashboard": {
    type: "dashboard",
    name: "SaaS Dashboard Layout",
    description: "Compact sidebar navigation layout optimized for dense data tables, interactive metrics, and multi-card grids.",
    gridStructure: "2-column layout (Sidebar fixed width 260px, Main content flexing to fill remaining viewport)",
    sidebarBehavior: "Collapsible on mobile via toggle overlay, sticky on desktop",
    recommendedWidth: "max-w-7xl mx-auto px-4 md:px-8 py-6",
    structureSequence: ["Sidebar navigation", "Header bar with user profile & search", "Metrics summary row (3-4 cards)", "Main interactive widget/chart area", "Data list/table section", "Footer summary"],
  },
  "Landing Page": {
    type: "landing",
    name: "High-Converting Landing Page",
    description: "Single column flow structure focused on storytelling, features, conversion metrics, testimonials, and clear call-to-actions.",
    gridStructure: "Single column with multi-row grids (e.g. 3-column features)",
    sidebarBehavior: "No sidebar, desktop top navbar with mobile hamburger menu overlay",
    recommendedWidth: "max-w-7xl mx-auto px-6 lg:px-8",
    structureSequence: ["Navbar", "Hero section with dual CTAs", "Social proof logo marquee", "Feature bento grid", "Detailed value proposition", "Interactive pricing table", "Testimonials / social proof", "Frequently asked questions", "Final CTA card", "Footer"],
  },
  "Portfolio": {
    type: "portfolio",
    name: "Creative Creative Portfolio",
    description: "Asymmetric grids and rich imagery frames designed to display creative works, personal achievements, and direct contact mechanisms.",
    gridStructure: "Asymmetric masonry grid or large cards portfolio showcase",
    sidebarBehavior: "Minimal header or floating vertical navigation panel",
    recommendedWidth: "max-w-5xl mx-auto px-6",
    structureSequence: ["Minimal sticky header", "Headline hero intro", "Project grid (visual hover preview card)", "Skills / experience tags", "Client testimonies", "Contact form section", "Social links footer"],
  },
  "Documentation Site": {
    type: "documentation",
    name: "Technical Documentation Layout",
    description: "Triple-column structure focusing on searchability, hierarchy, readable text flow, and in-page anchor index table.",
    gridStructure: "3-column layout (Left: docs outline tree; Center: markdown text; Right: in-page heading table of contents)",
    sidebarBehavior: "Left & Right sidebars fixed/scrollable, main column fluidly flexing",
    recommendedWidth: "max-w-8xl mx-auto px-4 md:px-8",
    structureSequence: ["Main global header with search", "Left docs navigation sidebar", "Main article section with semantic markup", "Right table of contents sidebar", "Page navigation controls (Prev/Next page)"],
  },
  "Admin Panel": {
    type: "admin-panel",
    name: "Administrative Operations Panel",
    description: "Dense tabbed control surfaces, permission matrices, state indicators, and large grid data tables with search/filter bars.",
    gridStructure: "Stacked header nav + full width layout with left-hand sub-navigation tabs",
    sidebarBehavior: "Sub-navigation vertical menu, collapsible on tablets",
    recommendedWidth: "w-full px-6 py-6",
    structureSequence: ["Top utility bar with global status indicator", "Horizontal/vertical sub-nav", "Action controls bar (Search, Filter, Create new)", "Tabulated datagrid / list", "Pagination control bar"],
  },
  "CRM": {
    type: "crm",
    name: "Relationship & Client Management System",
    description: "Split page card view. Ideal for activity feeds, notes list, contact quick cards, and transaction progress trackers.",
    gridStructure: "Split main area: Left column (1/3 width contact profile), Right column (2/3 width timeline activity & history)",
    sidebarBehavior: "Global app navigation bar (minimal left icon bar)",
    recommendedWidth: "max-w-7xl mx-auto p-6",
    structureSequence: ["Left: Client overview card & vital statistics", "Right: Activity history timeline (scrolling feed)", "Quick actions panel (log call, add note, update status)"],
  },
  "Analytics Product": {
    type: "analytics",
    name: "Business Intelligence & Analytics Console",
    description: "Header filtering options over grid layouts displaying data visualizations, conversion charts, and telemetry maps.",
    gridStructure: "Top full-width filter widget + multi-size grid (2-column, 3-column, 1-column layouts)",
    sidebarBehavior: "Collapsible left sidebar for workspace selection",
    recommendedWidth: "max-w-7xl mx-auto p-4 md:p-6",
    structureSequence: ["Date-range & Workspace filters dashboard controller", "High-priority KPI metric cards", "Interactive line/bar charts", "Comparison radar/pie chart section", "Detail exporting module"],
  },
};
