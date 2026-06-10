"use client";

import { useCallback, useRef, useState } from "react";
import { useSseStream } from "@/hooks/use-sse-stream";
import type { PreviewStatus } from "@/components/preview";

interface GenerationEventData {
  message?: string;
  chunk?: string;
  html?: string;
  plan?: any;
  projectId?: string;
}

interface UseGenerationStreamOptions {
  onComplete: (projectId: string, html: string) => void;
  onError: (message: string) => void;
  onLoadProjects: () => void;
  onLoadUsage: () => void;
}

export function useGenerationStream({
  onComplete,
  onError,
  onLoadProjects,
  onLoadUsage,
}: UseGenerationStreamOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationState, setGenerationState] = useState<PreviewStatus>("idle");
  const [generationMessage, setGenerationMessage] = useState("");
  const [activeHtml, setActiveHtml] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState<any | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleEvent = useCallback(
    ({ event, data }: { event: string; data: GenerationEventData }) => {
      if (event === "planning") {
        setGenerationState("planning");
        setGenerationMessage(data.message ?? "");
        if (data.plan) {
          setActivePlan(data.plan);
        }
      } else if (event === "generating") {
        setGenerationState("generating");
        setGenerationMessage(data.message ?? "");
        if (data.plan) {
          setActivePlan(data.plan);
        }
      } else if (event === "chunk") {
        setGenerationState("generating");
        setActiveHtml((prev) => (prev ?? "") + (data.chunk ?? ""));
      } else if (event === "validating") {
        setGenerationState("validating");
        setGenerationMessage(data.message ?? "");
      } else if (event === "saving") {
        setGenerationState("saving");
        setGenerationMessage(data.message ?? "");
      } else if (event === "complete") {
        setGenerationState("success");
        setActiveHtml(data.html ?? null);
        if (data.plan) {
          setActivePlan(data.plan);
        }
        onComplete(data.projectId ?? "", data.html ?? "");
        onLoadProjects();
        onLoadUsage();
      } else if (event === "warning") {
        setGenerationMessage(data.message ?? "");
        setActiveHtml("");
      } else if (event === "error") {
        setGenerationState("error");
        setGenerationError(data.message ?? "Generation failed");
        onError(data.message ?? "Generation failed");
        onLoadUsage();
      }
    },
    [onComplete, onError, onLoadProjects, onLoadUsage]
  );

  const { start } = useSseStream<GenerationEventData>({
    onEvent: handleEvent,
    onError: (err) => {
      setGenerationState("error");
      setGenerationError(err.message);
      onError(err.message);
      setIsGenerating(false);
      onLoadUsage();
    },
    onDone: () => setIsGenerating(false),
  });

  const generate = useCallback(
    async (prompt: string, style?: string, templateId?: string) => {
      setIsGenerating(true);
      setGenerationError(null);
      setActiveHtml("");
      setActivePlan(null);
      setGenerationState("planning");
      setGenerationMessage("Initiating website plan...");

      await start("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, templateId }),
      });
    },
    [start]
  );

  return {
    isGenerating,
    generationState,
    generationMessage,
    activeHtml,
    activePlan,
    generationError,
    generate,
    setActiveHtml,
    setActivePlan,
    setGenerationState,
    setGenerationError,
  };
}
