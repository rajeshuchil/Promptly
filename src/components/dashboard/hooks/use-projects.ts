"use client";

import { useCallback, useState } from "react";
import type { Project } from "@/lib/projects/types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const loadProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) setProjects(data.projects ?? []);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  const deleteProject = useCallback(
    async (id: string, selectedProjectId: string | null) => {
      if (!confirm("Are you sure you want to delete this project?")) return false;
      try {
        const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setProjects((prev) => prev.filter((p) => p.id !== id));
          return id === selectedProjectId; // true if selected project was deleted
        }
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
      return false;
    },
    []
  );

  const toggleFavorite = useCallback(async (id: string, currentVal: boolean) => {
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
      console.error("Failed to toggle favorite status:", err);
    }
  }, []);

  return { projects, isLoadingProjects, loadProjects, deleteProject, toggleFavorite, setProjects };
}
