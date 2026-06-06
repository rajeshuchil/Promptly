import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your FastApp dashboard — generate, manage, and deploy AI-powered websites.",
};

export default function DashboardPage() {
  return (
    <div className="animate-fade-in space-y-6 h-full flex flex-col">
      <header className="shrink-0">
        <h1
          className="text-2xl font-bold leading-tight"
          style={{
            background:
              "linear-gradient(135deg, var(--color-surface-50) 0%, var(--color-surface-200) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          FastApp Dashboard
        </h1>
        <p className="text-xs text-[var(--color-muted-fg)]">
          Create, manage, and preview your AI-generated websites in real-time.
        </p>
      </header>

      <div className="flex-1 min-h-0">
        <DashboardClient />
      </div>
    </div>
  );
}
