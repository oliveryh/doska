import { useCallback } from "react"

// Module scope so it outlives the mobile drawer, which unmounts its content
// every time it closes.
let savedTop = 0

/** Ref callback that restores the sidebar's scroll offset on mount and keeps
 * it up to date as the user scrolls. */
export function useRememberedScroll() {
  return useCallback((el: HTMLDivElement | null) => {
    if (!el) return
    el.scrollTop = savedTop
    const onScroll = () => {
      savedTop = el.scrollTop
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])
}
