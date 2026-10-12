"use client";

import React from "react";
import { ArrowUpRight, Shield, BarChart3, Users, Briefcase, Sparkles, LayoutDashboard } from "lucide-react";

export function TemplateSection() {
  const templates = [
    {
      title: "SaaS Dashboard",
      category: "Analytics",
      icon: LayoutDashboard,
      desc: "Comprehensive operations console with interactive grids, sidebar, usage graphs, and dark mode configuration.",
      features: ["Metrics Grid", "Server-Sent Feed", "Activity Graph"]
    },
    {
      title: "AI Startup",
      category: "Landing Page",
      icon: Sparkles,
      desc: "Stunning product introduction showcase with glowing buttons, typing simulations, bento elements, and CTA pipelines.",
      features: ["Bento Feature Grid", "Pricing Table", "Workflow Cards"]
    },
    {
      title: "Portfolio",
      category: "Personal",
      icon: Briefcase,
      desc: "Clean, minimalist space displaying works, developer skills, timeline history, and custom contact configurations.",
      features: ["Project Showcase", "Interactive CV", "Feedback Forms"]
    },
    {
      title: "CRM Platform",
      category: "Management",
      icon: Users,
      desc: "Clean workspace structure to manage relationships, activities list, filters, and client history events.",
      features: ["Search filters", "Client detail views", "Interactive charts"]
    },
    {
      title: "Analytics Product",
      category: "SaaS Application",
      icon: BarChart3,
      desc: "Engineering console for displaying performance metrics, billing records, database queries, and response charts.",
      features: ["tRPC-style layout", "Stripe billing integrations", "Live tables"]
    },
    {
      title: "Cybersecurity Platform",
      category: "Enterprise",
      icon: Shield,
      desc: "High-security themed dashboard displaying incident telemetry, network scans, server status, and security score.",
      features: ["Vulnerability scans", "Status signals", "Log streams"]
    }
  ];

  return (
    <section id="templates" className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 max-w-7xl mx-auto border-t border-white/5 bg-[#161616]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
        <div>
          <span className="text-xs font-semibold tracking-wider text-[#6ee7b7] uppercase">Templates</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 mb-4 text-white">
            Pre-configured layouts, ready to stream
          </h2>
          <p className="text-sm md:text-base text-neutral-400 max-w-xl">
            Choose a starting blueprint or start from scratch. FastApp shapes clean modular React markup tailored to your target industry.
          </p>
        </div>
      </div>

      {/* Grid structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <div
              key={template.title}
              className="bg-[#1B1B1B] border border-white/10 rounded p-6 flex flex-col justify-between relative overflow-hidden group hover:border-white/20"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="w-10 h-10 rounded flex items-center justify-center bg-white/5 border border-white/10 transition-transform duration-300 group-hover:scale-105"
                  >
                    <Icon className="w-5 h-5 text-[#6ee7b7]" />
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    {template.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                  {template.title}
                  <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>

                {/* Description */}
                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  {template.desc}
                </p>
              </div>

              {/* Tag features */}
              <div className="border-t border-white/5 pt-4">
                <div className="flex flex-wrap gap-1.5">
                  {template.features.map((feature) => (
                    <span 
                      key={feature} 
                      className="text-[9px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
