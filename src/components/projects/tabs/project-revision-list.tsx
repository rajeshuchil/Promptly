"use client";

import React from "react";
import { Loader2, RefreshCw, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectRevisionListProps {
  revisions: any[];
  loadingRevisions: boolean;
  fetchRevisions: () => Promise<void>;
  handleRestoreRevision: (revisionId: string) => Promise<void>;
  isLoading: boolean;
}

export function ProjectRevisionList({
  revisions,
  loadingRevisions,
  fetchRevisions,
  handleRestoreRevision,
  isLoading,
}: ProjectRevisionListProps) {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">Project Revisions</h5>
        <Button
          variant="outline"
          size="sm"
          className="h-6 text-[9px] border-[var(--color-border)] text-white hover:text-white"
          onClick={fetchRevisions}
          disabled={loadingRevisions}
        >
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
  );
}
