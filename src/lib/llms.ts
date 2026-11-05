import type { Homepage, ServicePage } from '@/payload-types'
import { getHomepageContent } from '@/lib/homepage-content'
import { getPublishedServicePages } from '@/lib/service-pages'
import { SITE, absoluteUrl } from '@/lib/site'

/**
 * llms.txt (https://llmstxt.org): a plain-markdown briefing for AI assistants, built from
 * the CMS so it always matches the site. /llms.txt is the summary with links;
 * /llms-full.txt adds the full copy of every service page.
 */

type Block = Homepage['sections'][number]
const find = <T extends Block['blockType']>(h: Homepage, type: T) =>
  h.sections?.find((s) => s.blockType === type) as Extract<Block, { blockType: T }> | undefined

const clean = (s?: string | null) => (s ?? '').replace(/[ \t]+\n/g, '\n').trim()

function servicePageMarkdown(p: ServicePage) {
  const out = [`## ${p.title}`, '', `URL: ${absoluteUrl(`/what-we-do/${p.slug}`)}`, '', clean(p.heroSummary)]
  if (p.problem?.heading) out.push('', `### ${p.problem.heading}`, '', clean(p.problem.body))
  if (p.capabilities?.length) {
    out.push('', '### Capabilities', '')
    for (const c of p.capabilities) out.push(`- **${c.title}:** ${clean(c.body)}`)
  }
  if (p.approach?.heading) {
    out.push('', `### ${p.approach.heading}`, '')
    if (p.approach.body) out.push(clean(p.approach.body), '')
    p.approach.steps?.forEach((s, i) => out.push(`${i + 1}. **${s.title}:** ${clean(s.body)}`))
  }
  if (p.outcomes?.length) {
    out.push('', '### What clients are left with', '')
    for (const o of p.outcomes) out.push(`- ${o.text}`)
  }
  if (p.faqs?.length) {
    out.push('', '### Frequently asked questions', '')
    for (const f of p.faqs) out.push(`**${f.question}**`, clean(f.answer), '')
  }
  return out.join('\n')
}

export async function buildLlmsTxt({ full }: { full: boolean }) {
  const [{ homepage }, pages] = await Promise.all([getHomepageContent(), getPublishedServicePages()])
  const hero = find(homepage, 'hero')
  const intro = find(homepage, 'intro')
  const about = find(homepage, 'about')
  const approach = find(homepage, 'approach')
  const engagements = find(homepage, 'engagements')
  const faq = find(homepage, 'faq')
  const core = pages.filter((p) => p.featured !== false)
  const other = pages.filter((p) => p.featured === false)
  const link = (p: ServicePage) =>
    `- [${p.title}](${absoluteUrl(`/what-we-do/${p.slug}`)}): ${clean(p.meta?.description || p.heroSummary)}`

  const out: string[] = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    clean(hero?.body),
    '',
    '## Key facts',
    '',
    `- Website: ${absoluteUrl('/')}`,
    `- Contact: ${SITE.email}`,
    `- Based in: ${SITE.locality}, ${SITE.region}, USA; works with clients across the United States`,
    `- Founded: ${SITE.foundingYear}, led by ${about?.personName || SITE.founder.name} (${about?.personTitle || SITE.founder.jobTitle})`,
    '- Works with: marketing managers, directors and C-level leaders, including multi-brand and multi-business-unit organizations',
    ...(about?.stats ?? []).map((s) => `- ${s.value} ${s.label}`),
    '',
  ]

  if (intro?.columns?.length) {
    out.push(`## ${intro.heading}`, '', ...intro.columns.map((c) => clean(c.body)).flatMap((b) => [b, '']))
  }

  out.push('## Services', '', ...core.map(link), '')
  if (other.length) out.push('## Other ways to work together', '', ...other.map(link), '')

  if (engagements?.offers?.length) {
    out.push(`## Engagement models and pricing`, '')
    if (engagements.body) out.push(clean(engagements.body), '')
    for (const o of engagements.offers) {
      const terms = [o.duration, o.pricing].filter(Boolean).join(', ')
      out.push(`- **${o.name}**${terms ? ` (${terms})` : ''}: ${clean(o.description)}`)
    }
    out.push('')
  }

  if (approach?.steps?.length) {
    out.push(`## How we work`, '')
    if (approach.body) out.push(clean(approach.body), '')
    approach.steps.forEach((s, i) => out.push(`${i + 1}. **${s.title}:** ${clean(s.body)}`))
    out.push('')
  }

  if (about?.body) out.push('## About', '', clean(about.body), '')

  if (faq?.faqs?.length) {
    out.push('## Frequently asked questions', '')
    for (const f of faq.faqs) out.push(`**${f.question}**`, clean(f.answer), '')
  }

  out.push(
    '## Contact',
    '',
    `Email ${SITE.email} to start a conversation. Most engagements begin with a fixed-fee diagnostic.`,
    '',
  )

  if (full) {
    out.push('---', '', '# Service details', '', ...pages.flatMap((p) => [servicePageMarkdown(p), '']))
  } else {
    out.push('## Optional', '', `- [Full service details](${absoluteUrl('/llms-full.txt')}): complete copy of every service page`, '')
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n')
}

export const textResponse = (body: string) =>
  new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
