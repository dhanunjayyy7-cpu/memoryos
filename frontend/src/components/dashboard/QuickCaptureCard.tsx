import { useState } from "react"
import { StickyNote, Link2, Image, FileText } from "lucide-react"
import { saveQuickMemory } from "@/lib/api"
import { cn } from "@/lib/utils"

const OPTIONS = [
  { key: "note", label: "Note", icon: StickyNote },
  { key: "link", label: "Link", icon: Link2 },
  { key: "image", label: "Image", icon: Image },
  { key: "document", label: "Document", icon: FileText },
]

export function QuickCaptureCard({ onCaptured }: { onCaptured: () => void }) {
  const [active, setActive] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [saving, setSaving] = useState(false)

  async function submit() {
    if (!text.trim()) return
    setSaving(true)
    try {
      await saveQuickMemory(text.trim())
      setText("")
      setActive(null)
      onCaptured()
    } catch {
      // surfaced via the disabled/empty state; keep the composer open to retry
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-[16px] border border-dash-border bg-dash-surface p-4 shadow-[0_2px_8px_rgba(0,0,0,0.035),0_8px_24px_rgba(0,0,0,0.035)]">
      <h3 className="text-[15px] font-semibold text-dash-text">Quick Capture</h3>
      <p className="mt-1 text-[12px] text-dash-text-secondary">Save something instantly</p>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setActive(opt.key === active ? null : opt.key)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-[10px] border py-2.5 text-[11px]",
              active === opt.key
                ? "border-dash-green bg-dash-green-soft text-dash-text"
                : "border-dash-border text-dash-text-secondary hover:bg-dash-surface-2"
            )}
          >
            <opt.icon size={15} />
            {opt.label}
          </button>
        ))}
      </div>

      {active && (
        <div className="mt-3 flex flex-col gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={active === "link" ? "Paste a URL..." : "Type something..."}
            className="min-h-16 rounded-[10px] border border-dash-border bg-dash-surface-2 p-2.5 text-[12.5px] text-dash-text outline-none placeholder:text-dash-text-muted"
          />
          <button
            onClick={submit}
            disabled={saving || !text.trim()}
            className="rounded-[10px] bg-dash-text py-2 text-[12.5px] font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  )
}
