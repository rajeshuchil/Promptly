export interface SectionSpec {
  name: string;
  description: string;
  recommendedClasses: string;
  subComponents: string[];
  htmlGuidance: string;
}

export const SECTION_BLUEPRINTS: Record<string, SectionSpec> = {
  // --- Landing Page Blueprints ---
  Hero: {
    name: "Hero Section",
    description: "Visual focal point of the page containing the main value statement, supporting copy, visual asset, and action triggers.",
    recommendedClasses: "relative overflow-hidden py-20 lg:py-32 flex flex-col items-center text-center",
    subComponents: ["Headline badge", "Main display heading", "Lead paragraph", "Action CTA buttons", "Interactive preview container"],
    htmlGuidance: `
- Center-aligned layout: Use max-w-3xl mx-auto for content to avoid extremely long line lengths.
- Badge: Small uppercase text inside a pill-shaped container (e.g. text-xs px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full).
- Headline: Graduated text sizes (text-4xl sm:text-6xl) with font-extrabold and tracking-tight. Combine with gradient backgrounds (bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary).
- Action CTAs: Flex container (flex flex-wrap justify-center gap-4) with primary solid button and secondary outline button.
`,
  },
  Features: {
    name: "Feature Grid (Bento)",
    description: "Multi-column layout showcasing primary value props, capabilities, and product screenshots/illustrations.",
    recommendedClasses: "py-20 lg:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    subComponents: ["Feature cards", "Vector icons", "Sub-features text lists"],
    htmlGuidance: `
- Layout: Use a grid with varied cell sizes (e.g. some cards spanning 2 columns: md:col-span-2) to create visual rhythm.
- Card wrapper: Glassmorphic background (bg-white/5 backdrop-blur-xl border border-white/8 rounded-2xl p-6 hover:border-brand-primary/40 transition-all duration-300).
- Structure: Small colored icon container (bg-brand-primary/15 text-brand-primary p-2.5 rounded-lg w-10 h-10 mb-4), followed by bold h3 (text-lg font-bold mb-2) and description (text-sm text-muted leading-relaxed).
`,
  },
  Testimonials: {
    name: "Social Proof / Testimonials",
    description: "Grid or slider showcasing positive feedback from users to build brand trust and authenticity.",
    recommendedClasses: "py-20 bg-black/10 border-y border-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    subComponents: ["Testimonial card", "User avatar", "Rating stars"],
    htmlGuidance: `
- Card: Soft elevated card bg-cardBackground border border-border p-6 rounded-2xl flex flex-col justify-between.
- Content: Star rating row (5 golden stars SVG), quote text (italicized text-sm text-primary mb-6), followed by author details block.
- Author block: Flex row with small circular user avatar (w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center), and text labels (Name: text-sm font-semibold; Company/Role: text-xs text-muted).
`,
  },
  Pricing: {
    name: "Subscription Tiers",
    description: "Compare available pricing options, product tiers, billing cycles, and feature lists.",
    recommendedClasses: "py-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto",
    subComponents: ["Pricing cards", "Feature comparison checkboxes", "Billing cycle toggle"],
    htmlGuidance: `
- Layout: 3 columns. Center card (popular plan) should be visually highlighted (e.g. scale scale-105 border-brand-primary shadow-glow relative).
- Card structure: Plan name (text-xs uppercase font-bold tracking-widest text-brand-primary), price block (text-4xl font-extrabold text-white mb-2 with /mo suffix), tier description (text-xs text-muted mb-6), action button (w-full py-2.5 font-bold rounded-xl), and feature checkmark list.
- Checkmark list: Space-y-3 vertical list of features with green check icon (w-4 h-4 text-success) alongside descriptions (text-xs text-primary).
`,
  },
  FAQ: {
    name: "Frequently Asked Questions",
    description: "List of common questions with collapsible answer panels to address immediate user objections.",
    recommendedClasses: "py-20 max-w-3xl mx-auto space-y-4",
    subComponents: ["Accordion item", "Question title bar", "Answer content panel"],
    htmlGuidance: `
- Structure: List of accordion rows.
- Accordion row: Border-b border-border py-4.
- Toggle trigger: Flex button with question text (text-base font-semibold text-white) and arrow/plus chevron (w-4 h-4 text-muted transition-transform duration-300).
- Panel text: Hidden/collapsed by default, transitionable to display detailed response text (text-sm text-muted leading-relaxed mt-2).
`,
  },
  Footer: {
    name: "Global Navigation Footer",
    description: "Multi-column layout containing copyright details, navigation links, terms & legal links, and social channel vectors.",
    recommendedClasses: "py-12 lg:py-16 border-t border-border mt-auto grid grid-cols-2 md:grid-cols-5 gap-8",
    subComponents: ["Company branding info", "Footer links list", "Newsletter prompt", "Social profile shortcuts"],
    htmlGuidance: `
- Layout: 5 columns. First column spans 2 columns on mobile/tablet.
- Content: Logo + descriptor (text-xs text-muted), links sections (Heading: text-xs font-bold uppercase tracking-wider text-white mb-3; Links: vertical list of text-xs text-muted hover:text-white transition-colors).
- Bottom bar: Flex row with copyright and horizontal social links (SVG icons).
`,
  },

  // --- Dashboard Blueprints ---
  Sidebar: {
    name: "Dashboard Sidebar",
    description: "Primary navigational layout element holding product branding logo, app section navigation list, and profile dropdown.",
    recommendedClasses: "w-[260px] h-screen bg-cardBackground border-r border-border flex flex-col p-4 fixed left-0 top-0 z-20",
    subComponents: ["Branding logo", "Navigation link list", "User profile footer"],
    htmlGuidance: `
- Header: Flex container with logo icon and title text (font-extrabold text-white tracking-tight).
- Nav links: Space-y-1 vertical navigation list. Active item (bg-brand-primary/10 text-white font-semibold border-l-2 border-brand-primary). Inactive item (text-muted hover:text-white hover:bg-white/5 transition-all duration-200). Include icons next to text.
- Footer: User info card (avatar + name + logout button) aligned to bottom via mt-auto.
`,
  },
  Metrics: {
    name: "Dashboard Metric Cards",
    description: "Grid of cards summarizing vital analytics metrics, containing trends indicators and progress bars.",
    recommendedClasses: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6",
    subComponents: ["Summary card", "Trending badge", "Trend line graph"],
    htmlGuidance: `
- Card: Soft rounded container bg-cardBackground border border-border p-5 rounded-xl.
- Layout: Header flex row (Title: text-xs font-medium text-muted; Icon: w-4 h-4 text-muted). Value block (text-2xl font-bold text-white mt-2). Footer (Trend badge: text-[10px] text-success bg-success/10 px-1.5 py-0.5 rounded font-bold).
`,
  },
  Charts: {
    name: "Data Visualizations Card",
    description: "Main workspace content container containing visual line, bar, or area graph charts showing metrics timelines.",
    recommendedClasses: "bg-cardBackground border border-border rounded-xl p-5 mb-6",
    subComponents: ["Chart canvas", "Chart legend", "Timeframe selector tabs"],
    htmlGuidance: `
- Header: Flex row (Title: text-sm font-bold text-white; Options: segment controller buttons for 24h/7d/30d).
- Body: Simulated vector graph (SVG coordinate paths representing grid lines, area gradients under the curve, and dot nodes) to render interactive-looking charts without script dependencies.
`,
  },
  ActivityFeed: {
    name: "Chronological Activity Feed",
    description: "Detailed list of recent updates, notification logs, and system events.",
    recommendedClasses: "bg-cardBackground border border-border rounded-xl p-5 space-y-4",
    subComponents: ["Activity feed item", "Timeline connector line", "Status badge icon"],
    htmlGuidance: `
- Layout: Vertical stack of feed items.
- Feed item: Flex row (Icon badge: w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary; Text body: text-xs text-primary; Timestamp: text-[10px] text-muted ml-auto).
`,
  },
  Tables: {
    name: "Data Grid Table",
    description: "Comprehensive grid table showing entity fields, filter bars, action controls, and paginator bars.",
    recommendedClasses: "bg-cardBackground border border-border rounded-xl overflow-hidden",
    subComponents: ["Filter/Search bar", "Data table element", "Pagination footbar"],
    htmlGuidance: `
- Header: Table control toolbar (search text-input + action button).
- Table element: Use w-full text-left table-auto. thead: bg-white/5 text-[10px] uppercase tracking-wider font-bold text-muted border-b border-border. tbody: tr border-b border-border last:border-0 hover:bg-white/2. td: px-4 py-3 text-xs.
- Status column: Colored pills representing state (Active: text-success bg-success/10; Inactive: text-muted bg-white/5; Alert: text-danger bg-danger/10).
`,
  },
};
