## My online portfolio

![Luis-J-Centeno-Full-Stack-Web-Developer](https://user-images.githubusercontent.com/5175137/159013022-5694e946-9f5a-4a62-8211-867529b3f3c2.png)

## Deployment hardening

- Static output is generated with Next.js export and served by Nginx in Docker.
- Custom Nginx rules live in `nginx/default.conf`.
- Common scanner probe paths like `.env`, `xmlrpc.php`, `wp-*`, and `*.php` return `404`.
- Dotfiles are blocked except `/.well-known/*`.
- Static routes support both `/path` and `/path/` URLs.

## Sitemap automation

- Sitemap and robots are generated automatically with `next-sitemap` during `bun run build`.
- Config lives in `next-sitemap.config.js` and outputs files directly into `out` for Docker/Nginx.
- Set `NEXT_PUBLIC_SITE_URL` to change the canonical domain if needed.
