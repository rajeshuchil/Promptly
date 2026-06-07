import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectService } from "@/lib/projects/project-service";
import { requireUser } from "@/lib/auth";
import { ProjectDetailClient } from "@/components/projects/project-detail-client";

type PageContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: PageContext): Promise<Metadata> {
  try {
    const user = await requireUser();
    const { id } = await params;
    const projectService = ProjectService.getInstance();
    const project = await projectService.getProjectById(id, user.id);
    
    return {
      title: `${project.name} | FastApp`,
      description: `View and export code for ${project.name}.`,
    };
  } catch {
    return {
      title: "Project details",
    };
  }
}

export default async function ProjectDetailPage({ params }: PageContext) {
  const user = await requireUser();
  const { id } = await params;
  
  const projectService = ProjectService.getInstance();
  
  let project;
  try {
    project = await projectService.getProjectById(id, user.id);
  } catch (error) {
    console.error("Failed to load project details:", error);
    return notFound();
  }

  return (
    <div className="animate-fade-in space-y-6">
      <ProjectDetailClient initialProject={project} />
    </div>
  );
}
