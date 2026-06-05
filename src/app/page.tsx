import { redirect } from "next/navigation";

/**
 * Root "/" redirects to the dashboard.
 * When auth is wired, replace with a proper check:
 *   const session = await getSession();
 *   if (!session) redirect("/login");
 *   redirect("/dashboard");
 */
export default function RootPage() {
  redirect("/dashboard");
}
