import { getProjectBySlug } from '../data'
import getProjectContent from './getProjectContent'

const getProjectData = async (slug) => {
    const project = getProjectBySlug(slug)

    if (!project.content) {
        throw new Error(`No markdown content configured for project "${slug}"`)
    }

    const content = await getProjectContent(project.content)

    return {
        project,
        content,
    }
}

export default getProjectData
