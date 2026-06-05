import type { Metadata } from "next";
import {
  Sparkles,
  Zap,
  Globe,
  FolderOpen,
  ArrowRight,
  Clock,
  TrendingUp,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your FastApp dashboard — generate, manage, and deploy AI-powered websites.",
};

/* ─── Stat cards ─────────────────────────────────────────────────────────── */

const stats = [
  {
    id:    "stat-projects",
    icon:  FolderOpen,
    label: "Total Projects",
    value: "0",
    delta: "Get started →",
    accent: "var(--color-brand-400)",
  },
  {
    id:    "stat-deployed",
    icon:  Globe,
    label: "Deployed Sites",
    value: "0",
    delta: "None yet",
    accent: "oklch(0.65 0.20 145)",
  },
  {
    id:    "stat-generations",
    icon:  Sparkles,
    label: "AI Generations",
    value: "0",
    delta: "Prompt away!",
    accent: "oklch(0.75 0.18 75)",
  },
  {
    id:    "stat-tokens",
    icon:  TrendingUp,
    label: "Tokens Used",
    value: "0",
    delta: "Free tier",
    accent: "oklch(0.70 0.22 310)",
  },
] as const;

/* ─── Quick-action items ──────────────────────────────────────────────────── */

const quickActions = [
  {
    id:          "action-generate",
    icon:        Sparkles,
    title:       "Generate a Website",
    description: "Describe what you want. Our AI writes the code, you own it.",
    href:        "/generate",
    cta:         "Start generating",
    accent:      "var(--color-brand-500)",
  },
  {
    id:          "action-explore",
    icon:        Code2,
    title:       "Browse Templates",
    description: "Jumpstart with a curated template and customise with AI.",
    href:        "/templates",
    cta:         "Browse templates",
    accent:      "oklch(0.65 0.20 145)",
  },
  {
    id:          "action-deploy",
    icon:        Globe,
    title:       "Deploy Instantly",
    description: "One click to push your site live with a free subdomain.",
    href:        "/deploy",
    cta:         "Learn about deploy",
    accent:      "oklch(0.75 0.18 75)",
  },
] as const;

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  return (
    <div className="animate-fade-in space-y-10">

      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <header>
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "oklch(0.60 0.27 270 / 0.15)",
              border: "1px solid oklch(0.60 0.27 270 / 0.30)",
              color: "var(--color-brand-300)",
            }}
          >
            <Zap className="w-3 h-3" />
            AI-powered
          </div>
        </div>

        <h1
          className="text-3xl sm:text-4xl font-bold leading-tight mb-2"
          style={{
            background:
              "linear-gradient(135deg, var(--color-surface-50) 0%, var(--color-surface-200) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome to FastApp
        </h1>
        <p className="text-[var(--color-muted-fg)] max-w-lg">
          Describe your vision — we&apos;ll generate, preview, and deploy your
          website in seconds using the latest AI models.
        </p>
      </header>

      {/* ── Prompt entry CTA ─────────────────────────────────────────────── */}
      <section
        id="prompt-cta"
        className="glass rounded-[var(--radius-2xl)] p-6 sm:p-8 border border-[oklch(0.60_0.27_270_/_0.20)]"
        aria-label="AI generation prompt"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[var(--color-surface-100)] mb-1">
              What would you like to build?
            </h2>
            <p className="text-sm text-[var(--color-muted-fg)]">
              e.g. &ldquo;A SaaS landing page for a project management app with
              dark mode and a pricing table.&rdquo;
            </p>
          </div>
          <Button
            variant="default"
            size="lg"
            id="cta-start-generate"
            className="shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Start generating
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Placeholder prompt textarea */}
        <div
          id="prompt-input-placeholder"
          className="mt-5 w-full rounded-[var(--radius-lg)] px-4 py-3 text-sm font-mono text-[var(--color-surface-400)]"
          style={{
            background: "var(--color-surface-950)",
            border: "1px solid var(--color-border)",
            minHeight: "3.5rem",
          }}
          aria-placeholder="Your prompt goes here…"
        >
          {/* AI generation interface will be mounted here */}
          <span className="opacity-40">Your prompt goes here…</span>
        </div>
      </section>

      {/* ── Stats grid ───────────────────────────────────────────────────── */}
      <section aria-label="Usage statistics">
        <h2 className="sr-only">Usage Statistics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ id, icon: Icon, label, value, delta, accent }) => (
            <Card key={id} id={id} className="relative overflow-hidden">
              {/* Accent glow */}
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 pointer-events-none"
                style={{ background: accent, transform: "translate(30%, -30%)" }}
                aria-hidden="true"
              />
              <CardContent className="flex flex-col gap-3">
                <div
                  className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center"
                  style={{ background: `${accent}22` }}
                >
                  <Icon className="w-4 h-4" style={{ color: accent }} />
                </div>
                <div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--color-surface-50)" }}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-[var(--color-muted-fg)] mt-0.5">
                    {label}
                  </div>
                  <div
                    className="text-xs font-medium mt-1.5"
                    style={{ color: accent }}
                  >
                    {delta}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Quick actions bento ───────────────────────────────────────────── */}
      <section aria-label="Quick actions">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--color-surface-100)]">
            Quick Actions
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-fg)]">
            <Clock className="w-3 h-3" />
            Up to date
          </div>
        </div>

        <div className="bento-grid">
          {quickActions.map(
            ({ id, icon: Icon, title, description, cta, accent }) => (
              <Card key={id} id={id} glass className="flex flex-col justify-between gap-6">
                <CardHeader>
                  <div
                    className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center mb-2"
                    style={{ background: `${accent}22` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: accent }} />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>

                <Button
                  variant="ghost"
                  size="sm"
                  className="self-start group"
                  id={`${id}-btn`}
                >
                  {cta}
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5"
                  />
                </Button>
              </Card>
            ),
          )}
        </div>
      </section>

      {/* ── Recent projects placeholder ───────────────────────────────────── */}
      <section aria-label="Recent projects">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--color-surface-100)]">
            Recent Projects
          </h2>
          <Button variant="ghost" size="sm" id="view-all-projects">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Empty state */}
        <div
          id="projects-empty-state"
          className="flex flex-col items-center justify-center py-16 rounded-[var(--radius-xl)] text-center"
          style={{
            border: "1px dashed var(--color-border-muted)",
            background: "var(--color-surface-700)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: "oklch(0.60 0.27 270 / 0.12)" }}
          >
            <FolderOpen
              className="w-7 h-7"
              style={{ color: "var(--color-brand-400)" }}
            />
          </div>
          <p className="text-[var(--color-surface-200)] font-semibold mb-1">
            No projects yet
          </p>
          <p className="text-sm text-[var(--color-muted-fg)] max-w-xs mb-5">
            Generate your first AI-powered website to see it appear here.
          </p>
          <Button variant="default" size="sm" id="create-first-project">
            <Sparkles className="w-3.5 h-3.5" />
            Create your first project
          </Button>
        </div>
      </section>

    </div>
  );
}
