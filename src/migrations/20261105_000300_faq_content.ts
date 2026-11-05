import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import content from '../../seed/content.json' with { type: 'json' }

/**
 * Adds the starter FAQs: four per service page and a general FAQ section on the homepage,
 * placed just before the closing call to action. Pages that already have FAQs, and a
 * homepage that already has an FAQ section, are left alone. Fresh databases get these
 * from the seed instead.
 */

type Row = Record<string, unknown>

const stripIds = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stripIds)
  if (value && typeof value === 'object') {
    const out: Row = {}
    for (const [key, v] of Object.entries(value as Row)) if (key !== 'id') out[key] = stripIds(v)
    return out
  }
  return value
}

const hasServicePages = async (db: MigrateUpArgs['db'], payload: MigrateUpArgs['payload']) => {
  const schema = (payload.db as unknown as { schemaName?: string }).schemaName || 'public'
  const result = await db.execute(sql`select exists(select 1 from ${sql.identifier(schema)}."service_pages") as present`)
  return Boolean((result as unknown as { rows: { present: boolean }[] }).rows[0]?.present)
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasServicePages(db, payload))) return

  for (const page of content.servicePages) {
    const existing = (
      await payload.find({
        collection: 'service-pages',
        where: { slug: { equals: page.slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        req,
      })
    ).docs[0]
    if (!existing || existing._status !== 'published' || existing.faqs?.length) continue
    await payload.update({
      collection: 'service-pages',
      id: existing.id,
      data: { faqs: page.faqs, _status: 'published' } as never,
      overrideAccess: true,
      req,
    })
  }

  const homepage = await payload.findGlobal({ slug: 'homepage', depth: 0, overrideAccess: true, req })
  const sections = (homepage.sections ?? []) as unknown as Row[]
  const faq = content.homepage.sections.find((s) => s.blockType === 'faq')
  if (faq && !sections.some((s) => s.blockType === 'faq')) {
    const ctaIndex = sections.findIndex((s) => s.blockType === 'cta')
    const next = [...sections]
    next.splice(ctaIndex === -1 ? next.length : ctaIndex, 0, faq as unknown as Row)
    await payload.updateGlobal({
      slug: 'homepage',
      data: { sections: stripIds(next) as never },
      overrideAccess: true,
      req,
    })
  }

  payload.logger.info('[migration] starter FAQs added')
}

export async function down(_args: MigrateDownArgs): Promise<void> {}
