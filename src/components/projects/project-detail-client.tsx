"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Globe, Play, Copy, RefreshCw, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/projects/types";

// Custom hooks & sub-components
import { useProjectDetail } from "./use-project-detail";
import { ProjectHeaderCard } from "./project-header-card";
import { AIEditForm } from "./tabs/ai-edit-form";
import { ProjectRevisionList } from "./tabs/project-revision-list";
import { ProjectTimeline } from "./tabs/project-timeline";
import { PromptTab } from "./tabs/prompt-tab";
import { PlanTab } from "./tabs/plan-tab";
import { CodeViewer } from "./tabs/code-viewer";
import { MetadataPanel } from "./tabs/metadata-panel";
import { DeploymentHistory } from "./tabs/deployment-history";

interface ProjectDetailClientProps {
  initialProject: Project;
}

export function ProjectDetailClient({ initialProject }: ProjectDetailClientProps) {
  const {
    project,
    activeTab,
    copied,
    isRenaming,
    renameValue,
    isLoading,
    editPrompt,
    isIterating,
    iterationProgress,
    revisions,
    loadingRevisions,
    timeline,
    loadingTimeline,
    isDeploying,
    deploySteps,
    deployError,
    setRenameValue,
    setIsRenaming,
    setEditPrompt,
    deploy,
    handleCopyCode,
    handleSaveRename,
    handleDelete,
    handleDuplicate,
    handleTabChange,
    handleRestoreRevision,
    handleEditWithAI,
    getStatusColor,
    fetchRevisions,
    fetchTimeline,
  } = useProjectDetail({ initialProject });

  const tabCls = (active: boolean) =>
    `flex-1 py-3 px-4 text-xs font-bold border-b-2 transition-all duration-200 whitespace-nowrap ${
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
          <Button variant="outline" size="sm" className="h-8 border-[var(--color-border)] hover:bg-[var(--color-surface-800)] text-white hover:text-white text-xs gap-1.5" onClick={() => window.location.assign(`/dashboard?regenerateId=${project.id}`)} disabled={isLoading}>
            <RefreshCw className="w-3.5 h-3.5" />Re-generate
          </Button>
          <Button variant="ghost" size="sm" className="h-8 hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 border border-transparent hover:border-rose-500/30 text-xs gap-1.5" onClick={handleDelete} disabled={isLoading}>
            <Trash2 className="w-3.5 h-3.5" />Delete
          </Button>
        </div>
      </div>

      {/* Header Card */}
      <ProjectHeaderCard
        project={project}
        isRenaming={isRenaming}
        renameValue={renameValue}
        setRenameValue={setRenameValue}
        setIsRenaming={setIsRenaming}
        handleSaveRename={handleSaveRename}
        isLoading={isLoading}
        getStatusColor={getStatusColor}
      />

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
              <button onClick={() => handleTabChange("html")} className={tabCls(activeTab === "html")}>
                {project.generatedMeta?.plan ? "Page Spec" : "HTML"}
              </button>
              <button onClick={() => handleTabChange("meta")} className={tabCls(activeTab === "meta")}>Metadata</button>
              <button onClick={() => handleTabChange("deployments")} className={tabCls(activeTab === "deployments")}>Deploy History</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 text-xs min-h-0 leading-relaxed">
              {activeTab === "edit" && (
                <AIEditForm
                  editPrompt={editPrompt}
                  setEditPrompt={setEditPrompt}
                  isIterating={isIterating}
                  isLoading={isLoading}
                  handleEditWithAI={handleEditWithAI}
                  iterationProgress={iterationProgress}
                />
              )}
              {activeTab === "history" && (
                <ProjectRevisionList
                  revisions={revisions}
                  loadingRevisions={loadingRevisions}
                  fetchRevisions={fetchRevisions}
                  handleRestoreRevision={handleRestoreRevision}
                  isLoading={isLoading}
                />
              )}
              {activeTab === "timeline" && (
                <ProjectTimeline
                  timeline={timeline}
                  loadingTimeline={loadingTimeline}
                  fetchTimeline={fetchTimeline}
                />
              )}
              {activeTab === "prompt" && <PromptTab project={project} />}
              {activeTab === "plan" && <PlanTab project={project} />}
              {activeTab === "html" && (
                <CodeViewer
                  generatedHtml={project.generatedHtml}
                  plan={project.generatedMeta?.plan}
                  copied={copied}
                  handleCopyCode={handleCopyCode}
                />
              )}
              {activeTab === "meta" && <MetadataPanel project={project} />}
              {activeTab === "deployments" && (
                <DeploymentHistory
                  project={project}
                  getStatusColor={getStatusColor}
                />
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
                  Open Sandbox link <ArrowLeft className="w-2.5 h-2.5 rotate-180" />
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
                    <Download className="w-3.5 h-3.5 mr-1" />Project
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
