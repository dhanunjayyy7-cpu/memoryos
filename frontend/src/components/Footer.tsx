import { useState } from "react"
import { Input } from "@/components/ui/input"
import { MascotSlot } from "@/components/MascotSlot"
import footerMemoryOrbMascot from "@/assets/Footer_Memory_Orb_Mascot.png"

const SOCIALS = [
  {
    label: "X / Twitter",
    path: "M18.3 2H21l-6.6 7.5L22.2 22h-6.5l-5.1-6.7L4.7 22H2l7.1-8.1L2 2h6.6l4.6 6.1L18.3 2Zm-1.1 18h1.8L7 4h-1.9l12.1 16Z",
  },
  {
    label: "LinkedIn",
    path: "M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94ZM21 21h-3.38v-6.4c0-1.53-.03-3.5-2.13-3.5-2.14 0-2.47 1.67-2.47 3.39V21H9.64V8.5h3.24v1.71h.05c.45-.86 1.56-1.77 3.21-1.77 3.44 0 4.07 2.26 4.07 5.2V21Z",
  },
  {
    label: "Instagram",
    path: "M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 2.1.25 2.9.55.8.3 1.44.7 2.1 1.35.65.66 1.05 1.3 1.35 2.1.3.8.5 1.73.55 2.9.06 1.25.07 1.65.07 4.85s-.01 3.6-.07 4.85c-.05 1.17-.25 2.1-.55 2.9-.3.8-.7 1.44-1.35 2.1-.66.65-1.3 1.05-2.1 1.35-.8.3-1.73.5-2.9.55-1.25.06-1.65.07-4.85.07s-3.6-.01-4.85-.07c-1.17-.05-2.1-.25-2.9-.55-.8-.3-1.44-.7-2.1-1.35-.65-.66-1.05-1.3-1.35-2.1-.3-.8-.5-1.73-.55-2.9C2.21 15.6 2.2 15.2 2.2 12s.01-3.6.07-4.85c.05-1.17.25-2.1.55-2.9.3-.8.7-1.44 1.35-2.1.66-.65 1.3-1.05 2.1-1.35.8-.3 1.73-.5 2.9-.55C8.4 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.52.01-4.76.07-.96.04-1.48.2-1.83.34-.46.18-.79.39-1.13.73-.34.34-.55.67-.73 1.13-.14.35-.3.87-.34 1.83C3.15 8.28 3.14 8.65 3.14 12s.01 3.72.07 4.9c.04.96.2 1.48.34 1.83.18.46.39.79.73 1.13.34.34.67.55 1.13.73.35.14.87.3 1.83.34 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.39 1.13-.73.34-.34.55-.67.73-1.13.14-.35.3-.87.34-1.83.06-1.18.07-1.55.07-4.9s-.01-3.72-.07-4.9c-.04-.96-.2-1.48-.34-1.83a3.03 3.03 0 0 0-.73-1.13 3.03 3.03 0 0 0-1.13-.73c-.35-.14-.87-.3-1.83-.34-1.24-.06-1.61-.07-4.76-.07Zm0 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm5.7-2a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z",
  },
  {
    label: "YouTube",
    path: "M22 12s0-3.1-.4-4.6a2.9 2.9 0 0 0-2-2C17.9 5 12 5 12 5s-5.9 0-7.6.4a2.9 2.9 0 0 0-2 2C2 8.9 2 12 2 12s0 3.1.4 4.6a2.9 2.9 0 0 0 2 2C6.1 19 12 19 12 19s5.9 0 7.6-.4a2.9 2.9 0 0 0 2-2C22 15.1 22 12 22 12ZM10 15.3V8.7L15.8 12 10 15.3Z",
  },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [joined, setJoined] = useState(false)

  return (
    <footer id="waitlist" className="relative overflow-hidden bg-graphite px-6 pb-10 pt-16 sm:px-10 sm:pt-20">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-50 350 C 250 250, 950 250, 1250 350" stroke="#1c1c22" strokeWidth={1} fill="none" />
        <path d="M-50 300 C 250 180, 950 180, 1250 300" stroke="#17171c" strokeWidth={1} fill="none" />
      </svg>

      <div className="relative z-[2] mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 md:grid-cols-[1fr_1.3fr_1fr]">
        <div className="flex flex-col gap-3 pt-1.5 text-[13.5px] text-neutral-300">
          <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
          <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
          <a href="#" className="transition-colors hover:text-white">Contact</a>
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <h3 className="text-[15px] font-semibold text-white">Join the MemoryOS waitlist</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setJoined(true)
            }}
            className="flex w-full max-w-[280px] items-center gap-2 rounded-full bg-white py-1 pl-4 pr-1"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
            />
            <button
              type="submit"
              aria-label="Join waitlist"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-white"
            >
              &rarr;
            </button>
          </form>
          {joined && <p className="text-[12px] text-brand-lime">You're on the list.</p>}
        </div>

        <div className="flex flex-col items-center gap-3 text-center md:items-end md:text-right">
          <h3 className="text-[15px] font-semibold text-white">Follow us</h3>
          <div className="flex gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex size-8 items-center justify-center rounded-full border border-neutral-700 text-neutral-300 transition-colors hover:bg-white hover:text-ink"
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">
            &copy; 2026 MemoryOS
            <br />
            All rights reserved.
          </p>
        </div>

        <div className="-mt-8 flex justify-center md:col-span-3">
          <div className="size-[clamp(150px,15vw,200px)] drop-shadow-[0_0_45px_rgba(124,92,255,0.45)]">
            <MascotSlot
              slot="FOOTER_MASCOT"
              src={footerMemoryOrbMascot}
              fit="contain"
              alt="MemoryOS mascot resting inside a glowing memory orb"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
