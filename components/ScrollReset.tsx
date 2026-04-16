'use client'

import { useEffect } from 'react'

/**
 * Disables the browser's built-in scroll restoration so every page load
 * (including refresh) always starts at the top.
 */
export default function ScrollReset() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  return null
}
