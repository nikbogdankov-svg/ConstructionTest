import type { MemoryFact } from "./types";
import seed from "./data/memory.json";

/**
 * Memory facts live in localStorage so edits survive reloads.
 * First read seeds from data/memory.json. `resetMemoryStore()` restores the seed.
 */
const STORAGE_KEY = "plumb.mock.memory.v1";

function canUseStorage() {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

let fallback: MemoryFact[] | null = null;

export function readMemory(): MemoryFact[] {
  if (!canUseStorage()) return (fallback ??= structuredClone(seed as MemoryFact[]));
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as MemoryFact[];
    } catch {
      // corrupted — reseed below
    }
  }
  const initial = structuredClone(seed as MemoryFact[]);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export function writeMemory(facts: MemoryFact[]) {
  if (!canUseStorage()) {
    fallback = facts;
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(facts));
}

export function resetMemoryStore() {
  if (canUseStorage()) window.localStorage.removeItem(STORAGE_KEY);
  fallback = null;
}
