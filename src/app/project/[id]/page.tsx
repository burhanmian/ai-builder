import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectEditor } from "@/components/project-editor";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) return null;
  if (project.userId !== userId) return null;

  return project;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const project = await getProject(id, session.user.id);

  if (!project) {
    notFound();
  }

  return <ProjectEditor project={project} />;
}
