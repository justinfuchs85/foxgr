import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "foxgr"."enum_consent_records_analytics" AS ENUM('granted', 'denied');
  CREATE TYPE "foxgr"."enum_consent_records_marketing" AS ENUM('granted', 'denied', 'n/a');
  CREATE TYPE "foxgr"."enum_consent_records_source" AS ENUM('banner', 'browser_signal');
  CREATE TYPE "foxgr"."enum_consent_records_signal" AS ENUM('none', 'gpc', 'dnt');
  CREATE TYPE "foxgr"."enum__consent_records_v_version_analytics" AS ENUM('granted', 'denied');
  CREATE TYPE "foxgr"."enum__consent_records_v_version_marketing" AS ENUM('granted', 'denied', 'n/a');
  CREATE TYPE "foxgr"."enum__consent_records_v_version_source" AS ENUM('banner', 'browser_signal');
  CREATE TYPE "foxgr"."enum__consent_records_v_version_signal" AS ENUM('none', 'gpc', 'dnt');
  CREATE TYPE "foxgr"."enum_consent_settings_mode" AS ENUM('opt-in', 'opt-out');
  CREATE TYPE "foxgr"."enum__consent_settings_v_version_mode" AS ENUM('opt-in', 'opt-out');
  CREATE TABLE "foxgr"."consent_records" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"consent_id" varchar NOT NULL,
  	"analytics" "foxgr"."enum_consent_records_analytics" NOT NULL,
  	"marketing" "foxgr"."enum_consent_records_marketing" DEFAULT 'n/a',
  	"source" "foxgr"."enum_consent_records_source" NOT NULL,
  	"signal" "foxgr"."enum_consent_records_signal" DEFAULT 'none',
  	"mode" varchar,
  	"policy_version" varchar,
  	"page" varchar,
  	"browser" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "foxgr"."consent_records_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "foxgr"."_consent_records_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_consent_id" varchar NOT NULL,
  	"version_analytics" "foxgr"."enum__consent_records_v_version_analytics" NOT NULL,
  	"version_marketing" "foxgr"."enum__consent_records_v_version_marketing" DEFAULT 'n/a',
  	"version_source" "foxgr"."enum__consent_records_v_version_source" NOT NULL,
  	"version_signal" "foxgr"."enum__consent_records_v_version_signal" DEFAULT 'none',
  	"version_mode" varchar,
  	"version_policy_version" varchar,
  	"version_page" varchar,
  	"version_browser" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "foxgr"."_consent_records_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "foxgr"."consent_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"mode" "foxgr"."enum_consent_settings_mode" DEFAULT 'opt-in' NOT NULL,
  	"honor_gpc" boolean DEFAULT true,
  	"honor_dnt" boolean DEFAULT true,
  	"max_age_months" numeric DEFAULT 12 NOT NULL,
  	"policy_version" varchar DEFAULT '2026-11-05' NOT NULL,
  	"marketing_enabled" boolean DEFAULT false,
  	"log_choices" boolean DEFAULT true,
  	"message" varchar DEFAULT 'We’d like to use analytics cookies to understand which pages are useful. No advertising, no selling data.' NOT NULL,
  	"signal_message" varchar DEFAULT 'Your browser is sending a {signal} signal, so analytics cookies are off. You can still allow them for this site.' NOT NULL,
  	"accept_label" varchar DEFAULT 'Allow analytics' NOT NULL,
  	"decline_label" varchar DEFAULT 'No thanks' NOT NULL,
  	"customize_label" varchar DEFAULT 'Choose' NOT NULL,
  	"policy_link_label" varchar DEFAULT 'Privacy policy' NOT NULL,
  	"analytics_description" varchar DEFAULT 'Google Analytics, to see which pages and content are useful. Reported in aggregate.' NOT NULL,
  	"marketing_description" varchar DEFAULT 'Advertising and remarketing tags, to measure and tailor ads on other sites.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "foxgr"."consent_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "foxgr"."_consent_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_enabled" boolean DEFAULT true,
  	"version_mode" "foxgr"."enum__consent_settings_v_version_mode" DEFAULT 'opt-in' NOT NULL,
  	"version_honor_gpc" boolean DEFAULT true,
  	"version_honor_dnt" boolean DEFAULT true,
  	"version_max_age_months" numeric DEFAULT 12 NOT NULL,
  	"version_policy_version" varchar DEFAULT '2026-11-05' NOT NULL,
  	"version_marketing_enabled" boolean DEFAULT false,
  	"version_log_choices" boolean DEFAULT true,
  	"version_message" varchar DEFAULT 'We’d like to use analytics cookies to understand which pages are useful. No advertising, no selling data.' NOT NULL,
  	"version_signal_message" varchar DEFAULT 'Your browser is sending a {signal} signal, so analytics cookies are off. You can still allow them for this site.' NOT NULL,
  	"version_accept_label" varchar DEFAULT 'Allow analytics' NOT NULL,
  	"version_decline_label" varchar DEFAULT 'No thanks' NOT NULL,
  	"version_customize_label" varchar DEFAULT 'Choose' NOT NULL,
  	"version_policy_link_label" varchar DEFAULT 'Privacy policy' NOT NULL,
  	"version_analytics_description" varchar DEFAULT 'Google Analytics, to see which pages and content are useful. Reported in aggregate.' NOT NULL,
  	"version_marketing_description" varchar DEFAULT 'Advertising and remarketing tags, to measure and tailor ads on other sites.',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "foxgr"."_consent_settings_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  ALTER TABLE "foxgr"."payload_locked_documents_rels" ADD COLUMN "consent_records_id" integer;
  ALTER TABLE "foxgr"."consent_records_rels" ADD CONSTRAINT "consent_records_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "foxgr"."consent_records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."consent_records_rels" ADD CONSTRAINT "consent_records_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "foxgr"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_consent_records_v" ADD CONSTRAINT "_consent_records_v_parent_id_consent_records_id_fk" FOREIGN KEY ("parent_id") REFERENCES "foxgr"."consent_records"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "foxgr"."_consent_records_v_rels" ADD CONSTRAINT "_consent_records_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "foxgr"."_consent_records_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_consent_records_v_rels" ADD CONSTRAINT "_consent_records_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "foxgr"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."consent_settings_rels" ADD CONSTRAINT "consent_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "foxgr"."consent_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."consent_settings_rels" ADD CONSTRAINT "consent_settings_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "foxgr"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_consent_settings_v_rels" ADD CONSTRAINT "_consent_settings_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "foxgr"."_consent_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_consent_settings_v_rels" ADD CONSTRAINT "_consent_settings_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "foxgr"."admins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "consent_records_consent_id_idx" ON "foxgr"."consent_records" USING btree ("consent_id");
  CREATE INDEX "consent_records_updated_at_idx" ON "foxgr"."consent_records" USING btree ("updated_at");
  CREATE INDEX "consent_records_created_at_idx" ON "foxgr"."consent_records" USING btree ("created_at");
  CREATE INDEX "consent_records_rels_order_idx" ON "foxgr"."consent_records_rels" USING btree ("order");
  CREATE INDEX "consent_records_rels_parent_idx" ON "foxgr"."consent_records_rels" USING btree ("parent_id");
  CREATE INDEX "consent_records_rels_path_idx" ON "foxgr"."consent_records_rels" USING btree ("path");
  CREATE INDEX "consent_records_rels_admins_id_idx" ON "foxgr"."consent_records_rels" USING btree ("admins_id");
  CREATE INDEX "_consent_records_v_parent_idx" ON "foxgr"."_consent_records_v" USING btree ("parent_id");
  CREATE INDEX "_consent_records_v_version_version_consent_id_idx" ON "foxgr"."_consent_records_v" USING btree ("version_consent_id");
  CREATE INDEX "_consent_records_v_version_version_updated_at_idx" ON "foxgr"."_consent_records_v" USING btree ("version_updated_at");
  CREATE INDEX "_consent_records_v_version_version_created_at_idx" ON "foxgr"."_consent_records_v" USING btree ("version_created_at");
  CREATE INDEX "_consent_records_v_created_at_idx" ON "foxgr"."_consent_records_v" USING btree ("created_at");
  CREATE INDEX "_consent_records_v_updated_at_idx" ON "foxgr"."_consent_records_v" USING btree ("updated_at");
  CREATE INDEX "_consent_records_v_rels_order_idx" ON "foxgr"."_consent_records_v_rels" USING btree ("order");
  CREATE INDEX "_consent_records_v_rels_parent_idx" ON "foxgr"."_consent_records_v_rels" USING btree ("parent_id");
  CREATE INDEX "_consent_records_v_rels_path_idx" ON "foxgr"."_consent_records_v_rels" USING btree ("path");
  CREATE INDEX "_consent_records_v_rels_admins_id_idx" ON "foxgr"."_consent_records_v_rels" USING btree ("admins_id");
  CREATE INDEX "consent_settings_rels_order_idx" ON "foxgr"."consent_settings_rels" USING btree ("order");
  CREATE INDEX "consent_settings_rels_parent_idx" ON "foxgr"."consent_settings_rels" USING btree ("parent_id");
  CREATE INDEX "consent_settings_rels_path_idx" ON "foxgr"."consent_settings_rels" USING btree ("path");
  CREATE INDEX "consent_settings_rels_admins_id_idx" ON "foxgr"."consent_settings_rels" USING btree ("admins_id");
  CREATE INDEX "_consent_settings_v_created_at_idx" ON "foxgr"."_consent_settings_v" USING btree ("created_at");
  CREATE INDEX "_consent_settings_v_updated_at_idx" ON "foxgr"."_consent_settings_v" USING btree ("updated_at");
  CREATE INDEX "_consent_settings_v_rels_order_idx" ON "foxgr"."_consent_settings_v_rels" USING btree ("order");
  CREATE INDEX "_consent_settings_v_rels_parent_idx" ON "foxgr"."_consent_settings_v_rels" USING btree ("parent_id");
  CREATE INDEX "_consent_settings_v_rels_path_idx" ON "foxgr"."_consent_settings_v_rels" USING btree ("path");
  CREATE INDEX "_consent_settings_v_rels_admins_id_idx" ON "foxgr"."_consent_settings_v_rels" USING btree ("admins_id");
  ALTER TABLE "foxgr"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consent_records_fk" FOREIGN KEY ("consent_records_id") REFERENCES "foxgr"."consent_records"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_consent_records_id_idx" ON "foxgr"."payload_locked_documents_rels" USING btree ("consent_records_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "foxgr"."consent_records" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."consent_records_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."_consent_records_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."_consent_records_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."consent_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."consent_settings_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."_consent_settings_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."_consent_settings_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "foxgr"."consent_records" CASCADE;
  DROP TABLE "foxgr"."consent_records_rels" CASCADE;
  DROP TABLE "foxgr"."_consent_records_v" CASCADE;
  DROP TABLE "foxgr"."_consent_records_v_rels" CASCADE;
  DROP TABLE "foxgr"."consent_settings" CASCADE;
  DROP TABLE "foxgr"."consent_settings_rels" CASCADE;
  DROP TABLE "foxgr"."_consent_settings_v" CASCADE;
  DROP TABLE "foxgr"."_consent_settings_v_rels" CASCADE;
  ALTER TABLE "foxgr"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consent_records_fk";
  
  DROP INDEX "foxgr"."payload_locked_documents_rels_consent_records_id_idx";
  ALTER TABLE "foxgr"."payload_locked_documents_rels" DROP COLUMN "consent_records_id";
  DROP TYPE "foxgr"."enum_consent_records_analytics";
  DROP TYPE "foxgr"."enum_consent_records_marketing";
  DROP TYPE "foxgr"."enum_consent_records_source";
  DROP TYPE "foxgr"."enum_consent_records_signal";
  DROP TYPE "foxgr"."enum__consent_records_v_version_analytics";
  DROP TYPE "foxgr"."enum__consent_records_v_version_marketing";
  DROP TYPE "foxgr"."enum__consent_records_v_version_source";
  DROP TYPE "foxgr"."enum__consent_records_v_version_signal";
  DROP TYPE "foxgr"."enum_consent_settings_mode";
  DROP TYPE "foxgr"."enum__consent_settings_v_version_mode";`)
}
