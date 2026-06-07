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
        className={`group flex items-start justify-between p-3 rounded-[var(--radius-lg)] border cursor-pointer transition-all duration-200 ${
          isSelected
            ? "border-[var(--color-brand-500)] bg-[var(--color-surface-950)]"
            : "border-[var(--color-border)] hover:border-[var(--color-surface-650)] bg-[var(--color-surface-950)]/40 hover:bg-[var(--color-surface-950)]/80"
        }`}
        onClick={() => onSelectProject(project.id)}
      >
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Globe
              className={`w-3.5 h-3.5 shrink-0 ${
                isSelected ? "text-[var(--color-brand-400)]" : "text-[var(--color-surface-400)]"
              }`}
            />
            <h4 className="text-xs font-semibold text-[var(--color-surface-100)] truncate">
              {project.name}
            </h4>
          </div>
          <p className="text-[10px] text-[var(--color-muted-fg)] line-clamp-2 mb-1.5 leading-relaxed">
            {project.prompt}
          </p>
          <div className="flex items-center gap-1 text-[9px] text-[var(--color-surface-500)]">
            <Calendar className="w-2.5 h-2.5" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={(e) => onToggleFavorite(project.id, !!project.isFavorite, e)}
            className={`p-1 rounded transition-colors ${
              project.isFavorite
                ? "text-amber-400"
                : "text-white/50 hover:text-amber-400"
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
              className="p-1 rounded text-white/50 hover:text-white transition-colors"
              title="View details"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </Link>

          <button
            type="button"
            className="p-1 rounded text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
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
    `flex-1 py-2.5 text-xs font-bold border-b-2 transition-all duration-200 ${
      active
        ? "border-[var(--color-brand-500)] text-white bg-[var(--color-surface-950)]/45"
        : "border-transparent text-[var(--color-surface-400)] hover:text-white"
    }`;

  const favoriteProjects = projects.filter((p) => p.isFavorite);

  return (
    <Card className="flex-1 flex flex-col border-[var(--color-border)] bg-[var(--color-surface-900)] min-h-0">
      {/* Tab Header */}
      <div className="flex border-b border-[var(--color-border)] bg-black/10 shrink-0">
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
