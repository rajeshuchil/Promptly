"use client";

import React from "react";
import { Brain, Cpu, Zap, GitBranch, History, Globe, Layout, FolderKanban } from "lucide-react";

export function BentoSection() {
  return (
    <section id="features" className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 max-w-7xl mx-auto border-t border-white/5 bg-[#161616]">
      <div className="text-center mb-12 sm:mb-16">
        <span className="text-xs font-semibold tracking-wider text-[#6ee7b7] uppercase">Capabilities</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 mb-4 text-white">
          Engineered for developer productivity
        </h2>
        <p className="text-sm md:text-base text-neutral-400 max-w-xl mx-auto">
          FastApp packages robust full-stack developer features into a seamless AI workflow. No compromise on quality or control.
        </p>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto lg:auto-rows-[240px]">
        
        {/* Card 1: AI Planning Engine (Large Box - 2 Cols, 2 Rows on large screens) */}
        <div className="lg:col-span-2 lg:row-span-2 bg-[#1B1B1B] border border-white/10 rounded p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded flex items-center justify-center bg-white/5 border border-white/10">
              <Brain className="w-5 h-5 text-[#6ee7b7]" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#6ee7b7] bg-white/5 px-2 py-0.5 rounded border border-white/10">
              Core Engine
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-2">AI Planning Engine</h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              FastApp constructs a layout blueprint first. This JSON representation maps page types, global typography options, color variables, component lists, and databases before code generation.
            </p>
            {/* Visual simulation representation inside card */}
            <div className="mt-4 bg-[#161616] rounded p-3 border border-white/5 font-mono text-[10px] text-white/50 space-y-1">
              <div><span className="text-purple-400">"pageType"</span>: <span className="text-green-400">"SaaS Dashboard"</span>,</div>
              <div><span className="text-purple-400">"theme"</span>: <span className="text-green-400">"Dashboard Dark"</span>,</div>
              <div><span className="text-purple-400">"components"</span>: [<span className="text-green-400">"Navbar"</span>, <span className="text-green-400">"MetricGrid"</span>, <span className="text-green-400">"SSEStream"</span>]</div>
            </div>
          </div>
        </div>

        {/* Card 2: Multi-Model Routing */}
        <div className="bg-[#1B1B1B] border border-white/10 rounded p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="w-10 h-10 rounded flex items-center justify-center bg-white/5 border border-white/10">
            <Cpu className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Multi-Model Support</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Intelligent router queries Gemini 2.5 Flash, OpenAI GPT-4o, Claude 3.5 Sonnet, or OpenRouter based on generation phase to minimize costs and maximize layout speeds.
            </p>
          </div>
        </div>

        {/* Card 3: Real-Time Streaming (Tall Box - 1 Col, 2 Rows on large screens) */}
        <div className="lg:row-span-2 bg-[#1B1B1B] border border-white/10 rounded p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="w-10 h-10 rounded flex items-center justify-center bg-white/5 border border-white/10">
            <Zap className="w-5 h-5 text-[#6ee7b7]" />
          </div>
          <div className="flex-1 flex flex-col justify-center gap-3 my-4">
            {/* Visual SSE status feed */}
            {[
              { status: "complete", title: "Planner complete", time: "0.2s" },
              { status: "generating", title: "Streaming React markup...", time: "1.4s" },
              { status: "waiting", title: "AST validation layer", time: "waiting" },
              { status: "waiting", title: "CDN edge deployment", time: "waiting" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px] p-2.5 rounded bg-[#161616] border border-white/5">
                <span className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    item.status === "complete" ? "bg-green-400" :
                    item.status === "generating" ? "bg-yellow-400 animate-ping" : "bg-white/20"
                  }`} />
                  <span className={item.status === "waiting" ? "text-white/40" : "text-white/80"}>{item.title}</span>
                </span>
                <span className="text-neutral-400 font-mono text-[9px]">{item.time}</span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Real-Time Streaming</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              FastApp uses Server-Sent Events (SSE) to stream design logs, component code, AST repair events, and deploy state directly to the client browser.
            </p>
          </div>
        </div>

        {/* Card 4: AI Iteration */}
        <div className="bg-[#1B1B1B] border border-white/10 rounded p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="w-10 h-10 rounded flex items-center justify-center bg-white/5 border border-white/10">
            <GitBranch className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">AI-Powered Iteration</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Iterate and edit any section of your generated webpage using natural language instructions. Plan-diffing accurately patches changes without rebuilding everything.
            </p>
          </div>
        </div>

        {/* Card 5: Version History */}
        <div className="bg-[#1B1B1B] border border-white/10 rounded p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="w-10 h-10 rounded flex items-center justify-center bg-white/5 border border-white/10">
            <History className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Complete Version History</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every single modification step is versioned and safely recorded in the database. Roll back to any design, theme choice, or layout with a single click.
            </p>
          </div>
        </div>

        {/* Card 6: One-Click Deployment (Wide Box - 2 Cols) */}
        <div className="md:col-span-2 bg-[#1B1B1B] border border-white/10 rounded p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded flex items-center justify-center bg-white/5 border border-white/10">
              <Globe className="w-5 h-5 text-[#6ee7b7]" />
            </div>
            <div className="text-[10px] text-green-400 font-mono flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
              <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
              Edge Published
            </div>
          </div>
          <div className="flex gap-8 items-end mt-4">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-1">One-Click Edge Deployment</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Immediately push generated layouts to FastApp edge servers. Get a custom public URL configured instantly, with code previews and easy HTML/ZIP downloads.
              </p>
            </div>
            {/* Download/deploy simulation block */}
            <div className="hidden sm:flex items-center gap-2 p-2 bg-[#161616] border border-white/5 rounded text-[10px] font-mono text-white/60">
              <span>https://fastapp.edge/deploy-v12</span>
            </div>
          </div>
        </div>

        {/* Card 7: Templates Library */}
        <div className="bg-[#1B1B1B] border border-white/10 rounded p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="w-10 h-10 rounded flex items-center justify-center bg-white/5 border border-white/10">
            <Layout className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Curated Template Blueprints</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Get running in seconds with standard layout options. FastApp structures beautiful templates matching SaaS platforms, portfolios, AI startups, CRM tools, and analytics.
            </p>
          </div>
        </div>

        {/* Card 8: Project Workspace */}
        <div className="bg-[#1B1B1B] border border-white/10 rounded p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="w-10 h-10 rounded flex items-center justify-center bg-white/5 border border-white/10">
            <FolderKanban className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Centralized Project Workspace</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Easily manage all generated projects, deployments, and versions in an organized dashboard workspace. Features simple metadata editing, searching, and deleting.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
