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
    <div className="flex h-full bg-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area — children control their own padding/layout */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto h-full"
        style={{
          background:
            "linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 100%)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
