export interface ColorSystem {
  background: string;
  cardBackground: string;
  raisedCardBackground: string;
  border: string;
  textPrimary: string;
  textMuted: string;
  brandPrimary: string;
  brandSecondary: string;
  success: string;
  warning: string;
  danger: string;
}

export const COLOR_SYSTEMS: Record<string, ColorSystem> = {
  minimal: {
    background: "#fafafa",
    cardBackground: "#ffffff",
    raisedCardBackground: "#f4f4f5",
    border: "#e4e4e7",
    textPrimary: "#09090b",
    textMuted: "#71717a",
    brandPrimary: "#18181b",
    brandSecondary: "#27272a",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
  },
  "modern-saas": {
    background: "#090a16",
    cardBackground: "#111322",
    raisedCardBackground: "#171a30",
    border: "#1e223c",
    textPrimary: "#f3f4f6",
    textMuted: "#9ca3af",
    brandPrimary: "#6366f1", // Indigo
    brandSecondary: "#ec4899", // Pink
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
  },
  glassmorphism: {
    background: "#03001e",
    cardBackground: "rgba(255, 255, 255, 0.03)",
    raisedCardBackground: "rgba(255, 255, 255, 0.07)",
    border: "rgba(255, 255, 255, 0.08)",
    textPrimary: "#f8fafc",
    textMuted: "#94a3b8",
    brandPrimary: "#d946ef", // Fuchsia
    brandSecondary: "#8b5cf6", // Violet
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
  },
  enterprise: {
    background: "#0f172a", // Dark slate
    cardBackground: "#1e293b",
    raisedCardBackground: "#334155",
    border: "#334155",
    textPrimary: "#f8fafc",
    textMuted: "#94a3b8",
    brandPrimary: "#0284c7", // Sky blue
    brandSecondary: "#0f766e", // Teal
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
  },
  startup: {
    background: "#000000",
    cardBackground: "#0d0d0d",
    raisedCardBackground: "#1a1a1a",
    border: "#262626",
    textPrimary: "#ffffff",
    textMuted: "#a3a3a3",
    brandPrimary: "#ff5722", // Neon Orange
    brandSecondary: "#e91e63", // Neon Pink
    success: "#22c55e",
    warning: "#eab308",
    danger: "#ef4444",
  },
};

export const SPACING = {
  xs: "0.25rem (4px)",
  sm: "0.5rem (8px)",
  md: "1rem (16px)",
  lg: "1.5rem (24px)",
  xl: "2rem (32px)",
  xxl: "3rem (48px)",
  layout: "4rem (64px) to 6rem (96px) for section padding",
};

export const BORDER_RADIUS = {
  minimal: "0px or 4px (tight and industrial)",
  "modern-saas": "12px or 16px (smooth, organic)",
  glassmorphism: "20px or 24px (curved, premium)",
  enterprise: "6px or 8px (sharp, corporate)",
  startup: "10px or 12px (dynamic, punchy)",
};

export const SHADOWS = {
  subtle: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
  medium: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
  strong: "0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)",
  glow: "0 0 15px rgba(var(--brand-primary-rgb), 0.15), 0 0 30px rgba(var(--brand-primary-rgb), 0.1)",
};
