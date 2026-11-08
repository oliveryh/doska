import { useParams } from "wouter"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@doska/ui-kit"
import { usePublishedBoards, useSharedBoards } from "@doska/core"
import { useAuth } from "@/lib/hooks"
import { DashboardsList } from "./dashboards-list/dashboards-list"
import { SidebarAccount } from "./sidebar-account"
import { SettingsButton } from "@/components/settings/settings-button"
import { UpcomingButton } from "@/components/digest/upcoming-button"

export function AppSidebar() {
  const { authed } = useAuth()
  const { data: sharedIds = [] } = useSharedBoards(authed === true)
  const { data: publishedIds = [] } = usePublishedBoards(authed === true)

  const activeDashboardId = useParams().id ?? ""

  return (
    <Sidebar className="ml-1">
      <SidebarContent className="group/sidebar">
        <UpcomingButton />
        <DashboardsList
          activeDashboardId={activeDashboardId}
          sharedIds={sharedIds}
          publishedIds={publishedIds}
        />
      </SidebarContent>
      <SidebarFooter>
        <SettingsButton />
        <SidebarAccount />
      </SidebarFooter>
    </Sidebar>
  )
}
