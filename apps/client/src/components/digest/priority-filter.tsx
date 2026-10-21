import {
  Button,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  cn,
} from "@doska/ui-kit"
import { PRIORITIES } from "@doska/tokens"
import { Check } from "lucide-react"

interface IProps {
  active: string[]
  onTogglePriority: (id: string) => void
}

/** Restricts the digest to the chosen priorities, pulling in every matching
 * card regardless of deadline — unlike the date filter, which only ever shows
 * deadlined cards. */
export function PriorityFilter({ active, onTogglePriority }: IProps) {
  const isFiltered = active.length > 0

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            size="sm"
            variant={isFiltered ? "secondary" : "ghost"}
            className={cn(!isFiltered && "text-muted-foreground")}
          />
        }
      >
        Priority
      </MenuTrigger>
      <MenuContent align="end" className="w-40">
        {PRIORITIES.map((priority) => (
          <MenuItem
            key={priority.id}
            closeOnClick={false}
            onClick={() => onTogglePriority(priority.id)}
          >
            <span className="truncate">{priority.label}</span>
            {active.includes(priority.id) && <Check className="ml-auto" />}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  )
}
