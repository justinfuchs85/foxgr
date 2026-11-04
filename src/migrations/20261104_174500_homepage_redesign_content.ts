import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

/**
 * One-time content move for the November 2026 homepage redesign.
 *
 * Reorders the homepage into: hero → problem → services → work → testimonial
 * → how we work → who we are → CTA. Drops the image break and insights
 * sections, moves the stats from the hero into "Who we are", and updates a
 * few lines of copy, but only where they still read exactly as originally
 * seeded, so any edit made in the CMS wins.
 *
 * A database that has no homepage yet (fresh install) is left for the seed.
 */

type Section = Record<string, unknown> & { blockType: string; id?: string | null }

const swap = (current: unknown, original: string, next: string | null) =>
  current === original ? next : current


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
  const sections = (homepage.sections ?? []) as unknown as Section[]
  if (!sections.length) return
  if (sections.some((s) => s.blockType === 'approach' || s.blockType === 'about')) return

  const find = (type: string) => sections.find((s) => s.blockType === type)
  const hero = find('hero')
  const intro = find('intro')
  const services = find('services')
  const caseStudies = find('caseStudies')
  const testimonial = find('testimonial')
  const cta = find('cta')

  const heroStats = ((hero?.stats as { value: string; label: string }[] | undefined) ?? [])
    .filter((stat) => stat.label !== 'connected operating layers')
    .map(({ value, label }) => ({ value, label }))

  const next: Section[] = []

  if (hero) {
    next.push({
      ...hero,
      eyebrow: swap(hero.eyebrow, 'Field note 01 / Marketing infrastructure', null),
      body: swap(
        hero.body,
        'Marketing leaders no longer have to go it alone. We help managers, directors, and C-level leaders build resilient foundations for team structure, governance, workflow, technology management, and strategy development.',
        'Marketing leaders no longer have to go it alone. We help managers, directors, and C-level leaders build resilient foundations for team structure, governance, workflow, technology, and strategy.',
      ),
      buttonLabel: swap(hero.buttonLabel, 'Review the operating system', 'See what we do'),
      stats: [],
    })
  }

  if (intro) {
    const columns = ((intro.columns as { body: string }[] | undefined) ?? []).map(({ body }) => ({
      body: swap(
        body,
        'We shore up wasted effort, ineffective workflows, disconnected teams, and the general ‘muck’ in the marketing gears—then help leaders put a better operating model in place.',
        'We clear out the wasted effort, the ineffective workflows, the disconnected teams and the general muck in the marketing gears, then help leaders put a better operating model in place.',
      ) as string,
    }))
    next.push({
      ...intro,
      label: swap(intro.label, 'Field note 02 / Start below the surface', 'The problem'),
      columns,
    })
  }

  if (services) {
    next.push({
      ...services,
      label: swap(services.label, 'Field note 03 / The operating system', 'What we do'),
      heading: swap(
        services.heading,
        'We work across the infrastructure behind marketing output.',
        'We work on the infrastructure behind marketing output.',
      ),
    })
  }

  if (caseStudies) {
    next.push({
      ...caseStudies,
      label: swap(caseStudies.label, 'Field note 04 / Evidence from the work', 'Selected work'),
      heading: swap(
        caseStudies.heading,
        'Selected consulting engagements',
        'The deliverable is a working system, not a slide.',
      ),
      body: swap(
        caseStudies.body,
        'The deliverable is never just a recommendation. It is a working system—a measurement plan, decision framework, dashboard, roadmap, or playbook a team can keep using.',
        null,
      ),
    })
  }

  if (testimonial) next.push({ ...testimonial })

  next.push({
    blockType: 'approach',
    label: 'How we work',
    heading: 'From diagnosis to a roadmap your team owns.',
    body: 'Collaborative, evidence-led, and designed to leave your team more capable, not dependent on a consultant.',
    steps: [
      {
        title: 'Discover',
        body: 'Align on business priorities, stakeholder expectations, audiences, and the realities of the current program.',
      },
      {
        title: 'Assess',
        body: 'Audit activity, workflows, technology, and measurement to locate friction and opportunity.',
      },
      {
        title: 'Design',
        body: 'Translate findings into a connected strategy, operating principles, and sequenced recommendations.',
      },
      {
        title: 'Activate',
        body: 'Support rollout, decisions, and adoption so the roadmap becomes a working system.',
      },
    ],
    spacing: 'standard',
  })

  next.push({
    blockType: 'about',
    label: 'Who we are',
    heading: (intro?.characterCaption as string | undefined) ?? 'Look for the system behind the symptom.',
    body: 'Fox Consulting Group is a senior-led practice. You work directly with the people doing the work: no hand-offs, no junior bench, and nothing pulled off a shelf.',
    image: intro?.characterImage ?? null,
    stats: heroStats,
    spacing: 'standard',
  })

  if (cta) {
    next.push({
      ...cta,
      body: swap(
        cta.body,
        'Tell us where the team, process, technology, or measurement system is getting in the way. We’ll help you identify the next useful move.',
        'Tell us where the team, process, technology, or measurement is getting in the way. We’ll help you find the next useful move.',
      ),
    })
  }

  // Block ids from the old rows are dropped so Payload writes fresh rows.
  const clean = next.map(({ id: _id, ...rest }) => {
    for (const key of ['stats', 'columns', 'steps'] as const) {
      const list = rest[key]
      if (Array.isArray(list)) rest[key] = list.map(({ id: _rowId, ...row }) => row)
    }
    return rest
  })

  await payload.updateGlobal({
    slug: 'homepage',
    data: { sections: clean as never },
    overrideAccess: true,
    req,
  })
  payload.logger.info(`[migration] homepage reshaped into ${clean.length} sections`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Content moves aren't reversed; restore an earlier homepage version from the CMS's version history instead.
}
