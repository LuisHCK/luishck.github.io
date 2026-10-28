import { expect, test } from '@playwright/test'

const routes = [
    '/',
    '/projects',
    '/projects/adm2',
    '/projects/baby-tracker',
    '/projects/memorias-de-vida',
    '/projects/contractflow',
    '/projects/photo-print-tool',
    '/privacy',
]

const collectCspErrors = (page) => {
    const errors = []
    page.on('console', (message) => {
        if (
            message.type() === 'error' &&
            /content security policy|refused to/i.test(message.text())
        ) {
            errors.push(message.text())
        }
    })
    return errors
}

test.describe('pages and metadata', () => {
    for (const route of routes) {
        test(`${route} renders with SEO metadata`, async ({ page }) => {
            const cspErrors = collectCspErrors(page)
            const response = await page.goto(route, { waitUntil: 'domcontentloaded' })

            expect(response?.status()).toBe(200)
            await expect(page).toHaveTitle(/.+/)

            const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
            expect(canonical).toContain('https://luisjcenteno.dev')

            const description = await page
                .locator('meta[name="description"]')
                .getAttribute('content')
            expect(description?.trim().length).toBeGreaterThan(0)

            const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
            expect(ogImage).toMatch(/^https:\/\//)

            const structuredData = await page
                .locator('script[type="application/ld+json"]')
                .first()
                .textContent()
            expect(() => JSON.parse(structuredData ?? '')).not.toThrow()

            await page.waitForFunction(() => document.fonts.status === 'loaded')
            await page.waitForFunction(() =>
                [...document.images].every((image) => image.complete)
            )

            expect(cspErrors).toEqual([])
        })
    }
})

test('unknown route returns the custom 404 page', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(page).toHaveTitle(/Page not found/)
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
})

test('trailing slashes redirect to the canonical URL', async ({ request }) => {
    for (const route of ['/projects/', '/projects/adm2/', '/privacy/']) {
        const response = await request.get(route, { maxRedirects: 0 })
        expect(response.status()).toBe(301)
        expect(response.headers().location).not.toContain('/$')
    }
})

test('serves robots.txt and sitemap files', async ({ request }) => {
    const robots = await request.get('/robots.txt')
    expect(robots.status()).toBe(200)
    expect(await robots.text()).toContain('Sitemap: https://luisjcenteno.dev/sitemap-index.xml')

    const sitemap = await request.get('/sitemap-index.xml')
    expect(sitemap.status()).toBe(200)
    expect(await sitemap.text()).toContain('sitemap-0.xml')
})

test('project page renders README content and GitHub link', async ({ page }) => {
    await page.goto('/projects/adm2')
    await expect(page.getByRole('heading', { level: 1, name: 'ADM2' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Features' })).toBeVisible()
    await expect(page.getByRole('link', { name: /View in GitHub/ })).toBeVisible()
})

test('contact section links to LinkedIn', async ({ page }) => {
    await page.goto('/')
    const linkedin = page.getByRole('link', { name: 'LinkedIn profile' })
    await expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/luisjcenteno')
    await expect(linkedin).toHaveAttribute('target', '_blank')
})

test('active navigation and skip link are accessible', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.getByRole('link', { name: 'Projects' })).toHaveAttribute(
        'aria-current',
        'page'
    )

    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
})

test.describe('mobile navigation', () => {
    test.use({ viewport: { width: 390, height: 844 } })

    test('opens, closes with Escape, and restores focus', async ({ page }) => {
        await page.goto('/')

        const burger = page.getByRole('button', { name: 'menu' })
        const menu = page.locator('#navbarMenu')

        await expect(burger).toHaveAttribute('aria-expanded', 'false')
        await expect(menu).toBeHidden()

        await burger.click()
        await expect(burger).toHaveAttribute('aria-expanded', 'true')
        await expect(menu).toBeVisible()

        await page.keyboard.press('Escape')
        await expect(burger).toHaveAttribute('aria-expanded', 'false')
        await expect(menu).toBeHidden()
        await expect(burger).toBeFocused()
    })
})
