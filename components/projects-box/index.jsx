import React from 'react'
import PropTypes from 'prop-types'
import ProjectCard from '../project-card'

/**
 * Renders a boxed section containing a title, description, and a responsive grid of project cards.
 * Projects are sorted by their `order` value before rendering.
 *
 * @param {Object} props - Component props.
 * @param {string} props.title - Heading displayed at the top of the projects box.
 * @param {string} props.description - Supporting text shown below the title.
 * @param {Array<Object>} props.projects - List of project items to render.
 * @param {number} props.projects[].order - Sort priority (ascending) for display order.
 * @param {string} props.projects[].name - Project name.
 * @param {string} props.projects[].description - Project summary.
 * @param {string} props.projects[].cover - Cover image source/path.
 * @param {Array<string>} [props.projects[].stack] - Technologies used in the project.
 * @param {Array<Object>} [props.projects[].links] - External/internal links related to the project.
 * @returns {JSX.Element} A section element containing the projects list.
 */
function ProjectsBox({ title, description, projects }) {
    const renderProjects = () =>
        projects
            .sort((a, b) => a.order - b.order)
            .map((project, index) => (
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
