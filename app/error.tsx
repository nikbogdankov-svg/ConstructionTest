"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { SystemUnavailable } from "@/components/patterns/system-unavailable";

/** App-wide fallback when a page crashes: shows the "system unavailable" screen with a retry. */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <SystemUnavailable onRetry={retry} />;
}
