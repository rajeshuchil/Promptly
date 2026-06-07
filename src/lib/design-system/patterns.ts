export interface DesignPattern {
  name: string;
  description: string;
  visualMood: string;
  backgroundEffect: string;
  gradientFlow: string;
  cardStyle: string;
  animationPreset: string;
  tailwindGlobalRules: string;
}

export const DESIGN_PATTERNS: Record<string, DesignPattern> = {
  Minimal: {
    name: "Minimalist Presets",
    description: "Ultra-clean, structured grids, extreme whitespace, sans-serif utility headers, and industrial black & white contrasts.",
    visualMood: "Clean, functional, spacious, and content-focused.",
    backgroundEffect: "Flat backgrounds, strict linear page splits.",
    gradientFlow: "None (solid tones #ffffff or #fafafa only).",
    cardStyle: "Zero or thin borders border-zinc-200 bg-white rounded-md shadow-none",
    animationPreset: "none (static pages)",
    tailwindGlobalRules: `
- Page Background: bg-zinc-50 text-zinc-900.
- Borders: border-zinc-200.
- Buttons: bg-zinc-900 text-white rounded-md hover:bg-zinc-800.
- Card grid spacing: Gap of 8 or 12. Large margin padding.
`,
  },
  "Modern SaaS": {
    name: "Modern SaaS Presets",
    description: "Deep oceanic backgrounds, indigo and violet highlights, rounded borders, clean icons, and grid configurations.",
    visualMood: "Professional, futuristic, sleek, and high-tech.",
    backgroundEffect: "Radial background gradient overlays to simulate edge glows.",
    gradientFlow: "from-indigo-500 to-purple-600",
    cardStyle: "bg-[#111322] border-slate-800 rounded-2xl shadow-md",
    animationPreset: "subtle slide-up, smooth hover scales",
    tailwindGlobalRules: `
- Page Background: bg-[#090a16].
- Borders: border-[#1e223c].
- Highlights: Indigo gradients.
- Cards: Rounded-2xl padding p-6.
`,
  },
  Glassmorphism: {
    name: "Glassmorphism Preset",
    description: "Frosted translucent surfaces, blurred backdrops, glowing border strokes, fuchsia colors, and floating layers.",
    visualMood: "Premium, ethereal, creative, and dimensional.",
    backgroundEffect: "Dynamic multi-color gradient background (dark fuchsia/deep violet/black) overlayed with glass panels.",
    gradientFlow: "from-fuchsia-500 via-purple-600 to-indigo-600",
    cardStyle: "bg-white/5 backdrop-blur-xl border border-white/8 rounded-3xl shadow-lg",
    animationPreset: "pulsing gradients, smooth glowing borders",
    tailwindGlobalRules: `
- Page Background: bg-[#03001e] or dark purple gradient.
- Borders: border-white/8.
- Card panels: bg-white/5 backdrop-blur-2xl hover:border-brand-primary/40 transition-all duration-300.
`,
  },
  Enterprise: {
    name: "Enterprise Blueprint Presets",
    description: "Deep corporate blue and teal highlights, professional content blocks, sturdy grids, and readable layouts.",
    visualMood: "Reliable, robust, corporate, and clean.",
    backgroundEffect: "Muted slate base with clean geometric borders.",
    gradientFlow: "from-sky-500 to-teal-600",
    cardStyle: "bg-slate-900 border-slate-800 rounded-lg shadow-sm",
    animationPreset: "none or minimal fade-ins",
    tailwindGlobalRules: `
- Page Background: bg-slate-950.
- Borders: border-slate-800.
- Typography: Roboto (headings) & Open Sans (body).
`,
  },
  Startup: {
    name: "Neon Startup Presets",
    description: "Dark carbon styles, hot neon orange and pink gradients, tight borders, interactive details, and high-contrast badges.",
    visualMood: "Energetic, disruptive, trendy, and bold.",
    backgroundEffect: "Deep pitch-black (#000000) base with high contrast neon glows.",
    gradientFlow: "from-orange-500 via-pink-500 to-red-500",
    cardStyle: "bg-[#0d0d0d] border-zinc-800 rounded-xl",
    animationPreset: "fast spring scales, border marquee glows",
    tailwindGlobalRules: `
- Page Background: bg-black text-white.
- Borders: border-zinc-800.
- Accent colors: Hot neon orange (#ff5722) or neon fuchsia.
`,
  },
};
