import { getProjectBySlug } from "../data"
import getProjectContent from "./getProjectContent"

const getProjectStaticProps = async (slug) => {
    const project = getProjectBySlug(slug)
    const content = await getProjectContent(project.content)

    return {
        props: {
            project,
            content
        }
    }
}

export default getProjectStaticProps