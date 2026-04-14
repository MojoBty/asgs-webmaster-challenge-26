'use client'

import { useRef } from 'react'
import Reveal from '@/components/Reveal'
import basePath from '@/lib/basePath'

const EVENTS = [
  {
    src:       `${basePath}/images/pastevents1.jpg`,
    mobileSrc: `${basePath}/images/hero1.jpg`,
    alt:     'ASCE-Bear, Where Are You? event poster — Fall 2025',
    title:   'ASCE-Bear, Where Are You?',
    date:    'November 21, 2025',
    desc:    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius eu metus et scelerisque. Nullam gravida eu elit at rutrum. Sed congue elementum placerat. Maecenas nec rhoncus est.',
    // Fall palette — amber, gold, warm orange, brown
    palette: ['#b5730f', '#f0a030', '#e8c050', '#c47020', '#ffd040'],
  },
  {
    src:       `${basePath}/images/pastevents2.jpg`,
    mobileSrc: `${basePath}/images/hero2.jpg`,
    alt:     'The Rise of ASCE Bear event poster — Winter 2026',
    title:   'The Rise of ASCE Bear',
    date:    'February 20, 2026',
    desc:    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius eu metus et scelerisque. Nullam gravida eu elit at rutrum. Sed congue elementum placerat. Maecenas nec rhoncus est.',
    // Winter palette — brand blue, sky blue, icy white
    palette: ['#00588c', '#3a8ec0', '#6ab4e0', '#90cce8', '#c8eaf8'],
  },
  {
    src:       `${basePath}/images/pastevents3.png`,
    mobileSrc: `${basePath}/images/hero3.png`,
    alt:     'My Little ASCE Bear event poster — Spring 2026',
    title:   'My Little ASCE Bear',
    date:    'April 3, 2026',
    desc:    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius eu metus et scelerisque. Nullam gravida eu elit at rutrum. Sed congue elementum placerat. Maecenas nec rhoncus est.',
    // Spring palette — pastel pink, mint green, lavender, yellow
    palette: ['#e060a8', '#c040a0', '#70c878', '#a060d8', '#f8d050'],
  },
]

export default function PastEventsSection() {
  // Throttle: one burst per card interaction; reset on leave / touch end
  const activeCard = useRef<number | null>(null)

  function fireConfetti(rect: DOMRect, palette: string[]) {
    window.dispatchEvent(
      new CustomEvent('beargardenconfetti', {
        detail: {
          x:       rect.left + rect.width  / 2,
          y:       rect.top  + rect.height * 0.3,
          palette,
        },
      })
    )
  }

  function handleEnter(e: React.MouseEvent<HTMLElement>, index: number, palette: string[]) {
    if (activeCard.current === index) return
    activeCard.current = index
    fireConfetti(e.currentTarget.getBoundingClientRect(), palette)
  }

  function handleLeave() {
    activeCard.current = null
  }

  // Mobile tap confetti — onClick fires only on clean taps (not drag-to-scroll),
  // so it doesn't interfere with scrolling. On desktop the mouseEnter guard prevents double-fire.
  function handleClick(e: React.MouseEvent<HTMLElement>, index: number, palette: string[]) {
    if (activeCard.current === index) return
    activeCard.current = index
    fireConfetti(e.currentTarget.getBoundingClientRect(), palette)
    setTimeout(() => { activeCard.current = null }, 350)
  }

  return (
    <section
      id="events"
      className="py-[60px] md:py-[80px] bg-bg-warm lg:scroll-mt-[84px]"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[80px]">
      {/* Section heading */}
      <Reveal>
        <h2 className="font-heading text-[2rem] lg:text-[2.5rem] font-semibold leading-athiti text-primary mb-8">
          Past Events
        </h2>
      </Reveal>

      {/* Bordered container */}
      <div className="md:border-2 md:border-primary/20 md:rounded-xl md:p-8 lg:p-[54px_48px] lg:rounded-[20px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5">
          {EVENTS.map((event, i) => (
            <Reveal key={event.title} delay={i * 100}>
                <article
                  className="rounded-lg overflow-hidden flex flex-col bg-white cursor-pointer transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,88,140,0.12)] active:scale-[0.97] group w-full md:w-[85%] md:mx-auto md:border-2 md:border-border-card md:hover:border-primary/40 md:active:border-primary/50 touch-pan-y"
                  onMouseEnter={e => handleEnter(e, i, event.palette)}
                  onMouseLeave={handleLeave}
                  onClick={e => handleClick(e, i, event.palette)}
                >
                  {/* Card image — fixed aspect ratio so all cards align in a row */}
                  <div className="w-full overflow-hidden flex-shrink-0 aspect-video md:aspect-[3/4]">
                    <picture>
                      {/* Landscape banner on mobile (single column) */}
                      <source media="(max-width: 767px)" srcSet={event.mobileSrc} />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={event.src}
                        alt={event.alt}
                        loading="lazy"
                        className="w-full h-full object-cover block transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </picture>
                  </div>

                  {/* Card body */}
                  <div className="px-5 py-4 flex flex-col gap-2 flex-1">
                    {/* Event name */}
                    <h3 className="font-body text-[1rem] font-medium leading-snug text-text-dark text-center transition-colors duration-300 group-hover:text-primary">
                      {event.title}
                    </h3>

                    {/* Date — Poppins Light */}
                    <p className="font-body text-[0.875rem] font-light leading-poppins text-accent text-center">
                      {event.date}
                    </p>

                    {/* Description — Poppins Regular 13px */}
                    <p className="font-body text-[0.875rem] font-normal leading-poppins text-text-body text-center tracking-[-0.01em]">
                      {event.desc}
                    </p>
                  </div>
                </article>
              </Reveal>
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}
