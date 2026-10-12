"use client";

import React, { useState, useEffect } from "react";
import { DeviceMode, PreviewStatus, DeployStep } from "./types";
import { PreviewToolbar } from "./preview-toolbar";
import { PreviewFrame } from "./preview-frame";
import { Sparkles, AlertTriangle, Loader2, Database, ShieldAlert, Cpu, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { LandingPageSkeleton, DashboardSkeleton } from "./preview-skeletons";
import { cn } from "@/lib/utils";

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
      const iframe = document.querySelector("iframe[title='FastApp Site Preview']") as HTMLIFrameElement;
      const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
      const renderedHtml = iframeDoc ? iframeDoc.documentElement.outerHTML : html;

      const res = await fetch(`/api/projects/${projectId}/deploy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: renderedHtml }),
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
  
  const getStepStatus = (stepKey: string) => {
    if (status === "success") return "completed";
    
    const order = ["planning", "selecting", "generating", "validating", "saving"];
    const currentIdx = order.indexOf(
      status === "generating" 
        ? (html ? "generating" : "selecting")
        : status
    );
    const stepIdx = order.indexOf(stepKey);

    if (status === "error") {
      if (stepIdx === currentIdx) return "failed";
      if (stepIdx < currentIdx) return "completed";
      return "pending";
    }

    if (stepIdx < currentIdx) return "completed";
    if (stepIdx === currentIdx) return "active";
    return "pending";
  };

  const checklistSteps = [
    { key: "planning", label: "Planning page layout" },
    { key: "selecting", label: "Selecting components" },
    { key: "generating", label: "Generating page sections" },
    { key: "validating", label: "Validating specification" },
    { key: "saving", label: "Compiling and rendering" }
  ];

  // Simple heuristic
  const promptInput = typeof document !== "undefined" ? (document.getElementById("prompt-input") || document.getElementById("build-prompt")) as HTMLTextAreaElement : null;
  const promptText = promptInput?.value || "";
  const isDashboardProject = /dashboard|crm|analytics|admin|app|platform/i.test(promptText || generationMessage || "") || (plan && typeof plan === "object" && (plan.pageType === "dashboard" || plan.designStyle === "dashboard"));

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
              plan={plan}
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
      ) : fetchingProject ? (
        /* RENDER SKELETON WHILE FETCHING AN EXISTING PROJECT */
        <div className="flex-1 flex items-center justify-center bg-[#09090b] p-6">
          <div className="w-full h-full border border-white/5 rounded-xl bg-[#0e0e11] overflow-hidden shadow-2xl">
            {isDashboardProject ? <DashboardSkeleton /> : <LandingPageSkeleton />}
          </div>
        </div>
      ) : (
        /* RENDER PRE-GENERATION OR LOADING STATES */
        <div className="flex-1 flex flex-col lg:flex-row h-full min-h-[450px] bg-[var(--color-surface-950)] divide-y lg:divide-y-0 lg:divide-x divide-white/5">
          {/* Left Panel: Checklist */}
          {status !== "idle" && status !== "error" ? (
            <div className="w-full lg:w-[320px] shrink-0 p-4 sm:p-6 flex flex-col justify-between bg-[var(--color-surface-950)] text-left">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[var(--color-brand-400)] animate-pulse animate-spin-slow" />
                  <h3 className="text-sm font-semibold text-white">AI Assembly Pipeline</h3>
                </div>

                <div className="space-y-4 pt-2">
                  {checklistSteps.map((step, index) => {
                    const stepState = getStepStatus(step.key);
                    return (
                      <motion.div
                        key={step.key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-0.5 shrink-0">
                          {stepState === "completed" && (
                            <motion.div
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            </motion.div>
                          )}
                          {stepState === "active" && (
                            <Loader2 className="w-4 h-4 text-[var(--color-brand-400)] animate-spin" />
                          )}
                          {stepState === "failed" && (
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                          )}
                          {stepState === "pending" && (
                            <Circle className="w-4 h-4 text-neutral-700" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={cn(
                            "text-xs font-medium transition-colors duration-200",
                            stepState === "completed" && "text-neutral-400",
                            stepState === "active" && "text-white font-semibold",
                            stepState === "pending" && "text-neutral-600",
                            stepState === "failed" && "text-rose-400"
                          )}>
                            {step.label}
                          </p>
                          {stepState === "active" && (
                            <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5 animate-pulse truncate">
                              {generationMessage || "Executing tasks..."}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : status === "error" ? (
            <div className="w-full lg:w-[320px] shrink-0 p-4 sm:p-6 flex flex-col justify-between bg-[var(--color-surface-950)] text-left">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-500">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-sm font-semibold">Assembly Failed</h3>
                </div>
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-400 font-mono break-all leading-relaxed">
                  {errorMsg || "An unexpected error occurred during generation."}
                </div>
              </div>
            </div>
          ) : (
            /* IDLE STATE LEFT PANEL */
            <div className="w-full lg:w-[320px] shrink-0 p-4 sm:p-6 flex flex-col justify-center bg-[var(--color-surface-950)] text-left border-b lg:border-b-0 lg:border-r border-white/5">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-brand-500)]/10 text-[var(--color-brand-400)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Preview Workspace</h3>
                  <p className="text-xs text-[var(--color-muted-fg)] mt-1.5 leading-relaxed">
                    Submit a prompt on the left to watch the AI plan, structure, select components, and build your application live.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Right Panel: Skeleton View / Showcase */}
          <div className="flex-1 bg-[#09090b] relative overflow-hidden flex items-center justify-center p-6 min-h-[350px]">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{
                   backgroundImage: "radial-gradient(var(--color-surface-400) 1px, transparent 1px)",
                   backgroundSize: "20px 20px"
                 }}
            />
            {status !== "idle" && status !== "error" ? (
              <div className="w-full h-full max-w-[95%] max-h-[95%] border border-white/5 rounded-xl bg-[#0e0e11] overflow-hidden shadow-2xl transition-all duration-300">
                {isDashboardProject ? <DashboardSkeleton /> : <LandingPageSkeleton />}
              </div>
            ) : (
              /* Simple Mock Layout Preview on Idle */
              <div className="w-full h-full max-w-[95%] max-h-[95%] border border-white/5 rounded-xl bg-[#0e0e11] overflow-hidden opacity-30 shadow-2xl">
                <LandingPageSkeleton />
              </div>
            )}
          </div>
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
