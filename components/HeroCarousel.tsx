'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Slide data ────────────────────────────────────────────────────────────
const SLIDES = [
  {
    src:       '/images/hero1.jpg',
    mobileSrc: '/images/pastevents1.jpg',
    alt: 'ASCE Bear Garden Fall 2025 — ASCE Bear, Where Are You?',
  },
  {
    src:       '/images/hero2.jpg',
    mobileSrc: '/images/pastevents2.jpg',
    alt: 'Bear Garden Winter 2026 — The Rise of ASCE Bear',
  },
  {
    src:       '/images/hero3.png',
    mobileSrc: '/images/pastevents3.png',
    alt: 'Bear Garden Spring 2026 — My Little ASCE Bear',
  },
]

const TOTAL         = SLIDES.length
const AUTOPLAY_DELAY = 4500

export default function HeroCarousel() {
  const [current,       setCurrent]       = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null)
  const containerRef  = useRef<HTMLDivElement>(null)
  const touchStartX   = useRef(0)

  // Detect prefers-reduced-motion once on mount
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
  }, [])

  const goTo = useCallback((index: number) => {
    setCurrent(((index % TOTAL) + TOTAL) % TOTAL)
  }, [])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startAutoplay = useCallback(() => {
    if (reducedMotion) return
    stopAutoplay()
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % TOTAL)
    }, AUTOPLAY_DELAY)
  }, [reducedMotion, stopAutoplay])

  // Boot autoplay
  useEffect(() => {
    startAutoplay()
    return stopAutoplay
  }, [startAutoplay, stopAutoplay])

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX
    stopAutoplay()
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev()
    startAutoplay()
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  { prev(); startAutoplay() }
    if (e.key === 'ArrowRight') { next(); startAutoplay() }
  }

  return (
    // Offset below fixed navbar
    <section id="home" className="pt-[60px] md:pt-[72px] lg:pt-[84px]">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none focus-visible:outline-none"
        aria-label="Bear Garden event highlights"
        aria-roledescription="carousel"
        tabIndex={0}
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        onFocus={stopAutoplay}
        onBlur={e => {
          if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            startAutoplay()
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
      >
        {/* ── Slide track ── */}
        <div
          className="flex items-start will-change-transform"
          style={{
            transform: `translateX(-${current * 100}%)`,
            transition: reducedMotion
              ? 'none'
              : 'transform 600ms cubic-bezier(0.16,1,0.3,1)',
          }}
          aria-live="polite"
          aria-atomic="false"
        >
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className="min-w-full relative"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${TOTAL}${i === current ? ' (current)' : ''}`}
            >
              <picture
                // Key changes when this slide becomes active → remounts → animation replays
                key={i === current ? `active-${current}` : `inactive-${i}`}
                className={cn(
                  'w-full block pointer-events-none',
                  i === current && !reducedMotion && 'animate-slide-enter'
                )}
              >
                {/* Portrait poster on mobile, landscape banner on md+ */}
                <source media="(max-width: 767px)" srcSet={slide.mobileSrc} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.src}
                  alt={slide.alt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore — fetchPriority is valid HTML but not yet in React's types
                  fetchPriority={i === 0 ? 'high' : undefined}
                  className="w-full h-auto block"
                />
              </picture>
            </div>
          ))}
        </div>

        {/* ── Prev button ── */}
        <button
          onClick={() => { prev(); startAutoplay() }}
          aria-label="Previous slide"
          className={cn(
            'group absolute top-1/2 -translate-y-1/2 left-3 md:left-6',
            'w-8 h-8 md:w-14 md:h-14 rounded-full',
            'bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white',
            'flex items-center justify-center z-10 cursor-pointer',
            'transition-[transform,background-color,border-color,box-shadow] duration-200',
            'hover:bg-white/35 hover:border-white/70 hover:scale-110',
            'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white focus-visible:outline-offset-2'
          )}
        >
          <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden />
        </button>

        {/* ── Next button ── */}
        <button
          onClick={() => { next(); startAutoplay() }}
          aria-label="Next slide"
          className={cn(
            'group absolute top-1/2 -translate-y-1/2 right-3 md:right-6',
            'w-8 h-8 md:w-14 md:h-14 rounded-full',
            'bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white',
            'flex items-center justify-center z-10 cursor-pointer',
            'transition-[transform,background-color,border-color,box-shadow] duration-200',
            'hover:bg-white/35 hover:border-white/70 hover:scale-110',
            'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white focus-visible:outline-offset-2'
          )}
        >
          <ChevronRight className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
        </button>

        {/* ── Dot indicators ── */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2.5 z-10"
          role="tablist"
          aria-label="Slide navigation"
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => { goTo(i); startAutoplay() }}
              className={cn(
                'h-1.5 md:h-2.5 rounded-full border-none p-0 cursor-pointer',
                'transition-[width,background-color,opacity] duration-300',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4',
                i === current
                  ? 'bg-white w-4 md:w-6'
                  : 'bg-white/45 w-1.5 md:w-2.5 hover:bg-white/70 hover:w-3 md:hover:w-4'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
