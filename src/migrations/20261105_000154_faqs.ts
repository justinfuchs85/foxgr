import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "foxgr"."enum_homepage_blocks_faq_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "foxgr"."enum__homepage_v_blocks_faq_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TABLE "foxgr"."service_pages_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "foxgr"."_service_pages_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "foxgr"."homepage_blocks_faq_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "foxgr"."homepage_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'FAQ' NOT NULL,
  	"heading" varchar DEFAULT 'Common questions.' NOT NULL,
  	"spacing" "foxgr"."enum_homepage_blocks_faq_spacing" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "foxgr"."_homepage_v_blocks_faq_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "foxgr"."_homepage_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'FAQ' NOT NULL,
  	"heading" varchar DEFAULT 'Common questions.' NOT NULL,
  	"spacing" "foxgr"."enum__homepage_v_blocks_faq_spacing" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "foxgr"."service_pages_faqs" ADD CONSTRAINT "service_pages_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_service_pages_v_version_faqs" ADD CONSTRAINT "_service_pages_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."homepage_blocks_faq_faqs" ADD CONSTRAINT "homepage_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."homepage_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."homepage_blocks_faq" ADD CONSTRAINT "homepage_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_homepage_v_blocks_faq_faqs" ADD CONSTRAINT "_homepage_v_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."_homepage_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_homepage_v_blocks_faq" ADD CONSTRAINT "_homepage_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "service_pages_faqs_order_idx" ON "foxgr"."service_pages_faqs" USING btree ("_order");
  CREATE INDEX "service_pages_faqs_parent_id_idx" ON "foxgr"."service_pages_faqs" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_version_faqs_order_idx" ON "foxgr"."_service_pages_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_service_pages_v_version_faqs_parent_id_idx" ON "foxgr"."_service_pages_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_faq_faqs_order_idx" ON "foxgr"."homepage_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX "homepage_blocks_faq_faqs_parent_id_idx" ON "foxgr"."homepage_blocks_faq_faqs" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_faq_order_idx" ON "foxgr"."homepage_blocks_faq" USING btree ("_order");
  CREATE INDEX "homepage_blocks_faq_parent_id_idx" ON "foxgr"."homepage_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_faq_path_idx" ON "foxgr"."homepage_blocks_faq" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_faq_faqs_order_idx" ON "foxgr"."_homepage_v_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_faq_faqs_parent_id_idx" ON "foxgr"."_homepage_v_blocks_faq_faqs" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_faq_order_idx" ON "foxgr"."_homepage_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_faq_parent_id_idx" ON "foxgr"."_homepage_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_faq_path_idx" ON "foxgr"."_homepage_v_blocks_faq" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "foxgr"."service_pages_faqs" CASCADE;
  DROP TABLE "foxgr"."_service_pages_v_version_faqs" CASCADE;
  DROP TABLE "foxgr"."homepage_blocks_faq_faqs" CASCADE;
  DROP TABLE "foxgr"."homepage_blocks_faq" CASCADE;
  DROP TABLE "foxgr"."_homepage_v_blocks_faq_faqs" CASCADE;
  DROP TABLE "foxgr"."_homepage_v_blocks_faq" CASCADE;
  DROP TYPE "foxgr"."enum_homepage_blocks_faq_spacing";
  DROP TYPE "foxgr"."enum__homepage_v_blocks_faq_spacing";`)
}
