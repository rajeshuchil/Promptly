"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, ArrowUpDown, SlidersHorizontal, Star, Copy, Edit,
  Trash2, Eye, RefreshCw, Calendar, Cpu, Globe, Loader2, X, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Project } from "@/lib/projects/types";
import { useProjectActions } from "@/hooks/use-project-actions";

export function ProjectsClient() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) setProjects(data.projects ?? []);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const {
    actionProjectId,
    renamingId,
    renamingName,
    setRenamingName,
    setRenamingId,
    handleDelete,
    handleDuplicate,
    handleToggleFavorite,
    handleStartRename,
    handleSaveRename,
  } = useProjectActions(loadProjects);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "deployed": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "deploying":
      case "generating": return "bg-sky-500/10 text-sky-400 border-sky-500/20 animate-pulse";
      case "failed": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "generated": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      default: return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const filteredProjects = projects
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q) ||
        (p.aiModel ?? "").toLowerCase().includes(q);
      return statusFilter === "all" ? matches : matches && p.deploymentState === statusFilter;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
      if (sortBy === "favorites") {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111111]/80 backdrop-blur-sm p-4 rounded-xl border border-white/[0.08] shadow-sm">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full h-8 pl-8 pr-8 text-xs rounded-lg bg-[#151515] border border-white/[0.08] text-neutral-100 placeholder-neutral-500 transition-colors duration-150 hover:bg-[#1a1a1a] hover:border-white/15 focus:outline-none focus:ring-0 focus:border-white/25"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto items-center justify-end">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <select className="h-8 px-3 text-xs rounded-lg bg-[#151515] border border-white/[0.08] text-neutral-200 transition-colors duration-150 hover:bg-[#1a1a1a] hover:border-white/15 focus:outline-none focus:ring-0 focus:border-white/25 cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all" className="bg-[#151515] text-neutral-200">All Statuses</option>
              <option value="deployed" className="bg-[#151515] text-neutral-200">Deployed</option>
              <option value="deploying" className="bg-[#151515] text-neutral-200">Deploying</option>
              <option value="failed" className="bg-[#151515] text-neutral-200">Failed</option>
              <option value="idle" className="bg-[#151515] text-neutral-200">Idle Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <select className="h-8 px-3 text-xs rounded-lg bg-[#151515] border border-white/[0.08] text-neutral-200 transition-colors duration-150 hover:bg-[#1a1a1a] hover:border-white/15 focus:outline-none focus:ring-0 focus:border-white/25 cursor-pointer" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest" className="bg-[#151515] text-neutral-200">Newest Created</option>
              <option value="oldest" className="bg-[#151515] text-neutral-200">Oldest Created</option>
              <option value="alphabetical" className="bg-[#151515] text-neutral-200">A-Z Name</option>
              <option value="favorites" className="bg-[#151515] text-neutral-200">Favorites First</option>
            </select>
          </div>

          <button
            type="button"
            onClick={loadProjects}
            disabled={isLoading}
            className="h-8 px-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg bg-[#151515] border border-white/[0.08] text-neutral-200 hover:text-white hover:bg-[#1a1a1a] hover:border-white/15 focus:outline-none focus:ring-0 focus:border-white/25 active:bg-[#111] disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150 cursor-pointer select-none"
          >
            <RefreshCw className={`w-3 h-3 text-neutral-400 ${isLoading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand-500)] mb-3" />
          <p className="text-xs text-[var(--color-muted-fg)]">Loading your generated websites...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="border border-white/5 bg-[#111111]/60 backdrop-blur-md rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-elevation-1 my-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--color-brand-500)]/10 text-[var(--color-brand-400)] mb-4 border border-[var(--color-brand-500)]/20 animate-pulse">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No Projects Found</h3>
          <p className="text-xs text-[var(--color-muted-fg)] mt-2 max-w-xs leading-relaxed">
            {searchQuery || statusFilter !== "all"
              ? "No websites match your active search terms or filter selection. Try resetting them."
              : "Create your first web app with FastApp. Enter a description and watch the compiler build it."}
          </p>
          {searchQuery || statusFilter !== "all" ? (
            <Button
              variant="outline"
              size="sm"
              className="mt-5 h-8 text-xs border-white/10 hover:bg-white/5 text-white"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Reset Filters
            </Button>
          ) : (
            <Link href="/dashboard" className="mt-5">
              <Button size="sm" className="h-8 text-xs bg-[#6ee7b7] text-[#161616] font-bold hover:bg-[#52dca6] gap-1.5 shadow-elevation-1">
                <Sparkles className="w-3.5 h-3.5" />
                Generate Website
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isActioning = actionProjectId === project.id;
            const isRenaming = renamingId === project.id;

            return (
              <div
                key={project.id}
                className="relative group rounded-[var(--radius-lg)] border border-surface-500/30 bg-surface-800/40 backdrop-blur-md hover:bg-surface-800/65 hover:border-brand-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg animate-fade-in"
              >
                <button
                  onClick={() => handleToggleFavorite(project.id, project.isFavorite, setProjects)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 border border-white/5 text-white/60 hover:text-amber-400 hover:bg-black/60 transition-all z-10"
                  title={project.isFavorite ? "Remove Favorite" : "Mark as Favorite"}
                >
                  <Star className={`w-3.5 h-3.5 ${project.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
                </button>

                <div className="p-5 space-y-3 flex-1">
                  <div className="pr-8">
                    {isRenaming ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          className="bg-[#151515] border border-white/20 focus:border-white/40 focus:ring-0 rounded px-2 py-0.5 text-xs text-white focus:outline-none w-full transition-colors"
                          value={renamingName}
                          onChange={(e) => setRenamingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveRename(project.id, setProjects);
                            if (e.key === "Escape") setRenamingId(null);
                          }}
                          autoFocus
                        />
                        <button onClick={() => handleSaveRename(project.id, setProjects)} className="text-xs text-emerald-400 font-bold hover:text-white" disabled={isActioning}>
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group/title">
                        <h4 className="text-sm font-extrabold text-white truncate max-w-[180px]">{project.name}</h4>
                        <button onClick={() => handleStartRename(project.id, project.name)} className="opacity-0 group-hover/title:opacity-100 p-0.5 rounded text-[var(--color-surface-450)] hover:text-white transition-opacity" title="Rename">
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-[var(--color-muted-fg)] line-clamp-3 leading-relaxed min-h-[50px]">{project.prompt}</p>

                  <div className="flex flex-wrap gap-2 pt-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${getStatusBadgeColor(project.deploymentState)}`}>
                      {project.deploymentState}
                    </span>
                    {project.aiModel && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border border-white/5 bg-white/5 text-white/70">
                        <Cpu className="w-2.5 h-2.5" />{project.aiModel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-[var(--color-border)] bg-black/25 flex items-center justify-between text-[10px] text-[var(--color-surface-450)]">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3 text-[var(--color-surface-500)]" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link href={`/projects/${project.id}`} title="View detail">
                      <button className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    </Link>
                    <button onClick={() => handleDuplicate(project.id)} disabled={isActioning} className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors" title="Duplicate">
                      {isActioning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => router.push(`/dashboard?regenerateId=${project.id}`)} className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors" title="Regenerate">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(project.id, project.name)} disabled={isActioning} className="p-1 rounded text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Delete">
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
