import { Button } from "@/components/ui/button"

const LINKS = ["Home", "How It Works", "Features", "About"]

export function Nav() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 pt-8 sm:px-10">
      <div className="flex items-center gap-2.5">
        <div className="size-8 rounded-[10px] bg-gradient-to-br from-indigo-700 to-slate-900 ring-1 ring-white/10" />
        <span className="text-[15px] font-bold text-brand-blue">MemoryOS</span>
      </div>

      <div className="hidden items-center gap-3 text-sm font-medium text-neutral-700 md:flex">
        {LINKS.map((label, i) => (
          <span key={label} className="flex items-center gap-3">
            {i > 0 && <span className="text-neutral-300">&middot;</span>}
            <a href="#" className="transition-colors hover:text-ink">
              {label}
            </a>
          </span>
        ))}
      </div>

      <Button size="lg">
        Get Started <span aria-hidden="true">&rarr;</span>
      </Button>
    </nav>
  )
}
