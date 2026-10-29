import { useEffect } from "react"
import { Home } from "@/components"
import { useActiveDashboard } from "@/lib/hooks"
import { AppShell } from "./app-shell"

const NO_DECK = { id: "", sort: [] }

/**
 * The landing screen. Redirects straight into a board when one's available
 * (the last one open, or the first in sidebar order), so the picker only
 * shows for a genuinely empty account.
 */
export function HomePage() {
  const {
    dashboards,
    dashboardsLoading,
    lastBoard,
    selectDashboard,
    createAndOpenDashboard,
  } = useActiveDashboard()

  const target = lastBoard ?? dashboards[0] ?? null

  useEffect(() => {
    if (!dashboardsLoading && target) selectDashboard(target.id)
  }, [dashboardsLoading, target, selectDashboard])

  return (
    <AppShell deck={NO_DECK}>
      <Home
        hasBoards={dashboards.length > 0}
        lastBoard={lastBoard}
        onContinue={() => lastBoard && selectDashboard(lastBoard.id)}
        onCreateDashboard={createAndOpenDashboard}
      />
    </AppShell>
  )
}
