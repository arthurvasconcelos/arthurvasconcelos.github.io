# arthurvasconcelos.github.io

Personal website — [arthurvasconcelos.com.br](https://arthurvasconcelos.com.br)

Built with Nuxt 3 (compatibility v4), `@nuxt/ui`, Vue 3, and deployed to GitHub Pages.

**Trilingual**: en-GB (default), pt-BR, sv — powered by `@nuxtjs/i18n`.  
**Blog**: markdown posts under `content/<lang>/blog/` — powered by `@nuxt/content` v3.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

A floating **A11y** button (bottom-right) runs axe-core accessibility audits on the current page. Dev only — stripped from production builds.

## Blog posts

Drop a markdown file in `content/en-gb/blog/my-post.md` with this frontmatter:

```md
---
title: "Post title"
description: "Short description shown in the list."
date: 2026-01-01
translationKey: "my-post"   # optional — links translations across locales
---
```

pt-BR and sv translations go in `content/pt-br/blog/` and `content/sv/blog/` with the same `translationKey`.

## Build & preview

```bash
pnpm build      # server build (used by CI)
pnpm generate   # static output → .output/public
pnpm preview
```

## Checks

```bash
pnpm lint
pnpm typecheck
```

## Deployment

Pushes to `main` trigger the [deploy workflow](.github/workflows/deploy.yml) which builds and publishes to the `github-pages` environment.
