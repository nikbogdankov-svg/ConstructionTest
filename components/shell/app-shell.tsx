"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";
import { ProjectSwitcher } from "./project-switcher";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

/**
 * Layout: fixed sidebar on lg+, drawer (Sheet) below lg.
 * Top bar holds the drawer button, project switcher, theme toggle and user menu.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = React.useState(pathname);
  if (lastPath !== pathname) {
    // Close the drawer after navigation (render-time state sync, no effect needed).
    setLastPath(pathname);
    setDrawerOpen(false);
  }

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main"
        className="sr-only z-50 rounded-sm bg-accent px-4 py-3 text-label text-accent-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-sidebar border-r-2 border-border bg-surface lg:block">
        <SidebarNav />
      </aside>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" size="sm" className="bg-surface p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Main navigation and project sections</SheetDescription>
          <SidebarNav onNavigate={() => setDrawerOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-dvh flex-col lg:pl-sidebar">
        <header className="sticky top-0 z-20 flex h-topbar shrink-0 items-center gap-2 border-b-2 border-border bg-background/95 px-3 backdrop-blur sm:gap-3 sm:px-6">
          <IconButton label="Open navigation" className="lg:hidden" onClick={() => setDrawerOpen(true)} tooltip={false}>
            <Menu aria-hidden />
          </IconButton>
          <div className="min-w-0 flex-1">
            <ProjectSwitcher />
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        <main id="main" tabIndex={-1} className="flex-1 px-4 py-6 outline-none sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto w-full max-w-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
