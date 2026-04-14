'use client'

import { useEffect, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface BaseParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  shape: 0 | 1 | 2   // 0 = circle  1 = square  2 = ribbon
  color: string
  alpha: number
  rotation: number
  rotSpeed: number
}

interface ConfettiParticle extends BaseParticle {
  life: number
  decay: number
}

interface Zone {
  l: number; r: number; t: number; b: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const rand = (a: number, b: number) => Math.random() * (b - a) + a
const pick  = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const AMBIENT_COLORS = [
  '#0080c0',
  '#f0a030',
  '#a0d0f0',
  '#ffd060',
  '#ffffff',
]

const AMBIENT_COUNT      = 220
const AMBIENT_COUNT_MOB  = 60
const CONFETTI_PER_BURST = 120
const GRAVITY            = 0.22
const AIR                = 0.989

// ─── Spawn helpers ───────────────────────────────────────────────────────────

function spawnAmbient(w: number, h: number): BaseParticle {
  return {
    x:        rand(0, w),
    y:        rand(0, h),
    vx:       rand(-0.22, 0.22),
    vy:       rand(-0.40, -0.09),
    size:     rand(4, 10),
    shape:    Math.floor(rand(0, 3)) as 0 | 1 | 2,
    color:    pick(AMBIENT_COLORS),
    alpha:    rand(0.22, 0.45),
    rotation: rand(0, Math.PI * 2),
    rotSpeed: rand(-0.008, 0.008),
  }
}

function spawnConfettiParticle(cx: number, cy: number, palette: string[]): ConfettiParticle {
  const angle = rand(-Math.PI * 0.96, -Math.PI * 0.04)
  const speed = rand(3.5, 10.5)
  return {
    x:        cx + rand(-45, 45),
    y:        cy + rand(-12, 12),
    vx:       Math.cos(angle) * speed,
    vy:       Math.sin(angle) * speed,
    size:     rand(5, 13),
    shape:    Math.floor(rand(0, 3)) as 0 | 1 | 2,
    color:    pick(palette),
    alpha:    1,
    rotation: rand(0, Math.PI * 2),
    rotSpeed: rand(-0.16, 0.16),
    life:     1,
    decay:    rand(0.010, 0.020),
  }
}

// ─── Draw ────────────────────────────────────────────────────────────────────

function drawShape(ctx: CanvasRenderingContext2D, shape: 0 | 1 | 2, size: number) {
  if (shape === 0) {
    ctx.beginPath()
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2)
    ctx.fill()
  } else if (shape === 1) {
    ctx.fillRect(-size / 2, -size / 2, size, size)
  } else {
    ctx.fillRect(-size * 0.85, -size * 0.22, size * 1.7, size * 0.44)
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    if (!canvas) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    if (!ctx) return

    const isMobile = window.matchMedia('(max-width: 767px)').matches

    const ambient:  BaseParticle[]     = []
    const confetti: ConfettiParticle[] = []
    let rafId   = 0
    let cssW    = 0
    let cssH    = 0
    let lastTime = 0
    const FRAME_MS = isMobile ? 1000 / 30 : 0   // 30fps cap on mobile, uncapped on desktop
    // Navbar height at current breakpoint — used to keep ambient out of the fixed bar
    let navbarH = 60

    // Exclusion zones in document coordinates — rebuilt on resize, not every frame.
    let exclusions: Zone[] = []

    const heroEl   = document.querySelector<HTMLElement>('#home')
    const footerEl = document.querySelector('footer')
    const cardEls  = Array.from(document.querySelectorAll<HTMLElement>('#events article'))

    function buildExclusions() {
      exclusions = []
      const sy = window.scrollY

      const add = (el: Element | null) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        exclusions.push({ l: r.left, r: r.right, t: r.top + sy, b: r.bottom + sy })
      }

      add(heroEl)
      add(footerEl)
      cardEls.forEach(add)
    }

    // ── Exclusion check — pure arithmetic, no DOM access ─────────────────────
    function inExcluded(px: number, py: number): boolean {
      for (const z of exclusions) {
        if (px >= z.l && px <= z.r && py >= z.t && py <= z.b) return true
      }
      return false
    }

    // ── Resize ───────────────────────────────────────────────────────────────
    function resize() {
      const newW = window.innerWidth
      const newH = window.innerHeight
      const widthChanged = newW !== cssW

      cssW = newW
      cssH = newH
      navbarH = cssW >= 1024 ? 84 : cssW >= 768 ? 72 : 60
      canvas.width  = cssW
      canvas.height = cssH

      // Only re-spawn particles on width change — height-only changes are the
      // mobile browser chrome showing/hiding, which would cause a visible teleport
      if (widthChanged || ambient.length === 0) {
        ambient.length = 0
        const docH  = document.body.scrollHeight
        const count = cssW < 768 ? AMBIENT_COUNT_MOB : AMBIENT_COUNT
        for (let i = 0; i < count; i++) {
          ambient.push(spawnAmbient(cssW, docH))
        }
      }

      buildExclusions()
    }

    // ── Confetti event ────────────────────────────────────────────────────────
    function onConfetti(e: Event) {
      const { x, y, palette, count } = (e as CustomEvent<{
        x: number; y: number; palette: string[]; count?: number
      }>).detail

      const n = count ?? CONFETTI_PER_BURST
      for (let i = 0; i < n; i++) {
        confetti.push(spawnConfettiParticle(x, y, palette))
      }
      if (confetti.length > 600) confetti.splice(0, confetti.length - 600)
    }

    // ── Animation tick ────────────────────────────────────────────────────────
    function tick(time: number) {
      if (FRAME_MS > 0 && time - lastTime < FRAME_MS) {
        rafId = requestAnimationFrame(tick)
        return
      }
      lastTime = time

      const scrollY = window.scrollY
      const docH    = document.body.scrollHeight

      ctx.clearRect(0, 0, cssW, cssH)

      // Ambient — document coords; shift canvas so they follow scroll
      ctx.save()
      ctx.translate(0, -scrollY)

      for (const p of ambient) {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotSpeed

        if (p.y  < -10)       { p.y = docH + 10; p.x = rand(0, cssW) }
        if (p.x  < -10)         p.x = cssW + 10
        if (p.x  > cssW + 10)   p.x = -10

        // Skip particles in the fixed navbar strip (viewport coordinates)
        if (p.y - scrollY <= navbarH) continue

        if (inExcluded(p.x, p.y)) continue

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle   = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        drawShape(ctx, p.shape, p.size)
        ctx.restore()
      }

      ctx.restore()

      // Confetti — viewport coords, physics + gravity
      for (let i = confetti.length - 1; i >= 0; i--) {
        const p = confetti[i]

        p.vy += GRAVITY
        p.vx *= AIR
        p.x  += p.vx
        p.y  += p.vy
        p.rotation += p.rotSpeed
        p.life -= p.decay

        if (p.life <= 0) { confetti.splice(i, 1); continue }

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.fillStyle   = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        drawShape(ctx, p.shape, p.size)
        ctx.restore()
      }

      rafId = requestAnimationFrame(tick)
    }

    // ── Visibility — pause when tab is hidden ─────────────────────────────────

    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(rafId)
      else rafId = requestAnimationFrame(tick)
    }

    resize()
    // Rebuild exclusions once all images have loaded — page height is now final
    window.addEventListener('load',               buildExclusions)
    window.addEventListener('resize',             resize)
    window.addEventListener('beargardenconfetti', onConfetti)
    document.addEventListener('visibilitychange', onVisibility)
    // Rebuild exclusions whenever document height changes (e.g. accordion open/close)
    // Debounced so mobile browser-chrome height flicker doesn't thrash layout reads
    let roTimer = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(roTimer)
      roTimer = window.setTimeout(buildExclusions, 150)
    })
    ro.observe(document.body)
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('load',               buildExclusions)
      window.removeEventListener('resize',             resize)
      window.removeEventListener('beargardenconfetti', onConfetti)
      document.removeEventListener('visibilitychange', onVisibility)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ willChange: 'transform' }}
      className="fixed inset-0 pointer-events-none z-[210]"
    />
  )
}
