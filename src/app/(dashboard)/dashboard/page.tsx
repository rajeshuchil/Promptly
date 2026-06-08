import { redirect } from "next/navigation";

/**
 * Legacy /dashboard route — redirects to the new Build workspace.
 * Preserves any existing bookmarks or external links.
 */
export default function DashboardPage() {
  redirect("/build");
}
