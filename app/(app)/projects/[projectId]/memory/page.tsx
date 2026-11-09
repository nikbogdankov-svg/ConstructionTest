import type { Metadata } from "next";
import { NotBuiltYet } from "@/components/patterns/not-built-yet";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Memory" };

// TODO(TASKS.md): replace this placeholder with the real Memory screen.
export default function MemoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Memory" description="Decisions, deadlines, contacts and changes Plumb remembers about this project." />
      <NotBuiltYet feature="Memory" />
    </div>
  );
}
