import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import content from '../../seed/content.json' with { type: 'json' }

/**
 * Services reorganized into four practice areas (Nov 2026):
 *   Digital Strategy · Operations & Governance · Marketing Technology · Analytics & Measurement
 *
 * - creates the two new pages and the merged Analytics & Measurement page (content from seed/content.json)
 * - unpublishes the GA4 and Privacy pages it replaces (their URLs redirect in next.config.ts)
 * - On-Demand and For Developers stay published but leave the homepage cards and main menu
 */

const NEW_SLUGS = ['marketing-operations-governance', 'marketing-technology-strategy', 'analytics-measurement']
const RETIRED_SLUGS = ['google-analytics-4-consulting', 'privacy-focused-marketing-analytics']

const hasServicePages = async (db: MigrateUpArgs['db'], payload: MigrateUpArgs['payload']) => {
  const schema = (payload.db as unknown as { schemaName?: string }).schemaName || 'public'
  const result = await db.execute(
    sql`select exists(select 1 from ${sql.identifier(schema)}."service_pages") as present`,
  )
  return Boolean((result as unknown as { rows: { present: boolean }[] }).rows[0]?.present)
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasServicePages(db, payload))) return // fresh database: the seed handles it

  const bySlug = async (slug: string) =>
    (
      await payload.find({
        collection: 'service-pages',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        draft: true,
        req,
      })
    ).docs[0]

  for (const page of content.servicePages) {
    const existing = await bySlug(page.slug)
    if (NEW_SLUGS.includes(page.slug)) {
      if (existing) continue
      await payload.create({
        collection: 'service-pages',
        data: { ...page, outcomes: page.outcomes.map((text) => ({ text })), _status: 'published' } as never,
        overrideAccess: true,
        req,
      })
    } else if (existing) {
      await payload.update({
        collection: 'service-pages',
        id: existing.id,
        data: { order: page.order, featured: page.featured, _status: 'published' } as never,
        overrideAccess: true,
        req,
      })
    }
  }

  for (const slug of RETIRED_SLUGS) {
    const existing = await bySlug(slug)
    if (!existing) continue
    await payload.update({
      collection: 'service-pages',
      id: existing.id,
      data: { featured: false, _status: 'draft' } as never,
      overrideAccess: true,
      req,
    })
  }

  payload.logger.info('[migration] services reorganized into four practice areas')
}

export async function down(_args: MigrateDownArgs): Promise<void> {}
