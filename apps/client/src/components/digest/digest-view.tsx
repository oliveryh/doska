import { useEffect, useState } from "react"
import { useLocation, useRoute } from "wouter"
import {
  filterByTags,
  filterByUsers,
  groupBoardCards,
  groupByDeadline,
  type DigestFilter,
  sync,
  useAllCards,
  useDashboards,
  useDigest,
} from "@doska/core"
import { routes } from "@/lib/routes"
import { useDeck } from "@/providers/deck/deck-context"
import { Digest } from "./digest"
import { useHiddenBoards } from "./use-hidden-boards"

/** Connects the digest to its data, and pulls every board so it isn't reading a
 * partial picture — only the open board syncs during normal use. */
export function DigestView() {
  const [, navigate] = useLocation()
  const [, params] = useRoute(routes.card.pattern)
  const [filter, setFilter] = useState<DigestFilter>("week")
  const [hideDone, setHideDone] = useState(false)
  const [priorityFilters, setPriorityFilters] = useState<string[]>([])
  const { hidden, toggleBoard } = useHiddenBoards()
  const { tagFilters = [], userFilters = [] } = useDeck()

  const byPriority = priorityFilters.length > 0

  const { data: dashboards = [] } = useDashboards()
  const dated = useDigest(filter)
  // Only fetched once a priority is picked — the date-bound digest already
  // covers the default view, so there's no point paying for both at once.
  const all = useAllCards(byPriority)
  const { data: entries = [], isPending, error } = byPriority ? all : dated

  function togglePriority(id: string) {
    setPriorityFilters((current) =>
      current.includes(id) ? current.filter((p) => p !== id) : [...current, id]
    )
  }

  // The board list is what defines "every board", so this waits for it rather
  // than firing on mount. Re-running when a board is added is the point.
  const boardIds = dashboards.map((d) => d.id).join(",")
  useEffect(() => {
    if (!boardIds) return
    void sync.watchBoards(boardIds.split(","))
    return () => void sync.watchBoards([])
  }, [boardIds])

  const matching = filterByUsers(
    filterByTags(
      entries.map((e) => e.card),
      tagFilters
    ),
    userFilters
  )
  const visible = entries.filter(
    (e) =>
      matching.includes(e.card) &&
      !hidden.includes(e.boardId) &&
      !(hideDone && e.isDone) &&
      (!byPriority || priorityFilters.includes(e.card.priority))
  )
  // Priority mode spans every card, dated or not, so it groups the way a
  // board's own card list does rather than by deadline.
  const groups = byPriority
    ? groupBoardCards(visible)
    : groupByDeadline(visible)

  return (
    <Digest
      filter={filter}
      onChangeFilter={setFilter}
      groups={groups}
      isLoading={isPending}
      error={error}
      hideDone={hideDone}
      onToggleHideDone={() => setHideDone((v) => !v)}
      boards={dashboards}
      hiddenBoards={hidden}
      onToggleBoard={toggleBoard}
      priorityFilters={priorityFilters}
      onTogglePriority={togglePriority}
      openCardId={params?.id ?? null}
      onOpenCard={(entry) => navigate(routes.card.to(entry.card.id))}
    />
  )
}
