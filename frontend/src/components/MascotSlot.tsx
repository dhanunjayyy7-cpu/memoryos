import { cn } from "@/lib/utils"

interface MascotSlotProps {
  /** Internal name for this image slot — swap in a real src later, never shown in the UI. */
  slot: string
  src?: string
  alt?: string
  className?: string
}

export function MascotSlot({ slot, src, alt = "", className }: MascotSlotProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        data-slot={slot}
        className={cn("h-full w-full object-cover", className)}
      />
    )
  }
  return (
    <div
      data-slot={slot}
      aria-hidden="true"
      className={cn("relative h-full w-full overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.35),transparent_55%)]" />
    </div>
  )
}
