"use client";

import React, { useState } from "react";
import { DeviceMode } from "./types";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  Maximize2,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewToolbarProps {
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onRefresh: () => void;
  html: string;
}

export function PreviewToolbar({
  deviceMode,
  onDeviceModeChange,
  onRefresh,
  html,
}: PreviewToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy HTML: ", err);
    }
  };

  const handleFullscreen = () => {
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(html);
      previewWindow.document.close();
    }
  };

  return (
    <div
      className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] select-none"
      style={{ background: "var(--color-surface-900)" }}
    >
      {/* Device Mode Selectors */}
      <div className="flex items-center gap-1">
        <Button
          variant={deviceMode === "desktop" ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onDeviceModeChange("desktop")}
          title="Desktop Preview"
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button
          variant={deviceMode === "tablet" ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onDeviceModeChange("tablet")}
          title="Tablet Preview"
        >
          <Tablet className="w-4 h-4" />
        </Button>
        <Button
          variant={deviceMode === "mobile" ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onDeviceModeChange("mobile")}
          title="Mobile Preview"
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>

      {/* Frame Status / Title */}
      <div className="hidden sm:block text-xs font-mono text-[var(--color-muted-fg)]">
        {deviceMode === "desktop" && "Desktop View (100% width)"}
        {deviceMode === "tablet" && "Tablet View (768px width)"}
        {deviceMode === "mobile" && "Mobile View (375px width)"}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-[var(--color-surface-200)]"
          onClick={onRefresh}
          title="Refresh Preview"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Refresh</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-[var(--color-surface-200)]"
          onClick={handleFullscreen}
          title="Open in New Window"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Fullscreen</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-[var(--color-surface-200)]"
          onClick={handleCopy}
          title="Copy HTML to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Copy HTML</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
