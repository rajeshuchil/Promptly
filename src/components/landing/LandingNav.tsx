"use client";

import React from "react";
import Link from "next/link";

export function LandingNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <header className="sticky top-0 z-40 flex w-full justify-center border-b border-white/5 bg-black/60 backdrop-blur-xl transition-all">
      <div className="container flex h-16 items-center justify-between py-4 px-6 max-w-7xl mx-auto">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white tracking-tight">FastApp</div>
          </Link>

          <nav className="hidden gap-6 md:flex items-center text-sm font-medium text-neutral-400">
            <a href="#pipeline" className="hover:text-white transition-colors">Pipeline</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <Link href="/build">
              <button className="h-9 px-3.5 rounded-md text-xs font-medium border border-white/10 bg-transparent hover:bg-white/5 text-white transition-colors">
                Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <button className="h-9 px-3.5 rounded-md text-xs font-medium border border-white/10 bg-transparent hover:bg-white/5 text-white transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/login">
                <button className="h-9 px-4 rounded-md text-xs font-medium bg-[#6ee7b7] text-[#161616] hover:bg-[#52dca6] transition-colors">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
