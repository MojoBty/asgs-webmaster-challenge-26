'use client'

import React, { useRef } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import Reveal from '@/components/Reveal'
import { cn } from '@/lib/utils'

const DETAILS = [
  {
    id:      'food',
    title:   'Food',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius eu metus et scelerisque. Nullam gravida eu elit at rutrum. Aliquam sit amet sollicitudin est. Suspendisse potenti. Donec porttitor tempor pulvinar. Sed congue elementum placerat. Maecenas nec rhoncus est.',
    palette: ['#f0a030', '#e86020', '#ffd060', '#ff8040', '#fff080'],
  },
  {
    id:      'merch',
    title:   'Merch',
    content: 'Mauris vel nisl ante. Vivamus sagittis ullamcorper quam, sit amet tincidunt enim sollicitudin ut. Vestibulum at elementum leo. Aliquam erat volutpat. Nullam magna orci, accumsan at arcu lobortis, volutpat cursus nisl. Suspendisse metus purus, gravida vehicula eros in, malesuada posuere magna.',
    palette: ['#00588c', '#3a8ec0', '#6ab4e0', '#0080c0', '#c8eaf8'],
  },
  {
    id:      'attractions',
    title:   'Attractions',
    content: 'Nulla ac dolor nibh. Vestibulum feugiat convallis posuere. Pellentesque vestibulum eleifend turpis vel consequat. Cras tempor turpis in nunc finibus sollicitudin. Morbi malesuada sodales urna, quis pulvinar nunc interdum ultrices. Nullam id risus velit. Ut fringilla eleifend mollis.',
    palette: ['#ff6060', '#ffd060', '#60cc60', '#6090ff', '#ff60c8'],
  },
  {
    id:      'prizes',
    title:   'Prizes',
    content: 'Integer tempor enim lacus, sit amet dapibus diam elementum et. Pellentesque congue libero id enim dignissim consequat. Fusce et sagittis magna, in feugiat felis. Sed volutpat, risus id ultricies blandit, arcu elit consectetur tellus, laoreet ornare purus nulla in ipsum.',
    palette: ['#ffd700', '#ffb820', '#ffe860', '#ffa020', '#fff8a0'],
  },
]

export default function BearGardenDetails() {
  const rootRef = useRef<HTMLElement>(null)

  function handleValueChange(value: string) {
    if (!value || !rootRef.current) return
    const itemEl = rootRef.current.querySelector<HTMLElement>(`[data-value="${value}"]`)
    if (!itemEl) return
    const rect    = itemEl.getBoundingClientRect()
    const palette = DETAILS.find(d => d.id === value)?.palette ?? []
    window.dispatchEvent(new CustomEvent('beargardenconfetti', {
      detail: {
        x:       rect.left + rect.width / 2,
        y:       rect.top  + rect.height * 0.25,
        palette,
        count:   45,
      },
    }))
  }

  return (
    <section
      id="details"
      className="pt-[50px] pb-[100px] md:pt-[80px] md:pb-[140px] lg:pt-[80px] lg:pb-[160px] bg-bg-warm md:scroll-mt-[72px] lg:scroll-mt-[84px]"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[80px]">
      {/* ── Desktop 2×2 grid (hidden on mobile) ── */}
      <div className="hidden md:grid grid-cols-2 gap-x-16 lg:gap-x-[120px] gap-y-14">
        {DETAILS.map((item, i) => (
          <Reveal key={item.id} delay={i * 80}>
            <div className="group">
              <h3 className="font-heading text-[1.5rem] font-semibold leading-athiti text-primary mb-3 transition-colors duration-200 group-hover:text-primary/70">
                {item.title}
              </h3>
              <p className="font-body text-[1.125rem] font-normal leading-poppins text-text-body tracking-[-0.01em]">
                {item.content}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ── Mobile Accordion (hidden on md+) ── */}
      {/* Built on @radix-ui/react-accordion — the same primitive shadcn/ui uses */}
      <Accordion.Root
        ref={rootRef as React.RefObject<HTMLDivElement>}
        type="single"
        collapsible
        className="md:hidden"
        aria-label="Bear Garden details"
        onValueChange={handleValueChange}
      >
        {DETAILS.map(item => (
          <Accordion.Item
            key={item.id}
            value={item.id}
            data-value={item.id}
            className="border-b border-border-card first:border-t transition-[background-color,border-color,border-radius,margin,padding] duration-300 data-[state=open]:bg-primary/[0.06] data-[state=open]:border-primary/20 data-[state=open]:rounded-xl data-[state=open]:px-3 data-[state=open]:my-1"
          >
            <Accordion.Header asChild>
              <h3>
                <Accordion.Trigger
                  className={cn(
                    'flex items-center justify-between w-full py-[18px]',
                    'bg-transparent border-none cursor-pointer group text-left',
                    'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 focus-visible:rounded-sm'
                  )}
                >
                  <span className="font-heading text-[1.5rem] font-semibold leading-athiti text-primary">
                    {item.title}
                  </span>
                  <ChevronDown
                    className="text-primary w-5 h-5 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180"
                    aria-hidden
                  />
                </Accordion.Trigger>
              </h3>
            </Accordion.Header>

            <Accordion.Content
              className={cn(
                'overflow-hidden',
                'data-[state=open]:animate-accordion-down',
                'data-[state=closed]:animate-accordion-up'
              )}
            >
              <p className="font-body text-[1rem] font-normal leading-poppins text-text-body tracking-[-0.01em] pb-5">
                {item.content}
              </p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      </div>
    </section>
  )
}
