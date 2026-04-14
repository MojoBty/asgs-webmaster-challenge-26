const FOOTER_LINKS = [
  { label: 'Email',     href: 'mailto:',                       external: false },
  { label: 'Resume',    href: '#',                             external: false },
  { label: 'Instagram', href: 'https://www.instagram.com/',    external: true  },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/',     external: true  },
]

export default function Footer() {
  return (
    <footer className="bg-primary">
      <div className="flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left md:gap-0 w-full py-10 md:py-12 px-5 md:px-12 lg:px-[80px] max-w-[1440px] mx-auto">

        {/* Credit */}
        <p className="font-body text-[1rem] font-normal leading-poppins text-white uppercase tracking-[-0.01em]">
          Made with{' '}
          <span className="inline-block animate-heartbeat" aria-hidden>♡</span>
          {' '}by A.S. Graphic Studio
        </p>

        {/* Links */}
        <nav
          className="flex gap-x-5 md:gap-x-7 items-center flex-wrap md:justify-end"
          aria-label="Social and contact links"
        >
          {FOOTER_LINKS.map(({ label, href, external }) => (
            <a
              key={label}
              href={href}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className={[
                'relative font-body text-[1rem] font-normal leading-poppins text-white uppercase tracking-[-0.01em]',
                'pb-[2px] cursor-pointer',
                // Animated underline
                'after:absolute after:bottom-0 after:left-0 after:h-[1.5px]',
                'after:w-0 after:bg-white after:rounded-sm',
                'after:transition-all after:duration-[220ms] hover:after:w-full',
                'focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 focus-visible:rounded-sm',
              ].join(' ')}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
