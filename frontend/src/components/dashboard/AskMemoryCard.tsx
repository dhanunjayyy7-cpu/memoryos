import { useState } from "react"
import { ArrowRight } from "lucide-react"

export function AskMemoryCard() {
  const [query, setQuery] = useState("")

  return (
    <div className="rounded-[16px] border border-dash-border bg-dash-surface p-4 shadow-[0_2px_8px_rgba(0,0,0,0.035),0_8px_24px_rgba(0,0,0,0.035)]">
      <h3 className="text-[15px] font-semibold text-dash-text">Ask Memory</h3>
      <p className="mt-1.5 text-[12px] leading-relaxed text-dash-text-secondary">
        Search across all your memories, get insights and continue your work with context.
      </p>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-3 flex items-center gap-2 rounded-[10px] bg-dash-blue-soft px-3 py-2"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 bg-transparent text-[13px] text-dash-text outline-none placeholder:text-dash-text-muted"
        />
        <button
          type="submit"
          aria-label="Ask"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-dash-text text-white"
        >
          <ArrowRight size={14} />
        </button>
      </form>
    </div>
  )
}
