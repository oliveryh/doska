import { PRIORITIES, PriorityChip, cn } from "@doska/ui-kit"
import { Flag } from "lucide-react"
import { useHideBacklog, useIncompletePriorityCounts } from "@doska/core"

/** Colored like the flags on a card; "none" is an outline so it reads as unset. */
function PriorityCount({
  count,
  label,
  children,
}: {
  count: number
  label: string
  children: React.ReactNode
}) {
  return (
    <span
      title={`${count} ${label}`}
      aria-label={`${count} ${label}`}
      className={cn("flex items-center gap-1", count === 0 && "opacity-40")}
    >
      {children}
      {count}
    </span>
  )
}

/** Every incomplete card across all boards, split by priority. Floats above
 * the account row so it's in view whichever board is open. */
export function PrioritySummary() {
  const hideBacklog = useHideBacklog()
  const { data: counts } = useIncompletePriorityCounts(hideBacklog)

  if (!counts || counts.total === 0) return null

  return (
    <div
      role="group"
      aria-label="Incomplete cards"
      className="flex items-center gap-3 rounded-md border bg-background px-2.5 py-1.5 text-xs tabular-nums shadow-sm"
    >
      <span title="Incomplete cards across all boards">
        <span className="font-medium">{counts.total}</span>{" "}
        <span className="text-muted-foreground">open</span>
      </span>
      <span className="ml-auto flex items-center gap-2.5 text-muted-foreground">
        {PRIORITIES.map((priority) => (
          <PriorityCount
            key={priority.id}
            count={counts[priority.id as "high" | "medium" | "low"]}
            label={`${priority.label.toLowerCase()} priority`}
          >
            <PriorityChip value={priority.id} />
          </PriorityCount>
        ))}
        <PriorityCount count={counts.none} label="without a priority">
          <Flag className="size-4 md:size-3.5" />
        </PriorityCount>
      </span>
    </div>
  )
}
