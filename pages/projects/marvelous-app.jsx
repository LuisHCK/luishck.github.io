import React from 'react'
import ProjectLayout from '../../layouts/project-layout'
import { getProjectStaticProps } from '../../utils'

const SLUG = 'marvelous-app'

const MarvelousProject = ({ project, content }) => {
    return (
        <ProjectLayout
            className="ProjectPage"
            project={project}
            content={content}
        />
    )
}

export const getStaticProps = () => getProjectStaticProps(SLUG)

export default MarvelousProject
