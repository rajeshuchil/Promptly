import React from "react";

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
  const primaryBgColor = tokens?.primaryColor ? `bg-${tokens.primaryColor}` : 'bg-indigo-600';
  const primaryHoverBgColor = tokens?.primaryColor ? `hover:bg-${tokens.primaryColor}/80` : 'hover:bg-indigo-600/80';

  return (
    <div className="relative overflow-hidden bg-slate-950 py-32 flex flex-col items-center justify-center text-center">
      {/* Futuristic Spotlight Effect */}
      <div 
        className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)] blur-2xl"
        style={{ top: '-10%' }}
      />
      <div 
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-indigo-500/10 rounded-full blur-3xl"
        style={{ top: '5%' }}
      />

      <div className="relative mx-auto max-w-4xl px-6 z-10">
        <div className="mx-auto mb-6 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Introducing V2 Agents
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          {headline}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          {subheadline}
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button className={`inline-flex h-12 items-center justify-center rounded-lg px-8 text-sm font-semibold text-white shadow-lg transition-all ${primaryBgColor} ${primaryHoverBgColor} active:scale-98`}>
            {primaryCTA}
          </button>
          {secondaryCTA && (
            <button className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-900 px-8 text-sm font-semibold text-slate-300 transition-all active:scale-98">
              {secondaryCTA}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
