/**
 * Fetch markdown file as blob
 * @param {String} url Markdown file
 * @returns {Promise<Response>}
 */
const markdownFetch = (url) => {
    return fetch(url, { method: 'GET' })
}

export default markdownFetch
