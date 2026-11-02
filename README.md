# Fox Consulting Group — foxgr.com

The Fox Consulting Group site: Next.js 16 + Payload CMS 4 (beta) + Tailwind 4, running on Postgres (Supabase) and deployable to Vercel.

Originally built in Figma Make, then pulled out into a standalone repo. The design, section builder, and all CMS content came along; the Figma-hosted backend did not.

## What's in here

- **Homepage**: assembled from Payload blocks (hero, intro, image break, services, case studies, testimonial, insights, CTA). Edit and reorder sections in **Website → Homepage Builder**, with live preview.
- **What We Do pages**: `/what-we-do/[slug]`, one per document in **What We Do Pages**. These have drafts and autosave.
- **Collections**: Services, Case Studies, Insights, Testimonials, Media (with folders and tags).
- `seed/content.json`: every piece of content exported from the Make site on 2026-11-02.

## Local setup

Requires Node 24.22+ and pnpm.

```sh
cp .env.example .env        # fill in DATABASE_URL + PAYLOAD_SECRET at minimum
pnpm install
pnpm migrate                # creates the tables
pnpm seed                   # loads the exported content
pnpm dev
```

Then open http://localhost:3000/admin. The first visit asks you to create the first admin account.

`pnpm seed --reset` wipes the website collections and reseeds.

## Deploying (Vercel + Supabase)

1. **Supabase**
   - Create a project.
   - Copy the **Transaction pooler** connection string to `DATABASE_URL`.
   - Create a **public** Storage bucket called `media`.
   - Generate S3 access keys under Storage → S3 Connection.
2. **Vercel**
   - Import the repo.
   - Add every variable from `.env.example`. Set `NEXT_PUBLIC_SITE_URL` to the real domain, and fill in all the `S3_*` values; without them, uploads go to Vercel's ephemeral disk and vanish.
   - The build command is already set in `vercel.json` (`pnpm ci`). It runs migrations, then `next build`.
3. **Seed once** against the production database:
   ```sh
   DATABASE_URL=... PAYLOAD_SECRET=... S3_...=... pnpm seed
   ```

## Changing the schema

Edit a collection or block, then:

```sh
pnpm generate:types
pnpm migrate:create <name>   # commit the new file in src/migrations
```

Vercel applies it on the next deploy.

## Loose ends from the Make export

- **Case-study artifact images.** These lived in Figma's cloud storage, so they aren't in the repo. Either upload them in Media and attach them to each case study, or drop them into `seed/media/` as `cms-replatforming-artifact-original.jpg` and `foodservice-analytics-artifact-original.jpg` and run `pnpm seed --reset`. Until then, the case studies render without the image panel.
- **Figma SSO is gone.** Admin login is now standard email/password.
- **Payload 4 is still in beta.** Versions are pinned to `4.0.0-beta.4` (what Make generated), so upgrade deliberately.
