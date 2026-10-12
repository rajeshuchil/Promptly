"use client";

import React from "react";
import { Calendar, Cpu, Globe, Edit, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/projects/types";

interface ProjectHeaderCardProps {
  project: Project;
  isRenaming: boolean;
  renameValue: string;
  setRenameValue: (val: string) => void;
  setIsRenaming: (val: boolean) => void;
  handleSaveRename: () => Promise<void>;
  isLoading: boolean;
  getStatusColor: (status: string) => string;
}

export function ProjectHeaderCard({
  project,
  isRenaming,
  renameValue,
  setRenameValue,
  setIsRenaming,
  handleSaveRename,
  isLoading,
  getStatusColor,
}: ProjectHeaderCardProps) {
  return (
    <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-4 sm:p-5 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1.5 min-w-0 flex-1">
          {isRenaming ? (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                className="bg-[var(--color-surface-950)] border border-[var(--color-brand-500)] rounded px-2.5 py-1 text-sm font-bold text-white focus:outline-none min-w-0 flex-1"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveRename();
                  if (e.key === "Escape") setIsRenaming(false);
                }}
                autoFocus
              />
              <Button size="sm" className="h-8 text-xs shrink-0" onClick={handleSaveRename} disabled={isLoading}>
                Save
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs text-white shrink-0" onClick={() => setIsRenaming(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 group min-w-0">
              <h2 className="text-lg sm:text-xl font-extrabold text-white truncate min-w-0">{project.name}</h2>
              <button
                onClick={() => setIsRenaming(true)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-[var(--color-surface-450)] hover:text-white transition-opacity shrink-0"
                title="Rename project"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs text-[var(--color-surface-400)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--color-surface-500)] shrink-0" />
              Created on {new Date(project.createdAt).toLocaleDateString()}
            </span>
            {project.aiModel && (
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[var(--color-surface-500)] shrink-0" />
                Model: {project.aiModel}
              </span>
            )}
            {project.deployedUrl && (
              <a
                href={project.deployedUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-brand-400)] hover:underline flex items-center gap-0.5"
              >
                <Globe className="w-3.5 h-3.5 text-[var(--color-surface-500)] shrink-0" />
                fastapp.site <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider shrink-0 self-start md:self-auto ${getStatusColor(project.deploymentState)}`}>
          Status: {project.deploymentState}
        </span>
      </div>
    </Card>
  );
}
