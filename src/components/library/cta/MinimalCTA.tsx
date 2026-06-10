import React from "react";
import { getThemeClasses } from "@/lib/utils";

interface MinimalCTAProps {
  headline: string;
  description: string;
  primaryButton: string;
  secondaryButton?: string;
  tokens?: any;
}

export const MinimalCTA: React.FC<MinimalCTAProps> = ({
  headline,
  description,
  primaryButton = "Get Started",
  secondaryButton,
  tokens,
}) => {
  const theme = getThemeClasses(tokens);

  return (
    <section className={`relative py-24 overflow-hidden border-t ${theme.bg} ${theme.text} ${theme.border}`}>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] ${theme.isLight ? "bg-indigo-500/5" : "bg-indigo-500/10"} rounded-full blur-[100px] pointer-events-none`} />
      
      <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
        <h2 className={`text-4xl font-bold tracking-tight sm:text-6xl ${theme.isLight ? "text-zinc-950" : "bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500"} font-display`}>
          {headline}
        </h2>
        <p className={`mt-6 text-lg max-w-xl mx-auto leading-relaxed ${theme.textMuted}`}>
          {description}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            className={`px-8 py-3.5 font-semibold text-sm transition-all shadow-lg active:scale-98 ${theme.radius} ${theme.isLight ? "bg-zinc-900 hover:bg-zinc-800 text-white" : "bg-white hover:bg-neutral-200 text-black"}`}
          >
            {primaryButton}
          </button>
          {secondaryButton && (
            <button
              className={`px-8 py-3.5 font-semibold text-sm transition-all border hover:bg-slate-500/10 active:scale-98 ${theme.radius} ${theme.border} ${theme.text}`}
            >
              {secondaryButton}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
