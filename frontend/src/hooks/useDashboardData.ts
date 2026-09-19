import { useEffect, useState } from "react"
import { fetchMemories, isApiConfigured } from "@/lib/api"
import type { ActivityItem, ConnectedSource, Memory, MemoryContext } from "@/types/memory"

const SOURCE_LABELS: Record<string, string> = {
  manual_page: "Browser (page)",
  manual_selection: "Browser (selection)",
  github_commit: "GitHub",
}

export interface MemoryColumns {
  captured: Memory[]
  processing: Memory[]
  connected: Memory[]
  readyToRecall: Memory[]
  today: Memory[]
}

export interface DashboardData {
  memories: Memory[]
  columns: MemoryColumns
  contexts: MemoryContext[]
  sources: ConnectedSource[]
  activity: ActivityItem[]
  totalCount: number
}

interface State {
  data: DashboardData | null
  loading: boolean
  error: string | null
}

export function useDashboardData() {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!isApiConfigured) {
        setState({ data: emptyData(), loading: false, error: "not_configured" })
        return
      }
      try {
        const memories = await fetchMemories()
        if (cancelled) return
        setState({ data: deriveDashboardData(memories), loading: false, error: null })
      } catch (err) {
        if (cancelled) return
        setState({
          data: emptyData(),
          loading: false,
          error: err instanceof Error ? err.message : "Something went wrong.",
        })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

function emptyData(): DashboardData {
  return {
    memories: [],
    columns: { captured: [], processing: [], connected: [], readyToRecall: [], today: [] },
    contexts: [],
    sources: [],
    activity: [],
    totalCount: 0,
  }
}

function deriveDashboardData(memories: Memory[]): DashboardData {
  const columns = bucketMemories(memories)
  const contexts = deriveContexts(memories)
  const sources = deriveSources(memories)
  const activity = deriveActivity(memories)

  return { memories, columns, contexts, sources, activity, totalCount: memories.length }
}

function bucketMemories(memories: Memory[]): MemoryColumns {
  const todayStr = new Date().toISOString().slice(0, 10)
  const columns: MemoryColumns = { captured: [], processing: [], connected: [], readyToRecall: [], today: [] }

  for (const m of memories) {
    if ((m.createdAt || "").slice(0, 10) === todayStr) columns.today.push(m)

    if (!m.summary) {
      columns.processing.push(m)
    } else if (m.projectId === "unassigned") {
      columns.captured.push(m)
    } else if (m.type === "knowledge" || m.type === "decision") {
      columns.readyToRecall.push(m)
    } else {
      columns.connected.push(m)
    }
  }
  return columns
}

function deriveContexts(memories: Memory[]): MemoryContext[] {
  const counts = new Map<string, number>()
  for (const m of memories) {
    if (m.projectId === "unassigned") continue
    counts.set(m.projectId, (counts.get(m.projectId) || 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([id, memoryCount]) => ({ id, name: id, memoryCount }))
    .sort((a, b) => b.memoryCount - a.memoryCount)
    .slice(0, 6)
}

function deriveSources(memories: Memory[]): ConnectedSource[] {
  const seen = new Set<string>()
  for (const m of memories) seen.add(m.source)
  return Array.from(seen).map((id) => ({ id, name: SOURCE_LABELS[id] || id }))
}

function deriveActivity(memories: Memory[]): ActivityItem[] {
  return memories.slice(0, 6).map((m) => ({
    id: m.memoryId,
    label: `Captured "${m.title}"`,
    timestamp: m.createdAt,
  }))
}
