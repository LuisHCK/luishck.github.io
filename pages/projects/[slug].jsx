import ProjectLayout from '../../layouts/project-layout'
import { Projects } from '../../data'
import { getProjectStaticProps } from '../../utils'

const ProjectDetailPage = ({ project, content }) => {
    return (
        <ProjectLayout
            className="ProjectPage"
            project={project}
            content={content}
        />
    )
}

export const getStaticPaths = async () => {
    const paths = Projects
        .filter(({ slug }) => typeof slug === 'string' && slug.trim().length)
        .map(({ slug }) => ({ params: { slug } }))

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps = ({ params }) => getProjectStaticProps(params.slug)

export default ProjectDetailPage
