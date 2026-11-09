import Link from "next/link";
import { CloudOff, RotateCw } from "lucide-react";
import { ProductLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export interface SystemUnavailableProps {
  /** Re-try the failed render (error boundary). Without it, "Try again" links back to the projects page. */
  onRetry?: () => void;
}

/** Full-screen "Plumb is unavailable" page. Used by the /unavailable route and the app-wide error boundary. */
export function SystemUnavailable({ onRetry }: SystemUnavailableProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background p-6">
      <ProductLogo />
      <EmptyState
        framed
        size="lg"
        tone="danger"
        icon={<CloudOff />}
        headingLevel="h1"
        title="Plumb is unavailable right now"
        description="We can't reach the system at the moment. Your projects, documents and memory are safe. Try again in a few minutes."
        className="w-full max-w-prose"
        actions={
          <>
            {onRetry ? (
              <Button onClick={onRetry}>
                <RotateCw aria-hidden />
                Try again
              </Button>
            ) : (
              <Button asChild>
                <Link href="/projects">
                  <RotateCw aria-hidden />
                  Try again
                </Link>
              </Button>
            )}
            <Button asChild variant="secondary">
              <Link href="/projects">Go to projects</Link>
            </Button>
          </>
        }
      />
    </main>
  );
}
