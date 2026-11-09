"use client";

import * as React from "react";
import { getProject } from "@/lib/mock/api";
import type { Project } from "@/lib/mock/types";
import { useMockQuery, type QueryResult } from "@/lib/hooks/use-mock-query";

const ProjectContext = React.createContext<QueryResult<Project> | null>(null);

/**
 * Loads the current project once per project route and shares it.
 * Pages render immediately and fetch their own data in parallel; use
 * `useProject()` for the name/code in headers (show a Skeleton while loading).
 */
export function ProjectProvider({ projectId, children }: { projectId: string; children: React.ReactNode }) {
  const project = useMockQuery((signal) => getProject(projectId, { signal }), [projectId]);
  return <ProjectContext.Provider value={project}>{children}</ProjectContext.Provider>;
}

export function useProject(): QueryResult<Project> {
  const ctx = React.useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used inside <ProjectProvider>.");
  return ctx;
}
