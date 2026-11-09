"use client";

import * as React from "react";
import { FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getMockMode, type MockMode } from "@/lib/mock/config";

const LABELS: Record<Exclude<MockMode, "normal">, string> = {
  slow: "Slow responses",
  error: "Errors forced",
  empty: "Empty lists",
  "stream-error": "Stream fails",
  corrupt: "Files corrupted",
};

/** Shows when a ?mock= switch is active so testers know why things look odd. */
export function MockModeBadge() {
  const mode = React.useSyncExternalStore(
    () => () => {},
    () => getMockMode(),
    () => "normal" as MockMode,
  );
  if (mode === "normal") return null;
  return (
    <Badge tone="warning" size="sm" className="mb-2">
      <FlaskConical aria-hidden />
      Mock: {LABELS[mode]}
    </Badge>
  );
}
