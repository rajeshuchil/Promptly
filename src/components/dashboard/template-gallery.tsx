"use client";

import React from "react";
import {
  Layers, Lock, Monitor, LayoutDashboard, CreditCard, Key,
  Receipt, BarChart3, FolderGit, BookOpen, Settings2, Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { STARTER_TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/templates";
import { motion } from "framer-motion";

const TEMPLATE_GRADIENTS: Record<string, string> = {
  "saas-landing": "from-indigo-500 via-indigo-600 to-indigo-900",
  "saas-dashboard": "from-violet-500 via-violet-600 to-violet-900",
  "pricing-page": "from-emerald-500 via-emerald-600 to-emerald-900",
  "login-page": "from-blue-500 via-blue-600 to-blue-900",
  "billing-dashboard": "from-sky-500 via-sky-600 to-sky-900",
  "analytics-dashboard": "from-pink-500 via-pink-600 to-pink-900",
  "portfolio-page": "from-neutral-500 via-neutral-600 to-neutral-900",
  "documentation-page": "from-teal-500 via-teal-600 to-teal-900",
  "settings-page": "from-purple-500 via-purple-600 to-purple-900",
};

const TEMPLATE_ICONS: Record<string, React.ComponentType<any>> = {
  "saas-landing": Monitor,
  "saas-dashboard": LayoutDashboard,
  "pricing-page": CreditCard,
  "login-page": Key,
  "billing-dashboard": Receipt,
  "analytics-dashboard": BarChart3,
  "portfolio-page": FolderGit,
  "documentation-page": BookOpen,
  "settings-page": Settings2,
};

function getGradient(id: string) {
  return TEMPLATE_GRADIENTS[id] ?? "from-brand-600 to-brand-900";
}

function getTemplateIcon(id: string) {
  return TEMPLATE_ICONS[id] ?? Sparkles;
}

function formatCategory(category: string) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface TemplateGalleryProps {
  selectedTemplateId: string | null;
  activeCategory: string;
  userPlan: string;
  onSelectTemplate: (id: string, promptHint: string) => void;
  onClearTemplate: () => void;
  onSetCategory: (id: string) => void;
  onUpgrade: () => void;
}

export function TemplateGallery({
  selectedTemplateId,
  activeCategory,
  userPlan,
  onSelectTemplate,
  onClearTemplate,
  onSetCategory,
  onUpgrade,
}: TemplateGalleryProps) {
  const filtered = STARTER_TEMPLATES.filter(
    (t) => activeCategory === "all" || t.category === activeCategory
  );

  return (
    <Card className="border-white/5 bg-surface-900/40 backdrop-blur-md p-6 shrink-0 flex flex-col gap-5 rounded-2xl shadow-lg shadow-black/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-400" />
            Start from a Curated Template
          </h3>
          <p className="text-xs text-neutral-400 mt-1 leading-normal">
            Select a template to pre-configure layout constraints and style tokens.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSetCategory("all")}
            className={`relative px-3.5 py-1 rounded-full text-[10px] font-bold transition-all duration-200 cursor-pointer ${
              activeCategory === "all"
                ? "text-white bg-violet-600/90 border border-violet-500/20"
                : "bg-[#151515] border border-white/5 text-neutral-400 hover:text-white"
            }`}
          >
            All
          </button>
          {TEMPLATE_CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSetCategory(cat.id)}
                className={`relative px-3.5 py-1 rounded-full text-[10px] font-bold transition-all duration-200 cursor-pointer ${
                  active
                    ? "text-white bg-violet-600/90 border border-violet-500/20"
                    : "bg-[#151515] border border-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Template Cards Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-surface-700">
        {filtered.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          const isLocked = template.tier === "pro" && userPlan === "free";
          const TemplateIcon = getTemplateIcon(template.id);
          
          // Generate deterministic numbers for metadata
          const componentsCount = (template.sections?.length || 4) * 2 + 4;
          const estTime = `${(template.sections?.length || 4) * 2}s`;
          const difficulty = template.sections?.length && template.sections.length >= 6 ? "Advanced" : "Standard";
          const isPopular = template.id === "saas-landing" || template.id === "saas-dashboard" || template.id === "analytics-dashboard";

          return (
            <div
              key={template.id}
              onClick={() => {
                if (isLocked) {
                  onUpgrade();
                  return;
                }
                if (isSelected) {
                  onClearTemplate();
                } else {
                  onSelectTemplate(
                    template.id,
                    `Create a ${template.title} with a ${template.theme} theme: ${template.description}`
                  );
                }
              }}
              className={`group relative flex-none w-[280px] rounded-2xl border transition-all duration-300 select-none overflow-hidden cursor-pointer ${
                isSelected
                  ? "border-violet-500 bg-surface-800/80 shadow-lg shadow-black/50"
                  : "border-white/5 bg-surface-900/40 backdrop-blur-md hover:border-white/15 hover:bg-surface-800/50 hover:shadow-xl hover:shadow-black/60 hover:-translate-y-0.5"
              }`}
            >
              {/* Thumbnail Area with abstract preview and large icon */}
              <div className="h-28 bg-[#09090b] flex items-center justify-center relative border-b border-white/5 overflow-hidden">
                {/* Background miniature pattern/mesh */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:10px_10px]" />
                <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(template.id)} opacity-[0.06] group-hover:opacity-[0.10] transition-opacity`} />
                
                {/* Large Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:border-white/20 transition-all duration-300 z-10">
                  <TemplateIcon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                </div>

                {/* Badges on Top */}
                <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full text-neutral-300 backdrop-blur-sm">
                    {template.pageType.replace("-", " ")}
                  </span>
                  {isPopular && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full text-violet-300 backdrop-blur-sm">
                      Popular
                    </span>
                  )}
                </div>

                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider z-10 ${
                    template.tier === "pro"
                      ? "bg-amber-500/10 border border-amber-500/20 text-amber-300"
                      : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {template.tier === "pro" ? "PRO" : "FREE"}
                </span>
              </div>

              {/* Text content area */}
              <div className="p-4.5 flex flex-col gap-2">
                <h4 className="text-xs font-bold text-white tracking-tight">{template.title}</h4>
                <p className="text-[10px] text-neutral-450 line-clamp-2 min-h-[30px] leading-relaxed">
                  {template.description}
                </p>

                {/* Metadata Row */}
                <div className="flex items-center gap-1.5 text-[9px] text-neutral-500 mt-1 border-t border-white/5 pt-2">
                  <span className="truncate max-w-[80px]">{formatCategory(template.category)}</span>
                  <span className="text-neutral-700">•</span>
                  <span>{componentsCount} Comp</span>
                  <span className="text-neutral-700">•</span>
                  <span>{difficulty}</span>
                  <span className="text-neutral-700">•</span>
                  <span>{estTime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
