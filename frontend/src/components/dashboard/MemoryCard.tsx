import { relativeTime } from "@/lib/time"
import type { Memory } from "@/types/memory"

const SOURCE_LABELS: Record<string, string> = {
  manual_page: "Browser",
  manual_selection: "Browser",
  github_commit: "GitHub",
}

const TYPE_LABELS: Record<string, string> = {
  knowledge: "Knowledge",
  idea: "Idea",
  decision: "Decision",
  work_context: "Work",
  unresolved: "Unresolved",
}

export function MemoryCard({ memory }: { memory: Memory }) {
  const tags = [TYPE_LABELS[memory.type] || memory.type]
  if (memory.projectId !== "unassigned") tags.push(memory.projectId)

  return (
    <div className="rounded-[12px] border border-dash-border bg-dash-surface p-3 shadow-[0_2px_8px_rgba(0,0,0,0.035),0_8px_24px_rgba(0,0,0,0.035)]">
      <p className="text-[13px] font-medium leading-snug text-dash-text">{memory.title}</p>
      <p className="mt-1 text-[11px] text-dash-text-muted">
        {SOURCE_LABELS[memory.source] || memory.source} &middot; {relativeTime(memory.createdAt)}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-dash-surface-2 px-2 py-0.5 text-[10.5px] text-dash-text-secondary"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
