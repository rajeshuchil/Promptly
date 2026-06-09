import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Layers, Shield, Zap, Globe, Cpu } from "lucide-react";
import { AnimatedGridBackground } from "../effects/AnimatedGridBackground";

interface BentoFeatureGridProps {
  title: string;
  subtitle?: string;
  variant: "bento-v1" | "three-column-v1";
  items: {
    title: string;
    description: string;
    icon?: string;
  }[];
  effect?: "grid" | "none";
}

const iconMap: Record<string, React.ComponentType<any>> = {
  sparkles: Sparkles,
  layers: Layers,
  shield: Shield,
  zap: Zap,
  globe: Globe,
  cpu: Cpu,
};

export function BentoFeatureGrid({
  title,
  subtitle,
  variant,
  items = [],
  effect = "none",
}: BentoFeatureGridProps) {
  const renderIcon = (name?: string) => {
    const IconComponent = iconMap[name?.toLowerCase() || ""] || Sparkles;
    return <IconComponent className="w-6 h-6 text-indigo-400 shrink-0" />;
  };

  const renderEffect = () => {
    if (effect === "grid") return <AnimatedGridBackground />;
    return null;
  };

  if (variant === "three-column-v1") {
    return (
      <section className="relative py-24 bg-slate-950 overflow-hidden">
        {renderEffect()}
        <div className="relative max-w-7xl mx-auto px-6 z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 text-lg text-slate-400 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <div
                key={index}
                className="relative group p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-all duration-300 hover:border-indigo-500/30 overflow-hidden"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800/80 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {renderIcon(item.icon)}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const colSpans = ["col-span-1 md:col-span-2", "col-span-1", "col-span-1", "col-span-1 md:col-span-2"];

  return (
    <section className="relative py-24 bg-slate-950 overflow-hidden">
      {renderEffect()}
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-slate-400 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {items.slice(0, 4).map((item, index) => {
            const spanClass = colSpans[index % colSpans.length];
            return (
              <div
                key={index}
                className={cn(
                  "relative group flex flex-col justify-end p-8 rounded-3xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 transition-all duration-300 hover:border-indigo-500/20 overflow-hidden",
                  spanClass
                )}
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-300" />
                <div className="mb-auto w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800/60">
                  {renderIcon(item.icon)}
                </div>
                <div className="mt-6 z-10">
                  <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors duration-300 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
