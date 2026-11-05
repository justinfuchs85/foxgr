import { getPayloadClient } from '@/lib/payload'
import { EMAIL_RE, INQUIRY_LIMITS, MIN_FILL_MS, type InquiryInput } from '@/lib/inquiry'
import { SITE } from '@/lib/site'

/**
 * Contact form endpoint. Validates, filters obvious bots, saves the inquiry in the CMS,
 * then emails an alert through Resend when RESEND_API_KEY and INQUIRY_NOTIFY_TO are set.
 */

const recent = new Map<string, number[]>() // best-effort per-instance rate limit
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(request: Request) {
  // Same-site posts only.
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ ok: false, error: 'Invalid origin.' }, 403)
  }

  let body: InquiryInput
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400)
  }

  // Bots: honeypot filled or form "completed" impossibly fast. Pretend success.
  const tooFast = typeof body.startedAt === 'number' && Date.now() - body.startedAt < MIN_FILL_MS
  if (str(body.website, 200) || tooFast) return json({ ok: true })

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
  const now = Date.now()
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (hits.length >= MAX_PER_WINDOW) {
    return json({ ok: false, error: `Too many messages. Please email ${SITE.email} instead.` }, 429)
  }

  const data = {
    name: str(body.name, INQUIRY_LIMITS.name),
    email: str(body.email, INQUIRY_LIMITS.email),
    company: str(body.company, INQUIRY_LIMITS.company),
    role: str(body.role, INQUIRY_LIMITS.role),
    topic: str(body.topic, INQUIRY_LIMITS.topic),
    message: str(body.message, INQUIRY_LIMITS.message),
    page: str(body.page, 300),
  }
  const errors: Record<string, string> = {}
  if (!data.name) errors.name = 'Please add your name.'
  if (!EMAIL_RE.test(data.email)) errors.email = 'Please add a valid email address.'
  if (data.message.length < 10) errors.message = 'A sentence or two helps us prepare.'
  if (Object.keys(errors).length) return json({ ok: false, errors }, 422)

  hits.push(now)
  recent.set(ip, hits)

  const payload = await getPayloadClient()
  const doc = await payload.create({
    collection: 'inquiries',
    data: { ...data, status: 'new' },
    overrideAccess: true,
  })

  const notified = await notify(data).catch((err) => {
    payload.logger.error({ err }, '[inquiry] email alert failed')
    return false
  })
  if (notified) {
    await payload.update({ collection: 'inquiries', id: doc.id, data: { notified: true }, overrideAccess: true })
  }

  return json({ ok: true })
}

async function notify(d: Record<string, string>) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.INQUIRY_NOTIFY_TO
  if (!key || !to) return false
  const from = process.env.INQUIRY_FROM || `${SITE.name} <website@foxgr.com>`
  const field = (label: string, value?: string) => (value ? [`${label}: ${value}`] : [])
  const lines = [
    ...field('Name', d.name),
    ...field('Email', d.email),
    ...field('Company', d.company),
    ...field('Role', d.role),
    ...field('Topic', d.topic),
    ...field('Sent from', d.page && `${SITE.url}${d.page}`),
    '',
    d.message,
    '',
    `All inquiries: ${SITE.url}/admin/collections/inquiries`,
  ]
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: to.split(',').map((s) => s.trim()),
      reply_to: d.email,
      subject: `New inquiry: ${d.name}${d.company ? `, ${d.company}` : ''}${d.topic ? ` (${d.topic})` : ''}`,
      text: lines.join('\n'),
    }),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
  return true
}
