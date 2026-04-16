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
        // Scrolled down past the end — release lock, let page scroll down normally.
        // Short suppress prevents the scroll-up condition from immediately
        // re-firing when coming down from a re-entry lock position (r.bottom ≈ vh).
        phaseRef.current = 'done'
        accRef.current   = TOTAL_PX
        setVisibleWords(WORDS.length)
        setShowExpl(true)
        unlock()
        setSuppressNav(600)
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
      const dy = touchYRef.current - e.touches[0].clientY
      touchYRef.current = e.touches[0].clientY

      // Already locked — handle normally
      if (phaseRef.current === 'active') {
        e.preventDefault()
        advance(dy * 2)
        return
      }

      // Activation checks — touchmove fires before the browser commits the
      // scroll, so calling e.preventDefault() here stops the page from moving
      // in the first place (far more reliable than correcting after onScroll).
      if (suppressToTop || suppressNav) return

      const r    = section.getBoundingClientRect()
      const navH = getNavH()
      const vh   = window.innerHeight

      // Swipe DOWN into the section
      if (phaseRef.current === 'idle' && dy > 0 &&
          r.top <= navH + 80 && r.bottom > navH + 100) {
        e.preventDefault()
        phaseRef.current   = 'active'
        accRef.current     = 0
        lockedYRef.current = window.scrollY  // section already in view — no snap
        advance(dy * 2)
        return
      }

      // Swipe UP back into the section from below
      if (phaseRef.current === 'done' && dy < 0 &&
          r.bottom > vh - 100 && r.bottom <= vh + 80) {
        e.preventDefault()
        phaseRef.current = 'active'
        accRef.current   = TOTAL_PX
        lockAt(Math.max(0, section.offsetTop + section.offsetHeight - vh))
        advance(dy * 2)
        return
      }
    }

    // ── Activation: section top reaching navbar (scroll down) or
    //               section bottom re-entering viewport (scroll up) ────────────
    //
    // Two suppress flags with different lifetimes:
    //   suppressToTop — set on scroll-to-top click; clears once scrollY < 10
    //                   (prevents scroll-DOWN activation as the smooth scroll
    //                    passes through the section on the way up)
    //   suppressNav   — timer-based (2 s for nav links, 600 ms for scroll-down
    //                    completion from a re-entry); prevents scroll-UP
    //                    re-activation while a programmatic scroll is in flight
    let suppressToTop = false
    let suppressNav   = false
    let suppressTimer = 0
    let lastScrollY   = window.scrollY
    const setSuppressNav = (ms: number) => {
      suppressNav = true
      clearTimeout(suppressTimer)
      suppressTimer = window.setTimeout(() => { suppressNav = false }, ms)
    }

    const onScroll = () => {
      const currentY    = window.scrollY
      const scrollingUp = currentY < lastScrollY
      const scrollingDown = currentY > lastScrollY
      lastScrollY = currentY

      if (suppressToTop) {
        if (window.scrollY < 10) suppressToTop = false
        return
      }
      if (suppressNav) return

      const r    = section.getBoundingClientRect()
      const navH = getNavH()
      const vh   = window.innerHeight

      // Scroll DOWN: section top reaches the navbar
      if (scrollingDown && phaseRef.current === 'idle' && r.top <= navH + 60 && r.bottom > navH + 100) {
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
      if (scrollingUp && phaseRef.current === 'done' && r.bottom > vh - 100 && r.bottom <= vh + 80) {
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

    // ── Nav link to section below "about" ────────────────────────────────────
    // Auto-plays the animation at speed then scrolls to the target section.
    const scrollToTarget = (targetId: string) => {
      const el = document.getElementById(targetId)
      if (!el) return
      // Suppress re-activation for the full duration of the smooth scroll.
      setSuppressNav(2000)
      const offset = window.innerWidth >= 1024 ? getNavH() : 0
      const top    = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }

    const onNavigatePastAbout = (e: Event) => {
      const { targetId } = (e as CustomEvent<{ targetId: string }>).detail

      // Already done (or fully revealed mid re-entry) — just scroll to target
      if (phaseRef.current === 'done' ||
          (phaseRef.current === 'active' && accRef.current >= TOTAL_PX)) {
        phaseRef.current = 'done'
        unlock()
        scrollToTarget(targetId)
        return
      }

      // Activate from idle if needed
      if (phaseRef.current === 'idle') {
        phaseRef.current = 'active'
        accRef.current   = 0
        lockAt(section.offsetTop - getNavH())
      }

      // rAF loop: animate acc → TOTAL_PX over ~600ms, then navigate.
      // window.scrollTo pin is only called while t < 1 so it doesn't
      // cancel the final scrollToTarget call on iOS.
      const startAcc  = accRef.current
      const startTime = performance.now()
      const DURATION  = 600

      const tick = (now: number) => {
        if (phaseRef.current !== 'active') return
        const t      = Math.min(1, (now - startTime) / DURATION)
        const eased  = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        const newAcc = startAcc + (TOTAL_PX - startAcc) * eased

        accRef.current = newAcc
        const wordCount = Math.min(WORDS.length, Math.floor(newAcc / PX_PER_WORD))
        setVisibleWords(wordCount)
        setShowExpl(newAcc >= WORDS.length * PX_PER_WORD + EXPLANATION_HOLD)

        if (t < 1) {
          window.scrollTo(0, lockedYRef.current) // pin only while animating
          requestAnimationFrame(tick)
        } else {
          phaseRef.current = 'done'
          accRef.current   = TOTAL_PX
          setVisibleWords(WORDS.length)
          setShowExpl(true)
          unlock()
          scrollToTarget(targetId)
        }
      }

      requestAnimationFrame(tick)
    }

    // ── Scroll-to-top button ──────────────────────────────────────────────────
    // Reset animation and suppress re-activation for the duration of the smooth
    // scroll. The suppress clears in onScroll once scrollY < 10, with a 2s
    // fallback in case the scroll is interrupted before reaching the top.
    const onScrollToTop = () => {
      unlock()
      phaseRef.current = 'idle'
      accRef.current   = 0
      setVisibleWords(0)
      setShowExpl(false)
      suppressToTop = true   // clears in onScroll once scrollY < 10
    }

    window.addEventListener('scroll',             onScroll,             { passive: true })
    window.addEventListener('wheel',              onWheel,              { passive: false })
    window.addEventListener('touchstart',         onTouchStart,         { passive: true })
    window.addEventListener('touchmove',          onTouchMove,          { passive: false })
    window.addEventListener('resize',             onResize)
    window.addEventListener('scrolltotop',        onScrollToTop)
    window.addEventListener('navigatepastabout',  onNavigatePastAbout)

    return () => {
      unlock()
      clearTimeout(resizeTimer)
      clearTimeout(suppressTimer)
      window.removeEventListener('scroll',             onScroll)
      window.removeEventListener('wheel',              onWheel)
      window.removeEventListener('touchstart',         onTouchStart)
      window.removeEventListener('touchmove',          onTouchMove)
      window.removeEventListener('resize',             onResize)
      window.removeEventListener('scrolltotop',        onScrollToTop)
      window.removeEventListener('navigatepastabout',  onNavigatePastAbout)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="pt-[130px] pb-[75px] px-5 md:pt-[170px] md:pb-[100px] md:px-[72px] lg:pt-[200px] lg:pb-[130px] lg:px-[120px] text-center bg-bg-warm lg:scroll-mt-[84px] overflow-hidden"
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
