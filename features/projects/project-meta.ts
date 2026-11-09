import type { BadgeProps } from "@/components/ui/badge";
import type { ProjectStatus } from "@/lib/mock/types";

export const PROJECT_STATUS_META: Record<ProjectStatus, { label: string; tone: NonNullable<BadgeProps["tone"]> }> = {
  active: { label: "Active", tone: "success" },
  planning: { label: "Planning", tone: "info" },
  "on-hold": { label: "On hold", tone: "warning" },
  completed: { label: "Completed", tone: "neutral" },
};
