'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Pushes named interaction events to the GTM dataLayer. One delegated click listener
 * classifies every link by where it points and where it sits on the page, so links
 * added later in the CMS are tracked without extra markup.
 *
 * Events (all carry link_text, link_url, cta_location, page_type):
 *   contact_click     mailto: links (primary conversion)
 *   cta_click         links that jump to the contact section
 *   service_click     links to /what-we-do/<slug>           + service_slug
 *   engagement_click  offer links in the "engage" section   + offer_name
 *   social_click      LinkedIn / Instagram                  + social_network
 *   nav_click         other header / footer navigation
 *   section_view      a key section reaches mid-screen, once per page view + section_name
 *   faq_open          an FAQ question is expanded                          + faq_question
 *
 * Optional markup: data-track-location="..." names a region, data-track-offer="..." an offer.
 */

type DataLayerEvent = Record<string, string | undefined> & { event: string }

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

const TRACKED_SECTIONS = ['services', 'work', 'approach', 'about', 'engage', 'faq', 'contact', 'capabilities']

function push(data: DataLayerEvent) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(data)
}

function pageType(pathname: string) {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/what-we-do/')) return 'service'
  return 'other'
}

function locationOf(el: Element) {
  const named = el.closest<HTMLElement>('[data-track-location]')
  if (named?.dataset.trackLocation) return named.dataset.trackLocation
  if (el.closest('header')) return 'header'
  if (el.closest('footer')) return 'footer'
  return el.closest('section[id]')?.id || 'body'
}

function textOf(el: HTMLElement) {
  // Cards: the heading names the link better than the whole card's text.
  const heading = el.querySelector('h2, h3, h4')
  const text = el.getAttribute('aria-label') || heading?.textContent || el.innerText || el.textContent || ''
  return text.replace(/\s+/g, ' ').trim().slice(0, 100)
}

function classify(link: HTMLAnchorElement): DataLayerEvent | null {
  const raw = link.getAttribute('href') || ''
  if (!raw || raw === '#root' || raw.startsWith('/next/')) return null // skip link, preview controls

  const base = {
    link_text: textOf(link),
    link_url: raw,
    cta_location: locationOf(link),
    page_type: pageType(window.location.pathname),
  }

  if (raw.startsWith('mailto:')) return { event: 'contact_click', ...base }

  let url: URL
  try {
    url = new URL(raw, window.location.href)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^www\./, '')
  if (host === 'linkedin.com' || host === 'instagram.com') {
    return { event: 'social_click', social_network: host.split('.')[0], ...base }
  }

  const sameSite = url.origin === window.location.origin
  if (!sameSite) return null // GA4 enhanced measurement already records outbound clicks

  // Jump links within the current page (e.g. "#contact" on a service page).
  const samePageAnchor = url.pathname === window.location.pathname && url.hash !== ''

  const offer = link.closest<HTMLElement>('[data-track-offer]')?.dataset.trackOffer
  if (offer || base.cta_location === 'engage') {
    return { event: 'engagement_click', offer_name: offer, ...base }
  }

  const service = samePageAnchor ? undefined : url.pathname.match(/^\/what-we-do\/([^/]+)/)?.[1]
  if (service) return { event: 'service_click', service_slug: service, ...base }

  if (url.hash === '#contact') return { event: 'cta_click', ...base }

  if (base.cta_location === 'header' || base.cta_location === 'footer') {
    return { event: 'nav_click', ...base }
  }

  return url.hash ? { event: 'cta_click', ...base } : null
}

export function Tracking() {
  const pathname = usePathname()

  // Clicks: one listener for the whole site.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a')
      if (!link) return
      const data = classify(link as HTMLAnchorElement)
      if (data) push(data)
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  // FAQ opens. "toggle" doesn't bubble, so listen in the capture phase.
  useEffect(() => {
    const onToggle = (e: Event) => {
      const el = e.target as HTMLDetailsElement
      if (!(el instanceof HTMLDetailsElement) || !el.open || !el.hasAttribute('data-faq')) return
      push({
        event: 'faq_open',
        faq_question: el.querySelector('summary')?.textContent?.trim().slice(0, 100),
        cta_location: locationOf(el),
        page_type: pageType(window.location.pathname),
      })
    }
    document.addEventListener('toggle', onToggle, { capture: true })
    return () => document.removeEventListener('toggle', onToggle, { capture: true })
  }, [])

  // Section views: re-armed on every route change.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const seen = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id
          if (!entry.isIntersecting || seen.has(id)) continue
          seen.add(id)
          observer.unobserve(entry.target)
          push({ event: 'section_view', section_name: id, page_type: pageType(pathname) })
        }
      },
      // Fires when a section's top reaches mid-screen; works for sections taller than the viewport.
      { rootMargin: '0px 0px -50% 0px' },
    )
    // Wait a frame so the new route's sections are in the DOM.
    const frame = requestAnimationFrame(() => {
      for (const id of TRACKED_SECTIONS) {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      }
    })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [pathname])

  return null
}
