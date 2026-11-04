import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "foxgr"."media" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "foxgr"."media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "foxgr"."_media_v" ADD COLUMN "version_prefix" varchar DEFAULT '';
  ALTER TABLE "foxgr"."_media_v" ADD COLUMN "version__objectkey" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "foxgr"."media" DROP COLUMN "prefix";
  ALTER TABLE "foxgr"."media" DROP COLUMN "_objectkey";
  ALTER TABLE "foxgr"."_media_v" DROP COLUMN "version_prefix";
  ALTER TABLE "foxgr"."_media_v" DROP COLUMN "version__objectkey";`)
}
