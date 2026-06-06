"use client";

import React, { useState, useEffect } from "react";
import { DeviceMode, PreviewStatus } from "./types";
import { PreviewToolbar } from "./preview-toolbar";
import { PreviewFrame } from "./preview-frame";
import { FolderOpen, Sparkles, AlertTriangle, Loader2 } from "lucide-react";

interface PreviewPanelProps {
  projectId?: string | null;
  generatedHtml?: string | null;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export function PreviewPanel({
  projectId,
  generatedHtml,
  isLoading: initialIsLoading = false,
  error: initialError = null,
  onRefresh,
}: PreviewPanelProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [status, setStatus] = useState<PreviewStatus>("idle");
  const [html, setHtml] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fetchingProject, setFetchingProject] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load project HTML when projectId or refreshTrigger changes
  useEffect(() => {
    if (!projectId) {
      setHtml(null);
      setErrorMsg(null);
      return;
    }

    const fetchProject = async () => {
      setFetchingProject(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const data = await res.json();
        if (data.success && data.project) {
          setHtml(data.project.generatedHtml);
          setStatus("success");
        } else {
          setErrorMsg(data.error?.message || "Failed to load project details");
          setStatus("error");
        }
      } catch (err) {
        setErrorMsg("Failed to fetch project from database");
        setStatus("error");
      } finally {
        setFetchingProject(false);
      }
    };

    fetchProject();
  }, [projectId, refreshTrigger]);

  // Handle direct HTML input (e.g., direct generation results without/before full DB reloading)
  useEffect(() => {
    if (generatedHtml) {
      setHtml(generatedHtml);
      setStatus("success");
      setErrorMsg(null);
    } else if (!projectId) {
      setHtml(null);
    }
  }, [generatedHtml, projectId]);

  // Update status based on loading state props
  useEffect(() => {
    if (initialIsLoading) {
      setStatus("loading");
    } else if (initialError) {
      setErrorMsg(initialError);
      setStatus("error");
    } else if (html) {
      setStatus("success");
    } else if (!fetchingProject) {
      setStatus("idle");
    }
  }, [initialIsLoading, initialError, html, fetchingProject]);

  const handleRefresh = () => {
    if (projectId) {
      setRefreshTrigger((prev) => prev + 1);
    }
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div
      className="flex flex-col h-full w-full rounded-[var(--radius-xl)] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-900)] shadow-lg"
      style={{ minHeight: "450px" }}
    >
      {/* SUCCESS STATE (With frame and toolbar) */}
      {status === "success" && html && (
        <>
          <PreviewToolbar
            deviceMode={deviceMode}
            onDeviceModeChange={setDeviceMode}
            onRefresh={handleRefresh}
            html={html}
          />
          <div className="flex-1 relative min-h-0">
            <PreviewFrame html={html} deviceMode={deviceMode} />
          </div>
        </>
      )}

      {/* LOADING STATE */}
      {status === "loading" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-pulse">
          <Loader2 className="w-12 h-12 text-[var(--color-brand-400)] animate-spin mb-4" />
          <h3 className="text-base font-semibold text-[var(--color-surface-100)] mb-1">
            Rendering your website...
          </h3>
          <p className="text-xs text-[var(--color-muted-fg)] max-w-xs">
            Preparing container and setting up responsive frames.
          </p>
        </div>
      )}

      {/* ERROR STATE */}
      {status === "error" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[var(--color-surface-950)]">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-rose-500/12 text-rose-500 mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[var(--color-surface-100)] mb-1">
            Preview Error
          </h3>
          <p className="text-xs text-rose-400 max-w-md mb-4 font-mono break-all">
            {errorMsg || "An error occurred while loading the preview."}
          </p>
        </div>
      )}

      {/* IDLE / EMPTY STATE */}
      {status === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[var(--color-surface-950)]">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: "oklch(0.60 0.27 270 / 0.12)" }}
          >
            <Sparkles
              className="w-7 h-7"
              style={{ color: "var(--color-brand-400)" }}
            />
          </div>
          <p className="text-[var(--color-surface-200)] font-semibold mb-1">
            Preview Ready
          </p>
          <p className="text-xs text-[var(--color-muted-fg)] max-w-xs">
            Submit a prompt on the left to generate a preview or select a saved project to view.
          </p>
        </div>
      )}
    </div>
  );
}
