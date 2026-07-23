"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { History, Star, Globe, Calendar, ExternalLink, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ActivityFeed, type ActivityItem } from "./activity-feed";
import type { Project } from "@/lib/projects/types";

type Tab = "recent" | "favorites" | "activity";

interface ProjectSidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
  onToggleFavorite: (id: string, currentVal: boolean, e: React.MouseEvent) => void;
}

export function ProjectSidebar({
  projects,
  selectedProjectId,
  onSelectProject,
  onDeleteProject,
  onToggleFavorite,
}: ProjectSidebarProps) {
  const [tab, setTab] = useState<Tab>("recent");
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);

  const loadActivity = useCallback(async () => {
    setIsLoadingActivity(true);
    try {
      const res = await fetch("/api/activity");
      const data = await res.json();
      if (data.success) setActivities(data.activity ?? []);
    } catch (err) {
      console.error("Failed to load activity:", err);
    } finally {
      setIsLoadingActivity(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "activity") loadActivity();
  }, [tab, loadActivity]);

  const renderProjectRow = (project: Project) => {
    const isSelected = selectedProjectId === project.id;
    return (
      <div
        key={project.id}
        className={`group flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
          isSelected
            ? "border-white/15 bg-[#151515] shadow-md shadow-black/30"
            : "border-white/5 bg-surface-900/30 hover:border-white/10 hover:bg-surface-800/45"
        }`}
        onClick={() => onSelectProject(project.id)}
      >
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Globe
              className={`w-3.5 h-3.5 shrink-0 ${
                isSelected ? "text-violet-400" : "text-neutral-500 group-hover:text-neutral-400 transition-colors"
              }`}
            />
            <h4 className="text-xs font-bold text-white truncate tracking-tight">
              {project.name}
            </h4>
          </div>
          <p className="text-[10px] text-neutral-450 line-clamp-2 mb-2 leading-relaxed">
            {project.prompt}
          </p>
          {project.deploymentState && project.deploymentState !== "idle" && (
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-wider ${
                project.deploymentState === "deployed"
                  ? "text-emerald-400 border-emerald-500/10 bg-emerald-500/10"
                  : project.deploymentState === "failed"
                  ? "text-rose-400 border-rose-500/10 bg-rose-500/10"
                  : "text-sky-400 border-sky-500/10 bg-sky-500/10 animate-pulse"
              }`}>
                {project.deploymentState}
              </span>
              {project.deployedUrl && (
                <a
                  href={project.deployedUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[8px] text-violet-400 hover:text-violet-300 hover:underline flex items-center gap-0.5 font-bold transition-colors animate-fade-in"
                >
                  Visit <ExternalLink className="w-2 h-2" />
                </a>
              )}
            </div>
          )}
          <div className="flex items-center gap-1 text-[9px] text-neutral-600 group-hover:text-neutral-500 transition-colors">
            <Calendar className="w-2.5 h-2.5" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={(e) => onToggleFavorite(project.id, !!project.isFavorite, e)}
            className={`p-1 rounded transition-colors cursor-pointer ${
              project.isFavorite
                ? "text-amber-400"
                : "text-white/30 hover:text-amber-400"
            }`}
            title={project.isFavorite ? "Remove favorite" : "Mark as favorite"}
          >
            <Star
              className={`w-3.5 h-3.5 ${project.isFavorite ? "fill-amber-400 text-amber-400" : ""}`}
            />
          </button>

          <Link href={`/projects/${project.id}`} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="p-1 rounded text-white/30 hover:text-white transition-colors cursor-pointer"
              title="View details"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </Link>

          <button
            type="button"
            className="p-1 rounded text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            onClick={(e) => onDeleteProject(project.id, e)}
            title="Delete project"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  const tabClass = (active: boolean) =>
    `flex-1 py-2.5 text-xs font-bold border-b-2 transition-all duration-200 cursor-pointer ${
      active
        ? "border-violet-500 text-white bg-surface-950/20"
        : "border-transparent text-neutral-400 hover:text-white"
    }`;

  const favoriteProjects = projects.filter((p) => p.isFavorite);

  return (
    <Card className="flex-1 flex flex-col border-white/5 bg-surface-900/40 backdrop-blur-md min-h-0 rounded-2xl overflow-hidden shadow-lg shadow-black/40">
      {/* Tab Header */}
      <div className="flex border-b border-white/5 bg-black/10 shrink-0">
        <button type="button" onClick={() => setTab("recent")} className={tabClass(tab === "recent")}>
          Recent
        </button>
        <button type="button" onClick={() => setTab("favorites")} className={tabClass(tab === "favorites")}>
          Favorites
        </button>
        <button type="button" onClick={() => setTab("activity")} className={tabClass(tab === "activity")}>
          Activity Feed
        </button>
      </div>

      <CardContent className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        {/* Recent Tab */}
        {tab === "recent" &&
          (projects.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <History className="w-8 h-8 text-[var(--color-surface-600)] mb-2" />
              <p className="text-xs font-semibold text-[var(--color-surface-300)]">No projects yet</p>
              <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5 max-w-[180px]">
                Your generated websites will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">{projects.map(renderProjectRow)}</div>
          ))}

        {/* Favorites Tab */}
        {tab === "favorites" &&
          (favoriteProjects.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <Star className="w-8 h-8 text-amber-500/40 mb-2" />
              <p className="text-xs font-semibold text-[var(--color-surface-300)]">No starred websites</p>
              <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5 max-w-[180px]">
                Favorite your key projects to access them quickly here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">{favoriteProjects.map(renderProjectRow)}</div>
          ))}

        {/* Activity Tab */}
        {tab === "activity" && (
          <ActivityFeed activities={activities} isLoading={isLoadingActivity} />
        )}
      </CardContent>
    </Card>
  );
}
