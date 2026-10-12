"use client";

import React from "react";

export function ArchitectureSection() {
  const steps = [
    {
      title: "Planner-First Abstraction",
      desc: "Before writing any code, the user's prompt is routed to the planning layer. FastApp creates structured layouts, schema boundaries, and dependencies inside a Zod schema blueprint.",
      badge: "Zod Schema"
    },
    {
      title: "SSE Streaming Generator Layer",
      desc: "FastApp feeds the planning blueprint to the code generation engine. Client applications receive live HTML markup streamed token-by-token via Server-Sent Events (SSE).",
      badge: "SSE Stream"
    },
    {
      title: "Validator AST Post-Processor",
      desc: "An AST-based repair engine reviews the raw output. If missing tailwind brackets, unclosed tags, or broken structures are found, the validator corrects them automatically.",
      badge: "AST Parser"
    },
    {
      title: "Repository Storage Pattern",
      desc: "Decouples the database engine (Drizzle/PostgreSQL) from model endpoints. Everything is wrapped under consistent interfaces to allow seamless unit tests and fallbacks.",
      badge: "Clean Architecture"
    }
  ];

  return (
    <section id="architecture" className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 max-w-7xl mx-auto border-t border-white/5 bg-[#161616]">
      <div className="text-center mb-16">
        <span className="text-xs font-semibold tracking-wider text-[#6ee7b7] uppercase">Engineering Overview</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 mb-4 text-white">
          Architected for scale and stability
        </h2>
        <p className="text-sm md:text-base text-neutral-400 max-w-xl mx-auto">
          FastApp follows the Domain-Driven Design (DDD) model, separating compiler concerns from standard user management layers.
        </p>
      </div>

      {/* Main Grid: Code/Architecture Visual Left, Text Details Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Code Visual (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col justify-center min-w-0">
          <div className="bg-[#1B1B1B] rounded border border-white/10 p-4 sm:p-6 md:p-8 font-mono text-[11px] text-white/70 relative overflow-hidden shadow-lg">
            <div className="text-[9px] text-neutral-400 font-sans mb-3 text-right">fastapp-core/src/lib/pipeline.ts</div>
            
            {/* Code lines */}
            <div className="space-y-1 overflow-x-auto scrollbar-thin pb-2">
              <div><span className="text-blue-400">import</span> &#123; <span className="text-purple-400">PlannerService</span>, <span className="text-purple-400">GeneratorService</span> &#125; <span className="text-blue-400">from</span> <span className="text-green-400">"./services"</span>;</div>
              <div><span className="text-blue-400">import</span> &#123; <span className="text-purple-400">ASTValidator</span> &#125; <span className="text-blue-400">from</span> <span className="text-green-400">"./validator"</span>;</div>
              <div className="text-white/20">// -------------------------------------------------------------</div>
              <div><span className="text-blue-400">export async function</span> <span className="text-yellow-400">compilePage</span>(prompt: <span className="text-orange-400">string</span>) &#123;</div>
              <div className="pl-4 text-white/40">// Stage 1: Construct JSON Blueprint</div>
              <div className="pl-4"><span className="text-blue-400">const</span> blueprint = <span className="text-blue-400">await</span> <span className="text-purple-400">PlannerService</span>.<span className="text-yellow-400">createBlueprint</span>(prompt);</div>
              <div className="pl-4"><span className="text-purple-400">PlannerSchema</span>.<span className="text-yellow-400">parse</span>(blueprint);</div>
              <br />
              <div className="pl-4 text-white/40">// Stage 2: SSE Stream HTML Markup & CSS</div>
              <div className="pl-4"><span className="text-blue-400">const</span> codeStream = <span className="text-blue-400">await</span> <span className="text-purple-400">GeneratorService</span>.<span className="text-yellow-400">streamCode</span>(blueprint);</div>
              <br />
              <div className="pl-4 text-white/40">// Stage 3: Self-healing AST Repair Verification</div>
              <div className="pl-4"><span className="text-blue-400">const</span> cleanCode = <span className="text-purple-400">ASTValidator</span>.<span className="text-yellow-400">healHTML</span>(codeStream);</div>
              <br />
              <div className="pl-4 text-white/40">// Stage 4: Instant Preview Registration</div>
              <div className="pl-4"><span className="text-blue-400">return await</span> <span className="text-purple-400">PreviewService</span>.<span className="text-yellow-400">registerPreview</span>(cleanCode);</div>
              <div>&#125;</div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
              <span>TypeScript 5.4</span>
              <span>Clean Architecture Codebase</span>
            </div>
          </div>
        </div>

        {/* Text descriptions (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          {steps.map((step) => (
            <div key={step.title} className="bg-[#1B1B1B] border border-white/10 rounded p-5 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white text-sm">{step.title}</h3>
                <span className="text-[9px] font-mono text-[#6ee7b7] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  {step.badge}
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
