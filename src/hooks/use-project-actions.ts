"use client";

import { useCallback, useState } from "react";
import type { Project } from "@/lib/projects/types";

export function useProjectActions(onReload?: () => void) {
  const [actionProjectId, setActionProjectId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingName, setRenamingName] = useState("");

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    setActionProjectId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) onReload?.();
      else alert(data.error?.message ?? "Failed to delete project");
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setActionProjectId(null);
    }
  }, [onReload]);

  const handleDuplicate = useCallback(async (id: string) => {
    setActionProjectId(id);
    try {
      const res = await fetch(`/api/projects/${id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.success) onReload?.();
      else alert(data.error?.message ?? "Failed to duplicate project");
    } catch (err) {
      console.error("Duplicate failed:", err);
    } finally {
      setActionProjectId(null);
    }
  }, [onReload]);

  const handleToggleFavorite = useCallback(
    async (id: string, currentVal: boolean, setProjects: React.Dispatch<React.SetStateAction<Project[]>>) => {
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
    },
    []
  );

  const handleStartRename = useCallback((id: string, currentName: string) => {
    setRenamingId(id);
    setRenamingName(currentName);
  }, []);

  const handleSaveRename = useCallback(
    async (id: string, setProjects: React.Dispatch<React.SetStateAction<Project[]>>) => {
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
    },
    [renamingName]
  );

  return {
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
  };
}
