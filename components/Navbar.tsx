'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import basePath from '@/lib/basePath'

const NAV_LINKS = [
  { label: 'Home',    href: '#home',    id: 'home' },
  { label: 'About',   href: '#about',   id: 'about' },
  { label: 'Events',  href: '#events',  id: 'events' },
  { label: 'Details', href: '#details', id: 'details' },
]

export default function Navbar() {
  const [isOpen,     setIsOpen]     = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeId,   setActiveId]   = useState('home')

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section highlight — scroll-based: whichever section's top has most recently
  // passed the bottom of the navbar is the active one
  useEffect(() => {
    const sections = NAV_LINKS
      .map(l => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null)

    // Navbar height at current breakpoint (matches the h-[52/60/70px] in JSX)
    function navbarHeight() {
      if (window.innerWidth >= 1024) return 84
      if (window.innerWidth >= 768)  return 72
      return 60
    }

    function update() {
      // If scrolled to the bottom, always activate the last section
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        setActiveId(sections[sections.length - 1].id)
        return
      }

      const scrolled = window.scrollY + navbarHeight() + 1
      let active = sections[0].id
      for (const section of sections) {
        if (section.offsetTop <= scrolled) active = section.id
      }
      setActiveId(active)
    }

    window.addEventListener('scroll',    update, { passive: true })
    window.addEventListener('scrollend', update, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll',    update)
      window.removeEventListener('scrollend', update)
    }
  }, [])

  // Close mobile menu when clicking outside the nav
  useEffect(() => {
    if (!isOpen) return
    const handleOutsideClick = (e: MouseEvent) => {
      const nav = document.getElementById('main-nav')
      if (nav && !nav.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [isOpen])

  const logoRef = useRef<HTMLAnchorElement>(null)
  const close   = () => setIsOpen(false)

  function handleLogoClick() {
    close()
    if (!logoRef.current) return
    const rect = logoRef.current.getBoundingClientRect()
    window.dispatchEvent(new CustomEvent('beargardenconfetti', {
      detail: {
        x:       rect.left + rect.width  / 2,
        y:       (window.innerWidth >= 1024 ? 84 : window.innerWidth >= 768 ? 72 : 60) + 10,
        palette: ['#00588c', '#3a8ec0', '#6ab4e0', '#90cce8', '#c8eaf8', '#ffffff'],
        count:   60,
      },
    }))
  }

  return (
    <nav
      id="main-nav"
      aria-label="Main navigation"
      className={cn(
        'fixed top-0 left-0 right-0 z-[200] bg-primary transition-shadow duration-[250ms]',
        isScrolled && 'shadow-[0_2px_24px_rgba(0,0,0,0.25)]'
      )}
    >
      {/* ── Main bar ── */}
      <div className="flex items-center justify-between h-[60px] md:h-[72px] lg:h-[84px] px-5 md:px-8 lg:px-[50px] max-w-[1440px] mx-auto">

        {/* Logo */}
        <a
          ref={logoRef}
          href="#home"
          onClick={handleLogoClick}
          className="hover:-translate-y-0.5 hover:opacity-90 transition-[transform,opacity] duration-200"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/images/ASCE_logo_full_white.png`}
            alt="ASCE at UC San Diego"
            className="h-20 md:h-24 lg:h-28 w-auto"
          />
        </a>

        {/* Desktop nav links — hidden on mobile */}
        <ul className="hidden md:flex gap-11 items-center" role="list">
          {NAV_LINKS.map(({ label, href, id }) => (
            <li key={href}>
              <a
                href={href}
                className={cn(
                  'relative font-body text-[1rem] font-normal text-white uppercase',
                  'tracking-[-0.01em] leading-poppins pb-[3px]',
                  // Underline pseudo-element via group hover + active
                  'after:absolute after:bottom-0 after:left-0 after:h-[1.5px]',
                  'after:bg-white after:rounded-sm after:transition-all after:duration-[220ms]',
                  activeId === id
                    ? 'after:w-full'
                    : 'after:w-0 hover:after:w-full'
                )}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger — visible only on mobile */}
        <button
          className="flex md:hidden w-9 h-9 items-center justify-center bg-transparent border-none cursor-pointer z-[201] transition-transform duration-150 hover:scale-110 active:scale-95"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen(prev => !prev)}
        >
          {isOpen
            ? <X  className="w-6 h-6 text-white" aria-hidden />
            : <Menu className="w-6 h-6 text-white" aria-hidden />
          }
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      <ul
        id="mobile-menu"
        role="list"
        className={cn(
          'md:hidden fixed top-[60px] left-0 right-0 bg-primary flex flex-col',
          'z-[199] shadow-[0_8px_24px_rgba(0,0,0,0.25)]',
          'transition-[transform,opacity] duration-[380ms] ease-in-out',
          isOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        )}
      >
        {NAV_LINKS.map(({ label, href }, index) => (
          <li key={href} className="w-full">
            <a
              href={href}
              onClick={close}
              style={{ transitionDelay: isOpen ? `${index * 55}ms` : '0ms' }}
              className="block font-body text-[1.0625rem] font-normal text-white uppercase px-5 py-3.5 hover:bg-white/10 transition-colors duration-150"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
