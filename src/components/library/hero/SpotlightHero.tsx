import React from "react";
import { getThemeClasses } from "@/lib/utils";

interface SpotlightHeroProps {
  headline?: string;
  subheadline?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  tokens?: any;
}

export const SpotlightHero: React.FC<SpotlightHeroProps> = ({
  headline = "The Next Generation of AI Productivity",
  subheadline = "Automate workflows, analyze complex datasets, and streamline operations with autonomous AI agents.",
  primaryCTA = "Launch App",
  secondaryCTA = "Read Docs",
  tokens
}) => {
  const theme = getThemeClasses(tokens);

  return (
    <div className={`relative overflow-hidden py-32 flex flex-col items-center justify-center text-center ${theme.bg} ${theme.text}`}>
      {/* Futuristic Spotlight Effect */}
      <div 
        className={`pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] ${theme.isLight ? "bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05),transparent_60%)]" : "bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)]"} blur-2xl`}
        style={{ top: '-10%' }}
      />
      <div 
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 w-[400px] h-[200px] ${theme.isLight ? "bg-indigo-500/5" : "bg-indigo-500/10"} rounded-full blur-3xl`}
        style={{ top: '5%' }}
      />

      <div className="relative mx-auto max-w-4xl px-6 z-10">
        <div className={`mx-auto mb-6 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${theme.isLight ? "border-indigo-500/20 bg-indigo-500/5 text-indigo-600" : "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"}`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-indigo-400 ${theme.isLight ? "" : "animate-pulse"}`} />
          Introducing V2 Agents
        </div>

        <h1 className={`text-4xl font-extrabold tracking-tight sm:text-6xl ${theme.isLight ? "text-zinc-950" : "bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"}`}>
          {headline}
        </h1>

        <p className={`mx-auto mt-6 max-w-2xl text-lg leading-8 ${theme.textMuted}`}>
          {subheadline}
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button className={`inline-flex h-12 items-center justify-center px-8 text-sm font-semibold text-white shadow-lg transition-all ${theme.primaryBg} ${theme.primaryHoverBg} ${theme.radius} active:scale-98`}>
            {primaryCTA}
          </button>
          {secondaryCTA && (
            <button className={`inline-flex h-12 items-center justify-center border px-8 text-sm font-semibold transition-all hover:bg-slate-500/10 active:scale-98 ${theme.border} ${theme.text} ${theme.radius}`}>
              {secondaryCTA}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
