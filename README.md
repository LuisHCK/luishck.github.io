## My online portfolio

![Luis-J-Centeno-Full-Stack-Web-Developer](https://user-images.githubusercontent.com/5175137/159013022-5694e946-9f5a-4a62-8211-867529b3f3c2.png)

## Stack

- Astro (static output) with React components rendered at build time
- Bulma + SCSS
- Markdown project READMEs fetched during the build

## Development

```sh
bun install
bun run dev       # http://localhost:4321
bun run build     # static output in dist/
bun run preview   # preview the production build
```

## Deployment hardening

- Static output is generated with `astro build` and served by Nginx in Docker.
- Custom Nginx rules live in `nginx/default.conf`.
- Common scanner probe paths like `.env`, `xmlrpc.php`, `wp-*`, and `*.php` return `404`.
- Dotfiles are blocked except `/.well-known/*`.
- Hash-based assets in `/_astro/` are cached immutably; HTML is served with `no-cache`.
- Unknown routes return the custom `404.html` page.

## Sitemap automation

- Sitemap files are generated automatically by `@astrojs/sitemap` during `bun run build`.
- `robots.txt` is generated from `src/pages/robots.txt.ts` and points at `sitemap-index.xml`.
- Set `SITE_URL` to change the canonical domain if needed. The default is
  `https://luisjcenteno.dev`.
