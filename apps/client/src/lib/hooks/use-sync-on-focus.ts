import { useEffect } from "react"
import { useDashboards } from "@doska/core"
import { pullBoards } from "../pull-boards"

/** Pulls every board when the window or tab regains focus, so what changed on
 * another device while this one was in the background is there on return. */
export function useSyncOnFocus() {
  const { data: dashboards = [] } = useDashboards()
  const boardIds = dashboards.map((d) => d.id).join(",")

  useEffect(() => {
    if (!boardIds) return
    const ids = boardIds.split(",")

    function onFocus() {
      if (document.visibilityState === "visible") pullBoards(ids)
    }

    // Switching tabs fires both; the throttle in pullBoards makes it one pull.
    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onFocus)
    return () => {
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onFocus)
    }
  }, [boardIds])
}
