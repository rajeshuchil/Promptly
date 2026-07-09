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
  FileDown,
  CloudLightning,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import Link from "next/link";

interface PreviewToolbarProps {
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onRefresh: () => void;
  html: string;
  plan?: any;
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
  plan,
  projectId,
  deployedUrl,
  onDeploy,
  isDeploying = false,
}: PreviewToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = plan ? JSON.stringify(plan, null, 2) : html;
      await navigator.clipboard.writeText(textToCopy ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy page specification: ", err);
    }
  };

  const handleFullscreen = () => {
    try {
      const iframe = document.querySelector("iframe[title='FastApp Site Preview']") as HTMLIFrameElement;
      const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
      const renderedHtml = iframeDoc ? iframeDoc.documentElement.outerHTML : html;

      const previewWindow = window.open("", "_blank");
      if (previewWindow) {
        previewWindow.document.write(renderedHtml || "");
        previewWindow.document.close();
      }
    } catch (err) {
      console.error("Failed to open fullscreen: ", err);
    }
  };

  const handleExportZip = async () => {
    if (!projectId) return;
    setExportingZip(true);
    try {
      const iframe = document.querySelector("iframe[title='FastApp Site Preview']") as HTMLIFrameElement;
      const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
      const renderedHtml = iframeDoc ? iframeDoc.documentElement.outerHTML : html;

      const zip = new JSZip();
      zip.file("index.html", renderedHtml || "");
      zip.folder("assets");
      zip.file("README.md", `# FastApp Project Export\n\nGenerated with FastApp.\n\nTo view your project, open index.html in a web browser.\n`);

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `fastapp-project-${projectId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export Project: ", err);
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
          title="Copy Page Spec to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 hidden md:inline">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Copy Page Spec</span>
            </>
          )}
        </Button>

        {/* Project Export Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-[var(--color-surface-200)]"
          onClick={handleExportZip}
          disabled={exportingZip || !projectId}
          title={projectId ? "Download Project Archive" : "Save project first to download Project ZIP"}
        >
          <FileDown className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Export Project</span>
        </Button>

        {/* Edit with AI Button */}
        {projectId && (
          <Link href={`/projects/${projectId}?tab=edit`}>
            <Button
              variant="default"
              size="sm"
              className="h-8 gap-1.5 text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm font-semibold transition-all duration-200"
              title="Edit this page using AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>Edit with AI</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
