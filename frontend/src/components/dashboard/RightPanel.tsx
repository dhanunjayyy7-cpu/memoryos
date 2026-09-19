import { AskMemoryCard } from "@/components/dashboard/AskMemoryCard"
import { ActiveContextsCard } from "@/components/dashboard/ActiveContextsCard"
import { QuickCaptureCard } from "@/components/dashboard/QuickCaptureCard"
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard"
import type { ActivityItem, MemoryContext } from "@/types/memory"

interface RightPanelProps {
  contexts: MemoryContext[]
  activity: ActivityItem[]
  onCaptured: () => void
}

export function RightPanel({ contexts, activity, onCaptured }: RightPanelProps) {
  return (
    <aside className="flex w-[300px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-dash-border-soft p-4">
      <AskMemoryCard />
      <ActiveContextsCard contexts={contexts} />
      <QuickCaptureCard onCaptured={onCaptured} />
      <RecentActivityCard activity={activity} />
    </aside>
  )
}
