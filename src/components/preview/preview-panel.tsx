"use client";

import React, { useState, useEffect } from "react";
import { DeviceMode, PreviewStatus, DeployStep } from "./types";
import { PreviewToolbar } from "./preview-toolbar";
import { PreviewFrame } from "./preview-frame";
import { Sparkles, AlertTriangle, Loader2, Database, ShieldAlert, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
  projectId?: string | null;
  generatedHtml?: string | null;
  plan?: any;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  generationState?: PreviewStatus;
  generationMessage?: string;
}

export function PreviewPanel({
  projectId,
  generatedHtml,
  plan: incomingPlan,
  isLoading: initialIsLoading = false,
  error: initialError = null,
  onRefresh,
  generationState,
  generationMessage,
}: PreviewPanelProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [status, setStatus] = useState<PreviewStatus>("idle");
  const [html, setHtml] = useState<string | null>(null);
  const [plan, setPlan] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fetchingProject, setFetchingProject] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Deployment States
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState<DeployStep | null>(null);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);

  // Load project HTML when projectId or refreshTrigger changes
  useEffect(() => {
    if (!projectId) {
      setHtml(null);
      setPlan(null);
      setDeployedUrl(null);
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
          setPlan(data.project.generatedMeta?.plan || null);
          setDeployedUrl(data.project.deployedUrl || null);
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

  // Sync incoming plan
  useEffect(() => {
    if (incomingPlan !== undefined) {
      setPlan(incomingPlan);
    }
  }, [incomingPlan]);

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

  // Deployment action handler
  const handleDeploy = async () => {
    if (!projectId) return;

    setIsDeploying(true);
    setDeployError(null);
    setDeployStep({ name: "routing", status: "running", message: "Initiating deployment process..." });

    try {
      const res = await fetch(`/api/projects/${projectId}/deploy`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`Failed to initialize deploy: HTTP ${res.status}`);
      }

      if (!res.body) {
        throw new Error("No response body from deployment service");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const messages = buffer.split("\n\n");
        buffer = messages.pop() || "";

        for (const msg of messages) {
          if (!msg.trim()) continue;

          const lines = msg.split("\n");
          let event = "";
          let dataText = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              event = line.slice(7).trim();
            } else if (line.startsWith("data: ")) {
              dataText = line.slice(6).trim();
            }
          }

          if (event === "progress" && dataText) {
            const step = JSON.parse(dataText);
            setDeployStep(step);
            if ((step.name === "complete" || step.name === "deployed") && step.url) {
              setDeployedUrl(step.url);
              // Trigger refresh to update dashboard live state badges
              if (onRefresh) onRefresh();
            }
          } else if (event === "error" && dataText) {
            const err = JSON.parse(dataText);
            throw new Error(err.message || "Deployment failed");
          }
        }
      }
    } catch (err: any) {
      setDeployError(err.message || "An unexpected error occurred during deployment");
    } finally {
      setIsDeploying(false);
    }
  };

  const isLiveStreaming = status === "generating" && html;

  return (
    <div
      className="relative flex flex-col h-full w-full rounded-[var(--radius-xl)] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-900)] shadow-lg"
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
              deployedUrl={deployedUrl}
              onDeploy={handleDeploy}
              isDeploying={isDeploying}
            />
            <div className="flex-1 relative min-h-0">
              <PreviewFrame html={html} plan={plan} deviceMode={deviceMode} />
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
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-brand-500/12"
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

      {/* DEPLOYMENT PROCESS OVERLAY */}
      {(isDeploying || deployStep || deployError) && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 select-none animate-fade-in text-center">
          <div className="max-w-md w-full bg-[var(--color-surface-900)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 shadow-2xl space-y-6">
            
            {/* Header */}
            <div>
              <h3 className="text-base font-semibold text-[var(--color-surface-50)]">
                {deployError ? "Deployment Failed" : deployedUrl && !isDeploying ? "Deployment Completed" : "Publishing Website to Cloud"}
              </h3>
              <p className="text-xs text-[var(--color-muted-fg)] mt-1">
                {deployError ? "An error occurred while compiling your site." : "Configuring edge containers and CDN propagation."}
              </p>
            </div>

            {/* Steps Visual List */}
            <div className="space-y-3.5 text-left">
              {[
                { key: "queued", label: "Queued & Initialized", desc: "Setting up build workspace" },
                { key: "building", label: "Asset Bundling & Compiling", desc: "Optimizing static bundle" },
                { key: "deploying", label: "CDN Content Distribution", desc: "Caching assets at the edge" },
              ].map((item, idx) => {
                const stepIdx = ["queued", "building", "deploying", "deployed"].indexOf(deployStep?.name || "");
                const currentIdx = ["queued", "building", "deploying"].indexOf(item.key);
                
                let iconClass = "w-2.5 h-2.5 rounded-full bg-[var(--color-surface-700)]";
                let textClass = "text-[var(--color-surface-400)]";
                
                if (deployError) {
                  if (deployStep?.name === item.key) {
                    iconClass = "w-2.5 h-2.5 rounded-full bg-rose-500";
                    textClass = "text-rose-400";
                  } else if (currentIdx < stepIdx) {
                    iconClass = "w-2.5 h-2.5 rounded-full bg-emerald-500";
                    textClass = "text-[var(--color-surface-200)]";
                  }
                } else if (deployStep?.name === "complete" || deployStep?.name === "deployed") {
                  iconClass = "w-2.5 h-2.5 rounded-full bg-emerald-500";
                  textClass = "text-[var(--color-surface-200)]";
                } else if (deployStep?.name === item.key) {
                  iconClass = "w-2.5 h-2.5 rounded-full bg-[var(--color-brand-400)] animate-ping";
                  textClass = "text-[var(--color-surface-100)] font-medium";
                } else if (currentIdx < stepIdx) {
                  iconClass = "w-2.5 h-2.5 rounded-full bg-emerald-500";
                  textClass = "text-[var(--color-surface-200)]";
                }

                return (
                  <div key={item.key} className="flex items-start gap-3">
                    <div className="mt-1.5 flex items-center justify-center w-2.5 h-2.5 shrink-0">
                      <span className={iconClass} />
                    </div>
                    <div>
                      <p className={`text-xs ${textClass}`}>{item.label}</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)]">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active message / Success link / Error display */}
            <div className="bg-[var(--color-surface-950)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 text-xs">
              {deployError ? (
                <p className="text-rose-400 font-mono text-left break-all">{deployError}</p>
              ) : deployedUrl && !isDeploying ? (
                <div className="space-y-2">
                  <p className="text-emerald-400 font-medium animate-pulse">Your site is now live on the internet!</p>
                  <p className="font-mono text-[11px] text-[var(--color-surface-200)] select-all underline break-all">
                    {deployedUrl}
                  </p>
                </div>
              ) : (
                <p className="text-[var(--color-surface-300)] animate-pulse flex items-center justify-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {deployStep?.message || "Preparing files..."}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5">
              {deployError ? (
                <>
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { setDeployError(null); setDeployStep(null); }}>
                    Dismiss
                  </Button>
                  <Button variant="default" size="sm" className="h-8 text-xs bg-rose-500 hover:bg-rose-600 text-white" onClick={handleDeploy}>
                    Retry
                  </Button>
                </>
              ) : deployedUrl && !isDeploying ? (
                <>
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { setDeployStep(null); }}>
                    Close
                  </Button>
                  <a href={deployedUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="default" size="sm" className="h-8 text-xs bg-emerald-500 hover:bg-emerald-600 text-white">
                      Visit Site
                    </Button>
                  </a>
                </>
              ) : null}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
