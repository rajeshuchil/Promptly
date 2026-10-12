"use client";

import React, { useState } from "react";
import { Check, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export function DesignIntelligenceSection() {
  const [qualityScore, setQualityScore] = useState(98);
  const [isScanning, setIsScanning] = useState(false);

  const runScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setQualityScore(82);
    setTimeout(() => {
      setQualityScore(98);
      setIsScanning(false);
    }, 1800);
  };

  const systems = [
    {
      title: "Semantic Blueprinting",
      desc: "Constructs clean HTML5 structures. Utilizes appropriate semantic landmarks (main, header, footer, section) instead of simple nested divs."
    },
    {
      title: "Design Tokens Enforcement",
      desc: "Locks typography, responsive columns, component scaling, and palette rules matching tailwind variables to prevent styling collisions."
    },
    {
      title: "Accessibility Guardrails",
      desc: "Validates contrast guidelines, aria labeling, accessibility standards, and markup hierarchies automatically on every compilation step."
    },
    {
      title: "Self-Healing AST Parser",
      desc: "AST validations check syntax sanity. Invalid structures or layout gaps are detected and auto-repaired in real time."
    }
  ];

  return (
    <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 max-w-7xl mx-auto border-t border-white/5 bg-[#161616]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Left Info Column */}
        <div>
          <span className="text-xs font-semibold tracking-wider text-[#6ee7b7] uppercase">Design Intelligence</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 mb-6 text-white">
            Not just code. Production-ready web assets.
          </h2>
          <p className="text-sm md:text-base text-neutral-400 mb-10 leading-relaxed">
            Generic AI code outputs often suffer from invalid styles, layout gaps, and poor accessibility structure. FastApp embeds strict design system blueprints and a self-healing compiler to validate output.
          </p>

          <div className="space-y-6">
            {systems.map((sys) => (
              <div key={sys.title} className="flex gap-4">
                <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#6ee7b7] flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">{sys.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{sys.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Interactive Telemetry Console */}
        <div className="flex flex-col justify-center">
          <div className="bg-[#1B1B1B] rounded border border-white/10 p-4 sm:p-6 md:p-8 relative overflow-hidden shadow-lg">
            
            {/* Panel Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 mb-6 gap-3">
              <div>
                <h3 className="font-bold text-white text-sm">Validator Analytics Console</h3>
                <p className="text-[10px] text-neutral-400 font-mono">AST.validator.telemetry_layer</p>
              </div>
              <button 
                onClick={runScan}
                disabled={isScanning}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded bg-white/5 border border-white/10 text-[11px] font-semibold text-white hover:bg-white/10 transition active:scale-95 disabled:opacity-50 w-full sm:w-auto"
              >
                <RefreshCw className={`w-3 h-3 ${isScanning ? "animate-spin text-[#6ee7b7]" : ""}`} />
                {isScanning ? "Evaluating Code..." : "Run Quality Scan"}
              </button>
            </div>

            {/* Score Showcase */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
              <div className="p-4 rounded bg-[#161616] border border-white/5 text-center">
                <div className="text-xl md:text-2xl font-bold text-white font-mono">{qualityScore}%</div>
                <div className="text-[9px] text-neutral-400 font-bold uppercase mt-1">Quality Score</div>
              </div>
              <div className="p-4 rounded bg-[#161616] border border-white/5 text-center">
                <div className="text-xl md:text-2xl font-bold text-green-400 font-mono">0</div>
                <div className="text-[9px] text-neutral-400 font-bold uppercase mt-1">HTML Errors</div>
              </div>
              <div className="p-4 rounded bg-[#161616] border border-white/5 text-center">
                <div className="text-xl md:text-2xl font-bold text-white/80 font-mono">100%</div>
                <div className="text-[9px] text-neutral-400 font-bold uppercase mt-1">WCAG Compliance</div>
              </div>
            </div>

            {/* Simulated Live Scan Logs */}
            <div className="space-y-3 font-mono text-[11px]">
              <h4 className="text-[9px] text-white/40 uppercase tracking-widest font-bold font-sans">Validation Checklist</h4>
              
              <div className="flex items-center justify-between p-2.5 rounded bg-[#161616] border border-white/5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-white/80">Tailwind Theme Token Consistency</span>
                </div>
                <span className="text-green-400 font-bold">PASS</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[#161616] border border-white/5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-white/80">Semantic landmarks hierarchy check</span>
                </div>
                <span className="text-green-400 font-bold">PASS</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[#161616] border border-white/5">
                <div className="flex items-center gap-2">
                  {isScanning ? (
                    <span className="w-3 h-3 border-2 border-[#6ee7b7] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  )}
                  <span className="text-white/80">Contrast ratios & accessibility checks</span>
                </div>
                <span className={isScanning ? "text-yellow-400 animate-pulse font-bold" : "text-green-400 font-bold"}>
                  {isScanning ? "SCANNING" : "PASS"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[#161616] border border-white/5">
                <div className="flex items-center gap-2">
                  {isScanning ? (
                    <AlertCircle className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  )}
                  <span className="text-white/80">AST structural repair verification</span>
                </div>
                <span className={isScanning ? "text-yellow-400 font-bold" : "text-green-400 font-bold"}>
                  {isScanning ? "HEALING" : "RESOLVED"}
                </span>
              </div>
            </div>

            {/* Bottom Telemetry Info */}
            <div className="mt-6 border-t border-white/5 pt-4 flex items-center justify-between text-[9px] text-neutral-400">
              <span>Execution: 42ms</span>
              <span>Observed by FastApp Validator Agent</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
