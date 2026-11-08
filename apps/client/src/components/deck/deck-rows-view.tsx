import { useLocation, useRoute } from "wouter"
import {
  BACKLOG_COLUMN_TITLE,
  boardDigest,
  groupBoardCards,
  useHideBacklog,
  type Board,
} from "@doska/core"
import { routes } from "@/lib/routes"
import { DeckRows } from "./deck-rows"

interface IProps {
  board: Board
  title: string
}

/**
 * Groups the open board's cards for the row view. Cards in the Backlog column
 * drop out while the hide-backlog toggle is on, as the column does on the board.
 */
export function DeckRowsView({ board, title }: IProps) {
  const [, navigate] = useLocation()
  const [, params] = useRoute(routes.card.pattern)
  const hideBacklog = useHideBacklog()

  const entries = boardDigest(board, title).filter(
    (entry) => !hideBacklog || entry.columnTitle !== BACKLOG_COLUMN_TITLE
  )

  return (
    <DeckRows
      groups={groupBoardCards(entries)}
      openCardId={params?.id ?? null}
      onOpenCard={(entry) => navigate(routes.card.to(entry.card.id))}
    />
  )
}
