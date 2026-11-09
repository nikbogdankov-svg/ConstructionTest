import type { Metadata } from "next";
import { NotBuiltYet } from "@/components/patterns/not-built-yet";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Chat" };

// TODO(TASKS.md): replace this placeholder with the real Chat screen.
export default function ChatPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Chat" description="Ask questions about this project and get answers with sources." />
      <NotBuiltYet feature="Chat" />
    </div>
  );
}
