import type { Metadata } from "next";
import { Suspense } from "react";
import { BuildWorkspace } from "@/components/build/BuildWorkspace";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Build | FastApp",
  description: "Describe the website you want and FastApp will plan, generate, validate, and deploy it.",
};

export default function BuildPage() {
  return (
    <Suspense fallback={
      <div className="min-h-full flex items-center justify-center bg-black">
        <Loader2 className="w-6 h-6 animate-spin text-[#6ee7b7]" />
      </div>
    }>
      <BuildWorkspace />
    </Suspense>
  );
}
