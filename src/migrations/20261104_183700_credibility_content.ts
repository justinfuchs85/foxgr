import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

/**
 * Credibility pass on the homepage (Nov 2026):
 * - "Who we are" names the person behind the practice and swaps soft stats for real ones
 * - Aptiv becomes the lead case study
 * - a "How engagements start" section goes in before the CTA
 * - "For Developers" drops off the homepage cards (its page and nav link stay)
 *
 * Copy is only replaced where it still matches what an earlier migration wrote,
 * so edits made in the CMS are left alone. Safe to run on an empty database.
 */

type Row = Record<string, unknown>

// Payload writes fresh rows for blocks and array items when their ids are dropped.
const stripIds = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stripIds)
  if (value && typeof value === 'object') {
    const out: Row = {}
    for (const [key, v] of Object.entries(value as Row)) if (key !== 'id') out[key] = stripIds(v)
    return out
  }
  return value
}

const OLD_ABOUT_BODY =
  'Fox Consulting Group is a senior-led practice. You work directly with the people doing the work: no hand-offs, no junior bench, and nothing pulled off a shelf.'

export const ABOUT_BODY = `Fox Consulting Group is led by Justin Fuchs, who has spent nearly 20 years on the infrastructure side of marketing: strategy, analytics, platforms and the operating models that hold them together. Since 2016 the practice has delivered 30+ engagements for organizations including Aptiv, Altair, Corewell Health, Gordon Food Service and Allstate Identity Protection, and most clients have stayed five years or more.

Most recently, Justin built a hub-and-spoke analytics function across 13 business units at a public manufacturer, taking reporting from months to days. He’s as comfortable presenting a roadmap to a segment president as he is debugging the tag manager himself. You work with him directly, with a small bench of trusted specialists when the work calls for it.`

export const ABOUT_STATS = [
  { value: '30+', label: 'engagements delivered' },
  { value: '80%', label: 'of work from repeat clients and referrals' },
  { value: '7', label: 'years with our longest client' },
]

const OLD_STAT_LABELS = ['years advising digital teams', 'senior consultant access', 'off-the-shelf playbooks']

export const ENGAGEMENTS_BLOCK = {
  blockType: 'engagements',
  label: 'Working together',
  heading: 'Most engagements start with a diagnostic.',
  body: 'A defined scope and a fixed fee, agreed up front, so it can be approved without a long procurement cycle. From there, most clients keep us on as an advisor.',
  offers: [
    {
      name: 'Operating model diagnostic',
      duration: '4–6 weeks',
      pricing: 'Fixed fee',
      description:
        'A measurement and operating-model assessment for one business unit or your central team. You leave with a governance model, a KPI dictionary and a sequenced roadmap your team can own.',
      linkLabel: 'Start a conversation',
      linkHref: '/#contact',
      highlight: true,
    },
    {
      name: 'Advisory retainer',
      duration: '6-month terms',
      pricing: 'Monthly, capped hours',
      description:
        'A senior partner in your steering meetings: reviewing what your team and agencies build, and holding the standards line across business units.',
      highlight: false,
    },
    {
      name: 'Focused session',
      duration: 'One decision',
      pricing: 'Per session',
      description:
        'Pressure-test a plan, a platform choice or a measurement question before you commit to it.',
      linkLabel: 'How sessions work',
      linkHref: '/what-we-do/on-demand-digital-consulting',
      highlight: false,
    },
  ],
  spacing: 'standard',
}

export const APTIV_CASE_STUDY = {
  title: 'Seven years as a global digital strategy partner',
  client: 'Aptiv',
  category: 'Digital strategy and MarTech',
  result:
    'Served as Aptiv’s digital strategy, analytics and MarTech partner across its global web properties for seven years, including content and channel strategy for two spinoffs and multiple acquisitions.',
  metric: { value: '7', label: 'years as anchor partner' },
  order: 0,
}


// Checked with plain SQL so a fresh database (no homepage yet) never reaches
// the ORM, whose queries assume the newest schema.
const hasHomepageContent = async (db: MigrateUpArgs['db'], payload: MigrateUpArgs['payload']) => {
  const schema = (payload.db as unknown as { schemaName?: string }).schemaName || 'public'
  const result = await db.execute(
    sql`select exists(select 1 from ${sql.identifier(schema)}."homepage_blocks_cta") as present`,
  )
  return Boolean((result as unknown as { rows: { present: boolean }[] }).rows[0]?.present)
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasHomepageContent(db, payload))) return
  const homepage = await payload.findGlobal({ slug: 'homepage', depth: 0, overrideAccess: true, req })
  const sections = (homepage.sections ?? []) as unknown as Row[]
  if (!sections.length) return // fresh database: the seed handles it

  // 1. Lead case study
  const existing = await payload.find({
    collection: 'case-studies',
    where: { client: { equals: 'Aptiv' } },
    limit: 1,
    overrideAccess: true,
    req,
  })
  if (!existing.docs.length) {
    await payload.create({ collection: 'case-studies', data: APTIV_CASE_STUDY, overrideAccess: true, req })
  }

  // 2. "For Developers" off the homepage cards
  const dev = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'content-strategy-partnership' } },
    limit: 1,
    overrideAccess: true,
    req,
  })
  if (dev.docs[0]) {
    await payload.update({
      collection: 'service-pages',
      id: dev.docs[0].id,
      data: { featured: false, _status: 'published' },
      overrideAccess: true,
      req,
    })
  }

  // 3. Who we are + 4. How engagements start
  const next: Row[] = []
  for (const section of sections) {
    if (section.blockType === 'about') {
      const stats = (section.stats as { label: string }[] | undefined) ?? []
      const statsUntouched = stats.every((s) => OLD_STAT_LABELS.includes(s.label))
      next.push({
        ...section,
        body: section.body === OLD_ABOUT_BODY ? ABOUT_BODY : section.body,
        personName: section.personName ?? 'Justin Fuchs',
        personTitle: section.personTitle ?? 'Founder',
        stats: statsUntouched ? ABOUT_STATS : stats,
      })
      continue
    }
    if (section.blockType === 'cta' && !sections.some((s) => s.blockType === 'engagements')) {
      next.push(ENGAGEMENTS_BLOCK)
    }
    next.push(section)
  }

  await payload.updateGlobal({
    slug: 'homepage',
    data: { sections: stripIds(next) as never },
    overrideAccess: true,
    req,
  })
  payload.logger.info('[migration] credibility content applied')
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Content changes aren't reversed; restore an earlier homepage version from the CMS instead.
}
