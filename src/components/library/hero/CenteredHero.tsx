import React from "react";
import { getThemeClasses } from "@/lib/utils";

interface CenteredHeroProps {
  headline?: string;
  subheadline?: string;
  primaryCTA?: string;
  tokens?: any;
}

export const CenteredHero: React.FC<CenteredHeroProps> = ({
  headline = "The Future of Development is Here",
  subheadline = "Design layout systems, bind application workflows, and launch directly to production domains instantly.",
  primaryCTA = "Start building now",
  tokens
}) => {
  const theme = getThemeClasses(tokens);

  return (
    <div className={`relative overflow-hidden py-24 sm:py-32 flex flex-col items-center justify-center text-center ${theme.bg} ${theme.text}`}>
      <div className="mx-auto max-w-4xl px-6">
        <h1 className={`text-4xl font-extrabold tracking-tight sm:text-6xl ${theme.isLight ? "text-zinc-900" : "bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent"}`}>
          {headline}
        </h1>
        <p className={`mx-auto mt-6 max-w-2xl text-lg leading-8 ${theme.textMuted}`}>
          {subheadline}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button className={`inline-flex h-12 items-center justify-center px-8 text-sm font-semibold text-white shadow-sm transition-colors ${theme.primaryBg} ${theme.primaryHoverBg} ${theme.radius}`}>
            {primaryCTA}
          </button>
        </div>
      </div>
    </div>
  );
};
