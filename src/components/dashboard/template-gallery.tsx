"use client";

import React from "react";
import { Layers, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { STARTER_TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/templates";

const TEMPLATE_GRADIENTS: Record<string, string> = {
  "saas-dashboard": "from-indigo-600 to-indigo-900",
  "analytics-platform": "from-pink-600 to-violet-900",
  "ai-startup": "from-purple-600 to-cyan-900",
  "crm-dashboard": "from-teal-600 to-sky-900",
  "portfolio-website": "from-neutral-700 to-neutral-900",
  "agency-website": "from-orange-600 to-yellow-900",
  "devtools-homepage": "from-emerald-600 to-blue-900",
  "documentation-site": "from-blue-600 to-slate-900",
};

function getGradient(id: string) {
  return TEMPLATE_GRADIENTS[id] ?? "from-brand-600 to-brand-900";
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
    <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-5 shrink-0 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--color-brand-400)]" />
            Start from a Curated Template
          </h3>
          <p className="text-[11px] text-[var(--color-muted-fg)] mt-0.5">
            Select a template to pre-configure layout constraints and style tokens.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSetCategory("all")}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all duration-200 ${
              activeCategory === "all"
                ? "bg-[var(--color-brand-500)] text-white"
                : "bg-[var(--color-surface-950)] border border-[var(--color-border)] text-[var(--color-surface-300)] hover:text-white"
            }`}
          >
            All
          </button>
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSetCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-[var(--color-brand-500)] text-white"
                  : "bg-[var(--color-surface-950)] border border-[var(--color-border)] text-[var(--color-surface-300)] hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Template Cards Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-surface-700">
        {filtered.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          const isLocked = template.tier === "pro" && userPlan === "free";

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
              className={`relative flex-none w-[220px] rounded-[var(--radius-lg)] border overflow-hidden cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "border-[var(--color-brand-500)] ring-1 ring-[var(--color-brand-500)] bg-[var(--color-surface-950)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface-950)]/40 hover:border-[var(--color-surface-650)]"
              }`}
            >
              {/* Thumbnail Gradient */}
              <div
                className={`h-16 bg-gradient-to-br ${getGradient(template.id)} flex items-center justify-center relative p-3 text-center`}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase bg-black/40 px-2 py-0.5 rounded text-white backdrop-blur-[2px]">
                  {template.pageType}
                </span>
                <span
                  className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    template.tier === "pro"
                      ? "bg-amber-500/90 text-black flex items-center gap-0.5"
                      : "bg-emerald-500/90 text-white"
                  }`}
                >
                  {template.tier === "pro" ? (
                    <>
                      <Lock className="w-2 h-2" />
                      PRO
                    </>
                  ) : (
                    "FREE"
                  )}
                </span>
              </div>
              <div className="p-3 flex flex-col gap-1">
                <h4 className="text-xs font-extrabold text-white truncate">{template.title}</h4>
                <p className="text-[10px] text-[var(--color-muted-fg)] line-clamp-2 min-h-[30px] leading-relaxed">
                  {template.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
