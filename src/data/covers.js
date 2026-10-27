import babyTracker from '../assets/projects/baby-tracker-banner.jpg'
import contractflow from '../assets/projects/contractflow-banner.webp'
import memoriasDeVida from '../assets/projects/memorias-de-vida-banner.jpg'

const covers = {
    'baby-tracker': babyTracker,
    contractflow,
    'memorias-de-vida': memoriasDeVida,
}

/**
 * Returns the optimized local cover for a project, if it has one.
 * Projects with remote covers fall back to the URL in projects.json.
 * @param {String} slug
 */
export const getProjectCover = (slug) => covers[slug] ?? null
