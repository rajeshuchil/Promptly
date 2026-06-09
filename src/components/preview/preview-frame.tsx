"use client";

import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { DeviceMode } from "./types";
import { PageRenderer } from "../builder/PageRenderer";

interface PreviewFrameProps {
  html: string;
  plan?: any;
  deviceMode: DeviceMode;
}

export function PreviewFrame({ html, plan, deviceMode }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  const isV2 = plan && Array.isArray(plan.sections) && plan.sections.length > 0 && typeof plan.sections[0] === 'object';

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    if (!isV2) {
      // Legacy HTML path
      setMountNode(null);
      doc.open();
      doc.write(html || "<!DOCTYPE html><html><head></head><body style='background:#0a0b0d;'></body></html>");
      doc.close();
    } else {
      // V2 PageSpec path: Initialize iframe content with target container and styles
      doc.open();
      doc.write(`<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FastApp Preview</title>
</head>
<body class="bg-slate-950 text-slate-50 min-h-screen">
  <div id="preview-root"></div>
</body>
</html>`);
      doc.close();

      // Copy host styles into iframe head to enable Tailwind
      const head = doc.head;
      document.querySelectorAll('link[rel="stylesheet"], style').forEach((styleNode) => {
        head.appendChild(styleNode.cloneNode(true));
      });

      const root = doc.getElementById("preview-root");
      setMountNode(root);
    }
  }, [html, plan, isV2]);

  // Frame styles matching standard responsive breakpoints
  const frameStyles = {
    desktop: {
      width: "100%",
      maxWidth: "100%",
      height: "100%",
      borderRadius: "0px",
    },
    tablet: {
      width: "768px",
      maxWidth: "100%",
      height: "calc(100% - 20px)",
      borderRadius: "16px",
      border: "12px solid var(--color-surface-800)",
      boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.5)",
    },
    mobile: {
      width: "375px",
      maxWidth: "100%",
      height: "calc(100% - 40px)",
      borderRadius: "32px",
      border: "12px solid var(--color-surface-800)",
      boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.5)",
    },
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[var(--color-surface-950)] overflow-auto p-4 md:p-6 select-none">
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(var(--color-surface-400) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      <div
        className="transition-all duration-300 ease-in-out flex flex-col items-center justify-center overflow-hidden"
        style={frameStyles[deviceMode]}
      >
        {deviceMode === "mobile" && (
          <div className="w-full bg-[var(--color-surface-800)] flex items-center justify-center pb-2 pt-1">
            <div className="w-16 h-3 bg-[var(--color-surface-900)] rounded-full flex items-center justify-center gap-1.5 px-2">
              <div className="w-1.5 h-1.5 bg-[var(--color-surface-600)] rounded-full shrink-0" />
              <div className="w-6 h-1 bg-[var(--color-surface-700)] rounded-full shrink-0" />
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          title="FastApp Site Preview"
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-0 bg-transparent"
        />

        {/* Render React component portal inside iframe body */}
        {isV2 && mountNode && ReactDOM.createPortal(
          <PageRenderer spec={plan} />,
          mountNode
        )}
      </div>
    </div>
  );
}
