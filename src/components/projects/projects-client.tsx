"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ArrowUpDown, 
  SlidersHorizontal, 
  Star, 
  Copy, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Calendar, 
  Cpu, 
  Globe, 
  Loader2, 
  X,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { Project } from "@/lib/projects/types";

export function ProjectsClient() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  // Action/loading states
  const [actionProjectId, setActionProjectId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingName, setRenamingName] = useState("");

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    setActionProjectId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.error?.message || "Failed to delete project");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setActionProjectId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    setActionProjectId(id);
    try {
      const res = await fetch(`/api/projects/${id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.project) {
        // Reload list or append duplicate
        loadProjects();
      } else {
        alert(data.error?.message || "Failed to duplicate project");
      }
    } catch (err) {
      console.error("Duplicate failed:", err);
    } finally {
      setActionProjectId(null);
    }
  };

  const handleToggleFavorite = async (id: string, currentVal: boolean) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !currentVal }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFavorite: !currentVal } : p))
        );
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    }
  };

  const handleStartRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setRenamingName(currentName);
  };

  const handleSaveRename = async (id: string) => {
    if (!renamingName.trim()) return;
    setActionProjectId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renamingName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, name: renamingName.trim() } : p))
        );
        setRenamingId(null);
      }
    } catch (err) {
      console.error("Rename failed:", err);
    } finally {
      setActionProjectId(null);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "deploying":
      case "generating":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20 animate-pulse";
      case "failed":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "generated":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  // Filter & Sort Logic
  const filteredProjects = projects
    .filter((p) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(query) ||
        p.prompt.toLowerCase().includes(query) ||
        (p.aiModel || "").toLowerCase().includes(query);

      // 2. Status Filter
      if (statusFilter === "all") return matchesSearch;
      return matchesSearch && p.deploymentState === statusFilter;
    })
    .sort((a, b) => {
      // Sort logic
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "favorites") {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[var(--color-surface-900)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--color-surface-500)]" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-md bg-[var(--color-surface-950)] border border-[var(--color-border)] text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-500)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-[var(--color-surface-400)] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter & Sort selectors */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto items-center justify-end">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--color-surface-450)]" />
            <select
              className="bg-[var(--color-surface-950)] border border-[var(--color-border)] rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-500)]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="deployed">Deployed</option>
              <option value="deploying">Deploying</option>
              <option value="failed">Failed</option>
              <option value="idle">Idle Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--color-surface-450)]" />
            <select
              className="bg-[var(--color-surface-950)] border border-[var(--color-border)] rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-500)]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest Created</option>
              <option value="oldest">Oldest Created</option>
              <option value="alphabetical">A-Z Name</option>
              <option value="favorites">Favorites First</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 border-[var(--color-border)] hover:bg-[var(--color-surface-800)] text-white hover:text-white gap-1.5"
            onClick={loadProjects}
            disabled={isLoading}
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
            Sync
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand-500)] mb-3" />
          <p className="text-xs text-[var(--color-muted-fg)]">Loading your generated websites...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-8 text-center flex flex-col items-center justify-center">
          <Globe className="w-12 h-12 text-[var(--color-surface-650)] mb-3" />
          <h3 className="text-sm font-bold text-white">No projects found</h3>
          <p className="text-xs text-[var(--color-muted-fg)] mt-1 max-w-sm">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search filters or clear inputs to find existing projects."
              : "You haven't generated any websites yet. Go to the dashboard to begin!"}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Link href="/dashboard" className="mt-4">
              <Button size="sm" className="text-xs">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Generate Website
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isActioning = actionProjectId === project.id;
            const isRenaming = renamingId === project.id;

            return (
              <div
                key={project.id}
                className="relative group rounded-[var(--radius-lg)] border border-[oklch(0.20_0.02_270)] bg-[oklch(0.12_0.02_270/0.4)] backdrop-blur-md hover:bg-[oklch(0.12_0.02_270/0.65)] hover:border-[var(--color-surface-700)] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg animate-fade-in"
              >
                {/* Star Icon (Top Right) */}
                <button
                  onClick={() => handleToggleFavorite(project.id, project.isFavorite)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 border border-white/5 text-white/60 hover:text-amber-400 hover:bg-black/60 transition-all z-10"
                  title={project.isFavorite ? "Remove Favorite" : "Mark as Favorite"}
                >
                  <Star 
                    className={`w-3.5 h-3.5 ${project.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} 
                  />
                </button>

                <div className="p-5 space-y-3 flex-1">
                  {/* Title */}
                  <div className="pr-8">
                    {isRenaming ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          className="bg-[var(--color-surface-950)] border border-[var(--color-brand-500)] rounded px-1.5 py-0.5 text-xs text-white focus:outline-none w-full"
                          value={renamingName}
                          onChange={(e) => setRenamingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveRename(project.id);
                            if (e.key === "Escape") setRenamingId(null);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(project.id)}
                          className="text-xs text-emerald-400 font-bold hover:text-white"
                          disabled={isActioning}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group/title">
                        <h4 className="text-sm font-extrabold text-white truncate max-w-[180px]">
                          {project.name}
                        </h4>
                        <button
                          onClick={() => handleStartRename(project.id, project.name)}
                          className="opacity-0 group-hover/title:opacity-100 p-0.5 rounded text-[var(--color-surface-450)] hover:text-white transition-opacity"
                          title="Rename"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Prompt Preview */}
                  <p className="text-xs text-[var(--color-muted-fg)] line-clamp-3 leading-relaxed min-h-[50px]">
                    {project.prompt}
                  </p>

                  {/* Badges / Meta */}
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {/* Status Badge */}
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${getStatusBadgeColor(project.deploymentState)}`}>
                      {project.deploymentState}
                    </span>

                    {/* AI Model Badge */}
                    {project.aiModel && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border border-white/5 bg-white/5 text-white/70">
                        <Cpu className="w-2.5 h-2.5" />
                        {project.aiModel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-5 py-3 border-t border-[var(--color-border)] bg-black/25 flex items-center justify-between text-[10px] text-[var(--color-surface-450)]">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3 text-[var(--color-surface-500)]" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Actions */}
                    <Link href={`/projects/${project.id}`} title="View detail">
                      <button className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDuplicate(project.id)}
                      disabled={isActioning}
                      className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      title="Duplicate"
                    >
                      {isActioning && actionProjectId === project.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => router.push(`/dashboard?regenerateId=${project.id}`)}
                      className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(project.id, project.name)}
                      disabled={isActioning}
                      className="p-1 rounded text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
