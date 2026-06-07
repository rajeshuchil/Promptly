"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Download, Globe, Cpu, Calendar, Sparkles, Code,
  BookOpen, Settings, Play, Copy, Check, Trash2, Edit, Loader2,
  AlertTriangle, RefreshCw, ExternalLink, History, GitBranch, Activity,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDeployStream } from "@/hooks/use-deploy-stream";
import type { Project } from "@/lib/projects/types";

interface ProjectDetailClientProps {
  initialProject: Project;
}

export function ProjectDetailClient({ initialProject }: ProjectDetailClientProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project>(initialProject);
  const [activeTab, setActiveTab] = useState<"prompt" | "plan" | "html" | "meta" | "deployments" | "edit" | "history" | "timeline">("prompt");
  const [copied, setCopied] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(project.name);
  const [isLoading, setIsLoading] = useState(false);

  // AI Edit States
  const [editPrompt, setEditPrompt] = useState("");
  const [isIterating, setIsIterating] = useState(false);
  const [iterationStep, setIterationStep] = useState("");
  const [iterationProgress, setIterationProgress] = useState<string[]>([]);

  // History / Revision States
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState(false);

  // Timeline States
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  const { isDeploying, deploySteps, deployError, deploy } = useDeployStream({
    projectId: project.id,
    onDeployComplete: () => {
      fetch(`/api/projects/${project.id}`)
        .then((r) => r.json())
        .then((d) => { if (d.success && d.project) setProject(d.project); });
    },
    onDone: () => {
      fetch(`/api/projects/${project.id}`)
        .then((r) => r.json())
        .then((d) => { if (d.success && d.project) setProject(d.project); });
    }
  });

  const handleCopyCode = () => {
    if (!project.generatedHtml) return;
    navigator.clipboard.writeText(project.generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveRename = async () => {
    if (!renameValue.trim() || renameValue === project.name) { setIsRenaming(false); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameValue.trim() }),
      });
      const data = await res.json();
      if (data.success && data.project) { setProject(data.project); setIsRenaming(false); }
    } catch (err) {
      console.error("Rename failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${project.name}"?`)) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { router.push("/projects"); router.refresh(); }
      else alert(data.error?.message ?? "Delete failed");
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.project) router.push(`/projects/${data.project.id}`);
      else alert(data.error?.message ?? "Duplicate failed");
    } catch (err) {
      console.error("Duplicate failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRevisions = async () => {
    setLoadingRevisions(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/revisions`);
      const data = await res.json();
      if (data.success) {
        setRevisions(data.revisions);
      }
    } catch (err) {
      console.error("Failed to load revisions:", err);
    } finally {
      setLoadingRevisions(false);
    }
  };

  const fetchTimeline = async () => {
    setLoadingTimeline(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/timeline`);
      const data = await res.json();
      if (data.success) {
        setTimeline(data.timeline);
      }
    } catch (err) {
      console.error("Failed to load timeline events:", err);
    } finally {
      setLoadingTimeline(false);
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === "history") {
      fetchRevisions();
    } else if (tab === "timeline") {
      fetchTimeline();
    }
  };

  const handleRestoreRevision = async (revisionId: string) => {
    if (!confirm("Are you sure you want to restore the project to this revision? The current state will be saved as a new version.")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/revisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId }),
      });
      const data = await res.json();
      if (data.success) {
        // Fetch updated project state
        const pRes = await fetch(`/api/projects/${project.id}`);
        const pData = await pRes.json();
        if (pData.success && pData.project) {
          setProject(pData.project);
          setActiveTab("html");
          alert("Project successfully restored to selected revision!");
        }
      } else {
        alert(data.error?.message || "Failed to restore revision");
      }
    } catch (err) {
      console.error("Restore failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditWithAI = async () => {
    if (!editPrompt.trim()) return;
    setIsIterating(true);
    setIterationStep("planning");
    setIterationProgress(["Initiating website edit pipeline...", "Injected FastApp Design tokens..."]);

    try {
      const response = await fetch(`/api/projects/${project.id}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: editPrompt.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to start AI editor");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream reader available");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith("event: ")) {
            const eventName = line.replace("event: ", "").trim();
            // Look ahead for the next data line
            let nextIndex = i + 1;
            while (nextIndex < lines.length && !lines[nextIndex].startsWith("data: ")) {
              nextIndex++;
            }
            if (nextIndex < lines.length) {
              const dataLine = lines[nextIndex];
              const rawData = dataLine.replace("data: ", "").trim();
              try {
                const data = JSON.parse(rawData);
                if (eventName === "planning") {
                  setIterationStep("planning");
                  setIterationProgress((prev) => [...prev, `[Plan Update] ${data.message}`]);
                } else if (eventName === "generating") {
                  setIterationStep("generating");
                  setIterationProgress((prev) => [...prev, "[Generator] Code modification started..."]);
                } else if (eventName === "validating") {
                  setIterationStep("validating");
                  setIterationProgress((prev) => [...prev, `[Validator] Checking styling rules: ${data.message || "Running Quality Evaluation"}`]);
                } else if (eventName === "saving") {
                  setIterationStep("saving");
                  setIterationProgress((prev) => [...prev, "[Saver] Committing revision and timeline logs..."]);
                } else if (eventName === "complete") {
                  setIterationStep("complete");
                  setIterationProgress((prev) => [...prev, "✓ Website updated successfully!"]);
                  setEditPrompt("");
                  
                  // Fetch updated project
                  const pRes = await fetch(`/api/projects/${project.id}`);
                  const pData = await pRes.json();
                  if (pData.success && pData.project) {
                    setProject(pData.project);
                  }
                } else if (eventName === "error") {
                  setIterationStep("error");
                  setIterationProgress((prev) => [...prev, `❌ Error: ${data.message}`]);
                }
              } catch (e) {
                // Ignore chunk parsing errors
              }
            }
          }
        }
      }
    } catch (err: any) {
      setIterationStep("error");
      setIterationProgress((prev) => [...prev, `❌ Error: ${err.message || String(err)}`]);
    } finally {
      setIsIterating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
      case "deploying":
      case "building":
      case "queued": return "text-sky-400 border-sky-500/20 bg-sky-500/10 animate-pulse";
      case "failed": return "text-rose-400 border-rose-500/20 bg-rose-500/10";
      default: return "text-amber-400 border-amber-500/20 bg-amber-500/10";
    }
  };

  const tabCls = (active: boolean) =>
    `flex-1 py-3 px-4 text-xs font-bold border-b-2 transition-all duration-200 whitespace-nowrap ${
      active
        ? "border-[var(--color-brand-500)] text-white bg-[var(--color-surface-950)]/45"
        : "border-transparent text-[var(--color-surface-400)] hover:text-white"
    }`;

  const renderPlanDiff = (diff: any) => {
    if (!diff) return null;
    const items: string[] = [];
    if (diff.pageType) {
      items.push(`Changed layout to '${diff.pageType.to}'`);
    }
    if (diff.theme) {
      items.push(`Theme: ${diff.theme.from} → ${diff.theme.to}`);
    }
    if (diff.sections?.added?.length > 0) {
      items.push(`+ Added: ${diff.sections.added.join(", ")}`);
    }
    if (diff.sections?.removed?.length > 0) {
      items.push(`- Removed: ${diff.sections.removed.join(", ")}`);
    }
    if (diff.components?.added?.length > 0) {
      items.push(`+ Component: ${diff.components.added.join(", ")}`);
    }
    if (diff.designTokens?.length > 0) {
      const tokens = diff.designTokens.map((t: any) => `${t.key} (${t.to})`).join(", ");
      items.push(`🎨 Styles: ${tokens}`);
    }

    if (items.length === 0) {
      return <span className="text-[10px] text-[var(--color-surface-500)] italic">No core plan modifications</span>;
    }

    return (
      <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[10px] text-[var(--color-surface-300)] font-mono leading-tight">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="text-white hover:text-white border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface-800)] gap-1.5 h-8 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Projects
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 border-[var(--color-border)] hover:bg-[var(--color-surface-800)] text-white hover:text-white text-xs gap-1.5" onClick={handleDuplicate} disabled={isLoading}>
            <Copy className="w-3.5 h-3.5" />Clone
          </Button>
          <Button variant="outline" size="sm" className="h-8 border-[var(--color-border)] hover:bg-[var(--color-surface-800)] text-white hover:text-white text-xs gap-1.5" onClick={() => router.push(`/dashboard?regenerateId=${project.id}`)} disabled={isLoading}>
            <RefreshCw className="w-3.5 h-3.5" />Re-generate
          </Button>
          <Button variant="ghost" size="sm" className="h-8 hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 border border-transparent hover:border-rose-500/30 text-xs gap-1.5" onClick={handleDelete} disabled={isLoading}>
            <Trash2 className="w-3.5 h-3.5" />Delete
          </Button>
        </div>
      </div>

      {/* Header Card */}
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            {isRenaming ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="bg-[var(--color-surface-950)] border border-[var(--color-brand-500)] rounded px-2.5 py-1 text-sm font-bold text-white focus:outline-none"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSaveRename(); if (e.key === "Escape") setIsRenaming(false); }}
                  autoFocus
                />
                <Button size="sm" className="h-8 text-xs" onClick={handleSaveRename} disabled={isLoading}>Save</Button>
                <Button size="sm" variant="ghost" className="h-8 text-xs text-white" onClick={() => setIsRenaming(false)}>Cancel</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 group">
                <h2 className="text-xl font-extrabold text-white">{project.name}</h2>
                <button onClick={() => setIsRenaming(true)} className="opacity-0 group-hover:opacity-100 p-1 rounded text-[var(--color-surface-450)] hover:text-white transition-opacity" title="Rename project">
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3.5 text-xs text-[var(--color-surface-400)]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[var(--color-surface-500)]" />
                Created on {new Date(project.createdAt).toLocaleString()}
              </span>
              {project.aiModel && (
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-[var(--color-surface-500)]" />
                  Model: {project.aiModel}
                </span>
              )}
              {project.deployedUrl && (
                <a href={project.deployedUrl} target="_blank" rel="noreferrer" className="text-[var(--color-brand-400)] hover:underline flex items-center gap-0.5">
                  <Globe className="w-3.5 h-3.5 text-[var(--color-surface-500)]" />
                  fastapp.site <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider shrink-0 ${getStatusColor(project.deploymentState)}`}>
            Status: {project.deploymentState}
          </span>
        </div>
      </Card>

      {/* Details + Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Left: Tabbed Details */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="flex-1 flex flex-col border-[var(--color-border)] bg-[var(--color-surface-900)] min-h-0 overflow-hidden">
            <div className="flex border-b border-[var(--color-border)] bg-black/10 shrink-0 overflow-x-auto scrollbar-none">
              <button onClick={() => handleTabChange("edit")} className={tabCls(activeTab === "edit")}>✨ Edit with AI</button>
              <button onClick={() => handleTabChange("history")} className={tabCls(activeTab === "history")}>🕒 Version History</button>
              <button onClick={() => handleTabChange("timeline")} className={tabCls(activeTab === "timeline")}>📈 Timeline</button>
              <button onClick={() => handleTabChange("prompt")} className={tabCls(activeTab === "prompt")}>Prompt</button>
              <button onClick={() => handleTabChange("plan")} className={tabCls(activeTab === "plan")}>Planner Log</button>
              <button onClick={() => handleTabChange("html")} className={tabCls(activeTab === "html")}>HTML</button>
              <button onClick={() => handleTabChange("meta")} className={tabCls(activeTab === "meta")}>Metadata</button>
              <button onClick={() => handleTabChange("deployments")} className={tabCls(activeTab === "deployments")}>Deploy History</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 text-xs min-h-0 leading-relaxed">
              {/* Edit Tab */}
              {activeTab === "edit" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[var(--color-brand-400)]" />
                      Instruct AI Editor
                    </h4>
                    <p className="text-[11px] text-[var(--color-surface-400)] leading-relaxed">
                      Describe the modifications you'd like to make. The AI will refine the underlying layout plan, audit visual guidelines, and update the website.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      placeholder="e.g. 'Add a three-column pricing section with a bold theme', 'Change primary brand color to sky blue', 'Add a simple footer with contact links'"
                      className="w-full h-28 bg-[var(--color-surface-950)] border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-xs text-white placeholder-[var(--color-surface-500)] focus:outline-none focus:border-[var(--color-brand-500)] resize-none"
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      disabled={isIterating || isLoading}
                    />
                    <Button
                      onClick={handleEditWithAI}
                      className="w-full h-9 text-xs font-bold gap-1.5"
                      disabled={isIterating || isLoading || !editPrompt.trim()}
                    >
                      {isIterating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Modifying Website...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Apply Changes
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Progressive Output Stream Log */}
                  {iterationProgress.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-[var(--color-border)] pt-4">
                      <h5 className="text-[10px] uppercase font-extrabold tracking-wider text-[var(--color-surface-450)]">AI Action Stream</h5>
                      <div className="bg-[var(--color-surface-950)] border border-[var(--color-border)] p-3 rounded-md font-mono text-[10px] text-[var(--color-brand-200)] max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin">
                        {iterationProgress.map((prog, idx) => (
                          <div key={idx} className="leading-normal">{prog}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Version History Tab */}
              {activeTab === "history" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">Project Revisions</h5>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] border-[var(--color-border)] text-white hover:text-white" onClick={fetchRevisions} disabled={loadingRevisions}>
                      <RefreshCw className="w-2.5 h-2.5 mr-1" />Reload
                    </Button>
                  </div>

                  {loadingRevisions ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-[var(--color-brand-500)]" />
                    </div>
                  ) : revisions.length > 0 ? (
                    <div className="space-y-3">
                      {revisions.map((rev) => (
                        <div key={rev.id} className="bg-[var(--color-surface-950)]/50 p-3 rounded-lg border border-[var(--color-border)] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-white text-[11px] flex items-center gap-1.5">
                              <GitBranch className="w-3.5 h-3.5 text-[var(--color-brand-500)]" />
                              Revision #{rev.revisionNumber}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 text-[9px] border-[var(--color-border)] text-white hover:text-white bg-[var(--color-surface-900)] px-2.5 py-0.5"
                              onClick={() => handleRestoreRevision(rev.id)}
                              disabled={isLoading}
                            >
                              Restore version
                            </Button>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-[var(--color-surface-400)]">Prompt:</span>
                            <p className="text-[10px] text-[var(--color-surface-200)] mt-0.5 bg-[var(--color-surface-950)] p-2 rounded border border-[var(--color-border)]/50 font-mono italic">
                              "{rev.prompt}"
                            </p>
                          </div>
                          {rev.meta?.planDiff && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-semibold text-[var(--color-surface-400)]">Layout Diff:</span>
                              {renderPlanDiff(rev.meta.planDiff)}
                            </div>
                          )}
                          <div className="text-[9px] text-[var(--color-surface-550)] font-mono flex justify-between">
                            <span>Engine: {rev.meta?.generatorMeta?.model || "gemini-2.5-flash"}</span>
                            <span>{new Date(rev.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[var(--color-muted-fg)] border border-dashed border-[var(--color-border)] rounded-lg">
                      No versions recorded yet. Initial revision will be logged automatically on the first edit.
                    </div>
                  )}
                </div>
              )}

              {/* Timeline Tab */}
              {activeTab === "timeline" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">Lifecycle Timeline</h5>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] border-[var(--color-border)] text-white hover:text-white" onClick={fetchTimeline} disabled={loadingTimeline}>
                      <RefreshCw className="w-2.5 h-2.5 mr-1" />Reload
                    </Button>
                  </div>

                  {loadingTimeline ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-[var(--color-brand-500)]" />
                    </div>
                  ) : timeline.length > 0 ? (
                    <div className="relative border-l border-[var(--color-border)] pl-4 ml-2.5 space-y-5 py-2">
                      {timeline.map((event) => {
                        let badgeColor = "bg-[var(--color-surface-700)]";
                        let title = event.eventType;
                        let desc = "";

                        if (event.eventType === "created") {
                          badgeColor = "bg-emerald-500";
                          title = "Project Created";
                          desc = `Baseline config initialized for ${event.eventMetadata?.name || "website"}`;
                        } else if (event.eventType === "generated") {
                          badgeColor = "bg-sky-500";
                          title = "Website Generated";
                          desc = `First version successfully compiled using ${event.eventMetadata?.model || "AI engine"}`;
                        } else if (event.eventType === "edited") {
                          badgeColor = "bg-amber-500";
                          title = `Revision #${event.eventMetadata?.revisionNumber || ""} Applied`;
                          desc = event.eventMetadata?.prompt ? `"${event.eventMetadata.prompt}"` : "Applied conversational changes";
                        } else if (event.eventType === "published") {
                          badgeColor = "bg-teal-500";
                          title = "Site Published";
                          desc = `Production release deployed to edge servers`;
                        } else if (event.eventType === "exported") {
                          badgeColor = "bg-indigo-500";
                          title = `Source Exported`;
                          desc = `Downloaded project bundle in ${event.eventMetadata?.format?.toUpperCase() || "HTML"} format`;
                        }

                        return (
                          <div key={event.id} className="relative">
                            <span className={`absolute -left-[22.5px] top-1 w-2.5 h-2.5 rounded-full ${badgeColor} border-2 border-[var(--color-surface-900)] ring-4 ring-transparent`} />
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-white text-[11px]">{title}</span>
                                <span className="text-[9px] text-[var(--color-surface-550)] font-mono">{new Date(event.createdAt).toLocaleTimeString()}</span>
                              </div>
                              <p className="text-[10px] text-[var(--color-surface-300)] leading-normal">{desc}</p>
                              {event.eventMetadata?.url && (
                                <a href={event.eventMetadata.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-[9px] text-[var(--color-brand-400)] hover:underline mt-0.5">
                                  Go to live site <ArrowUpRight className="w-2 h-2" />
                                </a>
                              )}
                              <span className="block text-[8px] text-[var(--color-surface-550)] font-mono">{new Date(event.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[var(--color-muted-fg)] border border-dashed border-[var(--color-border)] rounded-lg">
                      No lifecycle events logged for this project.
                    </div>
                  )}
                </div>
              )}

              {/* Prompt Tab */}
              {activeTab === "prompt" && (
                <div className="space-y-4">
                  <div>
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)] mb-1">User Prompt</h5>
                    <p className="bg-[var(--color-surface-950)] p-3 rounded-md border border-[var(--color-border)] text-[var(--color-surface-200)] font-mono leading-relaxed whitespace-pre-wrap">
                      {project.prompt}
                    </p>
                  </div>
                  {project.generatedMeta?.plan && (
                    <div>
                      <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)] mb-1">Visual Theme</h5>
                      <div className="grid grid-cols-2 gap-2 bg-[var(--color-surface-950)] p-3 rounded-md border border-[var(--color-border)]">
                        <div><span className="text-[var(--color-surface-450)]">Layout:</span><span className="ml-1.5 font-bold text-white uppercase">{project.generatedMeta.plan.pageType}</span></div>
                        <div><span className="text-[var(--color-surface-450)]">Style Mood:</span><span className="ml-1.5 font-bold text-white uppercase">{project.generatedMeta.generatorMeta?.promptStyle ?? "standard"}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Plan Tab */}
              {activeTab === "plan" && (
                <div className="space-y-4">
                  {project.generatedMeta?.plan ? (
                    <>
                      <div>
                        <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)] mb-1.5">Page Schema Details</h5>
                        <div className="bg-[var(--color-surface-950)] p-3 rounded-md border border-[var(--color-border)] space-y-3">
                          <div><span className="text-[var(--color-surface-450)] font-semibold">Page Type:</span><span className="ml-1.5 text-white font-bold uppercase">{project.generatedMeta.plan.pageType}</span></div>
                          <div><span className="text-[var(--color-surface-450)] font-semibold">Theme:</span><span className="ml-1.5 text-white font-bold uppercase">{project.generatedMeta.plan.theme}</span></div>
                          <div><span className="text-[var(--color-surface-450)] font-semibold">Layout:</span><span className="ml-1.5 text-white font-bold uppercase">{project.generatedMeta.plan.layout}</span></div>
                          {project.generatedMeta.plan.description && (
                            <div><span className="text-[var(--color-surface-450)] font-semibold">Description:</span><p className="mt-1 text-[var(--color-surface-300)]">{project.generatedMeta.plan.description}</p></div>
                          )}
                          {project.generatedMeta.plan.styleKeywords && (
                            <div>
                              <span className="text-[var(--color-surface-450)] font-semibold">Style Keywords:</span>
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {project.generatedMeta.plan.styleKeywords.map((kw, i) => (
                                  <span key={i} className="bg-[var(--color-surface-800)] px-2 py-0.5 rounded text-[10px] text-[var(--color-surface-200)]">{kw}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)] mb-1.5">Required Page Sections</h5>
                        <div className="space-y-2">
                          {project.generatedMeta.plan.sections.map((sec, i) => (
                            <div key={i} className="bg-[var(--color-surface-950)]/50 p-2.5 rounded border border-[var(--color-border)] flex items-center justify-between">
                              <span className="font-extrabold text-white text-[11px] uppercase tracking-wider">{sec}</span>
                              <span className="text-[9px] text-[var(--color-surface-500)] font-mono">Section #{i + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-[var(--color-muted-fg)]">No AI plan logs recorded for this generation.</div>
                  )}
                </div>
              )}

              {/* HTML Tab */}
              {activeTab === "html" && (
                <div className="space-y-3 h-full flex flex-col min-h-0">
                  <div className="flex items-center justify-between shrink-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">Clean Source Code</span>
                    <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 py-0.5 border-[var(--color-border)] text-white hover:text-white" onClick={handleCopyCode}>
                      {copied ? <><Check className="w-3 h-3 text-emerald-400 mr-1" />Copied</> : <><Code className="w-3 h-3 mr-1" />Copy Code</>}
                    </Button>
                  </div>
                  <pre className="flex-1 overflow-auto bg-[var(--color-surface-950)] p-3.5 rounded-md border border-[var(--color-border)] font-mono text-[10px] text-[var(--color-brand-200)] max-h-[380px] scrollbar-thin">
                    {project.generatedHtml ?? "<!-- No HTML Content Generated -->"}
                  </pre>
                </div>
              )}

              {/* Metadata Tab */}
              {activeTab === "meta" && (
                <div className="space-y-4">
                  <div>
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)] mb-1.5">Compliance & Validation Report</h5>
                    <div className="bg-[var(--color-surface-950)] p-3 rounded-md border border-[var(--color-border)] space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[var(--color-surface-450)] font-semibold">Validator Compliance:</span>
                        {project.generatedMeta?.validation?.valid
                          ? <span className="text-emerald-400 font-bold uppercase">Passed</span>
                          : <span className="text-amber-400 font-bold uppercase">Warning/Repaired</span>}
                      </div>
                      {(project.generatedMeta?.validation?.issues?.length ?? 0) > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-[10px] font-bold text-[var(--color-surface-400)]">Validation Warnings:</p>
                          {project.generatedMeta!.validation!.issues!.map((issue, i) => (
                            <div key={i} className="flex gap-1.5 text-[10px] text-[var(--color-muted-fg)] bg-black/20 p-1.5 rounded">
                              <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                              <span>{issue}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {project.generatedMeta?.generatorMeta && (
                    <div>
                      <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)] mb-1.5">Telemetry & Latency Logs</h5>
                      <div className="grid grid-cols-2 gap-3 bg-[var(--color-surface-950)] p-3 rounded-md border border-[var(--color-border)] font-mono text-[10px]">
                        <div><span className="text-[var(--color-surface-450)]">Duration:</span><span className="ml-1 text-white">{(project.generatedMeta.generatorMeta.durationMs / 1000).toFixed(2)}s</span></div>
                        <div><span className="text-[var(--color-surface-450)]">Markup Length:</span><span className="ml-1 text-white">{project.generatedMeta.generatorMeta.outputLength} chars</span></div>
                        <div className="col-span-2"><span className="text-[var(--color-surface-450)]">Executed:</span><span className="ml-1 text-white">{new Date(project.generatedMeta.generatorMeta.generatedAt).toLocaleString()}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Deploy History Tab */}
              {activeTab === "deployments" && (
                <div className="space-y-4">
                  <div>
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)] mb-1.5">Last Deployment Info</h5>
                    <div className="bg-[var(--color-surface-950)] p-3 rounded-md border border-[var(--color-border)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--color-surface-450)]">Status:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getStatusColor(project.deploymentState)}`}>
                          {project.deploymentState}
                        </span>
                      </div>
                      {project.deploymentTimestamp && (
                        <div className="flex justify-between text-[11px]"><span className="text-[var(--color-surface-450)]">Deployed At:</span> <span className="text-white">{new Date(project.deploymentTimestamp).toLocaleString()}</span></div>
                      )}
                      {project.deployedUrl && (
                        <div className="flex justify-between text-[11px]"><span className="text-[var(--color-surface-450)]">URL:</span> <a href={project.deployedUrl} target="_blank" rel="noreferrer" className="text-[var(--color-brand-400)] hover:underline font-mono">{project.deployedUrl}</a></div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)] mb-1.5">Deployment Runs</h5>
                    {project.deploymentMetadata?.history && project.deploymentMetadata.history.length > 0 ? (
                      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {project.deploymentMetadata.history.map((run: any, idx: number) => (
                          <div key={run.id || idx} className="bg-[var(--color-surface-950)]/50 p-2.5 rounded border border-[var(--color-border)] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-[11px] font-mono">{run.id || "N/A"}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                                run.status === "deployed" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : "text-rose-400 border-rose-500/20 bg-rose-500/10"
                              }`}>{run.status}</span>
                            </div>
                            <div className="text-[10px] text-[var(--color-surface-400)] flex justify-between">
                              <span>Provider: {run.providerName}</span>
                              <span>{new Date(run.timestamp).toLocaleString()}</span>
                            </div>
                            {run.url && (
                              <div className="text-[10px]"><span className="text-[var(--color-surface-450)]">URL:</span> <a href={run.url} target="_blank" rel="noreferrer" className="text-[var(--color-brand-400)] hover:underline font-mono">{run.url}</a></div>
                            )}
                            {run.errorMessage && (
                              <div className="text-[10px] text-rose-400 font-medium">Error: {run.errorMessage}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-[var(--color-muted-fg)] border border-dashed border-[var(--color-border)] rounded-md">No past deployments recorded. Click 'Publish to Production' to deploy.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Live Preview + Deploy/Export */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="flex-1 flex flex-col border-[var(--color-border)] bg-[var(--color-surface-900)] overflow-hidden h-[450px]">
            <CardHeader className="py-2.5 px-4 bg-black/15 flex flex-row items-center justify-between border-b border-[var(--color-border)] shrink-0">
              <CardTitle className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[var(--color-brand-400)]" />
                Live Interactive Sandbox
              </CardTitle>
              {project.deployedUrl && (
                <a href={project.deployedUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[var(--color-brand-400)] hover:underline flex items-center gap-0.5 font-bold">
                  Open Sandbox link <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </CardHeader>
            <div className="flex-1 bg-white">
              {project.generatedHtml ? (
                <iframe title="Website Preview" className="w-full h-full border-0" srcDoc={project.generatedHtml} sandbox="allow-scripts" />
              ) : (
                <div className="h-full flex items-center justify-center bg-[var(--color-surface-950)] text-[var(--color-muted-fg)] text-xs">No HTML generated.</div>
              )}
            </div>
          </Card>

          {/* Deploy + Export */}
          <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-5 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2.5 border-r border-[var(--color-border)]/50 pr-4">
                <h4 className="text-xs font-extrabold text-white">Deploy Site</h4>
                <p className="text-[10px] text-[var(--color-muted-fg)]">Publish your generated website to FastApp edge servers.</p>
                {isDeploying ? (
                  <div className="space-y-1.5 p-2.5 rounded bg-[var(--color-surface-950)] border border-[var(--color-border)] max-h-[100px] overflow-y-auto">
                    {deploySteps.map((step, i) => (
                      <div key={i} className="flex items-center justify-between text-[9px] font-mono text-[var(--color-surface-200)]">
                        <span className="flex items-center gap-1.5">
                          {step.status === "running" && <Loader2 className="w-2.5 h-2.5 animate-spin text-[var(--color-brand-500)]" />}
                          {step.status === "completed" && <span className="text-emerald-400 font-bold">✓</span>}
                          {step.message}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Button onClick={deploy} className="w-full h-8 text-xs font-bold" disabled={isDeploying}>
                    <Play className="w-3.5 h-3.5 mr-1" />Publish to Production
                  </Button>
                )}
                {deployError && <p className="text-[9px] text-rose-400 font-medium">{deployError}</p>}
              </div>

              <div className="space-y-2.5 pl-2">
                <h4 className="text-xs font-extrabold text-white">Export Code</h4>
                <p className="text-[10px] text-[var(--color-muted-fg)]">Download the generated source code for editing.</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 h-8 text-xs border-[var(--color-border)] hover:bg-[var(--color-surface-800)] text-white hover:text-white" onClick={() => window.open(`/api/projects/${project.id}/export?format=html`)}>
                    <Download className="w-3.5 h-3.5 mr-1" />HTML
                  </Button>
                  <Button variant="outline" className="flex-1 h-8 text-xs border-[var(--color-border)] hover:bg-[var(--color-surface-800)] text-white hover:text-white" onClick={() => window.open(`/api/projects/${project.id}/export?format=zip`)}>
                    <Download className="w-3.5 h-3.5 mr-1" />ZIP
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
