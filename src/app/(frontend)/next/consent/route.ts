import { getConsentSettings } from '@/lib/consent-settings'
import { getPayloadClient } from '@/lib/payload'

/**
 * Logs a consent choice to Consent Records. Anonymous by design: a random browser ID,
 * the choice, the signal, the policy version, the page, and the browser family.
 * Never stores IP addresses or full user-agent strings.
 */

const recent = new Map<string, number[]>()
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 30

const CHOICES = new Set(['granted', 'denied'])
const SIGNALS = new Set(['none', 'gpc', 'dnt'])
const SOURCES = new Set(['banner', 'browser_signal'])

function browserFamily(ua: string) {
  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /OPR\//.test(ua)
      ? 'Opera'
      : /Firefox\//.test(ua)
        ? 'Firefox'
        : /Chrome\//.test(ua)
          ? 'Chrome'
          : /Safari\//.test(ua)
            ? 'Safari'
            : 'Other'
  const os = /iPhone|iPad/.test(ua)
    ? 'iOS'
    : /Android/.test(ua)
      ? 'Android'
      : /Mac OS X/.test(ua)
        ? 'macOS'
        : /Windows/.test(ua)
          ? 'Windows'
          : /Linux/.test(ua)
            ? 'Linux'
            : 'Other'
  return `${browser} on ${os}`
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== new URL(request.url).host) return new Response(null, { status: 403 })

  const { config } = await getConsentSettings()
  if (!config.log) return new Response(null, { status: 204 })

  let b: Record<string, unknown>
  try {
    b = JSON.parse(await request.text())
  } catch {
    return new Response(null, { status: 400 })
  }

  const id = typeof b.id === 'string' ? b.id.slice(0, 64) : ''
  const analytics = String(b.analytics)
  const marketing = b.marketing === 'n/a' ? 'n/a' : String(b.marketing)
  const source = String(b.source)
  const signal = String(b.signal ?? 'none')
  if (!id || !CHOICES.has(analytics) || !(marketing === 'n/a' || CHOICES.has(marketing)) || !SOURCES.has(source) || !SIGNALS.has(signal)) {
    return new Response(null, { status: 400 })
  }

  // Rate limit per browser ID and per network, best effort.
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
  const now = Date.now()
  for (const key of [`id:${id}`, `ip:${ip}`]) {
    const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
    if (hits.length >= MAX_PER_WINDOW) return new Response(null, { status: 429 })
    hits.push(now)
    recent.set(key, hits)
  }

  const payload = await getPayloadClient()
  await payload.create({
    collection: 'consent-records',
    data: {
      consentId: id,
      analytics: analytics as 'granted' | 'denied',
      marketing: marketing as 'granted' | 'denied' | 'n/a',
      source: source as 'banner' | 'browser_signal',
      signal: signal as 'none' | 'gpc' | 'dnt',
      mode: config.mode,
      policyVersion: config.version,
      page: typeof b.page === 'string' ? b.page.slice(0, 300) : undefined,
      browser: browserFamily(request.headers.get('user-agent') ?? ''),
    },
    overrideAccess: true,
  })
  return new Response(null, { status: 204 })
}
