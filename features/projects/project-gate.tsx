"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { isMockApiError } from "@/lib/mock/errors";
import { useProject } from "./project-context";

/**
 * Replaces project pages with a not-found state when the project doesn't exist.
 * Other errors (e.g. ?mock=error) fall through: each page shows its own error state.
 */
export function ProjectGate({ children }: { children: React.ReactNode }) {
  const project = useProject();
  if (
    project.status === "error" &&
    isMockApiError(project.error) &&
    project.error.code === "not-found"
  ) {
    return (
      <EmptyState
        framed
        size="lg"
        icon={<Building2 />}
        title="Project not found"
        description="This project doesn't exist or you're no longer on its team."
        actions={
          <Button asChild>
            <Link href="/projects">See all projects</Link>
          </Button>
        }
      />
    );
  }
  return <>{children}</>;
}
