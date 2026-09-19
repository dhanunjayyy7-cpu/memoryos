import { Plus } from "lucide-react"
import { MemoryCard } from "@/components/dashboard/MemoryCard"
import type { MemoryColumns } from "@/hooks/useDashboardData"
import type { Memory } from "@/types/memory"

interface Column {
  key: keyof MemoryColumns
  title: string
}

const COLUMNS: Column[] = [
  { key: "captured", title: "CAPTURED" },
  { key: "processing", title: "PROCESSING" },
  { key: "connected", title: "CONNECTED" },
  { key: "readyToRecall", title: "READY TO RECALL" },
  { key: "today", title: "TODAY" },
]

export function MemoryFlowBoard({ columns, onAdd }: { columns: MemoryColumns; onAdd: () => void }) {
  return (
    <div className="grid flex-1 grid-cols-5 gap-4 overflow-x-auto px-8 pb-6">
      {COLUMNS.map((col) => (
        <FlowColumn key={col.key} title={col.title} memories={columns[col.key]} onAdd={onAdd} />
      ))}
    </div>
  )
}

function FlowColumn({ title, memories, onAdd }: { title: string; memories: Memory[]; onAdd: () => void }) {
  return (
    <div className="flex min-w-0 flex-col rounded-[16px] bg-dash-surface-2 p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold tracking-wide text-dash-text-secondary">{title}</span>
        <span className="rounded-full bg-dash-surface px-1.5 py-0.5 text-[10.5px] text-dash-text-muted">
          {memories.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto">
        {memories.map((m) => (
          <MemoryCard key={m.memoryId} memory={m} />
        ))}
      </div>

      <button
        onClick={onAdd}
        className="mt-2.5 flex items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-dash-border py-2 text-[12px] text-dash-text-muted hover:bg-dash-surface hover:text-dash-text-secondary"
      >
        <Plus size={13} /> Add Memory
      </button>
    </div>
  )
}
