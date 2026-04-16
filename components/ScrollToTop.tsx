'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollY    = window.scrollY
      const atBottom   = scrollY + window.innerHeight >= document.documentElement.scrollHeight - 120
      setVisible(scrollY > 400 && !atBottom)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => {
        window.dispatchEvent(new CustomEvent('scrolltotop'))
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      aria-label="Scroll to top"
      style={{ right: 'max(20px, calc(env(safe-area-inset-right) + 12px))' }}
      className={cn(
        'fixed bottom-6 md:bottom-8 z-[230]',
        'w-11 h-11 rounded-full bg-primary text-white',
        'flex items-center justify-center',
        'shadow-[0_4px_16px_rgba(0,88,140,0.4)]',
        'transition-[transform,opacity,box-shadow] duration-[1100ms]',
        'hover:scale-110 hover:shadow-[0_6px_24px_rgba(0,88,140,0.5)] hover:-translate-y-0.5',
        'active:scale-95',
        'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2',
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none'
      )}
    >
      <ChevronUp className="w-5 h-5" aria-hidden />
    </button>
  )
}
