"use client";

import React from "react";
import { Code, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeViewerProps {
  generatedHtml: string | null;
  copied: boolean;
  handleCopyCode: () => void;
}

export function CodeViewer({
  generatedHtml,
  copied,
  handleCopyCode,
}: CodeViewerProps) {
  return (
    <div className="space-y-3 h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">Clean Source Code</span>
        <Button
          variant="outline"
          size="sm"
          className="h-6 text-[10px] px-2 py-0.5 border-[var(--color-border)] text-white hover:text-white"
          onClick={handleCopyCode}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400 mr-1" />Copied
            </>
          ) : (
            <>
              <Code className="w-3 h-3 mr-1" />Copy Code
            </>
          )}
        </Button>
      </div>
      <pre className="flex-1 overflow-auto bg-[var(--color-surface-950)] p-3.5 rounded-md border border-[var(--color-border)] font-mono text-[10px] text-[var(--color-brand-200)] max-h-[380px] scrollbar-thin">
        {generatedHtml ?? "<!-- No HTML Content Generated -->"}
      </pre>
    </div>
  );
}
