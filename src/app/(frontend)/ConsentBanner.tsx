'use client'

import { useEffect, useState } from 'react'
import { CONSENT_EVENT, CONSENT_KEY } from '@/lib/consent'

type Choice = 'granted' | 'denied'

const read = (): Choice | null => {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

function apply(choice: Choice) {
  try {
    localStorage.setItem(CONSENT_KEY, choice)
  } catch {}
  window.dataLayer = window.dataLayer || []
  // gtag() pushes the arguments object, which is what Consent Mode expects.
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  gtag?.('consent', 'update', { analytics_storage: choice })
  window.dataLayer.push({ event: 'consent_update', analytics_consent: choice })
}

/**
 * Small bottom banner asking before analytics cookies are set. Hidden once a choice is
 * made; "Cookie settings" in the footer reopens it. Visitors sending Global Privacy
 * Control are treated as having said no and aren't asked.
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl
    if (!read() && !gpc) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(CONSENT_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_EVENT, reopen)
  }, [])

  if (!open) return null

  const choose = (choice: Choice) => {
    apply(choice)
    setOpen(false)
  }

  return (
    <div
      aria-label="Cookie preferences"
      aria-live="polite"
      className="consent-banner fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-[760px] border border-[#0a2939]/15 bg-white p-5 text-[#0a2939] shadow-[0_24px_60px_-20px_rgba(10,41,57,0.45)] sm:inset-x-6 sm:bottom-6 md:p-6"
      role="region"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <p className="text-[15px] leading-[1.55] text-[#31505e]">
          We’d like to use analytics cookies to understand which pages are useful. No advertising, no selling data.{' '}
          <a className="font-bold text-[#b74730] underline underline-offset-4" href="/privacy#cookies">
            Privacy policy
          </a>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            className="min-h-11 border border-[#0a2939]/25 px-5 text-sm font-bold transition hover:border-[#0a2939]"
            onClick={() => choose('denied')}
            type="button"
          >
            No thanks
          </button>
          <button
            className="min-h-11 bg-[#0a2939] px-5 text-sm font-bold text-white transition hover:bg-[#ff7657] hover:text-[#0a2939]"
            onClick={() => choose('granted')}
            type="button"
          >
            Allow analytics
          </button>
        </div>
      </div>
    </div>
  )
}

/** Footer button that reopens the banner. */
export function CookieSettingsButton({ className = '' }: { className?: string }) {
  return (
    <button className={className} onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))} type="button">
      Cookie settings
    </button>
  )
}
