"use client";

import React from "react";
import type { Project } from "@/lib/projects/types";

interface PlanTabProps {
  project: Project;
}

export function PlanTab({ project }: PlanTabProps) {
  const plan = project.generatedMeta?.plan;
  const isV2 = plan && Array.isArray(plan.sections) && plan.sections.length > 0 && typeof plan.sections[0] === 'object';

  const description = plan && "description" in plan && typeof plan.description === "string" ? plan.description : null;
  const styleKeywords = plan && "styleKeywords" in plan && Array.isArray(plan.styleKeywords) ? (plan.styleKeywords as string[]) : null;
  const designTokens = plan && "designTokens" in plan ? plan.designTokens : null;

  return (
    <div className="space-y-4">
      {plan ? (
        <>
          <div>
            <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)] mb-1.5">Page Schema Details</h5>
            <div className="bg-[var(--color-surface-950)] p-3 rounded-md border border-[var(--color-border)] space-y-3">
              <div>
                <span className="text-[var(--color-surface-450)] font-semibold">Page Type:</span>
                <span className="ml-1.5 text-white font-bold uppercase">{plan.pageType}</span>
              </div>
              <div>
                <span className="text-[var(--color-surface-450)] font-semibold">Theme:</span>
                <span className="ml-1.5 text-white font-bold uppercase">{plan.theme}</span>
              </div>
              <div>
                <span className="text-[var(--color-surface-450)] font-semibold">Layout:</span>
                <span className="ml-1.5 text-white font-bold uppercase">{plan.layout}</span>
              </div>
              
              {/* V1 properties */}
              {description && (
                <div>
                  <span className="text-[var(--color-surface-450)] font-semibold">Description:</span>
                  <p className="mt-1 text-[var(--color-surface-300)]">{description}</p>
                </div>
              )}
              {styleKeywords && styleKeywords.length > 0 && (
                <div>
                  <span className="text-[var(--color-surface-450)] font-semibold">Style Keywords:</span>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {styleKeywords.map((kw, i) => (
                      <span key={i} className="bg-[var(--color-surface-800)] px-2 py-0.5 rounded text-[10px] text-[var(--color-surface-200)]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* V2 design tokens */}
              {designTokens && (
                <div>
                  <span className="text-[var(--color-surface-450)] font-semibold">Design Tokens:</span>
                  <pre className="mt-1.5 bg-black/40 p-2 rounded text-[10px] font-mono text-[var(--color-surface-300)] overflow-x-auto">
                    {JSON.stringify(designTokens, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
          <div>
            <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)] mb-1.5">Required Page Sections</h5>
            <div className="space-y-2">
              {plan.sections.map((sec: any, i: number) => {
                const isSecObj = typeof sec === 'object' && sec !== null;
                const sectionName = isSecObj ? sec.type : String(sec);
                const sectionVariant = isSecObj ? sec.variant : '';

                return (
                  <div key={i} className="bg-[var(--color-surface-950)]/50 p-2.5 rounded border border-[var(--color-border)] flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-white text-[11px] uppercase tracking-wider">{sectionName}</span>
                      {sectionVariant && (
                        <span className="ml-2 bg-white/5 border border-white/10 text-[9px] text-[var(--color-surface-400)] px-1.5 py-0.5 rounded uppercase font-mono">
                          {sectionVariant}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-[var(--color-surface-550)] font-mono">Section #{i + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-[var(--color-muted-fg)]">No AI plan logs recorded for this generation.</div>
      )}
    </div>
  );
}
