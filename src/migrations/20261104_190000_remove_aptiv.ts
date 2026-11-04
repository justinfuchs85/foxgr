import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

/**
 * Aptiv hasn't approved being named in marketing: remove the Aptiv case study
 * and take Aptiv out of the "Who we are" client list.
 */

const hasHomepageContent = async (db: MigrateUpArgs['db'], payload: MigrateUpArgs['payload']) => {
  const schema = (payload.db as unknown as { schemaName?: string }).schemaName || 'public'
  const result = await db.execute(
    sql`select exists(select 1 from ${sql.identifier(schema)}."homepage_blocks_cta") as present`,
  )
  return Boolean((result as unknown as { rows: { present: boolean }[] }).rows[0]?.present)
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  if (!(await hasHomepageContent(db, payload))) return

  await payload.delete({
    collection: 'case-studies',
    where: { client: { equals: 'Aptiv' } },
    overrideAccess: true,
    req,
  })

  const homepage = await payload.findGlobal({ slug: 'homepage', depth: 0, overrideAccess: true, req })
  const sections = (homepage.sections ?? []) as unknown as Record<string, unknown>[]
  let changed = false
  const next = sections.map((section) => {
    if (section.blockType !== 'about' || typeof section.body !== 'string') return section
    const body = section.body.replace('organizations including Aptiv, ', 'organizations including ')
    if (body === section.body) return section
    changed = true
    return { ...section, body }
  })
  if (changed) {
    await payload.updateGlobal({ slug: 'homepage', data: { sections: next as never }, overrideAccess: true, req })
  }
  payload.logger.info('[migration] Aptiv removed from case studies and bio')
}

export async function down(_args: MigrateDownArgs): Promise<void> {}
