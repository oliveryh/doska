import { useCallback, useState, type ReactNode } from "react"
import { SearchModal } from "@/components/search"
import { useSearchShortcut } from "@/lib/hooks"
import { useDeck } from "../deck/deck-context"
import { SearchCtx } from "./search-context"

/**
 * Owns the search overlay and its ⌘K shortcut at the app root, so search
 * opens from any page rather than only from a board's header.
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const boardId = useDeck().id || null

  const openSearch = useCallback(() => setOpen(true), [])
  useSearchShortcut(openSearch)

  return (
    <SearchCtx.Provider value={openSearch}>
      {children}
      <SearchModal open={open} onOpenChange={setOpen} boardId={boardId} />
    </SearchCtx.Provider>
  )
}
