"use client";

import React from "react";
import type { Project } from "@/lib/projects/types";

interface PlanTabProps {
  project: Project;
}

export function PlanTab({ project }: PlanTabProps) {
  return (
    <div className="space-y-4">
      {project.generatedMeta?.plan ? (
        <>
          <div>
            <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)] mb-1.5">Page Schema Details</h5>
            <div className="bg-[var(--color-surface-950)] p-3 rounded-md border border-[var(--color-border)] space-y-3">
              <div>
                <span className="text-[var(--color-surface-450)] font-semibold">Page Type:</span>
                <span className="ml-1.5 text-white font-bold uppercase">{project.generatedMeta.plan.pageType}</span>
              </div>
              <div>
                <span className="text-[var(--color-surface-450)] font-semibold">Theme:</span>
                <span className="ml-1.5 text-white font-bold uppercase">{project.generatedMeta.plan.theme}</span>
              </div>
              <div>
                <span className="text-[var(--color-surface-450)] font-semibold">Layout:</span>
                <span className="ml-1.5 text-white font-bold uppercase">{project.generatedMeta.plan.layout}</span>
              </div>
              {project.generatedMeta.plan.description && (
                <div>
                  <span className="text-[var(--color-surface-450)] font-semibold">Description:</span>
                  <p className="mt-1 text-[var(--color-surface-300)]">{project.generatedMeta.plan.description}</p>
                </div>
              )}
              {project.generatedMeta.plan.styleKeywords && (
                <div>
                  <span className="text-[var(--color-surface-450)] font-semibold">Style Keywords:</span>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {project.generatedMeta.plan.styleKeywords.map((kw, i) => (
                      <span key={i} className="bg-[var(--color-surface-800)] px-2 py-0.5 rounded text-[10px] text-[var(--color-surface-200)]">
                        {kw}
                      </span>
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
                  <span className="text-[9px] text-[var(--color-surface-550)] font-mono">Section #{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-[var(--color-muted-fg)]">No AI plan logs recorded for this generation.</div>
      )}
    </div>
  );
}
