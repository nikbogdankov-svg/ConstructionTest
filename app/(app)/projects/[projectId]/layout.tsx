import { ProjectProvider } from "@/features/projects/project-context";
import { ProjectGate } from "@/features/projects/project-gate";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <ProjectProvider key={projectId} projectId={projectId}>
      <ProjectGate>{children}</ProjectGate>
    </ProjectProvider>
  );
}
