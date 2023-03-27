import { ReactNode } from 'react'
import { marked } from 'marked'
import { markdownFetch } from '.'

/**
 * Fetch and parse markdown url to react component
 * @param {String} contentURL
 * @returns {Promise<string>}
 */
const getProjectContent = async (contentURL) => {
    const response = await markdownFetch(contentURL)
    const rawContent = await response.text() || ''
    const htmlContent = marked(rawContent)
    return htmlContent
}

export default getProjectContent
