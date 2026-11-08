import { Button, InvisibleInput } from "@doska/ui-kit"
import { Plus } from "lucide-react"
import { PageHeader } from "../../app/page-header"
import { BoardActionsMenu } from "./board-actions-menu"
import { SearchButton } from "./search-button"
import { RowViewButton } from "./row-view-button"
import { HideBacklogButton } from "./hide-backlog-button"
import { ShareButton } from "./share-button"
import { UserFilter } from "./user-filter"
import type { Column, DashboardView } from "@doska/core"
import { VaultButton } from "./vault-button"
import { isDesktop } from "@/lib/platform"

interface IProps {
  boardId: string
  title: string
  columns: Column[]
  sort: string[]
  view: DashboardView
  hideBacklog: boolean
  onToggleHideBacklog: () => void
  onRename: (name: string) => void
  onDelete: () => void
  onReorderColumns: (changed: Column[]) => void
  onChangeSort: (sort: string[]) => void
  onChangeView: (view: DashboardView) => void
  onAddCard: () => void
  addCardDisabledReason?: string
}

export function DeckHeader({
  boardId,
  title,
  columns,
  sort,
  view,
  hideBacklog,
  onToggleHideBacklog,
  onRename,
  onDelete,
  onReorderColumns,
  onChangeSort,
  onChangeView,
  onAddCard,
  addCardDisabledReason,
}: IProps) {
  return (
    <PageHeader>
      <InvisibleInput
        value={title}
        onCommit={onRename}
        label="Board name"
        className="min-w-0 flex-1 text-base font-semibold sm:min-w-68 sm:flex-none"
      />

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <UserFilter boardId={boardId} />
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Add card"
          className="text-muted-foreground"
          onClick={onAddCard}
          disabled={!!addCardDisabledReason}
          tooltip={addCardDisabledReason ?? true}
        >
          <Plus />
        </Button>
        <SearchButton />
        <HideBacklogButton
          hideBacklog={hideBacklog}
          onToggle={onToggleHideBacklog}
        />
        <RowViewButton view={view} onChangeView={onChangeView} />
        <ShareButton boardId={boardId} title={title} />
        {isDesktop() && <VaultButton boardId={boardId} />}
        <BoardActionsMenu
          boardId={boardId}
          title={title}
          columns={columns}
          sort={sort}
          onChangeSort={onChangeSort}
          onDelete={onDelete}
          onReorderColumns={onReorderColumns}
        />
      </div>
    </PageHeader>
  )
}
