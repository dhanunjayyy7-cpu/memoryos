import type { ComponentType } from "react"
import {
  LayoutGrid,
  Brain,
  MessageCircleQuestion,
  FolderKanban,
  Layers,
  Bookmark,
  Tag,
  Plug,
  Settings,
  Trash2,
  Crown,
  HelpCircle,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
}

const MAIN_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "My Memories", icon: Brain },
  { label: "Ask Memory", icon: MessageCircleQuestion },
  { label: "Projects", icon: FolderKanban },
  { label: "Collections", icon: Layers },
  { label: "Bookmarks", icon: Bookmark },
  { label: "Tags", icon: Tag },
  { label: "Integrations", icon: Plug },
]

const SYSTEM_ITEMS: NavItem[] = [
  { label: "Settings", icon: Settings },
  { label: "Trash", icon: Trash2 },
]

interface SidebarProps {
  active: string
  onSelect: (label: string) => void
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-dash-border-soft bg-dash-sidebar">
      <div className="flex items-center gap-2 px-5 pt-5 pb-4">
        <div className="flex size-7 items-center justify-center rounded-[8px] bg-dash-text">
          <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="#78d66d" strokeWidth={2}>
            <path d="M8 6c-2.5 2-2.5 6 0 8M16 6c2.5 2 2.5 6 0 8" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-[14px] font-semibold text-dash-text">MemoryOS</span>
        <ChevronDown size={14} className="ml-auto text-dash-text-muted" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="px-2 pb-2 pt-3 text-[11px] font-semibold tracking-wide text-dash-text-muted">MAIN</p>
        <ul className="flex flex-col gap-0.5">
          {MAIN_ITEMS.map((item) => (
            <NavRow key={item.label} item={item} active={active === item.label} onSelect={onSelect} />
          ))}
        </ul>

        <p className="px-2 pb-2 pt-5 text-[11px] font-semibold tracking-wide text-dash-text-muted">SYSTEM</p>
        <ul className="flex flex-col gap-0.5">
          {SYSTEM_ITEMS.map((item) => (
            <NavRow key={item.label} item={item} active={active === item.label} onSelect={onSelect} />
          ))}
        </ul>
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-dash-border-soft px-3 py-3">
        <button className="flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[13px] text-dash-text-secondary hover:bg-dash-surface-2">
          <Crown size={16} /> Pro
        </button>
        <button className="flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[13px] text-dash-text-secondary hover:bg-dash-surface-2">
          <HelpCircle size={16} /> Help
        </button>
        <button
          onClick={() => onSelect("Settings")}
          className="flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[13px] text-dash-text-secondary hover:bg-dash-surface-2"
        >
          <Settings size={16} /> Settings
        </button>
      </div>
    </aside>
  )
}

function NavRow({ item, active, onSelect }: { item: NavItem; active: boolean; onSelect: (label: string) => void }) {
  const Icon = item.icon
  return (
    <li>
      <button
        onClick={() => onSelect(item.label)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[13px] transition-colors",
          active
            ? "bg-dash-green-strong font-medium text-dash-text"
            : "text-dash-text-secondary hover:bg-dash-surface-2"
        )}
      >
        <Icon size={16} />
        {item.label}
      </button>
    </li>
  )
}
