import {
  searchCards,
  sync,
  useAllCards,
  useDashboards,
  type SearchHit,
} from "@doska/core"
import { Button, Modal, ModalContent, ModalTitle } from "@doska/ui-kit"
import { Search, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "wouter"
import { useRevealCard } from "@/providers/card-reveal/card-reveal-context"
import { routes } from "@/lib/routes"
import { SearchResultRow } from "./search-result-row"

const LIST_ID = "search-results"
const optionId = (index: number) => `search-result-${index}`

/** Only the open board syncs during normal use, so opening search pulls the
 * rest — but not on every ⌘K, which would be a request per board each time. */
const PULL_INTERVAL_MS = 60_000
let lastPull = 0

type Scope = "all" | "board"

interface IProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The open board, or `null` off a board, where only "all" makes sense. */
  boardId: string | null
}

export function SearchModal({ open, onOpenChange, boardId }: IProps) {
  const [, navigate] = useLocation()
  const { data: entries = [] } = useAllCards(open)
  const { data: dashboards = [] } = useDashboards()
  const reveal = useRevealCard()

  const [scope, setScope] = useState<Scope>("all")
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [lastQuery, setLastQuery] = useState(query)
  const [wasOpen, setWasOpen] = useState(open)

  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setQuery("")
      setScope("all")
    }
  }

  if (query !== lastQuery) {
    setLastQuery(query)
    setActiveIndex(0)
  }

  const boardIds = dashboards.map((d) => d.id).join(",")
  useEffect(() => {
    if (!open || !boardIds || Date.now() - lastPull < PULL_INTERVAL_MS) return
    lastPull = Date.now()
    void sync.reconcileBoards(boardIds.split(","))
  }, [open, boardIds])

  const effectiveScope = boardId ? scope : "all"
  const trimmed = query.trim()

  const scoped = useMemo(
    () =>
      effectiveScope === "board"
        ? entries.filter((e) => e.boardId === boardId)
        : entries,
    [entries, effectiveScope, boardId]
  )
  const origins = useMemo(
    () =>
      new Map(
        entries.map((e) => [
          e.card.id,
          { boardId: e.boardId, boardTitle: e.boardTitle },
        ])
      ),
    [entries]
  )
  const hits = useMemo(
    () =>
      trimmed === ""
        ? []
        : searchCards({
            cards: scoped.map((e) => e.card),
            columns: [
              ...new Map(scoped.map((e) => [e.column.id, e.column])).values(),
            ],
            query: trimmed,
          }),
    [scoped, trimmed]
  )

  function select(hit: SearchHit) {
    const origin = origins.get(hit.card.id)
    if (!origin) return
    onOpenChange(false)
    reveal(hit.card.id)
    // Absolute: the hit can be on any board, and the modal sits outside the
    // deck's nested router.
    navigate(`~${routes.deck.to(origin.boardId)}${routes.card.to(hit.card.id)}`)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (hits.length === 0) return
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setActiveIndex((i) => (i + 1) % hits.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setActiveIndex((i) => (i - 1 + hits.length) % hits.length)
        break
      case "Enter":
        e.preventDefault()
        select(hits[activeIndex])
        break
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="md:top-24 md:max-w-xl md:translate-y-0 md:p-0">
        <ModalTitle className="sr-only">Search cards</ModalTitle>
        <div className="flex items-center gap-2 px-3 py-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Search cards"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={hits.length > 0}
            aria-controls={LIST_ID}
            aria-activedescendant={
              hits.length > 0 ? optionId(activeIndex) : undefined
            }
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {trimmed !== "" && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {hits.length === 1 ? "1 result" : `${hits.length} results`}
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close search"
            onClick={() => onOpenChange(false)}
            className="md:hidden"
          >
            <X />
          </Button>
        </div>
        {boardId && (
          <div className="flex gap-1 border-t px-3 py-1.5">
            {(["all", "board"] as const).map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={effectiveScope === value ? "secondary" : "ghost"}
                aria-pressed={effectiveScope === value}
                onClick={() => setScope(value)}
              >
                {value === "all" ? "All boards" : "This board"}
              </Button>
            ))}
          </div>
        )}
        <div
          id={LIST_ID}
          role="listbox"
          className="max-h-96 overflow-y-auto border-t"
        >
          {trimmed === "" ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              {effectiveScope === "all"
                ? "Search every board by title or notes"
                : "Search this board by title or notes"}
            </p>
          ) : hits.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No cards match &ldquo;{trimmed}&rdquo;
            </p>
          ) : (
            hits.map((hit, index) => (
              <SearchResultRow
                key={hit.card.id}
                id={optionId(index)}
                hit={hit}
                boardTitle={
                  effectiveScope === "all"
                    ? origins.get(hit.card.id)?.boardTitle
                    : undefined
                }
                active={index === activeIndex}
                onSelect={() => select(hit)}
                onHighlight={() => setActiveIndex(index)}
              />
            ))
          )}
        </div>
      </ModalContent>
    </Modal>
  )
}
