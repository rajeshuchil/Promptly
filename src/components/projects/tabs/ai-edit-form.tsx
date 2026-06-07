"use client";

import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIEditFormProps {
  editPrompt: string;
  setEditPrompt: (val: string) => void;
  isIterating: boolean;
  isLoading: boolean;
  handleEditWithAI: () => Promise<void>;
  iterationProgress: string[];
}

export function AIEditForm({
  editPrompt,
  setEditPrompt,
  isIterating,
  isLoading,
  handleEditWithAI,
  iterationProgress,
}: AIEditFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[var(--color-brand-400)]" />
          Instruct AI Editor
        </h4>
        <p className="text-[11px] text-[var(--color-surface-400)] leading-relaxed">
          Describe the modifications you'd like to make. The AI will refine the underlying layout plan, audit visual guidelines, and update the website.
        </p>
      </div>

      <div className="space-y-3">
        <textarea
          placeholder="e.g. 'Add a three-column pricing section with a bold theme', 'Change primary brand color to sky blue', 'Add a simple footer with contact links'"
          className="w-full h-28 bg-[var(--color-surface-950)] border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-xs text-white placeholder-[var(--color-surface-500)] focus:outline-none focus:border-[var(--color-brand-500)] resize-none"
          value={editPrompt}
          onChange={(e) => setEditPrompt(e.target.value)}
          disabled={isIterating || isLoading}
        />
        <Button
          onClick={handleEditWithAI}
          className="w-full h-9 text-xs font-bold gap-1.5"
          disabled={isIterating || isLoading || !editPrompt.trim()}
        >
          {isIterating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Modifying Website...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Apply Changes
            </>
          )}
        </Button>
      </div>

      {/* Progressive Output Stream Log */}
      {iterationProgress.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-[var(--color-border)] pt-4">
          <h5 className="text-[10px] uppercase font-extrabold tracking-wider text-[var(--color-surface-450)]">AI Action Stream</h5>
          <div className="bg-[var(--color-surface-950)] border border-[var(--color-border)] p-3 rounded-md font-mono text-[10px] text-[var(--color-brand-200)] max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin">
            {iterationProgress.map((prog, idx) => (
              <div key={idx} className="leading-normal">{prog}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
