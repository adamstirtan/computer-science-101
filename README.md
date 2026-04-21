# computer-science-101

Markdown-driven curriculum framework built with Vue + Vite.

## What this includes

- Dynamic navigation generated from markdown files in `src/content`
- Frontmatter metadata support (`title`, `description`, `category`, optional `order`, optional `slug`)
- Category sidebar with nested page links
- Main content area that renders selected markdown as sanitized HTML
- Azure Static Web Apps SPA fallback config in `staticwebapp.config.json`

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Add pages

Create markdown files under `src/content/**` using the frontmatter contract documented in `src/content/README.md`.
