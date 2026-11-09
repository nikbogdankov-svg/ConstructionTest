import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <EmptyState
        size="lg"
        icon={<SearchX />}
        title="Page not found"
        description="The link may be old or mistyped."
        headingLevel="h1"
        actions={
          <Button asChild>
            <Link href="/projects">Go to projects</Link>
          </Button>
        }
      />
    </main>
  );
}
