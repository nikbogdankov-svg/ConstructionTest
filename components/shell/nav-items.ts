import { FolderOpen, Brain, LayoutGrid, MessageSquareText, Search, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  /** Path segment under /projects/[projectId]/ */
  segment: string;
}

/** Project-scoped navigation. Order = order in the sidebar. */
export const PROJECT_NAV: NavItem[] = [
  { label: "Chat", icon: MessageSquareText, segment: "chat" },
  { label: "Search", icon: Search, segment: "search" },
  { label: "Documents", icon: FolderOpen, segment: "documents" },
  { label: "Memory", icon: Brain, segment: "memory" },
];

export const WORKSPACE_NAV = [{ label: "All projects", icon: LayoutGrid, href: "/projects" }] as const;
