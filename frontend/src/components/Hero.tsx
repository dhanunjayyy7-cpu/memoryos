import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MascotSlot } from "@/components/MascotSlot"
import { Nav } from "@/components/Nav"

const EASE = [0.16, 1, 0.3, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: EASE },
  }),
}

export function Hero() {
  return (
    <header
      className="relative overflow-hidden bg-paper"
      style={{
        backgroundImage: "radial-gradient(circle, #d3d3d8 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <Nav />

      <div className="relative mx-auto flex min-h-[clamp(560px,68vw,760px)] max-w-6xl items-center justify-center px-6 sm:px-10">
        {/* top-left icon */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={0.15}
          variants={fadeUp}
          className="absolute left-[8%] top-[14%] flex size-19 items-center justify-center rounded-2xl bg-ink shadow-xl md:left-[17%]"
        >
          <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="#38bdf8" strokeWidth={1.6}>
            <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h4l1.5 2h8A1.5 1.5 0 0 1 20.5 7.5v11A1.5 1.5 0 0 1 19 20H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" />
          </svg>
        </motion.div>

        {/* left-middle mascot */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={0.3}
          variants={fadeUp}
          className="absolute left-[2%] top-[46%] hidden size-[clamp(150px,17vw,200px)] rounded-3xl bg-gradient-to-br from-neutral-800 to-black shadow-2xl md:block"
        >
          <MascotSlot slot="HERO_MASCOT_1" className="rounded-3xl" />
        </motion.div>

        {/* top-right mascot */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={0.45}
          variants={fadeUp}
          className="absolute right-[4%] top-[12%] hidden size-[clamp(120px,13vw,155px)] rounded-3xl shadow-2xl shadow-violet-900/40 md:block"
          style={{ background: "radial-gradient(circle at 35% 30%, #9d7bff, #4c1d95)" }}
        >
          <MascotSlot slot="HERO_MASCOT_2" className="rounded-3xl" />
        </motion.div>

        {/* bottom-right mascot */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={0.6}
          variants={fadeUp}
          className="absolute right-[1%] top-[44%] hidden size-[clamp(190px,21vw,250px)] rounded-3xl shadow-2xl md:block"
          style={{ background: "radial-gradient(circle at 32% 28%, #e4f77a, #cdea4a)" }}
        >
          <MascotSlot slot="HERO_MASCOT_3" className="rounded-3xl" />
        </motion.div>

        {/* content */}
        <div className="relative z-[3] max-w-[640px] text-center">
          <motion.h1
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
            className="text-[clamp(34px,4.6vw,54px)] font-extrabold leading-[1.08] tracking-tight"
          >
            Your Past <span className="text-brand-blue">Context</span>,
            <br />
            Right When You Need It.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={0.1}
            variants={fadeUp}
            className="mx-auto mb-7 mt-5 max-w-[460px] text-[16px] leading-relaxed text-neutral-500"
          >
            MemoryOS understands what you're working on and brings back the knowledge,
            decisions and research that matter.
          </motion.p>

          <motion.div initial="hidden" animate="show" custom={0.2} variants={fadeUp}>
            <Button size="lg">
              Get Started <span aria-hidden="true">&rarr;</span>
            </Button>
            <p className="mt-3.5 text-[13px] text-neutral-500">
              Your computer finally remembers what matters.
            </p>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
