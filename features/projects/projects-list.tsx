"use client";

import Link from "next/link";
import { ArrowRight, Building2, CalendarClock, FileStack, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/patterns/query-error-state";
import { useMockQuery } from "@/lib/hooks/use-mock-query";
import { listProjects } from "@/lib/mock/api";
import type { ProjectSummary } from "@/lib/mock/types";
import { formatCount, formatDate, formatRelative } from "@/lib/format";
import { PROJECT_STATUS_META } from "./project-meta";

export function ProjectsList() {
  const projects = useMockQuery((signal) => listProjects({ signal }), []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Halvern Build"
        title="Projects"
        description="Pick a project to ask questions about its documents, decisions and deadlines."
      />

      {projects.status === "loading" && (
        <div aria-busy="true" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <span className="sr-only">Loading projects…</span>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} aria-hidden className="flex flex-col gap-4 rounded-md border-2 border-border bg-surface p-5">
              <div className="flex gap-3">
                <Skeleton className="size-12 shrink-0" />
                <div className="flex w-full flex-col gap-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {projects.status === "error" && (
        <QueryErrorState error={projects.error} onRetry={projects.refetch} action="load your projects" />
      )}

      {projects.status === "success" && projects.data.length === 0 && (
        <EmptyState
          framed
          size="lg"
          icon={<Building2 />}
          title="No projects yet"
          description="You'll see a project here as soon as someone adds you to its team."
        />
      )}

      {projects.status === "success" && projects.data.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.data.map((project) => (
            <li key={project.id} className="flex">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectSummary }) {
  const status = PROJECT_STATUS_META[project.status];
  return (
    <Card asChild interactive className="w-full gap-4 p-5">
      <Link href={`/projects/${project.id}/documents`}>
        <div className="flex items-start gap-3">
          <Avatar name={project.name} initials={project.code} shape="square" size="lg" tone={project.accent} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 className="font-display text-overline text-foreground">{project.name}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={status.tone} size="sm" dot>
                {status.label}
              </Badge>
              <span className="text-body-sm text-foreground-muted">{project.phase}</span>
            </div>
          </div>
          <ArrowRight className="mt-1 size-icon-md shrink-0 text-foreground-subtle" aria-hidden />
        </div>
        <p className="line-clamp-2 text-body text-foreground-muted">{project.description}</p>
        <dl className="mt-auto grid gap-1.5 border-t-2 border-border pt-4 text-body-sm text-foreground-muted">
          <div className="flex items-center gap-2">
            <dt><MapPin className="size-icon-sm" aria-hidden /><span className="sr-only">Address</span></dt>
            <dd className="truncate">{project.address}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt><FileStack className="size-icon-sm" aria-hidden /><span className="sr-only">Documents</span></dt>
            <dd>
              {formatCount(project.documentCount, "document")}
              {project.lastActivityAt && <> · updated {formatRelative(project.lastActivityAt)}</>}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <dt><CalendarClock className="size-icon-sm" aria-hidden /><span className="sr-only">Planned completion</span></dt>
            <dd>Completion {formatDate(project.plannedCompletion)}</dd>
          </div>
        </dl>
      </Link>
    </Card>
  );
}
