import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_service_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__service_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_payload_llm_instructions_entity_type" AS ENUM('collection', 'global');
  CREATE TYPE "public"."enum_homepage_blocks_intro_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "public"."enum_homepage_blocks_image_break_overlay" AS ENUM('navy', 'none');
  CREATE TYPE "public"."enum_homepage_blocks_services_theme" AS ENUM('navy', 'paper');
  CREATE TYPE "public"."enum_homepage_blocks_services_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "public"."enum_homepage_blocks_case_studies_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "public"."enum_homepage_blocks_testimonial_theme" AS ENUM('coral', 'blue');
  CREATE TYPE "public"."enum_homepage_blocks_testimonial_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "public"."enum_homepage_blocks_insights_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "public"."enum_homepage_blocks_cta_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "public"."enum__homepage_v_blocks_intro_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "public"."enum__homepage_v_blocks_image_break_overlay" AS ENUM('navy', 'none');
  CREATE TYPE "public"."enum__homepage_v_blocks_services_theme" AS ENUM('navy', 'paper');
  CREATE TYPE "public"."enum__homepage_v_blocks_services_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "public"."enum__homepage_v_blocks_case_studies_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "public"."enum__homepage_v_blocks_testimonial_theme" AS ENUM('coral', 'blue');
  CREATE TYPE "public"."enum__homepage_v_blocks_testimonial_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "public"."enum__homepage_v_blocks_insights_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TYPE "public"."enum__homepage_v_blocks_cta_spacing" AS ENUM('compact', 'standard', 'generous');
  CREATE TABLE "admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "admins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "admins_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_admins_v_version_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "_admins_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_email" varchar NOT NULL,
  	"version_reset_password_token" varchar,
  	"version_reset_password_expiration" timestamp(3) with time zone,
  	"version_salt" varchar,
  	"version_hash" varchar,
  	"version_reset_password_requested_at" timestamp(3) with time zone,
  	"version_login_attempts" numeric DEFAULT 0,
  	"version_lock_until" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_admins_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"_h_folders_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"original_filename" varchar,
  	"original_url" varchar,
  	"original_mime_type" varchar,
  	"original_filesize" numeric,
  	"original_width" numeric,
  	"original_height" numeric,
  	"original_prefix" varchar,
  	"original__objectkey" varchar,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"admins_id" integer
  );
  
  CREATE TABLE "_media_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_alt" varchar NOT NULL,
  	"version__h_folders_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_original_filename" varchar,
  	"version_original_url" varchar,
  	"version_original_mime_type" varchar,
  	"version_original_filesize" numeric,
  	"version_original_width" numeric,
  	"version_original_height" numeric,
  	"version_original_prefix" varchar,
  	"version_original__objectkey" varchar,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_media_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"admins_id" integer
  );
  
  CREATE TABLE "folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_h_folders_id" integer,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "folders_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_folders_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__h_folders_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_folders_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_h_tags_id" integer,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_tags_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__h_tags_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_tags_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "services_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_services_v_version_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_eyebrow" varchar NOT NULL,
  	"version_summary" varchar NOT NULL,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "case_studies_methodology" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"detail" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"client" varchar NOT NULL,
  	"category" varchar NOT NULL,
  	"result" varchar NOT NULL,
  	"artifact_id" integer,
  	"artifact_caption" varchar,
  	"metric_value" varchar NOT NULL,
  	"metric_label" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_studies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_case_studies_v_version_methodology" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"detail" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_client" varchar NOT NULL,
  	"version_category" varchar NOT NULL,
  	"version_result" varchar NOT NULL,
  	"version_artifact_id" integer,
  	"version_artifact_caption" varchar,
  	"version_metric_value" varchar NOT NULL,
  	"version_metric_label" varchar NOT NULL,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_case_studies_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "insights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"published_at" timestamp(3) with time zone NOT NULL,
  	"reading_time" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "insights_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_insights_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_excerpt" varchar NOT NULL,
  	"version_published_at" timestamp(3) with time zone NOT NULL,
  	"version_reading_time" varchar NOT NULL,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_insights_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_quote" varchar NOT NULL,
  	"version_attribution" varchar NOT NULL,
  	"version_role" varchar NOT NULL,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_testimonials_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "service_pages_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "service_pages_approach_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "service_pages_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "service_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"navigation_label" varchar,
  	"eyebrow" varchar,
  	"hero_summary" varchar,
  	"problem_heading" varchar,
  	"problem_body" varchar,
  	"approach_heading" varchar,
  	"approach_body" varchar,
  	"cta_heading" varchar,
  	"cta_body" varchar,
  	"cta_button_label" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_service_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "service_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_service_pages_v_version_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_pages_v_version_approach_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_pages_v_version_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_navigation_label" varchar,
  	"version_eyebrow" varchar,
  	"version_hero_summary" varchar,
  	"version_problem_heading" varchar,
  	"version_problem_body" varchar,
  	"version_approach_heading" varchar,
  	"version_approach_body" varchar,
  	"version_cta_heading" varchar,
  	"version_cta_body" varchar,
  	"version_cta_button_label" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__service_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_service_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"media_id" integer,
  	"folders_id" integer,
  	"tags_id" integer,
  	"services_id" integer,
  	"case_studies_id" integer,
  	"insights_id" integer,
  	"testimonials_id" integer,
  	"service_pages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_llm_instructions" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_slug" varchar NOT NULL,
  	"entity_type" "enum_payload_llm_instructions_entity_type" NOT NULL,
  	"additional_instructions" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_llm_instructions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "homepage_blocks_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"accent" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"button_label" varchar NOT NULL,
  	"button_href" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_intro_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"character_image_id" integer,
  	"character_title" varchar,
  	"character_caption" varchar,
  	"spacing" "enum_homepage_blocks_intro_spacing" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_image_break" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"overlay" "enum_homepage_blocks_image_break_overlay" DEFAULT 'navy',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"theme" "enum_homepage_blocks_services_theme" DEFAULT 'navy',
  	"spacing" "enum_homepage_blocks_services_spacing" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_case_studies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar,
  	"limit" numeric DEFAULT 2,
  	"spacing" "enum_homepage_blocks_case_studies_spacing" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_testimonial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"testimonial_id" integer NOT NULL,
  	"label" varchar NOT NULL,
  	"theme" "enum_homepage_blocks_testimonial_theme" DEFAULT 'coral',
  	"spacing" "enum_homepage_blocks_testimonial_spacing" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_insights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"limit" numeric DEFAULT 3,
  	"spacing" "enum_homepage_blocks_insights_spacing" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"button_label" varchar NOT NULL,
  	"button_href" varchar NOT NULL,
  	"spacing" "enum_homepage_blocks_cta_spacing" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_homepage_v_blocks_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"accent" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"button_label" varchar NOT NULL,
  	"button_href" varchar NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_intro_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"character_image_id" integer,
  	"character_title" varchar,
  	"character_caption" varchar,
  	"spacing" "enum__homepage_v_blocks_intro_spacing" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_image_break" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"overlay" "enum__homepage_v_blocks_image_break_overlay" DEFAULT 'navy',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"theme" "enum__homepage_v_blocks_services_theme" DEFAULT 'navy',
  	"spacing" "enum__homepage_v_blocks_services_spacing" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_case_studies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar,
  	"limit" numeric DEFAULT 2,
  	"spacing" "enum__homepage_v_blocks_case_studies_spacing" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_testimonial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"testimonial_id" integer NOT NULL,
  	"label" varchar NOT NULL,
  	"theme" "enum__homepage_v_blocks_testimonial_theme" DEFAULT 'coral',
  	"spacing" "enum__homepage_v_blocks_testimonial_spacing" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_insights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"limit" numeric DEFAULT 3,
  	"spacing" "enum__homepage_v_blocks_insights_spacing" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"button_label" varchar NOT NULL,
  	"button_href" varchar NOT NULL,
  	"spacing" "enum__homepage_v_blocks_cta_spacing" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  ALTER TABLE "admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_admins_v_version_sessions" ADD CONSTRAINT "_admins_v_version_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_admins_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_admins_v" ADD CONSTRAINT "_admins_v_parent_id_admins_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_admins_v_rels" ADD CONSTRAINT "_admins_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_admins_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_admins_v_rels" ADD CONSTRAINT "_admins_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media__h_folders_id_folders_id_fk" FOREIGN KEY ("_h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_version__h_folders_id_folders_id_fk" FOREIGN KEY ("version__h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders" ADD CONSTRAINT "folders__h_folders_id_folders_id_fk" FOREIGN KEY ("_h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v" ADD CONSTRAINT "_folders_v_parent_id_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_folders_v" ADD CONSTRAINT "_folders_v_version__h_folders_id_folders_id_fk" FOREIGN KEY ("version__h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_folders_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags" ADD CONSTRAINT "tags__h_tags_id_tags_id_fk" FOREIGN KEY ("_h_tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_parent_id_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_version__h_tags_id_tags_id_fk" FOREIGN KEY ("version__h_tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tags_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_capabilities" ADD CONSTRAINT "services_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_capabilities" ADD CONSTRAINT "_services_v_version_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_methodology" ADD CONSTRAINT "case_studies_methodology_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_artifact_id_media_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_methodology" ADD CONSTRAINT "_case_studies_v_version_methodology_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_artifact_id_media_id_fk" FOREIGN KEY ("version_artifact_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insights_rels" ADD CONSTRAINT "insights_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insights_rels" ADD CONSTRAINT "insights_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_parent_id_insights_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."insights"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v_rels" ADD CONSTRAINT "_insights_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_insights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v_rels" ADD CONSTRAINT "_insights_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_rels" ADD CONSTRAINT "testimonials_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_rels" ADD CONSTRAINT "testimonials_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v_rels" ADD CONSTRAINT "_testimonials_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v_rels" ADD CONSTRAINT "_testimonials_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_capabilities" ADD CONSTRAINT "service_pages_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_approach_steps" ADD CONSTRAINT "service_pages_approach_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_outcomes" ADD CONSTRAINT "service_pages_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_rels" ADD CONSTRAINT "service_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_rels" ADD CONSTRAINT "service_pages_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_capabilities" ADD CONSTRAINT "_service_pages_v_version_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_approach_steps" ADD CONSTRAINT "_service_pages_v_version_approach_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_outcomes" ADD CONSTRAINT "_service_pages_v_version_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v" ADD CONSTRAINT "_service_pages_v_parent_id_service_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_pages_v_rels" ADD CONSTRAINT "_service_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_rels" ADD CONSTRAINT "_service_pages_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_folders_fk" FOREIGN KEY ("folders_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_pages_fk" FOREIGN KEY ("service_pages_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_llm_instructions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero_stats" ADD CONSTRAINT "homepage_blocks_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero" ADD CONSTRAINT "homepage_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_intro_columns" ADD CONSTRAINT "homepage_blocks_intro_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_intro" ADD CONSTRAINT "homepage_blocks_intro_character_image_id_media_id_fk" FOREIGN KEY ("character_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_intro" ADD CONSTRAINT "homepage_blocks_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_image_break" ADD CONSTRAINT "homepage_blocks_image_break_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_image_break" ADD CONSTRAINT "homepage_blocks_image_break_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_services" ADD CONSTRAINT "homepage_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_case_studies" ADD CONSTRAINT "homepage_blocks_case_studies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_testimonial" ADD CONSTRAINT "homepage_blocks_testimonial_testimonial_id_testimonials_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_testimonial" ADD CONSTRAINT "homepage_blocks_testimonial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_insights" ADD CONSTRAINT "homepage_blocks_insights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta" ADD CONSTRAINT "homepage_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_hero_stats" ADD CONSTRAINT "_homepage_v_blocks_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_hero" ADD CONSTRAINT "_homepage_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_intro_columns" ADD CONSTRAINT "_homepage_v_blocks_intro_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_intro" ADD CONSTRAINT "_homepage_v_blocks_intro_character_image_id_media_id_fk" FOREIGN KEY ("character_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_intro" ADD CONSTRAINT "_homepage_v_blocks_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_image_break" ADD CONSTRAINT "_homepage_v_blocks_image_break_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_image_break" ADD CONSTRAINT "_homepage_v_blocks_image_break_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_services" ADD CONSTRAINT "_homepage_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_case_studies" ADD CONSTRAINT "_homepage_v_blocks_case_studies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_testimonial" ADD CONSTRAINT "_homepage_v_blocks_testimonial_testimonial_id_testimonials_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_testimonial" ADD CONSTRAINT "_homepage_v_blocks_testimonial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_insights" ADD CONSTRAINT "_homepage_v_blocks_insights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_cta" ADD CONSTRAINT "_homepage_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "admins_sessions_order_idx" ON "admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");
  CREATE INDEX "admins_rels_order_idx" ON "admins_rels" USING btree ("order");
  CREATE INDEX "admins_rels_parent_idx" ON "admins_rels" USING btree ("parent_id");
  CREATE INDEX "admins_rels_path_idx" ON "admins_rels" USING btree ("path");
  CREATE INDEX "admins_rels_admins_id_idx" ON "admins_rels" USING btree ("admins_id");
  CREATE INDEX "_admins_v_version_sessions_order_idx" ON "_admins_v_version_sessions" USING btree ("_order");
  CREATE INDEX "_admins_v_version_sessions_parent_id_idx" ON "_admins_v_version_sessions" USING btree ("_parent_id");
  CREATE INDEX "_admins_v_parent_idx" ON "_admins_v" USING btree ("parent_id");
  CREATE INDEX "_admins_v_version_version_updated_at_idx" ON "_admins_v" USING btree ("version_updated_at");
  CREATE INDEX "_admins_v_version_version_created_at_idx" ON "_admins_v" USING btree ("version_created_at");
  CREATE INDEX "_admins_v_version_version_email_idx" ON "_admins_v" USING btree ("version_email");
  CREATE INDEX "_admins_v_created_at_idx" ON "_admins_v" USING btree ("created_at");
  CREATE INDEX "_admins_v_updated_at_idx" ON "_admins_v" USING btree ("updated_at");
  CREATE INDEX "_admins_v_rels_order_idx" ON "_admins_v_rels" USING btree ("order");
  CREATE INDEX "_admins_v_rels_parent_idx" ON "_admins_v_rels" USING btree ("parent_id");
  CREATE INDEX "_admins_v_rels_path_idx" ON "_admins_v_rels" USING btree ("path");
  CREATE INDEX "_admins_v_rels_admins_id_idx" ON "_admins_v_rels" USING btree ("admins_id");
  CREATE INDEX "media__h_folders_idx" ON "media" USING btree ("_h_folders_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_original_original_filename_idx" ON "media" USING btree ("original_filename");
  CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
  CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
  CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
  CREATE INDEX "media_rels_tags_id_idx" ON "media_rels" USING btree ("tags_id");
  CREATE INDEX "media_rels_admins_id_idx" ON "media_rels" USING btree ("admins_id");
  CREATE INDEX "_media_v_parent_idx" ON "_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_version__h_folders_idx" ON "_media_v" USING btree ("version__h_folders_id");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version_filename_idx" ON "_media_v" USING btree ("version_filename");
  CREATE INDEX "_media_v_version_original_version_original_filename_idx" ON "_media_v" USING btree ("version_original_filename");
  CREATE INDEX "_media_v_created_at_idx" ON "_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "_media_v" USING btree ("updated_at");
  CREATE INDEX "_media_v_rels_order_idx" ON "_media_v_rels" USING btree ("order");
  CREATE INDEX "_media_v_rels_parent_idx" ON "_media_v_rels" USING btree ("parent_id");
  CREATE INDEX "_media_v_rels_path_idx" ON "_media_v_rels" USING btree ("path");
  CREATE INDEX "_media_v_rels_tags_id_idx" ON "_media_v_rels" USING btree ("tags_id");
  CREATE INDEX "_media_v_rels_admins_id_idx" ON "_media_v_rels" USING btree ("admins_id");
  CREATE INDEX "folders__h_folders_idx" ON "folders" USING btree ("_h_folders_id");
  CREATE INDEX "folders_updated_at_idx" ON "folders" USING btree ("updated_at");
  CREATE INDEX "folders_created_at_idx" ON "folders" USING btree ("created_at");
  CREATE INDEX "folders_rels_order_idx" ON "folders_rels" USING btree ("order");
  CREATE INDEX "folders_rels_parent_idx" ON "folders_rels" USING btree ("parent_id");
  CREATE INDEX "folders_rels_path_idx" ON "folders_rels" USING btree ("path");
  CREATE INDEX "folders_rels_admins_id_idx" ON "folders_rels" USING btree ("admins_id");
  CREATE INDEX "_folders_v_parent_idx" ON "_folders_v" USING btree ("parent_id");
  CREATE INDEX "_folders_v_version_version__h_folders_idx" ON "_folders_v" USING btree ("version__h_folders_id");
  CREATE INDEX "_folders_v_version_version_updated_at_idx" ON "_folders_v" USING btree ("version_updated_at");
  CREATE INDEX "_folders_v_version_version_created_at_idx" ON "_folders_v" USING btree ("version_created_at");
  CREATE INDEX "_folders_v_created_at_idx" ON "_folders_v" USING btree ("created_at");
  CREATE INDEX "_folders_v_updated_at_idx" ON "_folders_v" USING btree ("updated_at");
  CREATE INDEX "_folders_v_rels_order_idx" ON "_folders_v_rels" USING btree ("order");
  CREATE INDEX "_folders_v_rels_parent_idx" ON "_folders_v_rels" USING btree ("parent_id");
  CREATE INDEX "_folders_v_rels_path_idx" ON "_folders_v_rels" USING btree ("path");
  CREATE INDEX "_folders_v_rels_admins_id_idx" ON "_folders_v_rels" USING btree ("admins_id");
  CREATE INDEX "tags__h_tags_idx" ON "tags" USING btree ("_h_tags_id");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "tags_rels_order_idx" ON "tags_rels" USING btree ("order");
  CREATE INDEX "tags_rels_parent_idx" ON "tags_rels" USING btree ("parent_id");
  CREATE INDEX "tags_rels_path_idx" ON "tags_rels" USING btree ("path");
  CREATE INDEX "tags_rels_admins_id_idx" ON "tags_rels" USING btree ("admins_id");
  CREATE INDEX "_tags_v_parent_idx" ON "_tags_v" USING btree ("parent_id");
  CREATE INDEX "_tags_v_version_version__h_tags_idx" ON "_tags_v" USING btree ("version__h_tags_id");
  CREATE INDEX "_tags_v_version_version_updated_at_idx" ON "_tags_v" USING btree ("version_updated_at");
  CREATE INDEX "_tags_v_version_version_created_at_idx" ON "_tags_v" USING btree ("version_created_at");
  CREATE INDEX "_tags_v_created_at_idx" ON "_tags_v" USING btree ("created_at");
  CREATE INDEX "_tags_v_updated_at_idx" ON "_tags_v" USING btree ("updated_at");
  CREATE INDEX "_tags_v_rels_order_idx" ON "_tags_v_rels" USING btree ("order");
  CREATE INDEX "_tags_v_rels_parent_idx" ON "_tags_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tags_v_rels_path_idx" ON "_tags_v_rels" USING btree ("path");
  CREATE INDEX "_tags_v_rels_admins_id_idx" ON "_tags_v_rels" USING btree ("admins_id");
  CREATE INDEX "services_capabilities_order_idx" ON "services_capabilities" USING btree ("_order");
  CREATE INDEX "services_capabilities_parent_id_idx" ON "services_capabilities" USING btree ("_parent_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_admins_id_idx" ON "services_rels" USING btree ("admins_id");
  CREATE INDEX "_services_v_version_capabilities_order_idx" ON "_services_v_version_capabilities" USING btree ("_order");
  CREATE INDEX "_services_v_version_capabilities_parent_id_idx" ON "_services_v_version_capabilities" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_rels_order_idx" ON "_services_v_rels" USING btree ("order");
  CREATE INDEX "_services_v_rels_parent_idx" ON "_services_v_rels" USING btree ("parent_id");
  CREATE INDEX "_services_v_rels_path_idx" ON "_services_v_rels" USING btree ("path");
  CREATE INDEX "_services_v_rels_admins_id_idx" ON "_services_v_rels" USING btree ("admins_id");
  CREATE INDEX "case_studies_methodology_order_idx" ON "case_studies_methodology" USING btree ("_order");
  CREATE INDEX "case_studies_methodology_parent_id_idx" ON "case_studies_methodology" USING btree ("_parent_id");
  CREATE INDEX "case_studies_artifact_idx" ON "case_studies" USING btree ("artifact_id");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies_rels_order_idx" ON "case_studies_rels" USING btree ("order");
  CREATE INDEX "case_studies_rels_parent_idx" ON "case_studies_rels" USING btree ("parent_id");
  CREATE INDEX "case_studies_rels_path_idx" ON "case_studies_rels" USING btree ("path");
  CREATE INDEX "case_studies_rels_admins_id_idx" ON "case_studies_rels" USING btree ("admins_id");
  CREATE INDEX "_case_studies_v_version_methodology_order_idx" ON "_case_studies_v_version_methodology" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_methodology_parent_id_idx" ON "_case_studies_v_version_methodology" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_parent_idx" ON "_case_studies_v" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_version_artifact_idx" ON "_case_studies_v" USING btree ("version_artifact_id");
  CREATE INDEX "_case_studies_v_version_version_updated_at_idx" ON "_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_studies_v_version_version_created_at_idx" ON "_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_v_updated_at_idx" ON "_case_studies_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_v_rels_order_idx" ON "_case_studies_v_rels" USING btree ("order");
  CREATE INDEX "_case_studies_v_rels_parent_idx" ON "_case_studies_v_rels" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_rels_path_idx" ON "_case_studies_v_rels" USING btree ("path");
  CREATE INDEX "_case_studies_v_rels_admins_id_idx" ON "_case_studies_v_rels" USING btree ("admins_id");
  CREATE INDEX "insights_updated_at_idx" ON "insights" USING btree ("updated_at");
  CREATE INDEX "insights_created_at_idx" ON "insights" USING btree ("created_at");
  CREATE INDEX "insights_rels_order_idx" ON "insights_rels" USING btree ("order");
  CREATE INDEX "insights_rels_parent_idx" ON "insights_rels" USING btree ("parent_id");
  CREATE INDEX "insights_rels_path_idx" ON "insights_rels" USING btree ("path");
  CREATE INDEX "insights_rels_admins_id_idx" ON "insights_rels" USING btree ("admins_id");
  CREATE INDEX "_insights_v_parent_idx" ON "_insights_v" USING btree ("parent_id");
  CREATE INDEX "_insights_v_version_version_updated_at_idx" ON "_insights_v" USING btree ("version_updated_at");
  CREATE INDEX "_insights_v_version_version_created_at_idx" ON "_insights_v" USING btree ("version_created_at");
  CREATE INDEX "_insights_v_created_at_idx" ON "_insights_v" USING btree ("created_at");
  CREATE INDEX "_insights_v_updated_at_idx" ON "_insights_v" USING btree ("updated_at");
  CREATE INDEX "_insights_v_rels_order_idx" ON "_insights_v_rels" USING btree ("order");
  CREATE INDEX "_insights_v_rels_parent_idx" ON "_insights_v_rels" USING btree ("parent_id");
  CREATE INDEX "_insights_v_rels_path_idx" ON "_insights_v_rels" USING btree ("path");
  CREATE INDEX "_insights_v_rels_admins_id_idx" ON "_insights_v_rels" USING btree ("admins_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials_rels_order_idx" ON "testimonials_rels" USING btree ("order");
  CREATE INDEX "testimonials_rels_parent_idx" ON "testimonials_rels" USING btree ("parent_id");
  CREATE INDEX "testimonials_rels_path_idx" ON "testimonials_rels" USING btree ("path");
  CREATE INDEX "testimonials_rels_admins_id_idx" ON "testimonials_rels" USING btree ("admins_id");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_rels_order_idx" ON "_testimonials_v_rels" USING btree ("order");
  CREATE INDEX "_testimonials_v_rels_parent_idx" ON "_testimonials_v_rels" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_rels_path_idx" ON "_testimonials_v_rels" USING btree ("path");
  CREATE INDEX "_testimonials_v_rels_admins_id_idx" ON "_testimonials_v_rels" USING btree ("admins_id");
  CREATE INDEX "service_pages_capabilities_order_idx" ON "service_pages_capabilities" USING btree ("_order");
  CREATE INDEX "service_pages_capabilities_parent_id_idx" ON "service_pages_capabilities" USING btree ("_parent_id");
  CREATE INDEX "service_pages_approach_steps_order_idx" ON "service_pages_approach_steps" USING btree ("_order");
  CREATE INDEX "service_pages_approach_steps_parent_id_idx" ON "service_pages_approach_steps" USING btree ("_parent_id");
  CREATE INDEX "service_pages_outcomes_order_idx" ON "service_pages_outcomes" USING btree ("_order");
  CREATE INDEX "service_pages_outcomes_parent_id_idx" ON "service_pages_outcomes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "service_pages_slug_idx" ON "service_pages" USING btree ("slug");
  CREATE INDEX "service_pages_updated_at_idx" ON "service_pages" USING btree ("updated_at");
  CREATE INDEX "service_pages_created_at_idx" ON "service_pages" USING btree ("created_at");
  CREATE INDEX "service_pages__status_idx" ON "service_pages" USING btree ("_status");
  CREATE INDEX "service_pages_rels_order_idx" ON "service_pages_rels" USING btree ("order");
  CREATE INDEX "service_pages_rels_parent_idx" ON "service_pages_rels" USING btree ("parent_id");
  CREATE INDEX "service_pages_rels_path_idx" ON "service_pages_rels" USING btree ("path");
  CREATE INDEX "service_pages_rels_admins_id_idx" ON "service_pages_rels" USING btree ("admins_id");
  CREATE INDEX "_service_pages_v_version_capabilities_order_idx" ON "_service_pages_v_version_capabilities" USING btree ("_order");
  CREATE INDEX "_service_pages_v_version_capabilities_parent_id_idx" ON "_service_pages_v_version_capabilities" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_version_approach_steps_order_idx" ON "_service_pages_v_version_approach_steps" USING btree ("_order");
  CREATE INDEX "_service_pages_v_version_approach_steps_parent_id_idx" ON "_service_pages_v_version_approach_steps" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_version_outcomes_order_idx" ON "_service_pages_v_version_outcomes" USING btree ("_order");
  CREATE INDEX "_service_pages_v_version_outcomes_parent_id_idx" ON "_service_pages_v_version_outcomes" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_parent_idx" ON "_service_pages_v" USING btree ("parent_id");
  CREATE INDEX "_service_pages_v_version_version_slug_idx" ON "_service_pages_v" USING btree ("version_slug");
  CREATE INDEX "_service_pages_v_version_version_updated_at_idx" ON "_service_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_service_pages_v_version_version_created_at_idx" ON "_service_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_service_pages_v_version_version__status_idx" ON "_service_pages_v" USING btree ("version__status");
  CREATE INDEX "_service_pages_v_created_at_idx" ON "_service_pages_v" USING btree ("created_at");
  CREATE INDEX "_service_pages_v_updated_at_idx" ON "_service_pages_v" USING btree ("updated_at");
  CREATE INDEX "_service_pages_v_latest_idx" ON "_service_pages_v" USING btree ("latest");
  CREATE INDEX "_service_pages_v_autosave_idx" ON "_service_pages_v" USING btree ("autosave");
  CREATE INDEX "_service_pages_v_rels_order_idx" ON "_service_pages_v_rels" USING btree ("order");
  CREATE INDEX "_service_pages_v_rels_parent_idx" ON "_service_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_service_pages_v_rels_path_idx" ON "_service_pages_v_rels" USING btree ("path");
  CREATE INDEX "_service_pages_v_rels_admins_id_idx" ON "_service_pages_v_rels" USING btree ("admins_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("folders_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_insights_id_idx" ON "payload_locked_documents_rels" USING btree ("insights_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_service_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("service_pages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_entity_slug_idx" ON "payload_llm_instructions" USING btree ("entity_slug");
  CREATE INDEX "payload_llm_instructions_updated_at_idx" ON "payload_llm_instructions" USING btree ("updated_at");
  CREATE INDEX "payload_llm_instructions_created_at_idx" ON "payload_llm_instructions" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_rels_order_idx" ON "payload_llm_instructions_rels" USING btree ("order");
  CREATE INDEX "payload_llm_instructions_rels_parent_idx" ON "payload_llm_instructions_rels" USING btree ("parent_id");
  CREATE INDEX "payload_llm_instructions_rels_path_idx" ON "payload_llm_instructions_rels" USING btree ("path");
  CREATE INDEX "payload_llm_instructions_rels_admins_id_idx" ON "payload_llm_instructions_rels" USING btree ("admins_id");
  CREATE INDEX "homepage_blocks_hero_stats_order_idx" ON "homepage_blocks_hero_stats" USING btree ("_order");
  CREATE INDEX "homepage_blocks_hero_stats_parent_id_idx" ON "homepage_blocks_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_hero_order_idx" ON "homepage_blocks_hero" USING btree ("_order");
  CREATE INDEX "homepage_blocks_hero_parent_id_idx" ON "homepage_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_hero_path_idx" ON "homepage_blocks_hero" USING btree ("_path");
  CREATE INDEX "homepage_blocks_intro_columns_order_idx" ON "homepage_blocks_intro_columns" USING btree ("_order");
  CREATE INDEX "homepage_blocks_intro_columns_parent_id_idx" ON "homepage_blocks_intro_columns" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_intro_order_idx" ON "homepage_blocks_intro" USING btree ("_order");
  CREATE INDEX "homepage_blocks_intro_parent_id_idx" ON "homepage_blocks_intro" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_intro_path_idx" ON "homepage_blocks_intro" USING btree ("_path");
  CREATE INDEX "homepage_blocks_intro_character_image_idx" ON "homepage_blocks_intro" USING btree ("character_image_id");
  CREATE INDEX "homepage_blocks_image_break_order_idx" ON "homepage_blocks_image_break" USING btree ("_order");
  CREATE INDEX "homepage_blocks_image_break_parent_id_idx" ON "homepage_blocks_image_break" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_image_break_path_idx" ON "homepage_blocks_image_break" USING btree ("_path");
  CREATE INDEX "homepage_blocks_image_break_image_idx" ON "homepage_blocks_image_break" USING btree ("image_id");
  CREATE INDEX "homepage_blocks_services_order_idx" ON "homepage_blocks_services" USING btree ("_order");
  CREATE INDEX "homepage_blocks_services_parent_id_idx" ON "homepage_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_services_path_idx" ON "homepage_blocks_services" USING btree ("_path");
  CREATE INDEX "homepage_blocks_case_studies_order_idx" ON "homepage_blocks_case_studies" USING btree ("_order");
  CREATE INDEX "homepage_blocks_case_studies_parent_id_idx" ON "homepage_blocks_case_studies" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_case_studies_path_idx" ON "homepage_blocks_case_studies" USING btree ("_path");
  CREATE INDEX "homepage_blocks_testimonial_order_idx" ON "homepage_blocks_testimonial" USING btree ("_order");
  CREATE INDEX "homepage_blocks_testimonial_parent_id_idx" ON "homepage_blocks_testimonial" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_testimonial_path_idx" ON "homepage_blocks_testimonial" USING btree ("_path");
  CREATE INDEX "homepage_blocks_testimonial_testimonial_idx" ON "homepage_blocks_testimonial" USING btree ("testimonial_id");
  CREATE INDEX "homepage_blocks_insights_order_idx" ON "homepage_blocks_insights" USING btree ("_order");
  CREATE INDEX "homepage_blocks_insights_parent_id_idx" ON "homepage_blocks_insights" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_insights_path_idx" ON "homepage_blocks_insights" USING btree ("_path");
  CREATE INDEX "homepage_blocks_cta_order_idx" ON "homepage_blocks_cta" USING btree ("_order");
  CREATE INDEX "homepage_blocks_cta_parent_id_idx" ON "homepage_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_cta_path_idx" ON "homepage_blocks_cta" USING btree ("_path");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_admins_id_idx" ON "homepage_rels" USING btree ("admins_id");
  CREATE INDEX "_homepage_v_blocks_hero_stats_order_idx" ON "_homepage_v_blocks_hero_stats" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_hero_stats_parent_id_idx" ON "_homepage_v_blocks_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_hero_order_idx" ON "_homepage_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_hero_parent_id_idx" ON "_homepage_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_hero_path_idx" ON "_homepage_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_intro_columns_order_idx" ON "_homepage_v_blocks_intro_columns" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_intro_columns_parent_id_idx" ON "_homepage_v_blocks_intro_columns" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_intro_order_idx" ON "_homepage_v_blocks_intro" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_intro_parent_id_idx" ON "_homepage_v_blocks_intro" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_intro_path_idx" ON "_homepage_v_blocks_intro" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_intro_character_image_idx" ON "_homepage_v_blocks_intro" USING btree ("character_image_id");
  CREATE INDEX "_homepage_v_blocks_image_break_order_idx" ON "_homepage_v_blocks_image_break" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_image_break_parent_id_idx" ON "_homepage_v_blocks_image_break" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_image_break_path_idx" ON "_homepage_v_blocks_image_break" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_image_break_image_idx" ON "_homepage_v_blocks_image_break" USING btree ("image_id");
  CREATE INDEX "_homepage_v_blocks_services_order_idx" ON "_homepage_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_services_parent_id_idx" ON "_homepage_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_services_path_idx" ON "_homepage_v_blocks_services" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_case_studies_order_idx" ON "_homepage_v_blocks_case_studies" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_case_studies_parent_id_idx" ON "_homepage_v_blocks_case_studies" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_case_studies_path_idx" ON "_homepage_v_blocks_case_studies" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_testimonial_order_idx" ON "_homepage_v_blocks_testimonial" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_testimonial_parent_id_idx" ON "_homepage_v_blocks_testimonial" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_testimonial_path_idx" ON "_homepage_v_blocks_testimonial" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_testimonial_testimonial_idx" ON "_homepage_v_blocks_testimonial" USING btree ("testimonial_id");
  CREATE INDEX "_homepage_v_blocks_insights_order_idx" ON "_homepage_v_blocks_insights" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_insights_parent_id_idx" ON "_homepage_v_blocks_insights" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_insights_path_idx" ON "_homepage_v_blocks_insights" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_cta_order_idx" ON "_homepage_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_cta_parent_id_idx" ON "_homepage_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_cta_path_idx" ON "_homepage_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_admins_id_idx" ON "_homepage_v_rels" USING btree ("admins_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "admins_sessions" CASCADE;
  DROP TABLE "admins" CASCADE;
  DROP TABLE "admins_rels" CASCADE;
  DROP TABLE "_admins_v_version_sessions" CASCADE;
  DROP TABLE "_admins_v" CASCADE;
  DROP TABLE "_admins_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_rels" CASCADE;
  DROP TABLE "_media_v" CASCADE;
  DROP TABLE "_media_v_rels" CASCADE;
  DROP TABLE "folders" CASCADE;
  DROP TABLE "folders_rels" CASCADE;
  DROP TABLE "_folders_v" CASCADE;
  DROP TABLE "_folders_v_rels" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "tags_rels" CASCADE;
  DROP TABLE "_tags_v" CASCADE;
  DROP TABLE "_tags_v_rels" CASCADE;
  DROP TABLE "services_capabilities" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "_services_v_version_capabilities" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_rels" CASCADE;
  DROP TABLE "case_studies_methodology" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_rels" CASCADE;
  DROP TABLE "_case_studies_v_version_methodology" CASCADE;
  DROP TABLE "_case_studies_v" CASCADE;
  DROP TABLE "_case_studies_v_rels" CASCADE;
  DROP TABLE "insights" CASCADE;
  DROP TABLE "insights_rels" CASCADE;
  DROP TABLE "_insights_v" CASCADE;
  DROP TABLE "_insights_v_rels" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_rels" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "_testimonials_v_rels" CASCADE;
  DROP TABLE "service_pages_capabilities" CASCADE;
  DROP TABLE "service_pages_approach_steps" CASCADE;
  DROP TABLE "service_pages_outcomes" CASCADE;
  DROP TABLE "service_pages" CASCADE;
  DROP TABLE "service_pages_rels" CASCADE;
  DROP TABLE "_service_pages_v_version_capabilities" CASCADE;
  DROP TABLE "_service_pages_v_version_approach_steps" CASCADE;
  DROP TABLE "_service_pages_v_version_outcomes" CASCADE;
  DROP TABLE "_service_pages_v" CASCADE;
  DROP TABLE "_service_pages_v_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "payload_llm_instructions" CASCADE;
  DROP TABLE "payload_llm_instructions_rels" CASCADE;
  DROP TABLE "homepage_blocks_hero_stats" CASCADE;
  DROP TABLE "homepage_blocks_hero" CASCADE;
  DROP TABLE "homepage_blocks_intro_columns" CASCADE;
  DROP TABLE "homepage_blocks_intro" CASCADE;
  DROP TABLE "homepage_blocks_image_break" CASCADE;
  DROP TABLE "homepage_blocks_services" CASCADE;
  DROP TABLE "homepage_blocks_case_studies" CASCADE;
  DROP TABLE "homepage_blocks_testimonial" CASCADE;
  DROP TABLE "homepage_blocks_insights" CASCADE;
  DROP TABLE "homepage_blocks_cta" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "_homepage_v_blocks_hero_stats" CASCADE;
  DROP TABLE "_homepage_v_blocks_hero" CASCADE;
  DROP TABLE "_homepage_v_blocks_intro_columns" CASCADE;
  DROP TABLE "_homepage_v_blocks_intro" CASCADE;
  DROP TABLE "_homepage_v_blocks_image_break" CASCADE;
  DROP TABLE "_homepage_v_blocks_services" CASCADE;
  DROP TABLE "_homepage_v_blocks_case_studies" CASCADE;
  DROP TABLE "_homepage_v_blocks_testimonial" CASCADE;
  DROP TABLE "_homepage_v_blocks_insights" CASCADE;
  DROP TABLE "_homepage_v_blocks_cta" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_rels" CASCADE;
  DROP TYPE "public"."enum_service_pages_status";
  DROP TYPE "public"."enum__service_pages_v_version_status";
  DROP TYPE "public"."enum_payload_llm_instructions_entity_type";
  DROP TYPE "public"."enum_homepage_blocks_intro_spacing";
  DROP TYPE "public"."enum_homepage_blocks_image_break_overlay";
  DROP TYPE "public"."enum_homepage_blocks_services_theme";
  DROP TYPE "public"."enum_homepage_blocks_services_spacing";
  DROP TYPE "public"."enum_homepage_blocks_case_studies_spacing";
  DROP TYPE "public"."enum_homepage_blocks_testimonial_theme";
  DROP TYPE "public"."enum_homepage_blocks_testimonial_spacing";
  DROP TYPE "public"."enum_homepage_blocks_insights_spacing";
  DROP TYPE "public"."enum_homepage_blocks_cta_spacing";
  DROP TYPE "public"."enum__homepage_v_blocks_intro_spacing";
  DROP TYPE "public"."enum__homepage_v_blocks_image_break_overlay";
  DROP TYPE "public"."enum__homepage_v_blocks_services_theme";
  DROP TYPE "public"."enum__homepage_v_blocks_services_spacing";
  DROP TYPE "public"."enum__homepage_v_blocks_case_studies_spacing";
  DROP TYPE "public"."enum__homepage_v_blocks_testimonial_theme";
  DROP TYPE "public"."enum__homepage_v_blocks_testimonial_spacing";
  DROP TYPE "public"."enum__homepage_v_blocks_insights_spacing";
  DROP TYPE "public"."enum__homepage_v_blocks_cta_spacing";`)
}
