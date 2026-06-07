"use client";

import React from "react";
import type { Project } from "@/lib/projects/types";

interface DeploymentHistoryProps {
  project: Project;
  getStatusColor: (status: string) => string;
}

export function DeploymentHistory({
  project,
  getStatusColor,
}: DeploymentHistoryProps) {
  return (
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
  );
}
