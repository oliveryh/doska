import { SidebarMenuButton, cn, useSidebar } from "@doska/ui-kit"
import { Globe, Users } from "lucide-react"
import { useMemo } from "react"
import type { Dashboard } from "@doska/core"
import { useCardDrop } from "@/providers/card-drop/card-drop-context"
import { useDashboardNav } from "@/lib/hooks"

interface IProps {
  dashboard: Dashboard
  isActive: boolean
  isPublished: boolean
  isShared: boolean
  /** Not-done card count, from the sidebar's per-board tally. Undefined while
   * loading, or absent entirely for a board with nothing incomplete. */
  incompleteCount?: number
}

export function BoardItem({
  dashboard,
  isActive,
  isPublished,
  isShared,
  incompleteCount,
}: IProps) {
  const { selectDashboard } = useDashboardNav()
  const { isMobile, setOpenMobile } = useSidebar()
  const { target } = useCardDrop()
  const isCardTarget = target?.kind === "board" && target.id === dashboard.id
  const marker = useMemo(() => {
    if (isPublished) return { Icon: Globe, label: "Public" }
    if (isShared) return { Icon: Users, label: "Shared" }
    return null
  }, [isPublished, isShared])

  return (
    <SidebarMenuButton
      isActive={isActive}
      tooltip={dashboard.title}
      onClick={() => {
        selectDashboard(dashboard.id)
        if (isMobile) setOpenMobile(false)
      }}
      data-drop-board={isActive ? undefined : dashboard.id}
      className={cn(
        isCardTarget && "bg-sidebar-accent ring-2 ring-primary/60 ring-inset"
      )}
    >
      <span className="truncate">{dashboard.title}</span>
      <span className="ml-auto flex items-center gap-1.5">
        {!!incompleteCount && (
          <span className="text-xs text-muted-foreground/70 tabular-nums">
            {incompleteCount}
          </span>
        )}
        {marker && (
          <marker.Icon
            role="img"
            aria-label={marker.label}
            className="size-3.5 text-muted-foreground"
          />
        )}
      </span>
    </SidebarMenuButton>
  )
}
