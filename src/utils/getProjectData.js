import { getProjectBySlug } from '../data'
import getProjectContent from './getProjectContent'

const getProjectData = async (slug) => {
    const project = getProjectBySlug(slug)
    const content = await getProjectContent(slug, project.content)

    return {
        project,
        content,
    }
}

export default getProjectData
