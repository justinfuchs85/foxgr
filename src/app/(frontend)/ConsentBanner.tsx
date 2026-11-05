'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import {
  CONSENT_EVENT,
  CONSENT_ID_KEY,
  CONSENT_KEY,
  consentSignals,
  decide,
  readSignal,
  type Choice,
  type ConsentConfig,
  type ConsentCopy,
  type PrivacySignal,
} from '@/lib/consent'

const SIGNAL_NAME: Record<Exclude<PrivacySignal, null>, string> = {
  gpc: 'Global Privacy Control',
  dnt: 'Do Not Track',
}

type State = { analytics: Choice; marketing: Choice }
type Source = 'banner' | 'browser_signal'

function consentId() {
  try {
    let id = localStorage.getItem(CONSENT_ID_KEY)
    if (!id) {
      id = crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
      localStorage.setItem(CONSENT_ID_KEY, id)
    }
    return id
  } catch {
    return 'unavailable'
  }
}

function sendUpdate(next: State, source: Source, signal: PrivacySignal) {
  window.dataLayer = window.dataLayer || []
  // gtag() pushes the arguments object, which is what Consent Mode expects.
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  gtag?.('consent', 'update', consentSignals(next.analytics, next.marketing))
  window.dataLayer.push({
    event: 'consent_update',
    analytics_consent: next.analytics,
    marketing_consent: next.marketing,
    consent_source: source,
    privacy_signal: signal ?? 'none',
  })
}

function logChoice(config: ConsentConfig, next: State, source: Source, signal: PrivacySignal, page: string) {
  if (!config.log) return
  const body = JSON.stringify({
    id: consentId(),
    analytics: next.analytics,
    marketing: config.marketing ? next.marketing : 'n/a',
    source,
    signal: signal ?? 'none',
    page,
  })
  try {
    if (!navigator.sendBeacon?.('/next/consent', new Blob([body], { type: 'application/json' }))) {
      void fetch('/next/consent', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } })
    }
  } catch {}
}

/**
 * Cookie banner driven by Privacy → Consent Settings in the CMS. Listens for browser
 * privacy signals, follows choices made in other tabs, and logs choices to Consent Records.
 * Rules live in src/lib/consent.ts. "Cookie settings" in the footer reopens it.
 */
export function ConsentBanner({ config, copy }: { config: ConsentConfig; copy: ConsentCopy }) {
  const id = useId()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [signal, setSignal] = useState<PrivacySignal>(null)
  const [draft, setDraft] = useState<State>({ analytics: 'denied', marketing: 'denied' })
  const applied = useRef<State | null>(null)
  const pageRef = useRef(pathname)
  pageRef.current = pathname

  useEffect(() => {
    const first = decide(config)
    setSignal(first.signal)
    applied.current = { analytics: first.analytics, marketing: first.marketing } // set by the <head> script
    setDraft(applied.current)
    if (first.askNeeded) setOpen(true)

    const sync = (source: Source) => {
      const d = decide(config)
      setSignal(d.signal)
      const next = { analytics: d.analytics, marketing: d.marketing }
      const prev = applied.current
      if (!prev || prev.analytics !== next.analytics || prev.marketing !== next.marketing) {
        applied.current = next
        sendUpdate(next, source, d.signal)
        if (source === 'browser_signal') logChoice(config, next, source, d.signal, pageRef.current)
      }
      return d
    }

    // Signals can change mid-visit (an extension toggled, a setting changed, a page
    // restored from the back/forward cache): re-check whenever the page is visible again.
    const recheck = () => {
      if (document.visibilityState !== 'visible') return
      const d = sync('browser_signal')
      if (d.signal) setOpen(false)
    }
    // A choice made in another tab applies here too.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CONSENT_KEY) return
      sync('banner')
      setOpen(false)
    }
    const reopen = () => {
      setDraft(applied.current ?? { analytics: 'denied', marketing: 'denied' })
      setCustomizing(config.marketing)
      setOpen(true)
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
  }, [config])

  if (!open) return null

  const save = (next: State) => {
    const sig = readSignal(config)
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ v: next.analytics, m: next.marketing, t: Date.now(), sig, ver: config.version }),
      )
    } catch {}
    applied.current = next
    sendUpdate(next, 'banner', sig)
    logChoice(config, next, 'banner', sig, pathname)
    setOpen(false)
    setCustomizing(false)
  }

  const all: State = { analytics: 'granted', marketing: config.marketing ? 'granted' : 'denied' }
  const none: State = { analytics: 'denied', marketing: 'denied' }
  const btn = 'min-h-11 px-5 text-sm font-bold transition'
  const secondary = `${btn} border border-[#0a2939]/25 hover:border-[#0a2939]`
  const primary = `${btn} bg-[#0a2939] text-white hover:bg-[#ff7657] hover:text-[#0a2939]`

  const toggle = (key: keyof State, label: string, description: string) => (
    <label className="flex cursor-pointer items-start gap-4 border-t border-[#0a2939]/10 py-4" htmlFor={`${id}-${key}`}>
      <input
        checked={draft[key] === 'granted'}
        className="mt-1 size-5 shrink-0 accent-[#0a2939]"
        id={`${id}-${key}`}
        onChange={(e) => setDraft({ ...draft, [key]: e.target.checked ? 'granted' : 'denied' })}
        type="checkbox"
      />
      <span>
        <span className="block font-bold">{label}</span>
        <span className="block text-sm leading-[1.5] text-[#49636e]">{description}</span>
      </span>
    </label>
  )

  return (
    <div
      aria-label="Cookie preferences"
      aria-live="polite"
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-[760px] border border-[#0a2939]/15 bg-white p-5 text-[#0a2939] shadow-[0_24px_60px_-20px_rgba(10,41,57,0.45)] sm:inset-x-6 sm:bottom-6 md:p-6"
      role="region"
    >
      <div className={customizing ? 'grid gap-4' : 'flex flex-col gap-4 md:flex-row md:items-center md:gap-8'}>
        <p className="text-[15px] leading-[1.55] text-[#31505e]">
          {signal ? copy.signalMessage.replace('{signal}', SIGNAL_NAME[signal]) : copy.message}{' '}
          <a className="font-bold text-[#b74730] underline underline-offset-4" href="/privacy#cookies">
            {copy.policyLinkLabel}
          </a>
        </p>

        {customizing && (
          <div className="border-b border-[#0a2939]/10">
            <div className="flex items-start gap-4 border-t border-[#0a2939]/10 py-4">
              <input checked className="mt-1 size-5 shrink-0 accent-[#0a2939]" disabled readOnly type="checkbox" />
              <span>
                <span className="block font-bold">Necessary</span>
                <span className="block text-sm leading-[1.5] text-[#49636e]">Keeps the site working and remembers this choice. Always on.</span>
              </span>
            </div>
            {toggle('analytics', 'Analytics', copy.analyticsDescription)}
            {config.marketing && toggle('marketing', 'Marketing', copy.marketingDescription)}
          </div>
        )}

        <div className="flex shrink-0 flex-wrap gap-3">
          {customizing ? (
            <>
              <button className={secondary} onClick={() => save(none)} type="button">
                {copy.declineLabel}
              </button>
              <button className={primary} onClick={() => save(draft)} type="button">
                Save choices
              </button>
            </>
          ) : (
            <>
              <button className={secondary} onClick={() => save(none)} type="button">
                {copy.declineLabel}
              </button>
              {config.marketing && (
                <button className={secondary} onClick={() => setCustomizing(true)} type="button">
                  {copy.customizeLabel}
                </button>
              )}
              <button className={primary} onClick={() => save(all)} type="button">
                {config.marketing ? 'Allow all' : copy.acceptLabel}
              </button>
            </>
          )}
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
