"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Sparkles, History, Trash2, Globe, Calendar, RefreshCw, Loader2, Layers, Lock, Star, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PreviewPanel, type PreviewStatus } from "@/components/preview";
import type { Project } from "@/lib/projects/types";
import { STARTER_TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/templates";

const getGradientForTemplate = (id: string) => {
  const gradients: Record<string, string> = {
    "saas-dashboard": "from-indigo-600 to-indigo-900",
    "analytics-platform": "from-pink-600 to-violet-900",
    "ai-startup": "from-purple-600 to-cyan-900",
    "crm-dashboard": "from-teal-600 to-sky-900",
    "portfolio-website": "from-neutral-700 to-neutral-900",
    "agency-website": "from-orange-600 to-yellow-900",
    "devtools-homepage": "from-emerald-600 to-blue-900",
    "documentation-site": "from-blue-600 to-slate-900",
  };
  return gradients[id] || "from-brand-600 to-brand-900";
};

export function DashboardClient() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<"standard" | "minimal" | "rich">("standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Dashboard improvements tabs & activity feed
  const [dashboardTab, setDashboardTab] = useState<"recent" | "favorites" | "activity">("recent");
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [activeHtml, setActiveHtml] = useState<string | null>(null);

  const [usageStats, setUsageStats] = useState<any>(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);
  const [isBillingLoading, setIsBillingLoading] = useState(false);

  // Template states
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Progressive generation states
  const [generationState, setGenerationState] = useState<PreviewStatus>("idle");
  const [generationMessage, setGenerationMessage] = useState<string>("");

  // Fetch usage stats
  const loadUsage = useCallback(async () => {
    setIsLoadingUsage(true);
    try {
      const res = await fetch("/api/usage");
      const data = await res.json();
      if (data.success) {
        setUsageStats(data);
      }
    } catch (err) {
      console.error("Failed to load usage stats:", err);
    } finally {
      setIsLoadingUsage(false);
    }
  }, []);

  // Fetch projects list
  const loadProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  const loadActivity = useCallback(async () => {
    setIsLoadingActivity(true);
    try {
      const res = await fetch("/api/activity");
      const data = await res.json();
      if (data.success) {
        setActivities(data.activity || []);
      }
    } catch (err) {
      console.error("Failed to load activity logs:", err);
    } finally {
      setIsLoadingActivity(false);
    }
  }, []);

  useEffect(() => {
    if (dashboardTab === "activity") {
      loadActivity();
    }
  }, [dashboardTab, loadActivity]);

  const handleBilling = async () => {
    setIsBillingLoading(true);
    try {
      const plan = usageStats?.plan?.plan || "free";
      const isPaid = plan === "pro" || plan === "enterprise";

      if (isPaid) {
        const res = await fetch("/api/billing/portal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            returnUrl: window.location.href,
          }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error?.message || "Failed to launch billing portal");
        }
      } else {
        const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_mock_pro_12345";
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId,
            successUrl: `${window.location.origin}/dashboard?session_id=cs_mock_${Date.now()}&price_id=${priceId}`,
            cancelUrl: `${window.location.origin}/dashboard?checkout=cancel`,
          }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error?.message || "Failed to launch checkout session");
        }
      }
    } catch (err) {
      console.error("Billing action failed:", err);
      alert("Billing system encountered an error. Please try again.");
    } finally {
      setIsBillingLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    loadUsage();
  }, [loadProjects, loadUsage]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regenerateId = params.get("regenerateId");
    if (regenerateId && projects.length > 0) {
      const targetProj = projects.find((p) => p.id === regenerateId);
      if (targetProj) {
        // Clear param so it doesn't trigger on reload
        window.history.replaceState({}, document.title, window.location.pathname);
        setPrompt(targetProj.prompt);
        setSelectedTemplateId(null);
        setTimeout(() => {
          const submitBtn = document.getElementById("submit-prompt-btn");
          if (submitBtn) submitBtn.click();
        }, 300);
      }
    }
  }, [projects]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mockCheckoutSessionId = params.get("session_id");
    const mockPriceId = params.get("price_id");
    
    if (mockCheckoutSessionId && mockPriceId && usageStats?.plan?.userId) {
      window.history.replaceState({}, document.title, window.location.pathname);
      
      fetch("/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify({
          type: "checkout.session.completed",
          data: {
            object: {
              customer: "cus_mock_user",
              subscription: `sub_mock_${Date.now()}`,
              metadata: {
                userId: usageStats.plan.userId,
                priceId: mockPriceId,
              },
            },
          },
        }),
      }).then(() => {
        loadUsage();
        loadProjects();
      });
    }
  }, [loadUsage, loadProjects, usageStats]);

  // Handle streaming generation request
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationError(null);
    setActiveHtml("");
    setSelectedProjectId(null);
    setGenerationState("planning");
    setGenerationMessage("Initiating website plan...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
          templateId: selectedTemplateId || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP error! status: ${res.status}`);
      }

      if (!res.body) {
        throw new Error("ReadableStream is not supported by this browser or endpoint.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const messages = buffer.split("\n\n");
        buffer = messages.pop() || "";

        for (const msg of messages) {
          if (!msg.trim()) continue;

          // Parse SSE format
          const lines = msg.split("\n");
          let event = "";
          let dataText = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              event = line.slice(7).trim();
            } else if (line.startsWith("data: ")) {
              dataText = line.slice(6).trim();
            }
          }

          if (event && dataText) {
            try {
              const data = JSON.parse(dataText);
              
              if (event === "planning") {
                setGenerationState("planning");
                setGenerationMessage(data.message);
              } else if (event === "generating") {
                setGenerationState("generating");
                setGenerationMessage(data.message);
              } else if (event === "chunk") {
                setGenerationState("generating");
                setActiveHtml((prev) => (prev || "") + data.chunk);
              } else if (event === "validating") {
                setGenerationState("validating");
                setGenerationMessage(data.message);
              } else if (event === "saving") {
                setGenerationState("saving");
                setGenerationMessage(data.message);
              } else if (event === "complete") {
                setGenerationState("success");
                setActiveHtml(data.html); // set final cleaned HTML
                setSelectedProjectId(data.projectId);
                setPrompt("");
                setSelectedTemplateId(null); // Reset selected template on success
                loadProjects();
                loadUsage();
              } else if (event === "error") {
                setGenerationState("error");
                setGenerationError(data.message);
                loadUsage();
              }
            } catch (jsonErr) {
              console.error("Failed to parse event JSON:", jsonErr);
            }
          }
        }
      }
    } catch (err: any) {
      setGenerationState("error");
      setGenerationError(err.message || "Failed to establish stream connection");
      loadUsage();
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle deleting a project
  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        if (selectedProjectId === id) {
          setSelectedProjectId(null);
          setActiveHtml(null);
          setGenerationState("idle");
        }
        loadProjects();
        loadUsage();
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const handleToggleFavorite = async (id: string, currentVal: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !currentVal }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFavorite: !currentVal } : p))
        );
      }
    } catch (err) {
      console.error("Failed to toggle favorite status:", err);
    }
  };

  // Filter templates
  const filteredTemplates = STARTER_TEMPLATES.filter((t) => {
    if (activeCategory === "all") return true;
    return t.category === activeCategory;
  });

  return (
    <div className="flex flex-col gap-6 h-full min-h-[650px] animate-fade-in">
      {/* SaaS Usage & Plan Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {/* Card 1: Plan Tier */}
        <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">Subscription Plan</p>
            <h3 className="text-lg font-extrabold mt-1 text-white capitalize animate-pulse-slow">
              {usageStats?.plan?.plan || "Free"} Plan
            </h3>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white bg-gradient-to-r from-[oklch(0.60_0.27_270)] to-[oklch(0.53_0.28_310)] select-none">
              Active
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[9px] px-2 py-0.5 border-[var(--color-border)] hover:bg-[var(--color-surface-800)] text-white hover:text-white"
              onClick={handleBilling}
              disabled={isBillingLoading}
            >
              {isBillingLoading ? (
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
              ) : usageStats?.plan?.plan === "pro" || usageStats?.plan?.plan === "enterprise" ? (
                "Manage Billing"
              ) : (
                "Upgrade to Pro"
              )}
            </Button>
          </div>
        </Card>

        {/* Card 2: Total Projects */}
        <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-4">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">Total Projects</p>
          <h3 className="text-2xl font-extrabold mt-1 text-white">{projects.length}</h3>
        </Card>

        {/* Card 3: Total Runs */}
        <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-4">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">Total AI Generations</p>
          <h3 className="text-2xl font-extrabold mt-1 text-white">
            {usageStats?.metrics?.totalGenerations ?? 0}
          </h3>
        </Card>

        {/* Card 4: Month Usage progress */}
        <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">Generations This Month</p>
            <span className="text-[10px] font-mono text-[var(--color-brand-400)] font-semibold">
              {usageStats?.plan?.generationsUsed ?? 0} / {usageStats?.plan?.generationLimit ?? 10}
            </span>
          </div>
          <div className="w-full bg-[var(--color-surface-950)] h-1.5 rounded-full mt-2.5 overflow-hidden border border-[var(--color-border)]">
            <div 
              className="bg-gradient-to-r from-[oklch(0.60_0.27_270)] to-[oklch(0.53_0.28_310)] h-full transition-all duration-500"
              style={{ 
                width: `${Math.min(
                  ((usageStats?.plan?.generationsUsed ?? 0) / (usageStats?.plan?.generationLimit ?? 10)) * 100, 
                  100
                )}%` 
              }}
            />
          </div>
        </Card>
      </div>

      {/* Template Gallery */}
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
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory("all")}
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
                onClick={() => setActiveCategory(cat.id)}
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
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            const userPlan = usageStats?.plan?.plan || "free";
            const isLocked = template.tier === "pro" && userPlan === "free";
            
            return (
              <div
                key={template.id}
                onClick={() => {
                  if (isLocked) {
                    handleBilling();
                    return;
                  }
                  if (isSelected) {
                    setSelectedTemplateId(null);
                  } else {
                    setSelectedTemplateId(template.id);
                    // Prepopulate prompt
                    setPrompt(`Create a ${template.title} with a ${template.theme} theme: ${template.description}`);
                  }
                }}
                className={`relative flex-none w-[220px] rounded-[var(--radius-lg)] border overflow-hidden cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-[var(--color-brand-500)] ring-1 ring-[var(--color-brand-500)] bg-[var(--color-surface-950)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface-950)]/40 hover:border-[var(--color-surface-650)]"
                }`}
              >
                {/* Visual Thumbnail Gradient */}
                <div className={`h-16 bg-gradient-to-br ${getGradientForTemplate(template.id)} flex items-center justify-center relative p-3 text-center`}>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-black/40 px-2 py-0.5 rounded text-white backdrop-blur-[2px]">
                    {template.pageType}
                  </span>
                  
                  {/* Lock/Unlock Badge */}
                  <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    template.tier === "pro"
                      ? "bg-amber-500/90 text-black flex items-center gap-0.5"
                      : "bg-emerald-500/90 text-white"
                  }`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* LEFT COLUMN: Prompt Input & Project History */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 h-full min-h-0">
          
          {/* Prompt Input Form */}
          <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--color-brand-400)]" />
                AI Website Generator
              </CardTitle>
              <CardDescription className="text-xs">
                Describe the website you want. The AI will plan, generate, and validate it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                {selectedTemplateId && (
                  <div className="flex items-center justify-between bg-[var(--color-surface-950)] border border-[var(--color-brand-500)]/40 rounded-[var(--radius-md)] px-2.5 py-1.5 text-xs text-[var(--color-brand-400)]">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3 h-3 text-[var(--color-brand-400)] animate-pulse" />
                      Template constraints active
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedTemplateId(null)}
                      className="text-[var(--color-muted-fg)] hover:text-white text-[10px] font-bold"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <div>
                  <textarea
                    id="prompt-input"
                    className="w-full min-h-[100px] rounded-[var(--radius-lg)] px-3 py-2 text-sm font-mono text-[var(--color-surface-100)] placeholder:text-[var(--color-surface-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-500)]"
                    style={{
                      background: "var(--color-surface-950)",
                      border: "1px solid var(--color-border)",
                    }}
                    placeholder="e.g. A dark mode SaaS landing page for a task tracker with pricing plans..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>

                {/* Style Selector */}
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="style-select" className="text-xs font-medium text-[var(--color-muted-fg)]">
                    Design Theme
                  </label>
                  <select
                    id="style-select"
                    className="bg-[var(--color-surface-950)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-2.5 py-1 text-xs text-[var(--color-surface-100)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-500)]"
                    value={style}
                    onChange={(e) => setStyle(e.target.value as any)}
                    disabled={isGenerating}
                  >
                    <option value="standard">Standard Classic</option>
                    <option value="minimal">Minimalist Clean</option>
                    <option value="rich">Rich Vibrant</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  id="submit-prompt-btn"
                  className="w-full h-9 text-xs"
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Generate Website
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Project History & Management Sidebar */}
          <Card className="flex-1 flex flex-col border-[var(--color-border)] bg-[var(--color-surface-900)] min-h-0">
            {/* Tabs Header */}
            <div className="flex border-b border-[var(--color-border)] bg-black/10 shrink-0">
              <button
                type="button"
                onClick={() => setDashboardTab("recent")}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all duration-200 ${
                  dashboardTab === "recent"
                    ? "border-[var(--color-brand-500)] text-white bg-[var(--color-surface-950)]/45"
                    : "border-transparent text-[var(--color-surface-400)] hover:text-white"
                }`}
              >
                Recent
              </button>
              <button
                type="button"
                onClick={() => setDashboardTab("favorites")}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all duration-200 ${
                  dashboardTab === "favorites"
                    ? "border-[var(--color-brand-500)] text-white bg-[var(--color-surface-950)]/45"
                    : "border-transparent text-[var(--color-surface-400)] hover:text-white"
                }`}
              >
                Favorites
              </button>
              <button
                type="button"
                onClick={() => setDashboardTab("activity")}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all duration-200 ${
                  dashboardTab === "activity"
                    ? "border-[var(--color-brand-500)] text-white bg-[var(--color-surface-950)]/45"
                    : "border-transparent text-[var(--color-surface-400)] hover:text-white"
                }`}
              >
                Activity Feed
              </button>
            </div>

            <CardContent className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
              {/* 1. Recent Projects Tab */}
              {dashboardTab === "recent" && (
                projects.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <History className="w-8 h-8 text-[var(--color-surface-600)] mb-2" />
                    <p className="text-xs font-semibold text-[var(--color-surface-300)]">No projects yet</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5 max-w-[180px]">
                      Your generated websites will show up here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {projects.map((project) => {
                      const isSelected = selectedProjectId === project.id;
                      return (
                        <div
                          key={project.id}
                          className={`group flex items-start justify-between p-3 rounded-[var(--radius-lg)] border cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-[var(--color-brand-500)] bg-[var(--color-surface-950)]"
                              : "border-[var(--color-border)] hover:border-[var(--color-surface-650)] bg-[var(--color-surface-950)]/40 hover:bg-[var(--color-surface-950)]/80"
                          }`}
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            setActiveHtml(null);
                            setGenerationError(null);
                            setGenerationState("idle");
                          }}
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Globe className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[var(--color-brand-400)]" : "text-[var(--color-surface-400)]"}`} />
                              <h4 className="text-xs font-semibold text-[var(--color-surface-100)] truncate">
                                {project.name}
                              </h4>
                            </div>
                            <p className="text-[10px] text-[var(--color-muted-fg)] line-clamp-2 mb-1.5 leading-relaxed">
                              {project.prompt}
                            </p>
                            <div className="flex items-center gap-1 text-[9px] text-[var(--color-surface-500)]">
                              <Calendar className="w-2.5 h-2.5" />
                              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            {/* Star Toggle */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleFavorite(project.id, !!project.isFavorite, e)}
                              className="p-1 rounded text-white/50 hover:text-amber-400 transition-colors"
                              title={project.isFavorite ? "Remove favorite" : "Mark as favorite"}
                            >
                              <Star className={`w-3.5 h-3.5 ${project.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
                            </button>

                            {/* View Detail Link */}
                            <Link href={`/projects/${project.id}`} onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                className="p-1 rounded text-white/50 hover:text-white transition-colors"
                                title="View details"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </Link>

                            {/* Delete */}
                            <button
                              type="button"
                              className="p-1 rounded text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                              onClick={(e) => handleDeleteProject(project.id, e)}
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {/* 2. Favorite Projects Tab */}
              {dashboardTab === "favorites" && (
                projects.filter((p) => p.isFavorite).length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Star className="w-8 h-8 text-amber-500/40 mb-2" />
                    <p className="text-xs font-semibold text-[var(--color-surface-300)]">No starred websites</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5 max-w-[180px]">
                      Favorite your key projects to access them quickly here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {projects.filter((p) => p.isFavorite).map((project) => {
                      const isSelected = selectedProjectId === project.id;
                      return (
                        <div
                          key={project.id}
                          className={`group flex items-start justify-between p-3 rounded-[var(--radius-lg)] border cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-[var(--color-brand-500)] bg-[var(--color-surface-950)]"
                              : "border-[var(--color-border)] hover:border-[var(--color-surface-650)] bg-[var(--color-surface-950)]/40 hover:bg-[var(--color-surface-950)]/80"
                          }`}
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            setActiveHtml(null);
                            setGenerationError(null);
                            setGenerationState("idle");
                          }}
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Globe className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[var(--color-brand-400)]" : "text-[var(--color-surface-400)]"}`} />
                              <h4 className="text-xs font-semibold text-[var(--color-surface-100)] truncate">
                                {project.name}
                              </h4>
                            </div>
                            <p className="text-[10px] text-[var(--color-muted-fg)] line-clamp-2 mb-1.5 leading-relaxed">
                              {project.prompt}
                            </p>
                            <div className="flex items-center gap-1 text-[9px] text-[var(--color-surface-500)]">
                              <Calendar className="w-2.5 h-2.5" />
                              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            {/* Star Toggle */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleFavorite(project.id, !!project.isFavorite, e)}
                              className="p-1 rounded text-amber-400 transition-colors animate-pulse-slow"
                              title="Remove favorite"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            </button>

                            {/* View Detail Link */}
                            <Link href={`/projects/${project.id}`} onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                className="p-1 rounded text-white/50 hover:text-white transition-colors"
                                title="View details"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </Link>

                            {/* Delete */}
                            <button
                              type="button"
                              className="p-1 rounded text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                              onClick={(e) => handleDeleteProject(project.id, e)}
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {/* 3. Activity Feed Tab */}
              {dashboardTab === "activity" && (
                isLoadingActivity ? (
                  <div className="h-48 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[var(--color-brand-400)]" />
                  </div>
                ) : activities.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Clock className="w-8 h-8 text-[var(--color-surface-600)] mb-2" />
                    <p className="text-xs font-semibold text-[var(--color-surface-300)]">No activity logged</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5">
                      Events like generation, deployment will show here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map((act) => (
                      <div
                        key={act.id}
                        className="flex gap-2.5 p-2.5 rounded bg-[var(--color-surface-950)]/60 border border-[var(--color-border)] text-[11px]"
                      >
                        <div className="mt-0.5 text-[var(--color-brand-400)] shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <p className="font-extrabold text-white text-xs leading-tight">
                            {act.title}
                          </p>
                          <p className="text-[10px] text-[var(--color-surface-300)] leading-normal">
                            {act.description}
                          </p>
                          <span className="text-[9px] text-[var(--color-surface-500)] block pt-0.5">
                            {new Date(act.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </CardContent>
          </Card>

        </div>

        {/* RIGHT COLUMN: Interactive Web Preview Panel */}
        <div className="lg:col-span-7 xl:col-span-8 h-full min-h-0">
          <PreviewPanel
            projectId={selectedProjectId}
            generatedHtml={activeHtml}
            isLoading={isGenerating}
            error={generationError}
            onRefresh={loadProjects}
            generationState={generationState}
            generationMessage={generationMessage}
          />
        </div>
      </div>
    </div>
  );
}
