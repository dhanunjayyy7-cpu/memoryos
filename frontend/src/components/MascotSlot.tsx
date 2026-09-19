import { cn } from "@/lib/utils"

interface MascotSlotProps {
  /** Internal name for this image slot — swap in a real src later, never shown in the UI. */
  slot: string
  src?: string
  alt?: string
  fit?: "cover" | "contain"
  /** Scale factor to crop out a baked-in canvas margin (e.g. 1.12 = zoom 12%). Leave at 1 for true cutouts. */
  zoom?: number
  className?: string
}

export function MascotSlot({ slot, src, alt = "", fit = "cover", zoom = 1, className }: MascotSlotProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        data-slot={slot}
        className={cn("h-full w-full", fit === "cover" ? "object-cover" : "object-contain", className)}
        style={zoom !== 1 ? { transform: `scale(${zoom})` } : undefined}
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
