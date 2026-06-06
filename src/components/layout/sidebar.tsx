"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Sparkles,
  FolderOpen,
  Settings,
  Zap,
  HelpCircle,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Nav items ──────────────────────────────────────────────────────────── */

const mainNavItems = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard"  },
  { href: "/generate",   icon: Sparkles,        label: "Generate"   },
  { href: "/projects",   icon: FolderOpen,      label: "Projects"   },
] as const;

const secondaryNavItems = [
  { href: "/settings",   icon: Settings,        label: "Settings"   },
  { href: "/help",       icon: HelpCircle,      label: "Help & Docs"},
] as const;

/* ─── Sidebar Logo ───────────────────────────────────────────────────────── */

function SidebarLogo() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-5">
      {/* Icon mark */}
      <div
        className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] animate-pulse-glow"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.60 0.27 270), oklch(0.53 0.28 310))",
        }}
      >
        <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>

      {/* Wordmark */}
      <span
        className="text-lg font-bold tracking-tight"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.88 0.003 270), oklch(0.79 0.16 270))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
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
      className={cn("sidebar-link", isActive && "active")}
    >
      <Icon
        className={cn(
          "w-4 h-4 flex-shrink-0 transition-colors duration-[var(--duration-fast)]",
          isActive
            ? "text-[var(--color-brand-400)]"
            : "text-[var(--color-surface-400)]",
        )}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span>{label}</span>
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
      className="sidebar animate-slide-in-left"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <SidebarLogo />

      {/* Divider */}
      <div className="mx-3 h-px bg-[var(--color-border)]" />

      {/* Primary nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5" aria-label="Primary">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-surface-400)]">
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
      <div className="px-2 pb-4 space-y-0.5 border-t border-[var(--color-border)] pt-4">
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
        <div className="mx-3 mb-2 p-3 rounded-[var(--radius-lg)] border border-[oklch(0.20_0.02_270)] bg-[oklch(0.12_0.02_270/0.4)] backdrop-blur-sm flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar badge */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[oklch(0.60_0.27_270)] to-[oklch(0.53_0.28_310)] flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
              {user.name ? user.name[0] : (user.email ? user.email[0] : "?")}
            </div>
            
            {/* Details */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">
                {user.name || "Developer"}
              </span>
              <span className="text-[10px] text-[oklch(0.60_0.02_270)] truncate">
                {user.email}
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign Out"
            className="p-1.5 rounded-lg text-[oklch(0.60_0.02_270)] hover:text-white hover:bg-[oklch(0.18_0.02_270)] transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Version badge */}
      <div className="mx-3 mb-4 px-3 py-2 rounded-[var(--radius-md)] glass-light text-xs text-[var(--color-surface-400)] flex items-center gap-1.5">
        <ExternalLink className="w-3 h-3" />
        FastApp&nbsp;
        <span className="text-[var(--color-brand-400)] font-semibold">v0.1.0</span>
        &nbsp;· alpha
      </div>
    </aside>
  );
}
