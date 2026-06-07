"use client";

import React from "react";
import { Clock, Loader2 } from "lucide-react";
import { CardContent } from "@/components/ui/card";

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  isLoading: boolean;
}

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-brand-400)]" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <Clock className="w-8 h-8 text-[var(--color-surface-600)] mb-2" />
        <p className="text-xs font-semibold text-[var(--color-surface-300)]">No activity logged</p>
        <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5">
          Events like generation, deployment will show here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((act) => (
        <div
          key={act.id}
          className="flex gap-2.5 p-2.5 rounded bg-[var(--color-surface-950)]/60 border border-[var(--color-border)] text-[11px]"
        >
          <div className="mt-0.5 text-[var(--color-brand-400)] shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-0.5 flex-1 min-w-0">
            <p className="font-extrabold text-white text-xs leading-tight">{act.title}</p>
            <p className="text-[10px] text-[var(--color-surface-300)] leading-normal">
              {act.description}
            </p>
            <span className="text-[9px] text-[var(--color-surface-500)] block pt-0.5">
              {new Date(act.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
