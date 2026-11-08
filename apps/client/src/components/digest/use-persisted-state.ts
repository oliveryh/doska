import { useEffect, useState } from "react"

/** `useState` backed by localStorage. A stored value that is missing, unparsable
 * or fails `isValid` falls back to `initial`. */
export function usePersistedState<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return initial
      const parsed: unknown = JSON.parse(raw)
      return isValid(parsed) ? parsed : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be unavailable or full; the filter then just isn't kept.
    }
  }, [key, value])

  return [value, setValue] as const
}
