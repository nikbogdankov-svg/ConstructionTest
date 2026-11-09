import type { Metadata } from "next";
import { NotBuiltYet } from "@/components/patterns/not-built-yet";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Search" };

// TODO(TASKS.md): replace this placeholder with the real Search screen.
export default function SearchPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Search" description="Find documents by name, type, trade and date." />
      <NotBuiltYet feature="Search" />
    </div>
  );
}
