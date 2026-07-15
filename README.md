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
set `DATABASE_URL` in `.env`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
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
npx prisma migrate dev --name update_project_bilingual_fields
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

## Mocked Functionality

Registration and download actions are frontend-only mocks. Registration
persistence, real protected downloads, reporting, authentication, analytics, and
download tracking are not implemented in this phase.
