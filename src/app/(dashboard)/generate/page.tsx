import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Generate | FastApp",
};

/**
 * /generate redirects to the main dashboard where the prompt input lives.
 * This prevents the sidebar link from 404-ing while keeping generation
 * centralised in the dashboard workspace.
 */
export default function GeneratePage() {
  redirect("/dashboard");
}
