import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import {
  Settings, User, Bell, Shield, CreditCard, Palette,
  ChevronRight, Globe, Key
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings | FastApp",
  description: "Manage your FastApp account, preferences, and billing.",
};

const settingSections = [
  {
    id: "account",
    icon: User,
    title: "Account",
    desc: "Update your name, email, and profile information.",
    status: "coming-soon",
  },
  {
    id: "billing",
    icon: CreditCard,
    title: "Billing & Plans",
    desc: "Manage your subscription, invoices, and payment methods.",
    href: "/api/billing/portal",
    status: "available",
  },
  {
    id: "api-keys",
    icon: Key,
    title: "API Keys",
    desc: "Manage personal access tokens for programmatic access.",
    status: "coming-soon",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    desc: "Control email and in-app notification preferences.",
    status: "coming-soon",
  },
  {
    id: "appearance",
    icon: Palette,
    title: "Appearance",
    desc: "Customize your dashboard theme and display density.",
    status: "coming-soon",
  },
  {
    id: "security",
    icon: Shield,
    title: "Security",
    desc: "Manage two-factor authentication and active sessions.",
    status: "coming-soon",
  },
  {
    id: "domains",
    icon: Globe,
    title: "Custom Domains",
    desc: "Connect custom domains to your deployed projects.",
    status: "coming-soon",
  },
];

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[var(--color-brand-400)]" />
          Settings
        </h1>
        <p className="text-sm text-[var(--color-muted-fg)] mt-1">
          Manage your account, preferences, and integrations.
        </p>
      </div>

      {/* Account info card */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-900)] p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white"
            style={{ background: "linear-gradient(135deg, oklch(0.60 0.27 270), oklch(0.53 0.28 310))" }}>
            {user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <div className="font-bold text-white">{user.name ?? "FastApp User"}</div>
            <div className="text-sm text-[var(--color-muted-fg)]">{user.email}</div>
          </div>
          <div className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider"
            style={{ color: "oklch(0.79 0.16 270)", borderColor: "oklch(0.60 0.27 270 / 0.35)", background: "oklch(0.60 0.27 270 / 0.10)" }}>
            Free Plan
          </div>
        </div>
      </div>

      {/* Settings sections */}
      <div className="space-y-2">
        {settingSections.map((section) => (
          <div key={section.id}>
            {section.href ? (
              <a
                href={section.href}
                className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-900)] hover:bg-[var(--color-surface-800)] hover:border-[var(--color-brand-700)] transition-all group"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "oklch(0.60 0.27 270 / 0.12)", border: "1px solid oklch(0.60 0.27 270 / 0.25)" }}>
                  <section.icon className="w-4.5 h-4.5 text-[var(--color-brand-400)]" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-white">{section.title}</div>
                  <div className="text-xs text-[var(--color-muted-fg)] mt-0.5">{section.desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--color-surface-500)] group-hover:text-white transition-colors" />
              </a>
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-900)] opacity-60 cursor-not-allowed">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "oklch(0.60 0.27 270 / 0.08)", border: "1px solid oklch(0.60 0.27 270 / 0.15)" }}>
                  <section.icon className="w-4.5 h-4.5 text-[var(--color-surface-400)]" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-white">{section.title}</div>
                  <div className="text-xs text-[var(--color-muted-fg)] mt-0.5">{section.desc}</div>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                  style={{ color: "oklch(0.65 0.18 75)", borderColor: "oklch(0.65 0.18 75 / 0.30)", background: "oklch(0.65 0.18 75 / 0.08)" }}>
                  Coming Soon
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
