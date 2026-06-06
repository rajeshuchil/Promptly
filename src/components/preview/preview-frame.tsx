"use client";

import React, { useRef } from "react";
import { DeviceMode } from "./types";
import { Monitor, Tablet, Smartphone } from "lucide-react";

interface PreviewFrameProps {
  html: string;
  deviceMode: DeviceMode;
}

export function PreviewFrame({ html, deviceMode }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Width classes matching standard responsive breakpoints
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
      {/* Visual background pattern for contrast */}
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
        {/* Mobile Mock Speaker/Camera bar */}
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
          srcDoc={html}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-0 bg-white"
        />
      </div>
    </div>
  );
}
