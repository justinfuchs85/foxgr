import path from 'node:path'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

/**
 * Puts Justin's headshot in the "Who we are" panel in place of the Fox illustration.
 *
 * Only replaces the image when the section still shows the Fox (or nothing), so a
 * different photo chosen in the CMS is left alone. Fresh databases get the headshot
 * from the seed instead.
 */

type Row = Record<string, unknown>

const FILENAME = 'justin-fuchs-headshot.webp'
const ALT = 'Justin Fuchs, founder of Fox Consulting Group'

const stripIds = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stripIds)
  if (value && typeof value === 'object') {
    const out: Row = {}
    for (const [key, v] of Object.entries(value as Row)) if (key !== 'id') out[key] = stripIds(v)
    return out
  }
  return value
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const homepage = await payload.findGlobal({ slug: 'homepage', depth: 0, overrideAccess: true, req })
  const sections = (homepage.sections ?? []) as unknown as Row[]
  const about = sections.find((s) => s.blockType === 'about')
  if (!about) return

  const currentId = about.image as number | string | null | undefined
  const current = currentId
    ? await payload.findByID({ collection: 'media', id: currentId, depth: 0, overrideAccess: true, req, disableErrors: true })
    : null
  const currentName = current?.filename ?? ''
  if (current && !currentName.startsWith('fox-consultant')) {
    payload.logger.info('[migration] about already has a custom image; leaving it')
    return
  }

  const existing = (
    await payload.find({
      collection: 'media',
      where: { filename: { equals: FILENAME } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    })
  ).docs[0]
  const headshot =
    existing ??
    (await payload.create({
      collection: 'media',
      data: { alt: ALT },
      filePath: path.resolve(process.cwd(), 'seed/media', FILENAME),
      overrideAccess: true,
      req,
    }))

  const next = sections.map((s) => (s === about ? { ...s, image: headshot.id } : s))

  await payload.updateGlobal({
    slug: 'homepage',
    data: { sections: stripIds(next) as never },
    depth: 0,
    overrideAccess: true,
    req,
  })
  payload.logger.info('[migration] headshot added to Who we are')
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Content change only; pick a different image in the CMS to undo it.
}
