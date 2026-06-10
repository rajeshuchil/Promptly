import React from "react";
import { getThemeClasses } from "@/lib/utils";

interface LampHeroProps {
  headline?: string;
  subheadline?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  tokens?: any;
}

export const LampHero: React.FC<LampHeroProps> = ({
  headline = "The Premium Platform for Enterprise Teams",
  subheadline = "Deploy robust backend architectures, scale analytical pipelines, and automate security configurations globally.",
  primaryCTA = "Deploy Now",
  secondaryCTA = "Request Demo",
  tokens
}) => {
  const theme = getThemeClasses(tokens);

  return (
    <div className={`relative overflow-hidden py-36 flex flex-col items-center justify-center text-center ${theme.bg} ${theme.text}`}>
      {/* Premium Lamp Glow Effect */}
      <div className="absolute inset-x-0 top-0 flex justify-center overflow-hidden pointer-events-none">
        <div className="relative flex w-full max-w-7xl items-center justify-center">
          {/* Left lamp beam */}
          <div 
            className={`absolute right-1/2 top-0 h-44 w-[400px] bg-gradient-to-l ${theme.isLight ? "from-indigo-500/5" : "from-indigo-500/10"} to-transparent blur-2xl`} 
            style={{ transform: 'skewY(-10deg)', transformOrigin: 'top right' }}
          />
          {/* Right lamp beam */}
          <div 
            className={`absolute left-1/2 top-0 h-44 w-[400px] bg-gradient-to-r ${theme.isLight ? "from-indigo-500/5" : "from-indigo-500/10"} to-transparent blur-2xl`} 
            style={{ transform: 'skewY(10deg)', transformOrigin: 'top left' }}
          />
          {/* Bright center light sources */}
          <div className={`absolute top-0 w-[500px] h-[100px] ${theme.isLight ? "bg-indigo-400/5" : "bg-indigo-400/20"} rounded-full blur-[80px]`} />
          <div className={`absolute top-0 w-[300px] h-[50px] ${theme.isLight ? "bg-indigo-300/10" : "bg-indigo-300/30"} rounded-full blur-[40px]`} />
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-6 z-10">
        <h1 className={`text-5xl font-extrabold tracking-tight sm:text-7xl leading-tight ${theme.isLight ? "text-zinc-950" : "bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-white to-slate-400"}`}>
          {headline}
        </h1>

        <p className={`mx-auto mt-8 max-w-2xl text-lg leading-8 ${theme.textMuted}`}>
          {subheadline}
        </p>

        <div className="mt-12 flex items-center justify-center gap-4">
          <button className={`inline-flex h-12 items-center justify-center px-8 text-sm font-semibold text-white shadow-xl transition-all ${theme.primaryBg} ${theme.primaryHoverBg} ${theme.radius} active:scale-98`}>
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
