import { Sidebar } from "@/components/layout/sidebar";

/**
 * Dashboard shell layout.
 * All routes inside (dashboard)/ share this sidebar + main-content shell.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      {/* Ambient mesh background */}
      <div className="mesh-bg" aria-hidden="true" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto h-full"
        style={{
          background:
            "linear-gradient(180deg, var(--color-surface-950) 0%, var(--color-surface-900) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
