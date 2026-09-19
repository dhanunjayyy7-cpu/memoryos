import type { ComponentType } from "react"
import { Brain, Timer, Sparkles, Plug } from "lucide-react"
import type { ConnectedSource, MemoryContext } from "@/types/memory"

interface MetricsRowProps {
  totalCount: number
  contexts: MemoryContext[]
  sources: ConnectedSource[]
}

export function MetricsRow({ totalCount, contexts, sources }: MetricsRowProps) {
  return (
    <div className="grid grid-cols-4 gap-4 px-8 pb-6">
      <MetricCard
        icon={Brain}
        iconBg="bg-dash-green-soft"
        iconColor="text-dash-green"
        label="Memories captured"
        value={String(totalCount)}
        detail={totalCount > 0 ? "Across all sources" : "No memories yet"}
      />
      <MetricCard
        icon={Timer}
        iconBg="bg-dash-blue-soft"
        iconColor="text-blue-500"
        label="Avg retrieval time"
        value="—"
        detail="Not tracked yet"
      />
      <MetricCard
        icon={Sparkles}
        iconBg="bg-dash-purple-soft"
        iconColor="text-violet-500"
        label="Active contexts"
        value={String(contexts.length)}
        detail={contexts.length > 0 ? `${contexts[0].name} leads` : "Nothing grouped yet"}
      />
      <MetricCard
        icon={Plug}
        iconBg="bg-dash-yellow-soft"
        iconColor="text-amber-600"
        label="Sources connected"
        value={String(sources.length)}
        detail={sources.map((s) => s.name).join(", ") || "None yet"}
      />
    </div>
  )
}

interface MetricCardProps {
  icon: ComponentType<{ size?: number; className?: string }>
  iconBg: string
  iconColor: string
  label: string
  value: string
  detail: string
}

function MetricCard({ icon: Icon, iconBg, iconColor, label, value, detail }: MetricCardProps) {
  return (
    <div className="rounded-[16px] border border-dash-border bg-dash-surface p-4 shadow-[0_2px_8px_rgba(0,0,0,0.035),0_8px_24px_rgba(0,0,0,0.035)]">
      <div className={`mb-3 flex size-8 items-center justify-center rounded-[10px] ${iconBg}`}>
        <Icon size={16} className={iconColor} />
      </div>
      <p className="text-[12px] text-dash-text-secondary">{label}</p>
      <p className="mt-1 text-[24px] font-semibold text-dash-text">{value}</p>
      <p className="mt-0.5 truncate text-[11px] text-dash-text-muted">{detail}</p>
    </div>
  )
}
