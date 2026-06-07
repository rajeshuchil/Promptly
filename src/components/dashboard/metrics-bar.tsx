"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { UsageStats } from "./hooks/use-usage";

interface MetricsBarProps {
  usageStats: UsageStats | null;
  projectCount: number;
  isBillingLoading: boolean;
  onBilling: () => void;
}

export function MetricsBar({
  usageStats,
  projectCount,
  isBillingLoading,
  onBilling,
}: MetricsBarProps) {
  const plan = usageStats?.plan?.plan ?? "Free";
  const generationsUsed = usageStats?.plan?.generationsUsed ?? 0;
  const generationLimit = usageStats?.plan?.generationLimit ?? 10;
  const totalGenerations = usageStats?.metrics?.totalGenerations ?? 0;
  const isPaid = plan === "pro" || plan === "enterprise";
  const usagePct = Math.min((generationsUsed / generationLimit) * 100, 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
      {/* Card 1: Plan Tier */}
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">
            Subscription Plan
          </p>
          <h3 className="text-lg font-extrabold mt-1 text-white capitalize animate-pulse-slow">
            {plan} Plan
          </h3>
        </div>
        <div className="flex flex-col gap-1.5 items-end">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white bg-gradient-to-r from-[oklch(0.60_0.27_270)] to-[oklch(0.53_0.28_310)] select-none">
            Active
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-[9px] px-2 py-0.5 border-[var(--color-border)] hover:bg-[var(--color-surface-800)] text-white hover:text-white"
            onClick={onBilling}
            disabled={isBillingLoading}
          >
            {isBillingLoading ? (
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
            ) : isPaid ? (
              "Manage Billing"
            ) : (
              "Upgrade to Pro"
            )}
          </Button>
        </div>
      </Card>

      {/* Card 2: Total Projects */}
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-4">
        <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">
          Total Projects
        </p>
        <h3 className="text-2xl font-extrabold mt-1 text-white">{projectCount}</h3>
      </Card>

      {/* Card 3: Total AI Generations */}
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-4">
        <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">
          Total AI Generations
        </p>
        <h3 className="text-2xl font-extrabold mt-1 text-white">{totalGenerations}</h3>
      </Card>

      {/* Card 4: Monthly Usage Progress */}
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-900)] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">
            Generations This Month
          </p>
          <span className="text-[10px] font-mono text-[var(--color-brand-400)] font-semibold">
            {generationsUsed} / {generationLimit}
          </span>
        </div>
        <div className="w-full bg-[var(--color-surface-950)] h-1.5 rounded-full mt-2.5 overflow-hidden border border-[var(--color-border)]">
          <div
            className="bg-gradient-to-r from-[oklch(0.60_0.27_270)] to-[oklch(0.53_0.28_310)] h-full transition-all duration-500"
            style={{ width: `${usagePct}%` }}
          />
        </div>
      </Card>
    </div>
  );
}
