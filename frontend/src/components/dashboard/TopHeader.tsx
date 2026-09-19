import { Search, Bell, Plus } from "lucide-react"

export function TopHeader() {
  return (
    <div className="flex items-center justify-between px-8 pb-5 pt-7">
      <h1 className="text-[30px] font-semibold tracking-tight text-dash-text">Memory Flow</h1>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-64 items-center gap-2 rounded-[10px] border border-dash-border bg-dash-surface px-3 text-[13px] text-dash-text-muted">
          <Search size={15} />
          <span className="flex-1">Search memories...</span>
          <kbd className="rounded-[4px] border border-dash-border px-1.5 py-0.5 text-[11px] text-dash-text-muted">
            &#8984; K
          </kbd>
        </div>

        <button className="flex size-9 items-center justify-center rounded-[10px] border border-dash-border bg-dash-surface text-dash-text-secondary hover:bg-dash-surface-2">
          <Bell size={16} />
        </button>

        <div className="size-9 rounded-full bg-dash-purple-soft" />

        <button className="flex h-9 items-center gap-1.5 rounded-[10px] bg-dash-text px-3.5 text-[13px] font-medium text-white hover:bg-neutral-800">
          <Plus size={15} /> New
        </button>
      </div>
    </div>
  )
}
