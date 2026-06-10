"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

export function LandingNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Pipeline", link: "#pipeline" },
    { name: "Features", link: "#features" },
    { name: "Templates", link: "#templates" },
    { name: "Architecture", link: "#architecture" },
  ];

  return (
    <div className="relative w-full z-50">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-lg font-bold text-white tracking-tight">FastApp</div>
          </Link>
          <NavItems items={navItems} />
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/build">
                <button className="h-8 px-4 rounded-full text-xs font-semibold border border-white/10 bg-transparent hover:bg-white/5 text-white transition-colors cursor-pointer">
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button className="h-8 px-4 rounded-full text-xs font-semibold border border-white/10 bg-transparent hover:bg-white/5 text-white transition-colors cursor-pointer">
                    Sign In
                  </button>
                </Link>
                <Link href="/login">
                  <button className="h-8 px-4 rounded-full text-xs font-semibold bg-[#6ee7b7] text-[#161616] hover:bg-[#52dca6] transition-colors cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-lg font-bold text-white tracking-tight">FastApp</div>
            </Link>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors text-sm font-medium py-1.5 w-full block"
              >
                {item.name}
              </a>
            ))}
            <div className="flex w-full flex-col gap-2 pt-3 border-t border-white/5">
              {isAuthenticated ? (
                <Link href="/build" className="w-full">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full h-9 px-4 rounded-lg text-xs font-semibold border border-white/10 bg-transparent hover:bg-white/5 text-white transition-colors cursor-pointer"
                  >
                    Dashboard
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="w-full">
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full h-9 px-4 rounded-lg text-xs font-semibold border border-white/10 bg-transparent hover:bg-white/5 text-white transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                  </Link>
                  <Link href="/login" className="w-full">
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full h-9 px-4 rounded-lg text-xs font-semibold bg-[#6ee7b7] text-[#161616] hover:bg-[#52dca6] transition-colors cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
