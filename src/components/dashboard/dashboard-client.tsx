"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, History, Trash2, Globe, Calendar, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PreviewPanel, type PreviewStatus } from "@/components/preview";
import type { Project } from "@/lib/projects/types";

export function DashboardClient() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<"standard" | "minimal" | "rich">("standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeHtml, setActiveHtml] = useState<string | null>(null);

  const [usageStats, setUsageStats] = useState<any>(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);

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

  useEffect(() => {
    loadProjects();
    loadUsage();
  }, [loadProjects, loadUsage]);

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
        body: JSON.stringify({ prompt, style }),
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

  return (
    <div className="flex flex-col gap-6 h-full min-h-[650px] animate-fade-in">
      {/* SaaS Usage & Plan Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {/* Card 1: Plan Tier */}
        <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">Subscription Plan</p>
            <h3 className="text-lg font-extrabold mt-1 text-white capitalize">
              {usageStats?.plan?.plan || "Free"} Plan
            </h3>
          </div>
          <div className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-[oklch(0.60_0.27_270)] to-[oklch(0.53_0.28_310)] select-none">
            Active
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

        {/* Project History Sidebar */}
        <Card className="flex-1 flex flex-col border-[var(--color-border)] bg-[var(--color-surface-900)] min-h-0">
          <CardHeader className="pb-3 shrink-0">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <History className="w-4 h-4 text-[var(--color-brand-400)]" />
                Recent Projects
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={loadProjects}
                disabled={isLoadingProjects}
                title="Refresh history"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProjects ? "animate-spin" : ""}`} />
              </Button>
            </CardTitle>
            <CardDescription className="text-xs">
              Load previously generated sites directly from the database.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
            {projects.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <History className="w-8 h-8 text-[var(--color-surface-600)] mb-2" />
                <p className="text-xs font-semibold text-[var(--color-surface-300)]">No projects yet</p>
                <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5 max-w-[180px]">
                  Generated pages will be persisted and listed here.
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

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                        onClick={(e) => handleDeleteProject(project.id, e)}
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
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
