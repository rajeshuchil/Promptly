import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-lg)] font-semibold text-sm transition-all duration-[var(--duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-brand-500 text-white border border-brand-400 hover:opacity-90 hover:shadow-[var(--shadow-glow-brand)] hover:-translate-y-px active:translate-y-0",
        secondary:
          "bg-surface-700 text-surface-100 border border-surface-500 hover:bg-surface-600 hover:border-surface-400",
        ghost:
          "bg-transparent text-surface-300 hover:bg-surface-700 hover:text-surface-100",
        outline:
          "bg-transparent text-surface-200 border border-surface-500 hover:bg-surface-700 hover:text-surface-100",
        destructive:
          "bg-destructive text-destructive-fg border border-destructive/50 hover:opacity-90",
        link:
          "bg-transparent text-brand-400 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm:   "h-8  px-3   text-xs",
        md:   "h-9  px-4   text-sm",
        lg:   "h-11 px-6   text-base",
        icon: "h-9  w-9    p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
