import { marked } from 'marked'

const localReadmes = import.meta.glob('../data/readmes/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
})

/**
 * Parse a project README to HTML.
 * Local copies are used first so production builds are reproducible.
 * The remote URL remains the source for `bun run refresh:readmes`.
 *
 * @param {String} slug
 * @param {String} contentURL
 * @returns {Promise<string>}
 */
const getProjectContent = async (slug, contentURL) => {
    const localContent = localReadmes[`../data/readmes/${slug}.md`]

    if (localContent) {
        return marked.parse(localContent)
    }

    if (!contentURL) {
        throw new Error(`No markdown content configured for project "${slug}"`)
    }

    const response = await fetch(contentURL)

    if (!response.ok) {
        throw new Error(
            `Failed to fetch project content: ${contentURL} (${response.status})`
        )
    }

    return marked.parse(await response.text())
}

export default getProjectContent
