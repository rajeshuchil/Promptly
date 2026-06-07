"use client";

import React from "react";
import { Loader2, RefreshCw, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectTimelineProps {
  timeline: any[];
  loadingTimeline: boolean;
  fetchTimeline: () => Promise<void>;
}

export function ProjectTimeline({
  timeline,
  loadingTimeline,
  fetchTimeline,
}: ProjectTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">Lifecycle Timeline</h5>
        <Button
          variant="outline"
          size="sm"
          className="h-6 text-[9px] border-[var(--color-border)] text-white hover:text-white"
          onClick={fetchTimeline}
          disabled={loadingTimeline}
        >
          <RefreshCw className="w-2.5 h-2.5 mr-1" />Reload
        </Button>
      </div>

      {loadingTimeline ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-[var(--color-brand-500)]" />
        </div>
      ) : timeline.length > 0 ? (
        <div className="relative border-l border-[var(--color-border)] pl-4 ml-2.5 space-y-5 py-2">
          {timeline.map((event) => {
            let badgeColor = "bg-[var(--color-surface-700)]";
            let title = event.eventType;
            let desc = "";

            if (event.eventType === "created") {
              badgeColor = "bg-emerald-500";
              title = "Project Created";
              desc = `Baseline config initialized for ${event.eventMetadata?.name || "website"}`;
            } else if (event.eventType === "generated") {
              badgeColor = "bg-sky-500";
              title = "Website Generated";
              desc = `First version successfully compiled using ${event.eventMetadata?.model || "AI engine"}`;
            } else if (event.eventType === "edited") {
              badgeColor = "bg-amber-500";
              title = `Revision #${event.eventMetadata?.revisionNumber || ""} Applied`;
              desc = event.eventMetadata?.prompt ? `"${event.eventMetadata.prompt}"` : "Applied conversational changes";
            } else if (event.eventType === "published") {
              badgeColor = "bg-teal-500";
              title = "Site Published";
              desc = `Production release deployed to edge servers`;
            } else if (event.eventType === "exported") {
              badgeColor = "bg-indigo-500";
              title = `Source Exported`;
              desc = `Downloaded project bundle in ${event.eventMetadata?.format?.toUpperCase() || "HTML"} format`;
            }

            return (
              <div key={event.id} className="relative">
                <span className={`absolute -left-[22.5px] top-1 w-2.5 h-2.5 rounded-full ${badgeColor} border-2 border-[var(--color-surface-900)] ring-4 ring-transparent`} />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-[11px]">{title}</span>
                    <span className="text-[9px] text-[var(--color-surface-550)] font-mono">{new Date(event.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[10px] text-[var(--color-surface-300)] leading-normal">{desc}</p>
                  {event.eventMetadata?.url && (
                    <a
                      href={event.eventMetadata.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 text-[9px] text-[var(--color-brand-400)] hover:underline mt-0.5"
                    >
                      Go to live site <ArrowUpRight className="w-2 h-2" />
                    </a>
                  )}
                  <span className="block text-[8px] text-[var(--color-surface-550)] font-mono">{new Date(event.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-[var(--color-muted-fg)] border border-dashed border-[var(--color-border)] rounded-lg">
          No lifecycle events logged for this project.
        </div>
      )}
    </div>
  );
}
