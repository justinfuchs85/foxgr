import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "foxgr"."service_pages" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "foxgr"."service_pages" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "foxgr"."_service_pages_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "foxgr"."_service_pages_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "foxgr"."homepage" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "foxgr"."homepage" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "foxgr"."_homepage_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "foxgr"."_homepage_v" ADD COLUMN "version_meta_description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "foxgr"."service_pages" DROP COLUMN "meta_title";
  ALTER TABLE "foxgr"."service_pages" DROP COLUMN "meta_description";
  ALTER TABLE "foxgr"."_service_pages_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "foxgr"."_service_pages_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "foxgr"."homepage" DROP COLUMN "meta_title";
  ALTER TABLE "foxgr"."homepage" DROP COLUMN "meta_description";
  ALTER TABLE "foxgr"."_homepage_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "foxgr"."_homepage_v" DROP COLUMN "version_meta_description";`)
}
