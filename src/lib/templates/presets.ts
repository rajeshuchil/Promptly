import { PageSpec } from "@/lib/types/page-spec";

export const TEMPLATE_PRESETS: Record<string, PageSpec> = {
  "saas-landing": {
    pageType: "landing",
    theme: "modern-dark",
    layout: "hero-plus-sections",
    designTokens: {
      primaryColor: "indigo-600",
      secondaryColor: "violet-500",
      backgroundColor: "slate-950",
      textColor: "slate-50",
      borderRadius: "lg",
      fontFamily: "Inter",
    },
    sections: [
      {
        id: "nav",
        type: "navbar",
        variant: "saas",
        props: {
          logoText: "CloudSync",
          links: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Docs", href: "#docs" }
          ],
          ctaLabel: "Sign Up Free"
        }
      },
      {
        id: "hero",
        type: "hero",
        variant: "split",
        props: {
          headline: "Deploy globally. Scale indefinitely.",
          subheadline: "The developer platform built to design, preview, and host ultra-performant edge sites without backend overhead.",
          primaryCTA: "Get Started Free",
          secondaryCTA: "View Documentation",
          imageSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
        }
      },
      {
        id: "feats",
        type: "features",
        variant: "three-column",
        props: {
          title: "Engineered for maximum velocity",
          subtitle: "A complete toolkit optimized to bypass cold-starts and serve layout trees instantly.",
          items: [
            { title: "Structured JSON", desc: "No complex parser dependencies. Layouts compile to clean, portable schemas." },
            { title: "Global CDN", desc: "Specifications are mirrored edge-wide for sub-millisecond load times." },
            { title: "Dynamic Variations", desc: "Switch styles, typographies, and radius presets seamlessly in real time." }
          ]
        }
      },
      {
        id: "price",
        type: "pricing",
        variant: "three-tier",
        props: {
          title: "Simple, predictable plans",
          subtitle: "Accelerate your development cycle with our flexible tier options.",
          tiers: [
            { name: "Developer", price: "$0", features: ["1 Active Project", "1k Runs / Month", "Community Support"], cta: "Start Free", popular: false },
            { name: "Pro", price: "$29", features: ["Unlimited Projects", "100k Runs / Month", "Advanced Analytics", "Custom Domains"], cta: "Upgrade to Pro", popular: true },
            { name: "Enterprise", price: "$199", features: ["SLA Assured Hosting", "Unlimited Runs", "Priority Support", "Dedicated Node"], cta: "Contact Sales", popular: false }
          ]
        }
      },
      {
        id: "foot",
        type: "footer",
        variant: "minimal",
        props: {
          copyrightText: "© 2026 CloudSync Technologies. All rights reserved."
        }
      }
    ]
  },
  "saas-dashboard": {
    pageType: "dashboard",
    theme: "modern-dark",
    layout: "sidebar-nav",
    designTokens: {
      primaryColor: "indigo-600",
      secondaryColor: "emerald-500",
      backgroundColor: "slate-950",
      textColor: "slate-50",
      borderRadius: "lg",
      fontFamily: "Inter",
    },
    sections: [
      {
        id: "dashboard-nav",
        type: "navbar",
        variant: "minimal",
        props: {
          logoText: "SyncConsole",
          links: [
            { label: "Overview", href: "#" },
            { label: "Settings", href: "#" }
          ]
        }
      },
      {
        id: "dashboard-hero",
        type: "hero",
        variant: "centered",
        props: {
          headline: "Welcome to your sync console",
          subheadline: "Monitor your deployment pipeline, read live traffic logs, and verify server state.",
          primaryCTA: "Configure Integrations"
        }
      },
      {
        id: "dashboard-footer",
        type: "footer",
        variant: "minimal",
        props: {
          copyrightText: "© 2026 SyncConsole Dashboard."
        }
      }
    ]
  },
  "pricing-page": {
    pageType: "pricing",
    theme: "modern-dark",
    layout: "hero-plus-sections",
    designTokens: {
      primaryColor: "indigo-600",
      secondaryColor: "violet-500",
      backgroundColor: "slate-950",
      textColor: "slate-50",
      borderRadius: "lg",
      fontFamily: "Inter",
    },
    sections: [
      {
        id: "pricing-nav",
        type: "navbar",
        variant: "saas",
        props: {
          logoText: "BillingSync",
          links: [
            { label: "Home", href: "#" }
          ]
        }
      },
      {
        id: "pricing-tier-block",
        type: "pricing",
        variant: "three-tier",
        props: {
          title: "Plans for teams of all sizes",
          subtitle: "Get started for free or unlock the full power of visual components.",
          tiers: [
            { name: "Starter", price: "$0", features: ["1 User", "Basic Tools"], cta: "Claim Starter", popular: false },
            { name: "Professional", price: "$49", features: ["Up to 10 Users", "All Pro Components", "API Access"], cta: "Upgrade to Pro", popular: true },
            { name: "Scale", price: "$149", features: ["Unlimited Users", "Custom Branding", "Priority Escalation"], cta: "Upgrade to Scale", popular: false }
          ]
        }
      },
      {
        id: "pricing-foot",
        type: "footer",
        variant: "minimal",
        props: {
          copyrightText: "© 2026 BillingSync Inc."
        }
      }
    ]
  }
};
