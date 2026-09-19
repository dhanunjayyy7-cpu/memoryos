import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { Footer } from "@/components/Footer"

export default function App() {
  return (
    <div className="min-h-screen bg-paper">
      <Hero />
      <Features />
      <Footer />
    </div>
  )
}
