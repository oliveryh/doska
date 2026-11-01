import { useSyncExternalStore } from "react"
import { runtime } from "../runtime"

/** No schema concept of a backlog column — just a column with this exact title. */
export const BACKLOG_COLUMN_TITLE = "Backlog"

// Global, not per-board: flips the same way on every board, and in the sidebar.
const HIDE_BACKLOG_KEY = "doska:hide-backlog"

let hidden: boolean | null = null

const listeners = new Set<() => void>()

function load(): boolean {
  if (hidden === null) hidden = runtime().kv.get(HIDE_BACKLOG_KEY) === "true"
  return hidden
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function toggleHideBacklog(): void {
  hidden = !load()
  runtime().kv.set(HIDE_BACKLOG_KEY, String(hidden))
  for (const listener of [...listeners]) listener()
}

/** Whether this device currently hides the Backlog column, everywhere. */
export function useHideBacklog(): boolean {
  return useSyncExternalStore(subscribe, load, () => false)
}
