'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    const lenis = new Lenis({
      anchors: true,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    })

    let frame = 0

    const animate = (time: number) => {
      lenis.raf(time)
      frame = window.requestAnimationFrame(animate)
    }

    frame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return null
}
