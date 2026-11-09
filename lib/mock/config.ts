/**
 * Mock behaviour switch, controlled from the URL so every state can be tested:
 *
 *   ?mock=slow          every call takes 3–5 s
 *   ?mock=error         every call fails (MockApiError "server")
 *   ?mock=empty         list calls return [] (empty states on a full project)
 *   ?mock=stream-error  ask() streams part of the answer, then fails
 *   ?mock=off           back to normal (300–1200 ms latency)
 *
 * The mode is remembered for the browser tab (sessionStorage) so it survives
 * client-side navigation; pass ?mock=off to clear it.
 */
export type MockMode = "normal" | "slow" | "error" | "empty" | "stream-error";

const STORAGE_KEY = "plumb.mock.mode";
const MODES: MockMode[] = ["normal", "slow", "error", "empty", "stream-error"];

export function getMockMode(): MockMode {
  if (typeof window === "undefined") return "normal";
  const fromUrl = new URLSearchParams(window.location.search).get("mock");
  try {
    if (fromUrl === "off" || fromUrl === "normal") {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return "normal";
    }
    if (fromUrl && (MODES as string[]).includes(fromUrl)) {
      window.sessionStorage.setItem(STORAGE_KEY, fromUrl);
      return fromUrl as MockMode;
    }
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored && (MODES as string[]).includes(stored)) return stored as MockMode;
  } catch {
    // sessionStorage can be unavailable (privacy mode); fall through.
  }
  return "normal";
}

export function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

const rand = (min: number, max: number) => Math.round(min + Math.random() * (max - min));

/** Simulated network latency: 300–1200 ms, or 3–5 s in slow mode. */
export function latency(mode: MockMode = getMockMode()) {
  return mode === "slow" ? rand(3000, 5000) : rand(300, 1200);
}

/** Delay between streamed tokens. */
export function tokenDelay(mode: MockMode = getMockMode()) {
  return mode === "slow" ? rand(80, 180) : rand(15, 55);
}
