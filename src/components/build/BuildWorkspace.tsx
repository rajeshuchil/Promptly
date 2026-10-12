"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Sparkles, Loader2, ArrowRight, LayoutDashboard,
  Globe, Briefcase, Users, BarChart3, Shield,
  BookOpen, Cpu, Zap, Clock, ExternalLink,
  ChevronRight, X, CheckCircle, Star, Trash2
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
  {
    id: "saas-dashboard",
    label: "SaaS Dashboard",
    icon: LayoutDashboard,
    desc: "Metrics, charts, and sidebar",
    category: "Dashboard",
    componentsCount: 18,
    difficulty: "Advanced",
    estTime: "12s",
    popular: true,
  },
  {
    id: "saas-landing",
    label: "AI Startup Landing",
    icon: Sparkles,
    desc: "Landing with bento grid",
    category: "Landing Page",
    componentsCount: 14,
    difficulty: "Standard",
    estTime: "10s",
    popular: true,
  },
  {
    id: "portfolio-page",
    label: "Portfolio Page",
    icon: Briefcase,
    desc: "Showcase and contact",
    category: "Portfolio",
    componentsCount: 10,
    difficulty: "Simple",
    estTime: "8s",
    popular: false,
  },
  {
    id: "pricing-page",
    label: "Pricing Page",
    icon: BarChart3,
    desc: "Tiers and FAQ",
    category: "Pricing",
    componentsCount: 12,
    difficulty: "Standard",
    estTime: "9s",
    popular: false,
  },
  {
    id: "login-page",
    label: "Login Page",
    icon: Shield,
    desc: "Secure login form",
    category: "Authentication",
    componentsCount: 8,
    difficulty: "Simple",
    estTime: "7s",
    popular: false,
  },
];

const TEMPLATE_GRADIENTS: Record<string, string> = {
  "saas-landing": "from-indigo-500 via-indigo-600 to-indigo-900",
  "saas-dashboard": "from-violet-500 via-violet-600 to-violet-900",
  "pricing-page": "from-emerald-500 via-emerald-600 to-emerald-900",
  "login-page": "from-blue-500 via-blue-600 to-blue-900",
  "portfolio-page": "from-neutral-500 via-neutral-600 to-neutral-900",
};

function getTemplateGradient(id: string) {
  return TEMPLATE_GRADIENTS[id] ?? "from-brand-600 to-brand-900";
}

function ProjectThumbnail({ name }: { name: string }) {
  const hash = name.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const gradients = [
    "from-indigo-600/20 via-purple-600/10 to-transparent",
    "from-emerald-600/20 via-teal-600/10 to-transparent",
    "from-violet-600/20 via-pink-600/10 to-transparent",
    "from-blue-600/20 via-sky-600/10 to-transparent",
    "from-amber-600/20 via-orange-600/10 to-transparent",
  ];
  const gradient = gradients[hash % gradients.length];
  const layoutStyle = hash % 3;

  return (
    <div className="h-28 bg-[#09090b] relative border-b border-white/5 overflow-hidden flex items-center justify-center group-hover:bg-[#060608] transition-colors duration-300">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:8px_8px]" />
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`} />

      <div className="w-4/5 h-4/5 rounded bg-black/45 border border-white/5 p-2 flex flex-col gap-1.5 shadow-2xl relative select-none transform translate-y-2 group-hover:translate-y-1 transition-all duration-300">
        {layoutStyle === 0 ? (
          <div className="flex gap-2 h-full">
            <div className="w-6 shrink-0 h-full bg-white/5 border border-white/5 rounded-sm flex flex-col gap-1 p-0.5">
              <div className="w-2.5 h-1 bg-white/30 rounded-full" />
              <div className="w-4 h-0.5 bg-white/10 rounded-full" />
              <div className="w-3 h-0.5 bg-white/10 rounded-full" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <div className="w-8 h-1.5 bg-white/20 rounded-full" />
                <div className="w-4 h-1.5 bg-white/10 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-1 flex-1">
                <div className="rounded bg-white/5 border border-white/5 p-1 flex flex-col justify-between">
                  <div className="w-4 h-0.5 bg-white/20 rounded-full" />
                  <div className="w-6 h-1 bg-violet-400/40 rounded-full" />
                </div>
                <div className="rounded bg-white/5 border border-white/5 p-1 flex flex-col justify-between">
                  <div className="w-3 h-0.5 bg-white/20 rounded-full" />
                  <div className="w-5 h-1 bg-emerald-400/40 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ) : layoutStyle === 1 ? (
          <div className="flex flex-col items-center justify-center text-center gap-1.5 h-full py-1">
            <div className="w-4 h-1 bg-violet-400/30 rounded-full" />
            <div className="w-16 h-2 bg-white/25 rounded-full" />
            <div className="w-20 h-1 bg-white/10 rounded-full" />
            <div className="w-16 h-1 bg-white/10 rounded-full" />
            <div className="flex gap-1 mt-1">
              <div className="w-6 h-2 bg-violet-500/40 rounded-sm border border-violet-500/20" />
              <div className="w-6 h-2 bg-white/5 rounded-sm border border-white/10" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 h-full justify-between">
            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            <div className="grid grid-cols-3 gap-1.5 flex-1">
              <div className="rounded bg-white/5 border border-white/5 p-1 flex flex-col gap-0.5 justify-center">
                <div className="w-2.5 h-2.5 rounded bg-white/10" />
                <div className="w-4 h-0.5 bg-white/20 rounded-full" />
              </div>
              <div className="rounded bg-white/5 border border-white/5 p-1 flex flex-col gap-0.5 justify-center">
                <div className="w-2.5 h-2.5 rounded bg-white/10" />
                <div className="w-4 h-0.5 bg-white/20 rounded-full" />
              </div>
              <div className="rounded bg-white/5 border border-white/5 p-1 flex flex-col gap-0.5 justify-center">
                <div className="w-2.5 h-2.5 rounded bg-white/10" />
                <div className="w-4 h-0.5 bg-white/20 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/10 transition-colors duration-300" />
    </div>
  );
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "deployed": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "deploying":
    case "generating": return "bg-sky-500/10 text-sky-400 border-sky-500/20 animate-pulse";
    case "failed": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    case "generated": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    default: return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
};

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
  const { projects, loadProjects, deleteProject, toggleFavorite } = useProjects();

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
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/5 bg-black/40 backdrop-blur-sm shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={closePreview}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Generate</span>
              <span className="sm:hidden">Back</span>
            </button>
            <span className="w-px h-4 bg-white/10 shrink-0" />
            {isGenerating ? (
              <span className="flex items-center gap-1.5 text-xs text-[#6ee7b7] truncate min-w-0">
                <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                <span className="truncate">{generationMessage || "Generating…"}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-green-400 truncate min-w-0">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Generation complete</span>
              </span>
            )}
          </div>
          <button
            onClick={closePreview}
            className="h-7 px-2.5 sm:px-3 rounded-md text-xs font-medium border border-white/10 text-white hover:bg-white/5 transition-colors shrink-0"
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
      <div className="relative w-full overflow-hidden border-b border-white/5 bg-[#070709] py-10 sm:py-16 md:py-24">
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
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-white/10 bg-white/[0.03] text-[10px] font-medium text-[#6ee7b7] mb-4 sm:mb-6 max-w-full">
              <Zap className="w-3 h-3 animate-bounce-subtle shrink-0" />
              <span className="truncate">AI Pipeline: Planner → Generator → Validator → Preview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.2] mb-3 sm:mb-4 px-1">
              What page would you like to generate today?
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed px-1">
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
                className="w-full bg-transparent px-4 py-4 sm:px-6 sm:pt-5 sm:pb-4 text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none resize-none leading-relaxed font-sans"
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:pb-4 sm:pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Planner v2 Active</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <span className="text-[10px] text-neutral-600 hidden sm:block font-mono">⌘↵ to generate</span>
                  <motion.button
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center justify-center gap-2 h-9 px-4 sm:px-5 w-full sm:w-auto rounded-full bg-[#6ee7b7] text-[#161616] text-xs font-bold hover:bg-[#52dca6] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(110,231,183,0.25)] hover:shadow-[0_0_20px_rgba(110,231,183,0.4)]"
                  >
                    {isGenerating ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> Generating Website…</>
                    ) : (
                      <><Sparkles className="w-3.5 h-3.5 shrink-0" /> Generate App <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 shrink-0" /></>
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
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16">
        {/* ── Template Gallery (SECONDARY HIERARCHY) ───────────────────────── */}
        <div className="mb-10 sm:mb-16 border-b border-white/5 pb-10 sm:pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Start from a Template
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Jumpstart your website with a pre-configured component library and styled system.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon;
              return (
                <motion.button
                  key={tmpl.id}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  onClick={() => handleChip(`Generate a ${tmpl.label.toLowerCase()} — ${tmpl.desc}`)}
                  disabled={isGenerating}
                  className="group text-left rounded-2xl border border-white/5 bg-surface-900/40 backdrop-blur-md p-5 shadow-lg shadow-black/40 hover:border-white/15 hover:bg-surface-800/50 hover:shadow-xl hover:shadow-black/60 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Icon container */}
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-white/20 transition-all duration-300">
                      <Icon className="w-4.5 h-4.5 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="text-xs font-bold text-white tracking-tight">{tmpl.label}</p>
                      {tmpl.popular && (
                        <span className="text-[8px] font-bold uppercase tracking-wider bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded-full text-violet-300">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-450 leading-relaxed min-h-[30px]">{tmpl.desc}</p>
                  </div>
                  {/* Rich Metadata Row */}
                  <div className="flex items-center gap-1.5 text-[9px] text-neutral-500 mt-4 border-t border-white/5 pt-2.5">
                    <span>{tmpl.category}</span>
                    <span className="text-neutral-700">•</span>
                    <span>{tmpl.componentsCount} Comp</span>
                    <span className="text-neutral-700">•</span>
                    <span>{tmpl.difficulty}</span>
                    <span className="text-neutral-700">•</span>
                    <span>{tmpl.estTime}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Recent Projects (TERTIARY HIERARCHY) ─────────────────────────── */}
        {recentProjects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-400" />
                  Recent Projects
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Continue refining or previewing your recently generated websites.
                </p>
              </div>
              <Link
                href="/projects"
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="relative group text-left rounded-2xl border border-white/5 bg-surface-900/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/60 hover:-translate-y-0.5 animate-fade-in cursor-pointer"
                  onClick={() => handleSelectProject(project.id, project.generatedHtml)}
                >
                  {/* Star Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(project.id, !!project.isFavorite);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/55 border border-white/5 text-white/50 hover:text-amber-400 hover:bg-black/85 transition-all z-20 cursor-pointer"
                    title={project.isFavorite ? "Remove Favorite" : "Mark as Favorite"}
                  >
                    <Star className={`w-3.5 h-3.5 ${project.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>

                  {/* Thumbnail / Abstract Wireframe */}
                  <ProjectThumbnail name={project.name} />

                  {/* Content */}
                  <div className="p-4.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-violet-400 transition-colors tracking-tight">
                        {project.name}
                      </h4>
                      <p className="text-[10px] text-neutral-450 line-clamp-2 leading-relaxed min-h-[30px] mt-1">
                        {project.prompt}
                      </p>
                    </div>

                    {/* Badges Row */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/5">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-wider ${getStatusBadgeColor(project.deploymentState ?? "idle")}`}>
                        {project.deploymentState ?? "idle"}
                      </span>
                      {project.aiModel && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold border border-white/5 bg-white/5 text-neutral-450">
                          <Cpu className="w-2.5 h-2.5 text-neutral-500" />
                          {project.aiModel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4.5 py-2.5 border-t border-white/5 bg-black/15 flex items-center justify-between text-[9px] text-neutral-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3 h-3 text-neutral-600" />
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>

                    {/* Actions Menu */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Link href={`/projects/${project.id}`} title="View Details" onClick={(e) => e.stopPropagation()}>
                        <button className="p-1 rounded text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(project.id, selectedProjectId);
                        }}
                        className="p-1 rounded text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
