import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely using clsx + tailwind-merge.
 * Prevents duplicate/conflicting class names.
 *
 * Usage:
 *   cn("px-4 py-2", condition && "bg-blue-500", "px-6") → "py-2 bg-blue-500 px-6"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
