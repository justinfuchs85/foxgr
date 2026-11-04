import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "foxgr"."enum_homepage_blocks_approach_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "foxgr"."enum_homepage_blocks_about_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "foxgr"."enum__homepage_v_blocks_approach_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "foxgr"."enum__homepage_v_blocks_about_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TABLE "foxgr"."homepage_blocks_approach_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "foxgr"."homepage_blocks_approach" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'How we work' NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar,
  	"spacing" "foxgr"."enum_homepage_blocks_approach_spacing" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "foxgr"."homepage_blocks_about_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "foxgr"."homepage_blocks_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Who we are' NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"image_id" integer,
  	"spacing" "foxgr"."enum_homepage_blocks_about_spacing" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "foxgr"."_homepage_v_blocks_approach_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "foxgr"."_homepage_v_blocks_approach" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'How we work' NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar,
  	"spacing" "foxgr"."enum__homepage_v_blocks_approach_spacing" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "foxgr"."_homepage_v_blocks_about_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "foxgr"."_homepage_v_blocks_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Who we are' NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"image_id" integer,
  	"spacing" "foxgr"."enum__homepage_v_blocks_about_spacing" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "foxgr"."homepage_blocks_hero" ALTER COLUMN "eyebrow" DROP NOT NULL;
  ALTER TABLE "foxgr"."_homepage_v_blocks_hero" ALTER COLUMN "eyebrow" DROP NOT NULL;
  ALTER TABLE "foxgr"."homepage_blocks_approach_steps" ADD CONSTRAINT "homepage_blocks_approach_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."homepage_blocks_approach"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."homepage_blocks_approach" ADD CONSTRAINT "homepage_blocks_approach_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."homepage_blocks_about_stats" ADD CONSTRAINT "homepage_blocks_about_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."homepage_blocks_about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."homepage_blocks_about" ADD CONSTRAINT "homepage_blocks_about_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "foxgr"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "foxgr"."homepage_blocks_about" ADD CONSTRAINT "homepage_blocks_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_homepage_v_blocks_approach_steps" ADD CONSTRAINT "_homepage_v_blocks_approach_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."_homepage_v_blocks_approach"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_homepage_v_blocks_approach" ADD CONSTRAINT "_homepage_v_blocks_approach_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_homepage_v_blocks_about_stats" ADD CONSTRAINT "_homepage_v_blocks_about_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."_homepage_v_blocks_about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_homepage_v_blocks_about" ADD CONSTRAINT "_homepage_v_blocks_about_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "foxgr"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "foxgr"."_homepage_v_blocks_about" ADD CONSTRAINT "_homepage_v_blocks_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "foxgr"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homepage_blocks_approach_steps_order_idx" ON "foxgr"."homepage_blocks_approach_steps" USING btree ("_order");
  CREATE INDEX "homepage_blocks_approach_steps_parent_id_idx" ON "foxgr"."homepage_blocks_approach_steps" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_approach_order_idx" ON "foxgr"."homepage_blocks_approach" USING btree ("_order");
  CREATE INDEX "homepage_blocks_approach_parent_id_idx" ON "foxgr"."homepage_blocks_approach" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_approach_path_idx" ON "foxgr"."homepage_blocks_approach" USING btree ("_path");
  CREATE INDEX "homepage_blocks_about_stats_order_idx" ON "foxgr"."homepage_blocks_about_stats" USING btree ("_order");
  CREATE INDEX "homepage_blocks_about_stats_parent_id_idx" ON "foxgr"."homepage_blocks_about_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_about_order_idx" ON "foxgr"."homepage_blocks_about" USING btree ("_order");
  CREATE INDEX "homepage_blocks_about_parent_id_idx" ON "foxgr"."homepage_blocks_about" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_about_path_idx" ON "foxgr"."homepage_blocks_about" USING btree ("_path");
  CREATE INDEX "homepage_blocks_about_image_idx" ON "foxgr"."homepage_blocks_about" USING btree ("image_id");
  CREATE INDEX "_homepage_v_blocks_approach_steps_order_idx" ON "foxgr"."_homepage_v_blocks_approach_steps" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_approach_steps_parent_id_idx" ON "foxgr"."_homepage_v_blocks_approach_steps" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_approach_order_idx" ON "foxgr"."_homepage_v_blocks_approach" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_approach_parent_id_idx" ON "foxgr"."_homepage_v_blocks_approach" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_approach_path_idx" ON "foxgr"."_homepage_v_blocks_approach" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_about_stats_order_idx" ON "foxgr"."_homepage_v_blocks_about_stats" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_about_stats_parent_id_idx" ON "foxgr"."_homepage_v_blocks_about_stats" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_about_order_idx" ON "foxgr"."_homepage_v_blocks_about" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_about_parent_id_idx" ON "foxgr"."_homepage_v_blocks_about" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_about_path_idx" ON "foxgr"."_homepage_v_blocks_about" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_about_image_idx" ON "foxgr"."_homepage_v_blocks_about" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "foxgr"."homepage_blocks_approach_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."homepage_blocks_approach" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."homepage_blocks_about_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."homepage_blocks_about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."_homepage_v_blocks_approach_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."_homepage_v_blocks_approach" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."_homepage_v_blocks_about_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."_homepage_v_blocks_about" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "foxgr"."homepage_blocks_approach_steps" CASCADE;
  DROP TABLE "foxgr"."homepage_blocks_approach" CASCADE;
  DROP TABLE "foxgr"."homepage_blocks_about_stats" CASCADE;
  DROP TABLE "foxgr"."homepage_blocks_about" CASCADE;
  DROP TABLE "foxgr"."_homepage_v_blocks_approach_steps" CASCADE;
  DROP TABLE "foxgr"."_homepage_v_blocks_approach" CASCADE;
  DROP TABLE "foxgr"."_homepage_v_blocks_about_stats" CASCADE;
  DROP TABLE "foxgr"."_homepage_v_blocks_about" CASCADE;
  ALTER TABLE "foxgr"."homepage_blocks_hero" ALTER COLUMN "eyebrow" SET NOT NULL;
  ALTER TABLE "foxgr"."_homepage_v_blocks_hero" ALTER COLUMN "eyebrow" SET NOT NULL;
  DROP TYPE "foxgr"."enum_homepage_blocks_approach_spacing";
  DROP TYPE "foxgr"."enum_homepage_blocks_about_spacing";
  DROP TYPE "foxgr"."enum__homepage_v_blocks_approach_spacing";
  DROP TYPE "foxgr"."enum__homepage_v_blocks_about_spacing";`)
}
