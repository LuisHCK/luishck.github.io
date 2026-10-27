import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
    site: process.env.SITE_URL ?? 'https://luisjcenteno.dev',
    trailingSlash: 'never',
    build: {
        format: 'directory',
    },
    integrations: [sitemap()],
})
