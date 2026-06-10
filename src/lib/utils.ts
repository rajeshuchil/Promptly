import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely using clsx + tailwind-merge.
 * Prevents duplicate/conflicting class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Dynamic theme configuration resolver based on design tokens.
 * Supports light, dark, custom accent gradients, and custom spacing.
 */
export function getThemeClasses(tokens: any) {
  const isLight = tokens?.backgroundColor?.includes("white") || 
                  tokens?.backgroundColor?.includes("50") || 
                  tokens?.backgroundColor?.includes("100") || 
                  tokens?.backgroundColor?.includes("zinc-") ||
                  tokens?.backgroundColor === "zinc-100" || 
                  tokens?.backgroundColor === "slate-100" ||
                  tokens?.backgroundColor === "stone-50" ||
                  tokens?.backgroundColor === "amber-50" ||
                  tokens?.backgroundColor === "yellow-100";
  
  const bg = tokens?.backgroundColor ? (tokens.backgroundColor.startsWith("bg-") ? tokens.backgroundColor : `bg-${tokens.backgroundColor}`) : "bg-slate-950";
  const text = tokens?.textColor ? (tokens.textColor.startsWith("text-") ? tokens.textColor : `text-${tokens.textColor}`) : "text-slate-50";
  
  const textMuted = isLight ? "text-zinc-500" : "text-slate-400";
  const border = isLight ? "border-zinc-200" : "border-slate-800/80";
  const borderMuted = isLight ? "border-zinc-100" : "border-slate-900";
  const cardBg = isLight ? "bg-white" : "bg-slate-900/50";
  const cardBgRaised = isLight ? "bg-zinc-100/50" : "bg-slate-900/90";
  
  // Border radius map
  const radiusMap: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full"
  };
  
  const radius = radiusMap[tokens?.borderRadius] || "rounded-lg";
  
  const primaryBg = tokens?.primaryColor ? (tokens.primaryColor.startsWith("bg-") ? tokens.primaryColor : `bg-${tokens.primaryColor}`) : "bg-indigo-600";
  const primaryText = tokens?.primaryColor ? (tokens.primaryColor.startsWith("text-") ? tokens.primaryColor : `text-${tokens.primaryColor}`) : "text-indigo-600";
  const primaryBorder = tokens?.primaryColor ? (tokens.primaryColor.startsWith("border-") ? tokens.primaryColor : `border-${tokens.primaryColor}`) : "border-indigo-600";
  const primaryHoverBg = tokens?.primaryColor ? `hover:bg-${tokens.primaryColor.replace("bg-", "")}/80` : "hover:bg-indigo-600/80";
  
  return {
    isLight,
    bg,
    text,
    textMuted,
    border,
    borderMuted,
    cardBg,
    cardBgRaised,
    radius,
    primaryBg,
    primaryText,
    primaryBorder,
    primaryHoverBg
  };
}
