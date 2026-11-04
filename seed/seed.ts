/**
 * Loads the content exported from the Figma Make site into this Payload instance.
 *
 *   pnpm seed            # only seeds if the database has no homepage sections yet
 *   pnpm seed --reset    # wipes the website collections first, then seeds
 *
 * Images live in seed/media. The two case-study artifacts were stored in Figma's
 * cloud and aren't included — drop them into seed/media with the filenames listed
 * in content.json and re-run with --reset, or upload them in the admin afterwards.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'
import content from './content.json' with { type: 'json' }

const dirname = path.dirname(fileURLToPath(import.meta.url))
const mediaDir = path.resolve(dirname, 'media')
const reset = process.argv.includes('--reset')

type ID = number

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)

const existing = await payload.findGlobal({ slug: 'homepage', depth: 0, overrideAccess: true })
if (existing.sections?.length && !reset) {
  log('Homepage already has content. Re-run with --reset to wipe and reseed.')
  process.exit(0)
}

if (reset) {
  for (const collection of [
    'service-pages',
    'case-studies',
    'services',
    'insights',
    'testimonials',
    'media',
  ] as const) {
    await payload.delete({ collection, where: { id: { exists: true } }, overrideAccess: true })
    log(`cleared ${collection}`)
  }
}

// --- Media -----------------------------------------------------------------
const media: Record<string, ID | undefined> = {}
for (const item of content.media) {
  const filePath = path.join(mediaDir, item.filename)
  if (!fs.existsSync(filePath)) {
    log(`skipping ${item.filename} (not in seed/media) — upload it in the admin later`)
    continue
  }
  const doc = await payload.create({ collection: 'media', data: { alt: item.alt }, filePath, overrideAccess: true })
  media[item.key] = doc.id
  log(`uploaded ${item.filename}`)
}

const ref = (value: string | undefined, map: Record<string, ID | undefined>) => {
  if (!value?.startsWith('@')) return undefined
  return map[value.split(':')[1]]
}

// --- Collections -----------------------------------------------------------
const testimonials: Record<string, ID> = {}
for (const t of content.testimonials) {
  const doc = await payload.create({ collection: 'testimonials', data: t, overrideAccess: true })
  testimonials[String(t.order)] = doc.id
}
log(`created ${content.testimonials.length} testimonials`)

for (const s of content.services) {
  await payload.create({
    collection: 'services',
    data: { ...s, capabilities: s.capabilities.map((label) => ({ label })) },
    overrideAccess: true,
  })
}
log(`created ${content.services.length} services`)

for (const i of content.insights) {
  await payload.create({ collection: 'insights', data: i, overrideAccess: true })
}
log(`created ${content.insights.length} insights`)

for (const c of content.caseStudies) {
  await payload.create({
    collection: 'case-studies',
    data: { ...c, artifact: ref(c.artifact, media) },
    overrideAccess: true,
  })
}
log(`created ${content.caseStudies.length} case studies`)

for (const p of content.servicePages) {
  await payload.create({
    collection: 'service-pages',
    data: {
      ...p,
      outcomes: p.outcomes.map((text) => ({ text })),
      _status: 'published',
    },
    overrideAccess: true,
  })
}
log(`created ${content.servicePages.length} service pages`)

// --- Homepage --------------------------------------------------------------
const sections = content.homepage.sections.map((section) => {
  const s = { ...section } as Record<string, unknown>
  if (typeof s.characterImage === 'string') s.characterImage = ref(s.characterImage, media)
  if (typeof s.image === 'string') s.image = ref(s.image, media)
  if (typeof s.testimonial === 'string') s.testimonial = ref(s.testimonial, testimonials)
  return s
})

// An image break with no image can't validate; drop it rather than fail the seed.
const valid = sections.filter((s) => !(s.blockType === 'imageBreak' && !s.image))

await payload.updateGlobal({
  slug: 'homepage',
  // Block data is shaped by content.json; Payload validates it on write.
  data: { sections: valid as never, meta: content.homepage.meta },
  overrideAccess: true,
})
log(`homepage built with ${valid.length} sections`)

log('Done. Visit /admin to create your first admin user.')
process.exit(0)
