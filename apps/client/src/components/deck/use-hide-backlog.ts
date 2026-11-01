import { useState } from "react"

/** No schema concept of a backlog column — just a column with this exact title. */
export const BACKLOG_COLUMN_TITLE = "Backlog"

// Global, not per-board: flips the same way on every board.
const HIDE_BACKLOG_KEY = "doska:hide-backlog"

function readHideBacklog(): boolean {
  return localStorage.getItem(HIDE_BACKLOG_KEY) === "true"
}

export function useHideBacklog() {
  const [hideBacklog, setHideBacklog] = useState(readHideBacklog)

  function toggleHideBacklog() {
    const next = !hideBacklog
    localStorage.setItem(HIDE_BACKLOG_KEY, String(next))
    setHideBacklog(next)
  }

  return { hideBacklog, toggleHideBacklog }
}
