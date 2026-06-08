"use client";

import React from "react";
import { Server, Code, Database, Globe, BrainCircuit, Shield, Terminal } from "lucide-react";

export function TechStackSection() {
  const stack = [
    {
      name: "Next.js",
      category: "Frontend & Routing",
      desc: "App Router layouts, SSE compilation streaming, and server side security context rendering.",
      icon: Code
    },
    {
      name: "TypeScript",
      category: "Language",
      desc: "Robust full-stack type safety ensuring consistent structures across planner, generator, and client.",
      icon: Terminal
    },
    {
      name: "Drizzle ORM",
      category: "Database Layer",
      desc: "Type-safe database relations and migrations, avoiding complex SQL overheads.",
      icon: Database
    },
    {
      name: "Neon PostgreSQL",
      category: "Storage Engine",
      desc: "Serverless relational data layer hosting client project details, user permissions, and deployment state.",
      icon: Server
    },
    {
      name: "Gemini",
      category: "Primary LLM Router",
      desc: "Google Gemini 2.5 Flash acts as the primary layout blueprint planning and code compilation orchestrator.",
      icon: BrainCircuit
    },
    {
      name: "OpenAI & Anthropic",
      category: "Inference Engines",
      desc: "Secondary compilation pipelines query models like GPT-4o or Claude 3.5 Sonnet to handle complex logic requests.",
      icon: Shield
    },
    {
      name: "OpenRouter",
      category: "Inference Router",
      desc: "Acts as a unified fallback layer to guarantee uninterrupted generation service levels.",
      icon: Globe
    }
  ];

  return (
    <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto border-t border-white/5 bg-[#161616]">
      <div className="text-center mb-16">
        <span className="text-xs font-semibold tracking-wider text-[#6ee7b7] uppercase">Architecture Stack</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 mb-4 text-white">
          Powered by a modern full-stack AI toolchain
        </h2>
        <p className="text-sm md:text-base text-neutral-400 max-w-xl mx-auto">
          FastApp is built with state-of-the-art frameworks to deliver blistering deployment speeds, type-safety, and deep generative capabilities.
        </p>
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stack.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.name}
              className="bg-[#1B1B1B] border border-white/10 rounded p-5 hover:border-white/20 hover:bg-[#1F1F1F] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded flex items-center justify-center bg-white/5 border border-white/5">
                    <Icon className="w-4 h-4 text-[#6ee7b7]" />
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">{item.category}</span>
                </div>

                {/* Name */}
                <h3 className="font-bold text-white text-sm mb-1.5">{item.name}</h3>
                
                {/* Description */}
                <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
