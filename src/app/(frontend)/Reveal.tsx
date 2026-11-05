'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Scroll reveals for any element with `data-reveal`. Sets `data-in` when the element
 * scrolls into view; CSS does the motion. Stagger siblings with style={{ '--i': n }}.
 *
 * Content is only hidden once this has run (`reveal-on` on <html>), and anything already
 * on screen is marked visible first, so there is no flash, no-JS visitors and crawlers
 * see everything, and a script failure can never leave the page blank.
 * `data-in` is not a React prop, so Live Preview re-renders keep it.
 */
export function Reveal() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.remove('reveal-on')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-in', '')
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )

    const arm = (el: Element) => {
      if (el.hasAttribute('data-in')) return
      const rect = el.getBoundingClientRect()
      if (rect.top < innerHeight * 0.95 && rect.bottom > 0) el.setAttribute('data-in', '')
      else io.observe(el)
    }

    document.querySelectorAll('[data-reveal]').forEach(arm)
    root.classList.add('reveal-on')

    // Sections added later (Live Preview edits, client navigation) get armed too.
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations)
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          if (node.matches('[data-reveal]')) arm(node)
          node.querySelectorAll('[data-reveal]').forEach(arm)
        })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
