"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, LayoutGrid } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockQuery } from "@/lib/hooks/use-mock-query";
import { listProjects } from "@/lib/mock/api";

/** Switches project while staying on the same section (chat → chat). */
export function ProjectSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { projectId } = useParams<{ projectId?: string }>();
  const projects = useMockQuery((signal) => listProjects({ signal }), []);

  if (projects.status === "loading") return <Skeleton className="h-control-md w-56" />;
  if (projects.status === "error") return null;

  const current = projects.data.find((p) => p.id === projectId);
  const section = projectId ? (pathname.split("/")[3] ?? "documents") : "documents";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex min-h-control-md max-w-full min-w-0 items-center gap-3 rounded-sm border-2 border-border bg-surface pr-3 pl-1.5 text-left hover:border-border-strong focus-visible:focus-ring">
        {current ? (
          <Avatar name={current.name} initials={current.code} shape="square" size="sm" tone={current.accent} />
        ) : (
          <span className="flex size-8 items-center justify-center rounded-sm bg-surface-active">
            <LayoutGrid className="size-icon-sm" aria-hidden />
          </span>
        )}
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="text-overline uppercase text-foreground-subtle">Project</span>
          <span className="truncate text-label">{current?.name ?? "All projects"}</span>
        </span>
        <ChevronsUpDown className="ml-1 size-icon-sm shrink-0 text-foreground-muted" aria-hidden />
        <span className="sr-only">Switch project</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Switch project</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={projectId ?? ""}
          onValueChange={(id) => router.push(`/projects/${id}/${section}`)}
        >
          {projects.data.map((project) => (
            <DropdownMenuRadioItem key={project.id} value={project.id} className="min-h-control-md">
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-bold">{project.name}</span>
                <span className="text-caption text-foreground-subtle">
                  {project.code} · {project.phase}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/projects">
            <LayoutGrid aria-hidden /> All projects
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
