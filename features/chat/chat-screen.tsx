"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, MessageSquareX, MessagesSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/patterns/query-error-state";
import { useProject } from "@/features/projects/project-context";
import { useMockQuery } from "@/lib/hooks/use-mock-query";
import { getConversation, listConversations, listDocuments } from "@/lib/mock/api";
import { isMockApiError } from "@/lib/mock/errors";
import type { Citation, DocumentSummary } from "@/lib/mock/types";
import { ChatComposer, type ChatComposerHandle } from "./chat-composer";
import { ChatExchange } from "./chat-exchange";
import { ChatThreadLoading } from "./chat-loading";
import { ChatWelcome } from "./chat-welcome";
import { ConversationList } from "./conversation-list";
import { messagesToExchanges, useChat, type Exchange } from "./use-chat";
import { useFollowScroll } from "./use-follow-scroll";

/**
 * Chat screen: /projects/[projectId]/chat (new) and /chat/[conversationId] (past).
 * Data and streaming state live in use-chat.ts; this file and chat-*.tsx are the visual layer.
 */
export function ChatScreen({ projectId, conversationId = null }: { projectId: string; conversationId?: string | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const project = useProject();
  const [listOpen, setListOpen] = React.useState(false);
  const [newChatKey, setNewChatKey] = React.useState(0);

  const conversations = useMockQuery((signal) => listConversations(projectId, { signal }), [projectId]);
  const documents = useMockQuery((signal) => listDocuments(projectId, {}, { signal }), [projectId]);

  const documentsById = React.useMemo(
    () => new Map<string, DocumentSummary>((documents.data ?? []).map((doc) => [doc.id, doc])),
    [documents.data],
  );

  // Citation chips put the source in the URL (?doc=…&page=…) so the source viewer can open it and a reload restores it.
  const openCitation = React.useCallback(
    (citation: Citation) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("doc", citation.documentId);
      params.set("page", String(citation.page));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const onListNavigate = (isNewConversation: boolean) => {
    setListOpen(false);
    // Already on /chat: the URL doesn't change, so start a fresh thread explicitly.
    if (isNewConversation && !conversationId) setNewChatKey((k) => k + 1);
  };

  const activeTitle = conversationId
    ? conversations.data?.find((c) => c.id === conversationId)?.title
    : undefined;

  const list = (
    <ConversationList
      projectId={projectId}
      activeId={conversationId}
      conversations={conversations}
      onNavigate={onListNavigate}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={
          project.status === "success" ? project.data.code : project.status === "loading" ? <Skeleton className="h-4 w-12" /> : undefined
        }
        title={activeTitle ?? "Chat"}
        description="Ask questions about this project and get answers with sources."
        actions={
          <>
            <Sheet open={listOpen} onOpenChange={setListOpen}>
              <SheetTrigger asChild>
                <Button variant="secondary" className="xl:hidden">
                  <MessagesSquare aria-hidden />
                  Conversations
                </Button>
              </SheetTrigger>
              <SheetContent side="left" size="sm">
                <SheetHeader>
                  <SheetTitle>Conversations</SheetTitle>
                  <SheetDescription>Start a new one or reopen a past conversation.</SheetDescription>
                </SheetHeader>
                <SheetBody>{list}</SheetBody>
              </SheetContent>
            </Sheet>
            {conversationId && (
              <Button asChild variant="primary">
                <Link href={`/projects/${projectId}/chat`}>
                  <Plus aria-hidden />
                  New conversation
                </Link>
              </Button>
            )}
          </>
        }
      />

      <div className="flex gap-8">
        <aside className="hidden w-sidebar shrink-0 xl:block">
          <div className="sticky top-24">{list}</div>
        </aside>

        <div className="mx-auto flex w-full max-w-prose min-w-0 flex-col">
          {conversationId ? (
            <PastConversation
              projectId={projectId}
              conversationId={conversationId}
              documents={documentsById}
              onOpenCitation={openCitation}
            />
          ) : (
            <ChatThread
              key={newChatKey}
              projectId={projectId}
              initialExchanges={[]}
              documents={documentsById}
              onOpenCitation={openCitation}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface ThreadDataProps {
  projectId: string;
  documents: Map<string, DocumentSummary>;
  onOpenCitation: (citation: Citation) => void;
}

function PastConversation({ conversationId, ...props }: ThreadDataProps & { conversationId: string }) {
  const conversation = useMockQuery((signal) => getConversation(conversationId, { signal }), [conversationId]);
  const initialExchanges = React.useMemo(
    () => (conversation.data ? messagesToExchanges(conversation.data.messages) : []),
    [conversation.data],
  );

  if (conversation.status === "loading") return <ChatThreadLoading />;

  const notFound =
    (conversation.status === "error" && isMockApiError(conversation.error) && conversation.error.code === "not-found") ||
    (conversation.status === "success" && conversation.data.projectId !== props.projectId);

  if (notFound) {
    return (
      <EmptyState
        framed
        size="lg"
        icon={<MessageSquareX />}
        title="Conversation not found"
        description="It may have been deleted, or the link belongs to another project."
        actions={
          <Button asChild>
            <Link href={`/projects/${props.projectId}/chat`}>Start a new conversation</Link>
          </Button>
        }
      />
    );
  }

  if (conversation.status === "error") {
    return <QueryErrorState error={conversation.error} onRetry={conversation.refetch} action="load this conversation" />;
  }

  return <ChatThread key={conversationId} initialExchanges={initialExchanges} {...props} />;
}

function liveMessage(exchange: Exchange | undefined): string {
  if (!exchange) return "";
  const { answer } = exchange;
  switch (answer.status) {
    case "thinking":
      return "Plumb is checking your documents…";
    case "streaming":
      return "Plumb is answering…";
    case "stopped":
      return "Answer stopped.";
    case "error":
      return ""; // The error Alert announces itself (role="alert").
    case "done":
      if (answer.found === false) return "Plumb couldn't find this in your documents.";
      return answer.citations.length > 0
        ? `Answer ready, with ${answer.citations.length} source${answer.citations.length === 1 ? "" : "s"}.`
        : "Answer ready.";
  }
}

function ChatThread({ projectId, initialExchanges, documents, onOpenCitation }: ThreadDataProps & { initialExchanges: Exchange[] }) {
  const { exchanges, isBusy, send, stop, retry } = useChat(projectId, initialExchanges);
  const composerRef = React.useRef<ChatComposerHandle>(null);
  const [hasAsked, setHasAsked] = React.useState(false);

  const latest = exchanges.at(-1);
  const scrollSignal = `${exchanges.length}:${latest?.answer.status}:${latest?.answer.content.length ?? 0}`;
  const { isAtBottom, jumpToLatest, follow } = useFollowScroll(scrollSignal);

  const handleSend = (question: string) => {
    const accepted = send(question);
    if (accepted) {
      setHasAsked(true);
      follow();
    }
    return accepted;
  };

  // Suggestions and follow-ups disappear once used, so move focus to the input.
  const handleAsk = (question: string) => {
    handleSend(question);
    composerRef.current?.focus();
  };

  const handleRetry = (id: string) => {
    setHasAsked(true);
    follow();
    retry(id);
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {hasAsked ? liveMessage(latest) : ""}
      </p>

      {exchanges.length === 0 ? (
        <ChatWelcome projectId={projectId} onAsk={handleAsk} />
      ) : (
        <ol aria-label="Conversation" className="flex flex-col gap-8">
          {exchanges.map((exchange, index) => (
            <ChatExchange
              key={exchange.id}
              exchange={exchange}
              isLatest={index === exchanges.length - 1}
              isBusy={isBusy}
              documents={documents}
              onRetry={handleRetry}
              onAsk={handleAsk}
              onOpenCitation={onOpenCitation}
            />
          ))}
        </ol>
      )}

      <div className="sticky bottom-0 z-10 border-t-2 border-border bg-background pt-4 pb-4">
        {!isAtBottom && exchanges.length > 0 && (
          <div className="absolute inset-x-0 bottom-full flex justify-center pb-3">
            <Button variant="secondary" className="shadow-md" onClick={jumpToLatest}>
              <ArrowDown aria-hidden />
              Jump to latest
            </Button>
          </div>
        )}
        <ChatComposer ref={composerRef} isBusy={isBusy} onSend={handleSend} onStop={stop} />
      </div>
    </div>
  );
}
