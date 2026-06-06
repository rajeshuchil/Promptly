"use client";

import React, { useState, useEffect } from "react";
import { DeviceMode, PreviewStatus } from "./types";
import { PreviewToolbar } from "./preview-toolbar";
import { PreviewFrame } from "./preview-frame";
import { Sparkles, AlertTriangle, Loader2, Database, ShieldAlert, Cpu } from "lucide-react";

interface PreviewPanelProps {
  projectId?: string | null;
  generatedHtml?: string | null;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  generationState?: PreviewStatus;
  generationMessage?: string;
}

export function PreviewPanel({
  projectId,
  generatedHtml,
  isLoading: initialIsLoading = false,
  error: initialError = null,
  onRefresh,
  generationState,
  generationMessage,
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

  // Handle direct HTML input (e.g. streaming chunks or direct input)
  useEffect(() => {
    if (generatedHtml !== undefined) {
      setHtml(generatedHtml);
      if (generatedHtml && !generationState) {
        setStatus("success");
      }
    }
  }, [generatedHtml, generationState]);

  // Update status based on incoming generationState or other props
  useEffect(() => {
    if (generationState) {
      setStatus(generationState);
    } else if (initialIsLoading) {
      setStatus("generating");
    } else if (initialError) {
      setErrorMsg(initialError);
      setStatus("error");
    } else if (html) {
      setStatus("success");
    } else if (!fetchingProject) {
      setStatus("idle");
    }
  }, [generationState, initialIsLoading, initialError, html, fetchingProject]);

  const handleRefresh = () => {
    if (projectId) {
      setRefreshTrigger((prev) => prev + 1);
    }
    if (onRefresh) {
      onRefresh();
    }
  };

  const isLiveStreaming = status === "generating" && html;

  return (
    <div
      className="flex flex-col h-full w-full rounded-[var(--radius-xl)] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-900)] shadow-lg"
      style={{ minHeight: "450px" }}
    >
      {/* RENDER PROGRESSIVE STREAMING OR COMPLETED HTML */}
      {(status === "success" || isLiveStreaming) && html ? (
        <>
          <div className="relative flex flex-col h-full w-full min-h-0">
            {isLiveStreaming && (
              <div className="bg-[var(--color-brand-500)]/10 text-[var(--color-brand-300)] text-[10px] px-3 py-1 flex items-center justify-between border-b border-[var(--color-border)] select-none">
                <span className="flex items-center gap-1.5 font-medium animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-400)] shrink-0" />
                  Live Preview Stream (generating HTML...)
                </span>
                <span className="font-mono text-[9px] opacity-75">
                  {html.length.toLocaleString()} chars
                </span>
              </div>
            )}
            <PreviewToolbar
              deviceMode={deviceMode}
              onDeviceModeChange={setDeviceMode}
              onRefresh={handleRefresh}
              html={html}
              projectId={projectId}
            />
            <div className="flex-1 relative min-h-0">
              <PreviewFrame html={html} deviceMode={deviceMode} />
            </div>
          </div>
        </>
      ) : (
        /* RENDER PRE-GENERATION OR LOADING STATES */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[var(--color-surface-950)]">
          {/* PLANNING STATE */}
          {status === "planning" && (
            <div className="space-y-4">
              <Cpu className="w-12 h-12 text-[var(--color-brand-400)] animate-spin mx-auto" />
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-surface-100)] mb-1">
                  Planning Layout Strategy
                </h3>
                <p className="text-xs text-[var(--color-muted-fg)] max-w-xs mx-auto">
                  {generationMessage || "Determining components, sections, and color palettes..."}
                </p>
              </div>
            </div>
          )}

          {/* GENERATING CHUNKS (BEFORE HTML STARTS YIELDING) */}
          {status === "generating" && !html && (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 text-[var(--color-brand-400)] animate-spin mx-auto" />
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-surface-100)] mb-1">
                  Starting Generator
                </h3>
                <p className="text-xs text-[var(--color-muted-fg)] max-w-xs mx-auto">
                  {generationMessage || "Spinning up generative engine..."}
                </p>
              </div>
            </div>
          )}

          {/* VALIDATING STATE */}
          {status === "validating" && (
            <div className="space-y-4">
              <ShieldAlert className="w-12 h-12 text-[var(--color-brand-400)] animate-bounce mx-auto" />
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-surface-100)] mb-1">
                  Validating Web markup
                </h3>
                <p className="text-xs text-[var(--color-muted-fg)] max-w-xs mx-auto">
                  {generationMessage || "Running HTML validator and auto-repair services..."}
                </p>
              </div>
            </div>
          )}

          {/* SAVING STATE */}
          {status === "saving" && (
            <div className="space-y-4">
              <Database className="w-12 h-12 text-[var(--color-brand-400)] animate-pulse mx-auto" />
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-surface-100)] mb-1">
                  Persisting Generation
                </h3>
                <p className="text-xs text-[var(--color-muted-fg)] max-w-xs mx-auto">
                  {generationMessage || "Saving successfully validated site to database..."}
                </p>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {status === "error" && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-rose-500/12 text-rose-500 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-surface-100)] mb-1">
                  Generation Failed
                </h3>
                <p className="text-xs text-rose-400 max-w-md mx-auto font-mono break-words">
                  {errorMsg || "An unexpected error occurred during generation."}
                </p>
              </div>
            </div>
          )}

          {/* IDLE / EMPTY STATE */}
          {status === "idle" && (
            <div className="space-y-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "oklch(0.60 0.27 270 / 0.12)" }}
              >
                <Sparkles
                  className="w-7 h-7"
                  style={{ color: "var(--color-brand-400)" }}
                />
              </div>
              <div>
                <p className="text-[var(--color-surface-200)] font-semibold mb-1">
                  Preview Ready
                </p>
                <p className="text-xs text-[var(--color-muted-fg)] max-w-xs mx-auto">
                  Submit a prompt on the left to stream a website generator live, or select a recent project to load.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
