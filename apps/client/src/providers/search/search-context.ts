import { createContext, useContext } from "react"

export const SearchCtx = createContext<() => void>(() => {})

/** Opens the search overlay, from the header button or anywhere else. */
export function useOpenSearch() {
  return useContext(SearchCtx)
}
