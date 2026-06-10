"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Wand2, Play, Code2, ArrowRight, CheckCircle, Terminal } from "lucide-react";
import Text3DFlip from "@/components/ui/text-3d-flip";

export function HeroSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [promptText, setPromptText] = useState("");
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mockLoading, setMockLoading] = useState(false);
  const [mockSuccess, setMockSuccess] = useState(false);

  const prompts = [
    "SaaS dashboard page with real-time analytics and dark mode",
    "Modern portfolio page for a machine learning engineer",
    "Tailwind landing page for a cybersecurity platform",
    "Pricing tier page with features checklist and FAQs",
  ];

  // Typing effect simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = prompts[currentPromptIdx];
    const typingSpeed = isDeleting ? 20 : 60;

    if (!mockLoading && !mockSuccess) {
      if (!isDeleting && promptText === fullText) {
        // Pause before deleting or starting mock generation
        timer = setTimeout(() => {
          if (currentPromptIdx === 0) {
            // Trigger animation sequence for the first prompt
            setMockLoading(true);
          } else {
            setIsDeleting(true);
          }
        }, 2500);
      } else if (isDeleting && promptText === "") {
        setIsDeleting(false);
        setCurrentPromptIdx((prev) => (prev + 1) % prompts.length);
      } else {
        timer = setTimeout(() => {
          setPromptText(
            isDeleting
              ? fullText.substring(0, promptText.length - 1)
              : fullText.substring(0, promptText.length + 1)
          );
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [promptText, isDeleting, currentPromptIdx, mockLoading, mockSuccess]);

  // Loading animation simulation for the first prompt
  useEffect(() => {
    if (mockLoading) {
      const timer = setTimeout(() => {
        setMockLoading(false);
        setMockSuccess(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mockLoading]);

  // Success state reset
  useEffect(() => {
    if (mockSuccess) {
      const timer = setTimeout(() => {
        setMockSuccess(false);
        setPromptText("");
        setIsDeleting(false);
        setCurrentPromptIdx(1); // Go to next prompt
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [mockSuccess]);

  return (
    <section className="relative z-10 px-6 md:px-12 pt-28 pb-20 max-w-7xl mx-auto flex flex-col items-start text-left">
      {/* Sparkle badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded border border-white/10 bg-[#1B1B1B] text-xs font-medium mb-8 text-[#6ee7b7]"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#6ee7b7] animate-pulse" />
        <span>Now Live: Multi-Model Routing via Gemini 2.5 Flash</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.15] max-w-none mb-8 text-white">
        Generate Production-Ready Pages<br />
        <Text3DFlip
          textClassName="text-[#6ee7b7]"
          flipTextClassName="text-white"
        >
          From a Prompt
        </Text3DFlip>
      </h1>

      {/* Value Proposition */}
      <p className="text-sm md:text-base text-neutral-400 max-w-[620px] mb-10 leading-relaxed">
        FastApp is a state-of-the-art AI page design and code generator. Transpile natural language specifications into deployment-ready HTML structures, styling, and sections in real time.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 w-full max-w-lg mb-16">
        <Link
          href={isAuthenticated ? "/build" : "/login"}
          className="group flex items-center justify-center gap-2 px-6 h-12 text-lg font-medium rounded-full bg-[#6ee7b7] text-[#161616] hover:bg-[#52dca6] transition-colors"
        >
          <Wand2 className="w-5 h-5" />
          Start Generating
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
        <a
          href="#pipeline"
          className="group flex items-center justify-center gap-2 px-6 h-12 text-lg font-medium rounded-full border border-white/10 bg-transparent hover:bg-white/5 text-white transition-colors"
        >
          <Play className="w-5 h-5 fill-current text-[#6ee7b7]" />
          View Demo
        </a>
      </div>

      {/* Prompt Input Visual Mockup */}
      <div className="w-full max-w-2xl relative bg-[#1B1B1B] rounded border border-white/10 p-1 shadow-lg mb-16">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#161616] rounded-t">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
            <span className="text-xs text-neutral-400 font-mono ml-2">FastApp Sandbox v1.0.4</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 text-[10px] text-[#6ee7b7] font-mono border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Agent Idle
          </div>
        </div>

        {/* Console Content */}
        <div className="p-6 font-mono text-xs min-h-[220px] flex flex-col justify-between relative bg-[#161616] rounded-b">
          <div>
            <div className="flex items-center gap-2 text-white/60 mb-4">
              <span className="text-[#6ee7b7] font-bold">➜</span>
              <span>Describe the page you want to generate:</span>
            </div>

            {/* Input Line */}
            <div className="flex items-start gap-2 bg-[#1B1B1B] border border-white/5 rounded p-3">
              <Wand2 className="w-4 h-4 text-[#6ee7b7] mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-white relative">
                {promptText}
                <span className="inline-block w-1.5 h-4 ml-0.5 bg-[#6ee7b7] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Running pipeline steps visualization */}
          <div className="mt-6 transition-all duration-300">
            {mockLoading && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-[#6ee7b7]">
                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Planner Orchestration in progress... structuring nodes.</span>
                </div>
                <div className="w-full bg-[#1B1B1B] rounded-full h-1 overflow-hidden">
                  <div className="bg-[#6ee7b7] h-full w-[60%] animate-pulse" />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-neutral-400">
                  <div className="text-white">✓ Parse Prompt</div>
                  <div className="text-[#6ee7b7]">⟳ Generate JSON Blueprint</div>
                  <div>waiting...</div>
                  <div>waiting...</div>
                </div>
              </div>
            )}

            {mockSuccess && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-xs text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Success: Production-ready page generated and deployed to edge sandbox!</span>
                </div>
                <div className="rounded p-4 border border-white/5 bg-[#1B1B1B] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-xs text-white font-semibold">saas-dashboard-mockup-v1</div>
                      <div className="text-[10px] text-white/50">Theme: Dashboard Dark · Type: Dashboard Page</div>
                    </div>
                  </div>
                  <Link href="/login" className="text-xs font-semibold text-[#6ee7b7] hover:underline flex items-center gap-1">
                    Open Workspace <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {!mockLoading && !mockSuccess && (
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-6 border-t border-white/5 pt-4">
                <span>Try suggestion: "{prompts[(currentPromptIdx + 1) % prompts.length].substring(0, 30)}..."</span>
                <span className="hidden sm:inline">Press Enter to dispatch ↵</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats list */}
      <div className="flex flex-wrap items-start justify-start gap-x-16 gap-y-8 mt-4 text-sm text-neutral-400 max-w-4xl border-t border-white/5 pt-12 w-full">
        {[
          { value: "4 AI Providers", label: "Gemini · Claude · GPT · OpenRouter" },
          { value: "9 Page Templates", label: "Dashboard · Landing · Pricing · Billing..." },
          { value: "Complete Pipeline", label: "Plan → Generate → Validate → Preview" },
          { value: "Full Version Control", label: "Track edits and restore versions easily" },
        ].map((s) => (
          <div key={s.label} className="text-left">
            <div className="font-bold text-sm text-white">{s.value}</div>
            <div className="text-[11px] mt-0.5 text-neutral-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
