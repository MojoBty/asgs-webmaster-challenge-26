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
      <Reveal rootMargin="0px 0px -180px 0px">
        <h2 className="font-heading text-[2rem] lg:text-[2.5rem] font-semibold leading-athiti text-primary mb-8">
          Past Events
        </h2>
      </Reveal>

      {/* Bordered container */}
      <div className="min-[850px]:border-2 min-[850px]:border-primary/20 min-[850px]:rounded-xl min-[850px]:p-8 lg:p-[54px_48px] lg:rounded-[20px]">
        <div className="grid grid-cols-1 min-[850px]:grid-cols-3 gap-6 min-[850px]:gap-5">
          {EVENTS.map((event, i) => (
            <Reveal key={event.title} delay={i * 80} className="h-full" rootMargin="0px 0px -180px 0px">
                <article
                  className="h-full rounded-lg overflow-hidden flex flex-col bg-white cursor-pointer transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,88,140,0.12)] active:scale-[0.97] group w-full min-[850px]:w-[85%] min-[850px]:mx-auto min-[850px]:border-2 min-[850px]:border-border-card min-[850px]:hover:border-primary/40 min-[850px]:active:border-primary/50 touch-pan-y"
                  onMouseEnter={e => handleEnter(e, i, event.palette)}
                  onMouseLeave={handleLeave}
                  onClick={e => handleClick(e, i, event.palette)}
                >
                  {/* Card image — fixed aspect ratio so all cards align in a row */}
                  <div className="w-full overflow-hidden flex-shrink-0 aspect-video min-[850px]:aspect-[3/4]">
                    <picture>
                      {/* Landscape banner on mobile (single column, below 850px) */}
                      <source media="(max-width: 849px)" srcSet={event.mobileSrc} />
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
                  <div className="px-5 py-4 flex flex-col justify-between flex-1">
                    {/* Title + date pinned to top */}
                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-body text-[1rem] font-medium leading-snug text-text-dark text-center transition-colors duration-300 group-hover:text-primary h-[2.75rem] line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="font-body text-[0.875rem] font-light leading-poppins text-accent text-center">
                        {event.date}
                      </p>
                    </div>

                    {/* Description pinned to bottom */}
                    <p className="font-body text-[0.875rem] font-normal leading-poppins text-text-body text-center tracking-[-0.01em] pt-2">
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
