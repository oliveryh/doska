import { sync } from "@doska/core"

/** Only the open board syncs during normal use, so anything that wants the rest
 * asks here. Throttled, because a pull is a request per board and the callers
 * (window focus, opening search) can fire in quick succession. */
const MIN_INTERVAL_MS = 30_000
let lastPull = 0

export function pullBoards(boardIds: string[]) {
  if (boardIds.length === 0 || Date.now() - lastPull < MIN_INTERVAL_MS) return
  lastPull = Date.now()
  void sync.reconcileBoards(boardIds)
}
