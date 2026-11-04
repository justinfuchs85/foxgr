import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import content from '../../seed/content.json'

/**
 * Fills the new Search & sharing fields with keyword-focused defaults. Only empty fields
 * are written, on the live rows and their saved versions, so anything already edited in
 * the CMS is kept. Fresh databases get these from the seed instead.
 */
const schema = process.env.DATABASE_SCHEMA || 'foxgr'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const s = sql.identifier(schema)
  for (const page of content.servicePages) {
    const { title, description } = page.meta
    await db.execute(sql`
      UPDATE ${s}."service_pages" SET "meta_title" = ${title}, "meta_description" = ${description}
      WHERE "slug" = ${page.slug} AND "meta_title" IS NULL AND "meta_description" IS NULL`)
    await db.execute(sql`
      UPDATE ${s}."_service_pages_v" SET "version_meta_title" = ${title}, "version_meta_description" = ${description}
      WHERE "version_slug" = ${page.slug} AND "version_meta_title" IS NULL AND "version_meta_description" IS NULL`)
  }
  const { title, description } = content.homepage.meta
  await db.execute(sql`
    UPDATE ${s}."homepage" SET "meta_title" = ${title}, "meta_description" = ${description}
    WHERE "meta_title" IS NULL AND "meta_description" IS NULL`)
  await db.execute(sql`
    UPDATE ${s}."_homepage_v" SET "version_meta_title" = ${title}, "version_meta_description" = ${description}
    WHERE "version_meta_title" IS NULL AND "version_meta_description" IS NULL`)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // Content only; the schema migration's down removes the columns.
}
