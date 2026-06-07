"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import type { Project } from "@/lib/projects/types";

interface MetadataPanelProps {
  project: Project;
}

export function MetadataPanel({ project }: MetadataPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)] mb-1.5">Compliance & Validation Report</h5>
        <div className="bg-[var(--color-surface-950)] p-3 rounded-md border border-[var(--color-border)] space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--color-surface-450)] font-semibold">Validator Compliance:</span>
            {project.generatedMeta?.validation?.valid ? (
              <span className="text-emerald-400 font-bold uppercase">Passed</span>
            ) : (
              <span className="text-amber-400 font-bold uppercase">Warning/Repaired</span>
            )}
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
            <div>
              <span className="text-[var(--color-surface-450)] font-mono">Duration:</span>
              <span className="ml-1 text-white">{(project.generatedMeta.generatorMeta.durationMs / 1000).toFixed(2)}s</span>
            </div>
            <div>
              <span className="text-[var(--color-surface-450)] font-mono">Markup Length:</span>
              <span className="ml-1 text-white">{project.generatedMeta.generatorMeta.outputLength} chars</span>
            </div>
            <div className="col-span-2">
              <span className="text-[var(--color-surface-450)] font-mono">Executed:</span>
              <span className="ml-1 text-white">{new Date(project.generatedMeta.generatorMeta.generatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
