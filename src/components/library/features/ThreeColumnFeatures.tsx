import React from "react";

interface FeatureItem {
  icon?: string;
  title: string;
  desc: string;
}

interface ThreeColumnFeaturesProps {
  title?: string;
  subtitle?: string;
  items?: FeatureItem[];
  tokens?: any;
}

export const ThreeColumnFeatures: React.FC<ThreeColumnFeaturesProps> = ({
  title = "Engineered for rapid iteration",
  subtitle = "Everything you need to conceptualize, mock, and publish live interactive pages.",
  items = [
    { title: "SaaS Blueprinting", desc: "Start from high-converting structure maps and layout options." },
    { title: "Dynamic Themes", desc: "Instantly switch typography palettes, HSL scales, and border rounding profiles." },
    { title: "Edge Deployment", desc: "Your rendered spec runs directly on global Edge infrastructure." }
  ],
  tokens
}) => {
  return (
    <div className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-slate-400">{subtitle}</p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all hover:translate-y-[-4px] duration-300">
                <dt className="text-lg font-bold text-white mb-3">
                  {item.title}
                </dt>
                <dd className="text-sm leading-6 text-slate-400 flex-auto">
                  {item.desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
