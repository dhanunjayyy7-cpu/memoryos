import { relativeTime } from "@/lib/time"
import type { ActivityItem } from "@/types/memory"

export function RecentActivityCard({ activity }: { activity: ActivityItem[] }) {
  return (
    <div className="rounded-[16px] border border-dash-border bg-dash-surface p-4 shadow-[0_2px_8px_rgba(0,0,0,0.035),0_8px_24px_rgba(0,0,0,0.035)]">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-dash-text">Recent Activity</h3>
        <button className="text-[12px] text-dash-text-muted hover:text-dash-text">See all</button>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {activity.length === 0 && <p className="py-2 text-[12px] text-dash-text-muted">Nothing captured yet.</p>}
        {activity.map((item) => (
          <div key={item.id} className="flex items-start gap-2.5">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-dash-green" />
            <div className="min-w-0">
              <p className="truncate text-[12.5px] text-dash-text">{item.label}</p>
              <p className="text-[11px] text-dash-text-muted">{relativeTime(item.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
