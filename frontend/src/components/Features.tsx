import { motion } from "framer-motion"
import { MascotSlot } from "@/components/MascotSlot"
import learnResearchMascot from "@/assets/Learn_Research_Mascot.png"
import connectContextMascot from "@/assets/Connect_Context_Mascot.png"
import retrieveMemoryDiscoveryMascot from "@/assets/Retrieve_Memory_Discovery_Mascot.png"

interface FeatureCardData {
  slot: string
  title: string
  description: string
  image: string
  alt: string
  /** Crops out each asset's own baked-in canvas margin (measured per image, they vary). */
  zoom: number
}

const CARDS: FeatureCardData[] = [
  {
    slot: "FEATURE_LEARN",
    title: "Learn",
    description: "Capture the things you research, discover and learn while you work.",
    image: learnResearchMascot,
    alt: "MemoryOS mascot researching at a desk",
    zoom: 1.13,
  },
  {
    slot: "FEATURE_CONNECT",
    title: "Connect",
    description: "Connect your current work with relevant knowledge from your past.",
    image: connectContextMascot,
    alt: "MemoryOS mascot connecting sources of information",
    zoom: 1.07,
  },
  {
    slot: "FEATURE_RETRIEVE",
    title: "Retrieve",
    description: "Surface the right memory when it becomes useful to what you're doing now.",
    image: retrieveMemoryDiscoveryMascot,
    alt: "MemoryOS mascot surfacing a memory beside a laptop",
    zoom: 1.09,
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="relative bg-ink px-6 py-16 sm:px-10 sm:py-20"
      style={{
        backgroundImage: "radial-gradient(circle, #2a2a30 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="relative z-[2] mx-auto mb-10 flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-brand-blue shadow-[0_0_0_4px_rgba(47,107,255,0.25)]" />
          <h2 className="text-xl font-bold text-white">MemoryOS Features</h2>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-ink"
        >
          All <span aria-hidden="true">&#8964;</span>
        </button>
      </div>

      <div className="relative z-[2] mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {CARDS.map((card, i) => (
          <motion.article
            key={card.slot}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="rounded-[28px] border border-neutral-800 bg-[#0c0c0f] p-2.5"
          >
            <div className="aspect-[1/0.92] overflow-hidden rounded-[20px]">
              <MascotSlot slot={card.slot} src={card.image} fit="cover" zoom={card.zoom} alt={card.alt} />
            </div>
            <div className="flex items-end justify-between gap-3 px-1.5 pb-1 pt-5">
              <div>
                <h3 className="mb-1.5 text-[19px] font-bold text-white">{card.title}</h3>
                <p className="max-w-[220px] text-[13.5px] leading-relaxed text-neutral-400">
                  {card.description}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Learn more about ${card.title}`}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-700 text-white transition-colors hover:bg-white hover:text-ink"
              >
                &rarr;
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
