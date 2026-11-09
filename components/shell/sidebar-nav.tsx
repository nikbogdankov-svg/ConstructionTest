"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProductLogo } from "@/components/brand/logo";
import { PROJECT_NAV, WORKSPACE_NAV } from "./nav-items";
import { MockModeBadge } from "./mock-mode-badge";

const itemClass = (active: boolean) =>
  cn(
    "flex min-h-control-md items-center gap-3 rounded-sm px-3 text-label transition-colors focus-visible:focus-ring [&_svg]:size-icon-md [&_svg]:shrink-0",
    active
      ? "bg-primary-subtle text-primary-subtle-foreground shadow-[inset_4px_0_0_var(--color-primary)]"
      : "text-foreground-muted hover:bg-surface-hover hover:text-foreground",
  );

/** Sidebar contents. Rendered in the desktop rail and inside the mobile drawer. */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const params = useParams<{ projectId?: string }>();
  const projectId = params.projectId;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-topbar shrink-0 items-center px-5">
        <Link href="/projects" onClick={onNavigate} className="rounded-sm focus-visible:focus-ring" aria-label="Plumb — all projects">
          <ProductLogo />
        </Link>
      </div>

      <nav aria-label="Main" className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
        {projectId && (
          <div className="flex flex-col gap-1">
            <p className="px-3 pb-1 text-overline uppercase text-foreground-subtle">This project</p>
            <ul className="flex flex-col gap-1">
              {PROJECT_NAV.map((item) => {
                const href = `/projects/${projectId}/${item.segment}`;
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <li key={item.segment}>
                    <Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={itemClass(active)}>
                      <item.icon aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-overline uppercase text-foreground-subtle">Workspace</p>
          <ul className="flex flex-col gap-1">
            {WORKSPACE_NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={itemClass(active)}>
                    <item.icon aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="shrink-0 border-t-2 border-border p-4">
        <MockModeBadge />
        <p className="text-caption text-foreground-subtle">Demo data · nothing leaves your browser</p>
      </div>
    </div>
  );
}
