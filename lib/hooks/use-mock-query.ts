"use client";

import * as React from "react";
import { isAbortError } from "@/lib/mock/errors";

export type QueryState<T> =
  | { status: "loading"; data: undefined; error: undefined }
  | { status: "error"; data: undefined; error: Error }
  | { status: "success"; data: T; error: undefined };

export type QueryResult<T> = QueryState<T> & {
  /** Re-run the request (e.g. from a "Try again" button). */
  refetch: () => void;
  /** True while new data loads and the previous data is still shown (e.g. after changing the sort). */
  isRefetching: boolean;
};

type Settled<T> = { key: string; data?: T; error?: Error };

/**
 * Minimal data-fetching hook for the mock API.
 *
 *   const docs = useMockQuery(
 *     (signal) => listDocuments(projectId, { sort }, { signal }),
 *     [projectId, sort.key, sort.direction],
 *   );
 *   if (docs.status === "loading") …
 *
 * - `deps` must be serialisable (strings/numbers/booleans).
 * - Aborts the previous request when deps change or the component unmounts.
 * - Keeps the previous data on screen while new data loads (`isRefetching`).
 * - Key the component by the entity id (e.g. projectId) if stale data from
 *   another entity must never be shown.
 */
export function useMockQuery<T>(fetcher: (signal: AbortSignal) => Promise<T>, deps: ReadonlyArray<string | number | boolean | null | undefined>): QueryResult<T> {
  const [nonce, setNonce] = React.useState(0);
  const key = JSON.stringify([...deps, nonce]);
  const [settled, setSettled] = React.useState<Settled<T> | null>(null);
  const [lastData, setLastData] = React.useState<{ data: T } | null>(null);
  const fetcherRef = React.useRef(fetcher);

  React.useEffect(() => {
    fetcherRef.current = fetcher;
  });

  React.useEffect(() => {
    const controller = new AbortController();
    fetcherRef
      .current(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setSettled({ key, data });
        setLastData({ data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return;
        setSettled({ key, error: error instanceof Error ? error : new Error(String(error)) });
        setLastData(null);
      });
    return () => controller.abort();
  }, [key]);

  const refetch = React.useCallback(() => setNonce((n) => n + 1), []);
  const current = settled?.key === key ? settled : null;

  if (current?.error) return { status: "error", data: undefined, error: current.error, refetch, isRefetching: false };
  if (current) return { status: "success", data: current.data as T, error: undefined, refetch, isRefetching: false };
  if (lastData) return { status: "success", data: lastData.data, error: undefined, refetch, isRefetching: true };
  return { status: "loading", data: undefined, error: undefined, refetch, isRefetching: false };
}
