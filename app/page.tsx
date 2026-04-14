import Navbar from '@/components/Navbar'
import HeroCarousel from '@/components/HeroCarousel'
import AboutSection from '@/components/AboutSection'
import PastEventsSection from '@/components/PastEventsSection'
import BearGardenDetails from '@/components/BearGardenDetails'
import Footer from '@/components/Footer'
import ParticleCanvas from '@/components/ParticleCanvas'
import CursorTrail from '@/components/CursorTrail'
import ScrollToTop from '@/components/ScrollToTop'

export default function Home() {
  return (
    <>
      <ParticleCanvas />
      <CursorTrail />
      <Navbar />
      <main>
        <HeroCarousel />
        <AboutSection />
        <PastEventsSection />
        <BearGardenDetails />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
