import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_media_content_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_media_content_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_media_content_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_media_content_media_shape" AS ENUM('portrait', 'cover', 'landscape', 'square');
  CREATE TYPE "public"."enum_pages_blocks_media_content_padding_top" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_media_content_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_media_content_background" AS ENUM('none', 'muted', 'brand', 'inverted');
  CREATE TYPE "public"."enum_pages_blocks_quote_style" AS ENUM('centered', 'epigraph');
  CREATE TYPE "public"."enum_pages_blocks_quote_padding_top" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_quote_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_quote_background" AS ENUM('none', 'muted', 'brand', 'inverted');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_style" AS ENUM('icons', 'numbered', 'cards', 'list');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_style" AS ENUM('grid', 'featured');
  CREATE TYPE "public"."enum_pages_blocks_pricing_table_style" AS ENUM('cards', 'contents');
  CREATE TYPE "public"."enum__pages_v_blocks_media_content_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_media_content_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_media_content_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_media_content_media_shape" AS ENUM('portrait', 'cover', 'landscape', 'square');
  CREATE TYPE "public"."enum__pages_v_blocks_media_content_padding_top" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_media_content_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_media_content_background" AS ENUM('none', 'muted', 'brand', 'inverted');
  CREATE TYPE "public"."enum__pages_v_blocks_quote_style" AS ENUM('centered', 'epigraph');
  CREATE TYPE "public"."enum__pages_v_blocks_quote_padding_top" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_quote_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_quote_background" AS ENUM('none', 'muted', 'brand', 'inverted');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_style" AS ENUM('icons', 'numbered', 'cards', 'list');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_style" AS ENUM('grid', 'featured');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_table_style" AS ENUM('cards', 'contents');
  CREATE TYPE "public"."enum_header_cta_type" AS ENUM('reference', 'custom');
  ALTER TYPE "public"."enum_pages_blocks_cta_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_content_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_media_block_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_form_block_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_feature_grid_items_icon" ADD VALUE 'book' BEFORE 'clock';
  ALTER TYPE "public"."enum_pages_blocks_feature_grid_items_icon" ADD VALUE 'compass' BEFORE 'globe';
  ALTER TYPE "public"."enum_pages_blocks_feature_grid_items_icon" ADD VALUE 'feather' BEFORE 'globe';
  ALTER TYPE "public"."enum_pages_blocks_feature_grid_items_icon" ADD VALUE 'message' BEFORE 'rocket';
  ALTER TYPE "public"."enum_pages_blocks_feature_grid_items_icon" ADD VALUE 'pen' BEFORE 'rocket';
  ALTER TYPE "public"."enum_pages_blocks_feature_grid_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_stats_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_testimonials_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_logo_cloud_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_pricing_table_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_gallery_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_faq_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_legal_notice_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_privacy_policy_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_archive_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_paid_download_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_blocks_terms_of_sale_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE 'split';
  ALTER TYPE "public"."enum__pages_v_blocks_cta_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_content_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_media_block_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_form_block_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_feature_grid_items_icon" ADD VALUE 'book' BEFORE 'clock';
  ALTER TYPE "public"."enum__pages_v_blocks_feature_grid_items_icon" ADD VALUE 'compass' BEFORE 'globe';
  ALTER TYPE "public"."enum__pages_v_blocks_feature_grid_items_icon" ADD VALUE 'feather' BEFORE 'globe';
  ALTER TYPE "public"."enum__pages_v_blocks_feature_grid_items_icon" ADD VALUE 'message' BEFORE 'rocket';
  ALTER TYPE "public"."enum__pages_v_blocks_feature_grid_items_icon" ADD VALUE 'pen' BEFORE 'rocket';
  ALTER TYPE "public"."enum__pages_v_blocks_feature_grid_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_stats_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_testimonials_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_logo_cloud_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_pricing_table_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_gallery_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_faq_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_legal_notice_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_privacy_policy_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_archive_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_paid_download_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_blocks_terms_of_sale_background" ADD VALUE 'inverted';
  ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE 'split';
  CREATE TABLE "pages_blocks_media_content_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_media_content_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_appearance" "enum_pages_blocks_media_content_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_media_content_links_locales" (
  	"link_url" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_media_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"media_position" "enum_pages_blocks_media_content_media_position" DEFAULT 'left',
  	"media_shape" "enum_pages_blocks_media_content_media_shape" DEFAULT 'portrait',
  	"padding_top" "enum_pages_blocks_media_content_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum_pages_blocks_media_content_padding_bottom" DEFAULT 'md',
  	"background" "enum_pages_blocks_media_content_background" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_content_locales" (
  	"eyebrow" varchar,
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_quote_style" DEFAULT 'centered',
  	"padding_top" "enum_pages_blocks_quote_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum_pages_blocks_quote_padding_bottom" DEFAULT 'md',
  	"background" "enum_pages_blocks_quote_background" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_quote_locales" (
  	"quote" varchar,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_media_content_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_media_content_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_appearance" "enum__pages_v_blocks_media_content_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_content_links_locales" (
  	"link_url" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_media_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"media_position" "enum__pages_v_blocks_media_content_media_position" DEFAULT 'left',
  	"media_shape" "enum__pages_v_blocks_media_content_media_shape" DEFAULT 'portrait',
  	"padding_top" "enum__pages_v_blocks_media_content_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum__pages_v_blocks_media_content_padding_bottom" DEFAULT 'md',
  	"background" "enum__pages_v_blocks_media_content_background" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_content_locales" (
  	"eyebrow" varchar,
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_quote_style" DEFAULT 'centered',
  	"padding_top" "enum__pages_v_blocks_quote_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum__pages_v_blocks_quote_padding_bottom" DEFAULT 'md',
  	"background" "enum__pages_v_blocks_quote_background" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_quote_locales" (
  	"quote" varchar,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "header_locales" (
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_content" ADD COLUMN "drop_cap" boolean;
  ALTER TABLE "pages_blocks_feature_grid" ADD COLUMN "style" "enum_pages_blocks_feature_grid_style" DEFAULT 'icons';
  ALTER TABLE "pages_blocks_feature_grid_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_stats_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_testimonials" ADD COLUMN "style" "enum_pages_blocks_testimonials_style" DEFAULT 'grid';
  ALTER TABLE "pages_blocks_testimonials_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_logo_cloud_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_pricing_table_plans_locales" ADD COLUMN "badge" varchar;
  ALTER TABLE "pages_blocks_pricing_table_plans_locales" ADD COLUMN "audience" varchar;
  ALTER TABLE "pages_blocks_pricing_table" ADD COLUMN "style" "enum_pages_blocks_pricing_table_style" DEFAULT 'cards';
  ALTER TABLE "pages_blocks_pricing_table_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_gallery_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_faq_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_paid_download_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "drop_cap" boolean;
  ALTER TABLE "_pages_v_blocks_feature_grid" ADD COLUMN "style" "enum__pages_v_blocks_feature_grid_style" DEFAULT 'icons';
  ALTER TABLE "_pages_v_blocks_feature_grid_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_stats_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD COLUMN "style" "enum__pages_v_blocks_testimonials_style" DEFAULT 'grid';
  ALTER TABLE "_pages_v_blocks_testimonials_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_logo_cloud_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_pricing_table_plans_locales" ADD COLUMN "badge" varchar;
  ALTER TABLE "_pages_v_blocks_pricing_table_plans_locales" ADD COLUMN "audience" varchar;
  ALTER TABLE "_pages_v_blocks_pricing_table" ADD COLUMN "style" "enum__pages_v_blocks_pricing_table_style" DEFAULT 'cards';
  ALTER TABLE "_pages_v_blocks_pricing_table_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_gallery_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_faq_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_paid_download_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_eyebrow" varchar;
  ALTER TABLE "header" ADD COLUMN "enable_cta" boolean;
  ALTER TABLE "header" ADD COLUMN "cta_type" "enum_header_cta_type" DEFAULT 'reference';
  ALTER TABLE "header" ADD COLUMN "cta_new_tab" boolean;
  ALTER TABLE "pages_blocks_media_content_links" ADD CONSTRAINT "pages_blocks_media_content_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_content_links_locales" ADD CONSTRAINT "pages_blocks_media_content_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_content_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_content" ADD CONSTRAINT "pages_blocks_media_content_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_content" ADD CONSTRAINT "pages_blocks_media_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_content_locales" ADD CONSTRAINT "pages_blocks_media_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote" ADD CONSTRAINT "pages_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote_locales" ADD CONSTRAINT "pages_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_content_links" ADD CONSTRAINT "_pages_v_blocks_media_content_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_content_links_locales" ADD CONSTRAINT "_pages_v_blocks_media_content_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_content_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_content" ADD CONSTRAINT "_pages_v_blocks_media_content_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_content" ADD CONSTRAINT "_pages_v_blocks_media_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_content_locales" ADD CONSTRAINT "_pages_v_blocks_media_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote" ADD CONSTRAINT "_pages_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote_locales" ADD CONSTRAINT "_pages_v_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_media_content_links_order_idx" ON "pages_blocks_media_content_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_content_links_parent_id_idx" ON "pages_blocks_media_content_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_media_content_links_locales_locale_parent_id_un" ON "pages_blocks_media_content_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_media_content_order_idx" ON "pages_blocks_media_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_content_parent_id_idx" ON "pages_blocks_media_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_content_path_idx" ON "pages_blocks_media_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_content_media_idx" ON "pages_blocks_media_content" USING btree ("media_id");
  CREATE UNIQUE INDEX "pages_blocks_media_content_locales_locale_parent_id_unique" ON "pages_blocks_media_content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_quote_order_idx" ON "pages_blocks_quote" USING btree ("_order");
  CREATE INDEX "pages_blocks_quote_parent_id_idx" ON "pages_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quote_path_idx" ON "pages_blocks_quote" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_quote_locales_locale_parent_id_unique" ON "pages_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_media_content_links_order_idx" ON "_pages_v_blocks_media_content_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_content_links_parent_id_idx" ON "_pages_v_blocks_media_content_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_media_content_links_locales_locale_parent_id" ON "_pages_v_blocks_media_content_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_media_content_order_idx" ON "_pages_v_blocks_media_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_content_parent_id_idx" ON "_pages_v_blocks_media_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_content_path_idx" ON "_pages_v_blocks_media_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_content_media_idx" ON "_pages_v_blocks_media_content" USING btree ("media_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_media_content_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_media_content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_quote_order_idx" ON "_pages_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_quote_parent_id_idx" ON "_pages_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_quote_path_idx" ON "_pages_v_blocks_quote" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_quote_locales_locale_parent_id_unique" ON "_pages_v_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_media_content_links" CASCADE;
  DROP TABLE "pages_blocks_media_content_links_locales" CASCADE;
  DROP TABLE "pages_blocks_media_content" CASCADE;
  DROP TABLE "pages_blocks_media_content_locales" CASCADE;
  DROP TABLE "pages_blocks_quote" CASCADE;
  DROP TABLE "pages_blocks_quote_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_media_content_links" CASCADE;
  DROP TABLE "_pages_v_blocks_media_content_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_media_content" CASCADE;
  DROP TABLE "_pages_v_blocks_media_content_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_quote" CASCADE;
  DROP TABLE "_pages_v_blocks_quote_locales" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_cta_background";
  CREATE TYPE "public"."enum_pages_blocks_cta_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_cta_background";
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_cta_background" USING "background"::"public"."enum_pages_blocks_cta_background";
  ALTER TABLE "pages_blocks_content" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_content" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_content_background";
  CREATE TYPE "public"."enum_pages_blocks_content_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_content" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_content_background";
  ALTER TABLE "pages_blocks_content" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_content_background" USING "background"::"public"."enum_pages_blocks_content_background";
  ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_media_block_background";
  CREATE TYPE "public"."enum_pages_blocks_media_block_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_media_block_background";
  ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_media_block_background" USING "background"::"public"."enum_pages_blocks_media_block_background";
  ALTER TABLE "pages_blocks_form_block" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_form_block" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_form_block_background";
  CREATE TYPE "public"."enum_pages_blocks_form_block_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_form_block" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_form_block_background";
  ALTER TABLE "pages_blocks_form_block" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_form_block_background" USING "background"::"public"."enum_pages_blocks_form_block_background";
  ALTER TABLE "pages_blocks_feature_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_feature_grid_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_items_icon" AS ENUM('clock', 'globe', 'heart', 'lightbulb', 'mail', 'rocket', 'search', 'settings', 'shield', 'sparkles', 'star', 'users', 'wrench', 'zap');
  ALTER TABLE "pages_blocks_feature_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_feature_grid_items_icon" USING "icon"::"public"."enum_pages_blocks_feature_grid_items_icon";
  ALTER TABLE "pages_blocks_feature_grid" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_feature_grid" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_feature_grid_background";
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_feature_grid" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_feature_grid_background";
  ALTER TABLE "pages_blocks_feature_grid" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_feature_grid_background" USING "background"::"public"."enum_pages_blocks_feature_grid_background";
  ALTER TABLE "pages_blocks_stats" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_stats" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_stats_background";
  CREATE TYPE "public"."enum_pages_blocks_stats_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_stats" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_stats_background";
  ALTER TABLE "pages_blocks_stats" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_stats_background" USING "background"::"public"."enum_pages_blocks_stats_background";
  ALTER TABLE "pages_blocks_testimonials" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_testimonials" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_testimonials_background";
  CREATE TYPE "public"."enum_pages_blocks_testimonials_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_testimonials" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_testimonials_background";
  ALTER TABLE "pages_blocks_testimonials" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_testimonials_background" USING "background"::"public"."enum_pages_blocks_testimonials_background";
  ALTER TABLE "pages_blocks_logo_cloud" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_logo_cloud" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_background";
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_logo_cloud" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_logo_cloud_background";
  ALTER TABLE "pages_blocks_logo_cloud" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_logo_cloud_background" USING "background"::"public"."enum_pages_blocks_logo_cloud_background";
  ALTER TABLE "pages_blocks_pricing_table" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_pricing_table" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_pricing_table_background";
  CREATE TYPE "public"."enum_pages_blocks_pricing_table_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_pricing_table" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_pricing_table_background";
  ALTER TABLE "pages_blocks_pricing_table" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_pricing_table_background" USING "background"::"public"."enum_pages_blocks_pricing_table_background";
  ALTER TABLE "pages_blocks_gallery" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_gallery" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_gallery_background";
  CREATE TYPE "public"."enum_pages_blocks_gallery_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_gallery" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_gallery_background";
  ALTER TABLE "pages_blocks_gallery" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_gallery_background" USING "background"::"public"."enum_pages_blocks_gallery_background";
  ALTER TABLE "pages_blocks_faq" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_faq" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_faq_background";
  CREATE TYPE "public"."enum_pages_blocks_faq_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_faq" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_faq_background";
  ALTER TABLE "pages_blocks_faq" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_faq_background" USING "background"::"public"."enum_pages_blocks_faq_background";
  ALTER TABLE "pages_blocks_legal_notice" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_legal_notice" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_legal_notice_background";
  CREATE TYPE "public"."enum_pages_blocks_legal_notice_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_legal_notice" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_legal_notice_background";
  ALTER TABLE "pages_blocks_legal_notice" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_legal_notice_background" USING "background"::"public"."enum_pages_blocks_legal_notice_background";
  ALTER TABLE "pages_blocks_privacy_policy" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_privacy_policy" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_privacy_policy_background";
  CREATE TYPE "public"."enum_pages_blocks_privacy_policy_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_privacy_policy" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_privacy_policy_background";
  ALTER TABLE "pages_blocks_privacy_policy" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_privacy_policy_background" USING "background"::"public"."enum_pages_blocks_privacy_policy_background";
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_archive_background";
  CREATE TYPE "public"."enum_pages_blocks_archive_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_archive_background";
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_archive_background" USING "background"::"public"."enum_pages_blocks_archive_background";
  ALTER TABLE "pages_blocks_paid_download" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_paid_download" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_paid_download_background";
  CREATE TYPE "public"."enum_pages_blocks_paid_download_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_paid_download" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_paid_download_background";
  ALTER TABLE "pages_blocks_paid_download" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_paid_download_background" USING "background"::"public"."enum_pages_blocks_paid_download_background";
  ALTER TABLE "pages_blocks_terms_of_sale" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_terms_of_sale" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_terms_of_sale_background";
  CREATE TYPE "public"."enum_pages_blocks_terms_of_sale_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "pages_blocks_terms_of_sale" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum_pages_blocks_terms_of_sale_background";
  ALTER TABLE "pages_blocks_terms_of_sale" ALTER COLUMN "background" SET DATA TYPE "public"."enum_pages_blocks_terms_of_sale_background" USING "background"::"public"."enum_pages_blocks_terms_of_sale_background";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_cta_background";
  CREATE TYPE "public"."enum__pages_v_blocks_cta_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_cta_background";
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_cta_background" USING "background"::"public"."enum__pages_v_blocks_cta_background";
  ALTER TABLE "_pages_v_blocks_content" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_content" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_content_background";
  CREATE TYPE "public"."enum__pages_v_blocks_content_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_content" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_content_background";
  ALTER TABLE "_pages_v_blocks_content" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_content_background" USING "background"::"public"."enum__pages_v_blocks_content_background";
  ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_media_block_background";
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_media_block_background";
  ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_media_block_background" USING "background"::"public"."enum__pages_v_blocks_media_block_background";
  ALTER TABLE "_pages_v_blocks_form_block" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_form_block" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_form_block_background";
  CREATE TYPE "public"."enum__pages_v_blocks_form_block_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_form_block" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_form_block_background";
  ALTER TABLE "_pages_v_blocks_form_block" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_form_block_background" USING "background"::"public"."enum__pages_v_blocks_form_block_background";
  ALTER TABLE "_pages_v_blocks_feature_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_items_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_items_icon" AS ENUM('clock', 'globe', 'heart', 'lightbulb', 'mail', 'rocket', 'search', 'settings', 'shield', 'sparkles', 'star', 'users', 'wrench', 'zap');
  ALTER TABLE "_pages_v_blocks_feature_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_feature_grid_items_icon" USING "icon"::"public"."enum__pages_v_blocks_feature_grid_items_icon";
  ALTER TABLE "_pages_v_blocks_feature_grid" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_feature_grid" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_background";
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_feature_grid" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_feature_grid_background";
  ALTER TABLE "_pages_v_blocks_feature_grid" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_feature_grid_background" USING "background"::"public"."enum__pages_v_blocks_feature_grid_background";
  ALTER TABLE "_pages_v_blocks_stats" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_stats" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_stats_background";
  CREATE TYPE "public"."enum__pages_v_blocks_stats_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_stats" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_stats_background";
  ALTER TABLE "_pages_v_blocks_stats" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_stats_background" USING "background"::"public"."enum__pages_v_blocks_stats_background";
  ALTER TABLE "_pages_v_blocks_testimonials" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_testimonials" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_background";
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_testimonials" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_testimonials_background";
  ALTER TABLE "_pages_v_blocks_testimonials" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_testimonials_background" USING "background"::"public"."enum__pages_v_blocks_testimonials_background";
  ALTER TABLE "_pages_v_blocks_logo_cloud" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_logo_cloud" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_background";
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_logo_cloud" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_logo_cloud_background";
  ALTER TABLE "_pages_v_blocks_logo_cloud" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_logo_cloud_background" USING "background"::"public"."enum__pages_v_blocks_logo_cloud_background";
  ALTER TABLE "_pages_v_blocks_pricing_table" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_pricing_table" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_pricing_table_background";
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_table_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_pricing_table" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_pricing_table_background";
  ALTER TABLE "_pages_v_blocks_pricing_table" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_pricing_table_background" USING "background"::"public"."enum__pages_v_blocks_pricing_table_background";
  ALTER TABLE "_pages_v_blocks_gallery" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_gallery" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_gallery_background";
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_gallery" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_gallery_background";
  ALTER TABLE "_pages_v_blocks_gallery" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_gallery_background" USING "background"::"public"."enum__pages_v_blocks_gallery_background";
  ALTER TABLE "_pages_v_blocks_faq" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_faq" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_faq_background";
  CREATE TYPE "public"."enum__pages_v_blocks_faq_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_faq" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_faq_background";
  ALTER TABLE "_pages_v_blocks_faq" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_faq_background" USING "background"::"public"."enum__pages_v_blocks_faq_background";
  ALTER TABLE "_pages_v_blocks_legal_notice" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_legal_notice" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_legal_notice_background";
  CREATE TYPE "public"."enum__pages_v_blocks_legal_notice_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_legal_notice" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_legal_notice_background";
  ALTER TABLE "_pages_v_blocks_legal_notice" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_legal_notice_background" USING "background"::"public"."enum__pages_v_blocks_legal_notice_background";
  ALTER TABLE "_pages_v_blocks_privacy_policy" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_privacy_policy" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_privacy_policy_background";
  CREATE TYPE "public"."enum__pages_v_blocks_privacy_policy_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_privacy_policy" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_privacy_policy_background";
  ALTER TABLE "_pages_v_blocks_privacy_policy" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_privacy_policy_background" USING "background"::"public"."enum__pages_v_blocks_privacy_policy_background";
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_archive_background";
  CREATE TYPE "public"."enum__pages_v_blocks_archive_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_archive_background";
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_archive_background" USING "background"::"public"."enum__pages_v_blocks_archive_background";
  ALTER TABLE "_pages_v_blocks_paid_download" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_paid_download" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_paid_download_background";
  CREATE TYPE "public"."enum__pages_v_blocks_paid_download_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_paid_download" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_paid_download_background";
  ALTER TABLE "_pages_v_blocks_paid_download" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_paid_download_background" USING "background"::"public"."enum__pages_v_blocks_paid_download_background";
  ALTER TABLE "_pages_v_blocks_terms_of_sale" ALTER COLUMN "background" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_terms_of_sale" ALTER COLUMN "background" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_terms_of_sale_background";
  CREATE TYPE "public"."enum__pages_v_blocks_terms_of_sale_background" AS ENUM('none', 'muted', 'brand');
  ALTER TABLE "_pages_v_blocks_terms_of_sale" ALTER COLUMN "background" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_terms_of_sale_background";
  ALTER TABLE "_pages_v_blocks_terms_of_sale" ALTER COLUMN "background" SET DATA TYPE "public"."enum__pages_v_blocks_terms_of_sale_background" USING "background"::"public"."enum__pages_v_blocks_terms_of_sale_background";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "drop_cap";
  ALTER TABLE "pages_blocks_feature_grid" DROP COLUMN "style";
  ALTER TABLE "pages_blocks_feature_grid_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_stats_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_testimonials" DROP COLUMN "style";
  ALTER TABLE "pages_blocks_testimonials_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_logo_cloud_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_pricing_table_plans_locales" DROP COLUMN "badge";
  ALTER TABLE "pages_blocks_pricing_table_plans_locales" DROP COLUMN "audience";
  ALTER TABLE "pages_blocks_pricing_table" DROP COLUMN "style";
  ALTER TABLE "pages_blocks_pricing_table_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_gallery_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_faq_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_paid_download_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "drop_cap";
  ALTER TABLE "_pages_v_blocks_feature_grid" DROP COLUMN "style";
  ALTER TABLE "_pages_v_blocks_feature_grid_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_stats_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_testimonials" DROP COLUMN "style";
  ALTER TABLE "_pages_v_blocks_testimonials_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_logo_cloud_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_pricing_table_plans_locales" DROP COLUMN "badge";
  ALTER TABLE "_pages_v_blocks_pricing_table_plans_locales" DROP COLUMN "audience";
  ALTER TABLE "_pages_v_blocks_pricing_table" DROP COLUMN "style";
  ALTER TABLE "_pages_v_blocks_pricing_table_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_gallery_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_faq_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_paid_download_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_eyebrow";
  ALTER TABLE "header" DROP COLUMN "enable_cta";
  ALTER TABLE "header" DROP COLUMN "cta_type";
  ALTER TABLE "header" DROP COLUMN "cta_new_tab";
  DROP TYPE "public"."enum_pages_blocks_media_content_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_media_content_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_media_content_media_position";
  DROP TYPE "public"."enum_pages_blocks_media_content_media_shape";
  DROP TYPE "public"."enum_pages_blocks_media_content_padding_top";
  DROP TYPE "public"."enum_pages_blocks_media_content_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_media_content_background";
  DROP TYPE "public"."enum_pages_blocks_quote_style";
  DROP TYPE "public"."enum_pages_blocks_quote_padding_top";
  DROP TYPE "public"."enum_pages_blocks_quote_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_quote_background";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_style";
  DROP TYPE "public"."enum_pages_blocks_testimonials_style";
  DROP TYPE "public"."enum_pages_blocks_pricing_table_style";
  DROP TYPE "public"."enum__pages_v_blocks_media_content_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_media_content_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_media_content_media_position";
  DROP TYPE "public"."enum__pages_v_blocks_media_content_media_shape";
  DROP TYPE "public"."enum__pages_v_blocks_media_content_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_media_content_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_media_content_background";
  DROP TYPE "public"."enum__pages_v_blocks_quote_style";
  DROP TYPE "public"."enum__pages_v_blocks_quote_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_quote_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_quote_background";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_style";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_style";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_table_style";
  DROP TYPE "public"."enum_header_cta_type";`)
}
