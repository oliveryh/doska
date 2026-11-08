import { Button, SidebarGroupLabel } from "@doska/ui-kit"
import { Folder, Plus } from "lucide-react"
import { useCreateFolder } from "@doska/core"
import { useDashboardNav } from "@/lib/hooks"

interface IProps {
  onFolderCreated: (id: string) => void
  /** Incomplete cards across every board; hidden when there are none. */
  totalIncomplete?: number
}

export function BoardsHeader({ onFolderCreated, totalIncomplete }: IProps) {
  const { createAndOpenDashboard } = useDashboardNav()
  const { mutate: createFolder } = useCreateFolder()
  return (
    <SidebarGroupLabel className="mb-1 gap-1 rounded-none pr-0">
      <span className="flex-1 text-sm">Boards</span>
      {!!totalIncomplete && (
        <span
          className="mr-1 text-xs text-muted-foreground/70 tabular-nums"
          title="Incomplete cards across all boards"
        >
          {totalIncomplete}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="New folder"
        className="text-muted-foreground"
        onClick={() =>
          createFolder("New folder", { onSuccess: onFolderCreated })
        }
      >
        <Folder />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="New board"
        className="text-muted-foreground"
        onClick={createAndOpenDashboard}
      >
        <Plus />
      </Button>
    </SidebarGroupLabel>
  )
}
