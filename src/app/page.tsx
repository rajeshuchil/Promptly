import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { PipelineSection } from "@/components/landing/PipelineSection";
import { BentoSection } from "@/components/landing/BentoSection";
import { TemplateSection } from "@/components/landing/TemplateSection";
import { DesignIntelligenceSection } from "@/components/landing/DesignIntelligenceSection";
import { TechStackSection } from "@/components/landing/TechStackSection";
import { ArchitectureSection } from "@/components/landing/ArchitectureSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { GridBackground } from "@/components/ui/grid-background";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FastApp — AI Prompt-to-Website Platform",
  description:
    "Build production-ready websites from a single prompt. Powered by a multi-stage AI pipeline: Planner → Generator → Validator → Deploy.",
};

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <GridBackground className="overflow-x-hidden">
      <LandingNav isAuthenticated={!!user} />
      <main>
        <HeroSection isAuthenticated={!!user} />
        <PipelineSection />
        <BentoSection />
        <TemplateSection />
        <DesignIntelligenceSection />
        <TechStackSection />
        <ArchitectureSection />
        <FinalCTASection isAuthenticated={!!user} />
      </main>
      <LandingFooter />
    </GridBackground>
  );
}
