# Nabshy Pro UI Prototype

Premium real-estate brochure website prototype built with Next.js App Router,
TypeScript, Tailwind CSS, ESLint, Prisma ORM, PostgreSQL, and local assets.

Routes:

```text
/            Home page
/projects    English projects page
/fa/projects Persian projects page
```

## Run Locally

```bash
npm install
npm run dev
```

PostgreSQL is required for the projects pages. Create a local database, then
set `DATABASE_URL` and the private brochure directory in `.env`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
BROCHURES_DIR="./storage/brochures"
```

Useful checks:

```bash
npx prisma format
npx prisma validate
npx prisma generate
npm run lint
npm run build
```

Apply migrations and seed project cards:

```bash
npx prisma migrate dev --name add_registration_and_downloads
npx prisma db seed
```

## Replace Images

Home split-screen images live in:

```text
public/images/home/
```

Project card images live in:

```text
public/images/projects/
```

Hero media placeholder lives in:

```text
public/media/projects-hero.jpg
```

The hero component is ready to swap to a GIF, WebM, or MP4 later, but this
prototype uses a local image.

## Project Data

PostgreSQL is the runtime source of truth for project cards. The Prisma schema
is defined in:

```text
prisma/schema.prisma
```

Initial project seed data lives in:

```text
src/data/projects.json
```

That JSON file is seed-only and must not be imported by runtime pages or UI
components. Runtime reads go through the server-only project service:

```text
src/services/project.service.ts
```

The shared serializable UI shape is defined in:

```text
src/types/project.ts
```

The `Project` model stores bilingual project values in separate columns:
`titleFa`, `titleEn`, `cityFa`, `cityEn`, `developerNameFa`,
`developerNameEn`, `usageFa`, `usageEn`, `addressFa`, and `addressEn`.
Technical fields such as `slug`, `imagePath`, `brochureFile`, `isActive`,
`sortOrder`, `createdAt`, and `updatedAt` remain in PostgreSQL. Brochure
filenames are private seed data and are not sent to client components.

## Registration And Downloads

Project brochure buttons use a protected server-side flow:

```text
Registration form
  -> Server Action
  -> registration service
  -> Prisma
  -> PostgreSQL

Protected brochure request
  -> Route Handler
  -> download service
  -> Prisma
  -> private PDF file
```

The first brochure download from a browser opens the registration modal. The
user is upserted by normalized phone number, a seven-day registration session is
created, and an HTTP-only `brochure_registration` cookie stores only an opaque
session token. PostgreSQL stores only the SHA-256 token hash, never the raw
cookie token.

For the next seven days, the same browser may download brochures for any active
project without registering again. Every successful protected PDF request
creates a separate `DownloadEvent`, including repeated downloads. Reporting is
not implemented yet; future reporting should calculate totals from
`DownloadEvent`.

## Private Brochure Files

Brochure PDFs must stay outside `public/`. Configure their directory with:

```bash
BROCHURES_DIR="./storage/brochures"
```

Production deployments can use an absolute private path, for example:

```bash
BROCHURES_DIR="/srv/nabshy-pro/brochures"
```

Each project record maps `brochureFile` to a flat PDF filename inside that
directory, for example:

```text
project-5-brochure.pdf
```

Do not store absolute paths, directory names, `..`, or public URLs in
`brochureFile`. To add a brochure safely, copy the PDF into `BROCHURES_DIR` and
store only its filename on the matching `Project` row. The download route
validates the filename, resolves it inside the configured private directory, and
returns the file as an attachment only when the registration session is valid.

## Not Implemented Yet

Charts, CSV export, authentication accounts, passwords, OTP, email
verification, SMS verification, external storage, external APIs, and public
brochure URLs are intentionally not implemented in this phase.

## Admin Panel

Admin routes:

```text
/admin
/admin/login
/admin/projects
/admin/projects/new
/admin/projects/[id]/edit
/admin/journal
/admin/reports/downloads
/admin/reports/downloads/projects/[id]
/admin/reports/downloads/journal/[id]
/admin/reports/users
/admin/reports/users/[id]
```

Configure a single admin through environment variables:

```bash
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH=""
ADMIN_SESSION_SECRET=""
PROJECT_IMAGES_DIR="./storage/project-images"
PROJECT_BROCHURES_DIR="./storage/project-brochures"
GENERAL_JOURNAL_DIR="./storage/general-journal"
PROJECT_IMAGE_MAX_SIZE_MB="10"
PDF_MAX_SIZE_MB="50"
```

Generate a password hash locally:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('CHANGE_ME', 12).then(console.log)"
```

Admin login creates an HTTP-only `admin_session` cookie signed with
`ADMIN_SESSION_SECRET`. All admin pages and mutation Server Actions validate the
admin session server-side.

Project management supports creating, editing, activating/deactivating, numeric
sort order, and Move Up/Move Down order swaps. Active projects appear on public
project pages; inactive projects do not. Project images are stored in
`PROJECT_IMAGES_DIR` and served through a controlled route. Project brochures
stay private in `PROJECT_BROCHURES_DIR` and are only returned through protected
download routes.

The General Journal page replaces the active platform journal. Replacement keeps
historical journal records for reports, deactivates previous journals, stores
the new PDF in `GENERAL_JOURNAL_DIR`, and updates the Hero download target.

Download reports define total downloads as event row counts and unique users as
distinct user counts. User reports combine project brochure downloads and
general journal downloads; registration sessions are not counted as downloads.

Apply admin migrations with:

```bash
npx prisma migrate dev --name add_admin_journal_and_reports
npm run build
```

Back up PostgreSQL and the configured upload directories before production
migrations or bulk file changes.
