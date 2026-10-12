"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Globe, Play, Copy, RefreshCw, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/projects/types";
import { motion } from "framer-motion";

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
    `relative flex-1 py-3 px-4 text-xs font-bold transition-all duration-200 whitespace-nowrap text-center cursor-pointer ${
      active
        ? "text-white bg-[var(--color-surface-950)]/25"
        : "text-[var(--color-surface-400)] hover:text-white"
    }`;

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="text-white hover:text-white border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface-800)] gap-1.5 h-8 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Projects
          </Button>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
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
            <div className="flex border-b border-[var(--color-border)] bg-black/10 shrink-0 overflow-x-auto scrollbar-none relative">
              {[
                { id: "edit", label: "✨ Edit with AI" },
                { id: "history", label: "🕒 Version History" },
                { id: "timeline", label: "📈 Timeline" },
                { id: "prompt", label: "Prompt" },
                { id: "plan", label: "Planner Log" },
                { id: "html", label: project.generatedMeta?.plan ? "Page Spec" : "HTML" },
                { id: "meta", label: "Metadata" },
                { id: "deployments", label: "Deploy History" }
              ].map((tabItem) => {
                const active = activeTab === tabItem.id;
                return (
                  <button
                    key={tabItem.id}
                    onClick={() => handleTabChange(tabItem.id as any)}
                    className={tabCls(active)}
                  >
                    <span className="relative z-10">{tabItem.label}</span>
                    {active && (
                      <motion.div
                        layoutId="projectDetailActiveTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-brand-500)] z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
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
          <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-4 sm:p-5 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2.5 border-b sm:border-b-0 sm:border-r border-[var(--color-border)]/50 pb-4 sm:pb-0 pr-0 sm:pr-4">
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

              <div className="space-y-2.5 pl-0 sm:pl-2">
                <h4 className="text-xs font-extrabold text-white">Export Code</h4>
                <p className="text-[10px] text-[var(--color-muted-fg)]">Download the generated source code for editing.</p>
                <div className="flex">
                  <Button variant="outline" className="w-full h-8 text-xs border-[var(--color-border)] hover:bg-[var(--color-surface-800)] text-white hover:text-white" onClick={() => window.open(`/api/projects/${project.id}/export?format=zip`)}>
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
