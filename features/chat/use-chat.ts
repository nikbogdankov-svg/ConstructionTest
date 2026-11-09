"use client";

import * as React from "react";
import { NOT_FOUND_ANSWER, ask } from "@/lib/mock/api";
import { isAbortError, isMockApiError } from "@/lib/mock/errors";
import type { ChatMessage, Citation } from "@/lib/mock/types";

/**
 * Chat state & data logic. No markup lives here, so the visual layer
 * (chat-*.tsx) can be redesigned without touching this file.
 */

export type AnswerStatus = "thinking" | "streaming" | "done" | "stopped" | "error";

export interface Answer {
  status: AnswerStatus;
  /** Markdown, grows token by token while streaming. */
  content: string;
  citations: Citation[];
  followUps: string[];
  /** false = the documents don't contain the answer. null = not known yet. */
  found: boolean | null;
  /** User-facing reason when status is "error". */
  error: string | null;
}

/** One question and its answer. */
export interface Exchange {
  id: string;
  question: string;
  answer: Answer;
}

const emptyAnswer = (status: AnswerStatus): Answer => ({
  status,
  content: "",
  citations: [],
  followUps: [],
  found: null,
  error: null,
});

/** Turns a stored conversation (alternating user/assistant messages) into exchanges. */
export function messagesToExchanges(messages: ChatMessage[]): Exchange[] {
  const exchanges: Exchange[] = [];
  for (const message of messages) {
    if (message.role === "user") {
      exchanges.push({ id: message.id, question: message.content, answer: emptyAnswer("done") });
      continue;
    }
    const current = exchanges.at(-1);
    if (!current) continue;
    current.answer = {
      status: "done",
      content: message.content,
      citations: message.citations,
      followUps: [],
      found: message.content.trim() !== NOT_FOUND_ANSWER,
      error: null,
    };
  }
  return exchanges;
}

let exchangeCounter = 0;
const newExchangeId = () => `ex-${Date.now().toString(36)}-${++exchangeCounter}`;

function describeError(error: unknown): string {
  if (isMockApiError(error) && error.code === "network") return "The connection dropped while Plumb was answering.";
  if (isMockApiError(error) && error.code === "validation") return error.message;
  return "Plumb couldn't reach the server.";
}

export function useChat(projectId: string, initialExchanges: Exchange[] = []) {
  const [exchanges, setExchanges] = React.useState<Exchange[]>(initialExchanges);
  const controllerRef = React.useRef<AbortController | null>(null);

  // Abort a running answer when the screen unmounts.
  React.useEffect(() => () => controllerRef.current?.abort(), []);

  const updateAnswer = React.useCallback((id: string, update: (answer: Answer) => Answer) => {
    setExchanges((list) => list.map((ex) => (ex.id === id ? { ...ex, answer: update(ex.answer) } : ex)));
  }, []);

  const run = React.useCallback(
    async (id: string, question: string) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      updateAnswer(id, () => emptyAnswer("thinking"));

      try {
        for await (const event of ask(projectId, question, { signal: controller.signal })) {
          if (event.type === "token") {
            updateAnswer(id, (a) => ({ ...a, status: "streaming", content: a.content + event.value }));
          } else if (event.type === "citations") {
            updateAnswer(id, (a) => ({ ...a, citations: event.citations }));
          } else if (event.type === "done") {
            updateAnswer(id, (a) => ({ ...a, status: "done", found: event.found, followUps: event.followUps }));
          }
        }
      } catch (error) {
        if (controller.signal.aborted || isAbortError(error)) {
          updateAnswer(id, (a) => ({ ...a, status: "stopped" }));
        } else {
          updateAnswer(id, (a) => ({ ...a, status: "error", error: describeError(error) }));
        }
      } finally {
        if (controllerRef.current === controller) controllerRef.current = null;
      }
    },
    [projectId, updateAnswer],
  );

  const latest = exchanges.at(-1);
  const isBusy = latest?.answer.status === "thinking" || latest?.answer.status === "streaming";

  const send = React.useCallback(
    (question: string) => {
      const text = question.trim();
      if (!text || isBusy) return false;
      const id = newExchangeId();
      setExchanges((list) => [...list, { id, question: text, answer: emptyAnswer("thinking") }]);
      void run(id, text);
      return true;
    },
    [isBusy, run],
  );

  const stop = React.useCallback(() => controllerRef.current?.abort(), []);

  const retry = React.useCallback(
    (id: string) => {
      const exchange = exchanges.find((ex) => ex.id === id);
      if (!exchange || isBusy) return;
      void run(id, exchange.question);
    },
    [exchanges, isBusy, run],
  );

  return { exchanges, isBusy, send, stop, retry };
}
