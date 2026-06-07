"use client";

import { useCallback, useState } from "react";

export interface UsageStats {
  plan?: {
    plan: string;
    userId: string;
    generationsUsed: number;
    generationLimit: number;
  };
  metrics?: {
    totalGenerations: number;
  };
}

export function useUsage() {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);

  const loadUsage = useCallback(async () => {
    setIsLoadingUsage(true);
    try {
      const res = await fetch("/api/usage");
      const data = await res.json();
      if (data.success) setUsageStats(data);
    } catch (err) {
      console.error("Failed to load usage stats:", err);
    } finally {
      setIsLoadingUsage(false);
    }
  }, []);

  return { usageStats, isLoadingUsage, loadUsage };
}
