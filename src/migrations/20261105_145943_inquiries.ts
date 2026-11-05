import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "foxgr"."enum_inquiries_status" AS ENUM('new', 'replied', 'closed', 'spam');
  CREATE TYPE "foxgr"."enum__inquiries_v_version_status" AS ENUM('new', 'replied', 'closed', 'spam');
  CREATE TABLE "foxgr"."inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"role" varchar,
  	"topic" varchar,
  	"message" varchar NOT NULL,
  	"status" "foxgr"."enum_inquiries_status" DEFAULT 'new',
  	"page" varchar,
  	"notified" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "foxgr"."inquiries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "foxgr"."_inquiries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_email" varchar NOT NULL,
  	"version_company" varchar,
  	"version_role" varchar,
  	"version_topic" varchar,
  	"version_message" varchar NOT NULL,
  	"version_status" "foxgr"."enum__inquiries_v_version_status" DEFAULT 'new',
  	"version_page" varchar,
  	"version_notified" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "foxgr"."_inquiries_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  ALTER TABLE "foxgr"."payload_locked_documents_rels" ADD COLUMN "inquiries_id" integer;
  ALTER TABLE "foxgr"."inquiries_rels" ADD CONSTRAINT "inquiries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "foxgr"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."inquiries_rels" ADD CONSTRAINT "inquiries_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "foxgr"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_inquiries_v" ADD CONSTRAINT "_inquiries_v_parent_id_inquiries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "foxgr"."inquiries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "foxgr"."_inquiries_v_rels" ADD CONSTRAINT "_inquiries_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "foxgr"."_inquiries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "foxgr"."_inquiries_v_rels" ADD CONSTRAINT "_inquiries_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "foxgr"."admins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "inquiries_updated_at_idx" ON "foxgr"."inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "foxgr"."inquiries" USING btree ("created_at");
  CREATE INDEX "inquiries_rels_order_idx" ON "foxgr"."inquiries_rels" USING btree ("order");
  CREATE INDEX "inquiries_rels_parent_idx" ON "foxgr"."inquiries_rels" USING btree ("parent_id");
  CREATE INDEX "inquiries_rels_path_idx" ON "foxgr"."inquiries_rels" USING btree ("path");
  CREATE INDEX "inquiries_rels_admins_id_idx" ON "foxgr"."inquiries_rels" USING btree ("admins_id");
  CREATE INDEX "_inquiries_v_parent_idx" ON "foxgr"."_inquiries_v" USING btree ("parent_id");
  CREATE INDEX "_inquiries_v_version_version_updated_at_idx" ON "foxgr"."_inquiries_v" USING btree ("version_updated_at");
  CREATE INDEX "_inquiries_v_version_version_created_at_idx" ON "foxgr"."_inquiries_v" USING btree ("version_created_at");
  CREATE INDEX "_inquiries_v_created_at_idx" ON "foxgr"."_inquiries_v" USING btree ("created_at");
  CREATE INDEX "_inquiries_v_updated_at_idx" ON "foxgr"."_inquiries_v" USING btree ("updated_at");
  CREATE INDEX "_inquiries_v_rels_order_idx" ON "foxgr"."_inquiries_v_rels" USING btree ("order");
  CREATE INDEX "_inquiries_v_rels_parent_idx" ON "foxgr"."_inquiries_v_rels" USING btree ("parent_id");
  CREATE INDEX "_inquiries_v_rels_path_idx" ON "foxgr"."_inquiries_v_rels" USING btree ("path");
  CREATE INDEX "_inquiries_v_rels_admins_id_idx" ON "foxgr"."_inquiries_v_rels" USING btree ("admins_id");
  ALTER TABLE "foxgr"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "foxgr"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "foxgr"."payload_locked_documents_rels" USING btree ("inquiries_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "foxgr"."inquiries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."inquiries_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."_inquiries_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "foxgr"."_inquiries_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "foxgr"."inquiries" CASCADE;
  DROP TABLE "foxgr"."inquiries_rels" CASCADE;
  DROP TABLE "foxgr"."_inquiries_v" CASCADE;
  DROP TABLE "foxgr"."_inquiries_v_rels" CASCADE;
  ALTER TABLE "foxgr"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_inquiries_fk";
  
  DROP INDEX "foxgr"."payload_locked_documents_rels_inquiries_id_idx";
  ALTER TABLE "foxgr"."payload_locked_documents_rels" DROP COLUMN "inquiries_id";
  DROP TYPE "foxgr"."enum_inquiries_status";
  DROP TYPE "foxgr"."enum__inquiries_v_version_status";`)
}
