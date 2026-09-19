import { Search, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const FILTERS = ["All", "Notes", "Documents", "Code", "Links", "Videos", "Images", "Questions", "Decisions"]

interface FilterRowProps {
  active: string
  onSelect: (filter: string) => void
}

export function FilterRow({ active, onSelect }: FilterRowProps) {
  return (
    <div className="flex items-center justify-between px-8 pb-5">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => onSelect(filter)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[12.5px] transition-colors",
              active === filter
                ? "bg-dash-text text-white"
                : "border border-dash-border bg-dash-surface text-dash-text-secondary hover:bg-dash-surface-2"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-8 items-center gap-1.5 rounded-full border border-dash-border bg-dash-surface px-3 text-[12.5px] text-dash-text-muted">
          <Search size={13} />
          Find memory...
        </div>
        <button className="flex h-8 items-center gap-1.5 rounded-full border border-dash-border bg-dash-surface px-3 text-[12.5px] text-dash-text-secondary hover:bg-dash-surface-2">
          <SlidersHorizontal size={13} />
          Filters
        </button>
      </div>
    </div>
  )
}
