'use client'

import { usePathname } from 'next/navigation'
import { useId, useRef, useState } from 'react'
import { Arrow } from './ui'
import { INQUIRY_LIMITS, OTHER_TOPIC } from '@/lib/inquiry'
import { SITE } from '@/lib/site'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const field =
  'w-full border border-white/25 bg-white/[0.06] px-4 py-3 text-base text-white placeholder:text-white/40 transition outline-none focus:border-[#ff7657] focus:bg-white/[0.1] focus-visible:ring-2 focus-visible:ring-[#ff7657]/40'
const label = 'mb-2 block text-sm font-bold text-white/85'

/**
 * Short inquiry form for the dark contact sections. Posts to /next/inquiry, shows the
 * result inline, and pushes `generate_lead` to the dataLayer on success.
 */
export function ContactForm({
  topics,
  defaultTopic,
  submitLabel = 'Send message',
}: {
  topics: string[]
  defaultTopic?: string
  submitLabel?: string
}) {
  const id = useId()
  const pathname = usePathname()
  const startedAt = useRef(Date.now())
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const options = [...new Set([...topics, OTHER_TOPIC])]

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>
    setStatus('sending')
    setErrors({})
    try {
      const res = await fetch('/next/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, page: pathname, startedAt: startedAt.current }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
        errors?: Record<string, string>
      }
      if (res.ok && data.ok) {
        setStatus('sent')
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: 'generate_lead',
          inquiry_topic: values.topic,
          cta_location: form.closest('section[id]')?.id || 'contact',
          page_type: pathname === '/' ? 'home' : pathname.startsWith('/what-we-do/') ? 'service' : 'other',
        })
        return
      }
      setErrors(data.errors ?? {})
      setMessage(data.error ?? (data.errors ? 'Please check the highlighted fields.' : 'Something went wrong.'))
      setStatus('error')
    } catch {
      setMessage(`Couldn't send just now. Please email ${SITE.email}.`)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div aria-live="polite" className="border border-white/20 bg-white/[0.06] p-8 md:p-10" role="status">
        <p className="font-serif text-4xl leading-tight">Thanks. Your message is in.</p>
        <p className="mt-4 text-lg leading-[1.6] text-white/75">
          We’ll read it and get back to you soon. If it’s urgent, email{' '}
          <a className="underline underline-offset-4 hover:text-[#ff8b70]" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
          .
        </p>
      </div>
    )
  }

  const err = (name: string) =>
    errors[name] ? (
      <p className="mt-2 text-sm font-bold text-[#ff8b70]" id={`${id}-${name}-error`}>
        {errors[name]}
      </p>
    ) : null
  const a11y = (name: string) =>
    errors[name] ? { 'aria-invalid': true, 'aria-describedby': `${id}-${name}-error` } : {}

  return (
    <form className="grid gap-5" noValidate onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor={`${id}-name`}>
            Name
          </label>
          <input autoComplete="name" className={field} id={`${id}-name`} maxLength={INQUIRY_LIMITS.name} name="name" required {...a11y('name')} />
          {err('name')}
        </div>
        <div>
          <label className={label} htmlFor={`${id}-email`}>
            Work email
          </label>
          <input autoComplete="email" className={field} id={`${id}-email`} inputMode="email" maxLength={INQUIRY_LIMITS.email} name="email" required type="email" {...a11y('email')} />
          {err('email')}
        </div>
        <div>
          <label className={label} htmlFor={`${id}-company`}>
            Company <span className="font-normal text-white/50">(optional)</span>
          </label>
          <input autoComplete="organization" className={field} id={`${id}-company`} maxLength={INQUIRY_LIMITS.company} name="company" />
        </div>
        <div>
          <label className={label} htmlFor={`${id}-role`}>
            Role <span className="font-normal text-white/50">(optional)</span>
          </label>
          <input autoComplete="organization-title" className={field} id={`${id}-role`} maxLength={INQUIRY_LIMITS.role} name="role" />
        </div>
      </div>
      <div>
        <label className={label} htmlFor={`${id}-topic`}>
          What can we help with?
        </label>
        <select className={`${field} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23ff7657%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_1rem_center] bg-no-repeat pr-12`} defaultValue={defaultTopic && options.includes(defaultTopic) ? defaultTopic : options[0]} id={`${id}-topic`} name="topic">
          {options.map((t) => (
            <option className="bg-[#0a2939] text-white" key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label} htmlFor={`${id}-message`}>
          What’s getting in the way?
        </label>
        <textarea className={`${field} min-h-36 resize-y`} id={`${id}-message`} maxLength={INQUIRY_LIMITS.message} name="message" placeholder="A few sentences on the team, the problem and the timing." required rows={5} {...a11y('message')} />
        {err('message')}
      </div>
      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input autoComplete="off" id={`${id}-website`} name="website" tabIndex={-1} />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-1">
        <button
          className="group inline-flex min-h-11 items-center gap-4 bg-white px-7 py-4 text-[17px] font-bold text-[#0a2939] transition hover:bg-[#ff7657] disabled:cursor-wait disabled:opacity-70"
          disabled={status === 'sending'}
          type="submit"
        >
          {status === 'sending' ? 'Sending…' : submitLabel}
          <Arrow className="size-5 transition group-hover:translate-x-1" />
        </button>
        <p className="text-sm text-white/60">
          Or email{' '}
          <a className="underline underline-offset-4 hover:text-white" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </p>
      </div>
      <p aria-live="polite" className="min-h-6 text-sm font-bold text-[#ff8b70]" role="status">
        {status === 'error' ? message : ''}
      </p>
      <p className="text-xs leading-[1.5] text-white/50">
        We use what you send only to reply to you. See the{' '}
        <a className="underline underline-offset-2 hover:text-white" href="/privacy">
          privacy policy
        </a>
        .
      </p>
    </form>
  )
}
