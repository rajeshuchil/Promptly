"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Sparkles,
  FolderOpen,
  Settings,
  Zap,
  HelpCircle,
  ExternalLink,
  LogOut,
  Layout,
  Hammer,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Nav items ──────────────────────────────────────────────────────────── */

const mainNavItems = [
  { href: "/build",      icon: Hammer,      label: "Build"      },
  { href: "/projects",   icon: FolderOpen,  label: "Projects"   },
  { href: "/templates",  icon: Layout,      label: "Templates"  },
] as const;

const secondaryNavItems = [
  { href: "/settings",   icon: Settings,    label: "Settings"   },
  { href: "/help",       icon: HelpCircle,  label: "Help & Docs"},
] as const;

/* ─── Sidebar Logo ───────────────────────────────────────────────────────── */

function SidebarLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-5 cursor-pointer hover:opacity-90 transition-opacity"
    >
      {/* Icon mark */}
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#6ee7b7] shrink-0">
        <Zap className="w-4 h-4 text-[#161616]" strokeWidth={2.5} />
      </div>
      {/* Wordmark */}
      <span className="text-base font-bold tracking-tight text-white">
        FastApp
      </span>
    </Link>
  );
}

/* ─── Nav Link ───────────────────────────────────────────────────────────── */

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

function NavLink({ href, icon: Icon, label, isActive, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative group flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors duration-200",
        isActive ? "text-white" : "text-neutral-400 hover:text-white"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-nav-pill"
          className="absolute inset-0 bg-white/[0.04] border border-white/[0.06] rounded-md"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <Icon
        className={cn(
          "w-4 h-4 flex-shrink-0 transition-all duration-200 z-10",
          isActive ? "text-[#6ee7b7]" : "text-neutral-500 group-hover:text-neutral-300 group-hover:translate-x-0.5"
        )}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span className="z-10">{label}</span>
      {/* Build gets an accent indicator */}
      {href === "/build" && isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6ee7b7] animate-pulse z-10" />
      )}
    </Link>
  );
}

/* ─── Sidebar Content (Shared between desktop and mobile drawer) ─────────── */

interface SidebarContentProps {
  pathname: string;
  user: any;
  onNavClick?: () => void;
  showClose?: boolean;
  onClose?: () => void;
}

function SidebarContent({
  pathname,
  user,
  onNavClick,
  showClose,
  onClose,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header with Logo and optional close button */}
      <div className="flex items-center justify-between pr-3">
        <SidebarLogo onClick={onNavClick} />
        {showClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-white/5" />

      {/* Primary nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto" aria-label="Primary">
        <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
          Workspace
        </p>
        {mainNavItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-white/5 pt-4 shrink-0">
        {secondaryNavItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
            onClick={onNavClick}
          />
        ))}
      </div>

      {/* User Profile Card */}
      {user && (
        <div className="mx-3 mb-2 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 flex flex-col gap-3 shadow-lg shadow-black/40 shrink-0">
          <div className="flex items-center justify-between gap-2.5 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Avatar badge */}
              <div className="w-7 h-7 rounded-full bg-[#6ee7b7] flex items-center justify-center text-[10px] font-bold text-[#161616] uppercase shrink-0 ring-1 ring-white/10">
                {user.name ? user.name[0] : (user.email ? user.email[0] : "?")}
              </div>
              {/* Details */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-white truncate">
                    {user.name || "Developer"}
                  </span>
                  <span className="px-1 py-0.5 rounded text-[8px] font-extrabold uppercase bg-[#6ee7b7]/10 text-[#6ee7b7] border border-[#6ee7b7]/20 select-none">
                    PRO
                  </span>
                </div>
                <span className="text-[9px] text-neutral-500 truncate">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sign Out"
              className="p-1.5 rounded-md text-neutral-500 hover:text-white hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Version badge */}
      <div className="mx-3 mb-4 px-3 py-2 rounded-md border border-white/5 text-[10px] text-neutral-600 flex items-center gap-1.5 shrink-0">
        <ExternalLink className="w-3 h-3" />
        FastApp&nbsp;
        <span className="text-[#6ee7b7] font-semibold">v0.1.0</span>
        &nbsp;· alpha
      </div>
    </div>
  );
}

/* ─── Main Sidebar Component ─────────────────────────────────────────────── */

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ─── Mobile Top Header Bar (< md) ─────────────────────────────────── */}
      <header id="mobile-nav-header" className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#09090b]/95 backdrop-blur-md shrink-0 z-30">
        <Link href="/" className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#6ee7b7] shrink-0">
            <Zap className="w-3.5 h-3.5 text-[#161616]" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            FastApp
          </span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          className="p-2 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ─── Mobile Navigation Drawer (< md) ──────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Sliding Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#09090b] border-r border-white/[0.08] flex flex-col shadow-2xl z-10 overflow-y-auto"
              aria-label="Mobile navigation"
            >
              <SidebarContent
                pathname={pathname}
                user={user}
                onNavClick={() => setIsOpen(false)}
                showClose
                onClose={() => setIsOpen(false)}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Desktop Persistent Sidebar (>= md) ────────────────────────────── */}
      <aside
        id="app-sidebar"
        className="hidden md:flex flex-col w-56 shrink-0 h-full border-r border-white/[0.04] bg-[#09090b]/90 backdrop-blur-xl"
        aria-label="Main navigation"
      >
        <SidebarContent pathname={pathname} user={user} />
      </aside>
    </>
  );
}
