import React from "react";
import { cn, getThemeClasses } from "@/lib/utils";
import { User, Quote } from "lucide-react";

interface TestimonialsCarouselProps {
  title: string;
  variant: "carousel-v1" | "grid-v1";
  items: {
    quote: string;
    name: string;
    role?: string;
  }[];
  tokens?: any;
}

export function TestimonialsCarousel({
  title,
  variant,
  items = [],
  tokens,
}: TestimonialsCarouselProps) {
  const theme = getThemeClasses(tokens);

  if (variant === "grid-v1") {
    return (
      <section className={`py-24 relative overflow-hidden ${theme.bg} ${theme.text}`}>
        <div className={`absolute inset-0 ${theme.isLight ? "bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.02),transparent_70%)]" : "bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_70%)]"} pointer-events-none`} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <div
                key={index}
                className={`p-8 border hover:bg-slate-500/5 transition-all duration-300 flex flex-col justify-between ${theme.cardBg} ${theme.border} ${theme.radius}`}
              >
                <Quote className={`w-8 h-8 mb-6 ${theme.isLight ? "text-zinc-300" : "text-indigo-500/20"}`} />
                <p className={`italic mb-6 leading-relaxed ${theme.isLight ? "text-zinc-700" : "text-slate-300"}`}>
                  "{item.quote}"
                </p>
                <div className={`flex items-center gap-3 mt-auto pt-4 border-t ${theme.borderMuted}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme.isLight ? "bg-zinc-100" : "bg-slate-800"}`}>
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{item.name}</h4>
                    {item.role && (
                      <p className={`text-xs mt-0.5 ${theme.textMuted}`}>{item.role}</p>
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
    <section className={`py-24 relative overflow-hidden ${theme.bg} ${theme.text}`}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
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
                className={`w-[350px] shrink-0 p-8 border flex flex-col justify-between whitespace-normal ${theme.cardBg} ${theme.border} ${theme.radius}`}
              >
                <p className={`text-sm leading-relaxed mb-6 ${theme.isLight ? "text-zinc-700" : "text-slate-300"}`}>
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${theme.isLight ? "bg-zinc-100" : "bg-slate-800"}`}>
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold truncate">{item.name}</h4>
                    {item.role && (
                      <p className={`text-[10px] truncate ${theme.textMuted}`}>{item.role}</p>
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
