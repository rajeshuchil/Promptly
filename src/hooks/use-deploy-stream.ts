"use client";

import { useCallback, useState } from "react";
import { useSseStream } from "@/hooks/use-sse-stream";

export interface DeployStep {
  name: string;
  status: "running" | "completed" | "failed";
  message: string;
  url?: string;
}

interface DeployEventData {
  name?: string;
  status?: string;
  message?: string;
  url?: string;
}

interface UseDeployStreamOptions {
  projectId: string;
  onDeployComplete?: (url: string) => void;
}

export function useDeployStream({ projectId, onDeployComplete }: UseDeployStreamOptions) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySteps, setDeploySteps] = useState<DeployStep[]>([]);
  const [deployError, setDeployError] = useState<string | null>(null);

  const handleEvent = useCallback(
    ({ event, data }: { event: string; data: DeployEventData }) => {
      if (event === "progress") {
        const step = data as DeployStep;
        setDeploySteps((prev) => {
          const idx = prev.findIndex((s) => s.name === step.name);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = step;
            return copy;
          }
          return [...prev, step];
        });

        if (step.name === "complete" && step.url) {
          onDeployComplete?.(step.url);
        }
      } else if (event === "error") {
        setDeployError(data.message ?? "Deployment failed");
      }
    },
    [onDeployComplete]
  );

  const { start } = useSseStream<DeployEventData>({
    onEvent: handleEvent,
    onDone: () => setIsDeploying(false),
    onError: (err) => {
      setDeployError(err.message);
      setIsDeploying(false);
    },
  });

  const deploy = useCallback(async () => {
    setIsDeploying(true);
    setDeployError(null);
    setDeploySteps([]);
    await start(`/api/projects/${projectId}/deploy`, { method: "POST" });
  }, [projectId, start]);

  return { isDeploying, deploySteps, deployError, deploy };
}
