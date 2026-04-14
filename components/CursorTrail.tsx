'use client'

import { useEffect, useRef } from 'react'

const COLORS = ['#0080c0', '#f0a030', '#a0d0f0', '#ffd060', '#ffffff', '#ff9fbc', '#a0e890']

interface Spark {
  x: number; y: number
  vx: number; vy: number
  size: number; color: string
  life: number; decay: number
  rotation: number
}

function drawPaw(ctx: CanvasRenderingContext2D, size: number) {
  // Four toe beans in an arc
  const toeR = size * 0.27
  const toes = [
    { x: -size * 0.52, y: -size * 0.16 },
    { x: -size * 0.18, y: -size * 0.60 },
    { x:  size * 0.18, y: -size * 0.60 },
    { x:  size * 0.52, y: -size * 0.16 },
  ]
  for (const t of toes) {
    ctx.beginPath()
    ctx.arc(t.x, t.y, toeR, 0, Math.PI * 2)
    ctx.fill()
  }
  // Main pad
  ctx.beginPath()
  ctx.ellipse(0, size * 0.22, size * 0.52, size * 0.44, 0, 0, Math.PI * 2)
  ctx.fill()
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Desktop only — pointer: fine excludes touchscreens
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // ctx is non-null from here — assert so TypeScript doesn't complain inside closures
    const safeCtx = ctx as CanvasRenderingContext2D

    let cssW = window.innerWidth
    let cssH = window.innerHeight

    const resize = () => {
      cssW = canvas.width  = window.innerWidth
      cssH = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const sparks: Spark[] = []
    let mouseX = -200, mouseY = -200
    let lastX  = -200, lastY  = -200
    let rafId  = 0

    const rand = (a: number, b: number) => Math.random() * (b - a) + a
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

    function onMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    function tick() {
      safeCtx.clearRect(0, 0, cssW, cssH)

      // Spawn sparks only when the cursor has moved enough
      const dx = mouseX - lastX
      const dy = mouseY - lastY
      if (dx * dx + dy * dy > 25) {
        const n = Math.floor(rand(1, 3))
        for (let i = 0; i < n; i++) {
          sparks.push({
            x:        mouseX + rand(-5, 5),
            y:        mouseY + rand(-5, 5),
            vx:       rand(-0.25, 0.25),
            vy:       rand(-0.5, -0.05),
            size:     rand(4, 8),
            color:    pick(COLORS),
            life:     1,
            decay:    rand(0.018, 0.030),
            rotation: rand(0, Math.PI * 2),
          })
        }
        if (sparks.length > 60) sparks.splice(0, sparks.length - 60)
        lastX = mouseX
        lastY = mouseY
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.rotation += 0.06
        s.life -= s.decay
        if (s.life <= 0) { sparks.splice(i, 1); continue }

        safeCtx.save()
        safeCtx.globalAlpha = Math.max(0, s.life) * 0.85
        safeCtx.fillStyle   = s.color
        safeCtx.translate(s.x, s.y)
        safeCtx.rotate(s.rotation)
        drawPaw(safeCtx, s.size * (s.life * 0.6 + 0.4))
        safeCtx.restore()
      }

      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[220]"
    />
  )
}
