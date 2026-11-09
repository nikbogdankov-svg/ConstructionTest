import type { Metadata } from "next";
import { Suspense } from "react";
import { ChatScreen } from "@/features/chat/chat-screen";
import { ChatThreadLoading } from "@/features/chat/chat-loading";

export const metadata: Metadata = { title: "Chat" };

/** Route files stay thin: read params, render the feature component. */
export default async function ChatPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return (
    <Suspense fallback={<ChatThreadLoading />}>
      <ChatScreen projectId={projectId} />
    </Suspense>
  );
}
