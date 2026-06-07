export interface FontPairing {
  headingFont: string;
  bodyFont: string;
  pairingDescription: string;
}

export const FONT_PAIRINGS: Record<string, FontPairing> = {
  minimal: {
    headingFont: "Inter",
    bodyFont: "Inter",
    pairingDescription: "Clean, geometric sans-serif pairing for a utility-driven layout.",
  },
  "modern-saas": {
    headingFont: "Outfit",
    bodyFont: "Inter",
    pairingDescription: "Outfit offers friendly, rounded headlines balanced by the readability of Inter.",
  },
  glassmorphism: {
    headingFont: "Syne",
    bodyFont: "Inter",
    pairingDescription: "Syne brings creative avant-garde energy, which pops against glass elements.",
  },
  enterprise: {
    headingFont: "Roboto",
    bodyFont: "Open Sans",
    pairingDescription: "Sturdy, highly legible corporate pairing for clear communication.",
  },
  startup: {
    headingFont: "Cabinet Grotesk",
    bodyFont: "Plus Jakarta Sans",
    pairingDescription: "Bold, statement-driven typography that grabs attention instantly.",
  },
};

export const TYPOGRAPHY_SCALE = {
  xs: "0.75rem (12px) - Line Height: 1rem - For metadata/badges",
  sm: "0.875rem (14px) - Line Height: 1.25rem - For body text/description",
  base: "1rem (16px) - Line Height: 1.5rem - Default font size",
  lg: "1.125rem (18px) - Line Height: 1.75rem - Large body/lead text",
  xl: "1.25rem (20px) - Line Height: 1.875rem - Small section headings",
  "2xl": "1.5rem (24px) - Line Height: 2rem - Card headings",
  "3xl": "1.875rem (30px) - Line Height: 2.25rem - Subsection headings",
  "4xl": "2.25rem (36px) - Line Height: 2.5rem - Main section headings",
  "5xl": "3rem (48px) - Line Height: 1.1 - Hero titles (Desktop)",
  "6xl": "3.75rem (60px) - Line Height: 1.1 - Large display hero titles",
};

export const TYPOGRAPHY_RULES = `
- Follow a strict hierarchical structure: h1 -> h2 -> h3 -> h4.
- Only use one h1 per page.
- Heading sizes must reduce by at least 15% on mobile breakpoints (e.g. text-5xl md:text-6xl).
- Body text should use a line-height of at least 1.5 (leading-relaxed) to guarantee accessibility.
- Never use pure black text on pure white background; use dark grey (#1f2937 or slate-900) to reduce eye strain.
`;
