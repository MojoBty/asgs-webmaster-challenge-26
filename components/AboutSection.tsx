'use client'

import { useEffect, useRef, useState } from 'react'

const WORDS = (
  'Bear Gardens are daytime carnivals where students can chill with free food ' +
  'and play games to win some bear-y cool prizes with our mascot, ASCE Bear.'
).split(' ')

// Scroll-equivalent pixels to reveal one word
const PX_PER_WORD = 30
// Extra scroll held after last word before explanation fades in
const EXPLANATION_HOLD = 60
// Extra scroll after explanation before releasing the lock
const RELEASE_HOLD = 100

const TOTAL_PX = WORDS.length * PX_PER_WORD + EXPLANATION_HOLD + RELEASE_HOLD

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const phaseRef   = useRef<'idle' | 'active' | 'done'>('idle')
  const accRef     = useRef(0)
  const lockedYRef = useRef(0)
  const touchYRef  = useRef(0)

  const [visibleWords, setVisibleWords] = useState(0)
  const [showExpl,     setShowExpl]     = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // No animation for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const getNavH = () => {
      const w = window.innerWidth
      return w >= 1024 ? 84 : w >= 768 ? 72 : 60
    }

    const rect = section.getBoundingClientRect()
    const navH = getNavH()

    // Section already at/above viewport top → skip animation (hash link / page refresh mid-scroll)
    if (rect.top <= navH + 10) {
      phaseRef.current = 'done'
      setVisibleWords(WORDS.length)
      setShowExpl(true)
      return
    }

    // ── Scroll lock / unlock ──────────────────────────────────────────────────
    // Pinning is done via window.scrollTo on every advance() call combined with
    // e.preventDefault() on touchmove/wheel. overflow:hidden is intentionally
    // avoided — iOS Safari ignores it for touch scroll.
    const lockAt = (y: number) => {
      lockedYRef.current = y
      window.scrollTo(0, y)
    }

    const unlock = () => { /* nothing to undo */ }

    // ── Core advance function ─────────────────────────────────────────────────
    const advance = (delta: number) => {
      const next = accRef.current + delta

      if (next < 0) {
        // Scrolled up past the start — release lock, let page scroll up normally
        phaseRef.current = 'idle'
        accRef.current   = 0
        setVisibleWords(0)
        setShowExpl(false)
        unlock()
        return
      }

      if (next > TOTAL_PX) {
        // Scrolled down past the end — release lock, let page scroll down normally
        phaseRef.current = 'done'
        accRef.current   = TOTAL_PX
        setVisibleWords(WORDS.length)
        setShowExpl(true)
        unlock()
        return
      }

      accRef.current = next

      // Re-pin the page on every tick — primary lock mechanism for iOS Safari
      window.scrollTo(0, lockedYRef.current)

      const wordCount = Math.min(WORDS.length, Math.floor(accRef.current / PX_PER_WORD))
      setVisibleWords(wordCount)
      setShowExpl(accRef.current >= WORDS.length * PX_PER_WORD + EXPLANATION_HOLD)
    }

    // ── Event handlers ────────────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      if (phaseRef.current !== 'active') return
      e.preventDefault()
      advance(e.deltaY)
    }

    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0].clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (phaseRef.current !== 'active') return
      e.preventDefault()
      const dy = touchYRef.current - e.touches[0].clientY
      touchYRef.current = e.touches[0].clientY
      advance(dy)
    }

    // ── Activation: section top reaching navbar (scroll down) or
    //               section bottom re-entering viewport (scroll up) ────────────
    const onScroll = () => {
      const r    = section.getBoundingClientRect()
      const navH = getNavH()
      const vh   = window.innerHeight

      // Scroll DOWN: section top reaches the navbar
      if (phaseRef.current === 'idle' && r.top <= navH + 60 && r.bottom > navH + 100) {
        phaseRef.current = 'active'
        accRef.current   = 0
        lockAt(section.offsetTop - navH)
        return
      }

      // Scroll UP: section bottom re-enters the viewport from below.
      // Lock at a deterministic position (section bottom pinned to viewport bottom)
      // so fast-scroll overshoot can't cause the locked-Y to be in a bad spot.
      // Lower bound (> vh - 100) prevents this from firing when the section is
      // already sitting at the top of the viewport after the forward animation.
      if (phaseRef.current === 'done' && r.bottom > vh - 100 && r.bottom <= vh + 80) {
        phaseRef.current = 'active'
        accRef.current   = TOTAL_PX
        lockAt(Math.max(0, section.offsetTop + section.offsetHeight - vh))
      }
    }

    // ── Resize / orientation change ───────────────────────────────────────────
    // Only reset on width changes (rotation / desktop resize). Height-only changes
    // are the mobile browser chrome collapsing on scroll — resetting there would
    // kill the animation mid-swipe.
    let prevWidth  = window.innerWidth
    let resizeTimer = 0
    const onResize = () => {
      const newWidth = window.innerWidth
      if (newWidth === prevWidth) return  // height-only change, ignore
      prevWidth = newWidth

      unlock()
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        if (phaseRef.current === 'active') {
          phaseRef.current = 'idle'
          accRef.current   = 0
          setVisibleWords(0)
          setShowExpl(false)
        }
      }, 250)
    }

    window.addEventListener('scroll',     onScroll,     { passive: true })
    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })
    window.addEventListener('resize',     onResize)

    return () => {
      unlock()
      clearTimeout(resizeTimer)
      window.removeEventListener('scroll',     onScroll)
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('resize',     onResize)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="pt-[80px] pb-[50px] px-5 md:pt-[120px] md:pb-[80px] md:px-[72px] lg:pt-[140px] lg:pb-[100px] lg:px-[120px] text-center bg-bg-warm lg:scroll-mt-[84px]"
    >
      <div className="max-w-[1200px] mx-auto">
        <h2 className="sr-only">About Bear Garden</h2>

        {/* Tagline — words reveal one-by-one as the user scrolls */}
        <p className="font-heading text-[1.75rem] md:text-[1.75rem] lg:text-[1.875rem] font-normal leading-[1.35] text-text-dark mb-8 md:mb-10 lg:mb-16">
          {WORDS.map((word, i) => (
            <span
              key={i}
              className="inline"
              style={{
                opacity:    i < visibleWords ? 1    : 0.08,
                filter:     i < visibleWords ? 'blur(0)' : 'blur(3px)',
                transform:  i < visibleWords ? 'none' : 'translateY(6px)',
                display:    'inline-block',
                transition: 'opacity 350ms ease, filter 350ms ease, transform 350ms ease',
              }}
            >
              {word}{i < WORDS.length - 1 ? '\u00A0' : ''}
            </span>
          ))}
        </p>

        {/* Explanation — fades in after the tagline is fully revealed */}
        <p
          className="font-body text-[1rem] md:text-[1.125rem] font-normal leading-poppins text-text-body tracking-[-0.01em] max-w-[980px] mx-auto"
          style={{ opacity: showExpl ? 1 : 0, transition: 'opacity 600ms ease' }}
        >
          As a play on &ldquo;Biergarten&rdquo;, Bear Garden serves free beer
          to students over 21 who present a valid ID, but the fun is open to all
          UCSD undergraduate students! Each Bear Garden also has a special theme
          with exclusive, themed stickers and merchandise. Come out for a
          paw-some time!
        </p>
      </div>
    </section>
  )
}
