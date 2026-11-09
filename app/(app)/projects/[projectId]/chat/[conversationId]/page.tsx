import type { Metadata } from "next";
import { Suspense } from "react";
import { ChatScreen } from "@/features/chat/chat-screen";
import { ChatThreadLoading } from "@/features/chat/chat-loading";

export const metadata: Metadata = { title: "Chat" };

/** A past conversation. Unknown ids show a not-found state inside ChatScreen. */
export default async function ConversationPage({
  params,
}: {
  params: Promise<{ projectId: string; conversationId: string }>;
}) {
  const { projectId, conversationId } = await params;
  return (
    <Suspense fallback={<ChatThreadLoading />}>
      <ChatScreen projectId={projectId} conversationId={conversationId} />
    </Suspense>
  );
}
