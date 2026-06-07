"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Download, Globe, Cpu, Calendar, Sparkles, Code,
  BookOpen, Settings, Play, Copy, Check, Trash2, Edit, Loader2,
  AlertTriangle, RefreshCw, ExternalLink,
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
  const [activeTab, setActiveTab] = useState<"prompt" | "plan" | "html" | "meta" | "deployments">("prompt");
  const [copied, setCopied] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(project.name);
  const [isLoading, setIsLoading] = useState(false);

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
    `flex-1 py-3 text-xs font-bold border-b-2 transition-all duration-200 ${
      active
        ? "border-[var(--color-brand-500)] text-white bg-[var(--color-surface-950)]/45"
        : "border-transparent text-[var(--color-surface-400)] hover:text-white"
    }`;

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left: Tabbed Details */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="flex-1 flex flex-col border-[var(--color-border)] bg-[var(--color-surface-900)] min-h-0 overflow-hidden">
            <div className="flex border-b border-[var(--color-border)] bg-black/10 shrink-0 overflow-x-auto scrollbar-none">
              <button onClick={() => setActiveTab("prompt")} className={tabCls(activeTab === "prompt")}>Prompt</button>
              <button onClick={() => setActiveTab("plan")} className={tabCls(activeTab === "plan")}>Planner Log</button>
              <button onClick={() => setActiveTab("html")} className={tabCls(activeTab === "html")}>HTML</button>
              <button onClick={() => setActiveTab("meta")} className={tabCls(activeTab === "meta")}>Metadata</button>
              <button onClick={() => setActiveTab("deployments")} className={tabCls(activeTab === "deployments")}>Deploy History</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 text-xs min-h-0 leading-relaxed">
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
          <Card className="flex-1 flex flex-col border-[var(--color-border)] bg-[var(--color-surface-900)] overflow-hidden h-[400px]">
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
