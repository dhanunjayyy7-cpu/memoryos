import { Folder } from "lucide-react"
import type { MemoryContext } from "@/types/memory"

export function ActiveContextsCard({ contexts }: { contexts: MemoryContext[] }) {
  return (
    <div className="rounded-[16px] border border-dash-border bg-dash-surface p-4 shadow-[0_2px_8px_rgba(0,0,0,0.035),0_8px_24px_rgba(0,0,0,0.035)]">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-dash-text">Active Contexts</h3>
        <button className="text-[12px] text-dash-text-muted hover:text-dash-text">See all</button>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {contexts.length === 0 && (
          <p className="py-2 text-[12px] text-dash-text-muted">Nothing grouped into a project yet.</p>
        )}
        {contexts.map((ctx) => (
          <div key={ctx.id} className="flex items-center gap-2.5 rounded-[10px] px-1.5 py-2 hover:bg-dash-surface-2">
            <div className="flex size-7 items-center justify-center rounded-[8px] bg-dash-green-soft">
              <Folder size={13} className="text-dash-green" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium text-dash-text">{ctx.name}</p>
              <p className="text-[11px] text-dash-text-muted">{ctx.memoryCount} memories</p>
            </div>
            <span className="size-1.5 rounded-full bg-dash-green" />
          </div>
        ))}
      </div>
    </div>
  )
}
