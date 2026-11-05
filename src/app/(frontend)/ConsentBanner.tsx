'use client'

import { useEffect, useRef, useState } from 'react'
import {
  CONSENT_EVENT,
  CONSENT_KEY,
  effectiveConsent,
  privacySignal,
  readConsent,
  type Choice,
  type PrivacySignal,
} from '@/lib/consent'

const SIGNAL_NAME: Record<Exclude<PrivacySignal, null>, string> = {
  gpc: 'Global Privacy Control',
  dnt: 'Do Not Track',
}

function sendUpdate(choice: Choice, source: 'banner' | 'browser_signal', signal: PrivacySignal) {
  window.dataLayer = window.dataLayer || []
  // gtag() pushes the arguments object, which is what Consent Mode expects.
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  gtag?.('consent', 'update', { analytics_storage: choice })
  window.dataLayer.push({
    event: 'consent_update',
    analytics_consent: choice,
    consent_source: source,
    privacy_signal: signal ?? 'none',
  })
}

/**
 * Asks before analytics cookies are set, and listens for browser privacy signals.
 * Rules live in src/lib/consent.ts. "Cookie settings" in the footer reopens it.
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(false)
  const [signal, setSignal] = useState<PrivacySignal>(null)
  const applied = useRef<Choice | null>(null)

  useEffect(() => {
    const sig = privacySignal()
    const stored = readConsent()
    setSignal(sig)
    applied.current = effectiveConsent(stored, sig) // what the <head> script already set
    if (!stored && !sig) setOpen(true)

    // Signals can change mid-visit (a privacy extension toggled, a setting changed in
    // another tab, a page restored from the back/forward cache). Re-check when the page
    // becomes visible again and update Google's tags if the answer changed.
    const recheck = () => {
      if (document.visibilityState !== 'visible') return
      const now = privacySignal()
      setSignal(now)
      const next = effectiveConsent(readConsent(), now)
      if (next !== applied.current) {
        applied.current = next
        sendUpdate(next, 'browser_signal', now)
      }
      if (now) setOpen(false)
    }
    const reopen = () => setOpen(true)
    // Choice made in another tab: follow it here too.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CONSENT_KEY) return
      const next = effectiveConsent(readConsent(), privacySignal())
      if (next !== applied.current) {
        applied.current = next
        sendUpdate(next, 'banner', privacySignal())
      }
      setOpen(false)
    }

    document.addEventListener('visibilitychange', recheck)
    window.addEventListener('pageshow', recheck)
    window.addEventListener('focus', recheck)
    window.addEventListener('storage', onStorage)
    window.addEventListener(CONSENT_EVENT, reopen)
    return () => {
      document.removeEventListener('visibilitychange', recheck)
      window.removeEventListener('pageshow', recheck)
      window.removeEventListener('focus', recheck)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(CONSENT_EVENT, reopen)
    }
  }, [])

  if (!open) return null

  const choose = (choice: Choice) => {
    const sig = privacySignal()
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ v: choice, t: Date.now(), sig }))
    } catch {}
    applied.current = choice
    sendUpdate(choice, 'banner', sig)
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
          {signal ? (
            <>
              Your browser is sending a {SIGNAL_NAME[signal]} signal, so analytics cookies are off. You can still
              allow them for this site.{' '}
            </>
          ) : (
            <>We’d like to use analytics cookies to understand which pages are useful. No advertising, no selling data. </>
          )}
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
            {signal ? 'Keep off' : 'No thanks'}
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
