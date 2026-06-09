import React from "react";
import { cn } from "@/lib/utils";
import { User, Quote } from "lucide-react";

interface TestimonialsCarouselProps {
  title: string;
  variant: "carousel-v1" | "grid-v1";
  items: {
    quote: string;
    name: string;
    role?: string;
  }[];
}

export function TestimonialsCarousel({
  title,
  variant,
  items = [],
}: TestimonialsCarouselProps) {
  if (variant === "grid-v1") {
    return (
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 hover:border-slate-800 transition-all duration-300 flex flex-col justify-between"
              >
                <Quote className="w-8 h-8 text-indigo-500/20 mb-6" />
                <p className="text-slate-300 italic mb-6 leading-relaxed">
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-800/50">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                    {item.role && (
                      <p className="text-xs text-slate-400 mt-0.5">{item.role}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const scrollItems = [...items, ...items];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h2>
        </div>

        <div className="w-full flex justify-center overflow-hidden">
          <div 
            className="flex gap-6 animate-marquee whitespace-nowrap"
            style={{
              animation: "marquee 35s linear infinite",
            }}
          >
            {scrollItems.map((item, index) => (
              <div
                key={index}
                className="w-[350px] shrink-0 p-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 flex flex-col justify-between whitespace-normal"
              >
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                    {item.role && (
                      <p className="text-[10px] text-slate-400 truncate">{item.role}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
