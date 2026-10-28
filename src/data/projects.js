import { getCollection } from 'astro:content'

/**
 * Returns project entries sorted by their display order.
 * @returns {Promise<import('astro:content').CollectionEntry<'projects'>[]>}
 */
export const getProjects = async () => {
    const projects = await getCollection('projects')
    return projects.sort((a, b) => a.data.order - b.data.order)
}
