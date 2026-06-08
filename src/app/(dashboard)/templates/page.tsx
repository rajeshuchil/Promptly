import type { Metadata } from "next";
import { TemplatesPage } from "@/components/build/TemplatesPage";

export const metadata: Metadata = {
  title: "Templates | FastApp",
  description: "Start from a pre-configured layout. Choose a template and FastApp will generate a production-ready website.",
};

export default function Templates() {
  return <TemplatesPage />;
}
