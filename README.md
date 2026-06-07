# FastApp — AI Prompt-to-Website Generator

<div align="center">

**Turn a single prompt into a production-quality, deployed website in seconds.**

[![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://github.com/rajeshuchil/Promptly)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

[**Live Demo**](https://github.com/rajeshuchil/Promptly) · [**Report Bug**](https://github.com/rajeshuchil/Promptly/issues) · [**Request Feature**](https://github.com/rajeshuchil/Promptly/issues)

</div>

---

## What is FastApp?

FastApp is a full-stack AI SaaS platform that orchestrates a **multi-stage pipeline** to transform natural language prompts into production-grade, deployable websites.

Unlike simple LLM wrappers, FastApp runs each generation through a structured sequence:

```
User Prompt
    ↓
🧠 Planner    — Generates a structured JSON layout schema (page type, sections, components, design tokens)
    ↓
⚡ Generator  — Streams styled, production-quality HTML using the plan as a blueprint
    ↓
🛡 Validator  — Repairs structural issues, checks accessibility, scores layout quality
    ↓
👁 Preview    — Live sandbox iframe with desktop / tablet / mobile device modes
    ↓
🚀 Deploy     — One-click publish to edge servers with a public URL
    ↓
✏️ Iterate    — AI-powered natural language editing with plan diffing and version history
```

---

## Architecture

```
src/
├── app/                        # Next.js App Router
│   ├── (dashboard)/            # Auth-gated pages
│   │   ├── dashboard/          # Main workspace
│   │   ├── projects/[id]/      # Project detail + editing
│   │   ├── settings/           # Account & billing settings
│   │   └── help/               # Documentation & FAQ
│   ├── api/
│   │   ├── generate/           # SSE: full generation pipeline
│   │   ├── projects/[id]/
│   │   │   ├── edit/           # SSE: AI iteration endpoint
│   │   │   ├── revisions/      # Version history CRUD
│   │   │   ├── timeline/       # Lifecycle events
│   │   │   ├── deploy/         # SSE: deployment pipeline
│   │   │   └── export/         # HTML / ZIP download
│   │   ├── billing/            # Stripe checkout + portal
│   │   └── webhooks/stripe/    # Stripe event handler
│   └── page.tsx                # Public marketing landing page
│
├── lib/
│   ├── ai/
│   │   ├── providers/          # Gemini, OpenAI, Anthropic, OpenRouter
│   │   ├── planner/            # Structured plan generation
│   │   ├── generator/          # HTML streaming with design catalog
│   │   └── validator/          # HTML repair + quality evaluation
│   ├── iterations/             # AI editing, plan diffing, version control
│   ├── projects/               # Project CRUD + ownership
│   ├── deployments/            # Deployment provider abstraction
│   ├── billing/                # Stripe + entitlements
│   ├── usage/                  # Per-model token + cost tracking
│   ├── templates/              # Curated template library
│   └── design-system/          # Design tokens, layout presets
│
└── components/
    ├── dashboard/              # Dashboard workspace components
    ├── preview/                # Live preview frame + toolbar
    ├── projects/               # Project list + detail views
    └── layout/                 # Sidebar navigation
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.x (strict) |
| **AI Models** | Gemini 2.5 Flash · GPT-4o · Claude 3.5 Sonnet · OpenRouter |
| **Database** | PostgreSQL via Neon (serverless) |
| **ORM** | Drizzle ORM |
| **Auth** | NextAuth v5 (JWT sessions) |
| **Billing** | Stripe (subscriptions + webhooks) |
| **Styling** | Tailwind CSS v4 + custom design system |
| **Streaming** | Server-Sent Events (SSE) |
| **Validation** | Zod (runtime schema validation) |
| **Deployment** | Vercel |

---

## Features

### 🧠 AI Generation Pipeline
- Multi-stage Planner → Generator → Validator orchestration
- 7 visual design themes (Modern SaaS, Glassmorphism, Enterprise, Minimal, Startup, Rich, Standard)
- Design system knowledge injected into every generation for visual consistency
- SSE-based real-time streaming with progress events

### ✏️ AI-Powered Iteration
- Edit any website with natural language: *"Add a pricing section"*, *"Change the theme to dark"*
- Plan diffing shows exactly what changed (sections, components, design tokens)
- Version history with one-click restore to any previous state
- Project timeline tracks `created → generated → edited → published → exported` events

### 🤖 Multi-Model Infrastructure
- 4 AI providers with pluggable architecture (`AIProvider` interface)
- Automatic model routing by task type (planner vs generator)
- Per-request token estimation and cost tracking
- Provider-level error handling and rate limit detection

### 📦 Project Management
- Full project CRUD with search, sort, favorites, and archive
- Duplicate, rename, delete with ownership enforcement
- HTML/ZIP export with project metadata
- Deploy history with provider, URL, and timestamp

### 💳 Billing & Subscriptions
- Stripe-powered Free / Pro / Enterprise tiers
- Generation quota enforcement per plan
- Template access gating by subscription tier
- Webhook handler with signature verification

### 🔒 Security
- Route-level auth via NextAuth middleware
- Server-side ownership checks on all project operations
- Stripe webhook signature verification in production
- Zod validation on all API inputs

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Google AI Studio](https://aistudio.google.com) Gemini API key

### 1. Clone and install

```bash
git clone https://github.com/rajeshuchil/Promptly.git
cd Promptly/my-app
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..."

# Auth (generate with: openssl rand -hex 32)
AUTH_SECRET="your-64-char-hex-secret"
AUTH_URL="http://localhost:3000"

# AI Providers
GEMINI_API_KEY="your-gemini-api-key"
OPENAI_API_KEY=""          # optional
ANTHROPIC_API_KEY=""       # optional
OPENROUTER_API_KEY=""      # optional

# Stripe (optional — billing features)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Run database migrations

```bash
npm run db:push
```

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with any email address.

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | Pooled Neon connection string (runtime) |
| `DATABASE_URL_UNPOOLED` | ✅ Yes | Direct Neon connection (migrations only) |
| `AUTH_SECRET` | ✅ Yes | 64-char hex secret for JWT signing |
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key |
| `OPENAI_API_KEY` | No | OpenAI fallback (optional) |
| `ANTHROPIC_API_KEY` | No | Claude fallback (optional) |
| `OPENROUTER_API_KEY` | No | OpenRouter multi-model access (optional) |
| `STRIPE_SECRET_KEY` | No | Stripe API key (billing features) |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | No | Stripe price ID for Pro plan |
| `NEXT_PUBLIC_APP_URL` | No | Public URL (default: localhost:3000) |

---

## Database Schema

FastApp uses 6 primary tables managed with Drizzle ORM:

| Table | Purpose |
|---|---|
| `users` | User accounts |
| `projects` | Generated websites + metadata |
| `project_revisions` | Version history snapshots |
| `project_timeline_events` | Lifecycle event log |
| `subscriptions` | Stripe subscription records |
| `usage_logs` | Per-request AI usage + cost |

Run migrations:
```bash
npm run db:generate   # Generate migration files
npm run db:push       # Apply to database
npm run db:studio     # Open Drizzle Studio
```

---

## Roadmap

- [ ] GitHub / Google OAuth login
- [ ] Real Vercel deployment integration
- [ ] Custom domain support
- [ ] Team workspaces
- [ ] API access with personal tokens
- [ ] AI generation history and analytics dashboard
- [ ] Template marketplace
- [ ] Multi-page website generation

---

## License

MIT © 2025 FastApp

---

<div align="center">
Built with ❤️ using Next.js, Drizzle, Gemini, and Tailwind CSS
</div>
