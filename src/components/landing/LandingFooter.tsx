"use client";

import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-4 sm:px-6 py-10 sm:py-12 bg-[#161616]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-400">
        
        {/* Brand info */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded flex items-center justify-center bg-[#6ee7b7]"
          >
            <Zap className="w-4 h-4 text-[#161616]" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white text-sm">FastApp</span>
          <span className="text-neutral-400">— AI Page Platform</span>
        </div>

        {/* Links & Copyright */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6 text-center md:text-right">
          <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          <a href="https://github.com/rajeshuchil/Promptly" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <span>© {new Date().getFullYear()} FastApp. All rights reserved.</span>
        </div>

      </div>
    </footer>
  );
}
