"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";

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

function SidebarLogo() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-5">
      {/* Icon mark */}
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#6ee7b7]">
        <Zap className="w-4 h-4 text-[#161616]" strokeWidth={2.5} />
      </div>
      {/* Wordmark */}
      <span className="text-base font-bold tracking-tight text-white">
        FastApp
      </span>
    </div>
  );
}

/* ─── Nav Link ───────────────────────────────────────────────────────────── */

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

function NavLink({ href, icon: Icon, label, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-150",
        isActive
          ? "bg-white/[0.06] text-white border border-white/10"
          : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 flex-shrink-0 transition-colors",
          isActive ? "text-[#6ee7b7]" : "text-neutral-500"
        )}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span>{label}</span>
      {/* Build gets an accent indicator */}
      {href === "/build" && isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6ee7b7] animate-pulse" />
      )}
    </Link>
  );
}

/* ─── Main Sidebar ───────────────────────────────────────────────────────── */

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside
      id="app-sidebar"
      className="flex flex-col w-56 shrink-0 h-full border-r border-white/5 bg-[#0a0a0a]"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <SidebarLogo />

      {/* Divider */}
      <div className="mx-3 h-px bg-white/5" />

      {/* Primary nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5" aria-label="Primary">
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
          />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-white/5 pt-4">
        {secondaryNavItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
      </div>

      {/* User Profile Card */}
      {user && (
        <div className="mx-3 mb-2 p-3 rounded-lg border border-white/5 bg-white/[0.03] flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar badge */}
            <div className="w-7 h-7 rounded-full bg-[#6ee7b7] flex items-center justify-center text-[10px] font-bold text-[#161616] uppercase shrink-0">
              {user.name ? user.name[0] : (user.email ? user.email[0] : "?")}
            </div>
            {/* Details */}
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-white truncate">
                {user.name || "Developer"}
              </span>
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
      )}

      {/* Version badge */}
      <div className="mx-3 mb-4 px-3 py-2 rounded-md border border-white/5 text-[10px] text-neutral-600 flex items-center gap-1.5">
        <ExternalLink className="w-3 h-3" />
        FastApp&nbsp;
        <span className="text-[#6ee7b7] font-semibold">v0.1.0</span>
        &nbsp;· alpha
      </div>
    </aside>
  );
}
