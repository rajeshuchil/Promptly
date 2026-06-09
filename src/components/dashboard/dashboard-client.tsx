"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PreviewPanel, type PreviewStatus } from "@/components/preview";
import { MetricsBar } from "./metrics-bar";
import { TemplateGallery } from "./template-gallery";
import { ProjectSidebar } from "./project-sidebar";
import { useUsage } from "./hooks/use-usage";
import { useProjects } from "./hooks/use-projects";
import { useBilling } from "./hooks/use-billing";
import { useGenerationStream } from "./hooks/use-generation-stream";

export function DashboardClient() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<"standard" | "minimal" | "rich" | "modern-saas" | "glassmorphism" | "enterprise" | "startup">("modern-saas");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const { usageStats, loadUsage } = useUsage();
  const { projects, loadProjects, deleteProject, toggleFavorite } = useProjects();
  const { isBillingLoading, handleBilling } = useBilling(usageStats);

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
    onComplete: (projectId) => setSelectedProjectId(projectId),
    onError: (msg) => console.error("Generation error:", msg),
    onLoadProjects: loadProjects,
    onLoadUsage: loadUsage,
  });

  // Initial data load
  useEffect(() => {
    loadProjects();
    loadUsage();
  }, [loadProjects, loadUsage]);

  // Auto-regenerate from ?regenerateId query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regenerateId = params.get("regenerateId");
    if (regenerateId && projects.length > 0) {
      const target = projects.find((p) => p.id === regenerateId);
      if (target) {
        window.history.replaceState({}, document.title, window.location.pathname);
        setPrompt(target.prompt);
        setSelectedTemplateId(null);
        setTimeout(() => {
          document.getElementById("submit-prompt-btn")?.click();
        }, 300);
      }
    }
  }, [projects]);

  // Mock Stripe checkout session post-redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const priceId = params.get("price_id");
    if (sessionId && priceId && usageStats?.plan?.userId) {
      window.history.replaceState({}, document.title, window.location.pathname);
      fetch("/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify({
          type: "checkout.session.completed",
          data: {
            object: {
              customer: "cus_mock_user",
              subscription: `sub_mock_${Date.now()}`,
              metadata: { userId: usageStats.plan.userId, priceId },
            },
          },
        }),
      }).then(() => {
        loadUsage();
        loadProjects();
      });
    }
  }, [loadUsage, loadProjects, usageStats]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    setSelectedProjectId(null);
    await generate(prompt, style, selectedTemplateId ?? undefined);
    setPrompt("");
    setSelectedTemplateId(null);
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const wasSelected = await deleteProject(id, selectedProjectId);
    if (wasSelected) {
      setSelectedProjectId(null);
      setActiveHtml(null);
      setGenerationState("idle");
    }
    loadUsage();
  };

  const handleToggleFavorite = (id: string, currentVal: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id, currentVal);
  };

  const userPlan = usageStats?.plan?.plan ?? "free";

  return (
    <div className="flex flex-col gap-6 h-full min-h-[650px] animate-fade-in">
      {/* Metrics Row */}
      <MetricsBar
        usageStats={usageStats}
        projectCount={projects.length}
        isBillingLoading={isBillingLoading}
        onBilling={handleBilling}
      />

      {/* Template Gallery */}
      <TemplateGallery
        selectedTemplateId={selectedTemplateId}
        activeCategory={activeCategory}
        userPlan={userPlan}
        onSelectTemplate={(id, hint) => {
          setSelectedTemplateId(id);
          setPrompt(hint);
        }}
        onClearTemplate={() => setSelectedTemplateId(null)}
        onSetCategory={setActiveCategory}
        onUpgrade={handleBilling}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 h-full min-h-0">
          {/* Prompt Input */}
          <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--color-brand-400)]" />
                AI Page Generator
              </CardTitle>
              <CardDescription className="text-xs">
                Describe the page you want. The AI will plan, generate, and validate it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                {selectedTemplateId && (
                  <div className="flex items-center justify-between bg-[var(--color-surface-950)] border border-[var(--color-brand-500)]/40 rounded-[var(--radius-md)] px-2.5 py-1.5 text-xs text-[var(--color-brand-400)]">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3 h-3 animate-pulse" />
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

                <textarea
                  id="prompt-input"
                  className="w-full min-h-[100px] rounded-[var(--radius-lg)] px-3 py-2 text-sm font-mono text-[var(--color-surface-100)] placeholder:text-[var(--color-surface-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-500)]"
                  style={{
                    background: "var(--color-surface-950)",
                    border: "1px solid var(--color-border)",
                  }}
                  placeholder="e.g. A dark mode SaaS landing page for a task tracker..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                />

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
                    <option value="modern-saas">Modern SaaS</option>
                    <option value="minimal">Minimalist Clean</option>
                    <option value="glassmorphism">Glassmorphism</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="startup">Startup</option>
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
                      Generate Page
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tabbed Project Sidebar */}
          <ProjectSidebar
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setActiveHtml(null);
              setGenerationError(null);
              setGenerationState("idle");
            }}
            onDeleteProject={handleDeleteProject}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        {/* RIGHT COLUMN: Preview */}
        <div className="lg:col-span-7 xl:col-span-8 h-full min-h-0">
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
    </div>
  );
}
