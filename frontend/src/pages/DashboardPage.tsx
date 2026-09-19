import { useMemo, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopHeader } from "@/components/dashboard/TopHeader"
import { MetricsRow } from "@/components/dashboard/MetricsRow"
import { FilterRow } from "@/components/dashboard/FilterRow"
import { MemoryFlowBoard } from "@/components/dashboard/MemoryFlowBoard"
import { RightPanel } from "@/components/dashboard/RightPanel"
import { useDashboardData, type MemoryColumns } from "@/hooks/useDashboardData"
import type { Memory, MemoryType } from "@/types/memory"
import { Link } from "react-router-dom"

const FILTER_TYPE_MAP: Record<string, MemoryType | undefined> = {
  All: undefined,
  Decisions: "decision",
  Questions: "unresolved",
  Notes: "idea",
}
const FILTER_SOURCE_MAP: Record<string, string | undefined> = {
  Code: "github_commit",
}

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData()
  const [activeNav, setActiveNav] = useState("Dashboard")
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredColumns: MemoryColumns = useMemo(() => {
    if (!data) return { captured: [], processing: [], connected: [], readyToRecall: [], today: [] }
    const type = FILTER_TYPE_MAP[activeFilter]
    const source = FILTER_SOURCE_MAP[activeFilter]
    const noMappingYet = !type && !source && activeFilter !== "All"

    const apply = (list: Memory[]) => {
      if (activeFilter === "All") return list
      if (noMappingYet) return []
      return list.filter((m) => (type ? m.type === type : true) && (source ? m.source === source : true))
    }

    return {
      captured: apply(data.columns.captured),
      processing: apply(data.columns.processing),
      connected: apply(data.columns.connected),
      readyToRecall: apply(data.columns.readyToRecall),
      today: apply(data.columns.today),
    }
  }, [data, activeFilter])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dash-surface">
      <Sidebar active={activeNav} onSelect={setActiveNav} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader />

        {error === "not_configured" && (
          <div className="mx-6 mb-4 rounded-[10px] bg-dash-yellow-soft px-4 py-2.5 text-[12.5px] text-dash-text">
            The backend isn't deployed yet, so this is showing an empty board.{" "}
            <Link to="/settings" className="font-medium underline">
              Check Settings
            </Link>{" "}
            once it's live.
          </div>
        )}
        {error && error !== "not_configured" && (
          <div className="mx-6 mb-4 rounded-[10px] bg-dash-red-soft px-4 py-2.5 text-[12.5px] text-dash-text">
            {error}
          </div>
        )}

        {data && <MetricsRow totalCount={data.totalCount} contexts={data.contexts} sources={data.sources} />}
        <FilterRow active={activeFilter} onSelect={setActiveFilter} />

        {loading ? (
          <div className="flex flex-1 items-center justify-center text-[13px] text-dash-text-muted">
            Loading your memories…
          </div>
        ) : (
          <div className="flex min-h-0 flex-1">
            <MemoryFlowBoard columns={filteredColumns} onAdd={() => setActiveNav("Dashboard")} />
            <RightPanel
              contexts={data?.contexts || []}
              activity={data?.activity || []}
              onCaptured={() => window.location.reload()}
            />
          </div>
        )}
      </div>
    </div>
  )
}
