export interface ComponentSpec {
  name: string;
  description: string;
  tailwindSpecs: {
    base: string;
    variants: Record<string, string>;
    states: string;
  };
  accessibilityGuidelines: string;
}

export const COMPONENT_CATALOG: Record<string, ComponentSpec> = {
  button: {
    name: "Interactive Button",
    description: "Action trigger with support for solid, outline, and ghost variants.",
    tailwindSpecs: {
      base: "inline-flex items-center justify-center font-semibold text-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2",
      variants: {
        primary: "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-sm px-4 py-2 rounded-xl",
        secondary: "bg-white/10 text-white hover:bg-white/15 border border-white/5 px-4 py-2 rounded-xl",
        outline: "border border-border text-primary hover:bg-white/5 px-4 py-2 rounded-xl",
        ghost: "text-muted hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg",
      },
      states: "disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]",
    },
    accessibilityGuidelines: "Must include aria-label if icon-only. Must use keyboard focus highlights (focus-visible:ring-2).",
  },
  card: {
    name: "Layout Card Container",
    description: "Standard layout divider block with header, body, and footer structure.",
    tailwindSpecs: {
      base: "rounded-2xl border transition-all duration-300",
      variants: {
        standard: "bg-cardBackground border-border p-6 shadow-sm",
        elevated: "bg-raisedCardBackground border-border p-6 shadow-medium hover:shadow-strong",
        glass: "bg-white/5 backdrop-blur-xl border-white/8 p-6 shadow-lg hover:border-brand-primary/40",
      },
      states: "hover:translate-y-[-2px] transition-transform duration-200",
    },
    accessibilityGuidelines: "Ensure headings within cards match section depth hierarchy. Use semantic tags.",
  },
  input: {
    name: "Form Text Input",
    description: "Text area or field supporting labels, error highlights, and icon adornments.",
    tailwindSpecs: {
      base: "w-full text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
      variants: {
        standard: "bg-black/20 border-border text-white placeholder:text-muted px-3.5 py-2.5",
        glass: "bg-white/3 border-white/8 text-white placeholder:text-white/40 px-3.5 py-2.5",
      },
      states: "focus:border-brand-primary/80 disabled:opacity-50 disabled:bg-black/40",
    },
    accessibilityGuidelines: "Must be programmatically associated with a <label> using 'for' and 'id'. Support aria-invalid.",
  },
  badge: {
    name: "Informative Badge Badge",
    description: "Pill indicator displaying metadata, statuses, tags, or count scores.",
    tailwindSpecs: {
      base: "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      variants: {
        brand: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
        success: "bg-success/10 text-success border-success/20",
        warning: "bg-warning/10 text-warning border-warning/20",
        danger: "bg-danger/10 text-danger border-danger/20",
        neutral: "bg-white/5 text-muted border-white/8",
      },
      states: "none",
    },
    accessibilityGuidelines: "If badge conveys status (e.g. 'Failed'), add screen-reader helpers if status is critical.",
  },
  toggle: {
    name: "Switch/Toggle Selector",
    description: "Interactive switch for binary configuration states.",
    tailwindSpecs: {
      base: "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary",
      variants: {
        active: "bg-brand-primary",
        inactive: "bg-white/10",
      },
      states: "thumb: translate-x-4 (active) or translate-x-0 (inactive)",
    },
    accessibilityGuidelines: "Must act as role='switch' with aria-checked='true|false'.",
  },
};
