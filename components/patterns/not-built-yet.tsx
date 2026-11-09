import type { ReactNode } from "react";
import { PencilRuler } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

/** Placeholder for screens that are part of TASKS.md. Replace the whole page when you build it. */
export function NotBuiltYet({ feature, description }: { feature: string; description?: ReactNode }) {
  return (
    <EmptyState
      framed
      size="lg"
      icon={<PencilRuler />}
      title="Not built yet"
      description={description ?? `${feature} is on the way. See TASKS.md for what this screen needs to do.`}
    />
  );
}
