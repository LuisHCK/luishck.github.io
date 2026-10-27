import { marked } from 'marked'
import markdownFetch from './markdownFetch'

/**
 * Fetch and parse a markdown URL to HTML
 * @param {String} contentURL
 * @returns {Promise<string>}
 */
const getProjectContent = async (contentURL) => {
    const response = await markdownFetch(contentURL)

    if (!response.ok) {
        throw new Error(
            `Failed to fetch project content: ${contentURL} (${response.status})`
        )
    }

    return marked.parse(await response.text())
}

export default getProjectContent
