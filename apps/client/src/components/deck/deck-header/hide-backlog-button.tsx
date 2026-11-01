import { Button } from "@doska/ui-kit"
import { Archive, ArchiveX } from "lucide-react"

interface IProps {
  hideBacklog: boolean
  onToggle: () => void
}

/** Hides the Backlog column, on every board — a global toggle, not per-board. */
export function HideBacklogButton({ hideBacklog, onToggle }: IProps) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={hideBacklog ? "Show backlog column" : "Hide backlog column"}
      aria-pressed={hideBacklog}
      className="text-muted-foreground"
      onClick={onToggle}
    >
      {hideBacklog ? <ArchiveX /> : <Archive />}
    </Button>
  )
}
