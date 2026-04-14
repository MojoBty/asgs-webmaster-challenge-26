import Reveal from '@/components/Reveal'

export default function AboutSection() {
  return (
    <section
      id="about"
      className="pt-[80px] pb-[50px] px-5 md:pt-[120px] md:pb-[80px] md:px-[72px] lg:pt-[140px] lg:pb-[100px] lg:px-[120px] text-center bg-bg-warm lg:scroll-mt-[84px]"
    >
      <div className="max-w-[1200px] mx-auto">
        <h2 className="sr-only">About Bear Garden</h2>
        {/* Large tagline — Athiti, blur reveal */}
        <Reveal variant="blur">
          <p className="font-heading text-[1.75rem] md:text-[1.75rem] lg:text-[1.875rem] font-normal leading-[1.35] text-text-dark mb-8 md:mb-10 lg:mb-16">
            Bear Gardens are daytime carnivals where students can chill with free
            food and play games to win some bear-y cool prizes with our mascot,
            ASCE Bear.
          </p>
        </Reveal>

        {/* Explanation — Poppins Regular 20px */}
        <Reveal delay={150}>
          <p className="font-body text-[1rem] md:text-[1.125rem] font-normal leading-poppins text-text-body tracking-[-0.01em] max-w-[980px] mx-auto">
            As a play on &ldquo;Biergarten&rdquo;, Bear Garden serves free beer
            to students over 21 who present a valid ID, but the fun is open to all
            UCSD undergraduate students! Each Bear Garden also has a special theme
            with exclusive, themed stickers and merchandise. Come out for a
            paw-some time!
          </p>
        </Reveal>
      </div>
    </section>
  )
}
