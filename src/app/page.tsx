import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import {
  Zap, Sparkles, Globe, Cpu, ShieldCheck, GitBranch,
  ArrowRight, CheckCircle, Play, Database, Layers, Code2,
  BarChart3, Timer, Wand2
} from "lucide-react";

export const metadata = {
  title: "FastApp — AI Prompt-to-Website Generator",
  description:
    "Turn a single prompt into a fully-deployed, production-grade website in seconds. Powered by Gemini, OpenAI, and Anthropic with a multi-stage AI pipeline.",
};

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[oklch(0.06_0.01_270)] text-white overflow-x-hidden">
      {/* Ambient mesh background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-[700px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.27 270) 0%, transparent 70%)", filter: "blur(100px)" }}
        />
        <div
          className="absolute bottom-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, oklch(0.50 0.28 310) 0%, transparent 70%)", filter: "blur(120px)" }}
        />
        <div
          className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.25 240) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: "linear-gradient(135deg, oklch(0.60 0.27 270), oklch(0.53 0.28 310))" }}
          >
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight" style={{
            background: "linear-gradient(135deg, oklch(0.92 0.01 270), oklch(0.79 0.16 270))",
            WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            FastApp
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-[oklch(0.70_0.02_270)] hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, oklch(0.60 0.27 270), oklch(0.53 0.28 310))" }}
          >
            Get Started Free →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-6 pt-20 pb-28 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border"
          style={{ background: "oklch(0.60 0.27 270 / 0.12)", borderColor: "oklch(0.60 0.27 270 / 0.35)", color: "oklch(0.79 0.16 270)" }}>
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Gemini 2.5 Flash · Multi-model AI pipeline
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
          <span style={{
            background: "linear-gradient(135deg, oklch(0.96 0.005 270) 0%, oklch(0.88 0.01 270) 40%, oklch(0.79 0.16 270) 100%)",
            WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            From prompt to<br />deployed website
          </span>
          <br />
          <span style={{
            background: "linear-gradient(135deg, oklch(0.79 0.16 270), oklch(0.65 0.24 310))",
            WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            in seconds.
          </span>
        </h1>

        <p className="text-xl text-[oklch(0.65_0.01_270)] max-w-2xl mx-auto mb-10 leading-relaxed">
          FastApp is a full-stack AI SaaS platform that transforms natural language descriptions into
          production-quality websites. Type a prompt. Get a validated, styled, deployable website.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            id="hero-cta-primary"
            className="group flex items-center gap-2 px-7 py-3.5 text-base font-bold rounded-2xl text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, oklch(0.60 0.27 270), oklch(0.53 0.28 310))",
              boxShadow: "0 0 40px -8px oklch(0.60 0.27 270 / 0.5)"
            }}
          >
            <Wand2 className="w-4.5 h-4.5" />
            Start Building Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="https://github.com/rajeshuchil/Promptly"
            target="_blank"
            rel="noreferrer"
            id="hero-cta-github"
            className="flex items-center gap-2 px-7 py-3.5 text-base font-semibold rounded-2xl border transition-all hover:bg-white/5"
            style={{ borderColor: "oklch(0.30 0.012 270)", color: "oklch(0.80 0.01 270)" }}
          >
            <Code2 className="w-4.5 h-4.5" />
            View on GitHub
          </a>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-14 text-sm text-[oklch(0.55_0.01_270)]">
          {[
            { value: "4 AI Providers", label: "Gemini · OpenAI · Anthropic · OpenRouter" },
            { value: "7 Design Themes", label: "SaaS · Glass · Enterprise · Minimal…" },
            { value: "Full Pipeline", label: "Plan → Generate → Validate → Deploy" },
            { value: "Version History", label: "Every edit tracked with restore support" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-bold text-base text-[oklch(0.88_0.01_270)]">{s.value}</div>
              <div className="text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline Architecture Section */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            A production-grade AI pipeline
          </h2>
          <p className="text-[oklch(0.60_0.01_270)] max-w-xl mx-auto">
            FastApp doesn't just call an LLM. It runs a multi-stage orchestration pipeline that plans,
            generates, validates, and deploys — all from a single prompt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: Sparkles, label: "Prompt", desc: "Natural language input", color: "oklch(0.60 0.27 270)" },
            { icon: Layers, label: "Planner", desc: "AI creates layout schema", color: "oklch(0.58 0.26 280)" },
            { icon: Code2, label: "Generator", desc: "Streams styled HTML", color: "oklch(0.56 0.25 295)" },
            { icon: ShieldCheck, label: "Validator", desc: "Repairs & quality-scores", color: "oklch(0.54 0.24 305)" },
            { icon: Play, label: "Preview", desc: "Live sandbox preview", color: "oklch(0.52 0.26 318)" },
            { icon: Globe, label: "Deploy", desc: "Edge-published public URL", color: "oklch(0.50 0.27 330)" },
          ].map((step, i) => (
            <div key={step.label} className="relative flex flex-col items-center text-center p-5 rounded-2xl border transition-all hover:-translate-y-1"
              style={{ background: "oklch(0.10 0.007 270 / 0.7)", borderColor: "oklch(0.22 0.010 270)" }}>
              {i < 5 && (
                <div className="hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 z-10 text-[oklch(0.30_0.012_270)] text-lg font-bold">›</div>
              )}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${step.color} / 0.15`, border: `1px solid ${step.color} / 0.35` }}>
                <step.icon className="w-5 h-5" style={{ color: step.color }} />
              </div>
              <div className="font-bold text-sm text-white mb-1">{step.label}</div>
              <div className="text-[10px] text-[oklch(0.55_0.01_270)] leading-tight">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Everything a production SaaS needs
          </h2>
          <p className="text-[oklch(0.60_0.01_270)] max-w-xl mx-auto">
            Built from the ground up with scalability, observability, and developer experience in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Cpu,
              title: "Multi-Model Intelligence",
              desc: "Dynamically routes between Gemini, GPT-4o, Claude, and OpenRouter based on task type. Cost-per-token tracking built in.",
              badge: "4 Providers",
            },
            {
              icon: GitBranch,
              title: "AI-Powered Iteration",
              desc: "Edit any published website with a natural language prompt. Plan diffing tracks every change. Restore any version with one click.",
              badge: "Version Control",
            },
            {
              icon: ShieldCheck,
              title: "Quality Validation Layer",
              desc: "Automatic HTML repair, layout completeness checks, accessibility scoring, and visual hierarchy enforcement on every generation.",
              badge: "Auto-Repair",
            },
            {
              icon: BarChart3,
              title: "Usage & Billing",
              desc: "Full Stripe subscription integration with Free, Pro, and Enterprise tiers. Per-model token tracking with estimated cost per run.",
              badge: "3 Tiers",
            },
            {
              icon: Database,
              title: "Project Management",
              desc: "Full project CRUD, favorites, search, version history, timeline events, duplicate, export as HTML/ZIP, and deploy history.",
              badge: "Full CRUD",
            },
            {
              icon: Timer,
              title: "Real-Time SSE Streaming",
              desc: "Live generation progress delivered via Server-Sent Events. Clients receive planning, generating, validating, and saving events in real time.",
              badge: "SSE Streaming",
            },
          ].map((f) => (
            <div key={f.title}
              className="group relative p-6 rounded-2xl border transition-all hover:-translate-y-1 hover:border-[oklch(0.45_0.22_270)]"
              style={{ background: "oklch(0.10 0.007 270 / 0.7)", borderColor: "oklch(0.22 0.010 270)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(0.60 0.27 270 / 0.12)", border: "1px solid oklch(0.60 0.27 270 / 0.25)" }}>
                  <f.icon className="w-5 h-5 text-[oklch(0.79_0.16_270)]" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                  style={{ color: "oklch(0.79 0.16 270)", borderColor: "oklch(0.60 0.27 270 / 0.35)", background: "oklch(0.60 0.27 270 / 0.10)" }}>
                  {f.badge}
                </span>
              </div>
              <h3 className="font-bold text-sm text-white mb-2">{f.title}</h3>
              <p className="text-xs text-[oklch(0.55_0.01_270)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
        <div className="rounded-3xl border p-8 md:p-12"
          style={{ background: "oklch(0.09 0.006 270 / 0.8)", borderColor: "oklch(0.22 0.010 270)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-3"
                style={{ color: "oklch(0.69 0.22 270)" }}>Architecture</div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4">
                Built with the modern<br />full-stack AI toolchain
              </h2>
              <p className="text-sm text-[oklch(0.60_0.01_270)] leading-relaxed mb-6">
                FastApp uses a domain-driven service architecture with clean boundaries between
                the AI pipeline, project management, billing, and deployment layers.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, oklch(0.60 0.27 270), oklch(0.53 0.28 310))" }}
              >
                Try It Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Next.js 15", desc: "App Router + SSE" },
                { name: "Drizzle ORM", desc: "PostgreSQL · Neon" },
                { name: "NextAuth v5", desc: "JWT sessions" },
                { name: "Stripe", desc: "Subscriptions" },
                { name: "Gemini 2.5", desc: "Primary AI model" },
                { name: "Zod", desc: "Runtime validation" },
                { name: "Tailwind CSS v4", desc: "Design system" },
                { name: "TypeScript", desc: "Fully typed" },
              ].map((t) => (
                <div key={t.name} className="p-3 rounded-xl border"
                  style={{ background: "oklch(0.12 0.007 270 / 0.5)", borderColor: "oklch(0.25 0.010 270)" }}>
                  <div className="font-bold text-xs text-white">{t.name}</div>
                  <div className="text-[10px] text-[oklch(0.50_0.01_270)] mt-0.5">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 text-center max-w-3xl mx-auto">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, oklch(0.60 0.27 270), oklch(0.53 0.28 310))" }}>
          <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Ready to build your<br />next website with AI?
        </h2>
        <p className="text-[oklch(0.60_0.01_270)] mb-8 text-lg">
          Start generating production-quality websites from natural language prompts.
          Free tier included — no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            id="bottom-cta-primary"
            className="flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-2xl text-white transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, oklch(0.60 0.27 270), oklch(0.53 0.28 310))",
              boxShadow: "0 0 50px -10px oklch(0.60 0.27 270 / 0.45)"
            }}
          >
            <Sparkles className="w-4.5 h-4.5" />
            Get Started — It's Free
          </Link>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-xs text-[oklch(0.50_0.01_270)]">
          {["No credit card required", "Free tier available", "Open source on GitHub", "Multi-model AI"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[oklch(0.65_0.20_145)]" />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t px-6 py-8" style={{ borderColor: "oklch(0.18 0.010 270)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[oklch(0.45_0.01_270)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.60 0.27 270), oklch(0.53 0.28 310))" }}>
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[oklch(0.65_0.01_270)]">FastApp</span>
            <span>— AI Website Generator</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <a href="https://github.com/rajeshuchil/Promptly" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <span>© {new Date().getFullYear()} FastApp</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
