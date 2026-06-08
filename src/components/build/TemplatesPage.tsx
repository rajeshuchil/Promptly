"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard, Sparkles, Briefcase, Users,
  BarChart3, Shield, BookOpen, Cpu, ArrowRight
} from "lucide-react";

const TEMPLATES = [
  {
    id: "saas-dashboard",
    label: "SaaS Dashboard",
    icon: LayoutDashboard,
    category: "Analytics",
    desc: "Comprehensive operations console with metrics grids, sidebar navigation, usage graphs, and dark mode.",
    features: ["Metrics Grid", "SSE Feed", "Activity Graph"],
    prompt: "Build a modern SaaS dashboard with metrics, charts, sidebar navigation, and a dark theme",
  },
  {
    id: "startup",
    label: "AI Startup",
    icon: Sparkles,
    category: "Landing Page",
    desc: "Stunning product showcase with hero section, bento feature grid, and CTA pipeline.",
    features: ["Bento Grid", "Pricing Table", "Workflow Cards"],
    prompt: "Create a stunning AI startup landing page with hero, bento feature grid, and pricing",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: Briefcase,
    category: "Personal",
    desc: "Clean minimalist space for displaying works, skills, and contact information.",
    features: ["Project Showcase", "Skills", "Contact Form"],
    prompt: "Build a minimalist developer portfolio with project showcase, skills, and contact form",
  },
  {
    id: "crm",
    label: "CRM Platform",
    icon: Users,
    category: "Management",
    desc: "Workspace for managing client relationships, activities, and deal pipelines.",
    features: ["Client List", "Deal Pipeline", "Activity Feed"],
    prompt: "Create a CRM platform with client management, deal pipeline, and activity feed",
  },
  {
    id: "analytics",
    label: "Analytics Platform",
    icon: BarChart3,
    category: "SaaS",
    desc: "Engineering console for metrics, billing records, and response charts.",
    features: ["Charts", "Billing", "Live Tables"],
    prompt: "Build an analytics platform with charts, metrics cards, and data tables",
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    icon: Shield,
    category: "Enterprise",
    desc: "Security dashboard with incident telemetry, network scans, and threat scoring.",
    features: ["Threat Feed", "Log Streams", "Security Score"],
    prompt: "Create a cybersecurity dashboard with threat detection, log streams, and security scores",
  },
  {
    id: "docs",
    label: "Documentation Site",
    icon: BookOpen,
    category: "Content",
    desc: "Documentation website with sidebar navigation, search, and code examples.",
    features: ["Sidebar Nav", "Search", "Code Blocks"],
    prompt: "Build a documentation website with sidebar navigation, search, and code examples",
  },
  {
    id: "ai-product",
    label: "AI Product",
    icon: Cpu,
    category: "Landing Page",
    desc: "AI product landing page with feature highlights and demo section.",
    features: ["Feature Grid", "Demo Section", "Pricing"],
    prompt: "Create an AI product landing page with feature highlights, demo, and pricing",
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
            Start from a pre-configured layout. Click a template to open it in the Build workspace.
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
