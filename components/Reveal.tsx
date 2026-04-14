'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger delay in milliseconds */
  delay?: number
  /**
   * 'default' — fade + slide up (standard sections)
   * 'blur'    — fade + slide up + blur-in (large display text)
   */
  variant?: 'default' | 'blur'
}

/**
 * Wraps children in a div that animates in when it enters the viewport.
 * Respects prefers-reduced-motion via CSS (globals.css).
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  variant = 'default',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 120px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(variant === 'blur' ? 'reveal-blur' : 'reveal', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
