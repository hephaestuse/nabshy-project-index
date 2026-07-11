# Nabshy Pro UI Prototype

Premium real-estate brochure website prototype built with Next.js App Router,
TypeScript, Tailwind CSS, ESLint, and local assets only.

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

Useful checks:

```bash
npm run lint
npm run build
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

## Edit Projects

Project data is read from:

```text
src/data/projects.json
```

The shared TypeScript shape is defined in:

```text
src/types/project.ts
```

## Mocked Functionality

Registration and download actions are frontend-only mocks. There is no backend,
database, authentication, persistence, analytics, tracking, API route, or real
file download in this phase.
