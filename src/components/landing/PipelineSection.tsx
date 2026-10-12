"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Layers, Code2, ShieldCheck, Globe, Server, Check } from "lucide-react";

export function PipelineSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: Sparkles,
      title: "Prompt",
      tagline: "Natural Language Input",
      desc: "Client input is parsed, structured, and normalized. We extract intent, page structure requests, theme specifications, and framework desires.",
      details: [
        "LLM Router matching to optimal model provider",
        "Prompt safety screening & theme alignment",
        "Tokens & system parameters injection"
      ],
      color: "#6ee7b7",
      bg: "rgba(110, 231, 183, 0.08)",
      border: "rgba(110, 231, 183, 0.15)"
    },
    {
      icon: Layers,
      title: "Planner",
      tagline: "AI Orchestration Layer",
      desc: "FastApp creates an actionable schema, planning component hierarchy, layout designs, and section sequence before writing code.",
      details: [
        "Constructs logical structure nodes in JSON format",
        "Identifies layout dependencies & UI patterns",
        "Zod schema validation on structured planning blueprints"
      ],
      color: "#6ee7b7",
      bg: "rgba(110, 231, 183, 0.08)",
      border: "rgba(110, 231, 183, 0.15)"
    },
    {
      icon: Code2,
      title: "Generator",
      tagline: "SSE Streaming Code Engine",
      desc: "The generation engine translates the design blueprint into production-grade HTML and modular Tailwind styles, streamed in real time via Server-Sent Events.",
      details: [
        "Streams code token-by-token directly to the sandbox",
        "Constructs components under strict tailwind design tokens",
        "Dynamic theme binding and reactive elements mapping"
      ],
      color: "#6ee7b7",
      bg: "rgba(110, 231, 183, 0.08)",
      border: "rgba(110, 231, 183, 0.15)"
    },
    {
      icon: ShieldCheck,
      title: "Validator",
      tagline: "Quality & Repair System",
      desc: "FastApp performs HTML healing, accessibility validation, and structure completeness checks. Invalid configurations are auto-repaired on the fly.",
      details: [
        "Self-healing HTML parser detects unclosed structures",
        "Accessibility checks ensuring compliance (contrast, tags)",
        "Completeness quality scoring against user's prompt intent"
      ],
      color: "#6ee7b7",
      bg: "rgba(110, 231, 183, 0.08)",
      border: "rgba(110, 231, 183, 0.15)"
    },
    {
      icon: Globe,
      title: "Preview",
      tagline: "Instant Rendering & Previews",
      desc: "The page renders live in the sandbox environment immediately. Accessible via public preview URL, with built-in side-by-side editing capabilities.",
      details: [
        "Instant rendering on the sandbox viewer",
        "Complete version history with rollback support",
        "Sandbox workspace enabled for instant interactive updates"
      ],
      color: "#6ee7b7",
      bg: "rgba(110, 231, 183, 0.08)",
      border: "rgba(110, 231, 183, 0.15)"
    }
  ];

  // Auto transition steps for pipeline movement demonstration
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <section id="pipeline" className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 max-w-7xl mx-auto border-t border-white/5 bg-[#161616]">
      <div className="text-center mb-12 sm:mb-16">
        <span className="text-xs font-semibold tracking-wider text-[#6ee7b7] uppercase">Pipeline Architecture</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 mb-4 text-white">
          A production-grade AI compiler pipeline
        </h2>
        <p className="text-sm md:text-base text-neutral-400 max-w-xl mx-auto">
          FastApp orchestrates five distinct engine layers to guarantee perfect structures, gorgeous layouts, and fast loading.
        </p>
      </div>

      {/* Main Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Step Nodes Navigation */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.title}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-4 rounded border transition-all duration-300 flex items-center gap-4 ${
                  isActive
                    ? "bg-white/[0.04] border-white/10 shadow"
                    : "bg-white/[0.01] border-white/5 opacity-60 hover:opacity-100 hover:bg-white/[0.02]"
                }`}
              >
                <div
                  className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 transition-transform duration-300"
                  style={{
                    background: isActive ? step.bg : "rgba(255, 255, 255, 0.05)",
                    border: `1px solid ${isActive ? step.border : "rgba(255, 255, 255, 0.10)"}`,
                  }}
                >
                  <Icon
                    className="w-5 h-5 transition-colors duration-300"
                    style={{ color: isActive ? step.color : "white" }}
                  />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Stage 0{idx + 1}</div>
                  <div className="font-bold text-white text-sm">{step.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Inspector Display Card (Right side) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-[#1B1B1B] rounded border border-white/10 p-5 sm:p-8 flex-1 flex flex-col justify-between relative overflow-hidden">
            <div>
              {/* Card Header */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-6 text-[#6ee7b7]">
                <Server className="w-4 h-4" />
                <span>Engine Stage: {steps[activeStep].title}</span>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                {steps[activeStep].title} — <span className="font-medium text-neutral-400">{steps[activeStep].tagline}</span>
              </h3>

              {/* Description */}
              <p className="text-xs md:text-sm text-neutral-400 leading-relaxed mb-8">
                {steps[activeStep].desc}
              </p>

              {/* Bullet details */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Key Processes</h4>
                {steps[activeStep].details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-white/80">
                    <span 
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-xs mt-0.5"
                      style={{ background: steps[activeStep].bg, color: steps[activeStep].color }}
                    >
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Live Terminal output at footer */}
            <div className="mt-8 sm:mt-12 bg-[#161616] rounded p-3.5 border border-white/5 font-mono text-[11px] text-green-400/80 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2 truncate min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping shrink-0" />
                <span className="truncate">[stage_{steps[activeStep].title.toLowerCase()}] compiling successfully...</span>
              </span>
              <span className="text-neutral-400 text-[9px] shrink-0">100% telemetry healthy</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
