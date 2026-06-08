"use client";

import React from "react";
import Link from "next/link";
import { Wand2, Sparkles, CheckCircle2 } from "lucide-react";

export function FinalCTASection({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="relative z-10 px-6 py-24 max-w-5xl mx-auto text-center bg-[#161616]">
      <div className="bg-[#1B1B1B] rounded border border-white/10 p-12 md:p-16 relative overflow-hidden shadow-lg">
        
        {/* Sparkle badge */}
        <div className="w-12 h-12 rounded flex items-center justify-center mx-auto mb-8 bg-white/5 border border-white/10">
          <Sparkles className="w-6 h-6 text-[#6ee7b7] animate-pulse" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
          Turn ideas into production-ready websites
        </h2>
        
        {/* Tagline */}
        <p className="text-sm md:text-base text-neutral-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Start building gorgeous layout assets today. The free tier contains credits for planning, generation validation, and instant edge preview URLs.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
          <Link
            href={isAuthenticated ? "/build" : "/login"}
            className="group flex items-center justify-center gap-2 w-full px-6 h-12 text-lg font-medium rounded-full bg-[#6ee7b7] text-[#161616] hover:bg-[#52dca6] transition-colors"
          >
            <Wand2 className="w-5 h-5" />
            Start Building
          </Link>
          {!isAuthenticated && (
            <Link
              href="/login"
              className="group flex items-center justify-center gap-2 w-full px-6 h-12 text-lg font-medium rounded-full border border-white/10 bg-transparent hover:bg-white/5 text-white transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 text-[11px] text-neutral-400 border-t border-white/5 pt-8">
          {["No credit card required", "Free tier available", "Open source on GitHub", "Multi-model AI"].map((t) => (
            <span key={t} className="flex items-center gap-1.5 font-medium text-white/60">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              {t}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
