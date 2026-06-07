"use client";

import React from "react";
import type { Project } from "@/lib/projects/types";

interface PromptTabProps {
  project: Project;
}

export function PromptTab({ project }: PromptTabProps) {
  return (
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
            <div>
              <span className="text-[var(--color-surface-450)]">Layout:</span>
              <span className="ml-1.5 font-bold text-white uppercase">{project.generatedMeta.plan.pageType}</span>
            </div>
            <div>
              <span className="text-[var(--color-surface-450)]">Style Mood:</span>
              <span className="ml-1.5 font-bold text-white uppercase">
                {project.generatedMeta.generatorMeta?.promptStyle ?? "standard"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
