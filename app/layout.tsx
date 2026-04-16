import type { Metadata, Viewport } from 'next'
import { Poppins, Athiti, Spectral } from 'next/font/google'
import ScrollReset from '@/components/ScrollReset'
import './globals.css'

// Poppins — nav, body, cards
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-poppins',
  display: 'swap',
})

// Athiti — section headings
const athiti = Athiti({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-athiti',
  display: 'swap',
})

// Spectral — display serif for the About section italic tagline
// Replace with @font-face 'Ogg' if you obtain the licensed file
const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-spectral',
  display: 'swap',
})

const DESCRIPTION =
  'Bear Gardens are daytime carnivals where students can chill with free food and play games to win some bear-y cool prizes with our mascot, ASCE Bear.'

export const metadata: Metadata = {
  // Update metadataBase to your deployed URL before submission
  metadataBase: new URL('https://beargarden.ucsd.edu'),
  title: 'Bear Garden — ASCE @ UCSD',
  description: DESCRIPTION,
  openGraph: {
    title: 'Bear Garden — ASCE @ UCSD',
    description: DESCRIPTION,
    type: 'website',
    images: [{ url: '/images/hero1.jpg', width: 1440, height: 828, alt: 'Bear Garden — ASCE @ UCSD' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bear Garden — ASCE @ UCSD',
    description: DESCRIPTION,
    images: ['/images/hero1.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#00588c',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${athiti.variable} ${spectral.variable}`}
    >
      <body className="font-body">
        {/* Safe-area fills — cover notch/home-indicator/side-bars with brand color */}
        <div aria-hidden style={{ position:'fixed', top:0, left:0, right:0, height:'env(safe-area-inset-top)', background:'#00588c', zIndex:9999 }} />
        <div aria-hidden style={{ position:'fixed', bottom:0, left:0, right:0, height:'env(safe-area-inset-bottom)', background:'#00588c', zIndex:9999 }} />
        <div aria-hidden style={{ position:'fixed', top:0, bottom:0, left:0, width:'env(safe-area-inset-left)', background:'#00588c', zIndex:9999 }} />
        <div aria-hidden style={{ position:'fixed', top:0, bottom:0, right:0, width:'env(safe-area-inset-right)', background:'#00588c', zIndex:9999 }} />
        <ScrollReset />
        {children}
      </body>
    </html>
  )
}
