## My online portfolio

![Luis-J-Centeno-Full-Stack-Web-Developer](https://user-images.githubusercontent.com/5175137/159013022-5694e946-9f5a-4a62-8211-867529b3f3c2.png)

## Stack

- Astro static output with no client-side framework runtime
- Bulma + SCSS
- Project READMEs vendored locally for reproducible builds
- Optimized local images via `astro:assets`

## Development

```sh
bun install
bun run dev         # http://localhost:4321
bun run build       # static output in dist/
bun run preview     # preview the production build
bun run check       # Astro type/diagnostic check
bun run check:seo   # title/meta/canonical/sitemap/link audit
bun run refresh:readmes
```

## Project content

Project READMEs are downloaded into `src/data/readmes/` and rendered from the local copies.
This keeps Docker and CI builds independent of GitHub availability. To refresh them from the
URLs in `src/data/projects.json`:

```sh
bun run refresh:readmes
```

## Docker Compose

```sh
docker compose up --build -d   # http://localhost:8080
docker compose logs -f
docker compose down
```

The compose stack builds the Astro site and serves it with an unprivileged Nginx container on
port `8080`. Override the published host port or canonical site URL with environment variables:

```sh
PORT=3000 SITE_URL=https://staging.example.com docker compose up --build -d
```

## Deployment hardening

- Static output is generated with `astro build` and served by Nginx in Docker.
- Nginx runs as the unprivileged `nginx` user and listens on port `8080` inside the container.
- Base images are pinned by digest.
- Custom Nginx rules live in `nginx/default.conf`.
- A Content Security Policy restricts scripts, styles, fonts, images, and analytics connections.
- Common scanner probe paths like `.env`, `xmlrpc.php`, `wp-*`, and `*.php` return `404`.
- Dotfiles are blocked except `/.well-known/*`.
- Hash-based assets in `/_astro/` are cached immutably; HTML is served with `no-cache`.
- Unknown routes return the custom `404.html` page.

## Sitemap automation

- Sitemap files are generated automatically by `@astrojs/sitemap` during `bun run build`.
- `robots.txt` is generated from `src/pages/robots.txt.ts` and points at `sitemap-index.xml`.
- Set `SITE_URL` to change the canonical domain if needed. The default is
  `https://luisjcenteno.dev`.
