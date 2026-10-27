import { readFile, readdir } from 'node:fs/promises'
import { statSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const args = process.argv.slice(2)
const urlFlag = args.indexOf('--url')
const liveBase = urlFlag >= 0 ? args[urlFlag + 1]?.replace(/\/$/, '') : null
const distArg = urlFlag >= 0
    ? args.find((arg, index) => !arg.startsWith('--') && index !== urlFlag + 1)
    : args.find((arg) => !arg.startsWith('--'))
const distDir = path.resolve(root, distArg || 'dist')
const site = (process.env.SITE_URL || 'https://luisjcenteno.dev').replace(/\/$/, '')

const attr = (tag, name) => {
    const match = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i'))
    return match?.[1]
}

const getMeta = (html) => {
    const meta = {}
    for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
        const key = attr(tag, 'property') || attr(tag, 'name')
        if (key) meta[key] = attr(tag, 'content') || ''
    }
    return meta
}

const getCanonical = (html) => {
    for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
        if ((attr(tag, 'rel') || '').toLowerCase() === 'canonical') return attr(tag, 'href')
    }
    return null
}

const getLinks = (html) =>
    (html.match(/<a\b[^>]*>/gi) || [])
        .map((tag) => attr(tag, 'href'))
        .filter(Boolean)

const normalizePath = (value) => {
    const parsed = new URL(value, site)
    return decodeURIComponent(parsed.pathname)
}

const routeToFile = (route) => {
    const clean = route.replace(/\/+$/, '') || '/'
    const relative = clean.replace(/^\/+/, '')
    const candidates = relative
        ? [path.join(distDir, relative), path.join(distDir, `${relative}.html`), path.join(distDir, relative, 'index.html')]
        : [path.join(distDir, 'index.html')]

    return candidates.find((candidate) => {
        try {
            return statSync(candidate).isFile()
        } catch {
            return false
        }
    })
}

const walkHtml = async (dir) => {
    const entries = await readdir(dir, { withFileTypes: true })
    const files = []

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) files.push(...(await walkHtml(fullPath)))
        else if (entry.name.endsWith('.html')) files.push(fullPath)
    }

    return files
}

const auditHtml = (html, label) => {
    const issues = []
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim()
    const meta = getMeta(html)
    const canonical = getCanonical(html)
    const lang = html.match(/<html\b[^>]*lang="([^"]+)"/i)?.[1]

    if (!title) issues.push('missing <title>')
    if (!lang) issues.push('missing <html lang>')
    for (const key of ['description', 'og:title', 'og:description', 'og:image', 'twitter:card']) {
        if (!meta[key]) issues.push(`missing ${key}`)
    }

    if (!canonical) {
        issues.push('missing canonical')
    } else {
        const parsed = new URL(canonical, site)
        if (`${parsed.protocol}//${parsed.host}` !== new URL(site).origin) {
            issues.push(`canonical host is ${parsed.origin}, expected ${site}`)
        }
    }

    return { issues, meta, canonical, links: getLinks(html), title, label }
}

const checkLocal = async () => {
    const files = await walkHtml(distDir)
    const results = []
    const issues = []

    for (const file of files) {
        const html = await readFile(file, 'utf8')
        const result = auditHtml(html, path.relative(distDir, file))
        results.push(result)

        for (const issue of result.issues) issues.push(`${result.label}: ${issue}`)

        if (result.canonical) {
            const route = normalizePath(result.canonical)
            if (!routeToFile(route)) {
                issues.push(`${result.label}: canonical route ${route} has no output file`)
            }
        }

        for (const href of result.links) {
            if (/^(https?:|mailto:|tel:|#|data:)/i.test(href)) continue
            const route = normalizePath(href)
            if (route === '/sitemap.xml' || route === '/404') continue
            if (!routeToFile(route)) issues.push(`${result.label}: broken internal link ${href}`)
        }

        if (html.includes('/_next/')) issues.push(`${result.label}: contains a /_next/ reference`)
    }

    const sitemapPath = path.join(distDir, 'sitemap-0.xml')
    let sitemapCount = 0
    try {
        const sitemap = await readFile(sitemapPath, 'utf8')
        const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
        sitemapCount = locations.length
        for (const location of locations) {
            const route = normalizePath(location)
            if (!routeToFile(route)) issues.push(`sitemap: ${location} has no output file`)
        }
    } catch {
        issues.push('missing sitemap-0.xml')
    }

    try {
        const robots = await readFile(path.join(distDir, 'robots.txt'), 'utf8')
        if (!robots.includes(`${site}/sitemap-index.xml`)) {
            issues.push('robots.txt does not point at sitemap-index.xml')
        }
    } catch {
        issues.push('missing robots.txt')
    }

    return { results, issues, sitemapCount }
}

const checkLive = async () => {
    const indexUrl = `${liveBase}/sitemap-index.xml`
    const indexResponse = await fetch(indexUrl)
    if (!indexResponse.ok) throw new Error(`${indexUrl} returned ${indexResponse.status}`)

    const index = await indexResponse.text()
    const sitemapUrl = index.match(/<loc>([^<]+)<\/loc>/)?.[1]
    if (!sitemapUrl) throw new Error('No sitemap URL found in sitemap-index.xml')

    const sitemap = await (await fetch(sitemapUrl)).text()
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    const issues = []

    for (const url of urls) {
        const response = await fetch(url, { redirect: 'follow' })
        const html = await response.text()
        const result = auditHtml(html, url)

        if (!response.ok) issues.push(`${url}: HTTP ${response.status}`)
        for (const issue of result.issues) issues.push(`${url}: ${issue}`)

        if (result.canonical) {
            const expected = new URL(url)
            const actual = new URL(result.canonical)
            if (`${actual.origin}${actual.pathname.replace(/\/+$/, '')}` !== `${expected.origin}${expected.pathname.replace(/\/+$/, '')}`) {
                issues.push(`${url}: canonical is ${result.canonical}`)
            }
        }
    }

    return { count: urls.length, issues }
}

try {
    if (liveBase) {
        const { count, issues } = await checkLive()
        console.log(`Checked ${count} live pages from ${liveBase}`)
        if (issues.length) {
            console.error(issues.map((issue) => `✗ ${issue}`).join('\n'))
            process.exitCode = 1
        } else {
            console.log('✓ SEO checks passed')
        }
    } else {
        const { results, issues, sitemapCount } = await checkLocal()
        console.log(`Checked ${results.length} HTML pages and ${sitemapCount} sitemap URLs in ${distDir}`)
        if (issues.length) {
            console.error(issues.map((issue) => `✗ ${issue}`).join('\n'))
            process.exitCode = 1
        } else {
            console.log('✓ SEO checks passed')
        }
    }
} catch (error) {
    console.error(`✗ ${error.message}`)
    process.exitCode = 1
}
