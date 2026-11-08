import { useParams } from "wouter"
import { Sidebar, SidebarContent, SidebarFooter } from "@doska/ui-kit"
import { usePublishedBoards, useSharedBoards } from "@doska/core"
import { useAuth } from "@/lib/hooks"
import { DashboardsList } from "./dashboards-list/dashboards-list"
import { PrioritySummary } from "./priority-summary"
import { SidebarAccount } from "./sidebar-account"
import { useRememberedScroll } from "./use-remembered-scroll"
import { SettingsButton } from "@/components/settings/settings-button"
import { UpcomingButton } from "@/components/digest/upcoming-button"

export function AppSidebar() {
  const { authed } = useAuth()
  const { data: sharedIds = [] } = useSharedBoards(authed === true)
  const { data: publishedIds = [] } = usePublishedBoards(authed === true)

  const activeDashboardId = useParams().id ?? ""
  const scrollRef = useRememberedScroll()

  return (
    <Sidebar className="ml-1">
      <SidebarContent ref={scrollRef} className="group/sidebar">
        <UpcomingButton />
        <DashboardsList
          activeDashboardId={activeDashboardId}
          sharedIds={sharedIds}
          publishedIds={publishedIds}
        />
      </SidebarContent>
      <SidebarFooter>
        <PrioritySummary />
        <div className="flex items-center gap-1">
          <div className="min-w-0 flex-1">
            <SidebarAccount />
          </div>
          <SettingsButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
