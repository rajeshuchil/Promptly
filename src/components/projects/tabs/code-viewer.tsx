"use client";

import React, { useState } from "react";
import { Code, Check, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeViewerProps {
  generatedHtml: string | null;
  plan?: any;
  copied: boolean;
  handleCopyCode: () => void;
}

export function CodeViewer({
  generatedHtml,
  plan,
  copied,
  handleCopyCode,
}: CodeViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isV2 = plan && typeof plan === "object" && Object.keys(plan).length > 0;
  const contentToDisplay = isV2 ? JSON.stringify(plan, null, 2) : (generatedHtml ?? "<!-- No HTML Content Generated -->");
  const titleText = isV2 ? "Page Specification JSON" : "Clean Source Code";
  const buttonText = isV2 ? "Copy Page Spec" : "Copy Code";
  const language = isV2 ? "json" : "html";

  // Override custom styles to fit the theme
  const customStyle = {
    margin: 0,
    background: "var(--color-surface-950)",
    fontSize: "11px",
    lineHeight: "1.6",
    fontFamily: "var(--font-mono)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-border)",
  };

  return (
    <div className="space-y-3 h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-surface-450)]">{titleText}</span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-[10px] px-2 py-0.5 border-[var(--color-border)] text-white hover:text-white"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3 h-3 mr-1" />Collapse
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3 mr-1" />Expand
              </>
            )}
          </Button>
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
                <Code className="w-3 h-3 mr-1" />{buttonText}
              </>
            )}
          </Button>
        </div>
      </div>
      <div 
        className="flex-1 overflow-auto rounded-lg"
        style={{ maxHeight: isExpanded ? "700px" : "380px" }}
      >
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers={true}
          customStyle={customStyle}
          lineNumberStyle={{ color: "var(--color-surface-600)", minWidth: "2.25em" }}
        >
          {contentToDisplay}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
