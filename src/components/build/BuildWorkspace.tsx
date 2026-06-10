"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Sparkles, Loader2, ArrowRight, LayoutDashboard,
  Globe, Briefcase, Users, BarChart3, Shield,
  BookOpen, Cpu, Zap, Clock, ExternalLink,
  ChevronRight, X, CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PreviewPanel } from "@/components/preview";
import { useGenerationStream } from "@/components/dashboard/hooks/use-generation-stream";
import { useProjects } from "@/components/dashboard/hooks/use-projects";
import { useUsage } from "@/components/dashboard/hooks/use-usage";
import { cn } from "@/lib/utils";

/* ─── Quick Start Chips ───────────────────────────────────────────────────── */

const QUICK_CHIPS = [
  { label: "SaaS Dashboard",       icon: LayoutDashboard, prompt: "Generate a modern SaaS dashboard page with metrics, charts, and a clean sidebar navigation" },
  { label: "Startup Landing",      icon: Sparkles,        prompt: "Generate a stunning AI startup landing page with a hero section, features bento grid, and pricing" },
  { label: "Portfolio",            icon: Briefcase,       prompt: "Generate a minimalist developer portfolio page with project showcase, skills, and contact form" },
  { label: "CRM Platform",         icon: Users,           prompt: "Generate a CRM platform dashboard page with client list, activity feed, and deal pipeline" },
  { label: "Analytics Platform",   icon: BarChart3,       prompt: "Generate an analytics page with charts, metrics cards, tables, and filtering" },
  { label: "AI Product",           icon: Cpu,             prompt: "Generate an AI product landing page with feature highlights, demo section, and pricing" },
  { label: "Documentation Page",   icon: BookOpen,        prompt: "Generate a documentation page with sidebar navigation, search, and code examples" },
  { label: "Cybersecurity",        icon: Shield,          prompt: "Generate a cybersecurity page dashboard with threat detection, logs, and security scores" },
];

const TEMPLATES = [
  { id: "saas-dashboard",   label: "SaaS Dashboard",      icon: LayoutDashboard, desc: "Metrics, charts, and sidebar" },
  { id: "saas-landing",     label: "AI Startup Landing",  icon: Sparkles,        desc: "Landing with bento grid" },
  { id: "portfolio-page",   label: "Portfolio Page",      icon: Briefcase,       desc: "Showcase and contact" },
  { id: "pricing-page",     label: "Pricing Page",        icon: BarChart3,       desc: "Tiers and FAQ" },
  { id: "login-page",       label: "Login Page",          icon: Shield,          desc: "Secure login form" },
];

export function BuildWorkspace() {
  const [prompt, setPrompt] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();

  const { usageStats, loadUsage } = useUsage();
  const { projects, loadProjects } = useProjects();

  // Pre-fill from template gallery
  useEffect(() => {
    const templatePrompt = searchParams.get("prompt");
    if (templatePrompt) {
      setPrompt(decodeURIComponent(templatePrompt));
      textareaRef.current?.focus();
    }
  }, [searchParams]);

  const {
    isGenerating,
    generationState,
    generationMessage,
    activeHtml,
    activePlan,
    generationError,
    generate,
    setActiveHtml,
    setGenerationState,
    setGenerationError,
  } = useGenerationStream({
    onComplete: (projectId) => {
      setSelectedProjectId(projectId);
      setIsPreviewMode(true);
    },
    onError: (msg) => console.error("Generation error:", msg),
    onLoadProjects: loadProjects,
    onLoadUsage: loadUsage,
  });

  useEffect(() => {
    loadProjects();
    loadUsage();
  }, [loadProjects, loadUsage]);

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 220)}px`;
    }
  }, [prompt]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    setIsPreviewMode(false);
    setSelectedProjectId(null);
    await generate(prompt, undefined, undefined);
    setPrompt("");
  };

  const handleChip = (chipPrompt: string) => {
    setPrompt(chipPrompt);
    textareaRef.current?.focus();
  };

  const handleSelectProject = (id: string, html?: string | null) => {
    setSelectedProjectId(id);
    if (html) setActiveHtml(html);
    setGenerationError(null);
    setGenerationState("idle");
    setIsPreviewMode(true);
  };

  const closePreview = () => {
    setIsPreviewMode(false);
    setSelectedProjectId(null);
    setActiveHtml(null);
    setGenerationError(null);
    setGenerationState("idle");
  };

  const recentProjects = projects.slice(0, 6);

  // ── Preview Mode ────────────────────────────────────────────────────────────
  if (isPreviewMode || isGenerating || generationState !== "idle") {
    return (
      <div className="h-full flex flex-col">
        {/* Preview topbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-black/40 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={closePreview}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Back to Generate
            </button>
            <span className="w-px h-4 bg-white/10" />
            {isGenerating ? (
              <span className="flex items-center gap-1.5 text-xs text-[#6ee7b7]">
                <Loader2 className="w-3 h-3 animate-spin" />
                {generationMessage || "Generating…"}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <CheckCircle className="w-3.5 h-3.5" />
                Generation complete
              </span>
            )}
          </div>
          <button
            onClick={closePreview}
            className="h-7 px-3 rounded-md text-xs font-medium border border-white/10 text-white hover:bg-white/5 transition-colors"
          >
            New Page
          </button>
        </div>

        {/* Full preview */}
        <div className="flex-1 min-h-0">
          <PreviewPanel
            projectId={selectedProjectId}
            generatedHtml={activeHtml}
            plan={activePlan}
            isLoading={isGenerating}
            error={generationError}
            onRefresh={loadProjects}
            generationState={generationState}
            generationMessage={generationMessage}
          />
        </div>
      </div>
    );
  }

  // ── Build Home ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-white/10 bg-white/[0.03] text-[10px] font-medium text-[#6ee7b7] mb-6">
            <Zap className="w-3 h-3" />
            AI Pipeline: Planner → Generator → Validator → Preview
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.15] mb-4">
            What page would you like to generate today?
          </h1>
          <p className="text-sm md:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Describe the page you want to generate and FastApp will plan, generate, validate, and preview it.
          </p>
        </div>

        {/* ── Prompt Box ───────────────────────────────────────────────────── */}
        <form onSubmit={handleGenerate} className="mb-6">
          <div className={cn(
            "relative rounded-xl border bg-[#111111] transition-all duration-200",
            "border-white/10 focus-within:border-[#6ee7b7]/50 focus-within:shadow-[0_0_0_1px_rgba(110,231,183,0.15)]"
          )}>
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              id="build-prompt"
              rows={3}
              className="w-full bg-transparent px-5 pt-4 pb-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none resize-none leading-relaxed"
              placeholder='e.g. "Generate a modern SaaS landing page with hero, features bento grid, and pricing..."'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleGenerate(e as any);
                }
              }}
            />

            {/* Bottom toolbar */}
            <div className="flex items-center justify-end px-3 pb-3 pt-1 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-600 hidden sm:block">⌘↵ to generate</span>
                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className="group flex items-center gap-2 h-8 px-4 rounded-lg bg-[#6ee7b7] text-[#161616] text-xs font-semibold hover:bg-[#52dca6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5" /> Generate <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* ── Quick Start Chips ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-14 justify-center">
          {QUICK_CHIPS.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.label}
                onClick={() => handleChip(chip.prompt)}
                disabled={isGenerating}
                className="flex items-center gap-1.5 h-7 px-3 rounded-full border border-white/10 bg-white/[0.03] text-[11px] text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all disabled:opacity-40"
              >
                <Icon className="w-3 h-3" />
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* ── Recent Projects ───────────────────────────────────────────────── */}
        {recentProjects.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Recent Projects</h2>
              <Link
                href="/projects"
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleSelectProject(project.id)}
                  className="group text-left rounded-lg border border-white/10 bg-[#111111] p-4 hover:border-white/20 hover:bg-[#161616] transition-all"
                >
                  {/* Mini preview thumbnail */}
                  <div className="w-full h-24 rounded-md bg-[#1a1a1a] border border-white/5 mb-3 overflow-hidden flex items-center justify-center">
                    {project.generatedHtml ? (
                      <iframe
                        srcDoc={project.generatedHtml}
                        className="w-[800px] h-[600px] pointer-events-none origin-top-left scale-[0.16] -translate-x-[344px] -translate-y-[258px]"
                        title={project.name}
                      />
                    ) : (
                      <Globe className="w-6 h-6 text-neutral-600" />
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-[#6ee7b7] transition-colors">
                        {project.name}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 font-medium">
                      Live
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Template Gallery ──────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Start from a Template</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => handleChip(`Generate a ${tmpl.label.toLowerCase()} — ${tmpl.desc}`)}
                  disabled={isGenerating}
                  className="group text-left rounded-lg border border-white/10 bg-[#111111] p-4 hover:border-[#6ee7b7]/30 hover:bg-[#161616] transition-all"
                >
                  <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:border-[#6ee7b7]/30 transition-colors">
                    <Icon className="w-4 h-4 text-[#6ee7b7]" />
                  </div>
                  <p className="text-xs font-semibold text-white mb-0.5">{tmpl.label}</p>
                  <p className="text-[10px] text-neutral-500">{tmpl.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
