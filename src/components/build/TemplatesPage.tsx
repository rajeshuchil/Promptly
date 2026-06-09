"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard, Sparkles, Briefcase, Users,
  BarChart3, Shield, BookOpen, Cpu, ArrowRight, Settings, CreditCard
} from "lucide-react";

const TEMPLATES = [
  {
    id: "saas-landing",
    label: "SaaS Landing Page",
    icon: Sparkles,
    category: "Landing Pages",
    desc: "Modern landing page template with hero section, navbar, features grid, pricing tier cards, FAQ, and footer.",
    features: ["Hero Section", "Feature Grid", "Pricing Tiers"],
    prompt: "Generate a modern SaaS landing page with hero, features bento grid, and pricing",
  },
  {
    id: "saas-dashboard",
    label: "SaaS Dashboard Page",
    icon: LayoutDashboard,
    category: "Dashboards",
    desc: "A comprehensive control center template with sidebar layout, stats widgets, list panels, and action headers.",
    features: ["Sidebar Nav", "Metrics Grid", "Activity Logs"],
    prompt: "Generate a modern SaaS dashboard page with metrics, charts, and a clean sidebar navigation",
  },
  {
    id: "pricing-page",
    label: "SaaS Pricing Page",
    icon: BarChart3,
    category: "Pricing Pages",
    desc: "Sleek SaaS product pricing tier cards, detailed feature comparisons, accordion FAQ section, and upgrade CTA.",
    features: ["Pricing Tiers", "Feature Matrix", "FAQ Accordion"],
    prompt: "Generate a conversion-focused SaaS pricing page with tier cards, feature comparison, and FAQ",
  },
  {
    id: "login-page",
    label: "Secure Login Page",
    icon: Shield,
    category: "Authentication Pages",
    desc: "Auth page featuring a clean input card, OAuth credentials buttons, validations, and custom branding header.",
    features: ["Auth Card", "Social Logins", "Form Validation"],
    prompt: "Generate a modern secure login page with OAuth buttons, card form, and custom branding",
  },
  {
    id: "billing-dashboard",
    label: "Billing & Subscriptions Page",
    icon: CreditCard,
    category: "Billing Pages",
    desc: "Plan overview dashboard containing resource meters, stripe checkout triggers, invoice history table, and limit cards.",
    features: ["Resource Meters", "Upgrade CTA", "Invoice Table"],
    prompt: "Generate a billing settings page with subscription plan details, usage meters, and invoice history",
  },
  {
    id: "analytics-dashboard",
    label: "Analytics Dashboard Page",
    icon: BarChart3,
    category: "Analytics Pages",
    desc: "Data-rich stats dashboard containing time-series chart blocks, grid reports, and filtering panels.",
    features: ["Time-Series Chart", "Data Grids", "Filters Panel"],
    prompt: "Generate an analytics page displaying metrics charts, statistics grids, and interactive data filters",
  },
  {
    id: "portfolio-page",
    label: "Creator Portfolio Page",
    icon: Briefcase,
    category: "Portfolio Pages",
    desc: "Creative developer or agency showcase containing project grids, bio cards, work logs, and contact section.",
    features: ["Project Showcase", "Bio Card", "Contact Form"],
    prompt: "Generate a minimalist portfolio page for a designer/developer with project showcase and bio",
  },
  {
    id: "documentation-page",
    label: "Documentation Page",
    icon: BookOpen,
    category: "Documentation Pages",
    desc: "Content reading layout featuring side navigation panel, article body, search input, and next-prev pagination anchors.",
    features: ["Sidebar Navigation", "Code Blocks", "Search Input"],
    prompt: "Generate a documentation page layout with side navigation, article body, search input, and next-prev buttons",
  },
  {
    id: "settings-page",
    label: "Account Settings Page",
    icon: Settings,
    category: "Settings Pages",
    desc: "Clean configuration page layout containing input fields, toggle buttons, avatar selections, and reset anchors.",
    features: ["Profile Inputs", "Security Toggles", "Avatar Choice"],
    prompt: "Generate a profile settings page with tabbed controls, preferences toggles, and security inputs",
  },
];

export function TemplatesPage() {
  return (
    <div className="min-h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white mb-2">Template Gallery</h1>
          <p className="text-sm text-neutral-400">
            Start from a pre-configured layout. Click a template to open it in the Generate workspace.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <Link
                key={tmpl.id}
                href={`/build?prompt=${encodeURIComponent(tmpl.prompt)}`}
                className="group rounded-lg border border-white/10 bg-[#111111] p-5 hover:border-[#6ee7b7]/30 hover:bg-[#141414] transition-all"
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#6ee7b7]/30 transition-colors">
                    <Icon className="w-4.5 h-4.5 text-[#6ee7b7]" />
                  </div>
                  <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wider">
                    {tmpl.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5 group-hover:text-[#6ee7b7] transition-colors">
                  {tmpl.label}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 transition-transform" />
                </h3>

                {/* Description */}
                <p className="text-[11px] text-neutral-500 leading-relaxed mb-4">
                  {tmpl.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                  {tmpl.features.map((f) => (
                    <span
                      key={f}
                      className="text-[9px] font-mono text-neutral-600 bg-white/[0.03] px-2 py-0.5 rounded border border-white/5"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
