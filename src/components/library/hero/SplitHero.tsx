import React from "react";
import { getThemeClasses } from "@/lib/utils";

interface SplitHeroProps {
  headline?: string;
  subheadline?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  imageSrc?: string;
  tokens?: any;
}

export const SplitHero: React.FC<SplitHeroProps> = ({
  headline = "Engage your audience with intelligence",
  subheadline = "The smart workspace built to design, deploy, and scale high-converting user interfaces without writing code.",
  primaryCTA = "Get Started Free",
  secondaryCTA = "Schedule Demo",
  imageSrc = "",
  tokens
}) => {
  const theme = getThemeClasses(tokens);
  
  // Empty image fallback fix
  const resolvedImageSrc = imageSrc || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";

  return (
    <div className={`relative overflow-hidden py-20 lg:py-32 ${theme.bg} ${theme.text}`}>
      <div className="mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-6 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-none">
            {headline}
          </h1>
          <p className={`mt-6 text-lg leading-8 ${theme.textMuted}`}>
            {subheadline}
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <button className={`inline-flex h-12 items-center justify-center px-6 text-sm font-semibold text-white shadow-sm transition-colors ${theme.primaryBg} ${theme.primaryHoverBg} ${theme.radius}`}>
              {primaryCTA}
            </button>
            {secondaryCTA && (
              <button className={`inline-flex h-12 items-center justify-center border bg-transparent px-6 text-sm font-semibold transition-colors hover:bg-slate-500/10 ${theme.border} ${theme.text} ${theme.radius}`}>
                {secondaryCTA}
              </button>
            )}
          </div>
        </div>
        <div className="mt-16 sm:mt-24 lg:col-span-6 lg:mt-0 flex items-center justify-center">
          <div className={`relative w-full max-w-lg lg:max-w-none aspect-[4/3] overflow-hidden shadow-2xl border ${theme.border} ${theme.radius}`}>
            <img
              src={resolvedImageSrc}
              alt="Workspace Screenshot"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${theme.isLight ? "from-white/20" : "from-slate-950/50"} via-transparent to-transparent opacity-50`} />
          </div>
        </div>
      </div>
    </div>
  );
};
