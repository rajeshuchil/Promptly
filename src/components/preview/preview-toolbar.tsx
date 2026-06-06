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
  Download,
  FileDown,
  CloudLightning,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewToolbarProps {
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onRefresh: () => void;
  html: string;
  projectId?: string | null;
  deployedUrl?: string | null;
  onDeploy?: () => void;
  isDeploying?: boolean;
}

export function PreviewToolbar({
  deviceMode,
  onDeviceModeChange,
  onRefresh,
  html,
  projectId,
  deployedUrl,
  onDeploy,
  isDeploying = false,
}: PreviewToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [exportingHtml, setExportingHtml] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);

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

  const handleExportHtml = () => {
    setExportingHtml(true);
    try {
      if (projectId) {
        const a = document.createElement("a");
        a.href = `/api/projects/${projectId}/export?format=html`;
        a.click();
      } else {
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "index.html";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Failed to export HTML: ", err);
    } finally {
      setExportingHtml(false);
    }
  };

  const handleExportZip = () => {
    if (!projectId) return;
    setExportingZip(true);
    try {
      const a = document.createElement("a");
      a.href = `/api/projects/${projectId}/export?format=zip`;
      a.click();
    } catch (err) {
      console.error("Failed to export ZIP: ", err);
    } finally {
      setExportingZip(false);
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

      {/* Live Deployed URL Badge */}
      {deployedUrl && (
        <a
          href={deployedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold hover:bg-emerald-500/20 transition-all"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Website
          <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
        </a>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
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

        {/* HTML Export Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-[var(--color-surface-200)]"
          onClick={handleExportHtml}
          disabled={exportingHtml}
          title="Download Single index.html File"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Export HTML</span>
        </Button>

        {/* ZIP Export Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-[var(--color-surface-200)]"
          onClick={handleExportZip}
          disabled={exportingZip || !projectId}
          title={projectId ? "Download Project ZIP Archive" : "Save project first to download ZIP"}
        >
          <FileDown className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Export ZIP</span>
        </Button>

        {/* Deploy Button */}
        {projectId && onDeploy && (
          <Button
            variant="default"
            size="sm"
            className="h-8 gap-1.5 text-xs bg-[var(--color-brand-500)] hover:bg-[var(--color-brand-600)] text-white shadow-sm font-semibold transition-all duration-200"
            onClick={onDeploy}
            disabled={isDeploying}
            title="Publish site to the web"
          >
            <CloudLightning className="w-3.5 h-3.5" />
            <span>Deploy</span>
          </Button>
        )}
      </div>
    </div>
  );
}
