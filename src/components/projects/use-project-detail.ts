"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDeployStream } from "@/hooks/use-deploy-stream";
import type { Project } from "@/lib/projects/types";

interface UseProjectDetailProps {
  initialProject: Project;
}

export function useProjectDetail({ initialProject }: UseProjectDetailProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project>(initialProject);
  const [activeTab, setActiveTab] = useState<"prompt" | "plan" | "html" | "meta" | "deployments" | "edit" | "history" | "timeline" >("prompt");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && ["prompt", "plan", "html", "meta", "deployments", "edit", "history", "timeline"].includes(tab)) {
        setActiveTab(tab as any);
      }
    }
  }, []);
  const [copied, setCopied] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(project.name);
  const [isLoading, setIsLoading] = useState(false);

  // AI Edit States
  const [editPrompt, setEditPrompt] = useState("");
  const [isIterating, setIsIterating] = useState(false);
  const [iterationStep, setIterationStep] = useState("");
  const [iterationProgress, setIterationProgress] = useState<string[]>([]);

  // History / Revision States
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState(false);

  // Timeline States
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  const { isDeploying, deploySteps, deployError, deploy } = useDeployStream({
    projectId: project.id,
    onDeployComplete: () => {
      fetch(`/api/projects/${project.id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.project) setProject(d.project);
        });
    },
    onDone: () => {
      fetch(`/api/projects/${project.id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.project) setProject(d.project);
        });
    },
  });

  const handleCopyCode = () => {
    const plan = project.generatedMeta?.plan;
    const textToCopy = plan ? JSON.stringify(plan, null, 2) : (project.generatedHtml || "");
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveRename = async () => {
    if (!renameValue.trim() || renameValue === project.name) {
      setIsRenaming(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameValue.trim() }),
      });
      const data = await res.json();
      if (data.success && data.project) {
        setProject(data.project);
        setIsRenaming(false);
      }
    } catch (err) {
      console.error("Rename failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${project.name}"?`)) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.push("/projects");
        router.refresh();
      } else {
        alert(data.error?.message ?? "Delete failed");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.project) {
        router.push(`/projects/${data.project.id}`);
      } else {
        alert(data.error?.message ?? "Duplicate failed");
      }
    } catch (err) {
      console.error("Duplicate failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRevisions = async () => {
    setLoadingRevisions(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/revisions`);
      const data = await res.json();
      if (data.success) setRevisions(data.revisions);
    } catch (err) {
      console.error("Failed to load revisions:", err);
    } finally {
      setLoadingRevisions(false);
    }
  };

  const fetchTimeline = async () => {
    setLoadingTimeline(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/timeline`);
      const data = await res.json();
      if (data.success) setTimeline(data.timeline);
    } catch (err) {
      console.error("Failed to load timeline events:", err);
    } finally {
      setLoadingTimeline(false);
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === "history") fetchRevisions();
    else if (tab === "timeline") fetchTimeline();
  };

  const handleRestoreRevision = async (revisionId: string) => {
    if (!confirm("Are you sure you want to restore the project to this revision? The current state will be saved as a new version.")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/revisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId }),
      });
      const data = await res.json();
      if (data.success) {
        const pRes = await fetch(`/api/projects/${project.id}`);
        const pData = await pRes.json();
        if (pData.success && pData.project) {
          setProject(pData.project);
          setActiveTab("html");
          alert("Project successfully restored to selected revision!");
        }
      } else {
        alert(data.error?.message || "Failed to restore revision");
      }
    } catch (err) {
      console.error("Restore failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditWithAI = async () => {
    if (!editPrompt.trim()) return;
    setIsIterating(true);
    setIterationStep("planning");
    setIterationProgress(["Initiating website edit pipeline...", "Injected FastApp Design tokens..."]);

    try {
      const response = await fetch(`/api/projects/${project.id}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: editPrompt.trim() }),
      });
      if (!response.ok) throw new Error("Failed to start AI editor");
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream reader available");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith("event: ")) {
            const eventName = line.replace("event: ", "").trim();
            let nextIndex = i + 1;
            while (nextIndex < lines.length && !lines[nextIndex].startsWith("data: ")) nextIndex++;
            if (nextIndex < lines.length) {
              const dataLine = lines[nextIndex];
              const rawData = dataLine.replace("data: ", "").trim();
              try {
                const data = JSON.parse(rawData);
                if (eventName === "planning") {
                  setIterationStep("planning");
                  setIterationProgress((prev) => [...prev, `[Plan Update] ${data.message}`]);
                } else if (eventName === "generating") {
                  setIterationStep("generating");
                  setIterationProgress((prev) => [...prev, "[Generator] Code modification started..."]);
                } else if (eventName === "validating") {
                  setIterationStep("validating");
                  setIterationProgress((prev) => [...prev, `[Validator] Checking styling rules: ${data.message || "Running Quality Evaluation"}`]);
                } else if (eventName === "saving") {
                  setIterationStep("saving");
                  setIterationProgress((prev) => [...prev, "[Saver] Committing revision and timeline logs..."]);
                } else if (eventName === "complete") {
                  setIterationStep("complete");
                  setIterationProgress((prev) => [...prev, "✓ Website updated successfully!"]);
                  setEditPrompt("");
                  const pRes = await fetch(`/api/projects/${project.id}`);
                  const pData = await pRes.json();
                  if (pData.success && pData.project) setProject(pData.project);
                } else if (eventName === "error") {
                  setIterationStep("error");
                  setIterationProgress((prev) => [...prev, `❌ Error: ${data.message}`]);
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (err: any) {
      setIterationStep("error");
      setIterationProgress((prev) => [...prev, `❌ Error: ${err.message || String(err)}`]);
    } finally {
      setIsIterating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
      case "deploying":
      case "building":
      case "queued":
        return "text-sky-400 border-sky-500/20 bg-sky-500/10 animate-pulse";
      case "failed":
        return "text-rose-400 border-rose-500/20 bg-rose-500/10";
      default:
        return "text-amber-400 border-amber-500/20 bg-amber-500/10";
    }
  };

  return {
    project,
    activeTab,
    copied,
    isRenaming,
    renameValue,
    isLoading,
    editPrompt,
    isIterating,
    iterationStep,
    iterationProgress,
    revisions,
    loadingRevisions,
    timeline,
    loadingTimeline,
    isDeploying,
    deploySteps,
    deployError,
    setRenameValue,
    setIsRenaming,
    setEditPrompt,
    deploy,
    handleCopyCode,
    handleSaveRename,
    handleDelete,
    handleDuplicate,
    handleTabChange,
    handleRestoreRevision,
    handleEditWithAI,
    getStatusColor,
    fetchRevisions,
    fetchTimeline,
  };
}
