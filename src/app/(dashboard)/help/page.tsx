import type { Metadata } from "next";
import Link from "next/link";
import {
  HelpCircle, BookOpen, Zap, Code2, Globe, LifeBuoy,
  ChevronRight, MessageSquare, GitBranch, ExternalLink
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help & Docs | FastApp",
  description: "FastApp documentation, guides, and support resources.",
};

const guides = [
  {
    icon: Zap,
    title: "Quickstart Guide",
    desc: "Generate your first website in under 60 seconds.",
    tag: "5 min read",
  },
  {
    icon: Code2,
    title: "Prompt Engineering Tips",
    desc: "Write better prompts to get production-quality results every time.",
    tag: "10 min read",
  },
  {
    icon: Globe,
    title: "Deploying Your Website",
    desc: "How to publish your generated site to a public URL with one click.",
    tag: "3 min read",
  },
  {
    icon: BookOpen,
    title: "AI Iteration & Versioning",
    desc: "Use natural language to edit existing sites. Restore any version with one click.",
    tag: "7 min read",
  },
];

const faqs = [
  {
    q: "What AI models does FastApp use?",
    a: "FastApp supports Gemini 2.5 Flash (default), GPT-4o, Claude 3.5 Sonnet, and models via OpenRouter. The system automatically routes to the best available model.",
  },
  {
    q: "How does the AI pipeline work?",
    a: "Every generation runs through a 5-stage pipeline: Planner (creates a layout schema) → Generator (streams styled HTML) → Validator (repairs and quality-scores) → Preview (live sandbox) → Deploy (public URL).",
  },
  {
    q: "Can I edit a website after it's generated?",
    a: "Yes. Use the \"Edit with AI\" tab on any project to describe changes in natural language. FastApp will modify the layout plan and re-stream only the affected HTML — no full regeneration.",
  },
  {
    q: "What happens to my generation quota?",
    a: "Free accounts get 10 generations per month. Pro accounts get 100. Enterprise is unlimited. The metrics bar on your dashboard always shows your current usage.",
  },
  {
    q: "Can I export my website source code?",
    a: "Yes. From the project detail page, you can download the generated site as a standalone HTML file or a ZIP archive.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[var(--color-brand-400)]" />
          Help & Docs
        </h1>
        <p className="text-sm text-[var(--color-muted-fg)] mt-1">
          Guides, FAQs, and support resources for FastApp.
        </p>
      </div>

      {/* Guides */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-surface-450)] mb-3">
          Getting Started
        </h2>
        <div className="space-y-2">
          {guides.map((guide) => (
            <div key={guide.title}
              className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-900)] hover:bg-[var(--color-surface-800)] hover:border-[var(--color-brand-700)] transition-all group cursor-pointer">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "oklch(0.60 0.27 270 / 0.12)", border: "1px solid oklch(0.60 0.27 270 / 0.25)" }}>
                <guide.icon className="w-4.5 h-4.5 text-[var(--color-brand-400)]" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-white">{guide.title}</div>
                <div className="text-xs text-[var(--color-muted-fg)] mt-0.5">{guide.desc}</div>
              </div>
              <span className="text-[9px] font-medium text-[var(--color-surface-400)] hidden sm:block">{guide.tag}</span>
              <ChevronRight className="w-4 h-4 text-[var(--color-surface-500)] group-hover:text-white transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-surface-450)] mb-3">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-900)] overflow-hidden group">
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-semibold text-sm text-white hover:text-[var(--color-brand-300)] transition-colors">
                {faq.q}
                <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90 text-[var(--color-surface-400)]" />
              </summary>
              <div className="px-4 pb-4 text-xs text-[var(--color-surface-300)] leading-relaxed border-t border-[var(--color-border)] pt-3">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Support links */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-surface-450)] mb-3">
          Support
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://github.com/rajeshuchil/Promptly/issues"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-900)] hover:border-[var(--color-brand-700)] transition-all group"
          >
            <GitBranch className="w-5 h-5 text-[var(--color-surface-400)] group-hover:text-white transition-colors" />
            <div>
              <div className="font-semibold text-sm text-white">GitHub Issues</div>
              <div className="text-xs text-[var(--color-muted-fg)]">Report bugs or request features</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--color-surface-500)] ml-auto" />
          </a>
          <a
            href="https://github.com/rajeshuchil/Promptly"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-900)] hover:border-[var(--color-brand-700)] transition-all group"
          >
            <BookOpen className="w-5 h-5 text-[var(--color-surface-400)] group-hover:text-white transition-colors" />
            <div>
              <div className="font-semibold text-sm text-white">Source Code</div>
              <div className="text-xs text-[var(--color-muted-fg)]">Explore the FastApp codebase</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--color-surface-500)] ml-auto" />
          </a>
        </div>
      </div>
    </div>
  );
}
