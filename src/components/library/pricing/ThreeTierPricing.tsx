import React from "react";

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
  const primaryBgColor = tokens?.primaryColor ? `bg-${tokens.primaryColor}` : 'bg-indigo-600';
  const primaryHoverBgColor = tokens?.primaryColor ? `hover:bg-${tokens.primaryColor}/80` : 'hover:bg-indigo-600/80';

  return (
    <div className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-slate-400">{subtitle}</p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 ring-1 xl:p-10 flex flex-col justify-between ${
                tier.popular
                  ? "bg-slate-900 ring-white/20 border border-white/10"
                  : "bg-transparent ring-white/10 border border-white/5"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-bold leading-8 text-white">{tier.name}</h3>
                  {tier.popular && (
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-4xl font-extrabold tracking-tight text-white">{tier.price}</span>
                  {tier.price !== "Custom" && <span className="text-sm font-semibold text-slate-400">/month</span>}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-300">
                  {tier.features.map((feat, fidx) => (
                    <li key={fidx} className="flex gap-x-3">
                      <span className="text-slate-500">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={`mt-8 block w-full rounded-md px-3.5 py-2 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors ${
                  tier.popular
                    ? `${primaryBgColor} ${primaryHoverBgColor} text-white`
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
