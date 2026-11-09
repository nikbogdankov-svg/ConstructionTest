export type MockApiErrorCode = "not-found" | "server" | "network" | "validation" | "corrupted";

/** The only error type the mock API throws (apart from AbortError). */
export class MockApiError extends Error {
  readonly code: MockApiErrorCode;
  constructor(code: MockApiErrorCode, message: string) {
    super(message);
    this.name = "MockApiError";
    this.code = code;
  }
}

export function isMockApiError(error: unknown): error is MockApiError {
  return error instanceof MockApiError;
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}
