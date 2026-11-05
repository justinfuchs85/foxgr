/** Shared between the contact form and its endpoint. */
export const INQUIRY_LIMITS = { name: 120, email: 200, company: 160, role: 120, topic: 120, message: 4000 } as const
export const MIN_FILL_MS = 2500 // faster than this is a bot
export const OTHER_TOPIC = 'Something else'

export type InquiryInput = {
  name: string
  email: string
  company?: string
  role?: string
  topic?: string
  message: string
  page?: string
  website?: string // honeypot: real visitors never see or fill it
  startedAt?: number
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
