import React from 'react'
import parse from 'html-react-parser'
import NavBar from '../../components/navbar'
import SEO from '../../components/seo'
import { Profile } from '../../data'
import GithubButton from '../../components/github-button'

function ProjectLayout({ className, project, content }) {
    const githubLink = project.links?.find((link) => link.label === 'View on GitHub')?.url
    return (
        <main className={`MainLayout ${className}`}>
            <NavBar />
            <div className="container is-max-desktop p-5">
                <article className="box project">
                    <SEO
                        title={`${Profile.name} | ${project.name}`}
                        description={project.description}
                    />
                    {content && parse(content)}

                    {githubLink && (
                        <div className="m-4 has-text-centered">
                            <GithubButton url={githubLink} />
                        </div>
                    )}
                </article>
            </div>
        </main>
    )
}

export default ProjectLayout
