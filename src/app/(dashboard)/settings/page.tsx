import type { Metadata } from "next";
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
    <div className="min-h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 sm:py-10 space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#6ee7b7]" />
            Settings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your account, preferences, and integrations.
          </p>
        </div>

        {/* Account info card */}
        <div className="rounded border border-white/10 bg-[#111111] p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-[#6ee7b7] text-[#161616] uppercase shrink-0">
                {user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white text-sm truncate">{user.name ?? "FastApp User"}</div>
                <div className="text-xs text-neutral-400 truncate">{user.email}</div>
              </div>
            </div>
            <div className="self-start sm:self-auto shrink-0 px-2.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] font-bold text-white uppercase tracking-wider">
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
                  className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded border border-white/10 bg-[#111111] hover:bg-[#161616] hover:border-white/20 transition-all group"
                >
                  <div className="w-9 h-9 rounded flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                    <section.icon className="w-4 h-4 text-[#6ee7b7]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-white truncate">{section.title}</div>
                    <div className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{section.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors shrink-0" />
                </a>
              ) : (
                <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded border border-white/5 bg-[#111111] opacity-50 cursor-not-allowed">
                  <div className="w-9 h-9 rounded flex items-center justify-center bg-white/5 border border-white/5 shrink-0">
                    <section.icon className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-white truncate">{section.title}</div>
                    <div className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{section.desc}</div>
                  </div>
                  <span className="shrink-0 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 text-neutral-400 bg-white/5">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
