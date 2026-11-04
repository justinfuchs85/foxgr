import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "foxgr"."enum_homepage_blocks_engagements_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "foxgr"."enum__homepage_v_blocks_engagements_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TABLE "foxgr"."homepage_blocks_engagements_offers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"duration" varchar,
  	"pricing" varchar,
  	"description" varchar NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar,
  	"highlight" boolean
  );
  
  CREATE TABLE "foxgr"."homepage_blocks_engagements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Working together' NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar,
  	"spacing" "foxgr"."enum_homepage_blocks_engagements_spacing" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "foxgr"."_homepage_v_blocks_engagements_offers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"duration" varchar,
  	"pricing" varchar,
  	"description" varchar NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar,
  	"highlight" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "foxgr"."_homepage_v_blocks_engagements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Working together' NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar,
  	"spacing" "foxgr"."enum__homepage_v_blocks_engagements_spacing" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "foxgr"."service_pages" ADD COLUMN "featured" boolean DEFAULT true;
  ALTER TABLE "foxgr"."_service_pages_v" ADD COLUMN "version_featured" boolean DEFAULT true;
  ALTER TABLE "foxgr"."homepage_blocks_about" ADD COLUMN "person_name" varchar;
  ALTER TABLE "foxgr"."homepage_blocks_about" ADD COLUMN "person_title" varchar;
  ALTER TABLE "foxgr"."homepage_blocks_about" ADD COLUMN "linkedin_url" varchar;
  ALTER TABLE "foxgr"."_homepage_v_blocks_about" ADD COLUMN "person_name" varchar;
  ALTER TABLE "foxgr"."_homepage_v_blocks_about" ADD COLUMN "person_title" varchar;
  ALTER TABLE "foxgr"."_homepage_v_blocks_about" ADD COLUMN "linkedin_url" varchar;
  ALTER TABLE "foxgr"."homepage_blocks_engagements_offers" ADD CONSTRAINT "homepage_blocks_engagements_offers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."homepage_blocks_engagements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."homepage_blocks_engagements" ADD CONSTRAINT "homepage_blocks_engagements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_homepage_v_blocks_engagements_offers" ADD CONSTRAINT "_homepage_v_blocks_engagements_offers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."_homepage_v_blocks_engagements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_homepage_v_blocks_engagements" ADD CONSTRAINT "_homepage_v_blocks_engagements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homepage_blocks_engagements_offers_order_idx" ON "foxgr"."homepage_blocks_engagements_offers" USING btree ("_order");
  CREATE INDEX "homepage_blocks_engagements_offers_parent_id_idx" ON "foxgr"."homepage_blocks_engagements_offers" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_engagements_order_idx" ON "foxgr"."homepage_blocks_engagements" USING btree ("_order");
  CREATE INDEX "homepage_blocks_engagements_parent_id_idx" ON "foxgr"."homepage_blocks_engagements" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_engagements_path_idx" ON "foxgr"."homepage_blocks_engagements" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_engagements_offers_order_idx" ON "foxgr"."_homepage_v_blocks_engagements_offers" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_engagements_offers_parent_id_idx" ON "foxgr"."_homepage_v_blocks_engagements_offers" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_engagements_order_idx" ON "foxgr"."_homepage_v_blocks_engagements" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_engagements_parent_id_idx" ON "foxgr"."_homepage_v_blocks_engagements" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_engagements_path_idx" ON "foxgr"."_homepage_v_blocks_engagements" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "foxgr"."homepage_blocks_engagements_offers" CASCADE;
  DROP TABLE "foxgr"."homepage_blocks_engagements" CASCADE;
  DROP TABLE "foxgr"."_homepage_v_blocks_engagements_offers" CASCADE;
  DROP TABLE "foxgr"."_homepage_v_blocks_engagements" CASCADE;
  ALTER TABLE "foxgr"."service_pages" DROP COLUMN "featured";
  ALTER TABLE "foxgr"."_service_pages_v" DROP COLUMN "version_featured";
  ALTER TABLE "foxgr"."homepage_blocks_about" DROP COLUMN "person_name";
  ALTER TABLE "foxgr"."homepage_blocks_about" DROP COLUMN "person_title";
  ALTER TABLE "foxgr"."homepage_blocks_about" DROP COLUMN "linkedin_url";
  ALTER TABLE "foxgr"."_homepage_v_blocks_about" DROP COLUMN "person_name";
  ALTER TABLE "foxgr"."_homepage_v_blocks_about" DROP COLUMN "person_title";
  ALTER TABLE "foxgr"."_homepage_v_blocks_about" DROP COLUMN "linkedin_url";
  DROP TYPE "foxgr"."enum_homepage_blocks_engagements_spacing";
  DROP TYPE "foxgr"."enum__homepage_v_blocks_engagements_spacing";`)
}
