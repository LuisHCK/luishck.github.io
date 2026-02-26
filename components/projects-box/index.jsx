import React from 'react'
import PropTypes from 'prop-types'
import ProjectCard from '../project-card'

function ProjectsBox({
    title,
    description,
    projects,
}) {

    const renderProjects = () =>
        projects.map((project, index) => (
            <div className="column is-half-desktop is-full-mobile" key={'project-' + index}>
                <ProjectCard
                    name={project.name}
                    description={project.description}
                    image={project.cover}
                    stack={project.stack}
                    links={project.links}
                />
            </div>
        ))

    return (
        <section className="box">
            <h3 className="is-size-3 has-text-weight-bold">{title}</h3>
            <p>{description}</p>

            <div className="columns is-mobile is-multiline mt-3">{renderProjects()}</div>
        </section>
    )
}

ProjectsBox.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    projects: PropTypes.array,
}


export default ProjectsBox
