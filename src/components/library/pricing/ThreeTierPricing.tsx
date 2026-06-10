import React from "react";
import { getThemeClasses } from "@/lib/utils";

interface PricingTier {
  name: string;
  price: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

interface ThreeTierPricingProps {
  title?: string;
  subtitle?: string;
  tiers?: PricingTier[];
  tokens?: any;
}

export const ThreeTierPricing: React.FC<ThreeTierPricingProps> = ({
  title = "Fair pricing for any stage",
  subtitle = "Choose the right path to accelerate your visual deployment velocity.",
  tiers = [
    { name: "Starter", price: "$0", features: ["1 Active Workspace", "10 Generations / Month", "Standard Models"], cta: "Start Free" },
    { name: "Pro", price: "$29", features: ["Unlimited Workspace", "100 Generations / Month", "Advanced Reasoning Model", "Custom Domains"], cta: "Upgrade to Pro", popular: true },
    { name: "Enterprise", price: "Custom", features: ["Dedicated Registry", "Unlimited Generations", "SLA guarantees"], cta: "Contact Sales" }
  ],
  tokens
}) => {
  const theme = getThemeClasses(tokens);

  return (
    <div className={`py-20 lg:py-28 ${theme.bg} ${theme.text}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          <p className={`mt-4 text-lg ${theme.textMuted}`}>{subtitle}</p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, idx) => {
            const cardBgStyle = tier.popular ? theme.cardBgRaised : theme.cardBg;
            const borderStyle = tier.popular ? theme.primaryBorder : theme.border;
            return (
              <div
                key={idx}
                className={`p-8 border flex flex-col justify-between transition-all duration-300 ${cardBgStyle} ${borderStyle} ${theme.radius}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3 className="text-lg font-bold leading-8">{tier.name}</h3>
                    {tier.popular && (
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ${theme.isLight ? "bg-indigo-100 text-indigo-800" : "bg-white/10 text-white"}`}>
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-4 flex items-baseline gap-x-2">
                    <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                    {tier.price !== "Custom" && <span className={`text-sm font-semibold ${theme.textMuted}`}>/month</span>}
                  </p>
                  <ul role="list" className={`mt-8 space-y-3 text-sm leading-6 ${theme.isLight ? "text-zinc-600" : "text-slate-300"}`}>
                    {tier.features.map((feat, fidx) => (
                      <li key={fidx} className="flex gap-x-3">
                        <span className={theme.primaryText}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={`mt-8 block w-full px-3.5 py-2 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors ${theme.radius} ${
                    tier.popular
                      ? `${theme.primaryBg} ${theme.primaryHoverBg} text-white`
                      : `${theme.isLight ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-900" : "bg-white/10 hover:bg-white/20 text-white"}`
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
