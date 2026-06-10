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
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";

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

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

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

  return (
    <div className="min-h-full overflow-y-auto bg-[#030303]">
      {/* ── Spotlight Prompt Area ────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden border-b border-white/5 bg-[#070709] py-16 md:py-24">
        {/* Subtle grid pattern background */}
        <div
          className="pointer-events-none absolute inset-0 select-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(var(--color-surface-600) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />
        {/* Soft emerald spotlight effect centered behind the prompt */}
        <Spotlight
          className="-top-40 left-1/2 -translate-x-1/2 w-[140%] h-[150%] md:-top-80 md:w-[100%] opacity-40"
          fill="rgba(110, 231, 183, 0.12)"
        />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-white/10 bg-white/[0.03] text-[10px] font-medium text-[#6ee7b7] mb-6">
              <Zap className="w-3 h-3 animate-bounce-subtle" />
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
            <div 
              onMouseMove={handleMouseMove}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={cn(
                "relative rounded-2xl border transition-all duration-300 shadow-elevation-2 bg-[#0c0c0e]/90 backdrop-blur-md overflow-hidden",
                isGenerating
                  ? "border-[#6ee7b7]/60 shadow-[0_0_30px_rgba(110,231,183,0.25)] animate-pulse"
                  : isFocused
                    ? "border-[#6ee7b7] shadow-[0_0_25px_rgba(110,231,183,0.2)]"
                    : "border-white/10 hover:border-white/20 hover:shadow-elevation-3"
              )}
              style={{
                background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(110,231,183,0.04), transparent 80%), rgba(12, 12, 14, 0.9)`
              }}
            >
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                id="build-prompt"
                rows={3}
                className="w-full bg-transparent px-6 pt-5 pb-4 text-base text-white placeholder:text-neutral-500 focus:outline-none resize-none leading-relaxed font-sans"
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
              <div className="flex items-center justify-between px-6 pb-4 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Planner v2 Active</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-neutral-600 hidden sm:block font-mono">⌘↵ to generate</span>
                  <motion.button
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center gap-2 h-9 px-5 rounded-full bg-[#6ee7b7] text-[#161616] text-xs font-bold hover:bg-[#52dca6] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(110,231,183,0.25)] hover:shadow-[0_0_20px_rgba(110,231,183,0.4)]"
                  >
                    {isGenerating ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating Website…</>
                    ) : (
                      <><Sparkles className="w-3.5 h-3.5" /> Generate App <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" /></>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>

          {/* ── Quick Start Chips ─────────────────────────────────────────────── */}
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.04 }
              }
            }}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-2 justify-center"
          >
            {QUICK_CHIPS.map((chip) => {
              const Icon = chip.icon;
              return (
                <motion.button
                  key={chip.label}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 450, damping: 26 }}
                  onClick={() => handleChip(chip.prompt)}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 h-7.5 px-3.5 rounded-full border border-white/5 bg-[#141416]/60 text-[11px] text-neutral-400 hover:text-white hover:border-[#6ee7b7]/30 hover:bg-[#18181b] backdrop-blur-sm transition-all duration-150 disabled:opacity-40 cursor-pointer"
                >
                  <Icon className="w-3 h-3 text-[#6ee7b7]" />
                  {chip.label}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── Lower Gallery and Projects Area ──────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* ── Template Gallery (SECONDARY HIERARCHY) ───────────────────────── */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">Start from a Template</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon;
              return (
                <motion.button
                  key={tmpl.id}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  onClick={() => handleChip(`Generate a ${tmpl.label.toLowerCase()} — ${tmpl.desc}`)}
                  disabled={isGenerating}
                  className="group text-left rounded-xl border border-white/10 bg-[#111111] p-5 shadow-elevation-1 hover:border-[#6ee7b7]/30 hover:bg-[#161616] hover:shadow-elevation-2 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-3.5 group-hover:border-[#6ee7b7]/30 transition-colors">
                    <Icon className="w-4 h-4 text-[#6ee7b7]" />
                  </div>
                  <p className="text-xs font-semibold text-white mb-1">{tmpl.label}</p>
                  <p className="text-[10px] text-neutral-400 leading-normal">{tmpl.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Recent Projects (TERTIARY HIERARCHY) ─────────────────────────── */}
        {recentProjects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-white">Recent Projects</h2>
              <Link
                href="/projects"
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProjects.map((project) => (
                <motion.button
                  key={project.id}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  onClick={() => handleSelectProject(project.id)}
                  className="group text-left rounded-xl border border-white/10 bg-[#111111] p-4 shadow-elevation-1 hover:border-white/20 hover:bg-[#161616] hover:shadow-elevation-2 transition-all duration-200 cursor-pointer"
                >
                  {/* Mini preview thumbnail */}
                  <div className="w-full h-24 rounded-lg bg-[#161618] border border-white/5 mb-3.5 overflow-hidden flex items-center justify-center relative">
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
                      <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="shrink-0 text-[9px] px-2 py-0.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 font-medium">
                      Live
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
