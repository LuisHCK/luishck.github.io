## My online portfolio

![Luis-J-Centeno-Full-Stack-Web-Developer](https://user-images.githubusercontent.com/5175137/159013022-5694e946-9f5a-4a62-8211-867529b3f3c2.png)

## Stack

- Astro static output with no client-side framework runtime
- Astro content collections for projects
- Bulma + SCSS
- Self-hosted Poppins fonts
- Optimized local images via `astro:assets`

## Development

```sh
bun install
bun run dev         # http://localhost:4321
bun run build       # static output in dist/
bun run preview     # preview the production build
bun run check       # Astro type/diagnostic check
bun run lint        # ESLint
bun run check:seo   # title/meta/canonical/JSON-LD/sitemap/link audit
bun run test:e2e    # Playwright smoke tests (builds and serves via Docker Compose)
```

## Project content

Each project lives in `src/content/projects/<slug>.md`. The frontmatter contains the card
metadata and the Markdown body is the project page:

```yaml
---
name: 'Project name'
description: 'Card description'
order: 1
stack: ['react']
cover: '../../assets/projects/project-cover.jpg'
links:
  - label: 'View on GitHub'
    url: 'https://github.com/...'
    target: '_blank'
    rel: 'noreferrer'
---
```

Covers live in `src/assets/projects/` and are validated/optimized by the content schema.

## Docker Compose

```sh
docker compose up --build -d   # http://localhost:8080
docker compose logs -f
docker compose down
```

The stack builds the Astro site and serves it with an unprivileged Nginx container on port
`8080`. Override the published host port or canonical site URL with environment variables:

```sh
PORT=3000 SITE_URL=https://staging.example.com docker compose up --build -d
```

## Deployment hardening

- Static output is generated with `astro build` and served by Nginx in Docker.
- Nginx runs as the unprivileged `nginx` user and listens on port `8080` inside the container.
- Base images are pinned by digest.
- The container filesystem is read-only, all Linux capabilities are dropped, and
  `no-new-privileges` is enabled.
- A Content Security Policy blocks inline scripts and restricts styles, fonts, images, and
  analytics connections.
- HSTS is emitted by the container; terminate TLS at the reverse proxy and ensure the proxy
  forwards HTTPS traffic.
- Custom Nginx rules live in `nginx/default.conf`.
- Common scanner probe paths like `.env`, `xmlrpc.php`, `wp-*`, and `*.php` return `404`.
- Dotfiles are blocked except `/.well-known/*`.
- Hash-based assets in `/_astro/` are cached immutably; HTML is served with `no-cache`.
- Unknown routes return the custom `404.html` page.

## CI and dependency updates

- `.github/workflows/ci.yml` runs checks, lint, build, the SEO audit, Docker build validation,
  and Playwright smoke tests on pushes and pull requests.
- `.github/dependabot.yml` keeps npm, Docker base images, and GitHub Actions current.

## Sitemap automation

- Sitemap files are generated automatically by `@astrojs/sitemap` during `bun run build`.
- `robots.txt` is generated from `src/pages/robots.txt.ts` and points at `sitemap-index.xml`.
- Set `SITE_URL` to change the canonical domain if needed. The default is
  `https://luisjcenteno.dev`.
